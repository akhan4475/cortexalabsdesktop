import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, Search, ChevronRight, FileText, Link2, Video, Mic, BookOpen, Loader2, Trash2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNiche } from '../../lib/NicheContext';
import { CONTENT_BUCKETS } from '../../lib/niches';
import { summariseContent } from '../../lib/ai';
import { supabase } from '../../lib/supabase';

const SOURCE_ICONS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  text: FileText,
  url: Link2,
  youtube: Video,
  instagram: Video,
  tiktok: Video,
  audio: Mic,
  pdf: FileText,
};

const SOURCE_TYPES = [
  { id: 'text', label: 'Text / Paste' },
  { id: 'url', label: 'URL / Link' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
];

interface ContextItem {
  id: string;
  user_id?: string;
  bucket: string;
  source_type: string;
  title?: string;
  content?: string;
  url?: string;
  summary?: string;
  tags?: string[];
  created_at?: string;
}

const Library: React.FC = () => {
  const { activeNiche } = useNiche();
  const [activeBucket, setActiveBucket] = useState(CONTENT_BUCKETS[0].id);
  const [items, setItems] = useState<ContextItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Add form state
  const [addForm, setAddForm] = useState({ sourceType: 'text', title: '', content: '', url: '' });
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('context_items').select('*').eq('user_id', user.id).eq('bucket', activeBucket).order('created_at', { ascending: false });
      if (data) setItems(data as ContextItem[]);
    } catch {}
    setLoading(false);
  }, [activeBucket]);

  useEffect(() => { load(); }, [load]);

  const filteredItems = items.filter(item => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return item.title?.toLowerCase().includes(q) || item.summary?.toLowerCase().includes(q) || item.content?.toLowerCase().includes(q) || item.tags?.some(t => t.toLowerCase().includes(q));
  });

  const addItem = async () => {
    if (!addForm.content.trim() && !addForm.url.trim()) return;
    setAdding(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let summary = '';
      let tags: string[] = [];

      const contentToSummarise = addForm.sourceType === 'text' ? addForm.content : addForm.url;
      if (contentToSummarise.trim().length > 50) {
        const result = await summariseContent(contentToSummarise, activeBucket);
        summary = result.summary;
        tags = result.tags;
      }

      const newItem: ContextItem = {
        id: `ctx-${Date.now()}`,
        user_id: user.id,
        bucket: activeBucket,
        source_type: addForm.sourceType,
        title: addForm.title.trim() || (addForm.url ? new URL(addForm.url.startsWith('http') ? addForm.url : 'https://' + addForm.url).hostname : 'Untitled'),
        content: addForm.content.trim() || addForm.url.trim(),
        url: addForm.url.trim() || undefined,
        summary,
        tags,
        created_at: new Date().toISOString(),
      };

      await supabase.from('context_items').insert(newItem);
      setItems(prev => [newItem, ...prev]);
      setAddForm({ sourceType: 'text', title: '', content: '', url: '' });
      setShowAdd(false);
    } catch (e) {
      console.error('Error adding item:', e);
    }
    setAdding(false);
  };

  const deleteItem = async (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    try { await supabase.from('context_items').delete().eq('id', id); } catch {}
  };

  const bucket = CONTENT_BUCKETS.find(b => b.id === activeBucket);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Bucket sidebar */}
      <div className="w-52 shrink-0 border-r border-[#1A1A1A] overflow-y-auto py-2" style={{ scrollbarWidth: 'none' }}>
        <p className="text-[9px] text-[#383838] uppercase tracking-[0.2em] font-semibold px-3.5 pb-1.5 pt-1">Buckets</p>
        {CONTENT_BUCKETS.map(b => (
          <button
            key={b.id}
            onClick={() => { setActiveBucket(b.id); setExpanded(null); }}
            className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center gap-2 ${activeBucket === b.id ? 'text-[#F2F2F2] bg-[#141414]' : 'text-[#555] hover:text-[#909090] hover:bg-[#0F0F0F]'}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeBucket === b.id ? 'bg-[#CD3D35]' : 'bg-[#2A2A2A]'}`} />
            <span className="truncate">{b.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1A] shrink-0">
          <div>
            <p className="text-sm font-semibold text-[#F2F2F2]">{bucket?.label}</p>
            {bucket?.description && <p className="text-[10px] text-[#555]">{bucket.description}</p>}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#555]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-[#141414] border border-[#2A2A2A] rounded pl-6 pr-2.5 py-1 text-xs text-[#F2F2F2] placeholder-[#555] focus:outline-none focus:border-[#CD3D35]/40 w-36"
              />
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#CD3D35] text-white rounded text-xs font-medium hover:bg-[#E85550] transition-colors"
            >
              <Plus size={11} /> Add
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 size={18} className="text-[#555] animate-spin" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <BookOpen size={24} className="text-[#2A2A2A]" />
              <p className="text-sm text-[#383838]">No items in {bucket?.label}</p>
              <p className="text-xs text-[#383838]">Add content to start building your knowledge base.</p>
            </div>
          ) : (
            <div className="space-y-2 max-w-2xl">
              {filteredItems.map(item => {
                const Icon = SOURCE_ICONS[item.source_type] ?? FileText;
                const isExpanded = expanded === item.id;
                return (
                  <div key={item.id} className="bg-[#141414] border border-[#2A2A2A] rounded-lg overflow-hidden hover:border-[#383838] transition-colors">
                    <div
                      className="flex items-center gap-2.5 p-3 cursor-pointer"
                      onClick={() => setExpanded(isExpanded ? null : item.id)}
                    >
                      <Icon size={13} className="text-[#555] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#F2F2F2] truncate">{item.title ?? 'Untitled'}</p>
                        {item.summary && !isExpanded && (
                          <p className="text-[10px] text-[#555] truncate">{item.summary}</p>
                        )}
                      </div>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex gap-1 shrink-0">
                          {item.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 bg-[#1E1E1E] rounded text-[9px] text-[#555]">{tag}</span>
                          ))}
                        </div>
                      )}
                      <ChevronDown size={12} className={`text-[#555] shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 border-t border-[#1A1A1A]">
                            <div className="pt-2.5 space-y-2">
                              {item.summary && (
                                <div>
                                  <p className="text-[9px] text-[#555] uppercase tracking-wider font-semibold mb-1">Summary</p>
                                  <p className="text-xs text-[#909090] leading-relaxed whitespace-pre-wrap">{item.summary}</p>
                                </div>
                              )}
                              {item.content && item.source_type === 'text' && (
                                <div>
                                  <p className="text-[9px] text-[#555] uppercase tracking-wider font-semibold mb-1">Content</p>
                                  <p className="text-xs text-[#555] leading-relaxed line-clamp-6">{item.content}</p>
                                </div>
                              )}
                              {item.url && (
                                <div>
                                  <p className="text-[9px] text-[#555] uppercase tracking-wider font-semibold mb-1">URL</p>
                                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#3B82F6] hover:underline truncate block">{item.url}</a>
                                </div>
                              )}
                              {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {item.tags.map(tag => <span key={tag} className="px-2 py-0.5 bg-[#1E1E1E] border border-[#2A2A2A] rounded text-[10px] text-[#555]">{tag}</span>)}
                                </div>
                              )}
                              <div className="flex justify-end">
                                <button onClick={() => deleteItem(item.id)} className="flex items-center gap-1 text-[10px] text-[#555] hover:text-red-500 transition-colors">
                                  <Trash2 size={10} /> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-md bg-[#141414] border border-[#2A2A2A] rounded-xl shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
                <div>
                  <p className="text-sm font-semibold text-[#F2F2F2]">Add to {bucket?.label}</p>
                  <p className="text-[10px] text-[#555]">{bucket?.description}</p>
                </div>
                <button onClick={() => setShowAdd(false)} className="text-[#555] hover:text-[#909090]"><X size={14} /></button>
              </div>
              <div className="p-4 space-y-3">
                {/* Source type */}
                <div>
                  <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1.5">Source Type</label>
                  <div className="flex flex-wrap gap-1.5">
                    {SOURCE_TYPES.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setAddForm(f => ({ ...f, sourceType: t.id }))}
                        className={`px-2.5 py-1 rounded text-[10px] font-medium border transition-colors ${addForm.sourceType === t.id ? 'bg-[#CD3D35]/15 text-[#CD3D35] border-[#CD3D35]/40' : 'bg-[#0A0A0A] text-[#555] border-[#2A2A2A] hover:text-[#909090]'}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Title */}
                <div>
                  <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1">Title (optional)</label>
                  <input
                    value={addForm.title}
                    onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Give this item a name..."
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-[#F2F2F2] placeholder-[#555] focus:outline-none focus:border-[#CD3D35]/50"
                  />
                </div>
                {/* Content or URL */}
                {addForm.sourceType === 'text' ? (
                  <div>
                    <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1">Content</label>
                    <textarea
                      value={addForm.content}
                      onChange={e => setAddForm(f => ({ ...f, content: e.target.value }))}
                      placeholder="Paste text, script, notes, or any content..."
                      rows={6}
                      className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded px-2.5 py-2 text-xs text-[#F2F2F2] placeholder-[#555] focus:outline-none focus:border-[#CD3D35]/50 resize-none leading-relaxed"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1">URL</label>
                    <input
                      value={addForm.url}
                      onChange={e => setAddForm(f => ({ ...f, url: e.target.value }))}
                      placeholder="https://..."
                      className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-[#F2F2F2] placeholder-[#555] focus:outline-none focus:border-[#CD3D35]/50"
                    />
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-[#2A2A2A] flex gap-2">
                <button
                  onClick={addItem}
                  disabled={adding || (!addForm.content.trim() && !addForm.url.trim())}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#CD3D35] text-white rounded text-xs font-medium hover:bg-[#E85550] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {adding ? <><Loader2 size={11} className="animate-spin" /> Saving...</> : 'Save Item'}
                </button>
                <button onClick={() => setShowAdd(false)} className="px-3 py-2 text-xs text-[#555] hover:text-[#909090] transition-colors">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Library;
