-- ============================================================
-- Migration 003: Scout lead field alignment
-- Run in: Supabase Dashboard > SQL Editor > New Query
-- Adds address, google_maps_url, source columns to leads
-- Adds campaign_type to campaigns (if not already added by 001)
-- ============================================================

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='address') THEN
    ALTER TABLE leads ADD COLUMN address TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='google_maps_url') THEN
    ALTER TABLE leads ADD COLUMN google_maps_url TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='source') THEN
    ALTER TABLE leads ADD COLUMN source TEXT DEFAULT 'google_maps';
  END IF;
END $$;

-- Ensure status defaults to 'prospect' (status is the actual column name, not pipeline_stage)
DO $$ BEGIN
  ALTER TABLE leads ALTER COLUMN status SET DEFAULT 'prospect';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Ensure campaign_type exists on campaigns (may already exist from 001)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='campaign_type') THEN
    ALTER TABLE campaigns ADD COLUMN campaign_type TEXT DEFAULT 'dms';
  END IF;
END $$;

-- Index for source-based queries
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- ─────────────────────────────────────────────
-- Make agent_runs.user_id nullable
-- Agents run as system processes with no auth session
-- ─────────────────────────────────────────────
DO $$ BEGIN
  ALTER TABLE agent_runs ALTER COLUMN user_id DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Same for intelligence_items and daily_briefs
DO $$ BEGIN
  ALTER TABLE intelligence_items ALTER COLUMN user_id DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE daily_briefs ALTER COLUMN user_id DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
