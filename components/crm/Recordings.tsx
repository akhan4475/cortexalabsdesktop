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
                    <div className="w-16 h-16 rounded-full border-4 border-[#262624] border-t-horizon-accent animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">Loading recordings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="bg-[#18181b] border border-[#262624] rounded-2xl flex-1 flex flex-col overflow-hidden shadow-lg">
                {/* Header */}
                <div className="p-4 border-b border-[#262624] flex items-center justify-between bg-[#262624]/20 shrink-0">
                    {view === 'campaigns' ? (
                        <>
                            <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                                <Radio size={16} className="text-horizon-accent" /> Call Recordings
                            </h3>
                            <div className="text-xs text-gray-500">
                                {recordings.length} Total Recording{recordings.length !== 1 ? 's' : ''}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3 w-full">
                            <button 
                                onClick={goBack} 
                                className="p-1 hover:bg-[#333] rounded text-gray-400 transition-colors"
                            >
                                <ArrowLeft size={16} />
                            </button>
                            <h3 className="font-bold text-white truncate text-sm">
                                {getCampaignName(selectedCampaignId || '')}
                            </h3>
                            <div className="ml-auto text-xs text-gray-500">
                                {selectedRecordings.length} Recording{selectedRecordings.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto crm-scroll min-h-0">
                    {view === 'campaigns' ? (
                        /* Campaign List View */
                        <div className="p-4 space-y-3">
                            {recordings.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                                        <Radio size={32} className="text-gray-700" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">No Recordings Yet</h3>
                                    <p className="text-gray-500 text-sm max-w-sm mx-auto">
                                        Enable recording in the dialer to start capturing your calls.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Campaign Folders */}
                                    {Object.entries(recordingsByCampaign)
                                        .sort(([keyA], [keyB]) => {
                                            // "Testing" folder always goes last
                                            if (keyA === 'testing') return 1;
                                            if (keyB === 'testing') return -1;
                                            // Sort other campaigns by name
                                            return getCampaignName(keyA).localeCompare(getCampaignName(keyB));
                                        })
                                        .map(([campaignId, campaignRecordings]) => (
                                            <button
                                                key={campaignId}
                                                onClick={() => selectCampaign(campaignId)}
                                                className="w-full text-left p-4 bg-[#09090b] border border-[#262624] rounded-xl hover:border-horizon-accent/50 transition-all flex items-center justify-between group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                        campaignId === 'testing' 
                                                            ? 'bg-orange-500/10 text-orange-400' 
                                                            : 'bg-horizon-accent/10 text-horizon-accent'
                                                    }`}>
                                                        <Folder size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-sm mb-1">
                                                            {getCampaignName(campaignId)}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {campaignRecordings.length} Recording{campaignRecordings.length !== 1 ? 's' : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronRight 
                                                    size={18} 
                                                    className="text-gray-500 group-hover:text-horizon-accent transition-colors" 
                                                />
                                            </button>
                                        ))}
                                </>
                            )}
                        </div>
                    ) : (
                        /* Recordings List View */
                        <div className="divide-y divide-[#262624]">
                            {selectedRecordings.length === 0 ? (
                                <div className="text-center py-20 text-gray-500 text-sm">
                                    No recordings in this campaign
                                </div>
                            ) : (
                                selectedRecordings.map((recording) => (
                                    <div
                                        key={recording.id}
                                        className="p-4 hover:bg-[#262624]/30 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Play Button */}
                                            <button
                                                onClick={() => togglePlayRecording(recording.recording_sid, recording.id)}
                                                disabled={editingRecordingId === recording.id}
                                                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all disabled:opacity-50 ${
                                                    playingRecordingId === recording.id
                                                        ? 'bg-horizon-accent text-black hover:bg-white'
                                                        : 'bg-[#262624] text-gray-400 hover:bg-[#333] hover:text-white'
                                                }`}
                                            >
                                                {playingRecordingId === recording.id ? (
                                                    <Pause size={20} fill="currentColor" />
                                                ) : (
                                                    <Play size={20} fill="currentColor" className="ml-0.5" />
                                                )}
                                            </button>

                                            {/* Recording Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {editingRecordingId === recording.id ? (
                                                        /* Editing Mode */
                                                        <div className="flex items-center gap-2 flex-1">
                                                            <input
                                                                type="text"
                                                                value={editingName}
                                                                onChange={(e) => setEditingName(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') saveRecordingName(recording.id);
                                                                    if (e.key === 'Escape') cancelEditing();
                                                                }}
                                                                className="flex-1 bg-[#09090b] border border-horizon-accent/50 rounded px-2 py-1 text-sm text-white focus:outline-none"
                                                                autoFocus
                                                            />
                                                            <button
                                                                onClick={() => saveRecordingName(recording.id)}
                                                                className="p-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded text-green-400 transition-colors"
                                                                title="Save"
                                                            >
                                                                <Check size={14} />
                                                            </button>
                                                            <button
                                                                onClick={cancelEditing}
                                                                className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded text-red-400 transition-colors"
                                                                title="Cancel"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        /* Display Mode */
                                                        <>
                                                            <h4 className="font-bold text-white text-sm truncate">
                                                                {recording.lead_name}
                                                            </h4>
                                                            {playingRecordingId === recording.id && (
                                                                <span className="flex items-center gap-1 text-[10px] text-horizon-accent font-bold uppercase animate-pulse">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-horizon-accent" />
                                                                    Playing
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1.5">
                                                        <Phone size={12} />
                                                        {recording.phone_number}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock size={12} />
                                                        {formatDuration(recording.duration)}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar size={12} />
                                                        {formatDate(recording.call_date)} at {formatTime(recording.call_date)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            {editingRecordingId !== recording.id && (
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {/* Duration Badge */}
                                                    <div className="px-3 py-1.5 bg-[#09090b] border border-[#262624] rounded-lg text-xs font-mono text-gray-400">
                                                        {formatDuration(recording.duration)}
                                                    </div>

                                                    {/* Edit Button */}
                                                    <button
                                                        onClick={() => startEditing(recording)}
                                                        className="p-2 bg-[#262624] hover:bg-[#333] border border-[#262624] hover:border-blue-500/30 rounded-lg text-gray-400 hover:text-blue-400 transition-all"
                                                        title="Edit name"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>

                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => deleteRecording(recording.id, recording.lead_name)}
                                                        className="p-2 bg-[#262624] hover:bg-red-500/10 border border-[#262624] hover:border-red-500/30 rounded-lg text-gray-400 hover:text-red-400 transition-all"
                                                        title="Delete recording"
                                                    >
                                                        <Trash2 size={14} />
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