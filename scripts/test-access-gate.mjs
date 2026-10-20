import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const workerSource = await readFile(join(projectRoot, "cloudflare-pages-gateway", "_worker.js"), "utf8");
const worker = await import(`data:text/javascript;base64,${Buffer.from(workerSource).toString("base64")}`);

const totpSecret = "JBSWY3DPEHPK3PXP";
const tokenSecret = "test-session-secret-with-sufficient-entropy";
const database = {
  prepare() {
    const statement = {
      bind() { return statement; },
      async first() { return { count: 0 }; },
      async run() { return { success: true }; }
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
  const headers = new Headers(options.headers || {});
  headers.set("Origin", "https://tzhangzju.github.io");
  headers.set("User-Agent", "AccessGateTest/1.0");
  if (!headers.has("CF-Connecting-IP")) headers.set("CF-Connecting-IP", "198.51.100.8");
  return new Request(`https://homepage-analytics-mobile.pages.dev${path}`, { ...options, headers });
}

const environment = {
  ACCESS_IP_ALLOWLIST: "203.0.113.9,2001:db8:abcd::/48",
  ACCESS_TOKEN_SECRET: tokenSecret,
  ACCESS_TOTP_SECRET: totpSecret,
  DB: database
};

const denied = await worker.default.fetch(makeRequest("/access/status"), environment);
assert.equal(denied.status, 401);
assert.equal((await denied.json()).allowed, false);

const allowlisted = await worker.default.fetch(makeRequest("/access/status", {
  headers: { "CF-Connecting-IP": "203.0.113.9" }
}), environment);
assert.equal(allowlisted.status, 200);
assert.equal((await allowlisted.json()).method, "ip_allowlist");

const verify = await worker.default.fetch(makeRequest("/access/verify", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ code: currentTotp(totpSecret) })
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

console.log("Access gate tests passed.");
