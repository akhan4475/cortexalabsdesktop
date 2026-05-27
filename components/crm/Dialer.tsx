import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Save, ArrowLeft, ChevronRight, MapPin, MessageSquare, ClipboardList, CheckCircle2, AlertCircle, FileText, Delete, Mail, Mic, MicOff, Volume2, VolumeX, Circle, Calendar, Edit2, Check, Briefcase, X } from 'lucide-react';
import { Lead, Campaign } from './types';
import { supabase } from '../../lib/supabase';



// Twilio Device types
declare global {
    interface Window {
        Twilio: any;
        Cal: any;
    }
}

interface TwilioPhoneNumber {
    id: string;
    phone_number: string;
    friendly_name: string | null;
    is_default: boolean;
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
    onUpdateLead: (lead: Lead) => void;
    allLeads: Lead[];
    onUpdateLeadStatus: (leadId: string, newStatus: string) => void;
    onRecordDial: (leadId: string) => void; // <--- ADD THIS LINE
    initialLeadId?: string;
    initialCampaignId?: string;
}

const SUPABASE_URL = 'https://zfjbpohfdoeougmhocfa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmamJwb2hmZG9lb3VnbWhvY2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NjA5NDgsImV4cCI6MjA4MzIzNjk0OH0.P7XkB7FNmxR9XHqTukkC0P6QNh6H_bsP2CsegKLt4gE';

