import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, Clock, Calendar, Map, Bookmark, Columns, Bot, AlertTriangle } from 'lucide-react';

export default function TabNavigation() {
  const { activeTab, setActiveTab, activeCity } = useApp();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hourly', label: '24h Hourly', icon: Clock },
    { id: 'tenDay', label: '10-Day Outlook', icon: Calendar },
    { id: 'radar', label: 'Interactive Radar', icon: Map },
    { id: 'saved', label: 'Saved Cities', icon: Bookmark },
    { id: 'compare', label: 'Compare Cities', icon: Columns },
    { id: 'aiAssistant', label: 'AI Assistant', icon: Bot },
    {
      id: 'alerts',
      label: 'Weather Alerts',
      icon: AlertTriangle,
      badge: activeCity?.alert ? '1' : null
    }
  ];

  return (
    <nav className="w-full bg-[#05070A]/60 border-b border-white/5 px-4 lg:px-8 py-2 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1.5 min-w-max">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all relative ${
                isActive
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-md shadow-sky-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-1 px-1.5 py-0.2 bg-red-500 text-white rounded-full text-[10px] font-bold animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
