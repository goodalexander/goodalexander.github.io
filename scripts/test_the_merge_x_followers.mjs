import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const repoDir = path.resolve(scriptsDir, '..');
const updaterScript = path.join(scriptsDir, 'update-the-merge-x-followers.mjs');

const goodXProfile = {
  data: {
    id: '1234567890',
    username: 'goodalexander',
    created_at: '2020-01-01T00:00:00.000Z',
    verified: false,
    verified_type: null,
    public_metrics: {
      followers_count: 1234,
      following_count: 44,
      tweet_count: 567,
    },
  },
};

const goodTaskNodeTelemetry = {
  generated_at: '2026-10-03T01:00:00.000Z',
  wallet_address: 'rPo8GkCA9YMKzuJGTHbj11kdVfPqSJHxNx',
  metrics: {
    tasknode_dau: 5,
    task_requests_24h: 2,
    task_verifications_24h: 1,
    task_updates_24h: 3,
    tasks_completed_24h: 1,
    rewards_delivered_24h: 1,
    pft_rewards_24h: 10,
    context_updates_24h: 1,
    wallet_interactions_24h: 4,
  },
  profile: {
    nft_image: 'https://example.com/nft.png',
    nft_thumbnail: 'https://example.com/nft-thumb.png',
    nft_display_name: 'Test NFT',
    nft_source: 'test_fixture',
  },
};

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function hashFile(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function makeFixture() {
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'the-merge-updater-test-'));
  const dataDir = path.join(workDir, 'static', 'the-merge');
  fs.mkdirSync(dataDir, { recursive: true });
  const telemetryPath = path.join(dataDir, 'telemetry.json');
  const historyPath = path.join(dataDir, 'telemetry-history.json');
  const telemetry = {
    generated_at: '2026-10-03T00:00:00.000Z',
    metrics: {
      x_followers: 1000,
      loc_today: 12,
      commits_today: 3,
    },
    x_profile: {
      following_count: 10,
      posts_count: 20,
    },
    notes: {
      status: 'known good fixture',
    },
    events: [],
    wallet: { recent: [] },
    series: [
      {
        date: '2026-10-03',
        updated_at: '2026-10-03T00:00:00.000Z',
        x_followers: 1000,
        loc: 12,
        commits: 3,
      },
    ],
  };
  const history = {
    schema_version: 1,
    generated_at: '2026-10-03T00:00:00.000Z',
    retention_days: 365,
    snapshots: [
      {
        date: '2026-10-03',
        updated_at: '2026-10-03T00:00:00.000Z',
        x_followers: 1000,
        loc: 12,
        commits: 3,
      },
    ],
  };
  fs.writeFileSync(telemetryPath, stableJson(telemetry));
  fs.writeFileSync(historyPath, stableJson(history));
  return { workDir, dataDir, telemetryPath, historyPath };
}

function runUpdater(fixture, envOverrides) {
  return spawnSync(process.execPath, [updaterScript], {
    cwd: repoDir,
    encoding: 'utf8',
    env: {
      ...process.env,
      THE_MERGE_TELEMETRY_PATH: fixture.telemetryPath,
      THE_MERGE_HISTORY_PATH: fixture.historyPath,
      ...envOverrides,
    },
  });
}

function assertFilesUnchanged(fixture, before, message) {
  assert.equal(hashFile(fixture.telemetryPath), before.telemetryHash, `${message}: telemetry changed`);
  assert.equal(hashFile(fixture.historyPath), before.historyHash, `${message}: history changed`);
}

function currentHashes(fixture) {
  return {
    telemetryHash: hashFile(fixture.telemetryPath),
    historyHash: hashFile(fixture.historyPath),
  };
}

function mockEnv({ xProfile = goodXProfile, taskNodeTelemetry = goodTaskNodeTelemetry } = {}) {
  return {
    THE_MERGE_X_MOCK_RESPONSE: typeof xProfile === 'string' ? xProfile : JSON.stringify(xProfile),
    THE_MERGE_TASKNODE_MOCK_RESPONSE: typeof taskNodeTelemetry === 'string'
      ? taskNodeTelemetry
      : JSON.stringify(taskNodeTelemetry),
  };
}

{
  const fixture = makeFixture();
  const before = currentHashes(fixture);
  const result = runUpdater(fixture, mockEnv({ xProfile: '{"data":' }));
  assert.notEqual(result.status, 0, 'truncated X JSON should fail the refresh');
  assert.match(result.stderr, /Invalid THE_MERGE_X_MOCK_RESPONSE JSON/);
  assertFilesUnchanged(fixture, before, 'truncated X JSON');
}

{
  const fixture = makeFixture();
  const before = currentHashes(fixture);
  const badShape = { data: { username: 'goodalexander', public_metrics: { followers_count: 1234 } } };
  const result = runUpdater(fixture, mockEnv({ xProfile: badShape }));
  assert.notEqual(result.status, 0, 'incomplete X metrics should fail the refresh');
  assert.match(result.stderr, /following_count/);
  assertFilesUnchanged(fixture, before, 'incomplete X metrics');
}

{
  const fixture = makeFixture();
  const before = currentHashes(fixture);
  const result = runUpdater(fixture, mockEnv({ taskNodeTelemetry: '{"metrics":' }));
  assert.notEqual(result.status, 0, 'truncated Task Node JSON should fail the refresh');
  assert.match(result.stderr, /Invalid THE_MERGE_TASKNODE_MOCK_RESPONSE JSON/);
  assertFilesUnchanged(fixture, before, 'truncated Task Node JSON');
}

{
  const fixture = makeFixture();
  const before = currentHashes(fixture);
  const result = runUpdater(fixture, mockEnv({ taskNodeTelemetry: {} }));
  assert.notEqual(result.status, 0, 'Task Node telemetry without metrics should fail the refresh');
  assert.match(result.stderr, /Task Node telemetry metrics/);
  assertFilesUnchanged(fixture, before, 'Task Node telemetry without metrics');
}

{
  const fixture = makeFixture();
  const result = runUpdater(fixture, mockEnv());
  assert.equal(result.status, 0, `good refresh should pass: ${result.stderr}`);
  const telemetry = JSON.parse(fs.readFileSync(fixture.telemetryPath, 'utf8'));
  const history = JSON.parse(fs.readFileSync(fixture.historyPath, 'utf8'));
  assert.equal(telemetry.metrics.x_followers, 1234);
  assert.equal(telemetry.x_profile.following_count, 44);
  assert.equal(telemetry.x_profile.posts_count, 567);
  assert.equal(telemetry.tasknode_telemetry.source, 'tasknode_public_merge_telemetry');
  assert.equal(telemetry.profile.nft_image, 'https://example.com/nft.png');
  assert.equal(history.schema_version, 1);
  assert.ok(history.snapshots.length >= 1);
  assert.equal(telemetry.history.snapshots, history.snapshots.length);
  const leftovers = fs.readdirSync(fixture.dataDir).filter((name) => name.includes('.tmp') || name.includes('.bak'));
  assert.deepEqual(leftovers, []);
}

console.log('update-the-merge-x-followers smoke tests passed');
