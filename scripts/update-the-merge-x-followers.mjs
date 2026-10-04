import fs from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const DEFAULT_TELEMETRY_PATH = 'static/the-merge/telemetry.json';
const DEFAULT_HISTORY_FILENAME = 'telemetry-history.json';
const DEFAULT_USERNAME = 'goodalexander';
const DEFAULT_WALLET_ADDRESS = 'rPo8GkCA9YMKzuJGTHbj11kdVfPqSJHxNx';
const DEFAULT_TASKNODE_METRICS_URL = 'https://tasknode.postfiat.org/api/public/merge-telemetry';
const DEFAULT_HISTORY_RETENTION_DAYS = 365;
const DEFAULT_TELEMETRY_SERIES_DAYS = 90;
const MAX_REASONABLE_COUNTER = 1_000_000_000_000;
const SNAPSHOT_NUMERIC_FIELDS = [
  'dau',
  'x_followers',
  'x_following',
  'x_posts',
  'loc',
  'commits',
  'task_requests',
  'task_verifications',
  'task_updates',
  'tasks_completed',
  'rewards',
  'pft_rewards',
  'context_updates',
  'wallet_interactions',
  'github_private_commits',
  'github_private_loc',
  'github_private_additions',
  'github_private_deletions',
  'github_public_commits',
  'github_public_loc',
  'github_public_additions',
  'github_public_deletions',
  'github_total_commits',
  'github_total_loc',
  'github_total_additions',
  'github_total_deletions',
  'local_workspace_files',
  'local_workspace_repos',
  'local_workspace_loc',
  'local_workspace_additions',
  'local_workspace_deletions',
];

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
  let parseError = null;
  if (body) {
    try {
      parsed = JSON.parse(body);
    } catch (err) {
      parseError = err;
    }
  }
  if (!response.ok) {
    const message = parsed
      ? (parsed.detail
        || parsed.title
        || parsed.errors?.[0]?.message
        || parsed.error)
      : body.slice(0, 500)
      || `HTTP ${response.status}`;
    throw new Error(`HTTP request failed (${response.status}): ${message}`);
  }
  if (parseError) {
    throw new Error(`Invalid JSON response from ${url}: ${parseError.message}`);
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
    try {
      return JSON.parse(mockResponse);
    } catch (err) {
      throw new Error(`Invalid THE_MERGE_X_MOCK_RESPONSE JSON: ${err.message}`);
    }
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
    try {
      return JSON.parse(mockResponse);
    } catch (err) {
      throw new Error(`Invalid THE_MERGE_TASKNODE_MOCK_RESPONSE JSON: ${err.message}`);
    }
  }
  if (!walletAddress || !endpoint) {
    return null;
  }
  const url = new URL(endpoint);
  url.searchParams.set('wallet', walletAddress);
  return fetchJson(url);
}

