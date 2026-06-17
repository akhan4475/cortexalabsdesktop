import React, { useState } from 'react';
import { Monitor, Globe, ChevronRight, Phone, Check, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead } from './types';
import { PIPELINE_STAGES } from './Pipeline';

interface MockupsProps {
  allLeads: Lead[];
  onUpdateLeadStatus: (leadId: string, status: string) => void;
}

const Mockups: React.FC<MockupsProps> = ({ allLeads, onUpdateLeadStatus }) => {
  const [selected, setSelected] = useState<Lead | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const mockupLeads = allLeads.filter(l =>
    l.status === 'mockup_building' || l.status === 'mockup_sent' ||
    l.status === 'Mockup Building' || l.status === 'Mockup Sent'
  );

  const getStageColor = (status: string) => {
    const s = PIPELINE_STAGES.find(p => p.id === status);
    return s?.color ?? '#555';
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Grid */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#1A1A1A] shrink-0">
          <div className="flex items-center gap-2">
            <Monitor size={14} className="text-[#CD3D35]" />
            <span className="text-sm font-semibold text-[#F2F2F2]">Mockups</span>
            <span className="text-xs text-[#555] font-mono">{mockupLeads.length} active</span>
          </div>
          <p className="text-[10px] text-[#555]">Leads in Mockup Building and Mockup Sent stages.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {mockupLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-2 text-center">
              <Monitor size={32} className="text-[#2A2A2A]" />
              <p className="text-sm text-[#383838]">No mockups in progress</p>
              <p className="text-xs text-[#383838] max-w-xs">Move pipeline leads to Mockup Building to track them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {mockupLeads.map(lead => {
                const stageColor = getStageColor(lead.status);
                const isBuilding = lead.status === 'mockup_building' || lead.status === 'Mockup Building';
                const initials = lead.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??';

                return (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`bg-[#141414] border rounded-lg overflow-hidden cursor-pointer transition-colors ${selected?.id === lead.id ? 'border-[#CD3D35]/60' : 'border-[#2A2A2A] hover:border-[#383838]'}`}
                    onClick={() => setSelected(lead)}
                  >
                    {/* Mock preview area */}
                    <div className="h-28 bg-[#0A0A0A] flex items-center justify-center relative">
                      {lead.website ? (
                        <div className="flex flex-col items-center gap-1">
                          <Globe size={20} className="text-[#2A2A2A]" />
                          <p className="text-[9px] text-[#383838] font-mono truncate max-w-[120px]">{lead.website}</p>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: stageColor + '22', color: stageColor }}>
                          {initials}
                        </div>
                      )}
                      {/* Stage badge */}
                      <span
                        className="absolute top-2 right-2 text-[8px] font-semibold px-1.5 py-0.5 rounded"
                        style={{ background: stageColor + '20', color: stageColor }}
                      >
                        {isBuilding ? 'Building' : 'Sent'}
                      </span>
                    </div>

                    {/* Card info */}
                    <div className="p-3">
                      <p className="text-xs font-medium text-[#F2F2F2] truncate">{lead.name}</p>
                      {lead.company && <p className="text-[10px] text-[#555] truncate">{lead.company}</p>}

                      <div className="flex gap-1.5 mt-2">
                        {isBuilding ? (
                          <button
                            onClick={e => { e.stopPropagation(); onUpdateLeadStatus(lead.id, 'mockup_sent'); }}
                            className="flex-1 text-[9px] py-1 rounded bg-[#F97316]/15 text-[#F97316] font-medium hover:bg-[#F97316]/25 transition-colors border border-[#F97316]/30"
                          >
                            Mark Sent
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={e => { e.stopPropagation(); onUpdateLeadStatus(lead.id, 'approved'); }}
                              className="flex-1 text-[9px] py-1 rounded bg-[#8B5CF6]/15 text-[#8B5CF6] font-medium hover:bg-[#8B5CF6]/25 transition-colors border border-[#8B5CF6]/30"
                            >
                              Approved
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); onUpdateLeadStatus(lead.id, 'mockup_building'); }}
                              className="px-1.5 text-[9px] py-1 rounded bg-[#141414] text-[#555] font-medium hover:text-[#909090] transition-colors border border-[#2A2A2A]"
                            >
                              Back
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Side detail */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ x: 280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 280, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-72 shrink-0 border-l border-[#1A1A1A] flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1A]">
              <p className="text-sm font-semibold text-[#F2F2F2]">{selected.name}</p>
              <button onClick={() => setSelected(null)} className="text-[#555] hover:text-[#909090]"><X size={13} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Website preview */}
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-wider font-semibold mb-2">Website Preview</p>
                <div>
                  <input
                    value={previewUrl}
                    onChange={e => setPreviewUrl(e.target.value)}
                    placeholder="Enter preview URL to embed..."
                    className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-[#F2F2F2] placeholder-[#555] focus:outline-none focus:border-[#CD3D35]/50 mb-2"
                  />
                  {previewUrl && (
                    <div className="w-full h-48 bg-[#0A0A0A] rounded border border-[#1A1A1A] overflow-hidden">
                      <iframe
                        src={previewUrl.startsWith('http') ? previewUrl : 'https://' + previewUrl}
                        className="w-full h-full"
                        style={{ transform: 'scale(0.75)', transformOrigin: '0 0', width: '133%', height: '133%' }}
                        sandbox="allow-scripts allow-same-origin"
                        title="Site preview"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Lead info */}
              <div className="space-y-2">
                {selected.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={11} className="text-[#555]" />
                    <span className="text-xs text-[#909090] font-mono">{selected.phone}</span>
                  </div>
                )}
                {selected.website && (
                  <a href={selected.website.startsWith('http') ? selected.website : 'https://' + selected.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-[#3B82F6] hover:underline">
                    <Globe size={11} />
                    <span className="truncate">{selected.website}</span>
                    <ExternalLink size={9} />
                  </a>
                )}
              </div>

              {/* Stage actions */}
              <div className="space-y-2 pt-2 border-t border-[#1A1A1A]">
                <p className="text-[10px] text-[#555] uppercase tracking-wider font-semibold">Move to Stage</p>
                {['mockup_building', 'mockup_sent', 'approved', 'paid', 'lost'].map(stageId => {
                  const stage = PIPELINE_STAGES.find(s => s.id === stageId);
                  if (!stage) return null;
                  return (
                    <button
                      key={stageId}
                      onClick={() => { onUpdateLeadStatus(selected.id, stageId); setSelected(null); }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs border border-[#2A2A2A] hover:bg-[#1E1E1E] transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: stage.color }} />
                      <span className="text-[#909090]">{stage.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Mockups;
