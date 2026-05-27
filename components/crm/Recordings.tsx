import React, { useState, useEffect, useMemo } from 'react';
import { Radio, Play, Pause, ChevronRight, ArrowLeft, Phone, Clock, Calendar, Folder, Edit2, Trash2, Check, X } from 'lucide-react';
import { Campaign } from './types';
import { supabase } from '../../lib/supabase';

interface Recording {
    id: string;
    user_id: string;
    lead_id: string | null;
    campaign_id: string | null;
    lead_name: string;
    phone_number: string;
    recording_url: string;
    recording_sid: string;
    duration: number;
    call_date: string;
    created_at: string;
}

interface RecordingsProps {
    campaigns: Campaign[];
}

const SUPABASE_URL = 'https://zfjbpohfdoeougmhocfa.supabase.co';

const Recordings: React.FC<RecordingsProps> = ({ campaigns }) => {
    const [view, setView] = useState<'campaigns' | 'recordings'>('campaigns');
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
    const [recordings, setRecordings] = useState<Recording[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [playingRecordingId, setPlayingRecordingId] = useState<string | null>(null);
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
    const [editingRecordingId, setEditingRecordingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    // Fetch recordings from Supabase
    useEffect(() => {
        fetchRecordings();
    }, []);

    const fetchRecordings = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('call_recordings')
                .select('*')
                .eq('user_id', user.id)
                .order('call_date', { ascending: false });

            if (error) {
                console.error('Error fetching recordings:', error);
            } else {
                setRecordings(data || []);
            }
        } catch (error) {
            console.error('Failed to fetch recordings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Group recordings by campaign
    const recordingsByCampaign = useMemo(() => {
        const grouped: Record<string, Recording[]> = {};

        recordings.forEach(recording => {
            const campaignId = recording.campaign_id || 'testing';
            if (!grouped[campaignId]) {
                grouped[campaignId] = [];
            }
            grouped[campaignId].push(recording);
        });

        return grouped;
    }, [recordings]);

    // Get campaign name by ID
    const getCampaignName = (campaignId: string): string => {
        if (campaignId === 'testing') return 'Testing';
        const campaign = campaigns.find(c => c.id === campaignId);
        return campaign?.name || 'Unknown Campaign';
    };

    // Get recordings for selected campaign
    const selectedRecordings = useMemo(() => {
        if (!selectedCampaignId) return [];
        return recordingsByCampaign[selectedCampaignId] || [];
    }, [selectedCampaignId, recordingsByCampaign]);

    // Format duration (seconds to mm:ss)
    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Format date (YYYY-MM-DD to readable format)
    // Format date (Relative, Day of Week, or Date)
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        
        // Reset hours to compare calendar days accurately
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        
        const diffMs = today.getTime() - targetDate.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        
        // If within the last 7 days, show the day of the week (e.g., "Monday")
        if (diffDays < 7) {
            return date.toLocaleDateString('en-US', { weekday: 'long' });
        }
        
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
        });
    };

    // Format time (HH:MM AM/PM)
    const formatTime = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    };

    // Get proxied recording URL
    const getRecordingUrl = (recordingSid: string): string => {
        return `${SUPABASE_URL}/functions/v1/get-recording?sid=${recordingSid}`;
    };

    // Play/Pause recording
    const togglePlayRecording = (recordingSid: string, recordingId: string) => {
        // Stop currently playing audio
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
        }

        // If clicking the same recording, just stop it
        if (playingRecordingId === recordingId) {
            setPlayingRecordingId(null);
            setAudioElement(null);
            return;
        }

        // Create new audio element with proxied URL
        const proxyUrl = getRecordingUrl(recordingSid);
        const audio = new Audio(proxyUrl);
        
        audio.addEventListener('ended', () => {
            setPlayingRecordingId(null);
            setAudioElement(null);
        });

        audio.addEventListener('error', (e) => {
            console.error('Audio playback error:', e);
            setPlayingRecordingId(null);
            setAudioElement(null);
            alert('Failed to play recording. Please try again.');
        });
        
        audio.play().catch(err => {
            console.error('Play failed:', err);
            alert('Failed to play recording. Please try again.');
        });
        
        setAudioElement(audio);
        setPlayingRecordingId(recordingId);
    };

    // Start editing recording name
    const startEditing = (recording: Recording) => {
        setEditingRecordingId(recording.id);
        setEditingName(recording.lead_name);
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditingRecordingId(null);
        setEditingName('');
    };

    // Save edited name
    const saveRecordingName = async (recordingId: string) => {
        if (!editingName.trim()) {
            alert('Name cannot be empty');
            return;
        }

        try {
            const { error } = await supabase
                .from('call_recordings')
                .update({ lead_name: editingName.trim() })
                .eq('id', recordingId);

            if (error) throw error;

            // Update local state
            setRecordings(prev => prev.map(rec => 
                rec.id === recordingId 
                    ? { ...rec, lead_name: editingName.trim() }
                    : rec
            ));

            setEditingRecordingId(null);
            setEditingName('');
        } catch (error) {
            console.error('Error updating recording name:', error);
            alert('Failed to update name. Please try again.');
        }
    };

    // Delete recording
    const deleteRecording = async (recordingId: string, recordingName: string) => {
        if (!confirm(`Are you sure you want to delete the recording for "${recordingName}"? This cannot be undone.`)) {
            return;
        }

        // Stop audio if this recording is playing
        if (playingRecordingId === recordingId && audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
            setPlayingRecordingId(null);
            setAudioElement(null);
        }

        try {
            const { error } = await supabase
                .from('call_recordings')
                .delete()
                .eq('id', recordingId);

            if (error) throw error;

            // Update local state
            setRecordings(prev => prev.filter(rec => rec.id !== recordingId));
        } catch (error) {
            console.error('Error deleting recording:', error);
            alert('Failed to delete recording. Please try again.');
        }
    };

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioElement) {
                audioElement.pause();
                audioElement.currentTime = 0;
            }
        };
    }, [audioElement]);

    // Select campaign
    const selectCampaign = (campaignId: string) => {
        setSelectedCampaignId(campaignId);
        setView('recordings');
    };

    // Go back to campaigns view
    const goBack = () => {
        setView('campaigns');
        setSelectedCampaignId(null);
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
            setPlayingRecordingId(null);
            setAudioElement(null);
        }
        cancelEditing();
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-[3px] border-white/8 border-t-[#CD3D35] animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">Loading recordings…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="bg-[#0c0c0e] border border-white/8 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-lg">

                {/* Header */}
                <div className="px-5 py-3.5 border-b border-white/8 flex items-center justify-between shrink-0">
                    {view === 'campaigns' ? (
                        <>
                            <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                                <Radio size={14} className="text-[#CD3D35]" /> Call Recordings
                            </h3>
                            <span className="text-[10px] font-mono text-gray-500 bg-white/5 border border-white/8 px-2 py-0.5 rounded-full">
                                {recordings.length} total
                            </span>
                        </>
                    ) : (
                        <div className="flex items-center gap-3 w-full">
                            <button onClick={goBack} className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                                <ArrowLeft size={15} />
                            </button>
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div className="w-5 h-5 rounded-md bg-[#CD3D35]/15 flex items-center justify-center shrink-0">
                                    <Folder size={11} className="text-[#CD3D35]" />
                                </div>
                                <h3 className="font-bold text-white truncate text-sm">{getCampaignName(selectedCampaignId || '')}</h3>
                            </div>
                            <span className="text-[10px] font-mono text-gray-500 bg-white/5 border border-white/8 px-2 py-0.5 rounded-full shrink-0">
                                {selectedRecordings.length} recording{selectedRecordings.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto crm-scroll min-h-0">
                    {view === 'campaigns' ? (
                        <div className="p-4 space-y-2">
                            {recordings.length === 0 ? (
                                <div className="text-center py-24">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mx-auto mb-4">
                                        <Radio size={28} className="text-gray-700" />
                                    </div>
                                    <h3 className="text-base font-bold text-white mb-2">No Recordings Yet</h3>
                                    <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                        Enable recording in the dialer to start capturing your calls.
                                    </p>
                                </div>
                            ) : (
                                Object.entries(recordingsByCampaign)
                                    .sort(([keyA], [keyB]) => {
                                        if (keyA === 'testing') return 1;
                                        if (keyB === 'testing') return -1;
                                        return getCampaignName(keyA).localeCompare(getCampaignName(keyB));
                                    })
                                    .map(([campaignId, campaignRecordings]) => (
                                        <button
                                            key={campaignId}
                                            onClick={() => selectCampaign(campaignId)}
                                            className="w-full text-left p-4 bg-white/[0.02] border border-white/8 rounded-xl hover:border-[#CD3D35]/40 hover:bg-white/[0.04] transition-all flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-3.5">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                    campaignId === 'testing'
                                                        ? 'bg-orange-500/10 text-orange-400'
                                                        : 'bg-[#CD3D35]/10 text-[#CD3D35]'
                                                }`}>
                                                    <Folder size={18} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-sm">{getCampaignName(campaignId)}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">
                                                        {campaignRecordings.length} Recording{campaignRecordings.length !== 1 ? 's' : ''}
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight size={15} className="text-gray-600 group-hover:text-[#CD3D35] transition-colors" />
                                        </button>
                                    ))
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-white/[0.04]">
                            {selectedRecordings.length === 0 ? (
                                <div className="text-center py-20 text-gray-600 text-sm">
                                    No recordings in this campaign
                                </div>
                            ) : (
                                selectedRecordings.map((recording) => (
                                    <div key={recording.id} className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
                                        <div className="flex items-center gap-4">
                                            {/* Play Button */}
                                            <button
                                                onClick={() => togglePlayRecording(recording.recording_sid, recording.id)}
                                                disabled={editingRecordingId === recording.id}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all disabled:opacity-50 border ${
                                                    playingRecordingId === recording.id
                                                        ? 'bg-[#CD3D35] border-[#CD3D35] text-white'
                                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                {playingRecordingId === recording.id
                                                    ? <Pause size={16} fill="currentColor" />
                                                    : <Play size={16} fill="currentColor" className="ml-0.5" />
                                                }
                                            </button>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {editingRecordingId === recording.id ? (
                                                        <div className="flex items-center gap-2 flex-1">
                                                            <input
                                                                type="text"
                                                                value={editingName}
                                                                onChange={(e) => setEditingName(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') saveRecordingName(recording.id);
                                                                    if (e.key === 'Escape') cancelEditing();
                                                                }}
                                                                className="flex-1 bg-white/[0.03] border border-[#CD3D35]/40 rounded-lg px-2 py-1 text-sm text-white focus:outline-none"
                                                                autoFocus
                                                            />
                                                            <button onClick={() => saveRecordingName(recording.id)}
                                                                className="p-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-green-400 transition-colors" title="Save">
                                                                <Check size={13} />
                                                            </button>
                                                            <button onClick={cancelEditing}
                                                                className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 transition-colors" title="Cancel">
                                                                <X size={13} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <h4 className="font-semibold text-white text-sm truncate">{recording.lead_name}</h4>
                                                            {playingRecordingId === recording.id && (
                                                                <span className="flex items-center gap-1 text-[9px] text-[#CD3D35] font-bold uppercase animate-pulse shrink-0">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#CD3D35]" /> Playing
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] text-gray-500">
                                                    <span className="flex items-center gap-1"><Phone size={10} /> {recording.phone_number}</span>
                                                    <span className="flex items-center gap-1"><Clock size={10} /> {formatDuration(recording.duration)}</span>
                                                    <span className="flex items-center gap-1"><Calendar size={10} /> {formatDate(recording.call_date)} · {formatTime(recording.call_date)}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            {editingRecordingId !== recording.id && (
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <span className="px-2 py-1 bg-white/[0.03] border border-white/8 rounded-lg text-[10px] font-mono text-gray-500">
                                                        {formatDuration(recording.duration)}
                                                    </span>
                                                    <button onClick={() => startEditing(recording)}
                                                        className="p-1.5 bg-white/5 hover:bg-blue-500/10 border border-white/8 hover:border-blue-500/30 rounded-lg text-gray-500 hover:text-blue-400 transition-all" title="Edit name">
                                                        <Edit2 size={13} />
                                                    </button>
                                                    <button onClick={() => deleteRecording(recording.id, recording.lead_name)}
                                                        className="p-1.5 bg-white/5 hover:bg-red-500/10 border border-white/8 hover:border-red-500/30 rounded-lg text-gray-500 hover:text-red-400 transition-all" title="Delete">
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Recordings;