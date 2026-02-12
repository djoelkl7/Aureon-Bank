
import React, { useState } from 'react';
import { X } from 'lucide-react';

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
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
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
          <label className="block text-sm text-white/60 mb-1">Beneficiary Account / Email</label>
          <input 
            type="text" required value={to} onChange={e => setTo(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-gold-bg outline-none"
            placeholder="Aureon Account ID"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Amount ($)</label>
          <input 
            type="number" required value={amount} onChange={e => setAmount(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-gold-bg outline-none"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Description</label>
          <input 
            type="text" value={desc} onChange={e => setDesc(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-gold-bg outline-none"
            placeholder="Note for transfer"
          />
        </div>
        <button type="submit" className="w-full gold-bg text-[#0B1C2D] font-bold py-3 rounded-xl hover:opacity-90 transition-opacity mt-4">
          Confirm Transfer
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
