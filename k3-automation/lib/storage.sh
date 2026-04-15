
storage_update() {
  local collection="$1" id="$2" updates="$3"
  local current=$(storage_get "$collection" "$id") || return 1
  echo "$current" | jq --argjson upd "$updates" '. + $upd' | \
    storage_save "$collection" "$id"
}
