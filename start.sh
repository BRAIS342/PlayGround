#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
export PROJECT_DIR
cd "$PROJECT_DIR"
PORT="${PORT:-3000}"
export PORT
OPENCODE_WEB_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"
export OPENCODE_WEB_DIR
RUNTIME_DIR="${RUNTIME_DIR:-/home/runner/work/_temp/omgithub-runtime}"
export RUNTIME_DIR

run_timed() {
  printf '[timing] %s\n' "$*" >&2
  /usr/bin/time -p "$@"
}

if [[ -f package-lock.json ]]; then
  run_timed npm ci --no-audit --no-fund
else
  run_timed npm install --no-audit --no-fund
fi
run_timed npm run build

# Publish worker metadata outside the project; keep all build output in PROJECT_DIR/dist.
run_timed mkdir -p "$OPENCODE_WEB_DIR"
run_timed node --input-type=module -e '
  import { existsSync, mkdirSync, writeFileSync } from "node:fs";
  import { resolve, join } from "node:path";
  const project = resolve(process.env.PROJECT_DIR);
  const directory = resolve(project, "dist");
  if (!existsSync(join(directory, "index.html"))) throw new Error(`Missing built static entry: ${directory}/index.html`);
  mkdirSync(process.env.OPENCODE_WEB_DIR, { recursive: true });
  writeFileSync(join(process.env.OPENCODE_WEB_DIR, "deployment-output.json"), JSON.stringify({ project, directory }));
'

# Keep the static preview server in the foreground for the controller-owned tmux session.
run_timed ./node_modules/.bin/vite preview --host 0.0.0.0 --port "$PORT" --strictPort
