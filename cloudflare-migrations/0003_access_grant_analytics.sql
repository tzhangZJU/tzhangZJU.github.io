ALTER TABLE analytics_events ADD COLUMN access_grant_id TEXT;
ALTER TABLE analytics_events ADD COLUMN access_method TEXT;
ALTER TABLE analytics_events ADD COLUMN invite_id INTEGER;

CREATE INDEX IF NOT EXISTS idx_analytics_access_grant
ON analytics_events (access_grant_id, occurred_at);

CREATE INDEX IF NOT EXISTS idx_analytics_invite
ON analytics_events (invite_id, occurred_at);
