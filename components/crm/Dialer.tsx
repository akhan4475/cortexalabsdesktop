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
    allLeads: Lead[];
    onUpdateLeadStatus: (leadId: string, newStatus: string) => void;
    onRecordDial: (leadId: string) => void; // <--- ADD THIS LINE
    initialLeadId?: string;
    initialCampaignId?: string;
}

const SUPABASE_URL = 'https://zfjbpohfdoeougmhocfa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmamJwb2hmZG9lb3VnbWhvY2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NjA5NDgsImV4cCI6MjA4MzIzNjk0OH0.P7XkB7FNmxR9XHqTukkC0P6QNh6H_bsP2CsegKLt4gE';

const Dialer: React.FC<DialerProps> = ({ campaigns, allLeads, onUpdateLeadStatus, initialLeadId, onRecordDial, initialCampaignId }) => {
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
                // Perform the update directly in Supabase for both summary and status
                const { error } = await supabase
                    .from('leads')
                    .update({ 
                        summary: callNote.trim(),
                        status: selectedOutcome 
                    })
                    .eq('id', selectedLead.id);

                if (error) throw error;
                
                // Notify parent state to update so lists reflect the change
                onUpdateLeadStatus(selectedLead.id, selectedOutcome);
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

                        {/* Phone Number Selector */}
                        {availablePhoneNumbers.length > 0 && (
                            <div className="mb-4">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                                    Outbound Line
                                </label>
                                <select
                                    value={selectedPhoneNumberId}
                                    onChange={(e) => handlePhoneNumberChange(e.target.value)}
                                    disabled={isCallActive}
                                    className="w-full bg-[#18181b] border border-[#262624] rounded-xl px-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {availablePhoneNumbers.map((phone) => (
                                        <option key={phone.id} value={phone.id}>
                                            {phone.phone_number}
                                            {phone.friendly_name ? ` - ${phone.friendly_name}` : ''}
                                            {phone.is_default ? ' ★' : ''}
                                        </option>
                                    ))}
                                </select>
                                {selectedPhoneNumber && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        📞 Calling from: <span className="text-horizon-accent font-mono">{selectedPhoneNumber}</span>
                                    </p>
                                )}
                            </div>
                        )}

                        {/* No Phone Numbers Warning */}
                        {availablePhoneNumbers.length === 0 && (
                            <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                <p className="text-xs text-yellow-200">
                                    ⚠️ No phone numbers configured. Go to <strong>Automations</strong> to add Twilio numbers.
                                </p>
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
                        <button 
                            onClick={handleUpdateScript}
                            className="text-[10px] bg-horizon-accent/10 text-horizon-accent px-2.5 py-1 rounded-lg font-bold border border-horizon-accent/20 hover:bg-horizon-accent hover:text-black transition-all flex items-center gap-1"
                        >
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
                            </div>
                        )}

                        {view === 'leads' && (
                            <div className="divide-y divide-[#262624]">
                                {filteredLeads.map(l => (
                                    <button 
                                        key={l.id} 
                                        onClick={() => selectLead(l)}
                                        className="w-full text-left p-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between group"
                                    >
                                        <div className="min-w-0">
                                            <div className="font-bold text-white text-sm truncate">{l.name}</div>
                                            <div className="text-xs text-gray-500 truncate">{l.company}</div>
                                        </div>
                                        <div className={`text-[9px] px-2 py-0.5 rounded-full border shrink-0 ${getStatusStyles(l.status)}`}>
                                            {l.status}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {view === 'lead-detail' && selectedLead && (
                            <div className="p-6 space-y-6">
                                {/* Lead Info Section */}
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Decision Maker</label>
                                            <button 
                                                onClick={() => isEditingName ? handleSaveLeadName() : setIsEditingName(true)}
                                                className="text-horizon-accent hover:text-white transition-colors"
                                            >
                                                {isEditingName ? <Check size={14} /> : <Edit2 size={12} />}
                                            </button>
                                        </div>
                                        {isEditingName ? (
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text"
                                                    value={editableLeadName}
                                                    onChange={(e) => setEditableLeadName(e.target.value)}
                                                    className="flex-1 bg-[#09090b] border border-horizon-accent/50 rounded-lg px-2 py-1 text-sm text-white focus:outline-none"
                                                    autoFocus
                                                />
                                                <button onClick={() => { setIsEditingName(false); setEditableLeadName(selectedLead.name); }} className="text-gray-500"><X size={14} /></button>
                                            </div>
                                        ) : (
                                            <div className="text-lg font-bold text-white">{selectedLead.name}</div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Company</label>
                                            <div className="text-sm text-gray-300 flex items-center gap-2">
                                                <Briefcase size={14} className="text-gray-600" /> {selectedLead.company}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Status</label>
                                            <div className={`inline-block text-[10px] px-2 py-0.5 rounded border ${getStatusStyles(selectedLead.status)}`}>
                                                {selectedLead.status}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                                            <button 
                                                onClick={() => isEditingEmail ? handleSaveLeadEmail() : setIsEditingEmail(true)}
                                                className="text-horizon-accent hover:text-white transition-colors"
                                            >
                                                {isEditingEmail ? <Check size={14} /> : <Edit2 size={12} />}
                                            </button>
                                        </div>
                                        {isEditingEmail ? (
                                            <div className="flex gap-2">
                                                <input 
                                                    type="email"
                                                    value={editableLeadEmail}
                                                    onChange={(e) => setEditableLeadEmail(e.target.value)}
                                                    className="flex-1 bg-[#09090b] border border-horizon-accent/50 rounded-lg px-2 py-1 text-sm text-white focus:outline-none"
                                                    autoFocus
                                                />
                                                <button onClick={() => { setIsEditingEmail(false); setEditableLeadEmail(selectedLead.email || ''); }} className="text-gray-500"><X size={14} /></button>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-gray-300 flex items-center gap-2">
                                                <Mail size={14} className="text-gray-600" /> {selectedLead.email || 'No email provided'}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="h-px bg-[#262624]" />

                                {/* Action Section */}
                                <div className="space-y-4">
                                    <button 
                                        onClick={handleOpenCalendar}
                                        data-cal-link="horizon-ai/30min"
                                        data-cal-namespace="30min"
                                        data-cal-config='{"layout":"month_view"}'
                                        className="w-full bg-[#262624] hover:bg-[#333] border border-[#333] text-white py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all"
                                    >
                                        <Calendar size={16} className="text-horizon-accent" /> Book Demo on Cal.com
                                    </button>

                                    <div>
                                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Call Disposition</label>
                                        <select 
                                            value={selectedOutcome}
                                            onChange={(e) => {
                                                setSelectedOutcome(e.target.value);
                                                setShowOutcomeError(false);
                                            }}
                                            className={`w-full bg-[#09090b] border ${showOutcomeError ? 'border-red-500/50' : 'border-[#262624]'} rounded-xl px-3 py-2.5 text-sm text-white focus:border-horizon-accent focus:outline-none appearance-none cursor-pointer`}
                                        >
                                            <option>Select Disposition...</option>
                                            <option>New Lead</option>
                                            <option>Demo Booked</option>
                                            <option>Follow-up Required</option>
                                            <option>Voicemail</option>
                                            <option>Not Interested</option>
                                            <option>Wrong Number</option>
                                        </select>
                                    </div>

                                    {/* NEW: Call Note Field */}
                                    <div>
                                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Add a Note</label>
                                        <textarea 
                                            value={callNote}
                                            onChange={(e) => setCallNote(e.target.value)}
                                            placeholder="Enter call notes, pain points, or follow-up details..."
                                            className="w-full bg-[#09090b] border border-[#262624] rounded-xl px-3 py-2.5 text-sm text-white focus:border-horizon-accent focus:outline-none h-24 resize-none"
                                        />
                                    </div>

                                    <button 
                                        onClick={handleNextLead} 
                                        className="w-full bg-horizon-accent text-black font-bold py-3 rounded-xl shadow-lg hover:bg-white transition-colors text-sm"
                                    >
                                        Submit & Next Lead
                                    </button>

                                    {/* Address Display */}
                                    {selectedLead.address && (
                                        <div className="pt-3 border-t border-[#262624]">
                                            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Address</label>
                                            <div className="text-sm text-gray-300 flex items-start gap-2">
                                                <MapPin size={14} className="text-gray-600 mt-0.5 flex-shrink-0" /> 
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