function requireFiniteMetric(value, label) {
  const parsed = Number(value);
  if (
    !Number.isFinite(parsed)
    || parsed < 0
    || parsed > MAX_REASONABLE_COUNTER
  ) {
    throw new Error(`X profile response missing sane numeric ${label}.`);
  }
  return parsed;
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

function timestampMs(value) {
  const parsed = value ? new Date(value) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed.getTime() : null;
}

function isFreshTimestamp(value, referenceValue, maxHours) {
  const timestamp = timestampMs(value);
  const reference = timestampMs(referenceValue) || Date.now();
  if (timestamp === null) {
    return false;
  }
  const maxAgeMs = maxHours * 60 * 60 * 1000;
  return timestamp <= reference + (5 * 60 * 1000) && reference - timestamp <= maxAgeMs;
}

function stableStringify(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function requireRecord(value, label) {
  if (!isRecord(value)) {
    throw new Error(`${label} must be an object.`);
  }
  return value;
}

function requireIsoTimestamp(value, label) {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) {
    throw new Error(`${label} must be an ISO timestamp.`);
  }
}

function requireDateKey(value, label) {
  if (
    typeof value !== 'string'
    || !/^\d{4}-\d{2}-\d{2}$/.test(value)
    || Number.isNaN(Date.parse(`${value}T00:00:00.000Z`))
  ) {
    throw new Error(`${label} must be a YYYY-MM-DD date.`);
  }
}

function validateOptionalCounter(value, label) {
  if (value === null || value === undefined) {
    return;
  }
  if (
    typeof value !== 'number'
    || !Number.isFinite(value)
    || value < 0
    || value > MAX_REASONABLE_COUNTER
  ) {
    throw new Error(`${label} must be a non-negative finite number.`);
  }
}

function validateSnapshotRow(row, label) {
  requireRecord(row, label);
  requireDateKey(row.date, `${label}.date`);
  if (row.updated_at !== undefined) {
    requireIsoTimestamp(row.updated_at, `${label}.updated_at`);
  }
  for (const field of SNAPSHOT_NUMERIC_FIELDS) {
    validateOptionalCounter(row[field], `${label}.${field}`);
  }
  if (row.sources !== undefined) {
    requireRecord(row.sources, `${label}.sources`);
  }
}

function validateTelemetryDocument(telemetry, label = 'telemetry') {
  requireRecord(telemetry, label);
  requireIsoTimestamp(telemetry.generated_at, `${label}.generated_at`);
  requireRecord(telemetry.metrics, `${label}.metrics`);
  validateOptionalCounter(telemetry.metrics.x_followers, `${label}.metrics.x_followers`);
  if (telemetry.x_profile !== undefined) {
    requireRecord(telemetry.x_profile, `${label}.x_profile`);
    validateOptionalCounter(telemetry.x_profile.followers_count, `${label}.x_profile.followers_count`);
    validateOptionalCounter(telemetry.x_profile.following_count, `${label}.x_profile.following_count`);
    validateOptionalCounter(telemetry.x_profile.posts_count, `${label}.x_profile.posts_count`);
    if (telemetry.x_profile.fetched_at !== undefined) {
      requireIsoTimestamp(telemetry.x_profile.fetched_at, `${label}.x_profile.fetched_at`);
    }
  }
  if (!Array.isArray(telemetry.series)) {
    throw new Error(`${label}.series must be an array.`);
  }
  telemetry.series.forEach((row, index) => validateSnapshotRow(row, `${label}.series[${index}]`));
  const history = requireRecord(telemetry.history, `${label}.history`);
  if (typeof history.source !== 'string' || !history.source.trim()) {
    throw new Error(`${label}.history.source must be a non-empty string.`);
  }
  requireIsoTimestamp(history.generated_at, `${label}.history.generated_at`);
  validateOptionalCounter(history.retention_days, `${label}.history.retention_days`);
  validateOptionalCounter(history.snapshots, `${label}.history.snapshots`);
  requireDateKey(history.current_date, `${label}.history.current_date`);
}

function validateHistoryDocument(history, label = 'history') {
  requireRecord(history, label);
  if (history.schema_version !== 1) {
    throw new Error(`${label}.schema_version must be 1.`);
  }
  requireIsoTimestamp(history.generated_at, `${label}.generated_at`);
  validateOptionalCounter(history.retention_days, `${label}.retention_days`);
  if (!Array.isArray(history.snapshots)) {
    throw new Error(`${label}.snapshots must be an array.`);
  }
  const seenDates = new Set();
  history.snapshots.forEach((row, index) => {
    validateSnapshotRow(row, `${label}.snapshots[${index}]`);
    if (seenDates.has(row.date)) {
      throw new Error(`${label}.snapshots contains duplicate date ${row.date}.`);
    }
    seenDates.add(row.date);
  });
}

function parseAndValidateJsonDocument(contents, label, validator) {
  let parsed;
  try {
    parsed = JSON.parse(contents);
  } catch (err) {
    throw new Error(`${label} is not valid JSON: ${err.message}`);
  }
  validator(parsed, label);
  return parsed;
}

function validateXProfilePayload(profile, username) {
  const payload = requireRecord(profile, 'X profile response');
  const data = requireRecord(payload.data, 'X profile response data');
  const metrics = requireRecord(data.public_metrics, 'X profile public_metrics');
  requireFiniteMetric(metrics.followers_count, 'followers_count');
  requireFiniteMetric(metrics.following_count, 'following_count');
  requireFiniteMetric(metrics.tweet_count, 'tweet_count');
  if (data.username !== undefined && typeof data.username !== 'string') {
    throw new Error('X profile username must be a string when present.');
  }
  if (!data.username && !username) {
    throw new Error('X profile response missing username.');
  }
  return data;
}

function validateTaskNodeTelemetryPayload(taskNodeTelemetry) {
  const payload = requireRecord(taskNodeTelemetry, 'Task Node telemetry response');
  const metrics = requireRecord(payload.metrics, 'Task Node telemetry metrics');
  for (const [key, value] of Object.entries(metrics)) {
    validateOptionalCounter(
      toFiniteNumberOrNull(value),
      `Task Node telemetry metrics.${key}`
    );
  }
  if (payload.generated_at !== undefined) {
    requireIsoTimestamp(payload.generated_at, 'Task Node telemetry generated_at');
  }
  if (payload.wallet_address !== undefined && typeof payload.wallet_address !== 'string') {
    throw new Error('Task Node telemetry wallet_address must be a string when present.');
  }
  if (payload.profile !== undefined) {
    requireRecord(payload.profile, 'Task Node telemetry profile');
  }
  return payload;
}

function uniqueSidecarPath(filePath, suffix) {
  const random = crypto.randomBytes(6).toString('hex');
  return path.join(
    path.dirname(filePath),
    `.${path.basename(filePath)}.${process.pid}.${Date.now()}.${random}${suffix}`
  );
}

async function prepareJsonWrite({ filePath, contents, label, validator }) {
  parseAndValidateJsonDocument(contents, label, validator);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = uniqueSidecarPath(filePath, '.tmp');
  await fs.writeFile(tempPath, contents, { encoding: 'utf8', flag: 'wx' });
  const tempContents = await fs.readFile(tempPath, 'utf8');
  parseAndValidateJsonDocument(tempContents, `${label} temp file`, validator);
  return { filePath, tempPath, label };
}

async function copyExistingFileToBackup(filePath) {
  const backupPath = uniqueSidecarPath(filePath, '.bak');
  try {
    await fs.copyFile(filePath, backupPath, fsConstants.COPYFILE_EXCL);
    return { filePath, backupPath, existed: true };
  } catch (err) {
    if (err?.code === 'ENOENT') {
      return { filePath, backupPath, existed: false };
    }
    throw err;
  }
}

async function removeIfExists(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    if (err?.code !== 'ENOENT') {
      throw err;
    }
  }
}

