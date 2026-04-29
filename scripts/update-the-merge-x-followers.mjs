import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const DEFAULT_TELEMETRY_PATH = 'static/the-merge/telemetry.json';
const DEFAULT_HISTORY_FILENAME = 'telemetry-history.json';
const DEFAULT_USERNAME = 'goodalexander';
const DEFAULT_WALLET_ADDRESS = 'rPo8GkCA9YMKzuJGTHbj11kdVfPqSJHxNx';
const DEFAULT_TASKNODE_METRICS_URL = 'https://tasknode.postfiat.org/api/public/merge-telemetry';
const DEFAULT_HISTORY_RETENTION_DAYS = 365;
const DEFAULT_TELEMETRY_SERIES_DAYS = 90;

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
    throw new Error(`HTTP request failed (${response.status}): ${message}`);
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

async function fetchTaskNodeTelemetry({ walletAddress, endpoint }) {
  const mockResponse = readEnv('THE_MERGE_TASKNODE_MOCK_RESPONSE');
  if (mockResponse) {
    return JSON.parse(mockResponse);
  }
  if (!walletAddress || !endpoint) {
    return null;
  }
  const url = new URL(endpoint);
  url.searchParams.set('wallet', walletAddress);
  return fetchJson(url);
}

function requireFiniteMetric(value, label) {
  if (!Number.isFinite(value)) {
    throw new Error(`X profile response missing numeric ${label}.`);
  }
  return value;
}

