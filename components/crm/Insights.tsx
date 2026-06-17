import React, { useState, useEffect, useRef } from 'react';
import { Lightbulb, TrendingUp, Brain, MessageSquare, Loader2, Send, RefreshCw, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNiche } from '../../lib/NicheContext';
import { NICHES } from '../../lib/niches';
import { callClaude, getAnthropicKey } from '../../lib/ai';
import { supabase } from '../../lib/supabase';
import { Client, Lead } from './types';

interface InsightsProps {
  allLeads: Lead[];
  clients: Client[];
}

const INSIGHT_TABS = [
  { id: 'brief',    label: 'Daily Brief',     icon: Lightbulb },
  { id: 'working',  label: "What's Working",  icon: TrendingUp },
  { id: 'patterns', label: 'Patterns',        icon: BarChart2 },
  { id: 'ask',      label: 'Ask Anything',    icon: MessageSquare },
];

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

  useEffect(() => {
    getAnthropicKey().then(k => setHasKey(!!k));
  }, []);

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
