const ALLOWED_ORIGINS = new Set(["https://tzhangzju.github.io"]);
const RETENTION_WINDOW = "-2 years";
const ACCESS_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;
const ACCESS_RATE_WINDOW_MINUTES = 15;
const ACCESS_RATE_MAX_FAILURES = 5;
const ACCESS_INVITE_LENGTH = 16;
const ADMIN_SESSION_TTL_SECONDS = 15 * 60;
const ACCESS_POLICY_KEY = "required_regions";
// Override with ACCESS_REQUIRED_REGIONS (comma-separated), for example
// "*" for every location or "CN:JS,CN:SH" for a regional policy. An
// explicitly empty value disables verification.
const DEFAULT_ACCESS_REQUIRED_REGIONS = "CN:JS";

const ALLOWED_EVENTS = new Set([
  "access_gate_arrival", "access_gate_cached_grant", "access_gate_check", "access_gate_granted",
  "access_gate_ip_allowlist", "access_gate_local_bypass", "access_gate_rejected",
  "access_gate_service_error", "access_gate_submit", "access_gate_view",
  "analytics_consent_accept", "back_to_top_click", "contact_embodied_model_click",
  "contact_github_click", "contact_zhihu_click", "content_copy", "context_menu_open",
  "demo_fold_box_video_click", "demo_fold_cloth_lab_video_click",
  "demo_fold_cloth_video_click", "demo_ink_rubbing_video_click",
  "demo_suitcase_packing_video_click",
  "dual_stream_memory_project_click", "email_contact_click", "github_magic_w0_click",
  "github_realtime_vla_click", "hero_view_work_click", "language_toggle_click",
  "location_permission_later_click", "location_permission_retry_click",
  "location_update", "magic_brain_chinese_article_click",
  "magic_brain_english_article_click", "magic_brain_project_click",
  "magic_w0_project_click", "mobile_menu_toggle_click", "molmospaces_leaderboard_click",
  "nav_about_click", "nav_demos_click", "nav_papers_click", "nav_system_click",
  "nav_work_click", "page_print_attempt", "page_save_shortcut_attempt", "page_stay",
  "page_view", "paper_dual_stream_memory_click",
  "paper_execution_aligned_noise_click", "paper_magic_w0_click",
  "paper_realtime_vla_click", "paper_rm_wam_click", "paper_tarsphere_click",
  "paper_trajectory_peaks_click", "ppt_download_click", "privacy_settings_click",
  "realtime_vla_project_click", "resource_download_click", "resource_media_open",
  "robodojo_leaderboard_click", "roborsi_project_click", "screenshot_shortcut_attempt", "theme_toggle_click",
  "vla_interview_click"
]);

// Representative district-level postal codes. Reverse-geocoding providers do
// not always return a postcode even when they resolve a Chinese district, and
// Cloudflare's fallback postcode may only represent the municipality.
const DISTRICT_POSTAL_CODES = new Map([
  ["310101", "200001"], ["310104", "200030"], ["310105", "200050"],
  ["310106", "200040"], ["310107", "200333"], ["310109", "200086"],
  ["310110", "200082"], ["310112", "201100"], ["310113", "201900"],
  ["310114", "201800"], ["310115", "200135"], ["310116", "201540"],
  ["310117", "201600"], ["310118", "201700"], ["310120", "201400"],
  ["310151", "202150"]
]);

const DISTRICT_NAMES = new Map([
  ["310101", "黄浦区"], ["310104", "徐汇区"], ["310105", "长宁区"],
  ["310106", "静安区"], ["310107", "普陀区"], ["310109", "虹口区"],
  ["310110", "杨浦区"], ["310112", "闵行区"], ["310113", "宝山区"],
  ["310114", "嘉定区"], ["310115", "浦东新区"], ["310116", "金山区"],
  ["310117", "松江区"], ["310118", "青浦区"], ["310120", "奉贤区"],
  ["310151", "崇明区"]
]);

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://tzhangzju.github.io",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-store",
    "Vary": "Origin"
  };
}

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers }
  });
}

function getClientIp(request) {
  return request.headers.get("CF-Connecting-IP")
    || request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim()
    || "unknown";
}

function parseIpv4(address) {
  const parts = address.split(".");
  if (parts.length !== 4) return null;
  let value = 0n;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const octet = Number(part);
    if (octet > 255) return null;
    value = (value << 8n) | BigInt(octet);
  }
  return value;
}

function parseIpv6(address) {
  const normalized = address.toLowerCase().split("%")[0];
  if (!normalized.includes(":")) return null;
  const split = normalized.split("::");
  if (split.length > 2) return null;
  const left = split[0] ? split[0].split(":") : [];
  const right = split[1] ? split[1].split(":") : [];
  const missing = 8 - left.length - right.length;
  if ((split.length === 2 && missing < 1) || (split.length === 1 && missing !== 0)) return null;
  const parts = [...left, ...Array(Math.max(0, missing)).fill("0"), ...right];
  if (parts.length !== 8 || parts.some((part) => !/^[0-9a-f]{1,4}$/.test(part))) return null;
  return parts.reduce((value, part) => (value << 16n) | BigInt(`0x${part}`), 0n);
}

function ipMatchesRule(ipAddress, rawRule) {
  const rule = rawRule.trim();
  if (!rule) return false;
  const [network, prefixText] = rule.split("/");
  if (!prefixText) return ipAddress.toLowerCase() === network.toLowerCase();
  const isIpv6 = network.includes(":");
  if (isIpv6 !== ipAddress.includes(":")) return false;
  const bits = isIpv6 ? 128 : 32;
  const prefix = Number(prefixText);
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > bits) return false;
  const ipValue = isIpv6 ? parseIpv6(ipAddress) : parseIpv4(ipAddress);
  const networkValue = isIpv6 ? parseIpv6(network) : parseIpv4(network);
  if (ipValue === null || networkValue === null) return false;
  if (prefix === 0) return true;
  const shift = BigInt(bits - prefix);
  return (ipValue >> shift) === (networkValue >> shift);
}

function isIpAllowlisted(request, env) {
  const ipAddress = getClientIp(request);
  const configured = typeof env.ACCESS_IP_ALLOWLIST === "string"
    ? env.ACCESS_IP_ALLOWLIST.split(",")
    : [];
  return configured.some((rule) => ipMatchesRule(ipAddress, rule));
}