function toFiniteNumberOrNull(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizePublicImageUrl(value) {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith('data:')) {
    return null;
  }
  if (trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }
  return null;
}

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(String(value || ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function dateKey(value) {
  const parsed = value ? new Date(value) : new Date();
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return parsed.toISOString().slice(0, 10);
}

function stableStringify(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function normalizeSeriesRow(row, fallbackUpdatedAt) {
  return {
    date: row.date,
    updated_at: row.updated_at || fallbackUpdatedAt || undefined,
    dau: toFiniteNumberOrNull(row.dau),
    x_followers: toFiniteNumberOrNull(row.x_followers),
    x_following: toFiniteNumberOrNull(row.x_following),
    x_posts: toFiniteNumberOrNull(row.x_posts),
    loc: toFiniteNumberOrNull(row.loc),
    commits: toFiniteNumberOrNull(row.commits),
    task_requests: toFiniteNumberOrNull(row.task_requests),
    task_verifications: toFiniteNumberOrNull(row.task_verifications),
    task_updates: toFiniteNumberOrNull(row.task_updates),
    tasks_completed: toFiniteNumberOrNull(row.tasks_completed),
    rewards: toFiniteNumberOrNull(row.rewards),
    pft_rewards: toFiniteNumberOrNull(row.pft_rewards),
    context_updates: toFiniteNumberOrNull(row.context_updates),
    wallet_interactions: toFiniteNumberOrNull(row.wallet_interactions),
    github_private_commits: toFiniteNumberOrNull(row.github_private_commits),
    github_private_loc: toFiniteNumberOrNull(row.github_private_loc),
    github_private_additions: toFiniteNumberOrNull(row.github_private_additions),
    github_private_deletions: toFiniteNumberOrNull(row.github_private_deletions),
    sources: row.sources && typeof row.sources === 'object' ? row.sources : undefined,
  };
}

function compactSnapshot(snapshot) {
  return Object.fromEntries(
    Object.entries(snapshot).filter(([_key, value]) => value !== undefined)
  );
}

function seedHistoryFromTelemetry(telemetry, fetchedAt, retentionDays) {
  const snapshots = (Array.isArray(telemetry.series) ? telemetry.series : [])
    .filter((row) => row && row.date)
    .map((row) => compactSnapshot(normalizeSeriesRow(row, null)));
  return {
    schema_version: 1,
    generated_at: fetchedAt,
    retention_days: retentionDays,
    snapshots,
  };
}

async function loadHistory(historyPath, telemetry, fetchedAt, retentionDays) {
  try {
    const rawHistory = await fs.readFile(historyPath, 'utf8');
    const parsed = JSON.parse(rawHistory);
    if (Array.isArray(parsed?.snapshots)) {
      return {
        schema_version: 1,
        generated_at: parsed.generated_at || fetchedAt,
        retention_days: toFiniteNumberOrNull(parsed.retention_days) || retentionDays,
        snapshots: parsed.snapshots
          .filter((row) => row && row.date)
          .map((row) => compactSnapshot(normalizeSeriesRow(row, row.updated_at || parsed.generated_at || fetchedAt))),
      };
    }
  } catch (err) {
    if (err?.code !== 'ENOENT') {
      throw err;
    }
  }
  return seedHistoryFromTelemetry(telemetry, fetchedAt, retentionDays);
}

function buildCurrentSnapshot({
  telemetry,
  fetchedAt,
  followersCount,
  followingCount,
  postsCount,
  xFollowersSource,
}) {
  const metrics = telemetry.metrics || {};
  const privateGithub = telemetry.private_github || {};
  const sources = {
    current_metrics: 'telemetry_snapshot',
    github_private: 'redacted_private_github_snapshot',
  };
  if (followersCount !== null) {
    sources.x_followers = xFollowersSource || 'x_api_v2_users_by_username';
  }
  return compactSnapshot({
    date: dateKey(fetchedAt),
    updated_at: fetchedAt,
    dau: toFiniteNumberOrNull(metrics.tasknode_dau),
    x_followers: followersCount,
    x_following: followingCount,
    x_posts: postsCount,
    loc: toFiniteNumberOrNull(metrics.loc_today),
    commits: toFiniteNumberOrNull(metrics.commits_today),
    task_requests: toFiniteNumberOrNull(metrics.task_requests_24h),
    task_verifications: toFiniteNumberOrNull(metrics.task_verifications_24h),
    task_updates: toFiniteNumberOrNull(metrics.task_updates_24h),
    tasks_completed: toFiniteNumberOrNull(metrics.tasks_completed_24h),
    rewards: toFiniteNumberOrNull(metrics.rewards_delivered_24h),
    pft_rewards: toFiniteNumberOrNull(metrics.pft_rewards_24h),
    context_updates: toFiniteNumberOrNull(metrics.context_updates_24h),
    wallet_interactions: toFiniteNumberOrNull(metrics.wallet_interactions_24h),
    github_private_commits: toFiniteNumberOrNull(privateGithub.private_commits_today),
    github_private_loc: toFiniteNumberOrNull(privateGithub.private_loc_today),
    github_private_additions: toFiniteNumberOrNull(privateGithub.private_additions_today),
    github_private_deletions: toFiniteNumberOrNull(privateGithub.private_deletions_today),
    sources,
  });
}

function mergeTaskNodeTelemetry(telemetry, taskNodeTelemetry) {
  if (!taskNodeTelemetry || typeof taskNodeTelemetry !== 'object') {
    return;
  }
  const metrics = taskNodeTelemetry.metrics && typeof taskNodeTelemetry.metrics === 'object'
    ? taskNodeTelemetry.metrics
    : {};
  const allowedMetricKeys = [
    'tasknode_dau',
    'task_requests_24h',
    'task_verifications_24h',
    'task_updates_24h',
    'tasks_completed_24h',
    'rewards_delivered_24h',
    'pft_rewards_24h',
    'context_updates_24h',
    'wallet_interactions_24h',
    'tasks_verified_all_time',
    'rewards_paid_all_time',
  ];
  telemetry.metrics = telemetry.metrics || {};
  for (const key of allowedMetricKeys) {
    const value = toFiniteNumberOrNull(metrics[key]);
    if (value !== null) {
      telemetry.metrics[key] = value;
    }
  }
  const taskNodeProfile = taskNodeTelemetry.profile && typeof taskNodeTelemetry.profile === 'object'
    ? taskNodeTelemetry.profile
    : {};
  const nftImage = normalizePublicImageUrl(taskNodeProfile.nft_image || taskNodeProfile.nft_image_url);
  if (nftImage) {
    telemetry.profile = telemetry.profile || {};
    telemetry.profile.nft_image = nftImage;
    const nftThumbnail = normalizePublicImageUrl(taskNodeProfile.nft_thumbnail || taskNodeProfile.nft_thumbnail_url);
    if (nftThumbnail) {
      telemetry.profile.nft_thumbnail = nftThumbnail;
    }
    if (typeof taskNodeProfile.nft_display_name === 'string' && taskNodeProfile.nft_display_name.trim()) {
      telemetry.profile.nft_display_name = taskNodeProfile.nft_display_name.trim();
    }
    if (typeof taskNodeProfile.nft_source === 'string' && taskNodeProfile.nft_source.trim()) {
      telemetry.profile.nft_source = taskNodeProfile.nft_source.trim();
    }
    telemetry.profile.nft_synced_at = taskNodeTelemetry.generated_at || new Date().toISOString();
  }
  telemetry.tasknode_telemetry = {
    source: 'tasknode_public_merge_telemetry',
    fetched_at: taskNodeTelemetry.generated_at || new Date().toISOString(),
    wallet_address: taskNodeTelemetry.wallet_address || null,
  };
  telemetry.notes = telemetry.notes || {};
  telemetry.notes.tasknode_public = (
    'Task Node task, reward, context, wallet, DAU, and profile NFT metrics are fetched from '
    + 'the public redacted /api/public/merge-telemetry endpoint before history snapshots are written.'
  );
  telemetry.notes.contract = (
    'The scheduled GitHub Action refreshes X metrics and public redacted Task Node telemetry/profile NFT data, '
    + 'then publishes this static JSON for the dashboard.'
  );
}

function mergeSnapshots(existing, incoming) {
  const merged = { ...(existing || {}) };
  Object.entries(incoming).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }
    if (key === 'sources' && typeof value === 'object') {
      merged.sources = { ...(merged.sources || {}), ...value };
      return;
    }
    merged[key] = value;
  });
  return merged;
}

