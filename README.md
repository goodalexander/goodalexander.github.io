# goodalexander.github.io
test ghpages round 4

## The Merge X telemetry

`scripts/update-the-merge-x-followers.mjs` refreshes the follower count in
`static/the-merge/telemetry.json` from X API v2, pulls redacted Task Node metrics
from the public merge telemetry endpoint, and upserts a daily snapshot in
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

The scheduled GitHub Actions workflow `.github/workflows/update-the-merge-telemetry.yml`
runs every 30 minutes, commits the refreshed telemetry snapshot, and deploys
GitHub Pages. Configure the needed X credentials as repository Actions secrets.
Task Node rewards, task counts, context updates, DAU, and wallet-interaction
counts come from:

`https://tasknode.postfiat.org/api/public/merge-telemetry?wallet=<wallet>`

Override with `THE_MERGE_TASKNODE_METRICS_URL` or `THE_MERGE_WALLET_ADDRESS`
only if the public endpoint or wallet changes.

The history file is the durable cache for growth-rate math. The updater keeps a
rolling 365-day `snapshots` array and derives `telemetry.series` from it so
week-over-week dashboard calculations do not depend on transient current values
or Git history scraping.
