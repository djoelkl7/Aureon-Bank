
import React, { useState } from 'react';
import { X, ExternalLink, ShieldCheck, Bitcoin, ArrowRightCircle, Calendar, Repeat } from 'lucide-react';
import { Transaction, RecurringPayment } from '../types';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass w-full max-w-md rounded-2xl overflow-hidden animate-scale-in">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-xl font-bold gold-text">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export const TransactionDetailModal: React.FC<{ isOpen: boolean; onClose: () => void; transaction: Transaction | null }> = ({ isOpen, onClose, transaction }) => {
  if (!transaction) return null;

  return (
    <Modal title="Transaction Ledger Details" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Total Amount</p>
          <p className={`text-4xl font-bold ${transaction.type === 'CREDIT' ? 'emerald-text' : 'text-white'}`}>
            {transaction.type === 'CREDIT' ? '+' : '-'}${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Status</p>
            <p className="text-emerald-400 font-bold flex items-center space-x-1">
              <ShieldCheck size={14} />
              <span>Settled</span>
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Type</p>
            <p className="text-white/80 font-bold uppercase text-xs tracking-wider">{transaction.type} Ledger</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-[#0B1C2D]/50 rounded-xl border border-white/5 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/30 uppercase tracking-widest">Source Entity</span>
              <span className="text-white/80 font-medium">{transaction.from || 'Internal Liquidity Pool'}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/30 uppercase tracking-widest">Destination</span>
              <span className="text-white/80 font-medium">{transaction.to || 'Primary Premium Account'}</span>
            </div>
          </div>

          <div className="space-y-3 px-1">
            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
              <span className="text-white/40">Timestamp</span>
              <span className="text-white/80">{transaction.date}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
              <span className="text-white/40">Category</span>
              <span className="text-white/80 font-medium">{transaction.category}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
              <span className="text-white/40">Reference</span>
              <span className="text-white/80 font-mono text-[10px]">{transaction.id}</span>
            </div>
            <div className="pt-2">
              <span className="text-white/40 text-sm block mb-1 font-bold uppercase tracking-tighter">Authorized Narrative</span>
              <span className="text-white/80 text-sm italic leading-relaxed">"{transaction.description}"</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => window.print()}
          className="w-full flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-all border border-white/5 group"
        >
          <ExternalLink size={18} className="group-hover:scale-110 transition-transform" />
          <span>Export Official Receipt</span>
        </button>
      </div>
    </Modal>
  );
};

export const RecurringPaymentModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: Omit<RecurringPayment, 'id' | 'occurences' | 'status' | 'nextDate'>) => void }> = ({ isOpen, onClose, onSubmit }) => {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [freq, setFreq] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('MONTHLY');
  const [duration, setDuration] = useState('12');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      description: desc,
      amount: parseFloat(amount),
      frequency: freq,
      duration: parseInt(duration)
    });
    onClose();
    setDesc(''); setAmount(''); setFreq('MONTHLY'); setDuration('12');
  };

  return (
    <Modal title="Establish Recurring Mandate" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl mb-2">
          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
            <Repeat size={12} /> <span>Automated Liquidity</span>
          </p>
          <p className="text-xs text-white/50">Scheduled transactions are executed at 00:00 UTC on the effective date.</p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Narrative / Beneficiary</label>
          <input 
            type="text" required value={desc} onChange={e => setDesc(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-gold-bg outline-none transition-all"
            placeholder="e.g., Premium Office Lease"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Amount ($)</label>
            <input 
              type="number" required value={amount} onChange={e => setAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-gold-bg outline-none transition-all"
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Frequency</label>
            <select 
              value={freq} onChange={e => setFreq(e.target.value as any)}
              className="w-full bg-[#0B1C2D] border border-white/10 rounded-xl p-3 focus:border-gold-bg outline-none transition-all text-sm"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Duration (Cycles)</label>
          <input 
            type="number" required value={duration} onChange={e => setDuration(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-gold-bg outline-none transition-all"
            placeholder="12"
          />
        </div>

        <button type="submit" className="w-full gold-bg text-[#0B1C2D] font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 mt-4 shadow-lg shadow-gold-bg/10">
          <Calendar size={18} />
          <span>Authorize Recurring Mandate</span>
        </button>
      </form>
    </Modal>
  );
};

export const PremiumUpgradeModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <Modal title="Premium Tier Verification" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6 text-center">
        <div className="w-20 h-20 gold-bg/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-gold-bg/20 animate-pulse">
          <Bitcoin size={40} className="gold-text" />
        </div>
        
        <div>
          <h4 className="text-xl font-bold mb-3">Upgrade Required</h4>
          <p className="text-white/70 text-sm leading-relaxed">
            To unlock <span className="gold-text font-bold">Premium Level 2</span> clearance and achieve a <span className="emerald-text font-bold">300% increase</span> in daily fund limits, a one-time liquidity verification is required.
          </p>
        </div>

        <div className="bg-[#0B1C2D] border border-gold-bg/30 p-6 rounded-2xl space-y-4">
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-bold text-left">Verification Amount</p>
            <p className="text-3xl font-bold gold-text text-left">$1,500.00</p>
          </div>
          
          <div className="pt-4 border-t border-white/5 text-left">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-bold">Direct BTC Wallet Instruction</p>
            <div className="bg-black/40 p-4 rounded-xl font-mono text-[11px] text-emerald-400 break-all select-all flex items-center justify-between border border-emerald-500/20 shadow-inner">
              <span className="mr-2">bc1qxy2kgdy6jr7pvyv2m7p66tc2w9xd3633mcl32r</span>
              <Bitcoin size={16} className="text-gold-text flex-shrink-0" />
            </div>
            <p className="text-[9px] text-white/30 mt-3 italic leading-relaxed">
              Verification is automated after 2 network confirmations. Funds will be credited back to your balance upon completion.
            </p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full gold-bg text-[#0B1C2D] font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
        >
          <span>Acknowledge & Continue</span>
          <ArrowRightCircle size={20} />
        </button>
      </div>
    </Modal>
  );
};

export const TransferModal: React.FC<{ isOpen: boolean; onClose: () => void; onTransfer: (data: { to: string; amount: number; description: string }) => void }> = ({ isOpen, onClose, onTransfer }) => {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTransfer({ to, amount: parseFloat(amount), description: desc });
    onClose();
    setTo(''); setAmount(''); setDesc('');
  };

  return (
    <Modal title="Secure Transfer" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Beneficiary Account / Identity</label>
          <input 
            type="text" required value={to} onChange={e => setTo(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-gold-bg outline-none transition-all placeholder:text-white/10"
            placeholder="Aureon Account ID or Email"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Amount ($)</label>
          <input 
            type="number" required value={amount} onChange={e => setAmount(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-gold-bg outline-none transition-all h-14 text-xl font-bold font-mono"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Description / Narrative</label>
          <input 
            type="text" value={desc} onChange={e => setDesc(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-gold-bg outline-none transition-all"
            placeholder="Note for transfer record"
          />
        </div>
        <button type="submit" className="w-full gold-bg text-[#0B1C2D] font-bold py-4 rounded-xl hover:opacity-90 transition-opacity mt-4 flex items-center justify-center space-x-2 shadow-lg shadow-gold-bg/20">
          <span>Confirm Transfer</span>
          <ExternalLink size={18} />
        </button>
      </form>
    </Modal>
  );
};

export const LoanModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: { amount: number; term: number }) => void }> = ({ isOpen, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('50000');
  const [term, setTerm] = useState('24');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ amount: parseFloat(amount), term: parseInt(term) });
    onClose();
  };

  return (
    <Modal title="Premium Credit Application" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">Requested Amount ($)</label>
          <input 
            type="number" required value={amount} onChange={e => setAmount(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-gold-bg outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Term (Months)</label>
          <select 
            value={term} onChange={e => setTerm(e.target.value)}
            className="w-full bg-[#0B1C2D] border border-white/10 rounded-lg p-3 focus:border-gold-bg outline-none"
          >
            <option value="12">12 Months (Fixed 3.5%)</option>
            <option value="24">24 Months (Fixed 4.2%)</option>
            <option value="48">48 Months (Fixed 5.1%)</option>
          </select>
        </div>
        <div className="p-4 bg-gold-bg/10 rounded-lg">
          <p className="text-xs text-gold-text">Estimated Monthly Payment</p>
          <p className="text-xl font-bold gold-text">${(parseFloat(amount) / parseInt(term) * 1.05).toFixed(2)}</p>
        </div>
        <button type="submit" className="w-full gold-bg text-[#0B1C2D] font-bold py-3 rounded-xl hover:opacity-90 transition-opacity mt-4">
          Submit Application
        </button>
      </form>
    </Modal>
  );
};
