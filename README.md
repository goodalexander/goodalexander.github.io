# goodalexander.github.io
test ghpages round 4

## The Merge X telemetry

`scripts/update-the-merge-x-followers.mjs` refreshes the follower count in
`static/the-merge/telemetry.json` from X API v2:

```bash
X_BEARER_TOKEN=... node scripts/update-the-merge-x-followers.mjs
```

The script also accepts `X_API_KEY` and `X_API_SECRET`; it exchanges those app
API credentials for an app-only bearer token before calling:

`https://api.x.com/2/users/by/username/goodalexander?user.fields=created_at,public_metrics,verified,verified_type`

The scheduled GitHub Actions workflow `.github/workflows/update-the-merge-telemetry.yml`
runs every 30 minutes, commits the refreshed telemetry snapshot, and deploys
GitHub Pages. Configure either `X_BEARER_TOKEN` or both `X_API_KEY` and
`X_API_SECRET` as repository Actions secrets.
