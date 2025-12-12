import React from 'react';
import { Home, AlertTriangle, Calendar, MessageSquare, Phone, Bot, LogOut } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, onLogout }) => {
  const navItems = [
    { view: AppView.DASHBOARD, icon: Home, label: 'Home' },
    { view: AppView.REPORTING, icon: AlertTriangle, label: 'Lapor' },
    { view: AppView.SCHEDULE, icon: Calendar, label: 'Jadwal' },
    { view: AppView.FORUM, icon: MessageSquare, label: 'Forum' },
    { view: AppView.CONTACTS, icon: Phone, label: 'Kontak' },
    { view: AppView.AI_ASSISTANT, icon: Bot, label: 'AI Safety' },
  ];

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden md:flex flex-col w-64 h-full bg-white border-r border-gray-200 fixed left-0 top-0 z-20">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            🛡️ Siskamling
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                currentView === item.view
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
           <button 
             onClick={onLogout}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
           >
             <LogOut size={20} />
             Keluar
           </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation (hidden on desktop) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                currentView === item.view ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;