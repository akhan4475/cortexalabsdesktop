import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SAVED_CREDS_KEY = 'cortexaos_saved_creds';

interface LoginPageProps {
    onBack: () => void;
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Autofill saved credentials on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(SAVED_CREDS_KEY);
            if (saved) {
                const { email: savedEmail, password: savedPassword } = JSON.parse(saved);
                setEmail(savedEmail || '');
                setPassword(savedPassword || '');
                setRememberMe(true);
            }
        } catch {}
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;

            if (data.session) {
                if (rememberMe) {
                    localStorage.setItem(SAVED_CREDS_KEY, JSON.stringify({ email, password }));
                } else {
                    localStorage.removeItem(SAVED_CREDS_KEY);
                }
                onLoginSuccess();
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#131317] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
            {/* Red glow center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#CD3D35]/6 rounded-full blur-[140px] pointer-events-none" />

            <button
                onClick={onBack}
                className="absolute top-8 left-8 text-gray-500 hover:text-white flex items-center gap-2 transition-colors z-20 text-sm"
            >
                <ArrowLeft size={16} />
                Back to site
            </button>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full max-w-sm relative z-10"
            >
                {/* Logo + title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1a1a1a] border border-white/10 overflow-hidden mb-5 shadow-lg p-2">
                        <img
                            src="/favicon.png"
                            alt="CortexaOS"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h1 className="text-2xl font-display font-bold text-white mb-1.5">Sign in to CortexaOS</h1>
                    <p className="text-gray-500 text-sm">Your client management dashboard</p>
                </div>

                {/* Card */}
                <div className="bg-[#040405] border border-white/8 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-9 pr-4 text-white text-sm focus:outline-none focus:border-[#CD3D35]/60 focus:ring-2 focus:ring-[#CD3D35]/10 transition-all placeholder-gray-600"
                                    placeholder="admin@cortexalabs.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-9 pr-4 text-white text-sm focus:outline-none focus:border-[#CD3D35]/60 focus:ring-2 focus:ring-[#CD3D35]/10 transition-all placeholder-gray-600"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border border-white/20 bg-white/5 accent-[#CD3D35] cursor-pointer"
                            />
                            <span className="text-xs text-gray-500">Remember me on this device</span>
                        </label>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
                                <AlertCircle size={14} className="shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#CD3D35] hover:bg-[#B83530] text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm shadow-lg shadow-[#CD3D35]/15"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-[10px] text-gray-600 tracking-wide">
                        Protected by Cortexa Labs Security
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
