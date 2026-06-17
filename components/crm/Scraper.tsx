import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Plus, X, Loader2, CheckCircle, AlertCircle,
    Star, Play, Download, RotateCcw, KeyRound, ChevronDown, FolderPlus, Zap,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { callClaude } from '../../lib/ai';
import { Campaign, Lead } from './types';

interface ScraperProps {
    campaigns: Campaign[];
    onAddCampaign: (campaign: Campaign, leads: Lead[]) => Promise<void>;
    onBulkAddLeads: (leads: Lead[], campaignId: string) => Promise<void>;
}

interface PlaceResult {
    title?: string;
    categoryName?: string;
    address?: string;
    phoneUnformatted?: string;
    phone?: string;
    website?: string;
    totalScore?: number;
    reviewsCount?: number;
    description?: string;
}


type ScrapeStatus = 'idle' | 'starting' | 'running' | 'succeeded' | 'failed';

const Scraper: React.FC<ScraperProps> = ({ campaigns, onAddCampaign, onBulkAddLeads }) => {

    // ── Token ───────────────────────────────────────────────────────────────────
    const [apifyToken, setApifyToken]   = useState('');
    const [tokenLoaded, setTokenLoaded] = useState(false);

    // ── Campaign ────────────────────────────────────────────────────────────────
    const [selectedCampaignId, setSelectedCampaignId] = useState('');
    const [dropdownOpen, setDropdownOpen]             = useState(false);
    const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
    const [modalCampaignName, setModalCampaignName]   = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // ── Search config ───────────────────────────────────────────────────────────
    const [searchQueries, setSearchQueries] = useState<string[]>([]);
    const [currentQuery, setCurrentQuery]   = useState('');
    const [maxResults, setMaxResults]       = useState(20);

    // ── Scrape state ────────────────────────────────────────────────────────────
    const [scrapeStatus, setScrapeStatus] = useState<ScrapeStatus>('idle');
    const [datasetId, setDatasetId]       = useState('');
    const [results, setResults]           = useState<PlaceResult[]>([]);
    const [elapsedSecs, setElapsedSecs]   = useState(0);
    const [error, setError]               = useState('');

    // ── Import state ────────────────────────────────────────────────────────────
    const [isImporting, setIsImporting]   = useState(false);
    const [importDone, setImportDone]     = useState(false);
    const [importedCount, setImportedCount] = useState(0);

    // ── ICP Scoring state ───────────────────────────────────────────────────────
    const [icpScores, setIcpScores]   = useState<number[]>([]);
    const [isScoring, setIsScoring]   = useState(false);
    const [scoringError, setScoringError] = useState('');

    const pollRef  = useRef<ReturnType<typeof setInterval> | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Load token on mount ─────────────────────────────────────────────────────
    useEffect(() => {
        (async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;
                const { data } = await supabase
                    .from('user_credentials')
                    .select('apify_api_token')
                    .eq('user_id', user.id)
                    .single();
                if (data?.apify_api_token) setApifyToken(data.apify_api_token);
            } catch (err) {
                console.error('Failed to load Apify token:', err);
            } finally {
                setTokenLoaded(true);
            }
        })();
    }, []);

    // ── Cleanup intervals on unmount ────────────────────────────────────────────
    useEffect(() => () => { stopPolling(); stopTimer(); }, []);

    // ── Close dropdown on outside click ─────────────────────────────────────────
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        if (dropdownOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [dropdownOpen]);

    // ── Helpers ─────────────────────────────────────────────────────────────────
    const stopPolling = () => { if (pollRef.current)  { clearInterval(pollRef.current);  pollRef.current  = null; } };
    const stopTimer   = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };

    const startTimer = () => {
        setElapsedSecs(0);
        timerRef.current = setInterval(() => setElapsedSecs(s => s + 1), 1000);
    };

    const formatElapsed = (s: number) => {
        const m = Math.floor(s / 60);
        return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
    };

    const addQuery = () => {
        const q = currentQuery.trim();
        if (!q || searchQueries.includes(q)) return;
        setSearchQueries(prev => [...prev, q]);
        setCurrentQuery('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') { e.preventDefault(); addQuery(); }
    };

    // ── Confirm new campaign from modal — saves to DB immediately ───────────────
    const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);

    const confirmNewCampaign = async () => {
        if (!modalCampaignName.trim()) return;
        setIsCreatingCampaign(true);
        try {
            const newCampaign: Campaign = {
                id:        crypto.randomUUID(),
                name:      modalCampaignName.trim(),
                createdAt: new Date().toISOString(),
                leadCount: 0,
            };
            await onAddCampaign(newCampaign, []);
            setSelectedCampaignId(newCampaign.id);
            setModalCampaignName('');
            setShowNewCampaignModal(false);
        } catch (err: any) {
            setError(err.message || 'Failed to create campaign.');
            setShowNewCampaignModal(false);
        } finally {
            setIsCreatingCampaign(false);
        }
    };

    // ── Start scrape ────────────────────────────────────────────────────────────
    const handleStartScrape = async () => {
        if (!apifyToken)               return setError('No Apify token found. Go to Credentials to add your token.');
        if (searchQueries.length === 0) return setError('Add at least one search query.');
        if (!selectedCampaignId)        return setError('Select a campaign or create a new one first.');

        setError('');
        setScrapeStatus('starting');
        setResults([]);
        setImportDone(false);

        try {
            const res = await fetch(
                `https://api.apify.com/v2/acts/compass~crawler-google-places/runs?token=${apifyToken}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        searchStringsArray: searchQueries,
                        maxCrawledPlacesPerSearch: maxResults,
                        language: 'en',
                        countryCode: 'us',
                        includeHistogram: false,
                        includeOpeningHours: false,
                        includePeopleAlsoSearch: false,
                        maxReviews: 0,
                    }),
                }
            );

            if (!res.ok) {
                const errBody = await res.json().catch(() => ({}));
                throw new Error(errBody?.error?.message || `Apify responded with ${res.status}`);
            }

            const data = await res.json();
            const runId      = data.data.id;
            const newDatasetId = data.data.defaultDatasetId;
            setDatasetId(newDatasetId);
            setScrapeStatus('running');
            startTimer();

            // ── Poll every 4 s ──────────────────────────────────────────────
            pollRef.current = setInterval(async () => {
                try {
                    const statusRes  = await fetch(`https://api.apify.com/v2/acts/compass~crawler-google-places/runs/${runId}?token=${apifyToken}`);
                    const statusData = await statusRes.json();
                    const status: string = statusData.data?.status ?? '';

                    if (status === 'SUCCEEDED') {
                        stopPolling();
                        stopTimer();
                        const itemsRes = await fetch(
                            `https://api.apify.com/v2/datasets/${newDatasetId}/items?token=${apifyToken}&clean=true&limit=1000`
                        );
                        const items: PlaceResult[] = await itemsRes.json();
                        setResults(items);
                        setScrapeStatus('succeeded');
                    } else if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(status)) {
                        stopPolling();
                        stopTimer();
                        setScrapeStatus('failed');
                        setError(`Apify run ${status.toLowerCase()}. Please try again.`);
                    }
                } catch (pollErr) {
                    console.error('Polling error:', pollErr);
                }
            }, 4000);

        } catch (err: any) {
            setScrapeStatus('failed');
            setError(err.message || 'Failed to start scrape. Check your token and try again.');
        }
    };

    // ── Import leads ────────────────────────────────────────────────────────────
    const handleImport = async () => {
        if (results.length === 0) return;
        setIsImporting(true);
        setError('');

        try {
            const leads: Lead[] = results.map((place, i) => ({
                id: crypto.randomUUID(),
                campaignId: selectedCampaignId,
                name:     place.title    || 'Unknown Business',
                company:  place.title    || 'Unknown Business',
                phone:    place.phoneUnformatted || place.phone || '',
                email:    '',
                address:  place.address  || '',
                website:  place.website  || '',
                rating:   place.totalScore   != null ? String(place.totalScore)   : '',
                reviews:  place.reviewsCount != null ? String(place.reviewsCount) : '',
                summary:  place.categoryName || place.description || '',
                status:   'prospect',
                icpScore: icpScores[i] ?? undefined,
            }));

            await onBulkAddLeads(leads, selectedCampaignId);

            setImportedCount(leads.length);
            setImportDone(true);
        } catch (err: any) {
            setError(err.message || 'Failed to import leads.');
        } finally {
            setIsImporting(false);
        }
    };

    // ── ICP scoring ─────────────────────────────────────────────────────────────
    const handleScoreLeads = async () => {
        if (results.length === 0) return;
        setIsScoring(true);
        setScoringError('');
        const scores: number[] = new Array(results.length).fill(0);

        try {
            const batchSize = 10;
            for (let i = 0; i < results.length; i += batchSize) {
                const batch = results.slice(i, i + batchSize);
                const list = batch.map((p, j) =>
                    `[${j}] ${p.title ?? 'Unknown'} | Category: ${p.categoryName ?? 'unknown'} | Rating: ${p.totalScore ?? 'none'} | Reviews: ${p.reviewsCount ?? 0} | Website: ${p.website ? 'yes' : 'no'}`
                ).join('\n');

                const response = await callClaude(
                    'You score local service businesses as website redesign clients for a web agency. Score 1-10: 8-10 = established (20+ reviews), existing website worth upgrading, strong rating (4+), clear contractor niche. 5-7 = moderate fit. 1-4 = new, no reviews, wrong category. Respond ONLY with valid JSON: {"scores":[7,5,8,...]} — one number per business in order.',
                    list,
                    { maxTokens: 200 }
                );

                try {
                    const match = response.match(/\{[\s\S]*\}/);
                    const parsed = match ? JSON.parse(match[0]) : null;
                    if (parsed?.scores && Array.isArray(parsed.scores)) {
                        parsed.scores.forEach((s: number, j: number) => {
                            scores[i + j] = Math.max(1, Math.min(10, Math.round(Number(s) || 5)));
                        });
                    } else {
                        batch.forEach((_, j) => { scores[i + j] = 5; });
                    }
                } catch {
                    batch.forEach((_, j) => { scores[i + j] = 5; });
                }
            }
            setIcpScores(scores);
        } catch (err: any) {
            setScoringError(err.message || 'Scoring failed. Check your Anthropic key in Credentials.');
            setIcpScores(results.map(() => 5));
        } finally {
            setIsScoring(false);
        }
    };

    const getIcpColor = (score: number) => {
        if (score >= 8) return { bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-400' };
        if (score >= 5) return { bg: 'bg-yellow-500/10 border-yellow-500/20', text: 'text-yellow-400' };
        return { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400' };
    };

    // ── Reset ───────────────────────────────────────────────────────────────────
    const handleReset = () => {
        stopPolling();
        stopTimer();
        setScrapeStatus('idle');
        setResults([]);
        setDatasetId('');
        setElapsedSecs(0);
        setError('');
        setImportDone(false);
        setImportedCount(0);
        setIcpScores([]);
        setScoringError('');
    };

    // ── Loading token ───────────────────────────────────────────────────────────
    if (!tokenLoaded) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-7 h-7 text-[#CD3D35] animate-spin" />
            </div>
        );
    }

    // ── No token ────────────────────────────────────────────────────────────────
    if (!apifyToken) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <KeyRound size={24} className="text-gray-500" />
                </div>
                <div>
                    <p className="text-white font-semibold">Apify token not configured</p>
                    <p className="text-gray-500 text-sm mt-1">
                        Go to the <span className="text-[#CD3D35] font-medium">Credentials</span> tab and add your Apify API token to get started.
                    </p>
                </div>
            </div>
        );
    }

    // ── Main render ─────────────────────────────────────────────────────────────
    return (
        <>
        <div className="p-6 space-y-5 max-w-3xl">

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Lead Scraper</h2>
                    <p className="text-gray-500 text-sm mt-0.5">
                        Scrape Google Maps businesses directly into your campaigns via Apify.
                    </p>
                </div>
                {scrapeStatus !== 'idle' && (
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors mt-1"
                    >
                        <RotateCcw size={12} /> New Scrape
                    </button>
                )}
            </div>

            {/* Error banner */}
            {error && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    <span className="flex-1">{error}</span>
                    <button onClick={() => setError('')} className="text-red-500 hover:text-red-300 transition-colors shrink-0">
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* ── Config form (idle only) ── */}
            {scrapeStatus === 'idle' && (
                <div className="bg-[#0c0c0e] border border-white/8 rounded-2xl divide-y divide-white/6">

                    {/* Campaign section — no overflow-hidden so dropdown isn't clipped */}
                    <div className="px-6 py-5">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Target Campaign</p>
                        <div className="flex gap-3">
                            <div className="relative flex-1" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setDropdownOpen(o => !o)}
                                    className={`w-full flex items-center justify-between bg-white/[0.04] border rounded-xl px-4 py-2.5 text-sm text-left transition-all focus:outline-none ${dropdownOpen ? 'border-[#CD3D35]/50 ring-1 ring-[#CD3D35]/20' : 'border-white/10 hover:border-white/20'}`}
                                >
                                    <span className={selectedCampaignId ? 'text-white' : 'text-gray-600'}>
                                        {selectedCampaignId
                                            ? (() => { const c = campaigns.find(x => x.id === selectedCampaignId); return c ? `${c.name} (${c.leadCount} leads)` : 'Select a campaign…'; })()
                                            : 'Select a campaign…'
                                        }
                                    </span>
                                    <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 shrink-0 ml-2 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute top-full mt-1.5 left-0 right-0 z-50 bg-[#0f0f11] border border-white/12 rounded-xl overflow-hidden shadow-2xl shadow-black/60">
                                        {campaigns.length === 0 ? (
                                            <p className="px-4 py-3 text-sm text-gray-600 text-center">No campaigns yet — create one</p>
                                        ) : (
                                            <div className="max-h-52 overflow-y-auto crm-scroll">
                                                {campaigns.map(c => (
                                                    <button
                                                        key={c.id}
                                                        type="button"
                                                        onClick={() => { setSelectedCampaignId(c.id); setDropdownOpen(false); }}
                                                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors hover:bg-white/6 ${selectedCampaignId === c.id ? 'text-white bg-white/5' : 'text-gray-400'}`}
                                                    >
                                                        <span className="font-medium truncate">{c.name}</span>
                                                        <span className="text-[11px] text-gray-600 shrink-0 ml-3">{c.leadCount} leads</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setShowNewCampaignModal(true)}
                                className="flex items-center gap-1.5 px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/8 transition-all font-medium whitespace-nowrap"
                            >
                                <FolderPlus size={14} /> New Campaign
                            </button>
                        </div>
                    </div>

                    {/* Search queries section */}
                    <div className="px-6 py-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Search Queries</p>
                            <span className="text-[10px] text-gray-600">
                                Press <kbd className="px-1 py-0.5 bg-white/6 border border-white/8 rounded text-[10px]">Enter</kbd> to add
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={currentQuery}
                                onChange={e => setCurrentQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="e.g. roofing contractors Toronto"
                                className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CD3D35]/50 transition-all"
                            />
                            <button
                                onClick={addQuery}
                                disabled={!currentQuery.trim()}
                                className="px-4 bg-white/[0.04] border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/8 transition-all disabled:opacity-40"
                            >
                                <Plus size={15} />
                            </button>
                        </div>
                        {searchQueries.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {searchQueries.map(q => (
                                    <span
                                        key={q}
                                        className="flex items-center gap-1.5 px-3 py-1 bg-[#CD3D35]/10 border border-[#CD3D35]/20 rounded-full text-xs text-[#CD3D35] font-medium"
                                    >
                                        {q}
                                        <button onClick={() => setSearchQueries(p => p.filter(x => x !== q))} className="hover:text-white transition-colors">
                                            <X size={11} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Settings row */}
                    <div className="px-6 py-5 grid grid-cols-2 gap-5">
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                                Max Results / Query &nbsp;
                                <span className="text-white normal-case font-bold">{maxResults}</span>
                            </p>
                            <input
                                type="range"
                                min={10}
                                max={500}
                                step={10}
                                value={maxResults}
                                onChange={e => setMaxResults(Number(e.target.value))}
                                className="w-full accent-[#CD3D35]"
                            />
                            <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                                <span>10</span><span>500</span>
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Country</p>
                            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5">
                                <span className="text-base leading-none">🇺🇸</span>
                                <span className="text-sm text-white">United States</span>
                                <span className="ml-auto text-[10px] text-gray-600 uppercase tracking-widest">Locked</span>
                            </div>
                        </div>
                    </div>

                    {/* CTA row */}
                    <div className="px-6 py-4">
                        <button
                            onClick={handleStartScrape}
                            disabled={searchQueries.length === 0 || !selectedCampaignId}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#CD3D35] hover:bg-[#B83530] text-white font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                        >
                            <Play size={14} /> Start Scrape
                        </button>
                    </div>
                </div>
            )}

            {/* ── Running ── */}
            {(scrapeStatus === 'starting' || scrapeStatus === 'running') && (
                <div className="bg-[#0c0c0e] border border-white/8 rounded-2xl p-10 flex flex-col items-center gap-5 text-center overflow-hidden">
                    <div className="w-16 h-16 rounded-full border-2 border-[#CD3D35]/20 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-[#CD3D35] animate-spin" />
                    </div>
                    <div>
                        <p className="text-white font-semibold text-base">
                            {scrapeStatus === 'starting' ? 'Starting scrape…' : 'Crawling Google Maps…'}
                        </p>
                        {scrapeStatus === 'running' && (
                            <p className="text-gray-500 text-sm mt-1">
                                {formatElapsed(elapsedSecs)} elapsed · checking every 4s
                            </p>
                        )}
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 max-w-sm">
                        {searchQueries.map(q => (
                            <span key={q} className="px-3 py-1 bg-white/5 border border-white/8 rounded-full text-xs text-gray-400">{q}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Succeeded ── */}
            {scrapeStatus === 'succeeded' && (
                <div className="bg-[#0c0c0e] border border-white/8 rounded-2xl overflow-hidden">
                    <div className="h-[3px] bg-emerald-500" />
                    <div className="px-6 py-5">

                        {/* Summary row */}
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="text-emerald-400" size={20} />
                                <div>
                                    <p className="text-white font-bold">{results.length} businesses found</p>
                                    <p className="text-gray-500 text-xs">Completed in {formatElapsed(elapsedSecs)}</p>
                                </div>
                            </div>

                            {!importDone ? (
                                <button
                                    onClick={handleImport}
                                    disabled={isImporting}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#CD3D35] hover:bg-[#B83530] text-white font-bold rounded-xl transition-all text-sm disabled:opacity-60 active:scale-[0.98]"
                                >
                                    {isImporting
                                        ? <><Loader2 size={14} className="animate-spin" /> Importing…</>
                                        : <><Download size={14} /> Import {results.length} Leads</>
                                    }
                                </button>
                            ) : (
                                <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-semibold">
                                    <CheckCircle size={15} /> {importedCount} leads imported
                                </span>
                            )}
                        </div>

                        {/* ICP scoring section */}
                        {!importDone && (
                            <div className="mb-4 p-3 bg-white/[0.02] border border-white/8 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-white">Score leads with AI</p>
                                        <p className="text-[10px] text-gray-500 mt-0.5">
                                            {icpScores.length > 0
                                                ? `Scored ${icpScores.length} leads. High ICP first in import.`
                                                : 'Claude rates each lead 1-10 for fit as a web design client.'}
                                        </p>
                                    </div>
                                    {icpScores.length === 0 ? (
                                        <button
                                            onClick={handleScoreLeads}
                                            disabled={isScoring}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 hover:bg-[#8B5CF6]/20 text-[#8B5CF6] text-xs font-bold rounded-xl transition-all disabled:opacity-50"
                                        >
                                            {isScoring
                                                ? <><Loader2 size={12} className="animate-spin" /> Scoring…</>
                                                : <><Zap size={12} /> Score {results.length} Leads</>
                                            }
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <span className="text-green-400 font-bold">{icpScores.filter(s => s >= 8).length}</span> high
                                            <span className="text-yellow-400 font-bold">{icpScores.filter(s => s >= 5 && s < 8).length}</span> mid
                                            <span className="text-red-400 font-bold">{icpScores.filter(s => s < 5).length}</span> low
                                        </div>
                                    )}
                                </div>
                                {scoringError && (
                                    <p className="text-red-400 text-[10px] mt-2">{scoringError}</p>
                                )}
                            </div>
                        )}

                        {/* Results preview */}
                        <div className="space-y-2 max-h-96 overflow-y-auto crm-scroll">
                            {results.slice(0, 25).map((place, i) => {
                                const score = icpScores[i];
                                const colors = score !== undefined ? getIcpColor(score) : null;
                                return (
                                    <div
                                        key={i}
                                        className="flex items-start gap-3 px-4 py-3 bg-white/[0.02] border border-white/6 rounded-xl"
                                    >
                                        <div className="w-7 h-7 rounded-lg bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center shrink-0 mt-0.5">
                                            <MapPin size={12} className="text-[#f97316]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-semibold truncate">{place.title || '—'}</p>
                                            <p className="text-gray-500 text-xs truncate">{place.address || '—'}</p>
                                            {place.categoryName && (
                                                <p className="text-gray-600 text-[10px] mt-0.5">{place.categoryName}</p>
                                            )}
                                        </div>
                                        <div className="text-right shrink-0 flex flex-col items-end gap-1">
                                            {score !== undefined && colors && (
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${colors.bg} ${colors.text}`}>
                                                    ICP {score}/10
                                                </span>
                                            )}
                                            <p className="text-gray-400 text-xs font-mono">
                                                {place.phoneUnformatted || place.phone || '—'}
                                            </p>
                                            {place.totalScore != null && (
                                                <p className="flex items-center gap-0.5 justify-end text-yellow-500 text-[10px]">
                                                    <Star size={9} fill="currentColor" /> {place.totalScore}
                                                    {place.reviewsCount != null && (
                                                        <span className="text-gray-600 ml-0.5">({place.reviewsCount})</span>
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {results.length > 25 && (
                                <p className="text-center text-xs text-gray-600 py-2">
                                    +{results.length - 25} more will be included in the import
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Failed ── */}
            {scrapeStatus === 'failed' && (
                <div className="bg-[#0c0c0e] border border-red-500/20 rounded-2xl p-10 flex flex-col items-center gap-4 text-center">
                    <AlertCircle className="text-red-400" size={36} />
                    <div>
                        <p className="text-white font-semibold">Scrape failed</p>
                        <p className="text-gray-500 text-sm mt-1">{error || 'Something went wrong with the Apify run.'}</p>
                    </div>
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/6 border border-white/10 rounded-xl text-sm text-gray-300 hover:text-white transition-all"
                    >
                        <RotateCcw size={14} /> Try Again
                    </button>
                </div>
            )}

        </div>

        {/* ── New Campaign Modal ── */}
        <AnimatePresence>
            {showNewCampaignModal && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => { setShowNewCampaignModal(false); setModalCampaignName(''); }}
                    />

                    {/* Card */}
                    <motion.div
                        className="relative z-10 w-full max-w-md bg-[#0c0c0e] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 12 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Top accent */}
                        <div className="h-[3px] bg-[#CD3D35]" />

                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#CD3D35]/10 border border-[#CD3D35]/20 flex items-center justify-center">
                                        <FolderPlus size={16} className="text-[#CD3D35]" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm">New Campaign</h3>
                                        <p className="text-gray-500 text-xs mt-0.5">Scraped leads will be added here</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setShowNewCampaignModal(false); setModalCampaignName(''); }}
                                    className="text-gray-600 hover:text-white transition-colors p-1"
                                >
                                    <X size={15} />
                                </button>
                            </div>

                            {/* Input */}
                            <div className="mb-5">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                                    Campaign Name
                                </label>
                                <input
                                    type="text"
                                    value={modalCampaignName}
                                    onChange={e => setModalCampaignName(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') confirmNewCampaign(); if (e.key === 'Escape') { setShowNewCampaignModal(false); setModalCampaignName(''); } }}
                                    placeholder="e.g. Toronto Roofers Q3"
                                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CD3D35]/50 focus:ring-1 focus:ring-[#CD3D35]/20 transition-all"
                                    autoFocus
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setShowNewCampaignModal(false); setModalCampaignName(''); }}
                                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmNewCampaign}
                                    disabled={!modalCampaignName.trim() || isCreatingCampaign}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#CD3D35] hover:bg-[#B83530] text-white font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                                >
                                    {isCreatingCampaign
                                        ? <><Loader2 size={14} className="animate-spin" /> Creating…</>
                                        : 'Create Campaign'
                                    }
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
};

export default Scraper;
