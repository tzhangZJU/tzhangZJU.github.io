import assert from "node:assert/strict";
import { createHash, createHmac } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const workerSource = await readFile(join(projectRoot, "cloudflare-pages-gateway", "_worker.js"), "utf8");
const accessPolicyMigration = await readFile(join(projectRoot, "cloudflare-migrations", "0005_access_policy.sql"), "utf8");
const frontendSource = await readFile(join(projectRoot, "script.js"), "utf8");
const homepageSource = await readFile(join(projectRoot, "index.html"), "utf8");
const worker = await import(`data:text/javascript;base64,${Buffer.from(workerSource).toString("base64")}`);

assert.match(homepageSource, /class="access-gate__panel" hidden/);
assert.equal((homepageSource.match(/data-i18n-href="roboRsiHref"/g) || []).length, 2);
assert.match(frontendSource, /roboRsiHref: "https:\/\/embodied\.magiclab\.top\/works\/embodied-rsi\/index\.html"/);
assert.match(frontendSource, /roboRsiHref: "https:\/\/embodied\.magiclab\.top\/works\/embodied-rsi\/en\.html"/);
assert.match(frontendSource, /document\.querySelectorAll\("\[data-i18n-href\]"\)/);
assert.match(homepageSource, /href="https:\/\/weixin\.qq\.com\/sph\/Af3bcGyxVc"/);
assert.match(homepageSource, /data-analytics-event="wrc_report_click"/);
assert.match(homepageSource, /src="assets\/demos\/wrc-report-cover\.png"/);
assert.match(frontendSource, /wrcReportTitle: "WRC 现场报道"/);
assert.match(frontendSource, /wrcReportTitle: "WRC on-site report"/);
assert.match(frontendSource, /包括衣服折叠、纸箱封包、年画拓印等。/);
assert.match(frontendSource, /const analyticsConsentVersion = "v31-jiangsu-access-gate"/);
assert.match(frontendSource, /document\.querySelectorAll\("\[data-i18n-alt\]"\)/);
assert.match(workerSource, /const ACCESS_POLICY_KEY = "required_regions"/);
assert.match(workerSource, /url\.pathname === "\/admin\/policy"/);
assert.match(accessPolicyMigration, /CREATE TABLE IF NOT EXISTS access_policy/);

const preAccessAnalytics = frontendSource.match(/function initializePreAccessAnalytics\(\) \{([\s\S]*?)\n\}/)?.[1] || "";
assert.match(preAccessAnalytics, /trackAnalyticsEvent\("access_gate_arrival"\)/);
assert.doesNotMatch(preAccessAnalytics, /trackPageView\(\)/);

const accessGateInitialization = frontendSource.match(/async function initializeAccessGate\(\) \{([\s\S]*?)\n\}/)?.[1] || "";
assert.ok(
  accessGateInitialization.indexOf('trackAnalyticsEvent("access_gate_check")')
    < accessGateInitialization.indexOf('trackAnalyticsEvent("access_gate_view")')
);

const completedGrant = frontendSource.match(/function completeAccessGrant\(method\) \{([\s\S]*?)\n\}/)?.[1] || "";
assert.ok(
  completedGrant.indexOf('trackAnalyticsEvent("access_gate_granted"')
    < completedGrant.indexOf("trackPageView()")
);

