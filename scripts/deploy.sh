#!/usr/bin/env bash
# Build the app and sync the static output to the server.
#
# The site is served by the shared Caddy edge proxy on the box (~/edge on the
# server), which mounts ~/sites/dotactics read-only and serves it as a SPA.
# Nothing on the server needs restarting: Caddy reads files straight off disk,
# so a sync is a deploy.
#
# Requires an SSH alias for the server (see DEPLOY_HOST) and a local .env with
# VITE_API_TOKEN set — Vite bakes it into the bundle at build time.
set -euo pipefail

DEPLOY_HOST="${DEPLOY_HOST:-renz}"
DEPLOY_PATH="${DEPLOY_PATH:-sites/dotactics/}"

cd "$(dirname "$0")/.."

npm run build

rsync --archive --checksum --compress --delete --human-readable --itemize-changes \
  dist/ "${DEPLOY_HOST}:${DEPLOY_PATH}"

echo "Deployed to https://dotactics.renzivan.com"
