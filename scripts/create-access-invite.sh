#!/bin/zsh
set -euo pipefail

script_dir=${0:A:h}
project_root=${script_dir:h}
recipient_label=${1:-}

node_bin=$(command -v node || true)
if [[ -z "$node_bin" ]]; then
  node_bin="/Users/tzhang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
fi
if [[ ! -x "$node_bin" ]]; then
  print -u2 "未找到 Node.js，无法生成邀请码。"
  exit 1
fi

pnpm_bin=$(command -v pnpm || true)
if [[ -z "$pnpm_bin" ]]; then
  pnpm_bin="/Users/tzhang/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm"
fi
if [[ ! -x "$pnpm_bin" ]]; then
  print -u2 "未找到 pnpm/Wrangler，无法写入 Cloudflare D1。"
  exit 1
fi

temp_dir=$(mktemp -d /tmp/homepage-invite.XXXXXX)
chmod 700 "$temp_dir"
cleanup() {
  find "$temp_dir" -type f -delete 2>/dev/null || true
  rmdir "$temp_dir" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

json_path="$temp_dir/invite.json"
sql_path="$temp_dir/invite.sql"
if [[ -n "$recipient_label" ]]; then
  "$node_bin" "$script_dir/generate-access-invite.mjs" --label "$recipient_label" > "$json_path"
else
  "$node_bin" "$script_dir/generate-access-invite.mjs" > "$json_path"
fi
chmod 600 "$json_path"

"$node_bin" -e '
  const fs = require("fs");
  const data = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  fs.writeFileSync(process.argv[2], `${data.sql}\n`, { mode: 0o600 });
' "$json_path" "$sql_path"

export PATH="${node_bin:h}:$PATH"
"$pnpm_bin" dlx wrangler@4.45.0 d1 execute homepage-analytics --remote --file "$sql_path" >/dev/null

"$node_bin" -e '
  const fs = require("fs");
  const data = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  console.log(`邀请码：${data.code}`);
  console.log(`备注：${data.recipient_label || "未填写"}`);
  console.log(`有效期：${data.valid_days} 天`);
  const expiresShanghai = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(new Date(data.expires_at_utc));
  console.log(`到期时间：${expiresShanghai}（上海时间）`);
' "$json_path"