const totpSecret = "JBSWY3DPEHPK3PXP";
const tokenSecret = "test-session-secret-with-sufficient-entropy";
const inviteCode = "ABCD-EFGH-JKLM-NPQR";
const inviteHash = createHash("sha256").update(inviteCode.replaceAll("-", "")).digest("hex");
const unusedInviteHashes = new Set([inviteHash]);
const accessGrantRecords = new Map();
let lastAnalyticsBindings = null;
let storedAccessPolicy = null;
const database = {
  prepare(sql) {
    let bindings = [];
    const statement = {
      bind(...values) { bindings = values; return statement; },
      async first() {
        if (/SELECT policy_value(?:, updated_at)?\s+FROM access_policy/i.test(sql)) {
          return storedAccessPolicy;
        }
        if (/UPDATE access_invites/i.test(sql)) {
          const hash = bindings[2];
          return unusedInviteHashes.delete(hash) ? { id: 42 } : null;
        }
        if (/SELECT access_method, invite_id, access_code\s+FROM access_grants/i.test(sql)) {
          return accessGrantRecords.get(bindings[0]) || null;
        }
        return { count: 0 };
      },
      async run() {
        if (/INSERT INTO access_policy/i.test(sql)) {
          storedAccessPolicy = { policy_value: bindings[1], updated_at: "2026-11-14 00:00:00" };
        }
        if (/INSERT INTO access_grants/i.test(sql)) {
          accessGrantRecords.set(bindings[0], {
            access_method: bindings[1],
            invite_id: bindings[2],
            access_code: bindings[3]
          });
        }
        if (/INSERT INTO analytics_events/i.test(sql)) lastAnalyticsBindings = bindings;
        return { success: true, meta: { changes: 0 } };
      }
    };
    return statement;
  }
};

function decodeBase32(value) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (const character of value) bits += alphabet.indexOf(character).toString(2).padStart(5, "0");
  const bytes = [];
  for (let index = 0; index + 8 <= bits.length; index += 8) {
    bytes.push(Number.parseInt(bits.slice(index, index + 8), 2));
  }
  return Buffer.from(bytes);
}

function currentTotp(secret) {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 30000)));
  const digest = createHmac("sha1", decodeBase32(secret)).update(counter).digest();
  const offset = digest.at(-1) & 0x0f;
  return String((digest.readUInt32BE(offset) & 0x7fffffff) % 1000000).padStart(6, "0");
}

function makeRequest(path, options = {}) {
  const { cf = { country: "CN", regionCode: "JS", region: "Jiangsu" }, ...requestOptions } = options;
  const headers = new Headers(options.headers || {});
  headers.set("Origin", "https://tzhangzju.github.io");
  headers.set("User-Agent", "AccessGateTest/1.0");
  if (!headers.has("CF-Connecting-IP")) headers.set("CF-Connecting-IP", "198.51.100.8");
  const request = new Request(`https://homepage-analytics-mobile.pages.dev${path}`, { ...requestOptions, headers });
  Object.defineProperty(request, "cf", { value: cf });
  return request;
}

const environment = {
  ACCESS_IP_ALLOWLIST: "203.0.113.9,2001:db8:abcd::/48",
  ACCESS_TOKEN_SECRET: tokenSecret,
  ACCESS_TOTP_SECRET: totpSecret,
  ACCESS_REQUIRED_REGIONS: "CN:JS",
  DB: database
};

assert.match(workerSource, /const DEFAULT_ACCESS_REQUIRED_REGIONS = "CN:JS"/);
assert.match(workerSource, /if \(rawRule === "\*"\) return true/);

const denied = await worker.default.fetch(makeRequest("/access/status"), environment);
assert.equal(denied.status, 401);
const deniedBody = await denied.json();
assert.equal(deniedBody.allowed, false);
assert.equal(deniedBody.access_required, true);

const nonJiangsuBypass = await worker.default.fetch(makeRequest("/access/status", {
  headers: { "CF-Connecting-IP": "198.51.100.20" },
  cf: { country: "CN", regionCode: "SH", region: "Shanghai" }
}), environment);
assert.equal(nonJiangsuBypass.status, 200);
assert.equal((await nonJiangsuBypass.json()).method, "region_bypass");