function normalizeRegionName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "")
    .replace(/(?:province|省)$/u, "");
}

function parseAccessRegions(rawValue) {
  return String(rawValue || "").split(",").map((value) => value.trim()).filter(Boolean);
}

function configuredAccessRegions(env) {
  const rawValue = typeof env.ACCESS_REQUIRED_REGIONS === "string"
    ? env.ACCESS_REQUIRED_REGIONS
    : DEFAULT_ACCESS_REQUIRED_REGIONS;
  return parseAccessRegions(rawValue);
}

function regionMatchesRule(cf, rawRule) {
  if (rawRule === "*") return true;
  const country = String(cf.country || "").trim().toUpperCase();
  const regionCode = String(cf.regionCode || "").trim().toUpperCase();
  const regionName = normalizeRegionName(cf.region);
  const [ruleCountry, ruleRegion, ...extra] = rawRule.split(":").map((value) => value.trim());
  if (extra.length) return false;

  if (ruleRegion !== undefined) {
    if (ruleCountry && ruleCountry.toUpperCase() !== country) return false;
    return ruleRegion.toUpperCase() === regionCode
      || normalizeRegionName(ruleRegion) === regionName;
  }

  return ruleCountry.toUpperCase() === regionCode
    || normalizeRegionName(ruleCountry) === regionName;
}

async function accessVerificationPolicy(request, env) {
  const cf = request.cf || {};
  const storedPolicy = await readAccessPolicy(env);
  const matchedRule = storedPolicy.regions.find((rule) => regionMatchesRule(cf, rule)) || null;
  return {
    required: Boolean(matchedRule),
    matchedRule,
    regions: storedPolicy.regions,
    source: storedPolicy.source,
    country: String(cf.country || "").trim().toUpperCase(),
    regionCode: String(cf.regionCode || "").trim().toUpperCase(),
    region: String(cf.region || "").trim()
  };
}

function bytesToBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value) {
  try {
    const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
}

function constantTimeEqual(left, right) {
  if (!(left instanceof Uint8Array) || !(right instanceof Uint8Array) || left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ right[index];
  return difference === 0;
}

async function sha256Hex(value) {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
  return [...digest].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function signAccessValue(value, secret, algorithm = "SHA-256") {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: algorithm },
    false,
    ["sign"]
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
}

function decodeBase32(value) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const normalized = String(value || "").toUpperCase().replace(/[^A-Z2-7]/g, "");
  if (!normalized) return null;
  let bits = "";
  for (const character of normalized) {
    const index = alphabet.indexOf(character);
    if (index < 0) return null;
    bits += index.toString(2).padStart(5, "0");
  }
  const bytes = [];
  for (let index = 0; index + 8 <= bits.length; index += 8) {
    bytes.push(Number.parseInt(bits.slice(index, index + 8), 2));
  }
  return new Uint8Array(bytes);
}

async function generateTotp(secret, timestampMs) {
  const secretBytes = decodeBase32(secret);
  if (!secretBytes) return null;
  let counter = BigInt(Math.floor(timestampMs / 30000));
  const counterBytes = new Uint8Array(8);
  for (let index = 7; index >= 0; index -= 1) {
    counterBytes[index] = Number(counter & 0xffn);
    counter >>= 8n;
  }
  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, counterBytes));
  const offset = digest.at(-1) & 0x0f;
  const binary = ((digest[offset] & 0x7f) << 24)
    | (digest[offset + 1] << 16)
    | (digest[offset + 2] << 8)
    | digest[offset + 3];
  return String(binary % 1000000).padStart(6, "0");
}

async function verifyTotp(code, secret) {
  if (!/^\d{6}$/.test(code) || !secret) return false;
  const now = Date.now();
  for (const offset of [-30000, 0, 30000]) {
    const expected = await generateTotp(secret, now + offset);
    if (expected && constantTimeEqual(new TextEncoder().encode(code), new TextEncoder().encode(expected))) {
      return true;
    }
  }
  return false;
}

function normalizeInviteCode(value) {
  return String(value || "").toUpperCase().replace(/[^A-Z2-9]/g, "").slice(0, ACCESS_INVITE_LENGTH);
}

function formatInviteCode(value) {
  const normalized = normalizeInviteCode(value);
  return normalized.match(/.{1,4}/g)?.join("-") || normalized;
}

async function redeemInviteCode(request, env, rawCode, ipHash) {
  const code = normalizeInviteCode(rawCode);
  if (code.length !== ACCESS_INVITE_LENGTH) return false;
  const codeHash = await sha256Hex(code);
  const userAgentHash = (await sha256Hex(request.headers.get("User-Agent") || "")).slice(0, 24);
  try {
    const redeemed = await env.DB.prepare(`
      UPDATE access_invites
      SET used_at = CURRENT_TIMESTAMP, used_ip_hash = ?, used_user_agent_hash = ?
      WHERE code_hash = ? AND used_at IS NULL AND expires_at > CURRENT_TIMESTAMP
      RETURNING id
    `).bind(ipHash, userAgentHash, codeHash).first();
    return Number.isInteger(Number(redeemed?.id))
      ? { inviteId: Number(redeemed.id), accessCode: formatInviteCode(code) }
      : null;
  } catch {
    return null;
  }
}

async function recordAccessGrant(env, grant) {
  await env.DB.prepare(`
    INSERT INTO access_grants (
      grant_id, access_method, invite_id, access_code, expires_at
    ) VALUES (?, ?, ?, ?, ?)
  `).bind(
    grant.grantId,
    grant.accessMethod,
    grant.inviteId,
    grant.accessCode,
    grant.expiresAt.replace("T", " ").replace(/\.\d{3}Z$/, "")
  ).run();
  await env.DB.prepare(`
    DELETE FROM access_grants WHERE created_at < datetime('now', '-2 years')
  `).run();
}

async function lookupAccessGrant(env, grantId) {
  if (!grantId) return null;
  try {
    return await env.DB.prepare(`
      SELECT access_method, invite_id, access_code
      FROM access_grants WHERE grant_id = ?
    `).bind(grantId).first();
  } catch {
    return null;
  }
}

