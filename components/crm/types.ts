import type { NicheId } from '../../lib/niches';

export interface Lead {
  id: string;
  campaignId: string;
  name: string; // Decision Maker
  company: string;
  phone: string;
  email: string; // Optional but kept for compatibility
  address?: string;
  reviews?: string;
  rating?: string;
  website?: string;
  status: string; // Flexible status based on disposition
  summary: string; // Description
  lastContacted?: string;
  niche?: NicheId;
  icpScore?: number;
}

export interface Campaign {
  id: string;
  name: string;
  createdAt: string;
  leadCount: number;
  niche?: NicheId;
  campaignType?: 'ig_dm' | 'whatsapp_dm' | 'call';
}

// ── Content Engine ────────────────────────────────────────────────────────────

export interface ContextItem {
  id: string;
  niche: string;
  bucket: string;
  sourceType: string;
  title?: string;
  sourceUrl?: string;
  summary?: string;
  tags: string[];
  status: 'queued' | 'fetching' | 'summarising' | 'ready' | 'error';
  errorMessage?: string;
  createdAt: string;
}

export interface Script {
  id: string;
  niche: string;
  format: string;
  status: 'idea' | 'approved' | 'shot' | 'edited' | 'posted';
  hook?: string;
  hookFormula?: string;
  body?: string;
  cta?: string;
  fullScript?: string;
  caption?: string;
  keyword?: string;
  hashtags: string[];
  topic?: string;
  angle?: string;
  whyItWorks?: string;
  generationPrompt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NicheSignal {
  id: string;
  niche: string;
  platform?: string;
  sourceUrl?: string;
  creatorHandle?: string;
  caption?: string;
  viewCount?: number;
  likeCount?: number;
  velocityScore?: number;
  suggestionText?: string;
  status: 'new' | 'generated' | 'saved' | 'dismissed';
  scrapedAt: string;
}

// ── Factory ───────────────────────────────────────────────────────────────────

export interface FactoryBuild {
  id: string;
  niche: string;
  clientName?: string;
  clientCompany?: string;
  templateUsed?: string;
  buildType: 'full' | 'quick_preview';
  stage: string;
  stageNumber: number;
  notes?: string;
  siteUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FactoryPreview {
  id: string;
  niche: string;
  templateUsed?: string;
  pasteInput?: string;
  extractedData: Record<string, unknown>;
  convertedToBuild: boolean;
  createdAt: string;
}

// ── Memory ────────────────────────────────────────────────────────────────────

export interface MemoryEntry {
  id: string;
  type: string;
  content: string;
  linkedId?: string;
  linkedType?: string;
  createdAt: string;
}

export interface Decision {
  id: string;
  context: string;
  decision: string;
  outcome?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  closeDate: string;
  upfrontValue: number;
  monthlyValue: number;
  monthlyRetainerDate?: string; // Full date string for the first retainer payment (YYYY-MM-DD)
  status: 'active' | 'inactive';
  leadId?: string; // Linked pipeline lead (optional)
}

export interface DemoEvent {
  id: string;
  leadId: string;
  date: string; // YYYY-MM-DD
}

export interface Conversation {
  id: string;
  contactName: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  messages: Message[];
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
}

export interface CallLog {
  id: string;
  leadId: string;
  leadName: string;
  duration: string;
  outcome: string;
  timestamp: string;
  recordingUrl?: string;
}


export interface Dial {
    id: string;
    userId: string;
    date: string;
    timestamp: string;
    leadId?: string; // Make this optional since it's nullable in your DB
}