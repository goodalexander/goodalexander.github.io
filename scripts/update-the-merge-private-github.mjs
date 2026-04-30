import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const DEFAULT_TELEMETRY_PATH = 'static/the-merge/telemetry.json';
const DEFAULT_HISTORY_FILENAME = 'telemetry-history.json';
const DEFAULT_WINDOW_DAYS = 14;
const DEFAULT_REPO_AFFILIATION = 'owner,collaborator,organization_member';
const API_BASE = 'https://api.github.com';

function readEnv(name) {
  const value = process.env[name];
  return typeof value === 'string' && value.trim() ? value.trim() : '';
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
    commitsToday: 0,
    locToday: 0,
    additionsToday: 0,
    deletionsToday: 0,
  };
}

function addCommitStats(stats, {
  additions,
  deletions,
  loc,
  isToday,
}) {
  stats.commitsInWindow += 1;
  stats.additionsInWindow += additions;
  stats.deletionsInWindow += deletions;
  stats.locInWindow += loc;
  if (isToday) {
    stats.commitsToday += 1;
    stats.additionsToday += additions;
    stats.deletionsToday += deletions;
    stats.locToday += loc;
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

async function resolveGithubLogin(token) {
  const configured = readEnv('THE_MERGE_GITHUB_AUTHOR') || readEnv('GITHUB_AUTHOR_LOGIN');
  if (configured) {
    return configured;
  }
  const viewer = await githubRequest('/user', token);
  if (!viewer?.login) {
    throw new Error('Could not resolve authenticated GitHub login.');
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
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
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
    throw new Error(`GitHub API request failed (${response.status}): ${message}`);
  }
  return parsed;
}

async function githubPaginatedRequest(endpoint, token, params = {}) {
  const rows = [];
  let nextUrl = buildApiUrl(endpoint, { per_page: 100, ...params }).toString();
  while (nextUrl) {
    const response = await fetch(nextUrl, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
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

async function listCandidateRepos(token) {
  const affiliation = readEnv('THE_MERGE_GITHUB_AFFILIATION') || DEFAULT_REPO_AFFILIATION;
  const repos = await githubPaginatedRequest('/user/repos', token, {
    visibility: 'all',
    affiliation,
    sort: 'updated',
  });
  return repos.filter((repo) => repo && !repo.archived && !repo.disabled);
}

async function listBranches(repo, token) {
  return githubPaginatedRequest(repoEndpoint(repo, '/branches'), token)
    .then((branches) => branches.map((branch) => branch?.name).filter(Boolean));
}

async function listCommitsForBranch(repo, branch, author, sinceIso, token) {
  return githubPaginatedRequest(repoEndpoint(repo, '/commits'), token, {
    sha: branch,
    since: sinceIso,
    author,
  });
}

async function getCommitDetail(repo, sha, token) {
  return githubRequest(repoEndpoint(repo, `/commits/${encodeURIComponent(sha)}`), token);
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
}) {
  const generatedAt = new Date().toISOString();
  const since = new Date(Date.now() - (windowDays * 24 * 60 * 60 * 1000)).toISOString();
  const today = dateKey(generatedAt);
  const repos = await listCandidateRepos(token);
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
      branches = await listBranches(repo, token);
    } catch {
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
        commits = await listCommitsForBranch(item.repo, item.branch, item.author, since, token);
      } catch {
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
            authoredAt: commit.commit?.author?.date || commit.commit?.committer?.date || null,
          });
        }
      });
    });
  });

  const commits = Array.from(commitMap.values());
  const privateStats = emptyGithubStats();
  const publicStats = emptyGithubStats();
  const totalStats = emptyGithubStats();

  await runLimited(commits, 6, async (commit) => {
    let detail = null;
    try {
      detail = await getCommitDetail(commit.repo, commit.sha, token);
    } catch {
      skippedCommitDetails += 1;
      return;
    }
    const stats = detail?.stats || {};
    const commitAdditions = toFiniteNumber(stats.additions);
    const commitDeletions = toFiniteNumber(stats.deletions);
    const commitLoc = toFiniteNumber(stats.total) || commitAdditions + commitDeletions;
    const authoredAt = detail?.commit?.author?.date || detail?.commit?.committer?.date || commit.authoredAt;
    const commitStats = {
      additions: commitAdditions,
      deletions: commitDeletions,
      loc: commitLoc,
      isToday: dateKey(authoredAt) === today,
    };
    addCommitStats(commit.private ? privateStats : publicStats, commitStats);
    addCommitStats(totalStats, commitStats);
  });

  const aggregate = {
    generated_at: generatedAt,
    window_days: windowDays,
    scanned_repos: repos.length,
    scanned_private_repos: privateRepos.length,
    scanned_public_repos: publicRepos.length,
    scanned_branches: scannedBranches,
    skipped_branch_scans: skippedBranchScans,
    skipped_commit_details: skippedCommitDetails,
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
  let row = telemetry.series.find((entry) => entry?.date === today);
  if (!row) {
    row = { date: today };
    telemetry.series.push(row);
  }
  row.github_private_commits = privateGithub.private_commits_today;
  row.github_private_loc = privateGithub.private_loc_today;
  row.github_private_additions = privateGithub.private_additions_today;
  row.github_private_deletions = privateGithub.private_deletions_today;
  row.github_public_commits = privateGithub.public_commits_today;
  row.github_public_loc = privateGithub.public_loc_today;
  row.github_public_additions = privateGithub.public_additions_today;
  row.github_public_deletions = privateGithub.public_deletions_today;
  row.github_total_commits = privateGithub.total_commits_today;
  row.github_total_loc = privateGithub.total_loc_today;
  row.github_total_additions = privateGithub.total_additions_today;
  row.github_total_deletions = privateGithub.total_deletions_today;
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
  let row = history.snapshots.find((entry) => entry?.date === today);
  if (!row) {
    row = { date: today };
    history.snapshots.push(row);
  }
  row.updated_at = privateGithub.generated_at;
  row.github_private_commits = privateGithub.private_commits_today;
  row.github_private_loc = privateGithub.private_loc_today;
  row.github_private_additions = privateGithub.private_additions_today;
  row.github_private_deletions = privateGithub.private_deletions_today;
  row.github_public_commits = privateGithub.public_commits_today;
  row.github_public_loc = privateGithub.public_loc_today;
  row.github_public_additions = privateGithub.public_additions_today;
  row.github_public_deletions = privateGithub.public_deletions_today;
  row.github_total_commits = privateGithub.total_commits_today;
  row.github_total_loc = privateGithub.total_loc_today;
  row.github_total_additions = privateGithub.total_additions_today;
  row.github_total_deletions = privateGithub.total_deletions_today;
  row.sources = {
    ...(row.sources || {}),
    github_private: 'redacted_private_github_snapshot',
    github_public: 'redacted_public_github_snapshot',
    github_total: 'redacted_github_snapshot',
  };
  history.snapshots.sort((left, right) => String(left.date || '').localeCompare(String(right.date || '')));
  await fs.writeFile(historyPath, stableStringify(history));
  return history;
}

