ALTER TABLE access_invites ADD COLUMN invite_code TEXT;
ALTER TABLE access_invites ADD COLUMN recipient_label TEXT;
ALTER TABLE analytics_events ADD COLUMN access_code TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_access_invites_plaintext_code
ON access_invites (invite_code);

CREATE INDEX IF NOT EXISTS idx_analytics_access_code
ON analytics_events (access_code, occurred_at);

CREATE TABLE IF NOT EXISTS access_grants (
  grant_id TEXT PRIMARY KEY,
  access_method TEXT NOT NULL,
  invite_id INTEGER,
  access_code TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_access_grants_expiry
ON access_grants (expires_at);
