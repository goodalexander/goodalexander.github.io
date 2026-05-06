#!/usr/bin/env bash
set -euo pipefail

SOURCE_REPO_DIR="${THE_MERGE_REPO_DIR:-/home/pfrpc/repos/goodalexander.github.io}"
PUBLISH_REPO_DIR="${THE_MERGE_PUBLISH_REPO_DIR:-/home/pfrpc/.local/state/goodalexander/the-merge-telemetry-repo}"
LOCK_FILE="${THE_MERGE_LOCK_FILE:-/tmp/goodalexander-the-merge-telemetry.lock}"
CRED_FILE="${THE_MERGE_LOCAL_CRED_FILE:-/home/pfrpc/repos/new_creds.txt}"
MANAGED_FILES=(
  "static/the-merge/telemetry.json"
  "static/the-merge/telemetry-history.json"
)

export PATH="/home/pfrpc/.local/bin:/usr/local/bin:/usr/bin:/bin:${PATH:-}"

log() {
  printf '[%s] %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$*"
}

origin_url() {
  if [[ -n "${THE_MERGE_REMOTE_URL:-}" ]]; then
    printf '%s\n' "$THE_MERGE_REMOTE_URL"
    return
  fi

  if [[ -d "$SOURCE_REPO_DIR/.git" ]]; then
    git -C "$SOURCE_REPO_DIR" remote get-url origin
    return
  fi

  printf '%s\n' "https://github.com/goodalexander/goodalexander.github.io.git"
}

ensure_publish_checkout() {
  local remote_url
  remote_url="$(origin_url)"

  if [[ ! -d "$PUBLISH_REPO_DIR/.git" ]]; then
    if [[ -e "$PUBLISH_REPO_DIR" ]]; then
      log "Refusing to use $PUBLISH_REPO_DIR because it exists but is not a git checkout."
      exit 1
    fi

    mkdir -p "$(dirname "$PUBLISH_REPO_DIR")"
    log "Creating isolated telemetry publisher checkout at $PUBLISH_REPO_DIR."
    git clone --branch master "$remote_url" "$PUBLISH_REPO_DIR"
  fi

  cd "$PUBLISH_REPO_DIR"
  git remote set-url origin "$remote_url"
  git fetch origin master
  git checkout -B master origin/master
  git reset --hard origin/master
  git clean -fd
}

export_x_bearer_from_cred_file() {
  if [[ -n "${X_BEARER_TOKEN:-}" || ! -r "$CRED_FILE" ]]; then
    return
  fi

  local token
  token="$(
    awk -F= '
      toupper($1) ~ /^[[:space:]]*BEARER_TOKEN[[:space:]]*$/ {
        value=$2
        gsub(/^[[:space:]]+|[[:space:]\r]+$/, "", value)
        if (value != "") {
          print value
          exit
        }
      }
    ' "$CRED_FILE"
  )"
  if [[ -n "$token" ]]; then
    export X_BEARER_TOKEN="$token"
  fi
}

commit_and_push_if_needed() {
  if git diff --quiet -- "${MANAGED_FILES[@]}"; then
    log "No telemetry changes to commit."
    return
  fi

  git add "${MANAGED_FILES[@]}"
  git config user.name "goodalexander"
  git config user.email "goodalexander@gmail.com"
  git commit -m "Refresh The Merge local telemetry"
  git push origin HEAD:master
}

main() {
  exec 9>"$LOCK_FILE"
  if ! flock -n 9; then
    log "Another telemetry refresh is already running; exiting."
    exit 0
  fi

  export_x_bearer_from_cred_file
  ensure_publish_checkout

  node scripts/update-the-merge-private-github.mjs
  node scripts/update-the-merge-x-followers.mjs

  commit_and_push_if_needed
  log "Telemetry refresh completed."
}

main "$@"