storedAccessPolicy = { policy_value: "CN:SH", updated_at: "2026-11-14 00:00:00" };
const storedPolicyJiangsuBypass = await worker.default.fetch(makeRequest("/access/status", {
  headers: { "CF-Connecting-IP": "198.51.100.24" }
}), environment);
assert.equal(storedPolicyJiangsuBypass.status, 200);
assert.equal((await storedPolicyJiangsuBypass.json()).method, "region_bypass");
const storedPolicyShanghaiDenied = await worker.default.fetch(makeRequest("/access/status", {
  headers: { "CF-Connecting-IP": "198.51.100.25" },
  cf: { country: "CN", regionCode: "SH", region: "Shanghai" }
}), environment);
assert.equal(storedPolicyShanghaiDenied.status, 401);
storedAccessPolicy = null;

const configuredShanghaiPolicy = await worker.default.fetch(makeRequest("/access/status", {
  headers: { "CF-Connecting-IP": "198.51.100.21" }
}), { ...environment, ACCESS_REQUIRED_REGIONS: "CN:SH" });
assert.equal(configuredShanghaiPolicy.status, 200);
assert.equal((await configuredShanghaiPolicy.json()).method, "region_bypass");

const configuredShanghaiDenied = await worker.default.fetch(makeRequest("/access/status", {
  headers: { "CF-Connecting-IP": "198.51.100.22" },
  cf: { country: "CN", regionCode: "SH", region: "Shanghai" }
}), { ...environment, ACCESS_REQUIRED_REGIONS: "CN:SH" });
assert.equal(configuredShanghaiDenied.status, 401);
assert.equal((await configuredShanghaiDenied.json()).access_required, true);

const emptyRegionalPolicy = await worker.default.fetch(makeRequest("/access/status", {
  headers: { "CF-Connecting-IP": "198.51.100.23" }
}), { ...environment, ACCESS_REQUIRED_REGIONS: "" });
assert.equal(emptyRegionalPolicy.status, 200);
assert.equal((await emptyRegionalPolicy.json()).method, "region_bypass");

const arrivalAnalytics = await worker.default.fetch(makeRequest("/events", {
  method: "POST",
  headers: { "Content-Type": "text/plain;charset=UTF-8" },
  body: JSON.stringify({
    event: "access_gate_arrival",
    source_page: "https://tzhangzju.github.io/",
    consent_version: "v31-jiangsu-access-gate"
  })
}), environment);
assert.equal(arrivalAnalytics.status, 201);

const roboRsiAnalytics = await worker.default.fetch(makeRequest("/events", {
  method: "POST",
  headers: { "Content-Type": "text/plain;charset=UTF-8" },
  body: JSON.stringify({
    event: "roborsi_project_click",
    source_page: "https://tzhangzju.github.io/",
    consent_version: "v31-jiangsu-access-gate"
  })
}), environment);
assert.equal(roboRsiAnalytics.status, 201);

const allowlisted = await worker.default.fetch(makeRequest("/access/status", {
  headers: { "CF-Connecting-IP": "203.0.113.9" }
}), environment);
assert.equal(allowlisted.status, 200);
assert.equal((await allowlisted.json()).method, "ip_allowlist");

const totpCode = currentTotp(totpSecret);
const adminPage = await worker.default.fetch(makeRequest("/admin"), environment);
assert.equal(adminPage.status, 200);
assert.match(await adminPage.text(), /访问验证码策略/);
const unauthenticatedAdminRead = await worker.default.fetch(makeRequest("/admin/policy"), environment);
assert.equal(unauthenticatedAdminRead.status, 401);
const adminLogin = await worker.default.fetch(makeRequest("/admin/session", {
  method: "POST",
  headers: { "Content-Type": "application/json", "CF-Connecting-IP": "198.51.100.30" },
  body: JSON.stringify({ code: totpCode })
}), environment);
assert.equal(adminLogin.status, 200);
const adminSession = await adminLogin.json();
assert.ok(adminSession.token);
const adminRead = await worker.default.fetch(makeRequest("/admin/policy", {
  headers: { "Authorization": `Bearer ${adminSession.token}` }
}), environment);
assert.equal(adminRead.status, 200);
assert.equal((await adminRead.json()).policy.value, "CN:JS");
const adminUpdate = await worker.default.fetch(makeRequest("/admin/policy", {
  method: "PUT",
  headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminSession.token}` },
  body: JSON.stringify({ required_regions: "*" })
}), environment);
assert.equal(adminUpdate.status, 200);
assert.equal((await adminUpdate.json()).policy.value, "*");
const globalPolicyAfterAdminUpdate = await worker.default.fetch(makeRequest("/access/status", {
  headers: { "CF-Connecting-IP": "198.51.100.31" },
  cf: { country: "CN", regionCode: "SH", region: "Shanghai" }
}), environment);
assert.equal(globalPolicyAfterAdminUpdate.status, 401);
const adminReset = await worker.default.fetch(makeRequest("/admin/policy", {
  method: "PUT",
  headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminSession.token}` },
  body: JSON.stringify({ required_regions: "CN:JS" })
}), environment);
assert.equal(adminReset.status, 200);