async function main() {
  const telemetryPath = path.resolve(readEnv('THE_MERGE_TELEMETRY_PATH') || DEFAULT_TELEMETRY_PATH);
  const historyPath = path.resolve(
    readEnv('THE_MERGE_HISTORY_PATH') || path.join(path.dirname(telemetryPath), DEFAULT_HISTORY_FILENAME)
  );
  const windowDays = parsePositiveInteger(readEnv('THE_MERGE_GITHUB_WINDOW_DAYS'), DEFAULT_WINDOW_DAYS);
  const token = await resolveGithubToken();
  const authorLogin = await resolveGithubLogin(token);
  const authorEmails = await resolveAuthorEmails();
  const privateGithub = await collectPrivateGithubAggregate({
    token,
    authorLogin,
    authorEmails,
    windowDays,
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
    public_commits_today: privateGithub.public_commits_today,
    public_loc_today: privateGithub.public_loc_today,
    total_commits_today: privateGithub.total_commits_today,
    total_loc_today: privateGithub.total_loc_today,
    private_author_commits_in_window: privateGithub.private_author_commits_in_window,
    private_author_loc_in_window: privateGithub.private_author_loc_in_window,
    public_author_commits_in_window: privateGithub.public_author_commits_in_window,
    public_author_loc_in_window: privateGithub.public_author_loc_in_window,
    total_author_commits_in_window: privateGithub.total_author_commits_in_window,
    total_author_loc_in_window: privateGithub.total_author_loc_in_window,
    skipped_branch_scans: privateGithub.skipped_branch_scans,
    skipped_commit_details: privateGithub.skipped_commit_details,
  }));
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
