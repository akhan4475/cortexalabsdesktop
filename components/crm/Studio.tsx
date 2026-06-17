import React, { useState, useEffect } from 'react';
import { Sparkles, Send, Save, Loader2, Copy, Check, ChevronDown, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNiche } from '../../lib/NicheContext';
import { NICHES, CONTENT_BUCKETS } from '../../lib/niches';
import { generateScriptIdeas, getAnthropicKey } from '../../lib/ai';
import { supabase } from '../../lib/supabase';

const FORMATS = ['Short-form reel', 'Long-form video', 'Talking head', 'Before/After', 'Day in the life', 'Educational', 'Testimonial-style', 'Problem/Solution'];
const COUNTS = [1, 2, 3, 5];

interface GeneratedScript {
  hook: string;
  body: string;
  cta: string;
  caption: string;
  hashtags: string[];
  why_it_works: string;
}

const ScriptCard: React.FC<{ script: GeneratedScript; idx: number; onSave: () => void }> = ({ script, idx, onSave }) => {
  const [copied, setCopied] = useState('');
  const [saved, setSaved] = useState(false);

  const copy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleSave = () => { onSave(); setSaved(true); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.06 }}
      className="bg-[#141414] border border-[#2A2A2A] rounded-lg overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1A1A1A]">
        <span className="text-[10px] font-semibold text-[#555] uppercase tracking-wider">Script {idx + 1}</span>
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-medium transition-colors ${saved ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 'bg-[#1E1E1E] border border-[#2A2A2A] text-[#909090] hover:text-[#F2F2F2]'}`}
        >
          {saved ? <><Check size={10} /> Saved</> : <><Save size={10} /> Save to Board</>}
        </button>
      </div>
      <div className="p-4 space-y-3">
        {/* Hook */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-[#CD3D35] uppercase tracking-wider font-semibold">Hook (0-3s)</span>
            <button onClick={() => copy(script.hook, 'hook')} className="text-[#555] hover:text-[#909090] transition-colors">
              {copied === 'hook' ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
            </button>
          </div>
          <p className="text-sm text-[#F2F2F2] font-medium leading-snug">{script.hook}</p>
        </div>
        {/* Body */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-[#909090] uppercase tracking-wider font-semibold">Body</span>
            <button onClick={() => copy(script.body, 'body')} className="text-[#555] hover:text-[#909090] transition-colors">
              {copied === 'body' ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
            </button>
          </div>
          <p className="text-xs text-[#909090] leading-relaxed whitespace-pre-wrap">{script.body}</p>
        </div>
        {/* CTA */}
        {script.cta && (
          <div>
            <span className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold block mb-1">CTA</span>
            <p className="text-xs text-[#909090]">{script.cta}</p>
          </div>
        )}
        {/* Caption */}
        {script.caption && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-purple-400 uppercase tracking-wider font-semibold">Caption</span>
              <button onClick={() => copy(script.caption + '\n\n' + (script.hashtags?.join(' ') ?? ''), 'caption')} className="text-[#555] hover:text-[#909090] transition-colors">
                {copied === 'caption' ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
              </button>
            </div>
            <p className="text-xs text-[#909090] leading-relaxed">{script.caption}</p>
            {script.hashtags?.length > 0 && (
              <p className="text-[10px] text-[#555] mt-1">{script.hashtags.join(' ')}</p>
            )}
          </div>
        )}
        {/* Why it works */}
        {script.why_it_works && (
          <div className="bg-[#0A0A0A] rounded p-2.5 border border-[#1A1A1A]">
            <span className="text-[10px] text-yellow-500/80 uppercase tracking-wider font-semibold block mb-1">Why it works</span>
            <p className="text-[11px] text-[#555] leading-relaxed">{script.why_it_works}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Studio: React.FC = () => {
  const { activeNiche } = useNiche();
  const niche = NICHES.find(n => n.id === activeNiche);
  const [prompt, setPrompt] = useState('');
  const [format, setFormat] = useState(FORMATS[0]);
  const [count, setCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [scripts, setScripts] = useState<GeneratedScript[]>([]);
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [voiceSamples, setVoiceSamples] = useState<string[]>([]);

  useEffect(() => {
    getAnthropicKey().then(k => setHasKey(!!k));
    // Load voice samples from context_items table
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from('context_items').select('content').eq('user_id', user.id).eq('bucket', 'my_voice').limit(5)
        .then(({ data }) => {
          if (data) setVoiceSamples(data.map((d: any) => d.content ?? d.summary ?? ''));
        });
    });
  }, []);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setScripts([]);
    try {
      const results = await generateScriptIdeas({
        niche: niche?.label ?? activeNiche,
        prompt: prompt.trim(),
        format,
        count,
        voiceSamples,
        contextItems: [],
        memoryContext: '',
      });
      setScripts(results);
    } finally {
      setLoading(false);
    }
  };

  const saveToBoard = async (script: GeneratedScript) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from('scripts').insert({
        user_id: user.id,
        niche: activeNiche,
        hook: script.hook,
        body: script.body,
        cta: script.cta,
        caption: script.caption,
        hashtags: script.hashtags,
        why_it_works: script.why_it_works,
        format,
        stage: 'idea',
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      // table might not exist yet - silent fail
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: Controls */}
      <div className="w-72 shrink-0 border-r border-[#1A1A1A] flex flex-col bg-[#0A0A0A]">
        <div className="p-4 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-[#CD3D35]" />
            <span className="text-sm font-semibold text-[#F2F2F2]">Studio</span>
          </div>
          <p className="text-[11px] text-[#555]">Generate content scripts for {niche?.label ?? 'your niche'}.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: 'none' }}>
          {/* Niche badge */}
          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1.5">Active Niche</label>
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[#141414] border border-[#2A2A2A] rounded">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: niche?.color }} />
              <span className="text-xs text-[#F2F2F2]">{niche?.label}</span>
            </div>
          </div>

          {/* Prompt */}
          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1.5">What to create</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. Why homeowners shouldn't DIY their roof, 3 signs you need a new roof..."
              rows={5}
              className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-2.5 py-2 text-xs text-[#F2F2F2] placeholder-[#555] focus:outline-none focus:border-[#CD3D35]/50 resize-none leading-relaxed"
            />
          </div>

          {/* Format */}
          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1.5">Format</label>
            <div className="relative">
              <select
                value={format}
                onChange={e => setFormat(e.target.value)}
                className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-[#F2F2F2] focus:outline-none appearance-none pr-7"
              >
                {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none" />
            </div>
          </div>

          {/* Count */}
          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1.5">Count</label>
            <div className="flex gap-1.5">
              {COUNTS.map(c => (
                <button
                  key={c}
                  onClick={() => setCount(c)}
                  className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors border ${count === c ? 'bg-[#CD3D35]/15 text-[#CD3D35] border-[#CD3D35]/40' : 'bg-[#141414] text-[#555] border-[#2A2A2A] hover:text-[#909090]'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Voice samples info */}
          {voiceSamples.length > 0 && (
            <div className="bg-[#141414] border border-[#2A2A2A] rounded p-2.5">
              <p className="text-[10px] text-green-400 font-medium mb-0.5">{voiceSamples.length} voice samples loaded</p>
              <p className="text-[10px] text-[#555]">From your Library. Claude will match your tone.</p>
            </div>
          )}

          {!hasKey && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2.5">
              <p className="text-[10px] text-yellow-400 font-medium mb-0.5">No Anthropic key</p>
              <p className="text-[10px] text-[#555]">Add your API key in Credentials. Stub scripts will be generated.</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#1A1A1A]">
          <button
            onClick={generate}
            disabled={!prompt.trim() || loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#CD3D35] text-white rounded font-medium text-sm hover:bg-[#E85550] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {loading ? 'Generating...' : 'Generate Scripts'}
          </button>
        </div>
      </div>

      {/* Right: Results */}
      <div className="flex-1 overflow-y-auto p-5">
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Loader2 size={24} className="text-[#CD3D35] animate-spin" />
            <p className="text-xs text-[#555]">Generating {count} script{count > 1 ? 's' : ''}...</p>
          </div>
        )}
        {!loading && scripts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 gap-2 text-center">
            <Sparkles size={28} className="text-[#2A2A2A]" />
            <p className="text-sm text-[#383838] font-medium">No scripts yet</p>
            <p className="text-xs text-[#383838] max-w-xs">Enter a topic and click Generate to create scripts for your {niche?.label ?? 'niche'} content.</p>
          </div>
        )}
        {!loading && scripts.length > 0 && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[#909090]">{scripts.length} script{scripts.length > 1 ? 's' : ''} generated</p>
              <button onClick={generate} className="flex items-center gap-1.5 text-[10px] text-[#555] hover:text-[#909090] transition-colors">
                <RefreshCw size={10} /> Regenerate
              </button>
            </div>
            {scripts.map((script, idx) => (
              <ScriptCard key={idx} script={script} idx={idx} onSave={() => saveToBoard(script)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Studio;
