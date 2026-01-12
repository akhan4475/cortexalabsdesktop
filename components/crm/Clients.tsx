import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, CheckCircle2, ArrowLeft, Save, Briefcase, User, Calendar, DollarSign, XCircle, Trash2, Edit2, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Client } from './types';

interface ClientsProps {
    clients: Client[];
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

const Clients: React.FC<ClientsProps> = ({ clients, onAddClient, onUpdateClient, onDeleteClient }) => {
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
        status: 'active'
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
                status: status as 'active' | 'inactive'
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
            status: 'active'
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
        return (
            <div className="h-full flex flex-col max-w-2xl mx-auto py-8">
                <button 
                    onClick={() => { setView('list'); resetForm(); }}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group w-fit"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </button>

                <div className="bg-[#18181b] border border-[#262624] rounded-2xl p-8 space-y-8 shadow-2xl overflow-y-auto crm-scroll">
                    <div className="text-center">
                        <div className="w-12 h-12 rounded-xl bg-horizon-accent/10 border border-horizon-accent/20 flex items-center justify-center text-horizon-accent mx-auto mb-4">
                            <Briefcase size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{isEdit ? 'Edit Client Details' : 'Onboard New Client'}</h2>
                        <p className="text-gray-500 text-sm">Managing contractual terms and recurring automated billing.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client Name*</label>
                            <div className="relative">
                                <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input 
                                    type="text"
                                    placeholder="Decision Maker"
                                    value={clientForm.name}
                                    onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                                    className="w-full bg-[#09090b] border border-[#262624] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Company Name*</label>
                            <div className="relative">
                                <Briefcase size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input 
                                    type="text"
                                    placeholder="Business Entity"
                                    value={clientForm.company}
                                    onChange={(e) => setClientForm({ ...clientForm, company: e.target.value })}
                                    className="w-full bg-[#09090b] border border-[#262624] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Close Date (Upfront)*</label>
                            <div className="relative">
                                <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input 
                                    type="date"
                                    value={clientForm.closeDate}
                                    onChange={(e) => setClientForm({ ...clientForm, closeDate: e.target.value })}
                                    className="w-full bg-[#09090b] border border-[#262624] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none font-mono"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upfront Value ($)*</label>
                            <div className="relative">
                                <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input 
                                    type="number"
                                    placeholder="Setup Fee"
                                    value={clientForm.upfrontValue}
                                    onChange={(e) => setClientForm({ ...clientForm, upfrontValue: Number(e.target.value) })}
                                    className="w-full bg-[#09090b] border border-[#262624] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none font-mono"
                                />
                            </div>
                        </div>
                        
                        {/* Monthly Billing Row */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly Retainer ($)</label>
                                <div className="relative">
                                    <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input 
                                        type="number"
                                        placeholder="Recurring"
                                        value={clientForm.monthlyValue || ''}
                                        onChange={(e) => setClientForm({ ...clientForm, monthlyValue: Number(e.target.value) })}
                                        className="w-full bg-[#09090b] border border-[#262624] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none font-mono"
                                    />
                                </div>
                            </div>
                            
                            <div className={`space-y-2 transition-all duration-300 ${clientForm.monthlyValue && clientForm.monthlyValue > 0 && clientForm.status === 'active' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">First Retainer Date</label>
                                <div className="relative">
                                    <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input 
                                        type="date"
                                        value={clientForm.monthlyRetainerDate || ''}
                                        onChange={(e) => setClientForm({ ...clientForm, monthlyRetainerDate: e.target.value })}
                                        className="w-full bg-[#09090b] border border-[#262624] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none font-mono"
                                    />
                                </div>
                                <p className="text-[9px] text-gray-500 italic mt-1">
                                    {clientForm.status === 'inactive' ? 'Date voided for inactive clients.' : 'Date for recurring billing cycles.'}
                                </p>
                            </div>
                        </div>

                        {/* Status Toggle Row */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Partnership Status</label>
                            <div className="flex bg-[#09090b] p-1 rounded-xl border border-[#262624]">
                                <button 
                                    onClick={() => setClientForm({ ...clientForm, status: 'active' })}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${clientForm.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    <CheckCircle2 size={16} /> Active
                                </button>
                                <button 
                                    onClick={() => setClientForm({ ...clientForm, status: 'inactive' })}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${clientForm.status === 'inactive' ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    <XCircle size={16} /> Inactive
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button 
                            onClick={() => { setView('list'); resetForm(); }}
                            className="flex-1 bg-transparent border border-[#262624] text-white py-3 rounded-xl font-bold hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSaveClient}
                            className="flex-1 bg-horizon-accent text-black py-3 rounded-xl font-bold hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-horizon-accent/10"
                        >
                            <Save size={18} /> {isEdit ? 'Save Changes' : 'Onboard Client'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative h-full flex flex-col">
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white">Client Portfolio</h2>
                    <p className="text-gray-500 text-sm">Managing high-performance partnerships and MRR streams.</p>
                </div>
                <button 
                    onClick={() => {
                        resetForm();
                        setView('add');
                    }}
                    className="flex items-center gap-2 bg-horizon-accent text-black px-4 py-2 rounded-lg font-bold hover:bg-white transition-colors"
                >
                    <Plus size={18} /> Add Client
                </button>
            </div>

            <div className="bg-[#18181b] border border-[#262624] rounded-xl overflow-hidden flex flex-col flex-1 min-h-0">
                <div className="grid grid-cols-7 gap-4 p-4 border-b border-[#262624] bg-[#262624]/30 text-xs font-bold text-gray-500 uppercase tracking-widest shrink-0">
                    <div className="col-span-2">Client / Company</div>
                    <div className="col-span-1">Close Date</div>
                    <div className="col-span-1">Upfront</div>
                    <div className="col-span-1">Monthly</div>
                    <div className="col-span-1">Retainer Start</div>
                    <div className="col-span-1 text-right">Status</div>
                </div>

                <div className="divide-y divide-[#262624] overflow-y-auto crm-scroll flex-1">
                    {clients.map((client) => (
                        <div key={client.id} className="grid grid-cols-7 gap-4 p-4 items-center hover:bg-[#262624]/30 transition-colors group relative">
                            <div className="col-span-2">
                                <div className="font-bold text-white text-sm">{client.company}</div>
                                <div className="text-[10px] text-gray-500 uppercase font-medium">{client.name}</div>
                            </div>
                            <div className="col-span-1 text-xs text-gray-400 font-mono">{client.closeDate}</div>
                            <div className="col-span-1 text-xs text-white font-mono">${client.upfrontValue.toLocaleString()}</div>
                            <div className="col-span-1 text-xs text-white font-mono">
                                {client.monthlyValue > 0 ? `$${client.monthlyValue.toLocaleString()}` : '—'}
                            </div>
                            <div className="col-span-1 text-xs text-gray-500 font-mono">
                                {client.monthlyRetainerDate || (client.status === 'inactive' ? <span className="italic">Voided</span> : 'N/A')}
                            </div>
                            <div className="col-span-1 flex justify-end items-center gap-4">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                                    client.status === 'active' 
                                    ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}>
                                    {client.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                                
                                <div className="relative">
                                    <button 
                                        onClick={() => setMenuOpenId(menuOpenId === client.id ? null : client.id)}
                                        className="text-gray-500 hover:text-white p-1.5 hover:bg-[#333] rounded-lg transition-colors"
                                    >
                                        <MoreHorizontal size={16} />
                                    </button>
                                    
                                    <AnimatePresence>
                                        {menuOpenId === client.id && (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                className="absolute right-0 top-full mt-2 w-32 bg-[#121214] border border-[#262624] rounded-xl shadow-2xl z-30 overflow-hidden"
                                            >
                                                <button 
                                                    onClick={() => handleEditClick(client)}
                                                    className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-300 hover:bg-white/5 flex items-center gap-3 transition-colors"
                                                >
                                                    <Edit2 size={14} className="text-blue-400" /> Edit
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setConfirmDeleteId(client.id);
                                                        setMenuOpenId(null);
                                                    }}
                                                    className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-colors border-t border-[#262624]"
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    ))}
                    {clients.length === 0 && (
                        <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-700">
                                <Briefcase size={32} />
                            </div>
                            <p className="text-gray-500 text-sm italic">No records in the active portfolio.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Click outside menu overlay */}
            {menuOpenId && (
                <div 
                    className="fixed inset-0 z-20 bg-transparent" 
                    onClick={() => setMenuOpenId(null)}
                />
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {confirmDeleteId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#121214] border border-red-500/30 rounded-2xl p-8 w-full max-w-md shadow-2xl relative"
                        >
                            <button 
                                onClick={() => setConfirmDeleteId(null)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                            
                            <div className="flex items-center gap-4 text-red-500 mb-6">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                                    <AlertTriangle size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Offboard Client?</h3>
                            </div>
                            
                            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                                You are about to permanently remove <span className="text-white font-bold">{clients.find(c => c.id === confirmDeleteId)?.company}</span>. This will stop all revenue tracking and void their record in the CRM history.
                            </p>
                            
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="flex-1 px-4 py-3 border border-[#262624] text-gray-400 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleDeleteConfirm}
                                    className="flex-1 px-4 py-3 bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                                >
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