import React, { useState, useEffect } from 'react';
import { Phone, Database, Globe, AlertCircle, Save, CheckCircle, Loader2, Plus, Trash2, Star, Eye, EyeOff, Sparkles, Headphones } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { clearKeyCache } from '../../lib/ai';

interface TwilioPhoneNumber {
    id: string;
    phone_number: string;
    friendly_name: string | null;
    is_default: boolean;
}

// ── Shared field component ────────────────────────────────────────────────────
const Field = ({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
    hint,
    hintLink,
    hintLinkLabel,
    mono = true,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    type?: string;
    hint?: string;
    hintLink?: string;
    hintLinkLabel?: string;
    mono?: boolean;
}) => {
    const [show, setShow] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</label>
            <div className="relative">
                <input
                    type={isPassword && !show ? 'password' : 'text'}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CD3D35]/50 focus:ring-1 focus:ring-[#CD3D35]/20 transition-all ${mono ? 'font-mono' : ''} ${isPassword ? 'pr-10' : ''}`}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                        {show ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                )}
            </div>
            {(hint || hintLink) && (
                <p className="text-[11px] text-gray-600">
                    {hint}{' '}
                    {hintLink && (
                        <a href={hintLink} target="_blank" rel="noopener noreferrer" className="text-[#CD3D35] hover:underline">
                            {hintLinkLabel ?? hintLink}
                        </a>
                    )}
                </p>
            )}
        </div>
    );
};

