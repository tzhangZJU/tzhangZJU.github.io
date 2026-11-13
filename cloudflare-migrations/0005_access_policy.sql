CREATE TABLE IF NOT EXISTS access_policy (
  policy_key TEXT PRIMARY KEY,
  policy_value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO access_policy (policy_key, policy_value)
VALUES ('required_regions', 'CN:JS');
