
import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { useToast } from '../Toast';
import { Shield, Users, Lock, Unlock, Check, X, AlertCircle, Edit3, Settings, UserPlus, Search, Filter, Trash2, LayoutGrid, List, FileSearch, UserCircle } from 'lucide-react';
import { UserRole, UserStatus, User } from '../../types';
import { UserManagementModal, UserProfileDetailModal } from '../Modals';

export const AdminDashboard: React.FC = () => {
  const { state, dispatch } = useBank();
  const { showToast, ToastContainer } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newBalance, setNewBalance] = useState('');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ACCOUNTS'>('OVERVIEW');
  const [searchQuery, setSearchQuery] = useState('');
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUserDetail, setViewingUserDetail] = useState<User | null>(null);

  const totalFunds = state.allUsers.reduce((acc, u) => acc + u.balance, 0);
  const activeUsers = state.allUsers.filter(u => u.status === UserStatus.ACTIVE).length;
  const lockedUsers = state.allUsers.filter(u => u.status === UserStatus.LOCKED).length;
  const allLoans = state.allUsers.flatMap(u => u.loans.map(l => ({ ...l, userId: u.id, userName: u.name })));
  const pendingLoans = allLoans.filter(l => l.status === 'PENDING');

  const filteredUsers = state.allUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.idNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateBalance = (userId: string) => {
    if (!state.enterpriseACCOUNTSMode) {
      showToast('Enable Enterprise ACCOUNTS Mode to modify balances', 'warning');
      return;
    }
    const amount = parseFloat(newBalance);
    if (isNaN(amount)) return;
    dispatch({ type: 'ADMIN_UPDATE_BALANCE', payload: { userId, newBalance: amount } });
    showToast(`Balance updated for ${state.allUsers.find(u => u.id === userId)?.name}`, 'success');
    setSelectedUserId(null);
    setNewBalance('');
  };

  const handleCreateOrUpdateUser = (userData: User) => {
    if (state.allUsers.find(u => u.id === userData.id)) {
      dispatch({ type: 'UPDATE_USER', payload: userData });
      showToast(`Identity ${userData.name} updated successfully`, 'success');
    } else {
      dispatch({ type: 'CREATE_USER', payload: userData });
      showToast(`New identity ${userData.name} provisioned`, 'success');
    }
    setEditingUser(null);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to purge this identity from the central registry?')) {
      dispatch({ type: 'DELETE_USER', payload: id });
      showToast('Identity purged from registry', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {ToastContainer}
      
      {/* Admin Controls */}
      <div className="glass p-6 rounded-3xl border-gold-bg/30 border flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className={`p-4 rounded-2xl ${state.enterpriseACCOUNTSMode ? 'emerald-bg shadow-lg shadow-emerald-500/20' : 'bg-white/10'} text-[#0B1C2D] transition-all duration-500`}>
            <Shield size={32} />
          </div>
          <div>
            <h3 className="font-bold text-xl tracking-tight">Super Admin Hub</h3>
            <p className="text-white/40 text-sm font-medium">Aureon Global Financial Control Terminal</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-[#0B1C2D]/50 p-1.5 rounded-2xl border border-white/5">
            <button 
              onClick={() => setActiveTab('OVERVIEW')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'OVERVIEW' ? 'gold-bg text-[#0B1C2D]' : 'text-white/40 hover:text-white'}`}
            >
              System Overview
            </button>
            <button 
              onClick={() => setActiveTab('ACCOUNTS')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'ACCOUNTS' ? 'gold-bg text-[#0B1C2D]' : 'text-white/40 hover:text-white'}`}
            >
              Active Accounts
            </button>
          </div>

          <div className="h-10 w-[1px] bg-white/5 mx-2 hidden lg:block" />

          <div className="flex items-center space-x-3 bg-[#0B1C2D]/50 p-2 px-4 rounded-2xl border border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">ACCOUNTS Override</span>
            <button 
              onClick={() => dispatch({ type: 'TOGGLE_ACCOUNTS_MODE' })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${state.enterpriseACCOUNTSMode ? 'emerald-bg' : 'bg-white/20'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${state.enterpriseACCOUNTSMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'OVERVIEW' ? (
        <>
          {/* System Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass p-6 rounded-3xl border-white/5">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">System Liquidity</p>
              <p className="text-3xl font-bold gold-text tracking-tighter">${totalFunds.toLocaleString()}</p>
            </div>
            <div className="glass p-6 rounded-3xl border-white/5">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Global Entities</p>
              <p className="text-3xl font-bold tracking-tighter">{state.allUsers.length}</p>
            </div>
            <div className="glass p-6 rounded-3xl border-white/5">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Verified Users</p>
              <p className="text-3xl font-bold emerald-text tracking-tighter">{activeUsers}</p>
            </div>
            <div className="glass p-6 rounded-3xl border-white/5">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Security Holds</p>
              <p className="text-3xl font-bold text-red-400 tracking-tighter">{lockedUsers}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Quick Registry View */}
            <div className="xl:col-span-2 glass p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold flex items-center space-x-2"><Users size={20} className="gold-text" /> <span>Registry Snap-view</span></h3>
                <button onClick={() => setActiveTab('ACCOUNTS')} className="text-xs gold-text font-bold hover:underline">View Full Registry</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-white/40 text-[10px] uppercase tracking-widest border-b border-white/5">
                      <th className="pb-4">Identity</th>
                      <th className="pb-4">Asset Value</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4 text-right">Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {state.allUsers.slice(0, 5).map(u => (
                      <tr key={u.id} className="group hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setViewingUserDetail(u)}>
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold gold-text overflow-hidden">{u.passportUrl ? <img src={u.passportUrl} className="w-full h-full object-cover" /> : u.name.charAt(0)}</div>
                            <div>
                              <p className="font-bold text-sm tracking-tight">{u.name}</p>
                              <p className="text-[10px] text-white/20">@{u.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 font-bold text-white/80 tracking-tighter">${u.balance.toLocaleString()}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest ${u.status === UserStatus.ACTIVE ? 'bg-emerald-500/10 emerald-text' : 'bg-red-500/10 text-red-400'}`}>{u.status}</span>
                        </td>
                        <td className="py-4 text-right">
                          <button className="p-2 hover:bg-white/10 rounded-lg text-white/20 group-hover:text-gold-bg transition-all">
                            <FileSearch size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Credit Approvals */}
            <div className="glass p-6 rounded-3xl">
              <h3 className="font-bold mb-6 flex items-center space-x-2"><AlertCircle size={20} className="text-yellow-400" /> <span>Credit Approvals</span></h3>
              <div className="space-y-4">
                {pendingLoans.length > 0 ? pendingLoans.map(loan => (
                  <div key={loan.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl relative group hover:border-gold-bg/30 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{loan.userName}</p>
                        <p className="text-xl font-bold tracking-tighter">${loan.amount.toLocaleString()}</p>
                      </div>
                      <span className="text-[9px] bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full font-bold tracking-widest">PENDING</span>
                    </div>
                    <p className="text-[10px] text-white/60 mb-4 font-medium uppercase">{loan.term} Months / Standard Rate</p>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => dispatch({ type: 'APPROVE_LOAN', payload: { loanId: loan.id, userId: loan.userId } })}
                        className="flex-1 gold-bg text-[#0B1C2D] font-bold py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1 hover:scale-105 active:scale-95"
                      >
                        <Check size={16} /> <span>Approve</span>
                      </button>
                      <button 
                        onClick={() => dispatch({ type: 'REJECT_LOAN', payload: { loanId: loan.id, userId: loan.userId } })}
                        className="p-2.5 bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded-xl transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="py-12 text-center">
                    <p className="text-white/20 italic text-sm">No pending credit requests</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ACCOUNTS MANAGER TAB */
        <div className="glass p-8 rounded-3xl border-white/5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-10 gap-6">
            <div>
              <h3 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-3">
                <Users className="gold-text" size={28} /> Central Identity Registry
              </h3>
              <p className="text-white/40 text-sm">Manage, provision, and audit global bank identities.</p>
            </div>
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <input 
                  type="text" 
                  placeholder="Scan identities..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm focus:border-gold-bg outline-none transition-all placeholder:text-white/20"
                />
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              </div>
              <button 
                onClick={() => { setEditingUser(null); setIsManageModalOpen(true); }}
                className="gold-bg text-[#0B1C2D] font-bold p-4 rounded-2xl shadow-lg shadow-gold-bg/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
              >
                <UserPlus size={20} />
                <span className="hidden sm:inline">Provision Accounts</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/5">
                  <th className="pb-6">Legal Entity</th>
                  <th className="pb-6">Role / Level</th>
                  <th className="pb-6 text-right">Liquidity ($)</th>
                  <th className="pb-6 text-center">Security Status</th>
                  <th className="pb-6 text-right">Clearance Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="group hover:bg-white/5 transition-all">
                    <td className="py-6 cursor-pointer" onClick={() => setViewingUserDetail(u)}>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-gold-bg/30">
                          {u.passportUrl ? (
                            <img src={u.passportUrl} alt="Passport" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xl font-bold gold-text opacity-40">{u.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-base tracking-tight group-hover:gold-text transition-colors">{u.name}</p>
                          <p className="text-[10px] text-white/20 font-mono flex items-center gap-2 tracking-widest mt-0.5">
                            <IDIcon size={10} /> <span>{u.idNumber || 'KYC_PENDING'}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full tracking-widest ${u.role === UserRole.ADMIN ? 'bg-gold-bg text-[#0B1C2D]' : 'bg-white/5 text-white/60'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-6 text-right">
                      {selectedUserId === u.id ? (
                        <input 
                          type="number" 
                          autoFocus
                          value={newBalance}
                          onChange={e => setNewBalance(e.target.value)}
                          onBlur={() => handleUpdateBalance(u.id)}
                          onKeyDown={e => e.key === 'Enter' && handleUpdateBalance(u.id)}
                          className="w-32 bg-[#0B1C2D] border border-gold-bg/50 p-2 text-right text-sm rounded-xl font-bold"
                        />
                      ) : (
                        <p onClick={() => { if(state.enterpriseACCOUNTSMode) { setSelectedUserId(u.id); setNewBalance(u.balance.toString()); } }} className={`text-lg font-bold tracking-tighter ${state.enterpriseACCOUNTSMode ? 'cursor-pointer hover:gold-text' : 'text-white/80'}`}>
                          ${u.balance.toLocaleString()}
                        </p>
                      )}
                    </td>
                    <td className="py-6 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-[10px] font-bold tracking-widest flex items-center gap-1 ${u.status === UserStatus.ACTIVE ? 'emerald-text' : 'text-red-400'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${u.status === UserStatus.ACTIVE ? 'emerald-bg animate-pulse' : 'bg-red-500'}`} />
                          {u.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 text-right">
                      <div className="flex items-center justify-end space-x-3 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setViewingUserDetail(u)} className="p-3 bg-white/5 hover:bg-white/20 transition-all rounded-xl text-white/60" title="Identity Dossier"><FileSearch size={18} /></button>
                        {u.status === UserStatus.ACTIVE ? (
                          <button onClick={() => dispatch({ type: 'LOCK_USER', payload: u.id })} className="p-3 hover:bg-red-500 hover:text-white transition-all rounded-xl" title="Lock Identity"><Lock size={18} /></button>
                        ) : (
                          <button onClick={() => dispatch({ type: 'UNLOCK_USER', payload: u.id })} className="p-3 bg-emerald-500/10 hover:bg-emerald-500 emerald-text hover:text-[#0B1C2D] transition-all rounded-xl" title="Reinstate Identity"><Unlock size={18} /></button>
                        )}
                        <button onClick={() => { setEditingUser(u); setIsManageModalOpen(true); }} className="p-3 bg-white/5 hover:bg-gold-bg hover:text-[#0B1C2D] transition-all rounded-xl text-white/40"><Edit3 size={18} /></button>
                        <button onClick={() => handleDeleteUser(u.id)} className="p-3 bg-white/5 hover:bg-red-500 hover:text-white transition-all rounded-xl text-white/40"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <UserManagementModal 
        isOpen={isManageModalOpen}
        onClose={() => { setIsManageModalOpen(false); setEditingUser(null); }}
        onSubmit={handleCreateOrUpdateUser}
        initialUser={editingUser}
      />
      <UserProfileDetailModal 
        isOpen={!!viewingUserDetail}
        onClose={() => setViewingUserDetail(null)}
        user={viewingUserDetail}
      />
    </div>
  );
};