const verify = await worker.default.fetch(makeRequest("/access/verify", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ code: totpCode })
}), environment);
assert.equal(verify.status, 200);
const grant = await verify.json();
assert.equal(grant.allowed, true);
assert.equal(grant.method, "totp");
assert.ok(grant.token);
const grantDuration = Date.parse(grant.expires_at) - Date.now();
assert.ok(grantDuration > 6.99 * 24 * 60 * 60 * 1000);
assert.ok(grantDuration <= 7 * 24 * 60 * 60 * 1000);

const authorized = await worker.default.fetch(makeRequest("/access/status", {
  headers: { "Authorization": `Bearer ${grant.token}` }
}), environment);
assert.equal(authorized.status, 200);
assert.equal((await authorized.json()).method, "access_token");

const linkedTotpAnalytics = await worker.default.fetch(makeRequest("/events", {
  method: "POST",
  headers: {
    "Content-Type": "text/plain;charset=UTF-8",
    "Authorization": `Bearer ${grant.token}`
  },
  body: JSON.stringify({
    event: "page_view",
    source_page: "https://tzhangzju.github.io/",
    consent_version: "v31-jiangsu-access-gate"
  })
}), environment);
assert.equal(linkedTotpAnalytics.status, 201);
assert.deepEqual(lastAnalyticsBindings.slice(-4), [
  grant.access_grant_id,
  "totp",
  null,
  totpCode
]);

const inviteVerify = await worker.default.fetch(makeRequest("/access/verify", {
  method: "POST",
  headers: { "Content-Type": "application/json", "CF-Connecting-IP": "198.51.100.9" },
  body: JSON.stringify({ code: inviteCode })
}), environment);
assert.equal(inviteVerify.status, 200);
const inviteGrant = await inviteVerify.json();
assert.equal(inviteGrant.allowed, true);
assert.equal(inviteGrant.method, "invite_code");
assert.equal(inviteGrant.invite_id, 42);
assert.ok(inviteGrant.access_grant_id);

const linkedAnalytics = await worker.default.fetch(makeRequest("/events", {
  method: "POST",
  headers: {
    "Content-Type": "text/plain;charset=UTF-8",
    "Authorization": `Bearer ${inviteGrant.token}`
  },
  body: JSON.stringify({
    event: "page_view",
    source_page: "https://tzhangzju.github.io/",
    consent_version: "v31-jiangsu-access-gate"
  })
}), environment);
assert.equal(linkedAnalytics.status, 201);
assert.deepEqual(lastAnalyticsBindings.slice(-4), [
  inviteGrant.access_grant_id,
  "invite_code",
  42,
  inviteCode
]);

const inviteReuse = await worker.default.fetch(makeRequest("/access/verify", {
  method: "POST",
  headers: { "Content-Type": "application/json", "CF-Connecting-IP": "198.51.100.10" },
  body: JSON.stringify({ code: inviteCode })
}), environment);
assert.equal(inviteReuse.status, 401);
assert.equal((await inviteReuse.json()).allowed, false);

console.log("Access gate tests passed.");
