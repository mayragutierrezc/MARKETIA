import React from 'react';
import { LayoutDashboard, Compass, Video, Calendar, Bot, BarChart3, Megaphone } from 'lucide-react';
import { useApp, DashboardTab } from '../../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const mobileTabs: { id: DashboardTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Inicio', icon: LayoutDashboard },
    { id: 'strategy', label: 'Estrategia', icon: Compass },
    { id: 'reels', label: 'Reels', icon: Video },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'campaigns', label: 'Campañas', icon: Megaphone },
    { id: 'assistant', label: 'Copilot', icon: Bot }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE7DF] px-2 py-1.5 flex items-center justify-around shadow-lg">
      {mobileTabs.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
              isActive ? 'text-[#6C5CE7]' : 'text-[#737373] hover:text-[#171717]'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
            <span className={`text-[10px] mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
