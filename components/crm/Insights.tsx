import React, { useState, useEffect, useRef } from 'react';
import { Lightbulb, TrendingUp, Brain, MessageSquare, Loader2, Send, RefreshCw, BarChart2, Youtube, ExternalLink, Check, Star, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNiche } from '../../lib/NicheContext';
import { NICHES } from '../../lib/niches';
import { callClaude, getAnthropicKey } from '../../lib/ai';
import { supabase } from '../../lib/supabase';
import { Client, Lead } from './types';

interface IntelligenceItem {
  id: string;
  source_type: string;
  source_url: string | null;
  title: string | null;
  creator: string | null;
  category: string | null;
  applies_to_niche: string;
  key_tactics: string[];
  frameworks: Record<string, string>;
  raw_notes: string | null;
  quality_score: number | null;
  applied: boolean;
  tags: string[];
  created_at: string;
}

interface InsightsProps {
  allLeads: Lead[];
  clients: Client[];
}

const INSIGHT_TABS = [
  { id: 'brief',    label: 'Daily Brief',     icon: Lightbulb },
  { id: 'working',  label: "What's Working",  icon: TrendingUp },
  { id: 'patterns', label: 'Patterns',        icon: BarChart2 },
  { id: 'ask',      label: 'Ask Anything',    icon: MessageSquare },
  { id: 'intel',    label: 'Intelligence',    icon: Youtube },
];

const INTEL_CATEGORIES = [
  'all', 'dm_copy', 'loom_structure', 'call_structure', 'offer_design',
  'objection_handling', 'lead_gen', 'content_strategy', 'pricing_psychology',
  'follow_up', 'closing_techniques', 'competitor_analysis', 'niche_intel',
  'seo_tactics', 'web_design_trends',
];

const SOURCE_COLORS: Record<string, string> = {
  youtube:    'text-red-400 bg-red-400/10 border-red-400/20',
  competitor: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  reddit:     'text-orange-300 bg-orange-300/10 border-orange-300/20',
  podcast:    'text-purple-400 bg-purple-400/10 border-purple-400/20',
  article:    'text-blue-400 bg-blue-400/10 border-blue-400/20',
  tiktok:     'text-pink-400 bg-pink-400/10 border-pink-400/20',
};

interface ChatMessage { role: 'user' | 'assistant'; content: string; }

