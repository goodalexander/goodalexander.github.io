import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const DEFAULT_TELEMETRY_PATH = 'static/the-merge/telemetry.json';
const DEFAULT_HISTORY_FILENAME = 'telemetry-history.json';
const DEFAULT_CACHE_PATH = path.join(
  process.env.HOME || '.',
  '.local/state/goodalexander/the-merge-github-cache.json'
);
const DEFAULT_WINDOW_DAYS = 14;
const DEFAULT_REPO_AFFILIATION = 'owner,collaborator,organization_member';
const DEFAULT_REPO_CACHE_TTL_MINUTES = 30;
const DEFAULT_BRANCH_CACHE_TTL_MINUTES = 24 * 60;
const DEFAULT_BRANCH_COMMITS_CACHE_TTL_MINUTES = 24 * 60;
const DEFAULT_MIN_RATE_REMAINING = 350;
const API_BASE = 'https://api.github.com';
const GITHUB_USER_AGENT = 'goodalexander-the-merge-telemetry';
const EXCLUDED_GITHUB_FILE_RULES_VERSION = 'generated-artifact-exclusions-v3-committer-date';
const EXCLUDED_GITHUB_FILE_RULES = [
  {
    prefix: 'static/benchmarks/',
    suffix: '.json',
    reason: 'generated benchmark JSON artifact',
  },
  {
    prefix: 'static/the-merge/telemetry',
    suffix: '.json',
    reason: 'generated The Merge telemetry JSON artifact',
  },
];

