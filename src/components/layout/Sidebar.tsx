import React from 'react';
import {
  LayoutDashboard,
  Compass,
  FileText,
  Video,
  Calendar,
  Megaphone,
  BarChart3,
  Bot,
  Settings,
  ShieldCheck,
  Sparkles,
  Zap,
  ChevronRight
} from 'lucide-react';
import { useApp, DashboardTab } from '../../context/AppContext';

interface NavItem {
  id: DashboardTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, business, subscription, setUpgradePlanModalOpen } = useApp();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Inicio', icon: LayoutDashboard },
    { id: 'strategy', label: 'Mi Estrategia', icon: Compass, badge: 'IA' },
    { id: 'content', label: 'Contenido', icon: FileText },
    { id: 'reels', label: 'Generador de Reels', icon: Video, badge: 'Nuevo' },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'campaigns', label: 'Campañas', icon: Megaphone },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'assistant', label: 'Asistente IA', icon: Bot, badge: 'Copilot' },
    { id: 'admin', label: 'Admin Clientes & Precios', icon: ShieldCheck, badge: 'Dueño' },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between bg-white border-r border-[#E5E5E1] min-h-[calc(100vh-4rem)] p-6">
      <div className="space-y-6">
        {/* Geometric Balance Logo & Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-[#6C5CE7] rounded-lg flex items-center justify-center shrink-0 shadow-xs">
            <div className="w-4 h-4 bg-white rounded-full" />
          </div>
          <span className="text-xl font-bold tracking-tight uppercase text-[#171717]">
            Marketia
          </span>
        </div>

        {/* Active Business Mini Pill */}
        {business && (
          <div className="p-3 rounded-2xl bg-[#F8F7F4] border border-[#E5E5E1] transition-all">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#6C5CE7]/15 text-[#6C5CE7] flex items-center justify-center font-bold text-xs">
                {business.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#171717] truncate">{business.name}</p>
                <p className="text-[10px] text-[#737373] truncate uppercase tracking-wider">{business.category}</p>
              </div>
            </div>
          </div>
        )}

        {/* Geometric Navigation List with Dot Indicators */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#F8F7F4] text-[#6C5CE7] font-medium'
                    : 'text-[#737373] hover:bg-gray-50 hover:text-[#171717]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all ${
                      isActive
                        ? 'bg-[#6C5CE7] scale-110'
                        : 'bg-transparent border border-[#737373]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      isActive
                        ? 'bg-[#6C5CE7]/15 text-[#6C5CE7]'
                        : item.badge === 'Nuevo'
                        ? 'bg-[#F59EBD]/20 text-[#BE185D]'
                        : 'bg-[#F8F7F4] text-[#737373] border border-[#E5E5E1]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Geometric Plan Progress Box */}
      <div className="mt-auto pt-4 border-t border-[#E5E5E1]">
        <div
          onClick={() => setUpgradePlanModalOpen(true)}
          className="bg-[#F59EBD]/10 p-4 rounded-2xl border border-[#F59EBD]/20 cursor-pointer hover:border-[#F59EBD]/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] uppercase tracking-widest text-[#F59EBD] font-bold">
              Plan {subscription.plan}
            </p>
            <Sparkles className="w-3 h-3 text-[#F59EBD]" />
          </div>
          <p className="text-xs text-[#737373] mb-3">
            {subscription.generationsUsed} de {subscription.generationsLimit} generaciones utilizadas
          </p>
          <div className="w-full bg-white rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#F59EBD] h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.max(10, (subscription.generationsUsed / subscription.generationsLimit) * 100))}%`
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};
