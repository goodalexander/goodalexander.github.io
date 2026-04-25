import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const DEFAULT_TELEMETRY_PATH = 'static/the-merge/telemetry.json';
const DEFAULT_USERNAME = 'goodalexander';

function readEnv(name) {
  const value = process.env[name];
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

function encodeForm(value) {
  return encodeURIComponent(value);
}

function percentEncode(value) {
  return encodeURIComponent(String(value))
    .replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}

function buildBasicAuth(apiKey, apiSecret) {
  const encodedKey = encodeForm(apiKey);
  const encodedSecret = encodeForm(apiSecret);
  return Buffer.from(`${encodedKey}:${encodedSecret}`).toString('base64');
}

function buildOAuth1AuthorizationHeader(method, url, {
  apiKey,
  apiSecret,
  accessToken,
  accessTokenSecret,
}) {
  const oauthParams = {
    oauth_consumer_key: apiKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: '1.0',
  };
  const signatureParams = [
    ...Array.from(url.searchParams.entries()),
    ...Object.entries(oauthParams),
  ];
  const normalizedParams = signatureParams
    .map(([key, value]) => [percentEncode(key), percentEncode(value)])
    .sort(([leftKey, leftValue], [rightKey, rightValue]) => (
      leftKey === rightKey ? leftValue.localeCompare(rightValue) : leftKey.localeCompare(rightKey)
    ))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  const normalizedUrl = `${url.origin}${url.pathname}`;
  const baseString = [
    method.toUpperCase(),
    percentEncode(normalizedUrl),
    percentEncode(normalizedParams),
  ].join('&');
  const signingKey = `${percentEncode(apiSecret)}&${percentEncode(accessTokenSecret)}`;
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(baseString)
    .digest('base64');
  return `OAuth ${Object.entries({ ...oauthParams, oauth_signature: signature })
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${percentEncode(key)}="${percentEncode(value)}"`)
    .join(', ')}`;
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const body = await response.text();
  let parsed = null;
  if (body) {
    try {
      parsed = JSON.parse(body);
    } catch {
      parsed = { raw: body.slice(0, 500) };
    }
  }
  if (!response.ok) {
    const message = parsed?.detail
      || parsed?.title
      || parsed?.errors?.[0]?.message
      || parsed?.error
      || `HTTP ${response.status}`;
    throw new Error(`X API request failed (${response.status}): ${message}`);
  }
  return parsed;
}

async function resolveBearerToken() {
  const directBearer = readEnv('X_BEARER_TOKEN') || readEnv('TWITTER_BEARER_TOKEN');
  if (directBearer) {
    return directBearer;
  }

  const apiKey = readEnv('X_API_KEY') || readEnv('TWITTER_API_KEY');
  const apiSecret = readEnv('X_API_SECRET') || readEnv('TWITTER_API_SECRET');
  if (!apiKey || !apiSecret) {
    throw new Error(
      'Missing X credentials. Set X_BEARER_TOKEN, or set X_API_KEY and X_API_SECRET from the app API Key/Secret.'
    );
  }

  const tokenPayload = await fetchJson('https://api.x.com/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${buildBasicAuth(apiKey, apiSecret)}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: 'grant_type=client_credentials',
  });

  if (tokenPayload?.token_type !== 'bearer' || !tokenPayload?.access_token) {
    throw new Error('X token response did not include an app-only bearer token.');
  }
  return tokenPayload.access_token;
}

async function buildXAuthorizationHeader(method, url) {
  const apiKey = readEnv('X_API_KEY') || readEnv('TWITTER_API_KEY');
  const apiSecret = readEnv('X_API_SECRET') || readEnv('TWITTER_API_SECRET');
  const accessToken = readEnv('X_ACCESS_TOKEN') || readEnv('TWITTER_ACCESS_TOKEN');
  const accessTokenSecret = readEnv('X_ACCESS_TOKEN_SECRET')
    || readEnv('X_ACCESS_SECRET')
    || readEnv('TWITTER_ACCESS_TOKEN_SECRET');

  if (accessToken || accessTokenSecret) {
    if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
      throw new Error(
        'OAuth1 X auth needs X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, and X_ACCESS_TOKEN_SECRET.'
      );
    }
    return buildOAuth1AuthorizationHeader(method, url, {
      apiKey,
      apiSecret,
      accessToken,
      accessTokenSecret,
    });
  }

  return `Bearer ${await resolveBearerToken()}`;
}

async function fetchXProfile(username) {
  const mockResponse = readEnv('THE_MERGE_X_MOCK_RESPONSE');
  if (mockResponse) {
    return JSON.parse(mockResponse);
  }

  const url = new URL(`https://api.x.com/2/users/by/username/${encodeURIComponent(username)}`);
  url.searchParams.set('user.fields', 'created_at,public_metrics,verified,verified_type');
  const authorization = await buildXAuthorizationHeader('GET', url);
  return fetchJson(url, {
    headers: {
      Authorization: authorization,
    },
  });
}

function requireFiniteMetric(value, label) {
  if (!Number.isFinite(value)) {
    throw new Error(`X profile response missing numeric ${label}.`);
  }
  return value;
}

function stableStringify(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function upsertLatestSeriesFollowerCount(telemetry, followersCount) {
  if (!Array.isArray(telemetry.series) || telemetry.series.length === 0) {
    return;
  }
  telemetry.series[telemetry.series.length - 1].x_followers = followersCount;
}

async function main() {
  const telemetryPath = path.resolve(readEnv('THE_MERGE_TELEMETRY_PATH') || DEFAULT_TELEMETRY_PATH);
  const username = readEnv('X_USERNAME') || readEnv('THE_MERGE_X_USERNAME') || DEFAULT_USERNAME;
  const rawTelemetry = await fs.readFile(telemetryPath, 'utf8');
  const telemetry = JSON.parse(rawTelemetry);
  const profile = await fetchXProfile(username);
  const data = profile?.data || {};
  const publicMetrics = data.public_metrics || {};
  const followersCount = requireFiniteMetric(publicMetrics.followers_count, 'followers_count');
  const followingCount = Number.isFinite(publicMetrics.following_count) ? publicMetrics.following_count : null;
  const postsCount = Number.isFinite(publicMetrics.tweet_count) ? publicMetrics.tweet_count : null;
  const fetchedAt = new Date().toISOString();

  telemetry.generated_at = fetchedAt;
  telemetry.metrics = telemetry.metrics || {};
  telemetry.metrics.x_followers = followersCount;
  telemetry.x_profile = {
    source: 'x_api_v2_users_by_username',
    username: data.username || username,
    user_id: data.id || null,
    fetched_at: fetchedAt,
    followers_count: followersCount,
    following_count: followingCount,
    posts_count: postsCount,
    verified: typeof data.verified === 'boolean' ? data.verified : null,
    verified_type: data.verified_type || null,
    account_created_at: data.created_at || null,
  };
  telemetry.notes = telemetry.notes || {};
  telemetry.notes.x_followers = `Official X API v2 user lookup for @${username}; public_metrics.followers_count fetched at ${fetchedAt}.`;
  upsertLatestSeriesFollowerCount(telemetry, followersCount);

  const nextTelemetry = stableStringify(telemetry);
  if (nextTelemetry !== rawTelemetry) {
    await fs.writeFile(telemetryPath, nextTelemetry, 'utf8');
  }

  console.log(JSON.stringify({
    username,
    followers_count: followersCount,
    following_count: followingCount,
    posts_count: postsCount,
    fetched_at: fetchedAt,
    telemetry_path: telemetryPath,
  }));
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
