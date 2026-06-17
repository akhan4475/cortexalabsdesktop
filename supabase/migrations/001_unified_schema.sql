-- ============================================================
-- CortexaOS Unified Schema Migration
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- Safe to run on existing project - does NOT drop any tables
-- ============================================================

-- ─────────────────────────────────────────────
-- EXTEND EXISTING TABLES (safe column additions)
-- ─────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='niche') THEN
    ALTER TABLE campaigns ADD COLUMN niche TEXT DEFAULT 'pool';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='campaign_type') THEN
    ALTER TABLE campaigns ADD COLUMN campaign_type TEXT DEFAULT 'call';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='niche') THEN
    ALTER TABLE leads ADD COLUMN niche TEXT DEFAULT 'pool';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='icp_score') THEN
    ALTER TABLE leads ADD COLUMN icp_score INTEGER DEFAULT NULL;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_credentials' AND column_name='anthropic_api_key') THEN
    ALTER TABLE user_credentials ADD COLUMN anthropic_api_key TEXT DEFAULT NULL;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_credentials' AND column_name='assemblyai_api_key') THEN
    ALTER TABLE user_credentials ADD COLUMN assemblyai_api_key TEXT DEFAULT NULL;
  END IF;
END $$;

-- ─────────────────────────────────────────────
-- NEW TABLES
-- ─────────────────────────────────────────────

-- Memory entries (Founder OS memory layer)
CREATE TABLE IF NOT EXISTS memory_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  -- call_summary | lead_closed | content_win | factory_complete | post_mortem | weekly_review | decision | note
  content TEXT NOT NULL,
  linked_id TEXT,
  linked_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Decisions database (Founder OS)
CREATE TABLE IF NOT EXISTS decisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  context TEXT NOT NULL,
  decision TEXT NOT NULL,
  outcome TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business profile (per user, for content engine + factory context)
CREATE TABLE IF NOT EXISTS business_profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  active_niche TEXT DEFAULT 'pool',
  avatar_description TEXT,
  offer_description TEXT,
  lead_magnet TEXT,
  default_comment_keyword TEXT,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voice profile (content engine - writing style capture)
CREATE TABLE IF NOT EXISTS voice_profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  niche TEXT DEFAULT 'pool',
  tone_descriptor TEXT,
  catchphrases JSONB DEFAULT '[]',
  do_not_use_phrases JSONB DEFAULT '[]',
  sample_transcripts JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Context items (content engine - 7 buckets of input material)
CREATE TABLE IF NOT EXISTS context_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  niche TEXT DEFAULT 'pool',
  bucket TEXT NOT NULL,
  -- video_ideas | inspiration | expert_brain | my_voice | context | instructions | feedback
  source_type TEXT NOT NULL,
  -- text | youtube_url | instagram_reel | tiktok_url | pdf | link
  title TEXT,
  source_url TEXT,
  raw_content TEXT,
  processed_content TEXT,
  summary TEXT,
  tags JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'queued',
  -- queued | fetching | summarising | ready | error
  error_message TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scripts (content engine pipeline - Idea through Posted)
CREATE TABLE IF NOT EXISTS scripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  niche TEXT DEFAULT 'pool',
  generation_id UUID,
  generation_source TEXT,
  generation_prompt TEXT,
  format TEXT DEFAULT 'reel',
  -- reel | carousel | story_sequence | long_form
  status TEXT DEFAULT 'idea',
  -- idea | approved | shot | edited | posted
  hook TEXT,
  hook_formula TEXT,
  body TEXT,
  cta TEXT,
  full_script TEXT,
  caption TEXT,
  keyword TEXT,
  hashtags JSONB DEFAULT '[]',
  topic TEXT,
  angle TEXT,
  why_it_works TEXT,
  shot_ideas JSONB DEFAULT '[]',
  inspired_by JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generation runs (AI cost accounting)
CREATE TABLE IF NOT EXISTS generation_runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  niche TEXT DEFAULT 'pool',
  request_text TEXT,
  format TEXT,
  count_requested INTEGER DEFAULT 1,
  status TEXT DEFAULT 'running',
  source TEXT,
  model TEXT,
  cost_usd NUMERIC,
  duration_ms INTEGER,
  resulting_script_ids JSONB DEFAULT '[]',
  error_message TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts (published content tracking)
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  script_id UUID REFERENCES scripts(id) ON DELETE SET NULL,
  niche TEXT,
  platform TEXT,
  -- instagram | tiktok | youtube
  external_url TEXT,
  posted_at TIMESTAMPTZ,
  keyword_dms INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content performance metrics (pulled by background job)
