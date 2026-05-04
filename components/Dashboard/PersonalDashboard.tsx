
import React, { useState, useMemo } from 'react';
import { useBank } from '../../context/BankContext';
import { useToast } from '../Toast';
import { CreditCard, ArrowUpRight, ArrowDownLeft, FileText, Send, PieChart as PieChartIcon, TrendingUp, Info, Filter, X, ChevronDown, Calendar, Repeat, ArrowRight } from 'lucide-react';
import { FinancialGrowthChart, SpendingPieChart } from '../Charts';
import { UserStatus, Transaction, RecurringPayment } from '../../types';

export const PersonalDashboard: React.FC<{ 
  onTransferClick: () => void; 
  onLoanClick: () => void;
  onRecurringClick: () => void;
  onTransactionClick: (transaction: Transaction) => void;
}> = ({ onTransferClick, onLoanClick, onRecurringClick, onTransactionClick }) => {
  const { state, dispatch } = useBank();
  const { showToast, ToastContainer } = useToast();
  const user = state.currentUser!;

  // Filter States
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [senderFilter, setSenderFilter] = useState('');
  const [receiverFilter, setReceiverFilter] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Derived Categories
  const categories = useMemo(() => {
    const cats = new Set(user.transactions.map(t => t.category));
    return ['All', ...Array.from(cats)];
  }, [user.transactions]);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return user.transactions.filter(t => {
      const matchesDate = (!startDate || t.date >= startDate) && (!endDate || t.date <= endDate);
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
      const matchesType = selectedType === 'All' || 
        (selectedType === 'Credit' && t.type === 'CREDIT') || 
        (selectedType === 'Debit' && t.type === 'DEBIT');
      const matchesSearch = !searchQuery || 
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSender = !senderFilter || 
        (t.from?.toLowerCase().includes(senderFilter.toLowerCase()));
      const matchesReceiver = !receiverFilter || 
        (t.to?.toLowerCase().includes(receiverFilter.toLowerCase()));
      
      return matchesDate && matchesCategory && matchesType && matchesSearch && matchesSender && matchesReceiver;
    });
  }, [user.transactions, startDate, endDate, selectedCategory, selectedType, searchQuery, senderFilter, receiverFilter]);

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedCategory('All');
    setSelectedType('All');
    setSearchQuery('');
    setSenderFilter('');
    setReceiverFilter('');
  };

  const handleCancelRecurring = (id: string) => {
    dispatch({ type: 'CANCEL_RECURRING', payload: id });
    showToast('Scheduled mandate cancelled', 'info');
  };

  const growthData = [
    { name: 'Jan', value: 20000 },
    { name: 'Feb', value: 22000 },
    { name: 'Mar', value: 21500 },
    { name: 'Apr', value: 24000 },
    { name: 'May', value: user.balance },
  ];

  const pieData = [
    { name: 'Investments', value: 40 },
    { name: 'Dining', value: 15 },
    { name: 'Shopping', value: 25 },
    { name: 'Utilities', value: 20 },
  ];

  const handleDownloadStatement = () => {
    showToast('Generating secure PDF statement...', 'info');
    setTimeout(() => showToast('Statement downloaded successfully', 'success'), 2000);
  };

  return (
    <div className="space-y-6">
      {ToastContainer}
      {user.status === UserStatus.LOCKED && (
        <div className="bg-red-500/20 border border-red-500 p-4 rounded-xl flex items-center space-x-3">
          <div className="bg-red-500 p-2 rounded-full"><FileText size={20} /></div>
          <div>
            <p className="font-bold text-red-400 uppercase tracking-wider text-xs">Security Alert</p>
            <p className="text-sm">Account temporarily locked. Please visit the nearest branch or contact premium support.</p>
          </div>
        </div>
      )}

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="text-white/60 text-sm font-medium uppercase tracking-widest mb-2">Total Liquid Assets</h3>
            <p className="text-4xl md:text-5xl font-bold mb-8">
              <span className="gold-text">$</span>{user.settings.hideBalance ? '••••••••' : user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={user.status === UserStatus.ACTIVE ? onTransferClick : () => showToast('Transfers locked', 'error')}
                className="flex items-center space-x-2 gold-bg text-[#0B1C2D] px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Send size={18} />
                <span>Quick Transfer</span>
              </button>
              <button 
                onClick={onLoanClick}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
              >
                <CreditCard size={18} />
                <span>Credit Line</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="glass p-8 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-white/60 text-sm font-medium uppercase tracking-widest mb-4">Aureon Portal</h3>
            <div className="space-y-4">
              <button onClick={onRecurringClick} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group text-left">
                <span className="flex items-center space-x-3"><Repeat className="text-emerald-400" /> <span className="font-medium">Recurring</span></span>
                <ArrowRight size={16} className="text-white/20 group-hover:text-gold-text translate-x-0 group-hover:translate-x-1 transition-all" />
              </button>
              <button onClick={() => showToast('No pending bills', 'success')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group text-left">
                <span className="flex items-center space-x-3"><ArrowDownLeft className="text-red-400" /> <span className="font-medium text-white/80">Premium Bills</span></span>
                <ArrowRight size={16} className="text-white/20 group-hover:text-gold-text translate-x-0 group-hover:translate-x-1 transition-all" />
              </button>
              <button onClick={handleDownloadStatement} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group text-left">
                <span className="flex items-center space-x-3"><FileText className="text-blue-400" /> <span className="font-medium text-white/80">Quantum PDF</span></span>
                <ArrowRight size={16} className="text-white/20 group-hover:text-gold-text translate-x-0 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recurring Mandates */}
      <div className="glass p-6 rounded-3xl animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold flex items-center space-x-2 text-white/80">
            <Calendar size={20} className="gold-text" /> 
            <span>Active Recurring Mandates</span>
          </h3>
          <button 
            onClick={onRecurringClick}
            className="flex items-center space-x-2 text-[10px] font-bold gold-text uppercase tracking-widest bg-gold-bg/10 px-3 py-1.5 rounded-lg border border-gold-bg/20 hover:bg-gold-bg/20 transition-all"
          >
            <Repeat size={12} />
            <span>Establish Mandate</span>
          </button>
        </div>
        
        {user.recurringPayments && user.recurringPayments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.recurringPayments.map(p => (
              <div key={p.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl relative overflow-hidden group">
                {p.status === 'CANCELLED' && (
                  <div className="absolute inset-0 bg-[#0B1C2D]/80 flex items-center justify-center z-10 font-bold text-white/30 backdrop-blur-[1px]">
                    CANCELLED
                  </div>
                )}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm font-bold text-white/80">{p.description}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest">{p.frequency}</p>
                  </div>
                  <p className="text-lg font-bold emerald-text">${p.amount.toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-white/30 tracking-widest uppercase">Next Execution</span>
                    <span className="text-white/60 font-mono tracking-tighter">{p.nextDate}</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gold-bg h-full transition-all duration-1000" 
                      style={{ width: `${(p.occurences / p.duration) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] items-center">
                    <span className="text-white/30">{p.occurences} / {p.duration} Cycles</span>
                    {p.status === 'ACTIVE' && (
                      <button 
                        onClick={() => handleCancelRecurring(p.id)}
                        className="text-red-400 hover:text-red-300 font-bold transition-colors uppercase tracking-widest text-[9px]"
                      >
                        Rescind
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-4 opacity-30">
            <Repeat size={40} className="text-white/20" />
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-widest">No Active Mandates</p>
              <p className="text-[10px]">Establish automated liquidity flows for recurring obligations.</p>
            </div>
            <button 
              onClick={onRecurringClick}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all border border-white/10"
            >
              Establish First Mandate
            </button>
          </div>
        )}
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`glass p-6 rounded-3xl transition-all duration-500 ${user.settings.analyticsFocus === 'GROWTH' ? 'ring-2 ring-gold-bg/20 scale-[1.02] bg-gold-bg/5' : 'opacity-60'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center space-x-2"><TrendingUp size={20} className="gold-text" /> <span>Portfolio Growth</span></h3>
            {user.settings.analyticsFocus === 'GROWTH' && <span className="text-[10px] text-gold-text font-bold uppercase tracking-widest bg-gold-bg/10 px-2 py-1 rounded">Primary focus</span>}
          </div>
          <FinancialGrowthChart data={growthData} />
        </div>
        <div className={`glass p-6 rounded-3xl transition-all duration-500 ${user.settings.analyticsFocus === 'SPENDING' ? 'ring-2 ring-gold-bg/20 scale-[1.02] bg-gold-bg/5' : 'opacity-60'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center space-x-2"><PieChartIcon size={20} className="gold-text" /> <span>Spending Analysis</span></h3>
            {user.settings.analyticsFocus === 'SPENDING' && <span className="text-[10px] text-gold-text font-bold uppercase tracking-widest bg-gold-bg/10 px-2 py-1 rounded">Primary focus</span>}
          </div>
          <SpendingPieChart data={pieData} />
        </div>
      </div>

      {/* Transactions Section */}
      <div className="glass p-6 rounded-3xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h3 className="font-bold">Recent Ledger Activity</h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${isFilterVisible ? 'gold-bg text-[#0B1C2D] border-gold-bg' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
            >
              <Filter size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
              {(startDate || endDate || selectedCategory !== 'All' || selectedType !== 'All' || searchQuery || senderFilter || receiverFilter) && (
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse ml-1" />
              )}
            </button>
            <span className="hidden md:block text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold ml-4">Encrypted Ledger</span>
          </div>
        </div>

        {/* Filter Bar */}
        {isFilterVisible && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5 animate-scale-in">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Narrative Search</label>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search description..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0B1C2D] border border-white/10 rounded-xl p-2 pl-8 text-xs focus:border-gold-bg outline-none transition-all"
                />
                <FileText size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold-text transition-colors" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Entity / Sender</label>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Sender name..."
                  value={senderFilter}
                  onChange={e => setSenderFilter(e.target.value)}
                  className="w-full bg-[#0B1C2D] border border-white/10 rounded-xl p-2 pl-8 text-xs focus:border-gold-bg outline-none transition-all"
                />
                <ArrowDownLeft size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold-text transition-colors" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Entity / Receiver</label>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Receiver name..."
                  value={receiverFilter}
                  onChange={e => setReceiverFilter(e.target.value)}
                  className="w-full bg-[#0B1C2D] border border-white/10 rounded-xl p-2 pl-8 text-xs focus:border-gold-bg outline-none transition-all"
                />
                <ArrowUpRight size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold-text transition-colors" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Start Date</label>
              <input 
                type="date" 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full bg-[#0B1C2D] border border-white/10 rounded-xl p-2 text-xs focus:border-gold-bg outline-none transition-all color-scheme-dark"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">End Date</label>
              <input 
                type="date" 
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full bg-[#0B1C2D] border border-white/10 rounded-xl p-2 text-xs focus:border-gold-bg outline-none transition-all color-scheme-dark"
              />
            </div>
            <div className="space-y-1 relative">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Category</label>
              <div className="relative">
                <select 
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#0B1C2D] border border-white/10 rounded-xl p-2 text-xs focus:border-gold-bg outline-none transition-all appearance-none cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1 relative">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Type</label>
              <div className="relative">
                <select 
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value)}
                  className="w-full bg-[#0B1C2D] border border-white/10 rounded-xl p-2 text-xs focus:border-gold-bg outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="All">All Types</option>
                  <option value="Credit">Credits Only</option>
                  <option value="Debit">Debits Only</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-end">
              <button 
                onClick={resetFilters}
                className="w-full flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white p-2 rounded-xl border border-white/5 transition-all text-xs font-bold h-[34px]"
              >
                <X size={14} />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-white/40 text-xs uppercase tracking-widest border-b border-white/5">
                <th className="pb-4 font-medium">Transaction</th>
                <th className="pb-4 font-medium">Category</th>
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium text-right">Amount</th>
                <th className="pb-4 font-medium text-right w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length > 0 ? filteredTransactions.map(t => (
                <tr 
                  key={t.id} 
                  onClick={() => onTransactionClick(t)}
                  className="group hover:bg-white/5 transition-all cursor-pointer"
                >
                  <td className="py-4">
                    <div className="flex flex-col">
                      <p className="font-medium group-hover:gold-text transition-colors">{t.description}</p>
                      <div className="flex items-center space-x-2 text-[10px] text-white/20 font-mono">
                        <span>{t.id}</span>
                        {(t.from || t.to) && (
                          <>
                            <span className="opacity-50">•</span>
                            <span className="text-gold-text/50 capitalize">
                              {t.type === 'DEBIT' ? `To: ${t.to || 'Unknown'}` : `From: ${t.from || 'Unknown'}`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4"><span className="text-[10px] bg-white/5 border border-white/5 px-2 py-1 rounded-full uppercase tracking-wider">{t.category}</span></td>
                  <td className="py-4 text-white/40 text-sm font-mono">{t.date}</td>
                  <td className={`py-4 text-right font-bold ${t.type === 'CREDIT' ? 'emerald-text' : 'text-white'}`}>
                    {t.type === 'CREDIT' ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 text-right">
                    <Info size={14} className="text-white/10 group-hover:text-gold-text transition-colors ml-auto" />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 opacity-20">
                      <Filter size={40} />
                      <p className="text-sm">No transactions match your current filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
