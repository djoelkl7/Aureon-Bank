
import React, { useState } from 'react';
import { BankProvider, useBank } from './context/BankContext';
import { UserRole, UserStatus, Transaction, Loan } from './types';
import { Layout } from './components/Layout';
import { PersonalDashboard } from './components/Dashboard/PersonalDashboard';
import { BusinessDashboard } from './components/Dashboard/BusinessDashboard';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';
import { TransferModal, LoanModal } from './components/Modals';
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
      // Premium ACCOUNTS Logic: Password is username + "01"
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

    const newTx: Transaction = {
      id: `t-${Date.now()}`,
      type: 'DEBIT',
      amount: data.amount,
      category: 'Transfer',
      description: data.description || `Transfer to ${data.to}`,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedUser = {
      ...state.currentUser!,
      balance: state.currentUser!.balance - data.amount,
      transactions: [newTx, ...state.currentUser!.transactions]
    };

    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    showToast(`$${data.amount} transferred successfully`, 'success');
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

  return (
    <Layout>
      {ToastContainer}
      <div className="max-w-7xl mx-auto">
        {state.currentUser.role === UserRole.PERSONAL && (
          <PersonalDashboard 
            onTransferClick={() => setTransferOpen(true)} 
            onLoanClick={() => setLoanOpen(true)} 
          />
        )}
        {state.currentUser.role === UserRole.BUSINESS && <BusinessDashboard />}
        {state.currentUser.role === UserRole.ADMIN && <AdminDashboard />}
      </div>

      <TransferModal isOpen={isTransferOpen} onClose={() => setTransferOpen(false)} onTransfer={handleTransfer} />
      <LoanModal isOpen={isLoanOpen} onClose={() => setLoanOpen(false)} onSubmit={handleLoan} />
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