CREATE TABLE IF NOT EXISTS content_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  views INTEGER,
  likes INTEGER,
  comments INTEGER,
  shares INTEGER,
  saves INTEGER,
  engagement_rate NUMERIC,
  checkpoint TEXT
  -- 1h | 6h | 24h | 72h | 7d | 30d
);

-- Niche watch (radar - hashtags and handles to monitor)
CREATE TABLE IF NOT EXISTS niche_watch (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  niche TEXT NOT NULL,
  platform TEXT NOT NULL,
  watch_type TEXT NOT NULL,
  -- hashtag | creator
  value TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Niche signals (radar - trending content found by scraper)
CREATE TABLE IF NOT EXISTS niche_signals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  niche TEXT NOT NULL,
  platform TEXT,
  source_url TEXT,
  creator_handle TEXT,
  caption TEXT,
  view_count INTEGER,
  like_count INTEGER,
  velocity_score NUMERIC,
  suggestion_text TEXT,
  status TEXT DEFAULT 'new',
  -- new | generated | saved | dismissed
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Factory builds (full website build tracker)
CREATE TABLE IF NOT EXISTS factory_builds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID,
  niche TEXT NOT NULL,
  client_name TEXT,
  client_company TEXT,
  template_used TEXT,
  build_type TEXT DEFAULT 'full',
  -- full | quick_preview
  stage TEXT DEFAULT 'intake',
  -- intake | research | seo | assets | strategy | copy | brand_dna | brand_resonance | hero_image | build_qa | deploy | delivery | proposal
  stage_number INTEGER DEFAULT 1,
  notes TEXT,
  site_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Factory previews (quick paste-to-preview history)
CREATE TABLE IF NOT EXISTS factory_previews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lead_id TEXT,
  niche TEXT NOT NULL,
  template_used TEXT,
  paste_input TEXT,
  extracted_data JSONB DEFAULT '{}',
  converted_to_build BOOLEAN DEFAULT FALSE,
  factory_build_id UUID REFERENCES factory_builds(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_memory_user_created ON memory_entries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_decisions_user ON decisions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_context_items_user_bucket ON context_items(user_id, bucket, niche);
CREATE INDEX IF NOT EXISTS idx_context_items_status ON context_items(status);
CREATE INDEX IF NOT EXISTS idx_scripts_user_status ON scripts(user_id, status, niche);
CREATE INDEX IF NOT EXISTS idx_generation_runs_user ON generation_runs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_niche_signals_user_niche ON niche_signals(user_id, niche, status);
CREATE INDEX IF NOT EXISTS idx_factory_builds_user ON factory_builds(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_factory_previews_user ON factory_previews(user_id, created_at DESC);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────

ALTER TABLE memory_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE niche_watch ENABLE ROW LEVEL SECURITY;
ALTER TABLE niche_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE factory_builds ENABLE ROW LEVEL SECURITY;
ALTER TABLE factory_previews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='memory_entries' AND policyname='memory_own') THEN
    CREATE POLICY "memory_own" ON memory_entries FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='decisions' AND policyname='decisions_own') THEN
    CREATE POLICY "decisions_own" ON decisions FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='business_profile' AND policyname='business_profile_own') THEN
    CREATE POLICY "business_profile_own" ON business_profile FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='voice_profile' AND policyname='voice_profile_own') THEN
    CREATE POLICY "voice_profile_own" ON voice_profile FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='context_items' AND policyname='context_items_own') THEN
    CREATE POLICY "context_items_own" ON context_items FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='scripts' AND policyname='scripts_own') THEN
    CREATE POLICY "scripts_own" ON scripts FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='generation_runs' AND policyname='generation_runs_own') THEN
    CREATE POLICY "generation_runs_own" ON generation_runs FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='posts' AND policyname='posts_own') THEN
    CREATE POLICY "posts_own" ON posts FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='content_performance' AND policyname='content_performance_own') THEN
    CREATE POLICY "content_performance_own" ON content_performance FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='niche_watch' AND policyname='niche_watch_own') THEN
    CREATE POLICY "niche_watch_own" ON niche_watch FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='niche_signals' AND policyname='niche_signals_own') THEN
    CREATE POLICY "niche_signals_own" ON niche_signals FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='factory_builds' AND policyname='factory_builds_own') THEN
    CREATE POLICY "factory_builds_own" ON factory_builds FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='factory_previews' AND policyname='factory_previews_own') THEN
    CREATE POLICY "factory_previews_own" ON factory_previews FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
