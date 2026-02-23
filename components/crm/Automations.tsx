import React, { useState, useEffect } from 'react';
import { Settings, Globe, Zap, AlertCircle, Save, CheckCircle, Loader2, Plus, Trash2, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TwilioPhoneNumber {
    id: string;
    phone_number: string;
    friendly_name: string | null;
    is_default: boolean;
}

const Automations: React.FC = () => {
    const [twilioAccountSid, setTwilioAccountSid] = useState('');
    const [twilioAuthToken, setTwilioAuthToken] = useState('');
    const [twilioPhoneNumber, setTwilioPhoneNumber] = useState('');
    const [twilioApiKey, setTwilioApiKey] = useState('');
    const [twilioApiSecret, setTwilioApiSecret] = useState('');
    const [twilioTwimlAppSid, setTwilioTwimlAppSid] = useState('');
    const [forwardToNumber, setForwardToNumber] = useState('');
    
    // Phone Numbers Management
    const [phoneNumbers, setPhoneNumbers] = useState<TwilioPhoneNumber[]>([]);
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [newPhoneFriendlyName, setNewPhoneFriendlyName] = useState('');
    const [isAddingPhone, setIsAddingPhone] = useState(false);
    
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState('');
    const [hasExistingCredentials, setHasExistingCredentials] = useState(false);

    // Load existing credentials and phone numbers on mount
    useEffect(() => {
        loadCredentials();
        loadPhoneNumbers();
    }, []);

    const loadCredentials = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('twilio_credentials')
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

            if (error) {
                console.error('Error loading phone numbers:', error);
                return;
            }

            setPhoneNumbers(data || []);
        } catch (err) {
            console.error('Error loading phone numbers:', err);
        }
    };

    const handleAddPhoneNumber = async () => {
        if (!newPhoneNumber.trim()) {
            setError('Phone number is required');
            return;
        }

        setIsAddingPhone(true);
        setError('');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError('User not authenticated');
                return;
            }

            const isFirstNumber = phoneNumbers.length === 0;

            const { data, error } = await supabase
                .from('twilio_phone_numbers')
                .insert({
                    user_id: user.id,
                    phone_number: newPhoneNumber,
                    friendly_name: newPhoneFriendlyName.trim() || null,
                    is_default: isFirstNumber
                })
                .select()
                .single();

            if (error) throw error;

            setPhoneNumbers([...phoneNumbers, data]);
            setNewPhoneNumber('');
            setNewPhoneFriendlyName('');
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);

        } catch (err: any) {
            console.error('Add phone error:', err);
            setError(err.message || 'Failed to add phone number');
        } finally {
            setIsAddingPhone(false);
        }
    };

    const handleDeletePhoneNumber = async (id: string) => {
        if (!confirm('Are you sure you want to delete this phone number?')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('twilio_phone_numbers')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setPhoneNumbers(phoneNumbers.filter(p => p.id !== id));
            
            // If we deleted the default and there are still numbers, make the first one default
            const deletedNumber = phoneNumbers.find(p => p.id === id);
            if (deletedNumber?.is_default && phoneNumbers.length > 1) {
                const firstRemaining = phoneNumbers.find(p => p.id !== id);
                if (firstRemaining) {
                    await handleSetDefaultPhone(firstRemaining.id);
                }
            }

        } catch (err: any) {
            console.error('Delete phone error:', err);
            setError(err.message || 'Failed to delete phone number');
        }
    };

    const handleSetDefaultPhone = async (id: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('twilio_phone_numbers')
                .update({ is_default: true })
                .eq('id', id);

            if (error) throw error;

            setPhoneNumbers(phoneNumbers.map(p => ({
                ...p,
                is_default: p.id === id
            })));

        } catch (err: any) {
            console.error('Set default phone error:', err);
            setError(err.message || 'Failed to set default phone number');
        }
    };

    const handleSave = async () => {
        if (!twilioAccountSid.trim() || !twilioAuthToken.trim()) {
            setError('Account SID and Auth Token are required');
            return;
        }

        setIsSaving(true);
        setError('');
        setSaveSuccess(false);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError('User not authenticated');
                return;
            }

            const credentialsData = {
                user_id: user.id,
                account_sid: twilioAccountSid,
                auth_token: twilioAuthToken,
                phone_number: twilioPhoneNumber || null,
                api_key: twilioApiKey || null,
                api_secret: twilioApiSecret || null,
                twiml_app_sid: twilioTwimlAppSid || null,
                forward_to_number: forwardToNumber || null,
                updated_at: new Date().toISOString()
            };

            if (hasExistingCredentials) {
                // Update existing
                const { error: updateError } = await supabase
                    .from('twilio_credentials')
                    .update(credentialsData)
                    .eq('user_id', user.id);

                if (updateError) throw updateError;
            } else {
                // Insert new
                const { error: insertError } = await supabase
                    .from('twilio_credentials')
                    .insert(credentialsData);

                if (insertError) throw insertError;
                setHasExistingCredentials(true);
            }

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 5000);

        } catch (err: any) {
            console.error('Save error:', err);
            setError(err.message || 'Failed to save credentials. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-horizon-accent animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">System Configuration</h2>
                    <p className="text-gray-500 text-sm">Connect your Twilio account and manage automations.</p>
                </div>
            </div>

            {/* Twilio Configuration */}
            <div className="bg-[#18181b] border border-[#262624] rounded-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                        <Globe size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">Twilio Integration</h3>
                        <p className="text-xs text-gray-500">Configure your Twilio account for voice calling</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                            <div className="text-sm text-red-200">{error}</div>
                        </div>
                    )}

                    {saveSuccess && (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
                            <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                            <div className="text-sm text-green-200">Configuration saved successfully!</div>
                        </div>
                    )}

                    {/* Main Credentials */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account SID*</label>
                            <input 
                                type="text"
                                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                value={twilioAccountSid}
                                onChange={(e) => setTwilioAccountSid(e.target.value)}
                                className="w-full bg-[#18181b] border border-[#262624] rounded-xl px-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none font-mono"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Auth Token*</label>
                            <input 
                                type="password"
                                placeholder="••••••••••••••••••••••••••••••••"
                                value={twilioAuthToken}
                                onChange={(e) => setTwilioAuthToken(e.target.value)}
                                className="w-full bg-[#18181b] border border-[#262624] rounded-xl px-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none font-mono"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Legacy Phone Number (Optional)</label>
                            <input 
                                type="text"
                                placeholder="+1 555 123 4567"
                                value={twilioPhoneNumber}
                                onChange={(e) => setTwilioPhoneNumber(e.target.value)}
                                className="w-full bg-[#18181b] border border-[#262624] rounded-xl px-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none font-mono"
                            />
                            <p className="text-xs text-gray-600 mt-1">Keep for backward compatibility - use Phone Numbers section below for managing multiple numbers</p>
                        </div>
                    </div>

                    {/* Voice SDK Credentials */}
                    <div className="space-y-4 p-4 bg-[#09090b] border border-[#262624] rounded-lg">
                        <div className="flex items-start justify-between">
                            <div>
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest">Voice SDK Credentials</h4>
                                <p className="text-xs text-gray-500 mt-1">Required for browser-based calling</p>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">API Key SID</label>
                            <input 
                                type="text"
                                placeholder="SKxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                value={twilioApiKey}
                                onChange={(e) => setTwilioApiKey(e.target.value)}
                                className="w-full bg-[#18181b] border border-[#262624] rounded-xl px-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none font-mono"
                            />
                            <p className="text-xs text-gray-600 mt-1">
                                Create at: <a href="https://console.twilio.com/us1/account/keys-credentials/api-keys" target="_blank" rel="noopener noreferrer" className="text-horizon-accent hover:underline">Twilio API Keys</a>
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">API Secret</label>
                            <input 
                                type="password"
                                placeholder="••••••••••••••••••••••••••••••••"
                                value={twilioApiSecret}
                                onChange={(e) => setTwilioApiSecret(e.target.value)}
                                className="w-full bg-[#18181b] border border-[#262624] rounded-xl px-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none font-mono"
                            />
                            <p className="text-xs text-gray-600 mt-1">Only shown once when creating the API Key</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">TwiML App SID</label>
                            <input 
                                type="text"
                                placeholder="APxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                value={twilioTwimlAppSid}
                                onChange={(e) => setTwilioTwimlAppSid(e.target.value)}
                                className="w-full bg-[#18181b] border border-[#262624] rounded-xl px-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none font-mono"
                            />
                            <p className="text-xs text-gray-600 mt-1">
                                Create at: <a href="https://console.twilio.com/us1/develop/voice/manage/twiml-apps" target="_blank" rel="noopener noreferrer" className="text-horizon-accent hover:underline">TwiML Apps</a>
                            </p>
                        </div>
                    </div>

                    {/* Call Forwarding */}
                    <div className="space-y-4 p-4 bg-[#09090b] border border-[#262624] rounded-lg">
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Call Forwarding</h4>
                            <p className="text-xs text-gray-500 mt-1">Forward incoming calls to your personal number</p>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Forward To Number</label>
                            <input 
                                type="text"
                                placeholder="+1 410 555 1234"
                                value={forwardToNumber}
                                onChange={(e) => setForwardToNumber(e.target.value)}
                                className="w-full bg-[#18181b] border border-[#262624] rounded-xl px-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none font-mono"
                            />
                            <p className="text-xs text-gray-600 mt-1">Your personal phone number to receive callbacks</p>
                        </div>
                    </div>

                    <button 
                        onClick={handleSave}
                        disabled={isSaving || !twilioAccountSid || !twilioAuthToken}
                        className="flex items-center gap-2 bg-horizon-accent text-black px-6 py-3 rounded-lg font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                {hasExistingCredentials ? 'Update Configuration' : 'Save Configuration'}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Phone Numbers Management */}
            <div className="bg-[#18181b] border border-[#262624] rounded-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-horizon-accent/10 border border-horizon-accent/20 flex items-center justify-center text-horizon-accent">
                        <Globe size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">Phone Numbers</h3>
                        <p className="text-xs text-gray-500">Manage your Twilio phone numbers for outbound calling</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Add New Phone Number */}
                    <div className="space-y-4 p-4 bg-[#09090b] border border-[#262624] rounded-lg">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest">Add New Number</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number*</label>
                                <input 
                                    type="text"
                                    placeholder="+1 555 123 4567"
                                    value={newPhoneNumber}
                                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                                    className="w-full bg-[#18181b] border border-[#262624] rounded-xl px-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none font-mono"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Friendly Name (Optional)</label>
                                <input 
                                    type="text"
                                    placeholder="Sales Line, Support Line, etc."
                                    value={newPhoneFriendlyName}
                                    onChange={(e) => setNewPhoneFriendlyName(e.target.value)}
                                    className="w-full bg-[#18181b] border border-[#262624] rounded-xl px-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleAddPhoneNumber}
                            disabled={isAddingPhone || !newPhoneNumber.trim()}
                            className="flex items-center gap-2 bg-horizon-accent text-black px-4 py-2.5 rounded-lg font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {isAddingPhone ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Plus size={16} />
                                    Add Phone Number
                                </>
                            )}
                        </button>
                    </div>

                    {/* Phone Numbers List */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest">Your Phone Numbers</h4>
                        
                        {phoneNumbers.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-sm">No phone numbers added yet.</p>
                                <p className="text-xs mt-2">Add your first Twilio number above to get started.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {phoneNumbers.map((phone) => (
                                    <div 
                                        key={phone.id}
                                        className="flex items-center justify-between p-4 bg-[#09090b] border border-[#262624] rounded-lg hover:border-[#333] transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => handleSetDefaultPhone(phone.id)}
                                                className={`transition-colors ${phone.is_default ? 'text-yellow-500' : 'text-gray-600 hover:text-yellow-500'}`}
                                                title={phone.is_default ? 'Default number' : 'Set as default'}
                                            >
                                                <Star size={18} fill={phone.is_default ? 'currentColor' : 'none'} />
                                            </button>
                                            
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-white font-mono font-bold">{phone.phone_number}</span>
                                                    {phone.is_default && (
                                                        <span className="text-[9px] px-2 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded uppercase font-bold tracking-wider">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                {phone.friendly_name && (
                                                    <p className="text-xs text-gray-500 mt-0.5">{phone.friendly_name}</p>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDeletePhoneNumber(phone.id)}
                                            className="text-gray-600 hover:text-red-500 transition-colors p-2"
                                            title="Delete number"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-xs text-blue-200">
                            <strong>💡 Tip:</strong> Add multiple Twilio phone numbers and switch between them in the Dialer. The starred number is your default outbound line.
                        </p>
                    </div>
                </div>
            </div>

            {/* Future Automation Modules */}
            <div className="bg-[#18181b] border border-[#262624] rounded-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-horizon-accent/10 border border-horizon-accent/20 flex items-center justify-center text-horizon-accent">
                        <Zap size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">Workflow Automations</h3>
                        <p className="text-xs text-gray-500">Coming soon</p>
                    </div>
                </div>

                <div className="text-center py-12">
                    <Settings size={48} className="text-gray-600 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-500 text-sm">Advanced automation workflows will be available here.</p>
                    <p className="text-gray-600 text-xs mt-2">Stay tuned for updates.</p>
                </div>
            </div>
        </div>
    );
};

export default Automations;