function readEnv(name) {
  const value = process.env[name];
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(String(value || ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function cacheTtlMs(envName, fallbackMinutes) {
  return parsePositiveInteger(readEnv(envName), fallbackMinutes) * 60 * 1000;
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

function sinceDayStartIso(value) {
  return `${dateKey(value)}T00:00:00.000Z`;
}

function toFiniteNumber(value) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function emptyGithubStats() {
  return {
    commitsInWindow: 0,
    locInWindow: 0,
    additionsInWindow: 0,
    deletionsInWindow: 0,
    rawLocInWindow: 0,
    rawAdditionsInWindow: 0,
    rawDeletionsInWindow: 0,
    excludedLocInWindow: 0,
    excludedAdditionsInWindow: 0,
    excludedDeletionsInWindow: 0,
    commitsToday: 0,
    locToday: 0,
    additionsToday: 0,
    deletionsToday: 0,
    rawLocToday: 0,
    rawAdditionsToday: 0,
    rawDeletionsToday: 0,
    excludedLocToday: 0,
    excludedAdditionsToday: 0,
    excludedDeletionsToday: 0,
  };
}

function addCommitStats(stats, {
  additions,
  deletions,
  loc,
  rawAdditions,
  rawDeletions,
  rawLoc,
  excludedAdditions,
  excludedDeletions,
  excludedLoc,
  isToday,
}) {
  stats.commitsInWindow += 1;
  stats.additionsInWindow += additions;
  stats.deletionsInWindow += deletions;
  stats.locInWindow += loc;
  stats.rawAdditionsInWindow += rawAdditions;
  stats.rawDeletionsInWindow += rawDeletions;
  stats.rawLocInWindow += rawLoc;
  stats.excludedAdditionsInWindow += excludedAdditions;
  stats.excludedDeletionsInWindow += excludedDeletions;
  stats.excludedLocInWindow += excludedLoc;
  if (isToday) {
    stats.commitsToday += 1;
    stats.additionsToday += additions;
    stats.deletionsToday += deletions;
    stats.locToday += loc;
    stats.rawAdditionsToday += rawAdditions;
    stats.rawDeletionsToday += rawDeletions;
    stats.rawLocToday += rawLoc;
    stats.excludedAdditionsToday += excludedAdditions;
    stats.excludedDeletionsToday += excludedDeletions;
    stats.excludedLocToday += excludedLoc;
  }
}

function writeGithubStats(target, prefix, stats) {
  target[`${prefix}_author_commits_in_window`] = stats.commitsInWindow;
  target[`${prefix}_author_loc_in_window`] = stats.locInWindow;
  target[`${prefix}_author_additions_in_window`] = stats.additionsInWindow;
  target[`${prefix}_author_deletions_in_window`] = stats.deletionsInWindow;
  target[`${prefix}_commits_today`] = stats.commitsToday;
  target[`${prefix}_loc_today`] = stats.locToday;
  target[`${prefix}_additions_today`] = stats.additionsToday;
  target[`${prefix}_deletions_today`] = stats.deletionsToday;
  target[`${prefix}_raw_author_loc_in_window`] = stats.rawLocInWindow;
  target[`${prefix}_raw_author_additions_in_window`] = stats.rawAdditionsInWindow;
  target[`${prefix}_raw_author_deletions_in_window`] = stats.rawDeletionsInWindow;
  target[`${prefix}_raw_loc_today`] = stats.rawLocToday;
  target[`${prefix}_raw_additions_today`] = stats.rawAdditionsToday;
  target[`${prefix}_raw_deletions_today`] = stats.rawDeletionsToday;
  target[`${prefix}_excluded_author_loc_in_window`] = stats.excludedLocInWindow;
  target[`${prefix}_excluded_author_additions_in_window`] = stats.excludedAdditionsInWindow;
  target[`${prefix}_excluded_author_deletions_in_window`] = stats.excludedDeletionsInWindow;
  target[`${prefix}_excluded_loc_today`] = stats.excludedLocToday;
  target[`${prefix}_excluded_additions_today`] = stats.excludedAdditionsToday;
  target[`${prefix}_excluded_deletions_today`] = stats.excludedDeletionsToday;
}

function addDailyGithubStats(dailyStats, date, isPrivate, commitStats) {
  const day = dateKey(date);
  let row = dailyStats.get(day);
  if (!row) {
    row = {
      date: day,
      private: emptyGithubStats(),
      public: emptyGithubStats(),
      total: emptyGithubStats(),
    };
    dailyStats.set(day, row);
  }
  const statsWithDailyFlag = {
    ...commitStats,
    isToday: true,
  };
  addCommitStats(isPrivate ? row.private : row.public, statsWithDailyFlag);
  addCommitStats(row.total, statsWithDailyFlag);
}

function serializeDailyGithubStats(row) {
  const result = { date: row.date };
  [
    ['private', row.private],
    ['public', row.public],
    ['total', row.total],
  ].forEach(([prefix, stats]) => {
    result[`${prefix}_commits`] = stats.commitsToday;
    result[`${prefix}_loc`] = stats.locToday;
    result[`${prefix}_additions`] = stats.additionsToday;
    result[`${prefix}_deletions`] = stats.deletionsToday;
    result[`${prefix}_raw_loc`] = stats.rawLocToday;
    result[`${prefix}_raw_additions`] = stats.rawAdditionsToday;
    result[`${prefix}_raw_deletions`] = stats.rawDeletionsToday;
    result[`${prefix}_excluded_loc`] = stats.excludedLocToday;
    result[`${prefix}_excluded_additions`] = stats.excludedAdditionsToday;
    result[`${prefix}_excluded_deletions`] = stats.excludedDeletionsToday;
  });
  return result;
}

function excludedGithubFileReason(filename) {
  const normalized = String(filename || '').replace(/^\/+/, '');
  const rule = EXCLUDED_GITHUB_FILE_RULES.find((item) => (
    normalized.startsWith(item.prefix)
    && (!item.suffix || normalized.endsWith(item.suffix))
  ));
  return rule?.reason || '';
}

function commitFileStats(detail) {
  const stats = detail?.stats || {};
  const rawAdditions = toFiniteNumber(stats.additions);
  const rawDeletions = toFiniteNumber(stats.deletions);
  const rawLoc = toFiniteNumber(stats.total) || rawAdditions + rawDeletions;
  const files = Array.isArray(detail?.files) ? detail.files : [];
  if (!files.length) {
    return {
      additions: rawAdditions,
      deletions: rawDeletions,
      loc: rawLoc,
      rawAdditions,
      rawDeletions,
      rawLoc,
      excludedAdditions: 0,
      excludedDeletions: 0,
      excludedLoc: 0,
      excludedFiles: 0,
    };
  }

  return files.reduce((acc, file) => {
    const additions = toFiniteNumber(file?.additions);
    const deletions = toFiniteNumber(file?.deletions);
    const loc = toFiniteNumber(file?.changes) || additions + deletions;
    if (excludedGithubFileReason(file?.filename)) {
      acc.excludedAdditions += additions;
      acc.excludedDeletions += deletions;
      acc.excludedLoc += loc;
      acc.excludedFiles += 1;
      return acc;
    }
    acc.additions += additions;
    acc.deletions += deletions;
    acc.loc += loc;
    return acc;
  }, {
    additions: 0,
    deletions: 0,
    loc: 0,
    rawAdditions,
    rawDeletions,
    rawLoc,
    excludedAdditions: 0,
    excludedDeletions: 0,
    excludedLoc: 0,
    excludedFiles: 0,
  });
}

function emptyGithubCache() {
  return {
    schema_version: 1,
    updated_at: null,
    repos: {},
    branches: {},
    branch_commits: {},
    commit_stats: {},
    stats: {
      hits: 0,
      misses: 0,
      writes: 0,
    },
  };
}

async function loadGithubCache(cachePath) {
  try {
    const parsed = JSON.parse(await fs.readFile(cachePath, 'utf8'));
    return {
      ...emptyGithubCache(),
      ...parsed,
      repos: parsed?.repos || {},
      branches: parsed?.branches || {},
      branch_commits: parsed?.branch_commits || {},
      commit_stats: parsed?.commit_stats || {},
      stats: {
        hits: 0,
        misses: 0,
        writes: 0,
      },
    };
  } catch (err) {
    if (err?.code !== 'ENOENT') {
      console.warn(`Ignoring unreadable GitHub telemetry cache: ${err.message || err}`);
    }
    return emptyGithubCache();
  }
}

async function saveGithubCache(cachePath, cache) {
  cache.schema_version = 1;
  cache.updated_at = new Date().toISOString();
  await fs.mkdir(path.dirname(cachePath), { recursive: true });
  await fs.writeFile(cachePath, stableStringify(cache));
}

function cacheKey(...parts) {
  return parts.map((part) => encodeURIComponent(String(part || ''))).join(':');
}

function isFreshCacheEntry(entry, ttlMs) {
  if (!entry?.cached_at) {
    return false;
  }
  const cachedAt = new Date(entry.cached_at).getTime();
  return Number.isFinite(cachedAt) && Date.now() - cachedAt < ttlMs;
}

function cacheHit(cache) {
  cache.stats.hits += 1;
}

function cacheMiss(cache) {
  cache.stats.misses += 1;
}

function cacheWrite(cache) {
  cache.stats.writes += 1;
}

function redactedRepo(repo) {
  return {
    full_name: repo.full_name,
    private: Boolean(repo.private),
    archived: Boolean(repo.archived),
    disabled: Boolean(repo.disabled),
    pushed_at: repo.pushed_at || null,
    updated_at: repo.updated_at || null,
  };
}

function commitSummary(commit) {
  return {
    sha: commit?.sha || '',
    authored_at: commit?.commit?.author?.date || commit?.commit?.committer?.date || null,
    committed_at: commit?.commit?.committer?.date || commit?.commit?.author?.date || null,
  };
}

function commitIsInWindow(commit, sinceIso) {
  const activityAt = (
    commit?.commit?.committer?.date
    || commit?.committed_at
    || commit?.commit?.author?.date
    || commit?.authored_at
  );
  if (!activityAt) {
    return true;
  }
  const activityTime = new Date(activityAt).getTime();
  const sinceTime = new Date(sinceIso).getTime();
  return !Number.isFinite(activityTime) || !Number.isFinite(sinceTime) || activityTime >= sinceTime;
}

class GithubRateBudgetError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GithubRateBudgetError';
  }
}

let githubRateRemaining = Number.POSITIVE_INFINITY;
let githubRateReset = null;

function githubRateBudgetMinimum() {
  return parsePositiveInteger(readEnv('THE_MERGE_GITHUB_MIN_RATE_REMAINING'), DEFAULT_MIN_RATE_REMAINING);
}

function updateGithubRateBudget(response) {
  const remaining = Number.parseInt(response.headers.get('x-ratelimit-remaining') || '', 10);
  if (Number.isFinite(remaining)) {
    githubRateRemaining = remaining;
  }
  const reset = Number.parseInt(response.headers.get('x-ratelimit-reset') || '', 10);
  if (Number.isFinite(reset) && reset > 0) {
    githubRateReset = new Date(reset * 1000).toISOString();
  }
}

function assertGithubRateBudget() {
  const minimum = githubRateBudgetMinimum();
  if (Number.isFinite(githubRateRemaining) && githubRateRemaining <= minimum) {
    throw new GithubRateBudgetError(
      `GitHub API rate budget low (${githubRateRemaining} remaining; reset ${githubRateReset || 'unknown'}); `
      + `stopping before the telemetry job burns the shared token.`
    );
  }
}

async function githubFetch(url, token) {
  assertGithubRateBudget();
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': GITHUB_USER_AGENT,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  updateGithubRateBudget(response);
  return response;
}

async function execGh(args) {
  const { stdout } = await execFileAsync('gh', args, {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
  return stdout.trim();
}

async function execGit(args) {
  const { stdout } = await execFileAsync('git', args, {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
  });
  return stdout.trim();
}

async function resolveGithubToken() {
  const envToken = readEnv('GH_TOKEN') || readEnv('GITHUB_TOKEN');
  if (envToken) {
    return envToken;
  }
  return execGh(['auth', 'token']);
}

async function resolveGithubLogin(token, cache) {
  const configured = readEnv('THE_MERGE_GITHUB_AUTHOR') || readEnv('GITHUB_AUTHOR_LOGIN');
  if (configured) {
    return configured;
  }
  if (cache?.viewer?.login && isFreshCacheEntry(cache.viewer, cacheTtlMs('THE_MERGE_GITHUB_VIEWER_CACHE_TTL_MINUTES', 24 * 60))) {
    cacheHit(cache);
    return cache.viewer.login;
  }
  if (cache) {
    cacheMiss(cache);
  }
  const viewer = await githubRequest('/user', token);
  if (!viewer?.login) {
    throw new Error('Could not resolve authenticated GitHub login.');
  }
  if (cache) {
    cache.viewer = {
      cached_at: new Date().toISOString(),
      login: viewer.login,
    };
    cacheWrite(cache);
  }
  return viewer.login;
}

async function resolveAuthorEmails() {
  const configured = readEnv('THE_MERGE_GITHUB_AUTHOR_EMAILS') || readEnv('GITHUB_AUTHOR_EMAILS');
  const values = configured
    ? configured.split(',')
    : [
      await execGit(['config', 'user.email']).catch(() => ''),
      await execGit(['config', '--global', 'user.email']).catch(() => ''),
    ];
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function parseNextLink(linkHeader) {
  if (!linkHeader) {
    return null;
  }
  const links = linkHeader.split(',');
  for (const link of links) {
    const match = link.match(/<([^>]+)>;\s*rel="next"/);
    if (match) {
      return match[1];
    }
  }
  return null;
}

function buildApiUrl(endpoint, params = {}) {
  const url = new URL(endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url;
}

async function githubRequest(endpoint, token, params = {}) {
  const url = buildApiUrl(endpoint, params);
  const response = await githubFetch(url, token);
  const body = await response.text();
  let parsed = null;
  if (body) {
    try {
      parsed = JSON.parse(body);
    } catch {
      parsed = { raw: body.slice(0, 300) };
    }
  }
  if (!response.ok) {
    const message = parsed?.message || `HTTP ${response.status}`;
    if (response.status === 403 && /rate limit/i.test(message)) {
      throw new GithubRateBudgetError(`GitHub API rate limit exceeded; reset ${githubRateReset || 'unknown'}.`);
    }
    throw new Error(`GitHub API request failed (${response.status}): ${message}`);
  }
  return parsed;
}

async function githubPaginatedRequest(endpoint, token, params = {}) {
  const rows = [];
  let nextUrl = buildApiUrl(endpoint, { per_page: 100, ...params }).toString();
  while (nextUrl) {
    const response = await githubFetch(nextUrl, token);
    const body = await response.text();
    let parsed = null;
    if (body) {
      try {
        parsed = JSON.parse(body);
      } catch {
        parsed = { raw: body.slice(0, 300) };
      }
    }
    if (!response.ok) {
      const message = parsed?.message || `HTTP ${response.status}`;
      if (response.status === 403 && /rate limit/i.test(message)) {
        throw new GithubRateBudgetError(`GitHub API rate limit exceeded; reset ${githubRateReset || 'unknown'}.`);
      }
      throw new Error(`GitHub API request failed (${response.status}): ${message}`);
    }
    if (Array.isArray(parsed)) {
      rows.push(...parsed);
    }
    nextUrl = parseNextLink(response.headers.get('link'));
  }
  return rows;
}

function repoEndpoint(repo, suffix = '') {
  const [owner, name] = String(repo.full_name || '').split('/');
  if (!owner || !name) {
    throw new Error('Repository missing full_name.');
  }
  return `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}${suffix}`;
}

async function listCandidateRepos(token, cache) {
  const affiliation = readEnv('THE_MERGE_GITHUB_AFFILIATION') || DEFAULT_REPO_AFFILIATION;
  const key = cacheKey('repos', affiliation);
  const cached = cache.repos[key];
  if (isFreshCacheEntry(cached, cacheTtlMs('THE_MERGE_GITHUB_REPO_CACHE_TTL_MINUTES', DEFAULT_REPO_CACHE_TTL_MINUTES))) {
    cacheHit(cache);
    return cached.repos;
  }
  cacheMiss(cache);
  const repos = await githubPaginatedRequest('/user/repos', token, {
    visibility: 'all',
    affiliation,
    sort: 'updated',
  });
  const filtered = repos
    .filter((repo) => repo && !repo.archived && !repo.disabled)
    .map(redactedRepo);
  cache.repos[key] = {
    cached_at: new Date().toISOString(),
    repos: filtered,
  };
  cacheWrite(cache);
  return filtered;
}

async function listBranches(repo, token, cache) {
  const key = cacheKey('branches', repo.full_name);
  const cached = cache.branches[key];
  if (
    cached?.repo_pushed_at === (repo.pushed_at || null)
    && isFreshCacheEntry(cached, cacheTtlMs('THE_MERGE_GITHUB_BRANCH_CACHE_TTL_MINUTES', DEFAULT_BRANCH_CACHE_TTL_MINUTES))
  ) {
    cacheHit(cache);
    return cached.branches;
  }
  cacheMiss(cache);
  const branches = await githubPaginatedRequest(repoEndpoint(repo, '/branches'), token)
    .then((rows) => rows
      .map((branch) => ({
        name: branch?.name || '',
        sha: branch?.commit?.sha || '',
      }))
      .filter((branch) => branch.name));
  cache.branches[key] = {
    cached_at: new Date().toISOString(),
    repo_pushed_at: repo.pushed_at || null,
    branches,
  };
  cacheWrite(cache);
  return branches;
}

async function listCommitsForBranch(repo, branch, author, sinceIso, token, cache) {
  const sinceQueryIso = sinceDayStartIso(sinceIso);
  const key = cacheKey('branch-commits', repo.full_name, branch.name, branch.sha, author, dateKey(sinceIso));
  const cached = cache.branch_commits[key];
  if (isFreshCacheEntry(
    cached,
    cacheTtlMs('THE_MERGE_GITHUB_BRANCH_COMMITS_CACHE_TTL_MINUTES', DEFAULT_BRANCH_COMMITS_CACHE_TTL_MINUTES)
  )) {
    cacheHit(cache);
    return cached.commits.filter((commit) => commitIsInWindow(commit, sinceIso));
  }
  cacheMiss(cache);
  const commits = await githubPaginatedRequest(repoEndpoint(repo, '/commits'), token, {
    sha: branch.name,
    since: sinceQueryIso,
    author,
  }).then((rows) => rows.map(commitSummary).filter((commit) => commit.sha));
  cache.branch_commits[key] = {
    cached_at: new Date().toISOString(),
    commits,
  };
  cacheWrite(cache);
  return commits.filter((commit) => commitIsInWindow(commit, sinceIso));
}

async function getCommitDetail(repo, sha, token) {
  const files = [];
  let detail = null;
  let nextUrl = buildApiUrl(repoEndpoint(repo, `/commits/${encodeURIComponent(sha)}`), { per_page: 100 }).toString();
  while (nextUrl) {
    const response = await githubFetch(nextUrl, token);
    const body = await response.text();
    let parsed = null;
    if (body) {
      try {
        parsed = JSON.parse(body);
      } catch {
        parsed = { raw: body.slice(0, 300) };
      }
    }
    if (!response.ok) {
      const message = parsed?.message || `HTTP ${response.status}`;
      if (response.status === 403 && /rate limit/i.test(message)) {
        throw new GithubRateBudgetError(`GitHub API rate limit exceeded; reset ${githubRateReset || 'unknown'}.`);
      }
      throw new Error(`GitHub API request failed (${response.status}): ${message}`);
    }
    if (!detail) {
      detail = parsed;
    }
    if (Array.isArray(parsed?.files)) {
      files.push(...parsed.files);
    }
    nextUrl = parseNextLink(response.headers.get('link'));
  }

  if (detail) {
    detail.files = files;
  }
  return detail;
}

async function getCommitComputedStats(repo, sha, token, cache) {
  const key = cacheKey('commit-stats', EXCLUDED_GITHUB_FILE_RULES_VERSION, repo.full_name, sha);
  const cached = cache.commit_stats[key];
  if (cached?.commit_stats && cached.excluded_file_rules_version === EXCLUDED_GITHUB_FILE_RULES_VERSION) {
    cacheHit(cache);
    return cached;
  }
  cacheMiss(cache);
  const detail = await getCommitDetail(repo, sha, token);
  const computed = {
    cached_at: new Date().toISOString(),
    excluded_file_rules_version: EXCLUDED_GITHUB_FILE_RULES_VERSION,
    authored_at: detail?.commit?.author?.date || detail?.commit?.committer?.date || null,
    committed_at: detail?.commit?.committer?.date || detail?.commit?.author?.date || null,
    commit_stats: commitFileStats(detail),
  };
  cache.commit_stats[key] = computed;
  cacheWrite(cache);
  return computed;
}

async function runLimited(items, limit, worker) {
  const results = [];
  let nextIndex = 0;
  const workers = Array.from({ length: Math.max(1, limit) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

async function collectPrivateGithubAggregate({
  token,
  authorLogin,
  authorEmails,
  windowDays,
  cache,
}) {
  const generatedAt = new Date().toISOString();
  const since = new Date(Date.now() - (windowDays * 24 * 60 * 60 * 1000)).toISOString();
  const today = dateKey(generatedAt);
  const repos = await listCandidateRepos(token, cache);
  const privateRepos = repos.filter((repo) => repo.private);
  const publicRepos = repos.filter((repo) => !repo.private);
  const authorIdentifiers = Array.from(new Set([authorLogin, ...authorEmails].filter(Boolean)));
  const commitMap = new Map();
  let scannedBranches = 0;
  let skippedBranchScans = 0;
  let skippedCommitDetails = 0;

  await runLimited(repos, 4, async (repo) => {
    let branches = [];
    try {
      branches = await listBranches(repo, token, cache);
    } catch (err) {
      if (err instanceof GithubRateBudgetError) {
        throw err;
      }
      skippedBranchScans += 1;
      return;
    }
    scannedBranches += branches.length;
    const branchAuthorPairs = [];
    branches.forEach((branch) => {
      authorIdentifiers.forEach((author) => {
        branchAuthorPairs.push({ repo, branch, author });
      });
    });
    await runLimited(branchAuthorPairs, 4, async (item) => {
      let commits = [];
      try {
        commits = await listCommitsForBranch(item.repo, item.branch, item.author, since, token, cache);
      } catch (err) {
        if (err instanceof GithubRateBudgetError) {
          throw err;
        }
        skippedBranchScans += 1;
        return;
      }
      commits.forEach((commit) => {
        const sha = commit?.sha;
        if (!sha) {
          return;
        }
        const key = `${item.repo.full_name}:${sha}`;
        if (!commitMap.has(key)) {
          commitMap.set(key, {
            repo: item.repo,
            sha,
            private: Boolean(item.repo.private),
            authoredAt: commit.authored_at || null,
            committedAt: commit.committed_at || null,
          });
        }
      });
    });
  });

  const commits = Array.from(commitMap.values());
  const privateStats = emptyGithubStats();
  const publicStats = emptyGithubStats();
  const totalStats = emptyGithubStats();
  const dailyStats = new Map();

  await runLimited(commits, 3, async (commit) => {
    let computed = null;
    try {
      computed = await getCommitComputedStats(commit.repo, commit.sha, token, cache);
    } catch (err) {
      if (err instanceof GithubRateBudgetError) {
        throw err;
      }
      skippedCommitDetails += 1;
      return;
    }
    const commitStats = computed.commit_stats;
    const activityAt = computed.committed_at || commit.committedAt || computed.authored_at || commit.authoredAt;
    const statsWithDate = {
      ...commitStats,
      isToday: dateKey(activityAt) === today,
    };
    addCommitStats(commit.private ? privateStats : publicStats, statsWithDate);
    addCommitStats(totalStats, statsWithDate);
    addDailyGithubStats(dailyStats, activityAt || generatedAt, commit.private, commitStats);
  });

  if (skippedBranchScans || skippedCommitDetails) {
    throw new Error(
      `GitHub scan incomplete: ${skippedBranchScans} branch scans and `
      + `${skippedCommitDetails} commit details skipped; refusing to publish partial LOC.`
    );
  }

  const aggregate = {
    generated_at: generatedAt,
    window_days: windowDays,
    scanned_repos: repos.length,
    scanned_private_repos: privateRepos.length,
    scanned_public_repos: publicRepos.length,
    scanned_branches: scannedBranches,
    skipped_branch_scans: skippedBranchScans,
    skipped_commit_details: skippedCommitDetails,
    github_cache_hits: cache.stats.hits,
    github_cache_misses: cache.stats.misses,
    github_cache_writes: cache.stats.writes,
    github_rate_remaining: Number.isFinite(githubRateRemaining) ? githubRateRemaining : null,
    github_rate_reset: githubRateReset,
    excluded_file_rules: EXCLUDED_GITHUB_FILE_RULES.map((rule) => ({
      prefix: rule.prefix,
      suffix: rule.suffix,
      reason: rule.reason,
    })),
    daily: Array.from(dailyStats.values())
      .sort((left, right) => String(left.date || '').localeCompare(String(right.date || '')))
      .map(serializeDailyGithubStats),
    redaction: 'Repo names, branch names, commit SHAs, commit messages, and file paths are withheld from the persisted aggregate.',
  };
  writeGithubStats(aggregate, 'private', privateStats);
  writeGithubStats(aggregate, 'public', publicStats);
  writeGithubStats(aggregate, 'total', totalStats);
  return aggregate;
}

function currentPrivateEvent(privateGithub) {
  return {
    ts: privateGithub.generated_at,
    type: 'github_private',
    label: 'GitHub aggregate',
    detail: 'Authenticated public and private GitHub activity included as redacted aggregate.',
    magnitude: `${privateGithub.total_commits_today} commits / ${privateGithub.total_loc_today} LOC today`,
  };
}

function applyPrivateGithubDailyMetrics(row, daily) {
  row.github_private_commits = daily.private_commits;
  row.github_private_loc = daily.private_loc;
  row.github_private_additions = daily.private_additions;
  row.github_private_deletions = daily.private_deletions;
  row.github_private_raw_loc = daily.private_raw_loc;
  row.github_private_excluded_loc = daily.private_excluded_loc;
  row.github_public_commits = daily.public_commits;
  row.github_public_loc = daily.public_loc;
  row.github_public_additions = daily.public_additions;
  row.github_public_deletions = daily.public_deletions;
  row.github_public_raw_loc = daily.public_raw_loc;
  row.github_public_excluded_loc = daily.public_excluded_loc;
  row.github_total_commits = daily.total_commits;
  row.github_total_loc = daily.total_loc;
  row.github_total_additions = daily.total_additions;
  row.github_total_deletions = daily.total_deletions;
  row.github_total_raw_loc = daily.total_raw_loc;
  row.github_total_excluded_loc = daily.total_excluded_loc;
  row.sources = {
    ...(row.sources || {}),
    github_private: 'redacted_private_github_snapshot',
    github_public: 'redacted_public_github_snapshot',
    github_total: 'redacted_github_snapshot',
  };
}

function applyPrivateGithubAggregate(telemetry, privateGithub) {
  telemetry.generated_at = privateGithub.generated_at;
  telemetry.private_github = privateGithub;
  telemetry.notes = telemetry.notes || {};
  telemetry.notes.github_private = (
    'GitHub activity is locally generated with authenticated gh access, aggregated across accessible public and '
    + 'private repos/branches, and published without repo names, branch names, commit SHAs, messages, or file paths.'
  );
  telemetry.events = Array.isArray(telemetry.events) ? telemetry.events : [];
  telemetry.events = [
    currentPrivateEvent(privateGithub),
    ...telemetry.events.filter((event) => event?.type !== 'github_private'),
  ];

  const today = dateKey(privateGithub.generated_at);
  telemetry.series = Array.isArray(telemetry.series) ? telemetry.series : [];
  const dailyRows = Array.isArray(privateGithub.daily) && privateGithub.daily.length
    ? privateGithub.daily
    : [{
      date: today,
      private_commits: privateGithub.private_commits_today,
      private_loc: privateGithub.private_loc_today,
      private_additions: privateGithub.private_additions_today,
      private_deletions: privateGithub.private_deletions_today,
      private_raw_loc: privateGithub.private_raw_loc_today,
      private_excluded_loc: privateGithub.private_excluded_loc_today,
      public_commits: privateGithub.public_commits_today,
      public_loc: privateGithub.public_loc_today,
      public_additions: privateGithub.public_additions_today,
      public_deletions: privateGithub.public_deletions_today,
      public_raw_loc: privateGithub.public_raw_loc_today,
      public_excluded_loc: privateGithub.public_excluded_loc_today,
      total_commits: privateGithub.total_commits_today,
      total_loc: privateGithub.total_loc_today,
      total_additions: privateGithub.total_additions_today,
      total_deletions: privateGithub.total_deletions_today,
      total_raw_loc: privateGithub.total_raw_loc_today,
      total_excluded_loc: privateGithub.total_excluded_loc_today,
    }];
  dailyRows.forEach((daily) => {
    let row = telemetry.series.find((entry) => entry?.date === daily.date);
    if (!row) {
      row = { date: daily.date };
      telemetry.series.push(row);
    }
    applyPrivateGithubDailyMetrics(row, daily);
  });
  telemetry.series.sort((left, right) => String(left.date || '').localeCompare(String(right.date || '')));
}

async function updateHistory(historyPath, privateGithub) {
  let history = { schema_version: 1, generated_at: privateGithub.generated_at, retention_days: 365, snapshots: [] };
  try {
    history = JSON.parse(await fs.readFile(historyPath, 'utf8'));
  } catch (err) {
    if (err?.code !== 'ENOENT') {
      throw err;
    }
  }
  history.schema_version = 1;
  history.generated_at = privateGithub.generated_at;
  history.retention_days = history.retention_days || 365;
  history.snapshots = Array.isArray(history.snapshots) ? history.snapshots : [];
  const today = dateKey(privateGithub.generated_at);
  const dailyRows = Array.isArray(privateGithub.daily) && privateGithub.daily.length
    ? privateGithub.daily
    : [{
      date: today,
      private_commits: privateGithub.private_commits_today,
      private_loc: privateGithub.private_loc_today,
      private_additions: privateGithub.private_additions_today,
      private_deletions: privateGithub.private_deletions_today,
      private_raw_loc: privateGithub.private_raw_loc_today,
      private_excluded_loc: privateGithub.private_excluded_loc_today,
      public_commits: privateGithub.public_commits_today,
      public_loc: privateGithub.public_loc_today,
      public_additions: privateGithub.public_additions_today,
      public_deletions: privateGithub.public_deletions_today,
      public_raw_loc: privateGithub.public_raw_loc_today,
      public_excluded_loc: privateGithub.public_excluded_loc_today,
      total_commits: privateGithub.total_commits_today,
      total_loc: privateGithub.total_loc_today,
      total_additions: privateGithub.total_additions_today,
      total_deletions: privateGithub.total_deletions_today,
      total_raw_loc: privateGithub.total_raw_loc_today,
      total_excluded_loc: privateGithub.total_excluded_loc_today,
    }];
  dailyRows.forEach((daily) => {
    let row = history.snapshots.find((entry) => entry?.date === daily.date);
    if (!row) {
      row = { date: daily.date };
      history.snapshots.push(row);
    }
    row.updated_at = privateGithub.generated_at;
    applyPrivateGithubDailyMetrics(row, daily);
  });
  history.snapshots.sort((left, right) => String(left.date || '').localeCompare(String(right.date || '')));
  await fs.writeFile(historyPath, stableStringify(history));
  return history;
}

async function main() {
  const telemetryPath = path.resolve(readEnv('THE_MERGE_TELEMETRY_PATH') || DEFAULT_TELEMETRY_PATH);
  const historyPath = path.resolve(
    readEnv('THE_MERGE_HISTORY_PATH') || path.join(path.dirname(telemetryPath), DEFAULT_HISTORY_FILENAME)
  );
  const cachePath = path.resolve(readEnv('THE_MERGE_GITHUB_CACHE_PATH') || DEFAULT_CACHE_PATH);
  const cache = await loadGithubCache(cachePath);
  const windowDays = parsePositiveInteger(readEnv('THE_MERGE_GITHUB_WINDOW_DAYS'), DEFAULT_WINDOW_DAYS);
  try {
    const token = await resolveGithubToken();
    const authorLogin = await resolveGithubLogin(token, cache);
    const authorEmails = await resolveAuthorEmails();
    const privateGithub = await collectPrivateGithubAggregate({
      token,
      authorLogin,
      authorEmails,
      windowDays,
      cache,
    });
    const telemetry = JSON.parse(await fs.readFile(telemetryPath, 'utf8'));
    applyPrivateGithubAggregate(telemetry, privateGithub);
    const history = await updateHistory(historyPath, privateGithub);
    telemetry.history = {
      source: `/${path.basename(path.dirname(telemetryPath))}/${DEFAULT_HISTORY_FILENAME}`,
      generated_at: history.generated_at,
      retention_days: history.retention_days,
      snapshots: history.snapshots.length,
      current_date: dateKey(privateGithub.generated_at),
    };
    await fs.writeFile(telemetryPath, stableStringify(telemetry));
    console.log(JSON.stringify({
      generated_at: privateGithub.generated_at,
      scanned_repos: privateGithub.scanned_repos,
      scanned_private_repos: privateGithub.scanned_private_repos,
      scanned_public_repos: privateGithub.scanned_public_repos,
      scanned_branches: privateGithub.scanned_branches,
      private_commits_today: privateGithub.private_commits_today,
      private_loc_today: privateGithub.private_loc_today,
      private_raw_loc_today: privateGithub.private_raw_loc_today,
      private_excluded_loc_today: privateGithub.private_excluded_loc_today,
      public_commits_today: privateGithub.public_commits_today,
      public_loc_today: privateGithub.public_loc_today,
      public_raw_loc_today: privateGithub.public_raw_loc_today,
      public_excluded_loc_today: privateGithub.public_excluded_loc_today,
      total_commits_today: privateGithub.total_commits_today,
      total_loc_today: privateGithub.total_loc_today,
      total_raw_loc_today: privateGithub.total_raw_loc_today,
      total_excluded_loc_today: privateGithub.total_excluded_loc_today,
      private_author_commits_in_window: privateGithub.private_author_commits_in_window,
      private_author_loc_in_window: privateGithub.private_author_loc_in_window,
      private_raw_author_loc_in_window: privateGithub.private_raw_author_loc_in_window,
      private_excluded_author_loc_in_window: privateGithub.private_excluded_author_loc_in_window,
      public_author_commits_in_window: privateGithub.public_author_commits_in_window,
      public_author_loc_in_window: privateGithub.public_author_loc_in_window,
      public_raw_author_loc_in_window: privateGithub.public_raw_author_loc_in_window,
      public_excluded_author_loc_in_window: privateGithub.public_excluded_author_loc_in_window,
      total_author_commits_in_window: privateGithub.total_author_commits_in_window,
      total_author_loc_in_window: privateGithub.total_author_loc_in_window,
      total_raw_author_loc_in_window: privateGithub.total_raw_author_loc_in_window,
      total_excluded_author_loc_in_window: privateGithub.total_excluded_author_loc_in_window,
      skipped_branch_scans: privateGithub.skipped_branch_scans,
      skipped_commit_details: privateGithub.skipped_commit_details,
      github_cache_hits: privateGithub.github_cache_hits,
      github_cache_misses: privateGithub.github_cache_misses,
      github_cache_writes: privateGithub.github_cache_writes,
      github_rate_remaining: privateGithub.github_rate_remaining,
      github_rate_reset: privateGithub.github_rate_reset,
    }));
  } finally {
    await saveGithubCache(cachePath, cache);
  }
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
