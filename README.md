# goodalexander.github.io
test ghpages round 4

## The Merge X telemetry

`scripts/update-the-merge-x-followers.mjs` refreshes the follower count in
`static/the-merge/telemetry.json` from X API v2, pulls redacted Task Node metrics
and the current wallet NFT profile image from the public merge telemetry endpoint,
and upserts a daily snapshot in
`static/the-merge/telemetry-history.json`:

```bash
X_BEARER_TOKEN=... node scripts/update-the-merge-x-followers.mjs
```

The script accepts any one of these auth configurations:

- `X_BEARER_TOKEN`
- `X_API_KEY` and `X_API_SECRET`
- `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, and `X_ACCESS_TOKEN_SECRET`

With only `X_API_KEY` and `X_API_SECRET`, it exchanges those app API credentials
for an app-only bearer token. With the access token pair present, it signs the
request with OAuth 1.0a user-context credentials. Both paths call:

`https://api.x.com/2/users/by/username/goodalexander?user.fields=created_at,public_metrics,verified,verified_type`

The GitHub Actions workflow `.github/workflows/update-the-merge-telemetry.yml`
is kept for manual dispatch. The scheduled writer runs locally on the
authenticated machine so private GitHub LOC can be included without publishing a
broad private-repo token into GitHub Actions.
Task Node rewards, task counts, context updates, DAU, wallet-interaction counts,
and the profile NFT image come from:

`https://tasknode.postfiat.org/api/public/merge-telemetry?wallet=<wallet>`

Override with `THE_MERGE_TASKNODE_METRICS_URL` or `THE_MERGE_WALLET_ADDRESS`
only if the public endpoint or wallet changes.

The history file is the durable cache for growth-rate math. The updater keeps a
rolling 365-day `snapshots` array and derives `telemetry.series` from it so
week-over-week dashboard calculations do not depend on transient current values
or Git history scraping.

## The Merge GitHub telemetry

`scripts/update-the-merge-private-github.mjs` refreshes the redacted GitHub
aggregate from the authenticated `gh` session on this machine:

```bash
node scripts/update-the-merge-private-github.mjs
node scripts/update-the-merge-x-followers.mjs
```

The GitHub script scans accessible public and private repos/branches, filters
commits to the authenticated GitHub user plus configured author emails, buckets
activity by commit/landed date, and publishes only aggregate counts. It writes
separate public, private, and total LOC/commit counters, but never writes repo
names, branch names, commit SHAs, commit messages, or file paths into the
persisted public telemetry file. Each run backfills the daily GitHub buckets
for the scanned window instead of trusting stale prior snapshots.
The local runner also adds a redacted local-workspace aggregate from
`THE_MERGE_LOCAL_REPOS_ROOT` (default `/home/pfrpc/repos`) so uncommitted
tracked work is represented in the daily velocity chart without publishing repo
names, file paths, or patch contents. Untracked files are excluded by default;
set `THE_MERGE_LOCAL_WORKSPACE_INCLUDE_UNTRACKED=1` only for a deliberate
backfill.
Generated benchmark JSON under `static/benchmarks/*.json` and generated Merge
telemetry JSON under `static/the-merge/telemetry*.json` are hard-excluded from
the headline LOC counters and retained only in `*_raw_*` / `*_excluded_*`
aggregate fields so artifact dumps do not masquerade as code velocity.

The scheduled GitHub Actions telemetry workflow does not have this machine's
private `gh` login. If the local GitHub aggregate has not been refreshed for
the current UTC date, the public telemetry updater writes zero GitHub LOC for
that date instead of carrying yesterday's LOC forward.

`scripts/refresh-the-merge-local-telemetry.sh` is the cron-safe local runner.
It acquires a lock, refreshes private GitHub plus Task Node/X telemetry from an
isolated publisher checkout at
`/home/pfrpc/.local/state/goodalexander/the-merge-telemetry-repo`, commits only
the two generated telemetry JSON files, and pushes to `master` so the normal
Pages deploy runs. The editable website checkout at
`/home/pfrpc/repos/goodalexander.github.io` is used only to discover the
`origin` URL, so local content edits cannot block telemetry publishing. Override
the publisher checkout with `THE_MERGE_PUBLISH_REPO_DIR` or the remote URL with
`THE_MERGE_REMOTE_URL`. If `/home/pfrpc/repos/new_creds.txt` exists, it exports
the first `BEARER_TOKEN` from that local-only file for the X lookup.
