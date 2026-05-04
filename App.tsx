
import React, { useState } from 'react';
import { BankProvider, useBank } from './context/BankContext';
import { UserRole, UserStatus, Transaction, Loan } from './types';
import { Layout } from './components/Layout';
import { PersonalDashboard } from './components/Dashboard/PersonalDashboard';
import { BusinessDashboard } from './components/Dashboard/BusinessDashboard';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';
import { TransferModal, LoanModal, TransactionDetailModal, PremiumUpgradeModal, RecurringPaymentModal, SettingsModal } from './components/Modals';
import { useToast } from './components/Toast';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { state, dispatch } = useBank();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast, ToastContainer } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const user = state.allUsers.find(u => u.username === username);
      if (user && password === `${username}01`) {
        dispatch({ type: 'LOGIN', payload: user });
        showToast(`Welcome, ${user.name}`, 'success');
      } else {
        showToast('Invalid credentials. Please check your clearance.', 'error');
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0B1C2D] relative overflow-hidden">
      {ToastContainer}
      {/* Decorative Gradients */}
      <div className="absolute top-0 -left-1/4 w-[500px] h-[500px] bg-gold-bg/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 -right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 gold-bg rounded-2xl mx-auto flex items-center justify-center font-bold text-[#0B1C2D] text-3xl mb-4 shadow-2xl">A</div>
          <h1 className="text-3xl font-bold tracking-tight">Aureon<span className="gold-text">Bank</span></h1>
          <p className="text-white/40 mt-2 font-medium">Digital Banking, Elevated.</p>
        </div>

        <form onSubmit={handleLogin} className="glass p-8 rounded-3xl border-white/5 shadow-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Username</label>
            <input 
              type="text" required value={username} onChange={e => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-gold-bg outline-none transition-all"
              placeholder="Premium Identity"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-gold-bg outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" disabled={loading}
            className="w-full gold-bg text-[#0B1C2D] font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          >
            {loading ? 'Verifying Identity...' : (
              <>
                <span>Access Terminal</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>

          {state.allUsers.find(u => u.username === username)?.settings.biometricLogin && (
            <div className="pt-2">
              <button 
                type="button"
                onClick={() => {
                  showToast('Initiating Neural Biometric Scan...', 'info');
                  setTimeout(() => showToast('Bio-Signature Verified', 'success'), 1500);
                  setTimeout(() => dispatch({ type: 'LOGIN', payload: state.allUsers.find(u => u.username === username)! }), 2000);
                }}
                className="w-full bg-white/5 border border-gold-bg/30 text-gold-bg font-bold py-4 rounded-xl hover:bg-gold-bg/10 transition-all flex items-center justify-center space-x-2 border-dashed group"
              >
                <ShieldCheck size={20} className="group-hover:animate-pulse" />
                <span className="uppercase tracking-widest text-[10px]">Biometric Fast-Path</span>
              </button>
            </div>
          )}

          <div className="pt-4 text-center">
            <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold flex items-center justify-center space-x-1">
              <ShieldCheck size={12} />
              <span>AES-256 Encrypted Session</span>
            </p>
          </div>
        </form>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <button onClick={() => { setUsername('SarahLee'); setPassword('SarahLee01'); }} className="glass p-3 rounded-xl text-[10px] font-bold hover:bg-white/10 transition-colors uppercase tracking-widest text-white/40">Personal ACCOUNTS</button>
          <button onClick={() => { setUsername('AdminMaster'); setPassword('AdminMaster01'); }} className="glass p-3 rounded-xl text-[10px] font-bold hover:bg-white/10 transition-colors uppercase tracking-widest text-white/40">Admin ACCOUNTS</button>
        </div>
      </div>
    </div>
  );
};

const MainApp: React.FC = () => {
  const { state, dispatch } = useBank();
  const { showToast, ToastContainer } = useToast();
  const [isTransferOpen, setTransferOpen] = useState(false);
  const [isLoanOpen, setLoanOpen] = useState(false);
  const [isUpgradeOpen, setUpgradeOpen] = useState(false);
  const [isRecurringOpen, setRecurringOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  if (!state.currentUser) return <LoginPage />;

  const handleTransfer = (data: { to: string; amount: number; description: string }) => {
    if (state.currentUser!.status === UserStatus.LOCKED) {
      showToast('Account is locked. Transfers are disabled.', 'error');
      return;
    }
    if (data.amount > state.currentUser!.balance) {
      showToast('Insufficient funds for this transaction.', 'error');
      return;
    }
    
    // Check against daily limit in settings
    if (data.amount > state.currentUser!.settings.transferLimit) {
      showToast(`Transfer exceeds your set daily limit of $${state.currentUser!.settings.transferLimit.toLocaleString()}`, 'error');
      return;
    }

    const newTx: Transaction = {
      id: `t-${Date.now()}`,
      type: 'DEBIT',
      amount: data.amount,
      category: 'Transfer',
      description: data.description || `Transfer to ${data.to}`,
      date: new Date().toISOString().split('T')[0],
      from: state.currentUser!.name,
      to: data.to
    };

    const updatedUser = {
      ...state.currentUser!,
      balance: state.currentUser!.balance - data.amount,
      transactions: [newTx, ...state.currentUser!.transactions]
    };

    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    showToast(`$${data.amount} transferred successfully`, 'success');
    
    // Show upgrade modal after a slight delay
    setTimeout(() => {
      setUpgradeOpen(true);
    }, 1500);
  };

  const handleLoan = (data: { amount: number; term: number }) => {
    const newLoan: Loan = {
      id: `LOAN-${Math.floor(Math.random() * 90000) + 10000}`,
      userId: state.currentUser!.id,
      userName: state.currentUser!.name,
      amount: data.amount,
      term: data.term,
      status: 'PENDING',
      date: new Date().toISOString().split('T')[0]
    };

    const updatedUser = {
      ...state.currentUser!,
      loans: [...state.currentUser!.loans, newLoan]
    };

    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    showToast('Loan application submitted for approval', 'info');
  };

  const handleAddRecurring = (data: any) => {
    const nextDate = new Date();
    if (data.frequency === 'DAILY') nextDate.setDate(nextDate.getDate() + 1);
    else if (data.frequency === 'WEEKLY') nextDate.setDate(nextDate.getDate() + 7);
    else if (data.frequency === 'MONTHLY') nextDate.setMonth(nextDate.getMonth() + 1);

    const recurring: any = {
      ...data,
      id: `rec-${Date.now()}`,
      occurences: 0,
      nextDate: nextDate.toISOString().split('T')[0],
      status: 'ACTIVE'
    };

    dispatch({ type: 'ADD_RECURRING', payload: recurring });
    showToast('Recurring payment mandate established', 'success');
  };

  return (
    <Layout onSettingsClick={() => setSettingsOpen(true)}>
      {ToastContainer}
      <div className="max-w-7xl mx-auto">
        {state.currentUser.role === UserRole.PERSONAL && (
          <PersonalDashboard 
            onTransferClick={() => setTransferOpen(true)} 
            onLoanClick={() => setLoanOpen(true)} 
            onRecurringClick={() => setRecurringOpen(true)}
            onTransactionClick={(tx) => setSelectedTransaction(tx)}
          />
        )}
        {state.currentUser.role === UserRole.BUSINESS && <BusinessDashboard />}
        {state.currentUser.role === UserRole.ADMIN && <AdminDashboard />}
      </div>

      <TransferModal isOpen={isTransferOpen} onClose={() => setTransferOpen(false)} onTransfer={handleTransfer} />
      <LoanModal isOpen={isLoanOpen} onClose={() => setLoanOpen(false)} onSubmit={handleLoan} />
      <RecurringPaymentModal isOpen={isRecurringOpen} onClose={() => setRecurringOpen(false)} onSubmit={handleAddRecurring} />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setSettingsOpen(false)} 
        settings={state.currentUser.settings}
        onUpdate={(settings) => {
          dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
          showToast('Security configurations committed successfully', 'success');
        }}
      />
      <TransactionDetailModal 
        isOpen={!!selectedTransaction} 
        onClose={() => setSelectedTransaction(null)} 
        transaction={selectedTransaction} 
      />
      <PremiumUpgradeModal 
        isOpen={isUpgradeOpen} 
        onClose={() => setUpgradeOpen(false)} 
      />
    </Layout>
  );
};

export default function App() {
  return (
    <BankProvider>
      <MainApp />
    </BankProvider>
  );
}
