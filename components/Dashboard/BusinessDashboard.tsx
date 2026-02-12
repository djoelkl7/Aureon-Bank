
import React from 'react';
import { useBank } from '../../context/BankContext';
import { useToast } from '../Toast';
import { LayoutGrid, Users, BarChart3, Download, Plus, Zap } from 'lucide-react';
import { CashFlowChart } from '../Charts';

export const BusinessDashboard: React.FC = () => {
  const { state } = useBank();
  const { showToast, ToastContainer } = useToast();
  const user = state.currentUser!;

  const cashFlowData = [
    { name: 'Mon', income: 45000, expense: 32000 },
    { name: 'Tue', income: 52000, expense: 38000 },
    { name: 'Wed', income: 48000, expense: 42000 },
    { name: 'Thu', income: 61000, expense: 35000 },
    { name: 'Fri', income: 55000, expense: 44000 },
  ];

  const handleBulkPayment = () => {
    showToast('Initializing Bulk Payment Module...', 'info');
    setTimeout(() => {
      showToast('24 Corporate payouts processed successfully.', 'success');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {ToastContainer}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 glass p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-white/60 text-sm font-medium uppercase tracking-widest mb-1">Total Corporate Assets</h3>
              <p className="text-5xl font-bold gold-text">${user.balance.toLocaleString()}</p>
            </div>
            <div className="flex space-x-3">
              <button onClick={handleBulkPayment} className="flex items-center space-x-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg font-bold border border-emerald-500/20 transition-all">
                <Zap size={16} /> <span>Bulk Pay</span>
              </button>
              <button onClick={() => showToast('Feature available in V2', 'info')} className="flex items-center space-x-2 gold-bg text-[#0B1C2D] px-4 py-2 rounded-lg font-bold transition-all">
                <Plus size={16} /> <span>New Account</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {user.subAccounts?.map(sub => (
              <div key={sub.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:border-gold-bg/50 transition-colors group cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{sub.type}</span>
                  <LayoutGrid size={14} className="opacity-20 group-hover:opacity-100 gold-text" />
                </div>
                <h4 className="font-semibold text-white/80">{sub.name}</h4>
                <p className="text-lg font-bold">${sub.balance.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-6 rounded-3xl flex flex-col justify-between">
          <h3 className="font-bold flex items-center space-x-2"><BarChart3 size={18} className="gold-text" /> <span>Cash Flow</span></h3>
          <div className="space-y-4 my-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Revenue (MTD)</span>
              <span className="emerald-text font-bold">+$240,500</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">OpEx (MTD)</span>
              <span className="text-red-400 font-bold">-$128,400</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full emerald-bg w-[65%]" />
            </div>
          </div>
          <button onClick={() => showToast('Report generated', 'success')} className="w-full flex items-center justify-center space-x-2 border border-white/10 p-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold">
            <Download size={16} /> <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-6 rounded-3xl">
          <h3 className="font-bold mb-6">Global Cash Movement</h3>
          <CashFlowChart data={cashFlowData} />
        </div>
        <div className="glass p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold">Team Payroll</h3>
            <Users size={20} className="gold-text opacity-50" />
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40 font-bold uppercase">Next Payroll</p>
                <p className="font-bold">June 01, 2024</p>
              </div>
              <p className="text-lg font-bold gold-text">$12,450.00</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-xs text-white/40 font-bold uppercase mb-2">Departments</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span>Engineering</span> <span>$45,000</span></div>
                <div className="flex justify-between text-sm"><span>Marketing</span> <span>$22,000</span></div>
                <div className="flex justify-between text-sm"><span>Management</span> <span>$30,000</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
