# goodalexander.github.io
test ghpages round 4

## The Merge X telemetry

`scripts/update-the-merge-x-followers.mjs` refreshes the follower count in
`static/the-merge/telemetry.json` from X API v2:

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
