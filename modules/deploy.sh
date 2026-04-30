#!/bin/bash
# Module: deploy.sh — Auto git workflow
deploy_task() {
  local msg="$1"
  echo "🚀 Shipping: $msg" >&2
  git add -A
  git commit -m "$msg 🤲 Bi idznillah"
  git push origin main
  echo "✅ Deployed with barakah!" >&2
}
# Auto-expose function if sourced
[[ "${BASH_SOURCE[0]}" != "${0}" ]] && export -f deploy_task
