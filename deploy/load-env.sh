# shellcheck shell=bash
# Load .env from project root into the current shell (does not overwrite existing exports).
deploy_load_env() {
  local env_file="$1"
  [[ -f "$env_file" ]] || return 0
  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%%#*}"
    line="${line//$'\r'/}"
    line="${line#"${line%%[![:space:]]*}"}"
    line="${line%"${line##*[![:space:]]}"}"
    [[ -z "$line" ]] && continue
    [[ "$line" != *=* ]] && continue
    local key="${line%%=*}"
    local val="${line#*=}"
    key="${key%"${key##*[![:space:]]}"}"
    key="${key#"${key%%[![:space:]]*}"}"
    val="${val#"${val%%[![:space:]]*}"}"
    val="${val%"${val##*[![:space:]]}"}"
    if [[ "$val" == \"*\" && "$val" == *\" ]]; then val="${val:1:-1}"; fi
    if [[ "$val" == \'*\' && "$val" == *\' ]]; then val="${val:1:-1}"; fi
    if [[ -z "${!key+x}" ]]; then
      export "$key=$val"
    fi
  done < "$env_file"
}

_deploy_script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
deploy_load_env "${_deploy_script_dir}/../.env"
