import { createHash, randomInt } from "node:crypto";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const validityDays = 14;
const labelIndex = process.argv.indexOf("--label");
const recipientLabel = labelIndex >= 0 ? String(process.argv[labelIndex + 1] || "").trim().slice(0, 100) : "";
const escapedLabel = recipientLabel.replaceAll("'", "''");
const compactCode = Array.from({ length: 16 }, () => alphabet[randomInt(alphabet.length)]).join("");
const displayCode = compactCode.match(/.{1,4}/g).join("-");
const codeHash = createHash("sha256").update(compactCode).digest("hex");
const expiresAt = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000)
  .toISOString()
  .replace("T", " ")
  .replace(/\.\d{3}Z$/, "");

console.log(JSON.stringify({
  code: displayCode,
  recipient_label: recipientLabel || null,
  valid_days: validityDays,
  expires_at_utc: `${expiresAt} UTC`,
  sql: `INSERT INTO access_invites (code_hash, invite_code, recipient_label, expires_at) VALUES ('${codeHash}', '${displayCode}', ${recipientLabel ? `'${escapedLabel}'` : "NULL"}, '${expiresAt}');`
}));
