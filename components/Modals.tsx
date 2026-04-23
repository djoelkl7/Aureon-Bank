
import React, { useState } from 'react';
import { X, ExternalLink, ShieldCheck, Bitcoin, ArrowRightCircle, Calendar, Repeat, Eye, EyeOff, BarChart3, Fingerprint, DollarSign, LayoutDashboard, TrendingUp, PieChart, Upload, UserPlus, Mail, Fingerprint as IDIcon, Globe, User as UserIcon, BadgeCheck, FileText } from 'lucide-react';
import { Transaction, RecurringPayment, UserSettings, User, UserRole, UserStatus } from '../types';

export const UserProfileDetailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}> = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  return (
    <Modal title="Identity Profile Dossier" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="flex items-center space-x-6 p-6 bg-white/5 rounded-3xl border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <UserIcon size={120} />
          </div>
          <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden shadow-2xl">
            {user.passportUrl ? (
              <img src={user.passportUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold gold-text opacity-40">{user.name.charAt(0)}</span>
            )}
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-bold tracking-tight">{user.name}</h3>
              {user.status === UserStatus.ACTIVE && <BadgeCheck size={20} className="text-emerald-400" />}
            </div>
            <p className="text-emerald-400/60 font-mono text-xs tracking-[0.2em] uppercase">@{user.username}</p>
            <div className="mt-3 flex gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest ${user.role === UserRole.ADMIN ? 'gold-bg text-[#0B1C2D]' : 'bg-white/10 text-white/60 uppercase'}`}>
                {user.role}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase ${user.status === UserStatus.ACTIVE ? 'bg-emerald-500/10 emerald-text' : 'bg-red-500/10 text-red-400'}`}>
                {user.status}
              </span>
            </div>
          </div>
        </div>

        {/* Identity Details */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
            <IDIcon size={12} className="gold-text" /> <span>Credential Authentication</span>
          </h4>
          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="flex items-center gap-2 text-white/40">
                  <Mail size={14} />
                  <span className="text-[10px] uppercase font-bold tracking-widest">Digital Registry</span>
                </div>
                <span className="text-sm font-medium">{user.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="flex items-center gap-2 text-white/40">
                  <IDIcon size={14} />
                  <span className="text-[10px] uppercase font-bold tracking-widest">Passport Number</span>
                </div>
                <span className="text-sm font-mono gold-text font-bold uppercase tracking-widest">{user.idNumber || 'KYC_UNVERIFIED'}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-white/40">
                  <FileText size={14} />
                  <span className="text-[10px] uppercase font-bold tracking-widest">Liquid Assets</span>
                </div>
                <span className="text-lg font-bold tracking-tighter">${user.balance.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Passport / Identification Visual */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
            <Globe size={12} className="gold-text" /> <span>Primary Identity Document</span>
          </h4>
          <div className="aspect-[16/10] bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative group">
            {user.passportUrl ? (
              <img src={user.passportUrl} alt="Passport Scan" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-2 opacity-20">
                <Upload size={32} />
                <p className="text-xs font-bold uppercase tracking-widest">Verification Pending</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D]/80 to-transparent p-4 flex flex-col justify-end">
              <p className="text-[10px] gold-text font-bold uppercase tracking-widest">Government Issued Clearance</p>
              <p className="text-[8px] text-white/40 font-mono tracking-tighter">REF: {user.id || 'SYS-ID-PENDING'}</p>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full gold-bg text-[#0B1C2D] font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 mt-4 shadow-lg shadow-gold-bg/20"
        >
          <ShieldCheck size={18} />
          <span>Authorize Clearance</span>
        </button>
      </div>
    </Modal>
  );
};

export const UserManagementModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (user: User) => void;
  initialUser?: User | null;
}> = ({ isOpen, onClose, onSubmit, initialUser }) => {
  const [formData, setFormData] = useState<Partial<User>>(initialUser || {
    username: '',
    name: '',
    email: '',
    role: UserRole.PERSONAL,
    status: UserStatus.ACTIVE,
    balance: 0,
    idNumber: '',
    passportUrl: ''
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, passportUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: initialUser?.id || `usr-${Date.now()}`,
      username: formData.username!,
      name: formData.name!,
      role: formData.role!,
      status: formData.status!,
      balance: formData.balance || 0,
      transactions: initialUser?.transactions || [],
      loans: initialUser?.loans || [],
      recurringPayments: initialUser?.recurringPayments || [],
      failedLoginAttempts: initialUser?.failedLoginAttempts || 0,
      email: formData.email,
      idNumber: formData.idNumber,
      passportUrl: formData.passportUrl,
      settings: initialUser?.settings || {
        hideBalance: false,
        analyticsFocus: 'GROWTH',
        transferLimit: 10000,
        biometricLogin: true
      }
    };
    onSubmit(newUser);
    onClose();
  };

  return (
    <Modal title={initialUser ? 'Modify Digital Identity' : 'Provision New Identity'} isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Passport Upload Area */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Passport / ID Deposit</label>
          <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center space-y-3 cursor-pointer overflow-hidden ${formData.passportUrl ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:border-gold-bg/30 bg-white/5'}`}>
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              accept="image/*"
              onChange={handleFileUpload}
            />
            {formData.passportUrl ? (
              <img src={formData.passportUrl} alt="Passport Scan" className="w-full h-32 object-cover rounded-xl" />
            ) : (
              <>
                <div className="p-3 bg-white/5 rounded-full text-gold-bg"><Upload size={24} /></div>
                <div className="text-center">
                  <p className="text-xs font-bold">Secure Document Scan</p>
                  <p className="text-[10px] text-white/30">Drag & drop or browse for passport file</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Full Legal Name</label>
            <div className="relative">
              <input 
                type="text" required 
                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 focus:border-gold-bg outline-none transition-all text-xs"
                placeholder="John Q. Client"
              />
              <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Username</label>
            <div className="relative">
              <input 
                type="text" required 
                value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 focus:border-gold-bg outline-none transition-all text-xs"
                placeholder="premium_user"
              />
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Email Address</label>
          <div className="relative">
            <input 
              type="email" required 
              value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 focus:border-gold-bg outline-none transition-all text-xs"
              placeholder="client@quantum.tech"
            />
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Account Role</label>
            <select 
              value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="w-full bg-[#0B1C2D] border border-white/10 rounded-xl p-3 focus:border-gold-bg outline-none transition-all text-xs"
            >
              <option value={UserRole.PERSONAL}>Personal</option>
              <option value={UserRole.BUSINESS}>Business</option>
              <option value={UserRole.ADMIN}>Super Admin</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Provision Balance ($)</label>
            <input 
              type="number" 
              value={formData.balance} onChange={e => setFormData({ ...formData, balance: parseFloat(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-gold-bg outline-none transition-all text-xs"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Passport / ID Number</label>
          <div className="relative">
            <input 
              type="text" 
              value={formData.idNumber} onChange={e => setFormData({ ...formData, idNumber: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 focus:border-gold-bg outline-none transition-all text-xs"
              placeholder="A-9988776655"
            />
            <IDIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full gold-bg text-[#0B1C2D] font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-gold-bg/20"
        >
          <UserPlus size={18} />
          <span>{initialUser ? 'Update Digital Identity' : 'Provision Identity'}</span>
        </button>
      </form>
    </Modal>
  );
};

export const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void; settings: UserSettings; onUpdate: (settings: UserSettings) => void }> = ({ isOpen, onClose, settings, onUpdate }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleToggle = (key: keyof UserSettings) => {
    const newVal = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(newVal);
  };

  const handleSave = () => {
    onUpdate(localSettings);
    onClose();
  };

  return (
    <Modal title="Terminal Configuration" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-8">
        {/* Dashboard Section */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
            <LayoutDashboard size={12} className="gold-text" /> <span>Dashboard & Privacy</span>
          </h4>
          <div className="space-y-3">
            <button 
              onClick={() => handleToggle('hideBalance')}
              className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-gold-bg/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                {localSettings.hideBalance ? <EyeOff size={18} className="text-white/40" /> : <Eye size={18} className="gold-text" />}
                <div className="text-left">
                  <p className="text-sm font-bold text-white/80">Privacy Mode</p>
                  <p className="text-[10px] text-white/30">Hide account balances from main view</p>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full transition-colors relative ${localSettings.hideBalance ? 'gold-bg' : 'bg-white/10'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform ${localSettings.hideBalance ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
            </button>

            <button 
              onClick={() => handleToggle('biometricLogin')}
              className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-gold-bg/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Fingerprint size={18} className={localSettings.biometricLogin ? 'text-emerald-400' : 'text-white/40'} />
                <div className="text-left">
                  <p className="text-sm font-bold text-white/80">Quantum Biometrics</p>
                  <p className="text-[10px] text-white/30">Enable zero-knowledge biometric access</p>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full transition-colors relative ${localSettings.biometricLogin ? 'gold-bg' : 'bg-white/10'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform ${localSettings.biometricLogin ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
            <BarChart3 size={12} className="gold-text" /> <span>Analytics Architecture</span>
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setLocalSettings({ ...localSettings, analyticsFocus: 'GROWTH' })}
              className={`p-4 rounded-2xl border transition-all text-left ${localSettings.analyticsFocus === 'GROWTH' ? 'gold-bg text-[#0B1C2D] border-gold-bg' : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'}`}
            >
              <TrendingUp size={16} className="mb-2" />
              <p className="text-xs font-bold">Portfolio Growth</p>
              <p className="text-[9px] opacity-60">Focus on net worth increase</p>
            </button>
            <button 
              onClick={() => setLocalSettings({ ...localSettings, analyticsFocus: 'SPENDING' })}
              className={`p-4 rounded-2xl border transition-all text-left ${localSettings.analyticsFocus === 'SPENDING' ? 'gold-bg text-[#0B1C2D] border-gold-bg' : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'}`}
            >
              <PieChart size={16} className="mb-2" />
              <p className="text-xs font-bold">Spending Analysis</p>
              <p className="text-[9px] opacity-60">Focus on debit categorization</p>
            </button>
          </div>
        </div>

        {/* Transfer Section */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
            <DollarSign size={12} className="gold-text" /> <span>Liquidity Safeguards</span>
          </h4>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <label className="text-[10px] text-white/30 uppercase tracking-widest block mb-2 font-bold">Max Daily Disbursement Limit</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="1000" 
                max="100000" 
                step="5000"
                value={localSettings.transferLimit}
                onChange={e => setLocalSettings({ ...localSettings, transferLimit: parseInt(e.target.value) })}
                className="flex-1 accent-gold-bg"
              />
              <span className="text-sm font-mono gold-text font-bold whitespace-nowrap">${localSettings.transferLimit.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full gold-bg text-[#0B1C2D] font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 mt-4 shadow-lg shadow-gold-bg/20"
        >
          <ShieldCheck size={18} />
          <span>Commit Configurations</span>
        </button>
      </div>
    </Modal>
  );
};

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
