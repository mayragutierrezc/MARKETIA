import React, { useState } from 'react';
import { 
  Sparkles, 
  Zap, 
  ArrowRight, 
  Play, 
  User, 
  LogOut, 
  ShieldCheck, 
  ChevronDown, 
  LayoutDashboard,
  Crown
} from 'lucide-react';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    view,
    setView,
    setActiveTab,
    isDemoMode,
    loadDemoData,
    business,
    subscription,
    setUpgradePlanModalOpen,
    currentUser,
    userProfile,
    setAuthModalOpen,
    logoutUser
  } = useApp();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F8F7F4]/95 backdrop-blur-md border-b border-[#E5E5E1] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo - Geometric Balance */}
        <div
          onClick={() => {
            if (view === 'dashboard') setActiveTab('home');
            else setView('landing');
          }}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 bg-[#6C5CE7] rounded-lg flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <div className="w-4 h-4 bg-white rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight uppercase text-[#171717] leading-none">
              MARKETIA
            </span>
            <span className="text-[9px] text-[#737373] tracking-widest uppercase font-semibold mt-0.5">
              Marketing Copilot
            </span>
          </div>
        </div>

        {/* Center / Mode indicator */}
        {view === 'dashboard' && business && (
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E5E5E1] text-xs shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            <span className="font-medium text-[#171717]">{business.name}</span>
            {isDemoMode && (
              <span className="px-2 py-0.5 bg-[#F59EBD]/20 text-[#BE185D] font-bold text-[10px] rounded-full uppercase tracking-wider">
                Demo
              </span>
            )}
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {view === 'landing' && (
            <button
              onClick={loadDemoData}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#525252] hover:text-[#171717] bg-white hover:bg-gray-50 border border-[#E5E5E1] rounded-full transition-all cursor-pointer shadow-xs"
            >
              <Play className="w-3.5 h-3.5 text-[#6C5CE7] fill-[#6C5CE7]" />
              <span>Explorar Demo</span>
            </button>
          )}

          {/* Plan usage pill on Dashboard */}
          {view === 'dashboard' && (
            <button
              onClick={() => setUpgradePlanModalOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F8F7F4] border border-[#E5E5E1] text-xs transition-all cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-1 font-semibold text-[#6C5CE7]">
                <Zap className="w-3.5 h-3.5 fill-[#6C5CE7]" />
                <span>{subscription.generationsUsed}/{subscription.generationsLimit === Infinity ? '∞' : subscription.generationsLimit}</span>
              </div>
              <span className="text-[11px] text-[#737373] hidden xl:inline">generaciones</span>
              <span className="text-[10px] px-2 py-0.5 uppercase font-bold bg-[#6C5CE7]/10 text-[#6C5CE7] rounded-full">
                {subscription.plan}
              </span>
            </button>
          )}

          {/* User Auth Section */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 py-1 px-2.5 rounded-full bg-white hover:bg-[#F0EFEB] border border-[#E5E5E1] transition-all cursor-pointer shadow-xs"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName}
                    className="w-6 h-6 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] flex items-center justify-center font-bold text-xs">
                    {currentUser.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold text-[#171717] max-w-[100px] truncate hidden sm:inline">
                  {currentUser.displayName}
                </span>
                {currentUser.role === 'admin' && (
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                    Admin
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E5E5E1] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#F0EFEB]">
                    <p className="text-xs font-bold text-[#171717] truncate">{currentUser.displayName}</p>
                    <p className="text-[11px] text-[#737373] truncate">{currentUser.email}</p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#6C5CE7] bg-[#6C5CE7]/10 px-2 py-0.5 rounded-full">
                        Plan {subscription.plan.toUpperCase()}
                      </span>
                      {currentUser.role === 'admin' && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                          Dueño / Backoffice
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="py-1">
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setView('dashboard');
                          setActiveTab('admin');
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-amber-800 hover:bg-amber-50/70 flex items-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>Panel Admin & Precios</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setView('dashboard');
                        setActiveTab('home');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#171717] hover:bg-[#F8F7F4] flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#737373]" />
                      <span>Ir al Dashboard</span>
                    </button>

                    <button
                      onClick={() => setUpgradePlanModalOpen(true)}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#171717] hover:bg-[#F8F7F4] flex items-center gap-2 cursor-pointer"
                    >
                      <Crown className="w-4 h-4 text-[#6C5CE7]" />
                      <span>Cambiar Plan / Mejorar</span>
                    </button>
                  </div>

                  <div className="border-t border-[#F0EFEB] pt-1">
                    <button
                      onClick={logoutUser}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAuthModalOpen(true)}
              leftIcon={<User className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Ingresar
            </Button>
          )}

          {/* Primary Call to action */}
          {view === 'landing' ? (
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => setView('onboarding')}
            >
              Crear Estrategia
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView('landing')}
              className="text-xs hidden sm:inline-flex"
            >
              Landing
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