function upsertHistorySnapshot(history, snapshot, retentionDays, fetchedAt) {
  const snapshotsByDate = new Map();
  (Array.isArray(history.snapshots) ? history.snapshots : []).forEach((row) => {
    if (!row?.date) {
      return;
    }
    snapshotsByDate.set(row.date, row);
  });
  snapshotsByDate.set(
    snapshot.date,
    compactSnapshot(mergeSnapshots(snapshotsByDate.get(snapshot.date), snapshot))
  );

  const cutoffMs = Date.parse(`${snapshot.date}T00:00:00.000Z`) - ((retentionDays - 1) * 24 * 60 * 60 * 1000);
  const snapshots = Array.from(snapshotsByDate.values())
    .filter((row) => {
      const rowMs = Date.parse(`${row.date}T00:00:00.000Z`);
      return Number.isFinite(rowMs) && rowMs >= cutoffMs;
    })
    .sort((left, right) => String(left.date).localeCompare(String(right.date)));

  return {
    schema_version: 1,
    generated_at: fetchedAt,
    retention_days: retentionDays,
    snapshots,
  };
}

function buildTelemetrySeries(history, maxDays) {
  return (Array.isArray(history.snapshots) ? history.snapshots : [])
    .filter((row) => row && row.date)
    .slice(-maxDays)
    .map((row) => compactSnapshot({
      date: row.date,
      dau: toFiniteNumberOrNull(row.dau),
      x_followers: toFiniteNumberOrNull(row.x_followers),
      loc: toFiniteNumberOrNull(row.loc),
      commits: toFiniteNumberOrNull(row.commits),
      task_requests: toFiniteNumberOrNull(row.task_requests),
      task_verifications: toFiniteNumberOrNull(row.task_verifications),
      task_updates: toFiniteNumberOrNull(row.task_updates),
      tasks_completed: toFiniteNumberOrNull(row.tasks_completed),
      rewards: toFiniteNumberOrNull(row.rewards),
      pft_rewards: toFiniteNumberOrNull(row.pft_rewards),
      context_updates: toFiniteNumberOrNull(row.context_updates),
      wallet_interactions: toFiniteNumberOrNull(row.wallet_interactions),
      github_private_commits: toFiniteNumberOrNull(row.github_private_commits),
      github_private_loc: toFiniteNumberOrNull(row.github_private_loc),
      github_private_additions: toFiniteNumberOrNull(row.github_private_additions),
      github_private_deletions: toFiniteNumberOrNull(row.github_private_deletions),
    }));
}

