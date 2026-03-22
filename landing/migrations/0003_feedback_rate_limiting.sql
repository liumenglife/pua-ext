-- Add ip_hash column for rate limiting (hashed, never stores raw IP)
ALTER TABLE feedback ADD COLUMN ip_hash TEXT;
CREATE INDEX IF NOT EXISTS idx_feedback_ip_hash ON feedback(ip_hash, created_at);