async function createAccessToken(request, env, claims = {}) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    v: 2,
    iat: now,
    exp: now + ACCESS_TOKEN_TTL_SECONDS,
    ua: (await sha256Hex(request.headers.get("User-Agent") || "")).slice(0, 24),
    gid: claims.grantId || crypto.randomUUID(),
    am: claims.accessMethod || "unknown",
    iid: Number.isInteger(claims.inviteId) ? claims.inviteId : null
  };
  const encodedPayload = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await signAccessValue(encodedPayload, env.ACCESS_TOKEN_SECRET);
  const grant = {
    token: `${encodedPayload}.${bytesToBase64Url(signature)}`,
    expiresAt: new Date(payload.exp * 1000).toISOString(),
    grantId: payload.gid,
    accessMethod: payload.am,
    inviteId: payload.iid,
    accessCode: claims.accessCode || null
  };
  await recordAccessGrant(env, grant);
  return grant;
}

async function verifyAccessToken(request, env) {
  if (!env.ACCESS_TOKEN_SECRET) return false;
  const authorization = request.headers.get("Authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  const [encodedPayload, encodedSignature, ...rest] = token.split(".");
  if (!encodedPayload || !encodedSignature || rest.length) return false;
  const suppliedSignature = base64UrlToBytes(encodedSignature);
  if (!suppliedSignature) return false;
  const expectedSignature = await signAccessValue(encodedPayload, env.ACCESS_TOKEN_SECRET);
  if (!constantTimeEqual(suppliedSignature, expectedSignature)) return false;
  const payloadBytes = base64UrlToBytes(encodedPayload);
  if (!payloadBytes) return false;
  try {
    const payload = JSON.parse(new TextDecoder().decode(payloadBytes));
    const now = Math.floor(Date.now() / 1000);
    if (![1, 2].includes(payload.v) || !Number.isFinite(payload.exp) || payload.exp <= now) return false;
    const userAgentHash = (await sha256Hex(request.headers.get("User-Agent") || "")).slice(0, 24);
    if (payload.ua !== userAgentHash) return false;
    return payload;
  } catch {
    return false;
  }
}

function adminHeaders() {
  return {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Security-Policy": "default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
    "Referrer-Policy": "no-referrer"
  };
}

function normalizeAdminPolicy(rawValue) {
  const value = typeof rawValue === "string" ? rawValue.trim() : "";
  if (!value) return { value: "", regions: [] };
  if (value.length > 300) return null;
  const regions = [...new Set(parseAccessRegions(value))];
  if (!regions.length || regions.length > 20) return null;
  if (regions.includes("*") && regions.length !== 1) return null;
  if (regions.some((rule) => rule !== "*" && !/^[A-Za-z]{2}(?::[A-Za-z0-9_-]{1,50})?$/.test(rule))) return null;
  return { value: regions.join(","), regions };
}

async function createAdminSession(request, env) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    v: 1,
    scope: "access_policy_admin",
    iat: now,
    exp: now + ADMIN_SESSION_TTL_SECONDS,
    ua: (await sha256Hex(request.headers.get("User-Agent") || "")).slice(0, 24)
  };
  const encodedPayload = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await signAccessValue(encodedPayload, env.ACCESS_TOKEN_SECRET);
  return `${encodedPayload}.${bytesToBase64Url(signature)}`;
}

