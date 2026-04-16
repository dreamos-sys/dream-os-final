#!/bin/bash
#================================================================
# Dynamic Skill Loader for Dream OS K3 (Phase 1)
#================================================================

SKILLS_DIR="${SKILLS_DIR:-$HOME/dream-live/k3-automation/skills}"

# Load a skill by name
load_skill() {
  local skill_name="$1"
  local skill_path="$SKILLS_DIR/$skill_name"
  
  if [[ ! -d "$skill_path" || ! -f "$skill_path/skill.yaml" ]]; then
    echo "[error] Skill not found: $skill_name" >&2
    return 1
  fi
  
  local main_script="$skill_path/main.sh"
  if [[ ! -f "$main_script" ]]; then
    echo "[error] main.sh not found in skill: $skill_name" >&2
    return 1
  fi
  
  source "$main_script"
  echo "[debug] ✅ Loaded skill: $skill_name" >&2
  return 0
}

# List available skills
list_skills() {
  echo "📦 Available Skills:"
  for skill_dir in "$SKILLS_DIR"/*/; do
    [[ -d "$skill_dir" ]] || continue
    local skill_name=$(basename "$skill_dir")
    local skill_file="$skill_dir/skill.yaml"
    if [[ -f "$skill_file" ]]; then
      local desc=$(grep "^description:" "$skill_file" 2>/dev/null | head -1 | cut -d: -f2- | xargs)
      echo "  • $skill_name — ${desc:-No description}"
    fi
  done
}
