import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { ToastContainer } from './components/common/Toast';
import { PlanUpgradeModal } from './components/common/PlanUpgradeModal';
import { AuthModal } from './components/common/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { DashboardHome } from './components/dashboard/DashboardHome';
import { StrategyView } from './components/dashboard/StrategyView';
import { ContentView } from './components/dashboard/ContentView';
import { ReelsGeneratorView } from './components/dashboard/ReelsGeneratorView';
import { CalendarView } from './components/dashboard/CalendarView';
import { CampaignsView } from './components/dashboard/CampaignsView';
import { AnalyticsView } from './components/dashboard/AnalyticsView';
import { AssistantView } from './components/dashboard/AssistantView';
import { SettingsView } from './components/dashboard/SettingsView';
import { AdminPortalView } from './components/dashboard/AdminPortalView';
import { Button } from './components/common/Button';
import { Play, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { view, activeTab, business, loadDemoData, setView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F4] text-[#171717]">
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Router */}
      {view === 'landing' && (
        <>
          <LandingPage />
          <Footer />
        </>
      )}

      {view === 'onboarding' && (
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
          <OnboardingWizard />
        </main>
      )}

      {view === 'dashboard' && (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Left Sidebar */}
          <Sidebar />

          {/* Center Main Dashboard Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto min-h-[calc(100vh-4rem)]">
            {!business ? (
              <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-[32px] border border-[#E5E5E1] text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#171717]">Aún no configuraste tu negocio</h3>
                <p className="text-xs text-[#737373] leading-relaxed">
                  Creá tu perfil en 3 minutos para obtener tu estrategia y calendario, o explorá la demo de Luna Café.
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <Button variant="primary" onClick={() => setView('onboarding')}>
                    Crear mi estrategia
                  </Button>
                  <Button variant="outline" onClick={loadDemoData} leftIcon={<Play className="w-4 h-4 text-[#6C5CE7]" />}>
                    Cargar demo de Luna Café
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {activeTab === 'home' && <DashboardHome />}
                {activeTab === 'strategy' && <StrategyView />}
                {activeTab === 'content' && <ContentView />}
                {activeTab === 'reels' && <ReelsGeneratorView />}
                {activeTab === 'calendar' && <CalendarView />}
                {activeTab === 'campaigns' && <CampaignsView />}
                {activeTab === 'analytics' && <AnalyticsView />}
                {activeTab === 'assistant' && <AssistantView />}
                {activeTab === 'admin' && <AdminPortalView />}
                {activeTab === 'settings' && <SettingsView />}
              </>
            )}
          </main>

          {/* Mobile Bottom Bar */}
          <MobileBottomNav />
        </div>
      )}

      {/* Global Modals & Toast System */}
      <PlanUpgradeModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