async function restoreBackups(backups) {
  for (const backup of backups.slice().reverse()) {
    if (backup.existed) {
      await fs.copyFile(backup.backupPath, backup.filePath);
    } else {
      await removeIfExists(backup.filePath);
    }
  }
}

async function commitJsonWrites(preparedWrites) {
  if (!preparedWrites.length) {
    return;
  }
  const backups = [];
  try {
    for (const write of preparedWrites) {
      backups.push(await copyExistingFileToBackup(write.filePath));
    }
    for (const write of preparedWrites) {
      await fs.rename(write.tempPath, write.filePath);
    }
  } catch (err) {
    await restoreBackups(backups);
    throw err;
  } finally {
    await Promise.allSettled(preparedWrites.map((write) => removeIfExists(write.tempPath)));
    await Promise.allSettled(backups.map((backup) => removeIfExists(backup.backupPath)));
  }
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
    github_public_commits: toFiniteNumberOrNull(row.github_public_commits),
    github_public_loc: toFiniteNumberOrNull(row.github_public_loc),
    github_public_additions: toFiniteNumberOrNull(row.github_public_additions),
    github_public_deletions: toFiniteNumberOrNull(row.github_public_deletions),
    github_total_commits: toFiniteNumberOrNull(row.github_total_commits),
    github_total_loc: toFiniteNumberOrNull(row.github_total_loc),
    github_total_additions: toFiniteNumberOrNull(row.github_total_additions),
    github_total_deletions: toFiniteNumberOrNull(row.github_total_deletions),
    local_workspace_files: toFiniteNumberOrNull(row.local_workspace_files),
    local_workspace_repos: toFiniteNumberOrNull(row.local_workspace_repos),
    local_workspace_loc: toFiniteNumberOrNull(row.local_workspace_loc),
    local_workspace_additions: toFiniteNumberOrNull(row.local_workspace_additions),
    local_workspace_deletions: toFiniteNumberOrNull(row.local_workspace_deletions),
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
  const snapshotDate = dateKey(fetchedAt);
  const privateGithubDate = dateKey(privateGithub.generated_at || null);
  const privateGithubIsFresh = privateGithub.generated_at && privateGithubDate === snapshotDate;
  const sources = {
    current_metrics: 'telemetry_snapshot',
    github_private: privateGithubIsFresh
      ? 'redacted_private_github_snapshot'
      : 'stale_private_github_snapshot_ignored',
    github_public: privateGithubIsFresh
      ? 'redacted_public_github_snapshot'
      : 'stale_public_github_snapshot_ignored',
    github_total: privateGithubIsFresh
      ? 'redacted_github_snapshot'
      : 'stale_github_snapshot_ignored',
  };
  if (followersCount !== null) {
    sources.x_followers = xFollowersSource || 'x_api_v2_users_by_username';
  }
  const privateGithubMetric = (key) => (
    privateGithubIsFresh ? toFiniteNumberOrNull(privateGithub[key]) : 0
  );
  return compactSnapshot({
    date: snapshotDate,
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
    github_private_commits: privateGithubMetric('private_commits_today'),
    github_private_loc: privateGithubMetric('private_loc_today'),
    github_private_additions: privateGithubMetric('private_additions_today'),
    github_private_deletions: privateGithubMetric('private_deletions_today'),
    github_public_commits: privateGithubMetric('public_commits_today'),
    github_public_loc: privateGithubMetric('public_loc_today'),
    github_public_additions: privateGithubMetric('public_additions_today'),
    github_public_deletions: privateGithubMetric('public_deletions_today'),
    github_total_commits: privateGithubMetric('total_commits_today'),
    github_total_loc: privateGithubMetric('total_loc_today'),
    github_total_additions: privateGithubMetric('total_additions_today'),
    github_total_deletions: privateGithubMetric('total_deletions_today'),
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
  telemetry.wallet = telemetry.wallet && typeof telemetry.wallet === 'object' ? telemetry.wallet : {};
  telemetry.wallet.address = taskNodeTelemetry.wallet_address || telemetry.wallet.address || null;
  telemetry.wallet.interactions_24h = toFiniteNumberOrNull(metrics.wallet_interactions_24h);
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

function pruneStaleTimelineCaches(telemetry, fetchedAt) {
  telemetry.events = Array.isArray(telemetry.events)
    ? telemetry.events.filter((event) => (
      event?.type === 'github_private' || isFreshTimestamp(event?.ts, fetchedAt, 48)
    ))
    : [];

  const wallet = telemetry.wallet && typeof telemetry.wallet === 'object' ? telemetry.wallet : {};
  wallet.recent = Array.isArray(wallet.recent)
    ? wallet.recent.filter((event) => isFreshTimestamp(event?.ts, fetchedAt, 24))
    : [];
  telemetry.wallet = wallet;

  const subjectFeed = telemetry.subject_feed && typeof telemetry.subject_feed === 'object'
    ? telemetry.subject_feed
    : null;
  if (subjectFeed) {
    const entries = Array.isArray(subjectFeed.entries) ? subjectFeed.entries : [];
    const freshEntries = entries.filter((entry) => isFreshTimestamp(entry?.ts, fetchedAt, 48));
    const feedIsFresh = isFreshTimestamp(subjectFeed.generated_at, fetchedAt, 48);
    if (feedIsFresh && freshEntries.length) {
      telemetry.subject_feed = {
        ...subjectFeed,
        entries: freshEntries,
      };
    } else {
      delete telemetry.subject_feed;
    }
  }
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
      github_public_commits: toFiniteNumberOrNull(row.github_public_commits),
      github_public_loc: toFiniteNumberOrNull(row.github_public_loc),
      github_public_additions: toFiniteNumberOrNull(row.github_public_additions),
      github_public_deletions: toFiniteNumberOrNull(row.github_public_deletions),
      github_total_commits: toFiniteNumberOrNull(row.github_total_commits),
      github_total_loc: toFiniteNumberOrNull(row.github_total_loc),
      github_total_additions: toFiniteNumberOrNull(row.github_total_additions),
      github_total_deletions: toFiniteNumberOrNull(row.github_total_deletions),
      local_workspace_files: toFiniteNumberOrNull(row.local_workspace_files),
      local_workspace_repos: toFiniteNumberOrNull(row.local_workspace_repos),
      local_workspace_loc: toFiniteNumberOrNull(row.local_workspace_loc),
      local_workspace_additions: toFiniteNumberOrNull(row.local_workspace_additions),
      local_workspace_deletions: toFiniteNumberOrNull(row.local_workspace_deletions),
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
    fetchXProfile(username),
    fetchTaskNodeTelemetry({ walletAddress, endpoint: taskNodeMetricsUrl }),
  ]);
  const fetchedAt = new Date().toISOString();
  const validatedTaskNodeTelemetry = validateTaskNodeTelemetryPayload(taskNodeTelemetry);

  telemetry.generated_at = fetchedAt;
  telemetry.metrics = telemetry.metrics || {};
  telemetry.notes = telemetry.notes || {};
  telemetry.notes.history = `Daily telemetry snapshots are retained in /the-merge/${DEFAULT_HISTORY_FILENAME}; telemetry.series is derived from that cache.`;

  const data = validateXProfilePayload(profile, username);
  const publicMetrics = data?.public_metrics || {};
  let followersCount = toFiniteNumberOrNull(telemetry.metrics.x_followers);
  let followingCount = toFiniteNumberOrNull(telemetry.x_profile?.following_count);
  let postsCount = toFiniteNumberOrNull(telemetry.x_profile?.posts_count);
  let xFollowersSource = 'retained_last_successful_x_snapshot';
  followersCount = requireFiniteMetric(publicMetrics.followers_count, 'followers_count');
  followingCount = requireFiniteMetric(publicMetrics.following_count, 'following_count');
  postsCount = requireFiniteMetric(publicMetrics.tweet_count, 'tweet_count');
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
  mergeTaskNodeTelemetry(telemetry, validatedTaskNodeTelemetry);
  pruneStaleTimelineCaches(telemetry, fetchedAt);

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
  let rawHistory = null;
  try {
    rawHistory = await fs.readFile(historyPath, 'utf8');
  } catch (err) {
    if (err?.code !== 'ENOENT') {
      throw err;
    }
  }
  const writes = [];
  try {
    if (nextTelemetry !== rawTelemetry) {
      writes.push(await prepareJsonWrite({
        filePath: telemetryPath,
        contents: nextTelemetry,
        label: 'next telemetry',
        validator: validateTelemetryDocument,
      }));
    }
    if (nextHistory !== rawHistory) {
      writes.push(await prepareJsonWrite({
        filePath: historyPath,
        contents: nextHistory,
        label: 'next history',
        validator: validateHistoryDocument,
      }));
    }
  } catch (err) {
    await Promise.allSettled(writes.map((write) => removeIfExists(write.tempPath)));
    throw err;
  }
  await commitJsonWrites(writes);

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
