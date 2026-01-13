import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Save, ArrowLeft, ChevronRight, MessageSquare, ClipboardList, CheckCircle2, AlertCircle, FileText, Delete, Mail, Mic, MicOff, Volume2, VolumeX, Circle } from 'lucide-react';
import { Lead, Campaign } from './types';
import { supabase } from '../../lib/supabase';

// Twilio Device types
declare global {
    interface Window {
        Twilio: any;
    }
}

const getStatusStyles = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('new')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (s.includes('booked')) return 'bg-green-500/10 text-green-400 border-green-500/20';
    if (s.includes('not interested')) return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (s.includes('follow-up') || s.includes('voicemail') || s.includes('wrong number')) return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
};

interface DialerProps {
    campaigns: Campaign[];
    allLeads: Lead[];
    onUpdateLeadStatus: (leadId: string, newStatus: string) => void;
    initialLeadId?: string;
    initialCampaignId?: string;
}

const SUPABASE_URL = 'https://zfjbpohfdoeougmhocfa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmamJwb2hmZG9lb3VnbWhvY2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NjA5NDgsImV4cCI6MjA4MzIzNjk0OH0.P7XkB7FNmxR9XHqTukkC0P6QNh6H_bsP2CsegKLt4gE'; // REPLACE THIS

const Dialer: React.FC<DialerProps> = ({ campaigns, allLeads, onUpdateLeadStatus, initialLeadId, initialCampaignId }) => {
    // --- Dialer State ---
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isCallActive, setIsCallActive] = useState(false);
    const [callTime, setCallTime] = useState(0);
    const [currentCall, setCurrentCall] = useState<any>(null);
    const [callStatus, setCallStatus] = useState<string>('');
    const [callError, setCallError] = useState<string>('');
    const [isMuted, setIsMuted] = useState(false);
    const [isRecording, setIsRecording] = useState(false); // 🔴 NEW: Recording state
    const [isDeviceReady, setIsDeviceReady] = useState(false);
    
    const deviceRef = useRef<any>(null);
    
    const [script, setScript] = useState(`INTRO / PATTERN INTERRUPT:
"Hey is this [Name]?"
"Hey [Name], this is [Your Name] from Horizon AI, how've you been?"

REASON FOR CALL:
"I'm calling because I saw you were looking into AI automation solutions recently..."`);

    // --- Right Panel State ---
    const [view, setView] = useState<'campaigns' | 'leads' | 'lead-detail'>('campaigns');
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [callNote, setCallNote] = useState('');
    const [selectedOutcome, setSelectedOutcome] = useState('');
    const [showOutcomeError, setShowOutcomeError] = useState(false);

    // Initialize Twilio Device
    useEffect(() => {
        const initializeDevice = async () => {
            try {
                // Load Twilio Voice SDK v2
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/@twilio/voice-sdk@2.11.2/dist/twilio.min.js';
                script.async = true;
                document.body.appendChild(script);

                script.onload = async () => {
                    console.log('📞 Twilio Voice SDK v2 loaded');

                    // Get current user
                    const { data: { user } } = await supabase.auth.getUser();

                    if (!user) {
                        setCallError('User not authenticated');
                        return;
                    }

                    // Get access token
                    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-token`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                        },
                        body: JSON.stringify({ 
                            identity: `user_${Date.now()}`,
                            userId: user.id
                        })
                    });

                    const data = await response.json();

                    // DEBUG: Log the response
                    console.log('🔍 Token Response:', data);

                    if (data.error) {
                        setCallError(`Token Error: ${data.error}`);
                        console.error('❌ Token generation failed:', data.error);
                        return;
                    }
                    
                    if (data.token) {
                        // Initialize Twilio Device with v2 SDK
                        const { Device } = window.Twilio;
                        const device = new Device(data.token, {
                            codecPreferences: ['opus', 'pcmu'],
                            edge: 'ashburn'
                        });

                        // Register event listeners
                        device.on('registered', () => {
                            console.log('✅ Twilio Device registered');
                            setIsDeviceReady(true);
                            setCallStatus('ready');
                        });

                        device.on('error', (error: any) => {
                            console.error('❌ Device error:', error);
                            setCallError(error.message);
                            setCallStatus('error');
                        });

                        device.on('incoming', (call: any) => {
                            console.log('📞 Incoming call');
                            // We don't handle incoming calls in this dialer
                        });

                        // Register the device
                        await device.register();

                        deviceRef.current = device;
                    } else {
                        setCallError('Failed to get access token');
                    }
                };

                script.onerror = () => {
                    setCallError('Failed to load Twilio SDK');
                };

            } catch (error: any) {
                console.error('Failed to initialize Twilio Device:', error);
                setCallError(error.message);
            }
        };

        initializeDevice();

        return () => {
            if (deviceRef.current) {
                deviceRef.current.destroy();
            }
        };
    }, []);

    // Call timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isCallActive) {
            interval = setInterval(() => {
                setCallTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isCallActive]);

    // Initial navigation handling
    useEffect(() => {
        if (initialCampaignId) {
            const camp = campaigns.find(c => c.id === initialCampaignId);
            if (camp) {
                setSelectedCampaign(camp);
                setView('leads');
                
                if (initialLeadId) {
                    const lead = allLeads.find(l => l.id === initialLeadId);
                    if (lead) {
                        selectLead(lead);
                    }
                }
            }
        }
    }, [initialLeadId, initialCampaignId, campaigns, allLeads]);

    const getLeadSortOrder = (id: string) => {
        const parts = id.split('-');
        const suffix = parts[parts.length - 1];
        const match = suffix.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    };

    const filteredLeads = useMemo(() => {
        if (!selectedCampaign) return [];
        let leads = allLeads.filter(l => l.campaignId === selectedCampaign.id);
        leads.sort((a, b) => getLeadSortOrder(a.id) - getLeadSortOrder(b.id));
        return leads;
    }, [selectedCampaign, allLeads]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleDigitClick = (digit: string) => {
        setPhoneNumber(prev => prev + digit);
        
        // Send DTMF if call is active
        if (currentCall) {
            currentCall.sendDigits(digit);
        }
    };

    const handleCallToggle = async () => {
        if (!phoneNumber) {
            setCallError('Please enter a phone number');
            return;
        }

        if (!isDeviceReady) {
            setCallError('Device not ready. Please refresh the page.');
            return;
        }

        if (isCallActive && currentCall) {
            // Disconnect current call
            currentCall.disconnect();
            setIsCallActive(false);
            setCurrentCall(null);
            setCallStatus('disconnected');
            setIsRecording(false); // 🔴 Reset recording state
            
        } else {
            // Start new call
            setCallError('');
            setCallStatus('calling');
            
            try {
                // Get current user
                const { data: { user } } = await supabase.auth.getUser();

                // 🔴 NEW: Include recording parameter
                const call = await deviceRef.current.connect({
                    params: {
                        To: phoneNumber,
                        Record: isRecording ? 'true' : 'false',
                        UserId: user?.id || '',
                        LeadId: selectedLead?.id || '',
                        CampaignId: selectedCampaign?.id || '',
                        LeadName: selectedLead?.name || 'Unknown'
                    }
                });

                // Set up call event listeners
                call.on('accept', () => {
                    console.log('📞 Call accepted');
                    setIsCallActive(true);
                    setCallStatus('connected');
                    setCallTime(0);
                });

                call.on('disconnect', () => {
                    console.log('📴 Call disconnected');
                    setIsCallActive(false);
                    setCallStatus('disconnected');
                    setCurrentCall(null);
                    setCallTime(0);
                    setIsRecording(false); // 🔴 Reset recording state
                });

                call.on('reject', () => {
                    console.log('❌ Call rejected');
                    setIsCallActive(false);
                    setCallStatus('rejected');
                    setCurrentCall(null);
                    setCallError('Call was rejected');
                    setIsRecording(false); // 🔴 Reset recording state
                });

                call.on('cancel', () => {
                    console.log('🚫 Call cancelled');
                    setIsCallActive(false);
                    setCallStatus('cancelled');
                    setCurrentCall(null);
                    setIsRecording(false); // 🔴 Reset recording state
                });

                call.on('error', (error: any) => {
                    console.error('❌ Call error:', error);
                    setCallError(error.message);
                    setIsCallActive(false);
                    setCallStatus('error');
                    setCurrentCall(null);
                    setIsRecording(false); // 🔴 Reset recording state
                });

                setCurrentCall(call);
                
            } catch (error: any) {
                console.error('Call error:', error);
                setCallError(error.message || 'Failed to initiate call');
                setCallStatus('error');
            }
        }
    };

    const toggleMute = () => {
        if (currentCall) {
            const newMuteState = !isMuted;
            currentCall.mute(newMuteState);
            setIsMuted(newMuteState);
        }
    };

    // 🔴 NEW: Toggle recording (only when call is NOT active)
    const toggleRecording = () => {
        if (!isCallActive) {
            setIsRecording(!isRecording);
        }
    };

    const selectLead = (lead: Lead) => {
        setSelectedLead(lead);
        setPhoneNumber(lead.phone);
        setView('lead-detail');
        setSelectedOutcome('');
        setCallNote('');
        setShowOutcomeError(false);
        setCallError('');
    };

    const handleBackspace = () => setPhoneNumber(prev => prev.slice(0, -1));

    const handleNextLead = () => {
        if (!selectedOutcome || selectedOutcome === 'Select Disposition...') {
            setShowOutcomeError(true);
            return;
        }
        setShowOutcomeError(false);
        if (selectedLead) onUpdateLeadStatus(selectedLead.id, selectedOutcome);
        
        const currentIndex = filteredLeads.findIndex(l => l.id === selectedLead?.id);
        if (currentIndex !== -1 && currentIndex < filteredLeads.length - 1) {
            selectLead(filteredLeads[currentIndex + 1]);
        } else {
            alert("End of lead list for this campaign.");
            setView('leads');
            setSelectedLead(null);
        }
    };

    return (
        <div className="h-full min-h-0 max-h-[calc(100vh-110px)] grid grid-cols-12 gap-6 overflow-hidden">
            {/* Left Column: Dialer Controls */}
            <div className="col-span-4 flex flex-col h-full min-h-0">
                <div className="bg-[#18181b] border border-[#262624] rounded-2xl flex-1 flex flex-col overflow-hidden shadow-xl min-h-0">
                    <div className="p-4 border-b border-[#262624] bg-[#262624]/20 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-horizon-accent/20 flex items-center justify-center">
                                <Phone className="text-horizon-accent" size={14} />
                            </div>
                            <div>
                                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest block">Browser Dialer</span>
                                <span className="text-xs font-bold text-white">Twilio Voice SDK v2</span>
                            </div>
                        </div>
                        {callStatus && (
                            <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${
                                callStatus === 'ready' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                callStatus === 'calling' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                callStatus === 'connected' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                callStatus === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                'bg-white/5 border-white/10 text-gray-400'
                            }`}>
                                {callStatus}
                            </span>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col justify-center p-6 overflow-y-auto crm-scroll">
                        {callError && (
                            <div className="mb-3 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-start gap-2">
                                <AlertCircle size={12} className="shrink-0 mt-0.5" />
                                <span>{callError}</span>
                            </div>
                        )}

                        {!isDeviceReady && !callError && (
                            <div className="mb-3 p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-xs flex items-start gap-2">
                                <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0 mt-0.5"></div>
                                <span>Initializing voice connection...</span>
                            </div>
                        )}

                        <div className="relative mb-6">
                            <input 
                                type="text" 
                                value={phoneNumber} 
                                onChange={(e) => setPhoneNumber(e.target.value)} 
                                className="w-full bg-transparent text-center text-3xl font-mono text-white focus:outline-none border-b border-transparent focus:border-horizon-accent/30 pb-3" 
                                placeholder="Enter Number" 
                            />
                            {phoneNumber && (
                                <button 
                                    onClick={handleBackspace} 
                                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-white transition-colors"
                                >
                                    <Delete size={18} />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-6 max-w-[300px] mx-auto w-full">
                            {['1','2','3','4','5','6','7','8','9','*','0','#'].map((digit) => (
                                <button 
                                    key={digit} 
                                    onClick={() => handleDigitClick(digit)} 
                                    className="aspect-square rounded-full bg-[#262624] hover:bg-[#333] text-white text-2xl font-bold transition-all active:scale-95 flex items-center justify-center border border-[#333] hover:border-horizon-accent/30 shadow-lg"
                                >
                                    {digit}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-center gap-4 mb-4 items-center">
                            {/* 🔴 NEW: Recording Button (only shown when call is NOT active) */}
                            {!isCallActive && (
                                <button 
                                    onClick={toggleRecording}
                                    disabled={!isDeviceReady}
                                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                                        isRecording 
                                            ? 'bg-red-600 hover:bg-red-500 border-2 border-red-400' 
                                            : 'bg-[#262624] hover:bg-[#333] border-2 border-[#333]'
                                    }`}
                                    title={isRecording ? 'Recording Enabled' : 'Click to Enable Recording'}
                                >
                                    <Circle size={20} fill={isRecording ? 'currentColor' : 'none'} className={isRecording ? 'text-white' : 'text-gray-400'} />
                                </button>
                            )}

                            {/* Mute Button */}
                            {isCallActive && (
                                <button 
                                    onClick={toggleMute}
                                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg ${
                                        isMuted 
                                            ? 'bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500' 
                                            : 'bg-[#262624] hover:bg-[#333] border-2 border-[#333]'
                                    }`}
                                >
                                    {isMuted ? <MicOff size={20} className="text-red-400" /> : <Mic size={20} className="text-white" />}
                                </button>
                            )}

                            {/* Call Button */}
                            <button 
                                onClick={handleCallToggle} 
                                disabled={!phoneNumber || !isDeviceReady}
                                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isCallActive 
                                        ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                                        : 'bg-green-500 hover:bg-green-600 shadow-green-500/20'
                                }`}
                            >
                                {isCallActive ? <PhoneOff size={30} className="text-white" /> : <Phone size={30} className="text-white" />}
                            </button>
                        </div>

                        {isCallActive && (
                            <div className="text-center">
                                {/* 🔴 NEW: Recording indicator during call */}
                                {isRecording && (
                                    <div className="mb-3 flex items-center justify-center gap-2 text-red-400 animate-pulse">
                                        <Circle size={12} fill="currentColor" />
                                        <span className="text-xs font-bold uppercase">Recording</span>
                                    </div>
                                )}
                                <div className="text-horizon-accent font-mono text-2xl font-bold animate-pulse">
                                    {formatTime(callTime)}
                                </div>
                                <div className="text-gray-500 text-xs mt-1 uppercase tracking-widest font-bold">
                                    Connected to {selectedLead?.name || phoneNumber}
                                </div>
                                <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
                                    <Volume2 size={14} className="text-green-400" />
                                    <span>Audio active</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Center Column: Script */}
            <div className="col-span-4 h-full flex flex-col min-h-0">
                <div className="bg-[#18181b] border border-[#262624] rounded-2xl flex-1 flex flex-col overflow-hidden shadow-lg min-h-0">
                    <div className="p-4 border-b border-[#262624] flex justify-between items-center bg-[#262624]/20 shrink-0">
                        <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                            <FileText size={16} className="text-horizon-accent" /> Pitch Blueprint
                        </h3>
                        <button className="text-[10px] bg-horizon-accent/10 text-horizon-accent px-2.5 py-1 rounded-lg font-bold border border-horizon-accent/20 hover:bg-horizon-accent hover:text-black transition-all flex items-center gap-1">
                            <Save size={12} /> Update
                        </button>
                    </div>
                    <textarea 
                        value={script} 
                        onChange={(e) => setScript(e.target.value)} 
                        className="flex-1 w-full bg-transparent p-5 text-gray-300 text-sm leading-relaxed focus:outline-none resize-none crm-scroll font-mono" 
                    />
                </div>
            </div>

            {/* Right Column: Lead Selection */}
            <div className="col-span-4 h-full flex flex-col min-h-0">
                <div className="bg-[#18181b] border border-[#262624] rounded-2xl flex-1 flex flex-col overflow-hidden shadow-lg min-h-0">
                    <div className="p-4 border-b border-[#262624] flex items-center justify-between bg-[#262624]/20 shrink-0">
                        {view === 'campaigns' ? (
                            <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                                <ClipboardList size={16} className="text-horizon-accent" /> Campaigns
                            </h3>
                        ) : view === 'leads' ? (
                            <div className="flex items-center gap-3 w-full">
                                <button onClick={() => setView('campaigns')} className="p-1 hover:bg-[#333] rounded text-gray-400">
                                    <ArrowLeft size={16} />
                                </button>
                                <h3 className="font-bold text-white truncate text-sm">{selectedCampaign?.name}</h3>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 w-full">
                                <button onClick={() => setView('leads')} className="p-1 hover:bg-[#333] rounded text-gray-400">
                                    <ArrowLeft size={16} />
                                </button>
                                <h3 className="font-bold text-white uppercase text-[10px] tracking-widest">Lead Intelligence</h3>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto crm-scroll min-h-0">
                        {view === 'campaigns' && (
                            <div className="p-4 space-y-3">
                                {campaigns.map(c => (
                                    <button 
                                        key={c.id} 
                                        onClick={() => { 
                                            setSelectedCampaign(c); 
                                            setView('leads'); 
                                        }} 
                                        className="w-full text-left p-3 bg-[#09090b] border border-[#262624] rounded-xl hover:border-horizon-accent/50 transition-all flex items-center justify-between group"
                                    >
                                        <div>
                                            <div className="font-bold text-white text-sm">{c.name}</div>
                                            <div className="text-xs text-gray-500">{c.leadCount} Leads</div>
                                        </div>
                                        <ChevronRight size={14} className="text-gray-500 group-hover:text-horizon-accent transition-colors" />
                                    </button>
                                ))}
                                {campaigns.length === 0 && (
                                    <div className="text-center py-10 text-gray-500 text-sm">
                                        No campaigns available
                                    </div>
                                )}
                            </div>
                        )}

                        {view === 'leads' && (
                            <div className="divide-y divide-[#262624]">
                                {filteredLeads.map(l => (
                                    <button 
                                        key={l.id} 
                                        onClick={() => selectLead(l)} 
                                        className="w-full text-left p-3 hover:bg-[#262624]/30 transition-colors flex items-center justify-between"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="font-bold text-white truncate text-sm">{l.name}</div>
                                            <div className="text-xs text-gray-500 truncate">{l.company}</div>
                                        </div>
                                        <span className={`text-[9px] px-2 py-0.5 rounded border uppercase font-bold ml-2 shrink-0 ${getStatusStyles(l.status)}`}>
                                            {l.status}
                                        </span>
                                    </button>
                                ))}
                                {filteredLeads.length === 0 && (
                                    <div className="text-center py-10 text-gray-500 text-sm">
                                        No leads in this campaign
                                    </div>
                                )}
                            </div>
                        )}

                        {view === 'lead-detail' && selectedLead && (
                            <div className="p-5">
                                <div className="text-center mb-6">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-horizon-accent to-emerald-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                                        {selectedLead.name[0]}
                                    </div>
                                    <h2 className="text-xl font-bold text-white">{selectedLead.name}</h2>
                                    <p className="text-horizon-accent text-xs font-bold uppercase tracking-widest">{selectedLead.company}</p>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 p-3 bg-[#09090b] rounded-xl border border-[#262624]">
                                        <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400">
                                            <Phone size={14} />
                                        </div>
                                        <div>
                                            <div className="text-[9px] text-gray-500 uppercase font-bold">Direct Line</div>
                                            <div className="text-sm font-mono text-gray-200">{selectedLead.phone}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-[#09090b] rounded-xl border border-[#262624]">
                                        <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400">
                                            <Mail size={14} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-[9px] text-gray-500 uppercase font-bold">Email Address</div>
                                            <div className="text-sm text-gray-200 truncate">{selectedLead.email || 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Call Outcome</label>
                                        <select 
                                            value={selectedOutcome} 
                                            onChange={(e) => { setSelectedOutcome(e.target.value); setShowOutcomeError(false); }} 
                                            className={`w-full bg-[#09090b] border rounded-xl px-3 py-2.5 text-sm text-white focus:border-horizon-accent focus:outline-none ${showOutcomeError ? 'border-red-500/50' : 'border-[#262624]'}`}
                                        >
                                            <option>Select Disposition...</option>
                                            <option>Demo Booked</option>
                                            <option>Not Interested</option>
                                            <option>Wrong Number</option>
                                            <option>Voicemail</option>
                                            <option>Follow-up Required</option>
                                        </select>
                                    </div>
                                    <button 
                                        onClick={handleNextLead} 
                                        className="w-full bg-horizon-accent text-black font-bold py-3 rounded-xl shadow-lg hover:bg-white transition-colors text-sm"
                                    >
                                        Submit & Next Lead
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dialer;