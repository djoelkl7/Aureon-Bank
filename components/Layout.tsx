
import React from 'react';
import { useBank } from '../context/BankContext';
import { TRANSLATIONS } from '../constants';
import { LayoutDashboard, CreditCard, PieChart, Users, Settings, LogOut, ShieldCheck, Globe, Menu, X } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode; onSettingsClick?: () => void }> = ({ children, onSettingsClick }) => {
  const { state, dispatch } = useBank();
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const t = TRANSLATIONS[state.language];

  if (!state.currentUser) return <>{children}</>;

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', roles: ['PERSONAL', 'BUSINESS', 'ADMIN'] },
    { icon: <CreditCard size={20} />, label: t.transfer, roles: ['PERSONAL', 'BUSINESS'] },
    { icon: <PieChart size={20} />, label: t.analytics, roles: ['PERSONAL', 'BUSINESS', 'ADMIN'] },
    { icon: <Users size={20} />, label: 'Manage Clients', roles: ['ADMIN'] },
    { icon: <ShieldCheck size={20} />, label: 'Security', roles: ['ADMIN'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(state.currentUser!.role));

  return (
    <div className="min-h-screen bg-[#0B1C2D] flex overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className={`fixed lg:relative z-50 lg:z-auto h-screen glass border-r border-white/5 w-64 p-6 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gold-bg rounded-xl flex items-center justify-center font-bold text-[#0B1C2D] text-2xl">A</div>
            <span className="text-xl font-bold tracking-tight">Aureon<span className="gold-text">Bank</span></span>
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X size={24} /></button>
        </div>

        <nav className="flex-1 space-y-2">
          {filteredMenu.map((item, idx) => (
            <button key={idx} className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-white/5 transition-all group">
              <span className="text-white/40 group-hover:text-gold-bg transition-colors">{item.icon}</span>
              <span className="font-medium text-white/60 group-hover:text-white transition-colors">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="p-4 glass rounded-2xl border-white/10">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gold-bg to-emerald-bg" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">{state.currentUser.name}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">{state.currentUser.role}</p>
              </div>
            </div>
            <button onClick={() => dispatch({ type: 'LOGOUT' })} className="w-full flex items-center space-x-2 text-red-400 hover:text-red-300 text-sm font-bold p-2 transition-colors">
              <LogOut size={16} /> <span>{t.logout}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-20 glass border-b border-white/5 px-8 flex items-center justify-between z-40 shrink-0">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
          <div className="hidden lg:block">
            <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest">{t.welcome}, {state.currentUser.name}</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button className="flex items-center space-x-2 text-sm font-bold text-white/60 hover:text-white transition-colors glass border border-white/10 px-3 py-2 rounded-xl hover:bg-white/5">
                <Globe size={16} />
                <span className="hidden sm:inline">{state.language}</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-32 glass border border-white/10 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto shadow-2xl">
                {['EN', 'ES', 'FR'].map(lang => (
                  <button 
                    key={lang} 
                    onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: lang as any })}
                    className="w-full text-left p-3 hover:bg-white/10 text-sm transition-colors border-b border-white/5 last:border-0"
                  >
                    {lang === 'EN' ? 'English' : lang === 'ES' ? 'Español' : 'Français'}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={onSettingsClick}
              className="flex items-center space-x-2 p-2 px-3 glass border border-white/10 rounded-xl hover:bg-white/5 transition-all text-white/60 hover:text-white group"
              title="Terminal Configuration"
            >
              <Settings size={16} className="group-hover:rotate-90 transition-transform duration-500" />
              <span className="text-xs font-bold uppercase tracking-widest hidden md:inline">Settings</span>
            </button>
          </div>
        </header>

        {/* Dynamic Canvas */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