const Dialer: React.FC<DialerProps> = ({ campaigns, allLeads, onUpdateLeadStatus, onUpdateLead, initialLeadId, onRecordDial, initialCampaignId }) => {
        // --- Dialer State ---
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isCallActive, setIsCallActive] = useState(false);
    const [callTime, setCallTime] = useState(0);
    const [availablePhoneNumbers, setAvailablePhoneNumbers] = useState<TwilioPhoneNumber[]>([]);
    const [selectedPhoneNumberId, setSelectedPhoneNumberId] = useState<string>('');
    const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string>('');
    const [currentCall, setCurrentCall] = useState<any>(null);
    const [callStatus, setCallStatus] = useState<string>('');
    const [callError, setCallError] = useState<string>('');
    const [isMuted, setIsMuted] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isDeviceReady, setIsDeviceReady] = useState(false);
    
    const deviceRef = useRef<any>(null);
    const calScriptLoadedRef = useRef(false);
    const dialRecordedRef = useRef(false); // ADD THIS LINE
    
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

    // NEW: Editable lead fields
    const [editableLeadName, setEditableLeadName] = useState('');
    const [editableLeadEmail, setEditableLeadEmail] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);

    // --- SCRIPT PERSISTENCE LOGIC ---
    useEffect(() => {
        const fetchScript = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('user_scripts')
                .select('script_content')
                .eq('user_id', user.id)
                .single();

            if (data && !error) {
                setScript(data.script_content);
            }
        };
        fetchScript();
    }, []);
    
    const handleUpdateScript = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('user_scripts')
                .upsert({ 
                    user_id: user.id, 
                    script_content: script,
                    updated_at: new Date().toISOString() 
                }, { onConflict: 'user_id' });

            if (error) throw error;
            alert('Script saved successfully!');
        } catch (error) {
            console.error('Error saving script:', error);
            alert('Failed to save script.');
        }
    };

    // Load Cal.com embed script
    useEffect(() => {
        if (!calScriptLoadedRef.current) {
            const script = document.createElement('script');
            script.type = "text/javascript";
            script.innerHTML = `
                (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
                Cal("init", "30min", {origin:"https://app.cal.com"});
                Cal.ns["30min"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
            `;
            document.body.appendChild(script);
            calScriptLoadedRef.current = true;
        }
    }, []);

    // Load available phone numbers
    useEffect(() => {
        const loadPhoneNumbers = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, error } = await supabase
                    .from('twilio_phone_numbers')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('is_default', { ascending: false })
                    .order('created_at', { ascending: true });

                if (error) {
                    console.error('Error loading phone numbers:', error);
                    return;
                }

                if (data && data.length > 0) {
                    setAvailablePhoneNumbers(data);
                    // Set default phone number as selected
                    const defaultPhone = data.find(p => p.is_default) || data[0];
                    setSelectedPhoneNumberId(defaultPhone.id);
                    setSelectedPhoneNumber(defaultPhone.phone_number);
                }
            } catch (err) {
                console.error('Error loading phone numbers:', err);
            }
        };

        loadPhoneNumbers();
    }, []);


    const handlePhoneNumberChange = (phoneId: string) => {
    const phone = availablePhoneNumbers.find(p => p.id === phoneId);
    if (phone) {
        setSelectedPhoneNumberId(phoneId);
        setSelectedPhoneNumber(phone.phone_number);
    }
};

    // Initialize Twilio Device
    useEffect(() => {
        const initializeDevice = async () => {
            try {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/@twilio/voice-sdk@2.11.2/dist/twilio.min.js';
                script.async = true;
                document.body.appendChild(script);

                script.onload = async () => {
                    console.log('📞 Twilio Voice SDK v2 loaded');

                    const { data: { user } } = await supabase.auth.getUser();

                    if (!user) {
                        setCallError('User not authenticated');
                        return;
                    }

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

                    console.log('🔐 Token Response:', data);

                    if (data.error) {
                        setCallError(`Token Error: ${data.error}`);
                        console.error('❌ Token generation failed:', data.error);
                        return;
                    }
                    
                    if (data.token) {
                        const { Device } = window.Twilio;
                        const device = new Device(data.token, {
                            codecPreferences: ['opus', 'pcmu'],
                            edge: 'ashburn'
                        });

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
                        });

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
            currentCall.disconnect();
            setIsCallActive(false);
            setCurrentCall(null);
            setCallStatus('disconnected');
            setIsRecording(false);
            
        } else {
            setCallError('');
            setCallStatus('calling');
            
            try {
                const { data: { user } } = await supabase.auth.getUser();

                const call = await deviceRef.current.connect({
                    params: {
                        To: phoneNumber,
                        callerId: selectedPhoneNumber,  // ← ADD THIS LINE
                        Record: isRecording ? 'true' : 'false',
                        UserId: user?.id || '',
                        LeadId: selectedLead?.id || '',
                        CampaignId: selectedCampaign?.id || '',
                        LeadName: selectedLead?.name || 'Unknown'
                    }
                });

               
                // This ensures the dial is counted even if they don't pick up or hang up
                // --- Record the dial when call connects (counts ALL dials) ---
                // --- Record the dial when call connects (counts ALL dials) ---
                console.log('🔍 Dial recording check - dialRecordedRef.current:', dialRecordedRef.current);
                if (!dialRecordedRef.current) {
                    const leadIdToRecord = selectedLead?.id || null;
                    console.log('🔥 RECORDING DIAL FOR:', leadIdToRecord || 'manual dial');
                    onRecordDial(leadIdToRecord);
                    dialRecordedRef.current = true;
                    console.log('✅ Dial recorded, flag set to true');
                } else {
                    console.log('⏭️ SKIPPING - Dial already recorded for this call');
                }

                call.on('accept', () => {
                    console.log('📞 Call accepted');
                    setIsCallActive(true);
                    setCallStatus('connected');
                    setCallTime(0);
                    // Don't reset the flag here - dial already recorded
                });

                call.on('disconnect', () => {
                    console.log('🔴 Call disconnected');
                    setIsCallActive(false);
                    setCallStatus('disconnected');
                    setCurrentCall(null);
                    setCallTime(0);
                    setIsRecording(false);
                    dialRecordedRef.current = false; // ADD THIS LINE
                });

                call.on('reject', () => {
                    console.log('❌ Call rejected');
                    setIsCallActive(false);
                    setCallStatus('rejected');
                    setCurrentCall(null);
                    setCallError('Call was rejected');
                    setIsRecording(false);
                    dialRecordedRef.current = false; // ADD THIS LINE
                });

                call.on('cancel', () => {
                    console.log('🚫 Call cancelled');
                    setIsCallActive(false);
                    setCallStatus('cancelled');
                    setCurrentCall(null);
                    setIsRecording(false);
                    dialRecordedRef.current = false; 
                });

                call.on('error', (error: any) => {
                    console.error('❌ Call error:', error);
                    setCallError(error.message);
                    setIsCallActive(false);
                    setCallStatus('error');
                    setCurrentCall(null);
                    setIsRecording(false);
                    dialRecordedRef.current = false;
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
        setCallNote(lead.summary || ''); // Load existing summary into notes
        setShowOutcomeError(false);
        setCallError('');
        // NEW: Set editable fields
        setEditableLeadName(lead.name);
        setEditableLeadEmail(lead.email || '');
        setIsEditingName(false);
        setIsEditingEmail(false);
    };

    const handleBackspace = () => setPhoneNumber(prev => prev.slice(0, -1));

    // NEW: Save lead name
    const handleSaveLeadName = async () => {
        if (!selectedLead || !editableLeadName.trim()) return;
        
        try {
            const { error } = await supabase
                .from('leads')
                .update({ name: editableLeadName.trim() })
                .eq('id', selectedLead.id);

            if (error) throw error;

            // Update local state
            setSelectedLead({ ...selectedLead, name: editableLeadName.trim() });
            setIsEditingName(false);
        } catch (error) {
            console.error('Error updating lead name:', error);
            alert('Failed to update name. Please try again.');
        }
    };

    // NEW: Save lead email
    const handleSaveLeadEmail = async () => {
        if (!selectedLead) return;
        
        try {
            const { error } = await supabase
                .from('leads')
                .update({ email: editableLeadEmail.trim() })
                .eq('id', selectedLead.id);

            if (error) throw error;

            // Update local state
            setSelectedLead({ ...selectedLead, email: editableLeadEmail.trim() });
            setIsEditingEmail(false);
        } catch (error) {
            console.error('Error updating lead email:', error);
            alert('Failed to update email. Please try again.');
        }
    };

    // Updated handleOpenCalendar to ensure disposition logic still runs
    const handleOpenCalendar = () => {
        setSelectedOutcome('Demo Booked');
        setShowOutcomeError(false);
    };

    const handleNextLead = async () => {
        if (!selectedOutcome || selectedOutcome === 'Select Disposition...') {
            setShowOutcomeError(true);
            return;
        }
        setShowOutcomeError(false);

        if (selectedLead) {
            try {
                await supabase
                    .from('leads')
                    .update({
                        summary: callNote.trim(),
                        status: selectedOutcome
                    })
                    .eq('id', selectedLead.id);

                // Update both status AND summary in parent state immediately
                onUpdateLeadStatus(selectedLead.id, selectedOutcome);
                onUpdateLead({ ...selectedLead, status: selectedOutcome, summary: callNote.trim() });

                // Update the local selectedLead so if we stay on same lead it reflects change
                setSelectedLead(prev => prev ? { ...prev, status: selectedOutcome, summary: callNote.trim() } : prev);

            } catch (error) {
                console.error('Error updating lead data:', error);
            }
        }

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
        <div className="h-full min-h-0 max-h-[calc(100vh-112px)] grid grid-cols-12 gap-4 overflow-hidden">

            {/* ── Left Column: Dialer Controls ── */}
            <div className="col-span-4 flex flex-col h-full min-h-0">
                <div className="bg-[#0c0c0e] border border-white/8 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-xl min-h-0">

                    {/* Header */}
                    <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-[#CD3D35]/15 flex items-center justify-center">
                                <Phone className="text-[#CD3D35]" size={13} />
                            </div>
                            <div>
                                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest block">Browser Dialer</span>
                                <span className="text-xs font-bold text-white">Twilio Voice SDK v2</span>
                            </div>
                        </div>
                        {callStatus && (
                            <span className={`text-[9px] px-2 py-0.5 rounded border font-mono ${
                                callStatus === 'ready'     ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                callStatus === 'calling'   ? 'bg-blue-500/10  border-blue-500/20  text-blue-400'  :
                                callStatus === 'connected' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                callStatus === 'error'     ? 'bg-red-500/10   border-red-500/20   text-red-400'   :
                                'bg-white/5 border-white/10 text-gray-400'
                            }`}>
                                {callStatus}
                            </span>
                        )}
                    </div>

                    {/* Content — no overflow, everything must fit */}
                    <div className="flex-1 flex flex-col justify-between py-3 px-4 overflow-hidden">
                        <div>
                            {callError && (
                                <div className="mb-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-[10px] flex items-start gap-1.5">
                                    <AlertCircle size={11} className="shrink-0 mt-0.5" />
                                    <span>{callError}</span>
                                </div>
                            )}
                            {!isDeviceReady && !callError && (
                                <div className="mb-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-[10px] flex items-start gap-1.5">
                                    <div className="w-2.5 h-2.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0 mt-0.5" />
                                    <span>Initializing voice connection…</span>
                                </div>
                            )}

                            {/* Outbound Line */}
                            {availablePhoneNumbers.length > 0 && (
                                <div className="mb-3">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Outbound Line</label>
                                    <select
                                        value={selectedPhoneNumberId}
                                        onChange={(e) => handlePhoneNumberChange(e.target.value)}
                                        disabled={isCallActive}
                                        className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-3 py-2 text-xs text-white focus:border-[#CD3D35]/50 focus:outline-none appearance-none cursor-pointer disabled:opacity-50"
                                    >
                                        {availablePhoneNumbers.map((phone) => (
                                            <option key={phone.id} value={phone.id} className="bg-[#0c0c0e]">
                                                {phone.phone_number}{phone.friendly_name ? ` · ${phone.friendly_name}` : ''}{phone.is_default ? ' ★' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {availablePhoneNumbers.length === 0 && (
                                <div className="mb-3 p-2.5 bg-yellow-500/8 border border-yellow-500/20 rounded-xl">
                                    <p className="text-[10px] text-yellow-300">⚠️ No numbers configured. Go to <strong>Credentials</strong>.</p>
                                </div>
                            )}

                            {/* Number Input */}
                            <div className="relative mb-3">
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full bg-transparent text-center text-2xl font-mono text-white focus:outline-none border-b border-white/10 focus:border-[#CD3D35]/40 pb-2 transition-colors"
                                    placeholder="Enter Number"
                                />
                                {phoneNumber && (
                                    <button onClick={handleBackspace} className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-white transition-colors">
                                        <Delete size={15} />
                                    </button>
                                )}
                            </div>

                            {/* Keypad */}
                            <div className="grid grid-cols-3 gap-4 mt-2 mb-2 w-full">
                                {['1','2','3','4','5','6','7','8','9','*','0','#'].map((digit) => (
                                    <button
                                        key={digit}
                                        onClick={() => handleDigitClick(digit)}
                                        className="h-14 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-all active:scale-95 flex items-center justify-center border border-white/8 hover:border-[#CD3D35]/30"
                                    >
                                        {digit}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Call Controls + Timer */}
                        <div>
                            <div className="flex justify-center gap-4 items-center mb-2">
                                {!isCallActive && (
                                    <button
                                        onClick={toggleRecording}
                                        disabled={!isDeviceReady}
                                        title={isRecording ? 'Recording Enabled' : 'Enable Recording'}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                                            isRecording
                                                ? 'bg-red-600 hover:bg-red-500 border-2 border-red-400'
                                                : 'bg-white/5 hover:bg-white/10 border-2 border-white/10'
                                        }`}
                                    >
                                        <Circle size={15} fill={isRecording ? 'currentColor' : 'none'} className={isRecording ? 'text-white' : 'text-gray-400'} />
                                    </button>
                                )}
                                {isCallActive && (
                                    <button
                                        onClick={toggleMute}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                                            isMuted
                                                ? 'bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500'
                                                : 'bg-white/5 hover:bg-white/10 border-2 border-white/10'
                                        }`}
                                    >
                                        {isMuted ? <MicOff size={16} className="text-red-400" /> : <Mic size={16} className="text-white" />}
                                    </button>
                                )}
                                <button
                                    onClick={handleCallToggle}
                                    disabled={!phoneNumber || !isDeviceReady}
                                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed ${
                                        isCallActive
                                            ? 'bg-red-500 hover:bg-red-600 shadow-red-500/25'
                                            : 'bg-green-500 hover:bg-green-600 shadow-green-500/25'
                                    }`}
                                >
                                    {isCallActive ? <PhoneOff size={22} className="text-white" /> : <Phone size={22} className="text-white" />}
                                </button>
                            </div>

                            {isCallActive && (
                                <div className="text-center">
                                    {isRecording && (
                                        <div className="mb-1 flex items-center justify-center gap-1.5 text-red-400 animate-pulse">
                                            <Circle size={9} fill="currentColor" />
                                            <span className="text-[9px] font-bold uppercase tracking-widest">Recording</span>
                                        </div>
                                    )}
                                    <div className="text-[#CD3D35] font-mono text-xl font-bold">{formatTime(callTime)}</div>
                                    <div className="text-gray-500 text-[9px] mt-0.5 uppercase tracking-widest font-bold">
                                        Connected · {selectedLead?.name || phoneNumber}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Center Column: Script ── */}
            <div className="col-span-4 h-full flex flex-col min-h-0">
                <div className="bg-[#0c0c0e] border border-white/8 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-lg min-h-0">
                    <div className="px-4 py-3 border-b border-white/8 flex justify-between items-center shrink-0">
                        <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                            <FileText size={14} className="text-[#CD3D35]" /> Pitch Blueprint
                        </h3>
                        <button
                            onClick={handleUpdateScript}
                            className="text-[10px] bg-[#CD3D35]/10 text-[#CD3D35] px-2.5 py-1 rounded-lg font-bold border border-[#CD3D35]/20 hover:bg-[#CD3D35] hover:text-white transition-all flex items-center gap-1"
                        >
                            <Save size={11} /> Save
                        </button>
                    </div>
                    <textarea
                        value={script}
                        onChange={(e) => setScript(e.target.value)}
                        className="flex-1 w-full bg-transparent p-4 text-gray-300 text-sm leading-relaxed focus:outline-none resize-none crm-scroll font-mono"
                    />
                </div>
            </div>

            {/* ── Right Column: Lead Selection ── */}
            <div className="col-span-4 h-full flex flex-col min-h-0">
                <div className="bg-[#0c0c0e] border border-white/8 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-lg min-h-0">
                    <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between shrink-0">
                        {view === 'campaigns' ? (
                            <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                                <ClipboardList size={14} className="text-[#CD3D35]" /> Campaigns
                            </h3>
                        ) : view === 'leads' ? (
                            <div className="flex items-center gap-2 w-full">
                                <button onClick={() => setView('campaigns')} className="p-1 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <ArrowLeft size={15} />
                                </button>
                                <h3 className="font-bold text-white truncate text-sm">{selectedCampaign?.name}</h3>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 w-full">
                                <button onClick={() => setView('leads')} className="p-1 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <ArrowLeft size={15} />
                                </button>
                                <h3 className="font-bold text-white uppercase text-[10px] tracking-widest">Lead Intelligence</h3>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto crm-scroll min-h-0">

                        {/* Campaigns view */}
                        {view === 'campaigns' && (
                            <div className="p-3 space-y-2">
                                {campaigns.length === 0 && (
                                    <p className="text-center text-gray-600 text-sm py-10">No campaigns yet</p>
                                )}
                                {campaigns.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => { setSelectedCampaign(c); setView('leads'); }}
                                        className="w-full text-left p-3 bg-white/[0.02] border border-white/8 rounded-xl hover:border-[#CD3D35]/40 hover:bg-white/[0.04] transition-all flex items-center justify-between group"
                                    >
                                        <div>
                                            <div className="font-bold text-white text-sm">{c.name}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">{c.leadCount} Leads</div>
                                        </div>
                                        <ChevronRight size={14} className="text-gray-600 group-hover:text-[#CD3D35] transition-colors" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Leads view */}
                        {view === 'leads' && (
                            <div className="divide-y divide-white/[0.04]">
                                {filteredLeads.map(l => (
                                    <button
                                        key={l.id}
                                        onClick={() => selectLead(l)}
                                        className="w-full text-left px-4 py-3 hover:bg-white/[0.025] transition-colors flex items-center justify-between"
                                    >
                                        <div className="min-w-0">
                                            <div className="font-semibold text-white text-sm truncate">{l.name}</div>
                                            <div className="text-xs text-gray-500 truncate mt-0.5">{l.company}</div>
                                        </div>
                                        <div className={`text-[9px] px-2 py-0.5 rounded-full border shrink-0 ml-2 ${getStatusStyles(l.status)}`}>
                                            {l.status}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Lead detail view */}
                        {view === 'lead-detail' && selectedLead && (
                            <div className="p-4 space-y-4">
                                {/* Lead Info */}
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Decision Maker</label>
                                            <button onClick={() => isEditingName ? handleSaveLeadName() : setIsEditingName(true)} className="text-[#CD3D35] hover:text-white transition-colors">
                                                {isEditingName ? <Check size={13} /> : <Edit2 size={11} />}
                                            </button>
                                        </div>
                                        {isEditingName ? (
                                            <div className="flex gap-2">
                                                <input type="text" value={editableLeadName} onChange={(e) => setEditableLeadName(e.target.value)}
                                                    className="flex-1 bg-white/[0.03] border border-[#CD3D35]/40 rounded-lg px-2 py-1 text-sm text-white focus:outline-none" autoFocus />
                                                <button onClick={() => { setIsEditingName(false); setEditableLeadName(selectedLead.name); }} className="text-gray-500 hover:text-white"><X size={13} /></button>
                                            </div>
                                        ) : (
                                            <div className="text-base font-bold text-white">{selectedLead.name}</div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Company</label>
                                            <div className="text-xs text-gray-300 flex items-center gap-1.5">
                                                <Briefcase size={11} className="text-gray-600 shrink-0" />
                                                <span className="truncate">{selectedLead.company}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Status</label>
                                            <div className={`inline-block text-[9px] px-2 py-0.5 rounded border ${getStatusStyles(selectedLead.status)}`}>
                                                {selectedLead.status}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Email</label>
                                            <button onClick={() => isEditingEmail ? handleSaveLeadEmail() : setIsEditingEmail(true)} className="text-[#CD3D35] hover:text-white transition-colors">
                                                {isEditingEmail ? <Check size={13} /> : <Edit2 size={11} />}
                                            </button>
                                        </div>
                                        {isEditingEmail ? (
                                            <div className="flex gap-2">
                                                <input type="email" value={editableLeadEmail} onChange={(e) => setEditableLeadEmail(e.target.value)}
                                                    className="flex-1 bg-white/[0.03] border border-[#CD3D35]/40 rounded-lg px-2 py-1 text-sm text-white focus:outline-none" autoFocus />
                                                <button onClick={() => { setIsEditingEmail(false); setEditableLeadEmail(selectedLead.email || ''); }} className="text-gray-500 hover:text-white"><X size={13} /></button>
                                            </div>
                                        ) : (
                                            <div className="text-xs text-gray-300 flex items-center gap-1.5">
                                                <Mail size={11} className="text-gray-600 shrink-0" />
                                                <span className="truncate">{selectedLead.email || 'No email provided'}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="h-px bg-white/6" />

                                {/* Actions */}
                                <div className="space-y-3">
                                    <button
                                        onClick={handleOpenCalendar}
                                        data-cal-link="horizon-ai/30min"
                                        data-cal-namespace="30min"
                                        data-cal-config='{"layout":"month_view"}'
                                        className="w-full bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-[#CD3D35]/30 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all"
                                    >
                                        <Calendar size={13} className="text-[#CD3D35]" /> Book Demo on Cal.com
                                    </button>

                                    <div>
                                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Call Disposition</label>
                                        <select
                                            value={selectedOutcome}
                                            onChange={(e) => { setSelectedOutcome(e.target.value); setShowOutcomeError(false); }}
                                            className={`w-full bg-white/[0.03] border ${showOutcomeError ? 'border-red-500/50' : 'border-white/8'} rounded-xl px-3 py-2 text-xs text-white focus:border-[#CD3D35]/50 focus:outline-none appearance-none cursor-pointer`}
                                        >
                                            <option className="bg-[#0c0c0e]">Select Disposition...</option>
                                            <option className="bg-[#0c0c0e]">New Lead</option>
                                            <option className="bg-[#0c0c0e]">Demo Booked</option>
                                            <option className="bg-[#0c0c0e]">Follow-up Required</option>
                                            <option className="bg-[#0c0c0e]">Voicemail</option>
                                            <option className="bg-[#0c0c0e]">Not Interested</option>
                                            <option className="bg-[#0c0c0e]">Wrong Number</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Call Notes</label>
                                        <textarea
                                            value={callNote}
                                            onChange={(e) => setCallNote(e.target.value)}
                                            placeholder="Enter call notes, pain points, or follow-up details..."
                                            className="w-full bg-white/[0.03] border border-white/8 rounded-xl px-3 py-2 text-xs text-white focus:border-[#CD3D35]/50 focus:outline-none h-20 resize-none placeholder-gray-600"
                                        />
                                    </div>

                                    <button
                                        onClick={handleNextLead}
                                        className="w-full bg-[#CD3D35] hover:bg-[#B83530] text-white font-bold py-2.5 rounded-xl shadow-lg shadow-[#CD3D35]/15 transition-all active:scale-[0.98] text-sm"
                                    >
                                        Submit & Next Lead
                                    </button>

                                    {selectedLead.address && (
                                        <div className="pt-2 border-t border-white/6">
                                            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Address</label>
                                            <div className="text-xs text-gray-400 flex items-start gap-1.5">
                                                <MapPin size={11} className="text-gray-600 mt-0.5 shrink-0" />
                                                <span>{selectedLead.address}</span>
                                            </div>
                                        </div>
                                    )}
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