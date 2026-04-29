#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${THE_MERGE_REPO_DIR:-/home/pfrpc/repos/goodalexander.github.io}"
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

tracked_dirty_outside_managed_files() {
  local managed_pattern='^(static/the-merge/telemetry\.json|static/the-merge/telemetry-history\.json)$'
  git status --porcelain --untracked-files=no | while IFS= read -r line; do
    local path="${line:3}"
    path="${path#\"}"
    path="${path%\"}"
    if [[ ! "$path" =~ $managed_pattern ]]; then
      printf '%s\n' "$line"
    fi
  done
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

  cd "$REPO_DIR"

  local current_branch
  current_branch="$(git branch --show-current)"
  if [[ "$current_branch" != "master" ]]; then
    log "Refusing to run on branch $current_branch; expected master."
    exit 1
  fi

  local dirty
  dirty="$(tracked_dirty_outside_managed_files)"
  if [[ -n "$dirty" ]]; then
    log "Refusing to run with tracked changes outside telemetry files:"
    printf '%s\n' "$dirty"
    exit 1
  fi

  export_x_bearer_from_cred_file

  git fetch origin master
  git pull --ff-only origin master

  node scripts/update-the-merge-private-github.mjs
  node scripts/update-the-merge-x-followers.mjs

  commit_and_push_if_needed
  log "Telemetry refresh completed."
}

main "$@"
