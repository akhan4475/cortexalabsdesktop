-- ============================================================
-- Migration 002: Agent tables + Intelligence layer
-- Run in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- ─────────────────────────────────────────────
-- New columns on leads (from session 2026-07-03)
-- ─────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='loom_brief') THEN
    ALTER TABLE leads ADD COLUMN loom_brief TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='review_dates') THEN
    ALTER TABLE leads ADD COLUMN review_dates JSONB DEFAULT '[]';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='disqualified_reason') THEN
    ALTER TABLE leads ADD COLUMN disqualified_reason TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='last_contact_date') THEN
    ALTER TABLE leads ADD COLUMN last_contact_date DATE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='follow_up_day') THEN
    ALTER TABLE leads ADD COLUMN follow_up_day INTEGER DEFAULT 0;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='cal_booking_id') THEN
    ALTER TABLE leads ADD COLUMN cal_booking_id TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='icp_score') THEN
    ALTER TABLE leads ADD COLUMN icp_score INTEGER DEFAULT NULL;
  END IF;
END $$;

-- ─────────────────────────────────────────────
-- agent_runs — every agent logs one row per run
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS agent_runs (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  agent        TEXT NOT NULL,      -- boss|scout|setter|sales|factory|analyst|content
  command      TEXT NOT NULL,
  status       TEXT DEFAULT 'completed',
  metrics      JSONB DEFAULT '{}', -- arbitrary per-agent stats
  notes        TEXT,
  started_at   TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ─────────────────────────────────────────────
-- intelligence_items — Analyst stores extracted knowledge
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS intelligence_items (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  source_type      TEXT NOT NULL,   -- youtube|competitor|reddit|podcast|article|tiktok
  source_url       TEXT,
  title            TEXT,
  creator          TEXT,
  category         TEXT,            -- dm_copy|loom_structure|call_structure|offer_design|objection_handling|lead_gen|content_strategy|pricing_psychology|follow_up|closing_techniques|competitor_analysis|niche_intel|seo_tactics|web_design_trends
  applies_to_niche TEXT DEFAULT 'all',
  key_tactics      JSONB DEFAULT '[]',
  frameworks       JSONB DEFAULT '{}',
  raw_notes        TEXT,
  quality_score    INTEGER,         -- 1-10
  applied          BOOLEAN DEFAULT FALSE,
  tags             JSONB DEFAULT '[]',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- daily_briefs — Boss writes one per day
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS daily_briefs (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  brief_date          DATE NOT NULL,
  content             TEXT NOT NULL,
  metrics_snapshot    JSONB DEFAULT '{}',
  sent_to_telegram    BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, brief_date)
);

-- ─────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_agent_runs_user_date    ON agent_runs(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_runs_agent        ON agent_runs(agent, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_intel_user_category     ON intelligence_items(user_id, category, source_type);
CREATE INDEX IF NOT EXISTS idx_intel_user_created      ON intelligence_items(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_briefs_user_date  ON daily_briefs(user_id, brief_date DESC);

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────

ALTER TABLE agent_runs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_briefs       ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='agent_runs' AND policyname='agent_runs_own') THEN
    CREATE POLICY "agent_runs_own" ON agent_runs FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='intelligence_items' AND policyname='intelligence_items_own') THEN
    CREATE POLICY "intelligence_items_own" ON intelligence_items FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='daily_briefs' AND policyname='daily_briefs_own') THEN
    CREATE POLICY "daily_briefs_own" ON daily_briefs FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