async function verifyAdminSession(request, env) {
  if (!env.ACCESS_TOKEN_SECRET) return false;
  const authorization = request.headers.get("Authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  const [encodedPayload, encodedSignature, ...rest] = token.split(".");
  if (!encodedPayload || !encodedSignature || rest.length) return false;
  const suppliedSignature = base64UrlToBytes(encodedSignature);
  if (!suppliedSignature) return false;
  const expectedSignature = await signAccessValue(encodedPayload, env.ACCESS_TOKEN_SECRET);
  if (!constantTimeEqual(suppliedSignature, expectedSignature)) return false;
  const payloadBytes = base64UrlToBytes(encodedPayload);
  if (!payloadBytes) return false;
  try {
    const payload = JSON.parse(new TextDecoder().decode(payloadBytes));
    const userAgentHash = (await sha256Hex(request.headers.get("User-Agent") || "")).slice(0, 24);
    return payload?.v === 1
      && payload.scope === "access_policy_admin"
      && Number.isFinite(payload.exp)
      && payload.exp > Math.floor(Date.now() / 1000)
      && payload.ua === userAgentHash;
  } catch {
    return false;
  }
}

function fallbackPolicyValue(env) {
  return typeof env.ACCESS_REQUIRED_REGIONS === "string"
    ? env.ACCESS_REQUIRED_REGIONS
    : DEFAULT_ACCESS_REQUIRED_REGIONS;
}

async function readAccessPolicy(env) {
  try {
    const stored = await env.DB.prepare(`
      SELECT policy_value, updated_at FROM access_policy WHERE policy_key = ?
    `).bind(ACCESS_POLICY_KEY).first();
    if (typeof stored?.policy_value === "string") {
      return {
        value: stored.policy_value,
        regions: parseAccessRegions(stored.policy_value),
        source: "d1",
        updatedAt: stored.updated_at || null
      };
    }
  } catch {
    // The worker remains usable before migration or if D1 has a transient failure.
  }
  const value = fallbackPolicyValue(env);
  return { value, regions: parseAccessRegions(value), source: "environment", updatedAt: null };
}

async function handleAdminSession(request, env) {
  if (!env.ACCESS_TOTP_SECRET || !env.ACCESS_TOKEN_SECRET) {
    return json({ ok: false, error: "admin_service_unavailable" }, 503, { "Cache-Control": "no-store" });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_code" }, 400, { "Cache-Control": "no-store" });
  }
  const code = typeof body.code === "string" ? body.code.replace(/\D/g, "") : "";
  const clientIp = getClientIp(request);
  const ipHash = await sha256Hex(`${clientIp}:${env.ACCESS_TOKEN_SECRET}`);
  const failures = await accessFailureCount(env, ipHash);
  if (failures >= ACCESS_RATE_MAX_FAILURES) {
    return json({ ok: false, error: "rate_limited" }, 429, { "Cache-Control": "no-store", "Retry-After": String(ACCESS_RATE_WINDOW_MINUTES * 60) });
  }
  const valid = await verifyTotp(code, env.ACCESS_TOTP_SECRET);
  await recordAccessAttempt(env, ipHash, valid);
  if (!valid) return json({ ok: false, error: "invalid_code" }, 401, { "Cache-Control": "no-store" });
  const token = await createAdminSession(request, env);
  return json({ ok: true, token, expires_in_seconds: ADMIN_SESSION_TTL_SECONDS }, 200, { "Cache-Control": "no-store" });
}

async function handleAdminPolicyRead(request, env) {
  if (!(await verifyAdminSession(request, env))) {
    return json({ ok: false, error: "admin_unauthorized" }, 401, { "Cache-Control": "no-store" });
  }
  const policy = await readAccessPolicy(env);
  return json({ ok: true, policy }, 200, { "Cache-Control": "no-store" });
}

async function handleAdminPolicyUpdate(request, env) {
  if (!(await verifyAdminSession(request, env))) {
    return json({ ok: false, error: "admin_unauthorized" }, 401, { "Cache-Control": "no-store" });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_policy" }, 400, { "Cache-Control": "no-store" });
  }
  const policy = normalizeAdminPolicy(body.required_regions);
  if (!policy) return json({ ok: false, error: "invalid_policy" }, 400, { "Cache-Control": "no-store" });
  try {
    await env.DB.prepare(`
      INSERT INTO access_policy (policy_key, policy_value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(policy_key) DO UPDATE SET
        policy_value = excluded.policy_value,
        updated_at = CURRENT_TIMESTAMP
    `).bind(ACCESS_POLICY_KEY, policy.value).run();
  } catch {
    return json({ ok: false, error: "policy_store_unavailable" }, 503, { "Cache-Control": "no-store" });
  }
  return json({
    ok: true,
    policy: { ...policy, source: "d1", updatedAt: new Date().toISOString() }
  }, 200, { "Cache-Control": "no-store" });
}

const ADMIN_PAGE = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>访问策略管理</title><style>
:root{color-scheme:light;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#142734;background:#f2f6f6}*{box-sizing:border-box}body{margin:0;min-height:100svh;display:grid;place-items:center;padding:20px}.panel{width:min(100%,480px);background:#fff;border:1px solid #c8d8d8;border-radius:18px;padding:28px;box-shadow:0 16px 48px #16323818}h1{font-size:25px;margin:0 0 8px}.eyebrow{font-size:12px;letter-spacing:.12em;color:#16857f;font-weight:700}.description,.note{line-height:1.6;color:#526874;font-size:14px}.field{display:grid;gap:8px;margin:22px 0 14px;font-weight:650;font-size:14px}input{width:100%;padding:14px;border:1px solid #9fc8c6;border-radius:10px;font:inherit;font-size:18px;letter-spacing:.12em}.action,.preset{border:0;border-radius:10px;padding:13px 16px;font:inherit;font-weight:700;cursor:pointer}.action{width:100%;background:#16857f;color:#fff}.preset{background:#edf5f4;color:#123f3d;text-align:left}.presets{display:grid;gap:10px;margin:18px 0}.preset small{display:block;margin-top:4px;color:#607680;font-weight:400}.status{min-height:24px;margin:14px 0 0;font-size:14px;color:#526874}.status.error{color:#ae2533}.status.ok{color:#147a5f}.current{padding:14px;border-left:4px solid #16857f;background:#f5fafa;border-radius:8px;word-break:break-word}.custom{display:flex;gap:8px;margin-top:12px}.custom input{font-size:15px;letter-spacing:0}.custom button{white-space:nowrap}.logout{margin-top:18px;background:none;border:0;color:#526874;text-decoration:underline;font:inherit;cursor:pointer}@media(max-width:420px){body{padding:12px}.panel{padding:22px 18px;border-radius:14px}.custom{display:block}.custom button{width:100%;margin-top:8px}}
</style></head><body><main class="panel"><div class="eyebrow">ACCESS · 管理</div><h1>访问验证码策略</h1><p class="description">使用身份验证器当前的 6 位动态码登录。登录后 15 分钟内可直接切换策略。</p>
<form id="login"><label class="field">动态验证码<input id="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="6 位数字" required></label><button class="action" type="submit">进入管理</button></form>
<section id="controls" hidden><p class="current">当前策略：<strong id="current">读取中</strong></p><div class="presets"><button class="preset" data-policy="CN:JS">仅江苏省需要验证码<small>其他地区自动放行</small></button><button class="preset" data-policy="*">所有地区需要验证码<small>全局访问保护</small></button><button class="preset" data-policy="">关闭地域验证码<small>所有地区自动放行</small></button></div><label class="field">自定义规则（逗号分隔）<input id="custom" placeholder="例如：CN:JS,CN:SH"></label><button id="apply-custom" class="action" type="button">应用自定义规则</button><button id="logout" class="logout" type="button">退出管理</button></section><p id="status" class="status" role="status"></p><p class="note">规则保存到数据库后即时生效，无需重新发布网站。</p></main>
<script>
const key='homepage-access-policy-admin-v1';const status=document.querySelector('#status');const login=document.querySelector('#login');const controls=document.querySelector('#controls');const current=document.querySelector('#current');const custom=document.querySelector('#custom');
function message(text,type=''){status.textContent=text;status.className='status '+type}function token(){return sessionStorage.getItem(key)||''}function headers(){return {'Authorization':'Bearer '+token(),'Content-Type':'application/json'}}function label(value){if(value==='CN:JS')return '仅江苏省需要验证码';if(value==='*')return '所有地区需要验证码';if(!value)return '关闭地域验证码';return value}
async function response(response){const body=await response.json().catch(()=>({}));if(response.status===401){sessionStorage.removeItem(key);controls.hidden=true;login.hidden=false}if(!response.ok)throw new Error(body.error||'操作失败');return body}
async function load(){if(!token())return;try{const body=await response(await fetch('/admin/policy',{headers:headers()}));current.textContent=label(body.policy.value);custom.value=body.policy.value;login.hidden=true;controls.hidden=false;message('已连接数据库策略。','ok')}catch(error){message('登录已失效，请重新输入动态码。','error')}}
async function update(value){try{message('正在保存…');const body=await response(await fetch('/admin/policy',{method:'PUT',headers:headers(),body:JSON.stringify({required_regions:value})}));current.textContent=label(body.policy.value);custom.value=body.policy.value;message('已保存，访问规则即时生效。','ok')}catch(error){message(error.message,'error')}}
login.addEventListener('submit',async(event)=>{event.preventDefault();try{message('正在验证…');const body=await response(await fetch('/admin/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:document.querySelector('#code').value})}));sessionStorage.setItem(key,body.token);document.querySelector('#code').value='';await load()}catch(error){message('动态验证码无效或已过期。','error')}});document.querySelectorAll('[data-policy]').forEach(button=>button.addEventListener('click',()=>update(button.dataset.policy)));document.querySelector('#apply-custom').addEventListener('click',()=>update(custom.value));document.querySelector('#logout').addEventListener('click',()=>{sessionStorage.removeItem(key);controls.hidden=true;login.hidden=false;message('已退出管理。')});load();
</script></body></html>`;

async function ensureAccessAttemptTable(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS access_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attempted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ip_hash TEXT NOT NULL,
      succeeded INTEGER NOT NULL DEFAULT 0
    )
  `).run();
  await env.DB.prepare(`
    CREATE INDEX IF NOT EXISTS idx_access_attempts_ip_time
    ON access_attempts (ip_hash, attempted_at)
  `).run();
}

async function accessFailureCount(env, ipHash) {
  await ensureAccessAttemptTable(env);
  const result = await env.DB.prepare(`
    SELECT COUNT(*) AS count FROM access_attempts
    WHERE ip_hash = ? AND succeeded = 0
      AND attempted_at >= datetime('now', ?)
  `).bind(ipHash, `-${ACCESS_RATE_WINDOW_MINUTES} minutes`).first();
  return Number(result?.count || 0);
}

async function recordAccessAttempt(env, ipHash, succeeded) {
  await ensureAccessAttemptTable(env);
  await env.DB.prepare(`
    INSERT INTO access_attempts (ip_hash, succeeded) VALUES (?, ?)
  `).bind(ipHash, succeeded ? 1 : 0).run();
  if (succeeded) {
    await env.DB.prepare(`DELETE FROM access_attempts WHERE ip_hash = ? AND succeeded = 0`)
      .bind(ipHash).run();
  }
  await env.DB.prepare(`DELETE FROM access_attempts WHERE attempted_at < datetime('now', '-2 days')`).run();
}

async function handleAccessStatus(request, env, headers) {
  if (isIpAllowlisted(request, env)) {
    const grant = await createAccessToken(request, env, { accessMethod: "ip_allowlist" });
    return json({
      ok: true,
      allowed: true,
      method: "ip_allowlist",
      token: grant.token,
      expires_at: grant.expiresAt,
      access_grant_id: grant.grantId,
      access_method: grant.accessMethod
    }, 200, headers);
  }
  const policy = await accessVerificationPolicy(request, env);
  const tokenPayload = await verifyAccessToken(request, env);
  if (tokenPayload && (tokenPayload.am !== "region_bypass" || !policy.required)) {
    return json({
      ok: true,
      allowed: true,
      method: "access_token",
      access_grant_id: tokenPayload.gid || null,
      access_method: tokenPayload.am || "legacy_token",
      invite_id: Number.isInteger(tokenPayload.iid) ? tokenPayload.iid : null
    }, 200, headers);
  }
  if (!policy.required) {
    const grant = await createAccessToken(request, env, { accessMethod: "region_bypass" });
    return json({
      ok: true,
      allowed: true,
      method: "region_bypass",
      token: grant.token,
      expires_at: grant.expiresAt,
      access_grant_id: grant.grantId,
      access_method: grant.accessMethod,
      access_required: false
    }, 200, headers);
  }
  return json({ ok: true, allowed: false, access_required: true }, 401, headers);
}

async function handleAccessVerification(request, env, headers) {
  if (isIpAllowlisted(request, env)) {
    const grant = await createAccessToken(request, env, { accessMethod: "ip_allowlist" });
    return json({
      ok: true,
      allowed: true,
      method: "ip_allowlist",
      token: grant.token,
      expires_at: grant.expiresAt,
      access_grant_id: grant.grantId,
      access_method: grant.accessMethod
    }, 200, headers);
  }
  if (!(await accessVerificationPolicy(request, env)).required) {
    const grant = await createAccessToken(request, env, { accessMethod: "region_bypass" });
    return json({
      ok: true,
      allowed: true,
      method: "region_bypass",
      token: grant.token,
      expires_at: grant.expiresAt,
      access_grant_id: grant.grantId,
      access_method: grant.accessMethod,
      access_required: false
    }, 200, headers);
  }
  if (!env.ACCESS_TOTP_SECRET || !env.ACCESS_TOKEN_SECRET) {
    return json({ ok: false, allowed: false, error_message: "访问验证服务尚未完成配置。" }, 503, headers);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, allowed: false, error_message: "请输入有效的验证码。" }, 400, headers);
  }

  const clientIp = getClientIp(request);
  const ipHash = await sha256Hex(`${clientIp}:${env.ACCESS_TOKEN_SECRET}`);
  const failures = await accessFailureCount(env, ipHash);
  if (failures >= ACCESS_RATE_MAX_FAILURES) {
    return json({
      ok: false,
      allowed: false,
      error_message: `尝试次数过多，请 ${ACCESS_RATE_WINDOW_MINUTES} 分钟后重试。`
    }, 429, { ...headers, "Retry-After": String(ACCESS_RATE_WINDOW_MINUTES * 60) });
  }

  const rawCode = typeof body.code === "string" ? body.code.trim() : "";
  const totpCode = rawCode.replace(/\D/g, "");
  const isTotpCandidate = /^\d{6}$/.test(totpCode) && /^[\d\s-]+$/.test(rawCode);
  const totpValid = isTotpCandidate && await verifyTotp(totpCode, env.ACCESS_TOTP_SECRET);
  const invite = !totpValid ? await redeemInviteCode(request, env, rawCode, ipHash) : null;
  const inviteValid = Number.isInteger(invite?.inviteId);
  const valid = totpValid || inviteValid;
  await recordAccessAttempt(env, ipHash, valid);
  if (!valid) {
    return json({ ok: false, allowed: false, error_message: "验证码无效、已过期或已使用，请重新确认。" }, 401, headers);
  }

  const accessMethod = inviteValid ? "invite_code" : "totp";
  const grant = await createAccessToken(request, env, {
    accessMethod,
    inviteId: invite?.inviteId ?? null,
    accessCode: inviteValid ? invite.accessCode : totpCode
  });
  return json({
    ok: true,
    allowed: true,
    method: accessMethod,
    token: grant.token,
    expires_at: grant.expiresAt,
    access_grant_id: grant.grantId,
    access_method: grant.accessMethod,
    invite_id: grant.inviteId
  }, 200, headers);
}

function shouldPromptForLocation(cf) {
  if (String(cf.country || "").toUpperCase() !== "CN") return false;

  const regionCode = String(cf.regionCode || "").toUpperCase();
  if (regionCode === "JS") return true;

  const region = String(cf.region || "").toLowerCase();
  const city = String(cf.city || "").toLowerCase();
  const coarseLocation = `${region} ${city}`;
  return coarseLocation.includes("jiangsu")
    || coarseLocation.includes("江苏");
}

function classifyDevice(userAgent) {
  if (/iPad|Tablet/i.test(userAgent)) return "tablet";
  if (/Mobi|Android|iPhone|iPod/i.test(userAgent)) return "mobile";
  return "desktop";
}

function classifyBrowser(userAgent) {
  if (!userAgent) return "Unknown";

  // App-embedded browsers must be checked before their Chromium/WebKit engine.
  if (/MicroMessenger/i.test(userAgent)) return /wxwork/i.test(userAgent) ? "WeCom" : "WeChat";
  if (/DingTalk/i.test(userAgent)) return "DingTalk";
  if (/Lark|Feishu/i.test(userAgent)) return "Feishu/Lark";
  if (/AlipayClient/i.test(userAgent)) return "Alipay";
  if (/AliApp\(TB|WindVane/i.test(userAgent)) return "Taobao";
  if (/baiduboxapp/i.test(userAgent)) return "Baidu App";
  if (/Weibo/i.test(userAgent)) return "Weibo";
  if (/Instagram/i.test(userAgent)) return "Instagram";
  if (/FBAN|FBAV/i.test(userAgent)) return "Facebook";
  if (/ChatGPT|OpenAI|Codex/i.test(userAgent)) return "ChatGPT/Codex";
  if (/LinkedInApp/i.test(userAgent)) return "LinkedIn";
  if (/Twitter/i.test(userAgent)) return "X/Twitter";
  if (/Telegram/i.test(userAgent)) return "Telegram";
  if (/(?:^|\s)Line\//i.test(userAgent)) return "LINE";
  if (/musical_ly|TikTok/i.test(userAgent)) return "TikTok";
  if (/aweme|BytedanceWebview/i.test(userAgent)) return "Douyin";
  if (/XiaoHongShu|XHS/i.test(userAgent)) return "Xiaohongshu";
  if (/MQQBrowser/i.test(userAgent)) return "QQ Browser";
  if (/(?:^|\s)QQ\//i.test(userAgent)) return "QQ";
  if (/GSA\//i.test(userAgent)) return "Google App";

  // Vendor browsers and privacy browsers generally include a Chrome token too.
  if (/HuaweiBrowser/i.test(userAgent)) return "Huawei Browser";
  if (/SamsungBrowser/i.test(userAgent)) return "Samsung Internet";
  if (/MiuiBrowser/i.test(userAgent)) return "MIUI Browser";
  if (/VivoBrowser/i.test(userAgent)) return "vivo Browser";
  if (/HeyTapBrowser|OppoBrowser/i.test(userAgent)) return "OPPO Browser";
  if (/Quark/i.test(userAgent)) return "Quark";
  if (/UCBrowser|UCWEB/i.test(userAgent)) return "UC Browser";
  if (/QHBrowser|360SE|360EE/i.test(userAgent)) return "360 Browser";
  if (/MetaSr|SogouMobileBrowser/i.test(userAgent)) return "Sogou Browser";
  if (/DuckDuckGo/i.test(userAgent)) return "DuckDuckGo";
  if (/YaBrowser/i.test(userAgent)) return "Yandex Browser";
  if (/Vivaldi/i.test(userAgent)) return "Vivaldi";
  if (/Brave/i.test(userAgent)) return "Brave";
  if (/Whale/i.test(userAgent)) return "Naver Whale";
  if (/Arc\//i.test(userAgent)) return "Arc";

  // Standalone browsers and generic system WebViews.
  if (/EdgiOS|EdgA|Edg\//i.test(userAgent)) return "Edge";
  if (/OPiOS|OPR\/|Opera Mini|Opera Mobi/i.test(userAgent)) return "Opera";
  if (/FxiOS|Firefox\//i.test(userAgent)) return "Firefox";
  if (/Electron/i.test(userAgent)) return "Electron";
  if (/HeadlessChrome/i.test(userAgent)) return "Headless Chrome";
  if (/CriOS|Chrome\//i.test(userAgent) && !/; wv\)|\bwv\b|Version\/4\.0/i.test(userAgent)) return "Chrome";
  if (/Android/i.test(userAgent) && /; wv\)|\bwv\b|Version\/4\.0/i.test(userAgent)) return "Android WebView";
  if (/iPhone|iPad|iPod/i.test(userAgent) && /AppleWebKit/i.test(userAgent) && !/Safari\//i.test(userAgent)) return "iOS WebView";
  if (/Version\/[^ ]+.*Safari\//i.test(userAgent)) return "Safari";
  if (/MSIE|Trident\//i.test(userAgent)) return "Internet Explorer";
  return "Other";
}

function classifyOS(userAgent) {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
  if (/Android/i.test(userAgent)) return "Android";
  if (/Windows/i.test(userAgent)) return "Windows";
  if (/Mac OS X|Macintosh/i.test(userAgent)) return "macOS";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "Other";
}

function optionalNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function optionalNumericValue(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function optionalNonNegativeInteger(value, maximum = Number.MAX_SAFE_INTEGER) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.min(Math.round(value), maximum)
    : null;
}

function optionalText(value, maxLength = 200) {
  return typeof value === "string" && value ? value.slice(0, maxLength) : null;
}

function classifyIPVersion(ipAddress) {
  if (typeof ipAddress !== "string" || !ipAddress) return "unknown";
  if (ipAddress.includes(":")) return "IPv6";
  if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(ipAddress)) return "IPv4";
  return "unknown";
}

function resolvePostalCode(details, cf, hasReverseGeocode) {
  const providerPostalCode = optionalText(details.postal_code, 30);
  if (!hasReverseGeocode) return providerPostalCode || cf.postalCode || null;

  const districtCode = String(details.district_code || "").replace(/\D/g, "");
  const districtPostalCode = DISTRICT_POSTAL_CODES.get(districtCode);
  if (districtPostalCode && (!providerPostalCode || providerPostalCode === "200000")) {
    return districtPostalCode;
  }
  return providerPostalCode || districtPostalCode || cf.postalCode || null;
}

function selectDistrictFromReverseGeocode(data) {
  const administrative = Array.isArray(data?.localityInfo?.administrative)
    ? data.localityInfo.administrative
    : [];
  const district = [...administrative].reverse().find((item) => {
    const code = String(item?.chinaAdminCode || "").replace(/\D/g, "");
    return code.length >= 6 || Number(item?.adminLevel) >= 6;
  });
  const districtCode = String(district?.chinaAdminCode || "").replace(/\D/g, "");
  const districtName = DISTRICT_NAMES.get(districtCode)
    || optionalText(district?.name)
    || optionalText(data?.locality);
  if (!districtName) return null;

  return {
    country_code: optionalText(data?.countryCode, 10),
    region: optionalText(data?.principalSubdivision),
    region_code: optionalText(data?.principalSubdivisionCode, 30),
    city: optionalText(data?.city) || optionalText(data?.locality),
    district: districtName,
    district_code: districtCode || null,
    postal_code: optionalText(data?.postcode, 30),
    provider: "BigDataCloud"
  };
}

async function inferDistrictFromIpCoordinates(env, latitude, longitude) {
  try {
    const cached = await env.DB.prepare(`
      SELECT country, region, region_code, city, district, district_code,
             postal_code, geocoding_provider
      FROM analytics_events
      WHERE location_source = 'ip_reverse_geocode'
        AND ip_latitude = ? AND ip_longitude = ?
        AND district IS NOT NULL
      ORDER BY id DESC
      LIMIT 1
    `).bind(latitude, longitude).first();
    if (cached?.district) {
      return {
        country_code: cached.country,
        region: cached.region,
        region_code: cached.region_code,
        city: cached.city,
        district: cached.district,
        district_code: cached.district_code,
        postal_code: cached.postal_code,
        provider: cached.geocoding_provider || "BigDataCloud"
      };
    }
  } catch {
    // A cache miss or transient D1 read failure should not block analytics.
  }

  try {
    const endpoint = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client");
    endpoint.searchParams.set("latitude", String(latitude));
    endpoint.searchParams.set("longitude", String(longitude));
    endpoint.searchParams.set("localityLanguage", "en");
    const response = await fetch(endpoint, {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(2500)
    });
    if (!response.ok) return null;
    return selectDistrictFromReverseGeocode(await response.json());
  } catch {
    return null;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin);

    if (request.method === "GET" && url.pathname === "/admin") {
      return new Response(ADMIN_PAGE, { status: 200, headers: adminHeaders() });
    }

    if (request.method === "POST" && url.pathname === "/admin/session") {
      return handleAdminSession(request, env);
    }

    if (request.method === "GET" && url.pathname === "/admin/policy") {
      return handleAdminPolicyRead(request, env);
    }

    if (request.method === "PUT" && url.pathname === "/admin/policy") {
      return handleAdminPolicyUpdate(request, env);
    }

    if (url.pathname === "/health") {
      return json({ ok: true, service: "homepage-analytics-pages", consent_version: "v31-jiangsu-access-gate", gateway_version: "v32-d1-access-policy" }, 200, headers);
    }

    if (request.method === "OPTIONS" && url.pathname.startsWith("/access/")) {
      return new Response(null, { status: 204, headers });
    }

    if (request.method === "GET" && url.pathname === "/access/status") {
      if (!ALLOWED_ORIGINS.has(origin)) {
        return json({ ok: false, error: "origin_not_allowed" }, 403, headers);
      }
      return handleAccessStatus(request, env, headers);
    }

    if (request.method === "POST" && url.pathname === "/access/verify") {
      if (!ALLOWED_ORIGINS.has(origin)) {
        return json({ ok: false, error: "origin_not_allowed" }, 403, headers);
      }
      return handleAccessVerification(request, env, headers);
    }

    if (request.method === "GET" && url.pathname === "/location-policy") {
      if (!ALLOWED_ORIGINS.has(origin)) {
        return json({ ok: false, error: "origin_not_allowed" }, 403, headers);
      }
      return json({
        ok: true,
        prompt_for_location: shouldPromptForLocation(request.cf || {})
      }, 200, headers);
    }

    if (request.method === "OPTIONS" && url.pathname === "/events") {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== "POST" || url.pathname !== "/events") {
      return json({ ok: false, error: "not_found" }, 404, headers);
    }

    if (!ALLOWED_ORIGINS.has(origin)) {
      return json({ ok: false, error: "origin_not_allowed" }, 403, headers);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: "invalid_json" }, 400, headers);
    }

    if (!ALLOWED_EVENTS.has(body.event)) {
      return json({ ok: false, error: "event_not_allowed" }, 400, headers);
    }

    const sourcePage = typeof body.source_page === "string" ? body.source_page.slice(0, 500) : "";
    if (!sourcePage.startsWith("https://tzhangzju.github.io")) {
      return json({ ok: false, error: "invalid_source_page" }, 400, headers);
    }

    const userAgent = request.headers.get("User-Agent") || "";
    const acceptLanguage = request.headers.get("Accept-Language") || "";
    const cfRay = request.headers.get("CF-Ray") || "";
    const secChUa = request.headers.get("Sec-CH-UA") || "";
    const secChUaMobile = request.headers.get("Sec-CH-UA-Mobile") || "";
    const secChUaPlatform = request.headers.get("Sec-CH-UA-Platform") || "";
    const doNotTrack = request.headers.get("DNT") || "";
    const globalPrivacyControl = request.headers.get("Sec-GPC") || "";
    const cf = request.cf || {};
    const location = body.location && typeof body.location === "object" ? body.location : {};
    const details = location.details && typeof location.details === "object" ? location.details : {};
    const context = body.context && typeof body.context === "object" ? body.context : {};
    const latitude = optionalNumber(location.latitude);
    const longitude = optionalNumber(location.longitude);
    const hasGps = latitude !== null && latitude >= -90 && latitude <= 90
      && longitude !== null && longitude >= -180 && longitude <= 180;
    const ipLatitude = optionalNumericValue(cf.latitude);
    const ipLongitude = optionalNumericValue(cf.longitude);
    const ipDetails = !hasGps && ipLatitude !== null && ipLongitude !== null
      ? await inferDistrictFromIpCoordinates(env, ipLatitude, ipLongitude)
      : null;
    const effectiveDetails = hasGps ? details : (ipDetails || {});
    const hasGpsReverseGeocode = hasGps && optionalText(details.district);
    const hasIpReverseGeocode = !hasGps && optionalText(ipDetails?.district);

    const ipAddress = request.headers.get("CF-Connecting-IP") || "unknown";
    const accessGrant = await verifyAccessToken(request, env);
    const accessGrantRecord = accessGrant ? await lookupAccessGrant(env, accessGrant.gid) : null;

    await env.DB.prepare(`
      INSERT INTO analytics_events (
        event_name, event_id, visitor_id, session_id,
        source_page, referrer, ip_address, ip_version,
        country, region, region_code, city, postal_code, timezone,
        district, district_code, location_source, geocoding_provider,
        device, browser, operating_system, consent_version,
        latitude, longitude, location_accuracy_m, location_captured_at,
        duration_ms, active_duration_ms, resource_type, resource_target,
        interaction_method, selected_text_length, ip_latitude, ip_longitude,
        asn, as_organization, edge_colo, continent, http_protocol, tls_version,
        client_tcp_rtt_ms, user_agent, accept_language, client_context_json,
        cf_ray, metro_code, tls_cipher, request_priority,
        sec_ch_ua, sec_ch_ua_mobile, sec_ch_ua_platform,
        do_not_track, global_privacy_control,
        access_grant_id, access_method, invite_id, access_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      body.event,
      optionalText(body.event_id, 100),
      optionalText(body.visitor_id, 100),
      optionalText(body.session_id, 100),
      sourcePage,
      typeof body.referrer === "string" ? body.referrer.slice(0, 500) : "",
      ipAddress,
      classifyIPVersion(ipAddress),
      optionalText(effectiveDetails.country_code, 10) || cf.country || null,
      optionalText(effectiveDetails.region) || cf.region || null,
      optionalText(effectiveDetails.region_code, 30) || cf.regionCode || null,
      optionalText(effectiveDetails.city) || cf.city || null,
      (hasGpsReverseGeocode || hasIpReverseGeocode)
        ? resolvePostalCode(effectiveDetails, cf, true)
        : (cf.postalCode || null),
      cf.timezone || null,
      optionalText(effectiveDetails.district),
      optionalText(effectiveDetails.district_code, 30),
      hasGpsReverseGeocode
        ? "gps_reverse_geocode"
        : (hasIpReverseGeocode ? "ip_reverse_geocode" : (hasGps ? "gps" : "ip")),
      (hasGpsReverseGeocode || hasIpReverseGeocode)
        ? optionalText(effectiveDetails.provider, 50)
        : null,
      classifyDevice(userAgent),
      classifyBrowser(userAgent),
      classifyOS(userAgent),
      typeof body.consent_version === "string" ? body.consent_version.slice(0, 30) : "v31-jiangsu-access-gate",
      hasGps ? latitude : null,
      hasGps ? longitude : null,
      optionalNumber(location.accuracy),
      typeof location.captured_at === "string" ? location.captured_at.slice(0, 50) : null,
      optionalNonNegativeInteger(context.duration_ms, 604800000),
      optionalNonNegativeInteger(context.active_duration_ms, 604800000),
      optionalText(context.resource_type, 50),
      optionalText(context.resource_target, 500),
      optionalText(context.interaction_method, 50),
      optionalNonNegativeInteger(context.selected_text_length, 1000000),
      ipLatitude,
      ipLongitude,
      optionalNonNegativeInteger(cf.asn, 4294967295),
      optionalText(cf.asOrganization, 200),
      optionalText(cf.colo, 20),
      optionalText(cf.continent, 10),
      optionalText(cf.httpProtocol, 30),
      optionalText(cf.tlsVersion, 30),
      optionalNonNegativeInteger(cf.clientTcpRtt, 600000),
      optionalText(userAgent, 500),
      optionalText(acceptLanguage, 300),
      JSON.stringify(context).slice(0, 4000),
      optionalText(cfRay, 100),
      optionalText(cf.metroCode, 30),
      optionalText(cf.tlsCipher, 100),
      optionalText(cf.requestPriority, 100),
      optionalText(secChUa, 500),
      optionalText(secChUaMobile, 20),
      optionalText(secChUaPlatform, 100),
      optionalText(doNotTrack, 20),
      optionalText(globalPrivacyControl, 20),
      accessGrant ? optionalText(accessGrant.gid, 100) : null,
      accessGrant ? optionalText(accessGrant.am, 30) : null,
      accessGrant && Number.isInteger(accessGrant.iid) ? accessGrant.iid : null,
      accessGrantRecord ? optionalText(accessGrantRecord.access_code, 50) : null
    ).run();

    // page_stay is a cumulative session summary rather than a click stream.
    // Insert the newest snapshot first, then remove older snapshots. Keeping
    // this order prevents a transient data gap if an insert ever fails.
    if (body.event === "page_stay" && typeof body.session_id === "string" && body.session_id) {
      try {
        const sessionId = body.session_id.slice(0, 100);
        await env.DB.prepare(`
          DELETE FROM analytics_events
          WHERE event_name = 'page_stay'
            AND session_id = ?
            AND id NOT IN (
              SELECT MAX(id)
              FROM analytics_events
              WHERE event_name = 'page_stay' AND session_id = ?
            )
        `).bind(sessionId, sessionId).run();
      } catch {
        // The newly inserted snapshot remains available. A later snapshot will
        // retry compaction, which is safer than failing or losing the summary.
      }
    }

    // Apply rolling retention after successful writes. This keeps the database
    // at a maximum two-year history without requiring a separate cron worker.
    await env.DB.prepare(`
      DELETE FROM analytics_events
      WHERE occurred_at < datetime('now', ?)
    `).bind(RETENTION_WINDOW).run();

    return json({ ok: true }, 201, headers);
  }
};