async function main() {
  const telemetryPath = path.resolve(readEnv('THE_MERGE_TELEMETRY_PATH') || DEFAULT_TELEMETRY_PATH);
  const historyPath = path.resolve(
    readEnv('THE_MERGE_HISTORY_PATH') || path.join(path.dirname(telemetryPath), DEFAULT_HISTORY_FILENAME)
  );
  const retentionDays = parsePositiveInteger(readEnv('THE_MERGE_HISTORY_RETENTION_DAYS'), DEFAULT_HISTORY_RETENTION_DAYS);
  const telemetrySeriesDays = parsePositiveInteger(readEnv('THE_MERGE_TELEMETRY_SERIES_DAYS'), DEFAULT_TELEMETRY_SERIES_DAYS);
  const username = readEnv('X_USERNAME') || readEnv('THE_MERGE_X_USERNAME') || DEFAULT_USERNAME;
  const walletAddress = readEnv('THE_MERGE_WALLET_ADDRESS') || DEFAULT_WALLET_ADDRESS;
  const taskNodeMetricsUrl = readEnv('THE_MERGE_TASKNODE_METRICS_URL') || DEFAULT_TASKNODE_METRICS_URL;
  const rawTelemetry = await fs.readFile(telemetryPath, 'utf8');
  const telemetry = JSON.parse(rawTelemetry);
  const [profile, taskNodeTelemetry] = await Promise.all([
    fetchXProfile(username).catch((err) => {
      console.warn(`X profile refresh failed: ${err.message}`);
      return null;
    }),
    fetchTaskNodeTelemetry({ walletAddress, endpoint: taskNodeMetricsUrl }).catch((err) => {
      console.warn(`Task Node telemetry refresh failed: ${err.message}`);
      return null;
    }),
  ]);
  const fetchedAt = new Date().toISOString();

  telemetry.generated_at = fetchedAt;
  telemetry.metrics = telemetry.metrics || {};
  telemetry.notes = telemetry.notes || {};
  telemetry.notes.history = `Daily telemetry snapshots are retained in /the-merge/${DEFAULT_HISTORY_FILENAME}; telemetry.series is derived from that cache.`;

  const data = profile?.data || null;
  const publicMetrics = data?.public_metrics || {};
  let followersCount = toFiniteNumberOrNull(telemetry.metrics.x_followers);
  let followingCount = toFiniteNumberOrNull(telemetry.x_profile?.following_count);
  let postsCount = toFiniteNumberOrNull(telemetry.x_profile?.posts_count);
  let xFollowersSource = 'retained_last_successful_x_snapshot';
  if (data) {
    followersCount = requireFiniteMetric(publicMetrics.followers_count, 'followers_count');
    followingCount = Number.isFinite(publicMetrics.following_count) ? publicMetrics.following_count : null;
    postsCount = Number.isFinite(publicMetrics.tweet_count) ? publicMetrics.tweet_count : null;
    xFollowersSource = 'x_api_v2_users_by_username';
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
    telemetry.notes.x_followers = `Official X API v2 user lookup for @${username}; public_metrics.followers_count fetched at ${fetchedAt}.`;
    delete telemetry.notes.x_followers_refresh_error;
  } else {
    telemetry.notes.x_followers_refresh_error = (
      `X profile refresh failed at ${fetchedAt}; retaining the last successful X metrics until credentials recover.`
    );
    if (followersCount !== null) {
      telemetry.metrics.x_followers = followersCount;
    }
  }
  mergeTaskNodeTelemetry(telemetry, taskNodeTelemetry);

  const currentSnapshot = buildCurrentSnapshot({
    telemetry,
    fetchedAt,
    followersCount,
    followingCount,
    postsCount,
    xFollowersSource,
  });
  const loadedHistory = await loadHistory(historyPath, telemetry, fetchedAt, retentionDays);
  const history = upsertHistorySnapshot(loadedHistory, currentSnapshot, retentionDays, fetchedAt);
  telemetry.series = buildTelemetrySeries(history, telemetrySeriesDays);
  telemetry.history = {
    source: `/the-merge/${DEFAULT_HISTORY_FILENAME}`,
    generated_at: history.generated_at,
    retention_days: history.retention_days,
    snapshots: history.snapshots.length,
    current_date: currentSnapshot.date,
  };

  const nextTelemetry = stableStringify(telemetry);
  const nextHistory = stableStringify(history);
  await fs.mkdir(path.dirname(historyPath), { recursive: true });
  if (nextTelemetry !== rawTelemetry) {
    await fs.writeFile(telemetryPath, nextTelemetry, 'utf8');
  }
  let rawHistory = null;
  try {
    rawHistory = await fs.readFile(historyPath, 'utf8');
  } catch (err) {
    if (err?.code !== 'ENOENT') {
      throw err;
    }
  }
  if (nextHistory !== rawHistory) {
    await fs.writeFile(historyPath, nextHistory, 'utf8');
  }

  console.log(JSON.stringify({
    username,
    followers_count: followersCount,
    following_count: followingCount,
    posts_count: postsCount,
    tasknode_metrics_source: telemetry.tasknode_telemetry?.source || null,
    nft_image_source: telemetry.profile?.nft_source || null,
    fetched_at: fetchedAt,
    telemetry_path: telemetryPath,
    history_path: historyPath,
    history_snapshots: history.snapshots.length,
  }));
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
