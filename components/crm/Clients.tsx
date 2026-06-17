import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, CheckCircle2, ArrowLeft, Save, Briefcase, User, Calendar, DollarSign, XCircle, Trash2, Edit2, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Client, Lead } from './types';

interface ClientsProps {
    clients: Client[];
    allLeads: Lead[];
    onAddClient: (client: Client) => void;
    onUpdateClient: (client: Client) => void;
    onDeleteClient: (clientId: string) => void;
}

/**
 * Local Date Formatter Helper
 */
const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const Clients: React.FC<ClientsProps> = ({ clients, allLeads, onAddClient, onUpdateClient, onDeleteClient }) => {
    const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [clientForm, setClientForm] = useState<Partial<Client>>({
        name: '',
        company: '',
        closeDate: formatLocalDate(new Date()),
        upfrontValue: 0,
        monthlyValue: 0,
        monthlyRetainerDate: '',
        status: 'active',
        leadId: '',
    });

    // Automatically suggest retainer date if not set (1 month after close)
    useEffect(() => {
        if ((view === 'add' || view === 'edit') && clientForm.closeDate && !clientForm.monthlyRetainerDate && clientForm.status === 'active') {
            const d = new Date(clientForm.closeDate + 'T00:00:00');
            d.setMonth(d.getMonth() + 1);
            setClientForm(prev => ({ ...prev, monthlyRetainerDate: formatLocalDate(d) }));
        }
    }, [clientForm.closeDate, clientForm.status, view]);

    const handleSaveClient = () => {
        const name = clientForm.name?.trim();
        const company = clientForm.company?.trim();
        const closeDate = clientForm.closeDate?.trim();
        const upfrontValue = clientForm.upfrontValue ?? 0;
        const monthlyValue = clientForm.monthlyValue ?? 0;
        const status = clientForm.status || 'active';
        
        // VOID logic: If inactive, retainer date is undefined
        const retainerDate = status === 'inactive' ? undefined : clientForm.monthlyRetainerDate;

        if (!name || !company || !closeDate) {
            alert('Please fill out all required fields marked with *');
            return;
        }

        if (status === 'active' && monthlyValue > 0 && !retainerDate) {
            alert('Please provide a First Retainer Date for active subscriptions.');
            return;
        }

        if (view === 'add') {
            const client: Client = {
                id: `c-${Date.now()}`,
                name,
                company,
                closeDate,
                upfrontValue: Number(upfrontValue),
                monthlyValue: Number(monthlyValue),
                monthlyRetainerDate: retainerDate,
                status: status as 'active' | 'inactive',
                leadId: clientForm.leadId || undefined,
            };
            onAddClient(client);
        } else if (view === 'edit') {
            onUpdateClient({
                ...(clientForm as Client),
                monthlyRetainerDate: retainerDate,
                status: status as 'active' | 'inactive'
            });
        }

        resetForm();
        setView('list');
    };

    const resetForm = () => {
        setClientForm({
            name: '',
            company: '',
            closeDate: formatLocalDate(new Date()),
            upfrontValue: 0,
            monthlyValue: 0,
            monthlyRetainerDate: '',
            status: 'active',
            leadId: '',
        });
    };

    const handleEditClick = (client: Client) => {
        setClientForm(client);
        setView('edit');
        setMenuOpenId(null);
    };

    const handleDeleteConfirm = () => {
        if (confirmDeleteId) {
            onDeleteClient(confirmDeleteId);
            setConfirmDeleteId(null);
        }
    };

    if (view === 'add' || view === 'edit') {
        const isEdit = view === 'edit';
        const inputCls = "w-full bg-white/[0.04] border border-white/8 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#CD3D35]/50 focus:outline-none focus:ring-1 focus:ring-[#CD3D35]/15 transition-all";
        return (
            <div className="h-full flex flex-col max-w-2xl mx-auto py-6">
                <button
                    onClick={() => { setView('list'); resetForm(); }}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 group w-fit text-sm"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </button>

                <div className="bg-[#0c0c0e] border border-white/8 rounded-2xl overflow-hidden shadow-2xl flex flex-col flex-1 min-h-0">
                    {/* Top accent */}
                    <div className="h-[3px] bg-[#CD3D35] shrink-0" />
                    <div className="p-7 space-y-6 overflow-y-auto crm-scroll flex-1">
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-[#CD3D35]/10 border border-[#CD3D35]/20 flex items-center justify-center text-[#CD3D35] shrink-0">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">{isEdit ? 'Edit Client Details' : 'Onboard New Client'}</h2>
                                <p className="text-gray-500 text-xs mt-0.5">Managing contractual terms and recurring billing.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Client Name *</label>
                                <div className="relative">
                                    <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input type="text" placeholder="Decision Maker" value={clientForm.name}
                                        onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                                        className={inputCls} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Company Name *</label>
                                <div className="relative">
                                    <Briefcase size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input type="text" placeholder="Business Entity" value={clientForm.company}
                                        onChange={(e) => setClientForm({ ...clientForm, company: e.target.value })}
                                        className={inputCls} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Close Date *</label>
                                <div className="relative">
                                    <Calendar size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input type="date" value={clientForm.closeDate}
                                        onChange={(e) => setClientForm({ ...clientForm, closeDate: e.target.value })}
                                        className={`${inputCls} font-mono`} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Upfront Value ($) *</label>
                                <div className="relative">
                                    <DollarSign size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input type="number" placeholder="Setup Fee" value={clientForm.upfrontValue}
                                        onChange={(e) => setClientForm({ ...clientForm, upfrontValue: Number(e.target.value) })}
                                        className={`${inputCls} font-mono`} />
                                </div>
                            </div>

                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Monthly Retainer ($)</label>
                                    <div className="relative">
                                        <DollarSign size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input type="number" placeholder="Recurring" value={clientForm.monthlyValue || ''}
                                            onChange={(e) => setClientForm({ ...clientForm, monthlyValue: Number(e.target.value) })}
                                            className={`${inputCls} font-mono`} />
                                    </div>
                                </div>
                                <div className={`space-y-1.5 transition-all duration-300 ${clientForm.monthlyValue && clientForm.monthlyValue > 0 && clientForm.status === 'active' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">First Retainer Date</label>
                                    <div className="relative">
                                        <Calendar size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input type="date" value={clientForm.monthlyRetainerDate || ''}
                                            onChange={(e) => setClientForm({ ...clientForm, monthlyRetainerDate: e.target.value })}
                                            className={`${inputCls} font-mono`} />
                                    </div>
                                    <p className="text-[9px] text-gray-600 italic">
                                        {clientForm.status === 'inactive' ? 'Voided for inactive clients.' : 'Date for recurring billing cycles.'}
                                    </p>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Linked Lead <span className="normal-case font-normal text-gray-600">(auto-moves to Paid in pipeline)</span></label>
                                <div className="relative">
                                    <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <select
                                        value={clientForm.leadId || ''}
                                        onChange={(e) => setClientForm({ ...clientForm, leadId: e.target.value || undefined })}
                                        className={inputCls}
                                    >
                                        <option value="">-- No lead linked --</option>
                                        {allLeads.map(l => (
                                            <option key={l.id} value={l.id}>{l.name}{l.company ? ` · ${l.company}` : ''}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Partnership Status</label>
                                <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/8 gap-1">
                                    <button
                                        onClick={() => setClientForm({ ...clientForm, status: 'active' })}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${clientForm.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        <CheckCircle2 size={15} /> Active
                                    </button>
                                    <button
                                        onClick={() => setClientForm({ ...clientForm, status: 'inactive' })}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${clientForm.status === 'inactive' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        <XCircle size={15} /> Inactive
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => { setView('list'); resetForm(); }}
                                className="flex-1 bg-transparent border border-white/10 text-gray-400 hover:text-white py-2.5 rounded-xl font-bold hover:border-white/20 transition-all text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveClient}
                                className="flex-1 bg-[#CD3D35] hover:bg-[#B83530] text-white py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#CD3D35]/15 text-sm active:scale-[0.98]"
                            >
                                <Save size={15} /> {isEdit ? 'Save Changes' : 'Onboard Client'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5 relative h-full flex flex-col">
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-white">Client Portfolio</h2>
                    <p className="text-gray-500 text-sm mt-0.5">Managing high-performance partnerships and MRR streams.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setView('add'); }}
                    className="flex items-center gap-2 bg-[#CD3D35] hover:bg-[#B83530] text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-[#CD3D35]/15 active:scale-[0.98] text-sm"
                >
                    <Plus size={16} /> Add Client
                </button>
            </div>

            <div className="bg-[#0c0c0e] border border-white/8 rounded-2xl overflow-hidden flex flex-col flex-1 min-h-0">
                {/* Table header */}
                <div className="grid grid-cols-7 gap-4 px-5 py-3 border-b border-white/8 bg-white/[0.02] text-[9px] font-bold text-gray-500 uppercase tracking-widest shrink-0">
                    <div className="col-span-2">Client / Company</div>
                    <div className="col-span-1">Close Date</div>
                    <div className="col-span-1">Upfront</div>
                    <div className="col-span-1">Monthly</div>
                    <div className="col-span-1">Retainer Start</div>
                    <div className="col-span-1 text-right">Status</div>
                </div>

                <div className="divide-y divide-white/[0.04] overflow-y-auto crm-scroll flex-1">
                    {clients.map((client) => (
                        <div key={client.id} className="grid grid-cols-7 gap-4 px-5 py-4 items-center hover:bg-white/[0.02] transition-colors group relative">
                            <div className="col-span-2">
                                <div className="font-bold text-white text-sm">{client.company}</div>
                                <div className="text-[10px] text-gray-500 mt-0.5">{client.name}</div>
                            </div>
                            <div className="col-span-1 text-xs text-gray-400 font-mono">{client.closeDate}</div>
                            <div className="col-span-1 text-xs text-white font-mono font-semibold">${client.upfrontValue.toLocaleString()}</div>
                            <div className="col-span-1 text-xs text-white font-mono font-semibold">
                                {client.monthlyValue > 0 ? `$${client.monthlyValue.toLocaleString()}` : <span className="text-gray-600">—</span>}
                            </div>
                            <div className="col-span-1 text-xs text-gray-500 font-mono">
                                {client.monthlyRetainerDate || (client.status === 'inactive' ? <span className="italic text-gray-600">Voided</span> : <span className="text-gray-600">N/A</span>)}
                            </div>
                            <div className="col-span-1 flex justify-end items-center gap-3">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                                    client.status === 'active'
                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}>
                                    {client.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                                <div className="relative">
                                    <button
                                        onClick={() => setMenuOpenId(menuOpenId === client.id ? null : client.id)}
                                        className="text-gray-600 hover:text-white p-1.5 hover:bg-white/8 rounded-lg transition-colors"
                                    >
                                        <MoreHorizontal size={15} />
                                    </button>
                                    <AnimatePresence>
                                        {menuOpenId === client.id && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                                                className="absolute right-0 top-full mt-1.5 w-32 bg-[#0c0c0e] border border-white/10 rounded-xl shadow-2xl shadow-black/60 z-30 overflow-hidden"
                                            >
                                                <button onClick={() => handleEditClick(client)}
                                                    className="w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-300 hover:bg-white/5 flex items-center gap-3 transition-colors">
                                                    <Edit2 size={13} className="text-blue-400" /> Edit
                                                </button>
                                                <button onClick={() => { setConfirmDeleteId(client.id); setMenuOpenId(null); }}
                                                    className="w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-colors border-t border-white/8">
                                                    <Trash2 size={13} /> Delete
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    ))}
                    {clients.length === 0 && (
                        <div className="py-24 text-center flex flex-col items-center justify-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center text-gray-700">
                                <Briefcase size={26} />
                            </div>
                            <p className="text-gray-600 text-sm">No clients in the portfolio yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {menuOpenId && <div className="fixed inset-0 z-20 bg-transparent" onClick={() => setMenuOpenId(null)} />}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {confirmDeleteId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                            className="bg-[#0c0c0e] border border-red-500/25 rounded-2xl p-7 w-full max-w-md shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-red-500" />
                            <button onClick={() => setConfirmDeleteId(null)} className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                            <div className="flex items-center gap-3.5 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                                    <AlertTriangle size={18} className="text-red-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white">Offboard Client?</h3>
                            </div>
                            <p className="text-gray-400 mb-7 text-sm leading-relaxed">
                                Permanently removing <span className="text-white font-bold">{clients.find(c => c.id === confirmDeleteId)?.company}</span> will stop all revenue tracking and void their record.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setConfirmDeleteId(null)}
                                    className="flex-1 px-4 py-2.5 border border-white/10 text-gray-400 text-sm font-bold rounded-xl hover:bg-white/5 hover:text-white transition-all">
                                    Cancel
                                </button>
                                <button onClick={handleDeleteConfirm}
                                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-red-600/20 active:scale-[0.98]">
                                    Delete Record
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Clients;