// ── Card wrapper ──────────────────────────────────────────────────────────────
const IntegrationCard = ({
    accentColor,
    icon: Icon,
    title,
    description,
    isConfigured,
    children,
}: {
    accentColor: string;
    icon: React.ElementType;
    title: string;
    description: string;
    isConfigured: boolean;
    children: React.ReactNode;
}) => (
    <div className="bg-[#0c0c0e] border border-white/8 rounded-2xl overflow-hidden">
        {/* Top accent bar */}
        <div className="h-[3px]" style={{ background: accentColor }} />
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${accentColor}18` }}>
                    <Icon size={16} style={{ color: accentColor }} />
                </div>
                <div>
                    <p className="text-sm font-bold text-white">{title}</p>
                    <p className="text-[11px] text-gray-500">{description}</p>
                </div>
            </div>
            <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                isConfigured
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-gray-500 bg-white/5 border-white/10'
            }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isConfigured ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                {isConfigured ? 'Connected' : 'Not configured'}
            </span>
        </div>
        {/* Body */}
        <div className="px-6 py-5">
            {children}
        </div>
    </div>
);

// ── Save button ───────────────────────────────────────────────────────────────
const SaveBtn = ({
    onClick,
    loading,
    success,
    disabled,
    label,
}: {
    onClick: () => void;
    loading: boolean;
    success: boolean;
    disabled?: boolean;
    label: string;
}) => (
    <button
        onClick={onClick}
        disabled={loading || disabled}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-[#CD3D35] hover:bg-[#B83530] text-white active:scale-[0.98]"
    >
        {loading ? (
            <><Loader2 size={15} className="animate-spin" />Saving…</>
        ) : success ? (
            <><CheckCircle size={15} />Saved!</>
        ) : (
            <><Save size={15} />{label}</>
        )}
    </button>
);


// ── Main component ────────────────────────────────────────────────────────────
const Credentials: React.FC = () => {

    // ── Twilio state ───────────────────────────────────────────────────────────
    const [twilioAccountSid,    setTwilioAccountSid]    = useState('');
    const [twilioAuthToken,     setTwilioAuthToken]     = useState('');
    const [twilioPhoneNumber,   setTwilioPhoneNumber]   = useState('');
    const [twilioApiKey,        setTwilioApiKey]        = useState('');
    const [twilioApiSecret,     setTwilioApiSecret]     = useState('');
    const [twilioTwimlAppSid,   setTwilioTwimlAppSid]   = useState('');
    const [forwardToNumber,     setForwardToNumber]     = useState('');
    const [twilioSaving,        setTwilioSaving]        = useState(false);
    const [twilioSuccess,       setTwilioSuccess]       = useState(false);
    const [hasExistingCredentials, setHasExistingCredentials] = useState(false);

    // ── Anthropic state ────────────────────────────────────────────────────────
    const [anthropicApiKey,  setAnthropicApiKey]  = useState('');
    const [anthropicSaving,  setAnthropicSaving]  = useState(false);
    const [anthropicSuccess, setAnthropicSuccess] = useState(false);

    // ── AssemblyAI state ───────────────────────────────────────────────────────
    const [assemblyaiApiKey,  setAssemblyaiApiKey]  = useState('');
    const [assemblyaiSaving,  setAssemblyaiSaving]  = useState(false);
    const [assemblyaiSuccess, setAssemblyaiSuccess] = useState(false);

    // ── Apify state ────────────────────────────────────────────────────────────
    const [apifyApiToken,  setApifyApiToken]  = useState('');
    const [apifySaving,    setApifySaving]    = useState(false);
    const [apifySuccess,   setApifySuccess]   = useState(false);

    // ── Phone numbers state ────────────────────────────────────────────────────
    const [phoneNumbers,        setPhoneNumbers]        = useState<TwilioPhoneNumber[]>([]);
    const [newPhoneNumber,      setNewPhoneNumber]      = useState('');
    const [newPhoneFriendlyName, setNewPhoneFriendlyName] = useState('');
    const [isAddingPhone,       setIsAddingPhone]       = useState(false);

    // ── Shared state ───────────────────────────────────────────────────────────
    const [isLoading, setIsLoading] = useState(true);
    const [error,     setError]     = useState('');

    useEffect(() => {
        loadCredentials();
        loadPhoneNumbers();
    }, []);

    // ── Load ───────────────────────────────────────────────────────────────────
    const loadCredentials = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('user_credentials')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error loading credentials:', error);
                return;
            }

            if (data) {
                setTwilioAccountSid(data.account_sid || '');
                setTwilioAuthToken(data.auth_token || '');
                setTwilioPhoneNumber(data.phone_number || '');
                setTwilioApiKey(data.api_key || '');
                setTwilioApiSecret(data.api_secret || '');
                setTwilioTwimlAppSid(data.twiml_app_sid || '');
                setForwardToNumber(data.forward_to_number || '');
                setApifyApiToken(data.apify_api_token || '');
                setAnthropicApiKey(data.anthropic_api_key || '');
                setAssemblyaiApiKey(data.assemblyai_api_key || '');
                setHasExistingCredentials(true);
            }
        } catch (err) {
            console.error('Error loading credentials:', err);
        } finally {
            setIsLoading(false);
        }
    };

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

            if (error) { console.error('Error loading phone numbers:', error); return; }
            setPhoneNumbers(data || []);
        } catch (err) {
            console.error('Error loading phone numbers:', err);
        }
    };

    // ── Save Twilio ────────────────────────────────────────────────────────────
    const handleSaveTwilio = async () => {
        if (!twilioAccountSid.trim() || !twilioAuthToken.trim()) {
            setError('Account SID and Auth Token are required');
            return;
        }
        setTwilioSaving(true);
        setError('');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setError('User not authenticated'); return; }

            const payload = {
                user_id: user.id,
                account_sid: twilioAccountSid,
                auth_token: twilioAuthToken,
                phone_number: twilioPhoneNumber || null,
                api_key: twilioApiKey || null,
                api_secret: twilioApiSecret || null,
                twiml_app_sid: twilioTwimlAppSid || null,
                forward_to_number: forwardToNumber || null,
                updated_at: new Date().toISOString(),
            };

            if (hasExistingCredentials) {
                const { error: e } = await supabase.from('user_credentials').update(payload).eq('user_id', user.id);
                if (e) throw e;
            } else {
                const { error: e } = await supabase.from('user_credentials').insert(payload);
                if (e) throw e;
                setHasExistingCredentials(true);
            }

            setTwilioSuccess(true);
            setTimeout(() => setTwilioSuccess(false), 4000);
        } catch (err: any) {
            console.error('Twilio save error:', err);
            setError(err.message || 'Failed to save credentials.');
        } finally {
            setTwilioSaving(false);
        }
    };

    // ── Save Anthropic ─────────────────────────────────────────────────────────
    const handleSaveAnthropic = async () => {
        setAnthropicSaving(true);
        setError('');
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setError('User not authenticated'); return; }
            if (hasExistingCredentials) {
                const { error: e } = await supabase.from('user_credentials')
                    .update({ anthropic_api_key: anthropicApiKey || null, updated_at: new Date().toISOString() })
                    .eq('user_id', user.id);
                if (e) throw e;
            } else {
                const { error: e } = await supabase.from('user_credentials')
                    .insert({ user_id: user.id, anthropic_api_key: anthropicApiKey || null });
                if (e) throw e;
                setHasExistingCredentials(true);
            }
            clearKeyCache();
            setAnthropicSuccess(true);
            setTimeout(() => setAnthropicSuccess(false), 4000);
        } catch (err: any) {
            setError(err.message || 'Failed to save Anthropic key.');
        } finally {
            setAnthropicSaving(false);
        }
    };

    // ── Save AssemblyAI ────────────────────────────────────────────────────────
    const handleSaveAssemblyAI = async () => {
        setAssemblyaiSaving(true);
        setError('');
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setError('User not authenticated'); return; }
            if (hasExistingCredentials) {
                const { error: e } = await supabase.from('user_credentials')
                    .update({ assemblyai_api_key: assemblyaiApiKey || null, updated_at: new Date().toISOString() })
                    .eq('user_id', user.id);
                if (e) throw e;
            } else {
                const { error: e } = await supabase.from('user_credentials')
                    .insert({ user_id: user.id, assemblyai_api_key: assemblyaiApiKey || null });
                if (e) throw e;
                setHasExistingCredentials(true);
            }
            setAssemblyaiSuccess(true);
            setTimeout(() => setAssemblyaiSuccess(false), 4000);
        } catch (err: any) {
            setError(err.message || 'Failed to save AssemblyAI key.');
        } finally {
            setAssemblyaiSaving(false);
        }
    };

    // ── Save Apify ─────────────────────────────────────────────────────────────
    const handleSaveApify = async () => {
        setApifySaving(true);
        setError('');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setError('User not authenticated'); return; }

            if (hasExistingCredentials) {
                const { error: e } = await supabase
                    .from('user_credentials')
                    .update({ apify_api_token: apifyApiToken || null, updated_at: new Date().toISOString() })
                    .eq('user_id', user.id);
                if (e) throw e;
            } else {
                const { error: e } = await supabase
                    .from('user_credentials')
                    .insert({ user_id: user.id, apify_api_token: apifyApiToken || null });
                if (e) throw e;
                setHasExistingCredentials(true);
            }

            setApifySuccess(true);
            setTimeout(() => setApifySuccess(false), 4000);
        } catch (err: any) {
            console.error('Apify save error:', err);
            setError(err.message || 'Failed to save Apify token.');
        } finally {
            setApifySaving(false);
        }
    };

    // ── Phone number helpers ───────────────────────────────────────────────────
    const handleAddPhoneNumber = async () => {
        if (!newPhoneNumber.trim()) { setError('Phone number is required'); return; }
        setIsAddingPhone(true);
        setError('');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setError('User not authenticated'); return; }

            const isFirstNumber = phoneNumbers.length === 0;
            const { data, error } = await supabase
                .from('twilio_phone_numbers')
                .insert({ user_id: user.id, phone_number: newPhoneNumber, friendly_name: newPhoneFriendlyName.trim() || null, is_default: isFirstNumber })
                .select()
                .single();

            if (error) throw error;
            setPhoneNumbers([...phoneNumbers, data]);
            setNewPhoneNumber('');
            setNewPhoneFriendlyName('');
        } catch (err: any) {
            console.error('Add phone error:', err);
            setError(err.message || 'Failed to add phone number');
        } finally {
            setIsAddingPhone(false);
        }
    };

    const handleDeletePhoneNumber = async (id: string) => {
        if (!confirm('Delete this phone number?')) return;
        try {
            const { error } = await supabase.from('twilio_phone_numbers').delete().eq('id', id);
            if (error) throw error;
            const remaining = phoneNumbers.filter(p => p.id !== id);
            setPhoneNumbers(remaining);
            const deleted = phoneNumbers.find(p => p.id === id);
            if (deleted?.is_default && remaining.length > 0) {
                await handleSetDefaultPhone(remaining[0].id);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to delete phone number');
        }
    };

    const handleSetDefaultPhone = async (id: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { error } = await supabase.from('twilio_phone_numbers').update({ is_default: true }).eq('id', id);
            if (error) throw error;
            setPhoneNumbers(phoneNumbers.map(p => ({ ...p, is_default: p.id === id })));
        } catch (err: any) {
            setError(err.message || 'Failed to set default');
        }
    };

    // ── Loading ────────────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-7 h-7 text-[#CD3D35] animate-spin" />
            </div>
        );
    }

    const twilioConfigured    = !!twilioAccountSid && !!twilioAuthToken;
    const apifyConfigured     = !!apifyApiToken;
    const anthropicConfigured = !!anthropicApiKey;
    const assemblyaiConfigured = !!assemblyaiApiKey;

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="p-6 space-y-5 max-w-3xl">

            {/* Page header */}
            <div>
                <h2 className="text-xl font-bold text-white">Credentials</h2>
                <p className="text-gray-500 text-sm mt-0.5">API keys and integration tokens stored securely per account.</p>
            </div>

            {/* Global error / alert */}
            {error && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    {error}
                    <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-200 transition-colors text-xs underline">Dismiss</button>
                </div>
            )}

            {/* ── Twilio ── */}
            <IntegrationCard
                accentColor="#4f8ef7"
                icon={Phone}
                title="Twilio"
                description="Voice calling, SMS & phone number management"
                isConfigured={twilioConfigured}
            >
                <div className="space-y-4">

                    {/* Core credentials */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Account SID *" value={twilioAccountSid} onChange={setTwilioAccountSid} placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxx" />
                        <Field label="Auth Token *" value={twilioAuthToken} onChange={setTwilioAuthToken} placeholder="••••••••••••••••" type="password" />
                    </div>

                    <Field label="Legacy Phone Number" value={twilioPhoneNumber} onChange={setTwilioPhoneNumber} placeholder="+1 555 123 4567" hint="Keep for backward compatibility — manage multiple numbers below." />

                    {/* Voice SDK sub-section */}
                    <div className="pt-3 border-t border-white/6 space-y-4">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Voice SDK — Browser Calling</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field
                                label="API Key SID"
                                value={twilioApiKey}
                                onChange={setTwilioApiKey}
                                placeholder="SKxxxxxxxxxxxxxxxx"
                                hintLink="https://console.twilio.com/us1/account/keys-credentials/api-keys"
                                hintLinkLabel="Create at Twilio API Keys →"
                            />
                            <Field label="API Secret" value={twilioApiSecret} onChange={setTwilioApiSecret} placeholder="••••••••••••••••" type="password" hint="Only shown once when creating the key." />
                        </div>
                        <Field
                            label="TwiML App SID"
                            value={twilioTwimlAppSid}
                            onChange={setTwilioTwimlAppSid}
                            placeholder="APxxxxxxxxxxxxxxxx"
                            hintLink="https://console.twilio.com/us1/develop/voice/manage/twiml-apps"
                            hintLinkLabel="Create at TwiML Apps →"
                        />
                    </div>

                    {/* Call forwarding sub-section */}
                    <div className="pt-3 border-t border-white/6 space-y-4">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Call Forwarding</p>
                        <Field label="Forward To Number" value={forwardToNumber} onChange={setForwardToNumber} placeholder="+1 410 555 1234" hint="Your personal number to receive inbound callbacks." />
                    </div>

                    <SaveBtn onClick={handleSaveTwilio} loading={twilioSaving} success={twilioSuccess} disabled={!twilioAccountSid || !twilioAuthToken} label={hasExistingCredentials ? 'Update Twilio' : 'Save Twilio'} />
                </div>
            </IntegrationCard>

            {/* ── Phone Numbers ── */}
            <IntegrationCard
                accentColor="#a855f7"
                icon={Globe}
                title="Phone Numbers"
                description="Manage Twilio numbers for outbound dialing"
                isConfigured={phoneNumbers.length > 0}
            >
                <div className="space-y-5">
                    {/* Add number */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Add Number</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Field label="Phone Number *" value={newPhoneNumber} onChange={setNewPhoneNumber} placeholder="+1 555 123 4567" />
                            <Field label="Friendly Name" value={newPhoneFriendlyName} onChange={setNewPhoneFriendlyName} placeholder="Sales Line, Support…" mono={false} />
                        </div>
                        <button
                            onClick={handleAddPhoneNumber}
                            disabled={isAddingPhone || !newPhoneNumber.trim()}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/6 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isAddingPhone ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                            Add Number
                        </button>
                    </div>

                    {/* List */}
                    {phoneNumbers.length > 0 && (
                        <div className="space-y-2 pt-3 border-t border-white/6">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Your Numbers</p>
                            {phoneNumbers.map(phone => (
                                <div key={phone.id} className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border border-white/8 rounded-xl hover:border-white/15 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => handleSetDefaultPhone(phone.id)} className={`transition-colors ${phone.is_default ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}`} title={phone.is_default ? 'Default' : 'Set as default'}>
                                            <Star size={15} fill={phone.is_default ? 'currentColor' : 'none'} />
                                        </button>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-mono text-sm font-semibold">{phone.phone_number}</span>
                                                {phone.is_default && <span className="text-[9px] px-2 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full uppercase font-bold tracking-wider">Default</span>}
                                            </div>
                                            {phone.friendly_name && <p className="text-xs text-gray-500 mt-0.5">{phone.friendly_name}</p>}
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeletePhoneNumber(phone.id)} className="text-gray-600 hover:text-red-400 transition-colors p-1.5" title="Delete">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {phoneNumbers.length === 0 && (
                        <p className="text-center text-gray-600 text-sm py-4">No numbers added yet.</p>
                    )}
                </div>
            </IntegrationCard>

            {/* ── Anthropic ── */}
            <IntegrationCard
                accentColor="#CD3D35"
                icon={Sparkles}
                title="Anthropic Claude"
                description="AI content generation, script writing, and memory synthesis"
                isConfigured={anthropicConfigured}
            >
                <div className="space-y-4">
                    <Field
                        label="API Key"
                        value={anthropicApiKey}
                        onChange={setAnthropicApiKey}
                        placeholder="sk-ant-••••••••••••••••••••"
                        type="password"
                        hintLink="https://console.anthropic.com/account/keys"
                        hintLinkLabel="Get your key at console.anthropic.com →"
                    />
                    <div className="flex items-start gap-3 p-3 bg-[#CD3D35]/8 border border-[#CD3D35]/15 rounded-xl">
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Powers the Content Engine (script generation, content radar), Factory Quick Preview, daily brief, and the Memory system. Uses claude-sonnet-4-6 for generation and claude-haiku-4-5 for fast tasks.
                        </p>
                    </div>
                    <SaveBtn onClick={handleSaveAnthropic} loading={anthropicSaving} success={anthropicSuccess} label={anthropicConfigured ? 'Update Anthropic Key' : 'Save Anthropic Key'} />
                </div>
            </IntegrationCard>

            {/* ── AssemblyAI ── */}
            <IntegrationCard
                accentColor="#7C3AED"
                icon={Headphones}
                title="AssemblyAI"
                description="Call transcription and reel audio analysis"
                isConfigured={assemblyaiConfigured}
            >
                <div className="space-y-4">
                    <Field
                        label="API Key"
                        value={assemblyaiApiKey}
                        onChange={setAssemblyaiApiKey}
                        placeholder="••••••••••••••••••••"
                        type="password"
                        hintLink="https://www.assemblyai.com/app/account"
                        hintLinkLabel="Get your key at assemblyai.com →"
                    />
                    <div className="flex items-start gap-3 p-3 bg-[#7C3AED]/8 border border-[#7C3AED]/15 rounded-xl">
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Optional. Used to transcribe post-call recordings and spiking content reels. The app works without it - call notes will be text-only without transcription.
                        </p>
                    </div>
                    <SaveBtn onClick={handleSaveAssemblyAI} loading={assemblyaiSaving} success={assemblyaiSuccess} label={assemblyaiConfigured ? 'Update AssemblyAI Key' : 'Save AssemblyAI Key'} />
                </div>
            </IntegrationCard>

            {/* ── Apify ── */}
            <IntegrationCard
                accentColor="#f97316"
                icon={Database}
                title="Apify"
                description="Web scraping & lead data automation"
                isConfigured={apifyConfigured}
            >
                <div className="space-y-4">
                    <Field
                        label="API Token"
                        value={apifyApiToken}
                        onChange={setApifyApiToken}
                        placeholder="apify_api_••••••••••••••••••••"
                        type="password"
                        hintLink="https://console.apify.com/account/integrations"
                        hintLinkLabel="Find your token at Apify Console →"
                    />

                    <div className="flex items-start gap-3 p-3 bg-[#f97316]/8 border border-[#f97316]/15 rounded-xl">
                        <span className="text-[#f97316] text-lg leading-none mt-0.5">💡</span>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Used to run lead-scraping Actors (e.g. Google Maps, Yelp, LinkedIn scrapers). Once connected, you'll be able to trigger scrapes directly from the Leads tab.
                        </p>
                    </div>

                    <SaveBtn onClick={handleSaveApify} loading={apifySaving} success={apifySuccess} label={apifyConfigured ? 'Update Apify Token' : 'Save Apify Token'} />
                </div>
            </IntegrationCard>

        </div>
    );
};

export default Credentials;
