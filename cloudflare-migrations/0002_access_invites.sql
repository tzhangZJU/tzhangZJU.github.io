CREATE TABLE IF NOT EXISTS access_invites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code_hash TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  used_ip_hash TEXT,
  used_user_agent_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_access_invites_expiry
ON access_invites (expires_at, used_at);
