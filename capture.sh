#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$PROJECT_DIR"
: "${CAPTURE_URL:?Set CAPTURE_URL to the exact preview URL.}"
: "${CAPTURE_DIR:?Set CAPTURE_DIR for screenshot evidence.}"
RUNTIME_DIR="${RUNTIME_DIR:-/home/runner/work/_temp/omgithub-runtime}"
export RUNTIME_DIR

run_timed() {
  printf '[timing] %s\n' "$*" >&2
  /usr/bin/time -p "$@"
}

CAPTURE_DIR="$(run_timed realpath -m "$CAPTURE_DIR")"
case "$CAPTURE_DIR/" in
  "$PROJECT_DIR/"*)
    printf 'CAPTURE_DIR must be outside the project: %s\n' "$CAPTURE_DIR" >&2
    exit 1
    ;;
esac
export CAPTURE_DIR
export CAPTURE_STRICT=1
export CAPTURE_START_SELECTOR="${CAPTURE_START_SELECTOR:-#startBtn}"

run_timed mkdir -p "$CAPTURE_DIR"
run_timed node "$RUNTIME_DIR/scripts/default-capture.mjs"
