
import React from 'react';
import { useBank } from '../../context/BankContext';
import { useToast } from '../Toast';
import { CreditCard, ArrowUpRight, ArrowDownLeft, FileText, Send, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { FinancialGrowthChart, SpendingPieChart } from '../Charts';
import { UserStatus } from '../../types';

export const PersonalDashboard: React.FC<{ 
  onTransferClick: () => void; 
  onLoanClick: () => void;
}> = ({ onTransferClick, onLoanClick }) => {
  const { state } = useBank();
  const { showToast, ToastContainer } = useToast();
  const user = state.currentUser!;

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
              <span className="gold-text">$</span>{user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
            <h3 className="text-white/60 text-sm font-medium uppercase tracking-widest mb-4">Quick Actions</h3>
            <div className="space-y-4">
              <button onClick={() => showToast('Feature coming soon', 'info')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                <span className="flex items-center space-x-3"><ArrowUpRight className="text-emerald-400" /> <span>Deposit</span></span>
              </button>
              <button onClick={() => showToast('No pending bills', 'success')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                <span className="flex items-center space-x-3"><ArrowDownLeft className="text-red-400" /> <span>Pay Bills</span></span>
              </button>
              <button onClick={handleDownloadStatement} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                <span className="flex items-center space-x-3"><FileText className="text-blue-400" /> <span>E-Statement</span></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center space-x-2"><TrendingUp size={20} className="gold-text" /> <span>Portfolio Growth</span></h3>
          </div>
          <FinancialGrowthChart data={growthData} />
        </div>
        <div className="glass p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center space-x-2"><PieChartIcon size={20} className="gold-text" /> <span>Spending Analysis</span></h3>
          </div>
          <SpendingPieChart data={pieData} />
        </div>
      </div>

      {/* Transactions */}
      <div className="glass p-6 rounded-3xl overflow-hidden">
        <h3 className="font-bold mb-6">Recent Ledger Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-white/40 text-xs uppercase tracking-widest border-b border-white/5">
                <th className="pb-4 font-medium">Transaction</th>
                <th className="pb-4 font-medium">Category</th>
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {user.transactions.length > 0 ? user.transactions.map(t => (
                <tr key={t.id} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4 font-medium">{t.description}</td>
                  <td className="py-4"><span className="text-xs bg-white/5 px-2 py-1 rounded-full">{t.category}</span></td>
                  <td className="py-4 text-white/40 text-sm">{t.date}</td>
                  <td className={`py-4 text-right font-bold ${t.type === 'CREDIT' ? 'emerald-text' : 'text-white'}`}>
                    {t.type === 'CREDIT' ? '+' : '-'}${t.amount.toLocaleString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-white/20">No recent activity detected</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