const Insights: React.FC<InsightsProps> = ({ allLeads, clients }) => {
  const { activeNiche } = useNiche();
  const niche = NICHES.find(n => n.id === activeNiche);
  const [tab, setTab] = useState('brief');
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  // Brief
  const [brief, setBrief] = useState('');
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefGenerated, setBriefGenerated] = useState(false);

  // What's working
  const [working, setWorking] = useState('');
  const [workingLoading, setWorkingLoading] = useState(false);

  // Patterns
  const [patterns, setPatterns] = useState('');
  const [patternsLoading, setPatternsLoading] = useState(false);

  // Ask anything
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Intelligence
  const [intelItems, setIntelItems] = useState<IntelligenceItem[]>([]);
  const [intelLoading, setIntelLoading] = useState(false);
  const [intelCategory, setIntelCategory] = useState('all');
  const [intelSource, setIntelSource] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getAnthropicKey().then(k => setHasKey(!!k));
  }, []);

  useEffect(() => {
    if (tab === 'intel') fetchIntel();
  }, [tab, intelCategory, intelSource]);

  const fetchIntel = async () => {
    setIntelLoading(true);
    let query = supabase
      .from('intelligence_items')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (intelCategory !== 'all') query = query.eq('category', intelCategory);
    if (intelSource !== 'all') query = query.eq('source_type', intelSource);
    const { data } = await query;
    setIntelItems((data as IntelligenceItem[]) ?? []);
    setIntelLoading(false);
  };

  const toggleApplied = async (item: IntelligenceItem) => {
    await supabase
      .from('intelligence_items')
      .update({ applied: !item.applied })
      .eq('id', item.id);
    setIntelItems(prev =>
      prev.map(i => i.id === item.id ? { ...i, applied: !i.applied } : i)
    );
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Gather context
  const buildContext = () => {
    const totalLeads = allLeads.length;
    const activeClients = clients.filter(c => c.status === 'active').length;
    const mrr = clients.filter(c => c.status === 'active').reduce((sum, c) => sum + (c.monthlyValue ?? 0), 0);
    const upfront = clients.reduce((sum, c) => sum + (c.upfrontValue ?? 0), 0);
    const paidLeads = allLeads.filter(l => l.status === 'paid' || l.status === 'Client').length;
    const stageGroups: Record<string, number> = {};
    allLeads.forEach(l => { stageGroups[l.status] = (stageGroups[l.status] ?? 0) + 1; });
    return `
Niche: ${niche?.label ?? activeNiche}
Total leads: ${totalLeads}
Active clients: ${activeClients}
MRR: $${mrr}
Total upfront collected: $${upfront}
Paid leads: ${paidLeads}
Pipeline breakdown: ${JSON.stringify(stageGroups)}
    `.trim();
  };

  const generateBrief = async () => {
    setBriefLoading(true);
    setBriefGenerated(false);
    const ctx = buildContext();
    const result = await callClaude(
      `You are a strategic business advisor for a ${niche?.label ?? 'home services'} marketing agency student. Be direct, no fluff, no em-dashes.`,
      `Based on this data, write a 3-5 sentence daily brief covering: current momentum, what needs attention today, and the single most impactful action to take.\n\nData:\n${ctx}`
    );
    setBrief(result);
    setBriefLoading(false);
    setBriefGenerated(true);
  };

  const generateWorking = async () => {
    setWorkingLoading(true);
    const ctx = buildContext();
    const result = await callClaude(
      `You are a conversion analyst. Be direct and specific. No em-dashes. No fluff.`,
      `Analyze what's working in this sales pipeline and what's not. Identify the 2-3 strongest patterns and 1-2 bottlenecks.\n\nData:\n${ctx}`
    );
    setWorking(result);
    setWorkingLoading(false);
  };

  const generatePatterns = async () => {
    setPatternsLoading(true);
    const ctx = buildContext();
    const result = await callClaude(
      `You are a pattern recognition analyst. Be direct. No em-dashes. Bullet points preferred.`,
      `Find the most significant patterns in this agency pipeline data. Focus on: conversion rates between stages, revenue trends, and potential reasons for lead drop-off.\n\nData:\n${ctx}`
    );
    setPatterns(result);
    setPatternsLoading(false);
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatLoading(true);
    const ctx = buildContext();
    const history = chatMessages.slice(-8).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    const result = await callClaude(
      `You are a strategic business advisor for a ${niche?.label ?? 'home services'} marketing agency. Be direct and helpful. No em-dashes. Answer questions about the pipeline data and give actionable advice.`,
      `Business context:\n${ctx}\n\nConversation history:\n${history}\n\nUser: ${userMsg}`
    );
    setChatMessages(prev => [...prev, { role: 'assistant', content: result }]);
    setChatLoading(false);
  };

  const Loading = () => (
    <div className="flex items-center gap-2 py-3">
      <Loader2 size={14} className="text-[#CD3D35] animate-spin" />
      <span className="text-xs text-[#555]">Analyzing...</span>
    </div>
  );

  const NoKey = () => (
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-xs text-yellow-400">
      Add your Anthropic API key in Credentials to use AI insights.
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-5 py-2.5 border-b border-[#1A1A1A] shrink-0">
        {INSIGHT_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${tab === t.id ? 'bg-[#1E1E1E] text-[#F2F2F2]' : 'text-[#555] hover:text-[#909090]'}`}
          >
            <t.icon size={12} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5">

        {/* Daily Brief */}
        {tab === 'brief' && (
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#F2F2F2]">Daily Brief</h3>
                <p className="text-xs text-[#555]">AI synthesis of your current business state.</p>
              </div>
              <button
                onClick={generateBrief}
                disabled={briefLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#CD3D35] text-white rounded text-xs font-medium hover:bg-[#E85550] disabled:opacity-40 transition-colors"
              >
                {briefLoading ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
                {briefGenerated ? 'Refresh' : 'Generate'}
              </button>
            </div>

            {!hasKey && <NoKey />}

            {/* Stats snapshot */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Leads', value: allLeads.length },
                { label: 'Active Clients', value: clients.filter(c => c.status === 'active').length },
                { label: 'MRR', value: '$' + clients.filter(c => c.status === 'active').reduce((sum, c) => sum + (c.monthlyValue ?? 0), 0).toLocaleString() },
              ].map(stat => (
                <div key={stat.label} className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-3 text-center">
                  <p className="text-lg font-bold font-mono text-[#F2F2F2]">{stat.value}</p>
                  <p className="text-[10px] text-[#555] mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {briefLoading && <Loading />}
            {brief && !briefLoading && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-4">
                <p className="text-[10px] text-[#CD3D35] uppercase tracking-wider font-semibold mb-2">Today's Brief</p>
                <p className="text-sm text-[#F2F2F2] leading-relaxed">{brief}</p>
              </motion.div>
            )}
          </div>
        )}

        {/* What's Working */}
        {tab === 'working' && (
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#F2F2F2]">What's Working</h3>
                <p className="text-xs text-[#555]">Identify your strongest conversion patterns.</p>
              </div>
              <button onClick={generateWorking} disabled={workingLoading} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#CD3D35] text-white rounded text-xs font-medium hover:bg-[#E85550] disabled:opacity-40 transition-colors">
                {workingLoading ? <Loader2 size={11} className="animate-spin" /> : <TrendingUp size={11} />} Analyze
              </button>
            </div>
            {!hasKey && <NoKey />}
            {workingLoading && <Loading />}
            {working && !workingLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-4">
                <p className="text-sm text-[#F2F2F2] leading-relaxed whitespace-pre-wrap">{working}</p>
              </motion.div>
            )}
          </div>
        )}

        {/* Patterns */}
        {tab === 'patterns' && (
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#F2F2F2]">Pattern Finder</h3>
                <p className="text-xs text-[#555]">Deep analysis of pipeline drop-offs and trends.</p>
              </div>
              <button onClick={generatePatterns} disabled={patternsLoading} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#CD3D35] text-white rounded text-xs font-medium hover:bg-[#E85550] disabled:opacity-40 transition-colors">
                {patternsLoading ? <Loader2 size={11} className="animate-spin" /> : <BarChart2 size={11} />} Find Patterns
              </button>
            </div>
            {!hasKey && <NoKey />}
            {patternsLoading && <Loading />}
            {patterns && !patternsLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-4">
                <p className="text-sm text-[#F2F2F2] leading-relaxed whitespace-pre-wrap">{patterns}</p>
              </motion.div>
            )}
          </div>
        )}

        {/* Intelligence Library */}
        {tab === 'intel' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Filter size={11} className="text-[#555]" />
                <span className="text-[10px] text-[#555] uppercase tracking-wider">Source</span>
              </div>
              {['all', 'youtube', 'competitor', 'podcast', 'article', 'tiktok', 'reddit'].map(s => (
                <button
                  key={s}
                  onClick={() => setIntelSource(s)}
                  className={`px-2 py-1 rounded text-[10px] font-medium border transition-colors capitalize ${
                    intelSource === s
                      ? 'bg-[#CD3D35]/20 border-[#CD3D35]/40 text-[#CD3D35]'
                      : 'bg-[#141414] border-[#2A2A2A] text-[#555] hover:text-[#909090]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Filter size={11} className="text-[#555]" />
                <span className="text-[10px] text-[#555] uppercase tracking-wider">Category</span>
              </div>
              {INTEL_CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setIntelCategory(c)}
                  className={`px-2 py-1 rounded text-[10px] font-medium border transition-colors ${
                    intelCategory === c
                      ? 'bg-[#CD3D35]/20 border-[#CD3D35]/40 text-[#CD3D35]'
                      : 'bg-[#141414] border-[#2A2A2A] text-[#555] hover:text-[#909090]'
                  }`}
                >
                  {c.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            {/* Count */}
            <p className="text-[10px] text-[#555]">
              {intelLoading ? 'Loading...' : `${intelItems.length} items`}
            </p>

            {/* Items */}
            {intelLoading && (
              <div className="flex items-center gap-2 py-4">
                <Loader2 size={14} className="text-[#CD3D35] animate-spin" />
                <span className="text-xs text-[#555]">Loading intelligence...</span>
              </div>
            )}

            {!intelLoading && intelItems.length === 0 && (
              <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-8 text-center">
                <Youtube size={24} className="text-[#333] mx-auto mb-2" />
                <p className="text-sm text-[#555]">No intelligence items yet.</p>
                <p className="text-xs text-[#333] mt-1">
                  Paste a YouTube link in Telegram or run:<br />
                  <code className="text-[#CD3D35]">/analyst /analyze-video [url] [category]</code>
                </p>
              </div>
            )}

            {!intelLoading && intelItems.map(item => (
              <div
                key={item.id}
                className={`bg-[#141414] border rounded-lg transition-colors ${
                  item.applied ? 'border-green-500/20' : 'border-[#2A2A2A]'
                }`}
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Badges row */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        <span className={`px-1.5 py-0.5 rounded border text-[9px] font-semibold uppercase tracking-wider ${SOURCE_COLORS[item.source_type] ?? 'text-[#555] bg-[#1A1A1A] border-[#2A2A2A]'}`}>
                          {item.source_type}
                        </span>
                        {item.category && (
                          <span className="px-1.5 py-0.5 rounded border border-[#2A2A2A] bg-[#1A1A1A] text-[9px] text-[#555] uppercase tracking-wider">
                            {item.category.replace(/_/g, ' ')}
                          </span>
                        )}
                        {item.applies_to_niche && item.applies_to_niche !== 'all' && (
                          <span className="px-1.5 py-0.5 rounded border border-[#2A2A2A] bg-[#1A1A1A] text-[9px] text-[#555]">
                            {item.applies_to_niche}
                          </span>
                        )}
                        {item.applied && (
                          <span className="px-1.5 py-0.5 rounded border border-green-500/30 bg-green-500/10 text-[9px] text-green-400 font-semibold flex items-center gap-1">
                            <Check size={8} /> Applied
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <p className="text-sm font-medium text-[#F2F2F2] truncate">
                        {item.title ?? 'Untitled'}
                      </p>
                      {item.creator && (
                        <p className="text-[10px] text-[#555] mt-0.5">{item.creator}</p>
                      )}
                    </div>

                    {/* Quality score + actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {item.quality_score != null && (
                        <div className="flex items-center gap-0.5">
                          <Star size={10} className="text-yellow-500" />
                          <span className="text-[10px] text-yellow-500 font-mono">{item.quality_score}/10</span>
                        </div>
                      )}
                      {item.source_url && (
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="text-[#555] hover:text-[#F2F2F2] transition-colors"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                      <span className="text-[10px] text-[#333]">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded content */}
                {expandedId === item.id && (
                  <div className="px-4 pb-4 border-t border-[#1E1E1E] pt-3 space-y-3">
                    {/* Key tactics */}
                    {item.key_tactics?.length > 0 && (
                      <div>
                        <p className="text-[10px] text-[#CD3D35] uppercase tracking-wider font-semibold mb-1.5">Key Tactics</p>
                        <ul className="space-y-1">
                          {item.key_tactics.map((t, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-xs text-[#909090]">
                              <span className="text-[#CD3D35] mt-0.5 shrink-0">›</span>
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Frameworks */}
                    {item.frameworks && Object.keys(item.frameworks).length > 0 && (
                      <div>
                        <p className="text-[10px] text-[#CD3D35] uppercase tracking-wider font-semibold mb-1.5">Frameworks</p>
                        <div className="space-y-1.5">
                          {Object.entries(item.frameworks).map(([name, desc]) => (
                            <div key={name} className="bg-[#1A1A1A] rounded px-2.5 py-2">
                              <p className="text-[10px] font-semibold text-[#F2F2F2] mb-0.5">{name}</p>
                              <p className="text-[10px] text-[#555]">{desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Raw notes */}
                    {item.raw_notes && (
                      <div>
                        <p className="text-[10px] text-[#555] uppercase tracking-wider font-semibold mb-1">Notes</p>
                        <p className="text-xs text-[#555] leading-relaxed">{item.raw_notes}</p>
                      </div>
                    )}

                    {/* Tags */}
                    {item.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[9px] text-[#555]">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Mark applied button */}
                    <button
                      onClick={() => toggleApplied(item)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium border transition-colors ${
                        item.applied
                          ? 'border-green-500/30 text-green-400 bg-green-500/10 hover:bg-green-500/5'
                          : 'border-[#2A2A2A] text-[#555] bg-[#1A1A1A] hover:text-[#F2F2F2]'
                      }`}
                    >
                      <Check size={11} />
                      {item.applied ? 'Mark as not applied' : 'Mark as applied'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Ask Anything */}
        {tab === 'ask' && (
          <div className="max-w-2xl flex flex-col h-full" style={{ minHeight: '400px' }}>
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-[#F2F2F2]">Ask Anything</h3>
              <p className="text-xs text-[#555]">Chat with AI about your business, strategy, or pipeline.</p>
            </div>
            {!hasKey && <NoKey />}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-3">
              {chatMessages.length === 0 && (
                <div className="flex flex-col gap-2">
                  {['What should I focus on this week?', 'Why are leads stalling after DM Sent?', 'How do I improve my close rate?'].map(q => (
                    <button key={q} onClick={() => setChatInput(q)} className="text-left px-3 py-2 bg-[#141414] border border-[#2A2A2A] rounded-lg text-xs text-[#555] hover:text-[#909090] hover:border-[#383838] transition-colors">
                      {q}
                    </button>
                  ))}
                </div>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-sm rounded-lg px-3 py-2 text-xs leading-relaxed ${msg.role === 'user' ? 'bg-[#CD3D35]/20 text-[#F2F2F2] border border-[#CD3D35]/30' : 'bg-[#141414] text-[#F2F2F2] border border-[#2A2A2A]'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg px-3 py-2">
                    <Loader2 size={12} className="text-[#CD3D35] animate-spin" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2 mt-auto">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendChat()}
                placeholder="Ask about your pipeline, strategy, or anything..."
                className="flex-1 bg-[#141414] border border-[#2A2A2A] rounded px-3 py-2 text-xs text-[#F2F2F2] placeholder-[#555] focus:outline-none focus:border-[#CD3D35]/50"
              />
              <button
                onClick={sendChat}
                disabled={!chatInput.trim() || chatLoading}
                className="p-2 bg-[#CD3D35] text-white rounded hover:bg-[#E85550] disabled:opacity-40 transition-colors"
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
