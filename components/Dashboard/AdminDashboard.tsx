
import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { useToast } from '../Toast';
import { Shield, Users, Lock, Unlock, Check, X, AlertCircle, Edit3, Settings } from 'lucide-react';
import { UserRole, UserStatus } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { state, dispatch } = useBank();
  const { showToast, ToastContainer } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newBalance, setNewBalance] = useState('');

  const totalFunds = state.allUsers.reduce((acc, u) => acc + u.balance, 0);
  const activeUsers = state.allUsers.filter(u => u.status === UserStatus.ACTIVE).length;
  const lockedUsers = state.allUsers.filter(u => u.status === UserStatus.LOCKED).length;
  const allLoans = state.allUsers.flatMap(u => u.loans.map(l => ({ ...l, userId: u.id, userName: u.name })));
  const pendingLoans = allLoans.filter(l => l.status === 'PENDING');

  const handleUpdateBalance = (userId: string) => {
    if (!state.enterpriseACCOUNTSMode) {
      showToast('Enable Enterprise ACCOUNTS Mode to modify balances', 'warning');
      return;
    }
    const amount = parseFloat(newBalance);
    if (isNaN(amount)) return;
    dispatch({ type: 'ADMIN_UPDATE_BALANCE', payload: { userId, newBalance: amount } });
    showToast(`Balance updated for user`, 'success');
    setSelectedUserId(null);
    setNewBalance('');
  };

  return (
    <div className="space-y-6">
      {ToastContainer}
      
      {/* Admin Controls */}
      <div className="glass p-6 rounded-3xl border-gold-bg/30 border flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${state.enterpriseACCOUNTSMode ? 'emerald-bg' : 'bg-white/10'} text-[#0B1C2D]`}>
            <Shield size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">System Administration</h3>
            <p className="text-white/40 text-sm">Real-time financial oversight and multi-role control.</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 bg-[#0B1C2D]/50 p-2 rounded-2xl border border-white/5">
          <span className="text-xs font-bold uppercase tracking-widest px-2">ACCOUNTS Mode</span>
          <button 
            onClick={() => dispatch({ type: 'TOGGLE_ACCOUNTS_MODE' })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${state.enterpriseACCOUNTSMode ? 'emerald-bg' : 'bg-white/20'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${state.enterpriseACCOUNTSMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-3xl">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Total System Funds</p>
          <p className="text-2xl font-bold gold-text">${totalFunds.toLocaleString()}</p>
        </div>
        <div className="glass p-6 rounded-3xl">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Total Entities</p>
          <p className="text-2xl font-bold">{state.allUsers.length}</p>
        </div>
        <div className="glass p-6 rounded-3xl">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Active Accounts</p>
          <p className="text-2xl font-bold emerald-text">{activeUsers}</p>
        </div>
        <div className="glass p-6 rounded-3xl">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Locked Accounts</p>
          <p className="text-2xl font-bold text-red-400">{lockedUsers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* User Management */}
        <div className="xl:col-span-2 glass p-6 rounded-3xl">
          <h3 className="font-bold mb-6 flex items-center space-x-2"><Users size={20} className="gold-text" /> <span>Account Registry</span></h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-white/40 text-[10px] uppercase tracking-widest border-b border-white/5">
                  <th className="pb-4">Username</th>
                  <th className="pb-4">Type</th>
                  <th className="pb-4">Balance</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {state.allUsers.map(u => (
                  <tr key={u.id} className="group hover:bg-white/5 transition-colors">
                    <td className="py-4 font-medium">{u.username}</td>
                    <td className="py-4"><span className="text-[10px] bg-white/5 px-2 py-1 rounded-full">{u.role}</span></td>
                    <td className="py-4 font-bold text-white/80">
                      {selectedUserId === u.id ? (
                        <div className="flex items-center space-x-2">
                          <input 
                            type="number" 
                            className="w-24 bg-[#0B1C2D] border border-white/20 p-1 text-xs rounded"
                            value={newBalance}
                            onChange={(e) => setNewBalance(e.target.value)}
                            onBlur={() => handleUpdateBalance(u.id)}
                            autoFocus
                          />
                        </div>
                      ) : (
                        `$${u.balance.toLocaleString()}`
                      )}
                    </td>
                    <td className="py-4">
                      <span className={`text-[10px] font-bold ${u.status === UserStatus.ACTIVE ? 'emerald-text' : 'text-red-400'}`}>{u.status}</span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {u.status === UserStatus.ACTIVE ? (
                          <button onClick={() => dispatch({ type: 'LOCK_USER', payload: u.id })} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-all" title="Lock Account"><Lock size={16} /></button>
                        ) : (
                          <button onClick={() => dispatch({ type: 'UNLOCK_USER', payload: u.id })} className="p-2 hover:bg-emerald-500/10 emerald-text rounded-lg transition-all" title="Unlock Account"><Unlock size={16} /></button>
                        )}
                        <button onClick={() => { setSelectedUserId(u.id); setNewBalance(u.balance.toString()); }} className="p-2 hover:bg-white/10 text-white/50 hover:text-white rounded-lg transition-all"><Edit3 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="glass p-6 rounded-3xl">
          <h3 className="font-bold mb-6 flex items-center space-x-2"><AlertCircle size={20} className="text-yellow-400" /> <span>Credit Approvals</span></h3>
          <div className="space-y-4">
            {pendingLoans.length > 0 ? pendingLoans.map(loan => (
              <div key={loan.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl relative group">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs text-white/40 font-bold uppercase">{loan.userName}</p>
                    <p className="text-lg font-bold">${loan.amount.toLocaleString()}</p>
                  </div>
                  <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full font-bold">PENDING</span>
                </div>
                <p className="text-xs text-white/60 mb-4">{loan.term} Months / Fixed Interest</p>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => dispatch({ type: 'APPROVE_LOAN', payload: { loanId: loan.id, userId: loan.userId } })}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-[#0B1C2D] font-bold py-2 rounded-xl transition-all flex items-center justify-center space-x-1"
                  >
                    <Check size={16} /> <span>Approve</span>
                  </button>
                  <button 
                    onClick={() => dispatch({ type: 'REJECT_LOAN', payload: { loanId: loan.id, userId: loan.userId } })}
                    className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-xl transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="py-12 text-center">
                <p className="text-white/20 italic">No pending credit requests</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
