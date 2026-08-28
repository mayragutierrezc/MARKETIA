import React from 'react';
import {
  Building2,
  Trash2,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  LogOut,
  Mail,
  Compass,
  FileText,
  Video
} from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { GoogleSignInButton } from '../common/GoogleSignInButton';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    business,
    subscription,
    isDemoMode,
    loadDemoData,
    resetAllData,
    setUpgradePlanModalOpen,
    setView,
    setActiveTab
  } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#171717]">Configuración de tu Cuenta</h2>
          <p className="text-sm text-[#737373] mt-1">
            Administrá el perfil de tu negocio, tu suscripción y las integraciones con Google Docs.
          </p>
        </div>
        {isDemoMode && (
          <span className="px-3 py-1 bg-[#F59EBD]/20 text-[#BE185D] text-xs font-bold rounded-full uppercase tracking-wider">
            Modo Demo Activo
          </span>
        )}
      </div>

      {/* Business Profile Card */}
      <Card className="space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E1]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6C5CE7]/10 text-[#6C5CE7] flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#171717]">{business?.name || 'Tu Negocio'}</h3>
              <p className="text-xs text-[#737373]">{business?.category || 'Sin categoría especificada'}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView('onboarding')}
          >
            Re-configurar
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#F8F7F4] border border-[#E5E5E1] space-y-1">
            <span className="text-[#737373] font-medium uppercase tracking-wider text-[10px]">Público Objetivo</span>
            <p className="font-semibold text-[#171717]">{business?.audience?.description || 'Definido en el onboarding'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F7F4] border border-[#E5E5E1] space-y-1">
            <span className="text-[#737373] font-medium uppercase tracking-wider text-[10px]">Producto Principal / Oferta</span>
            <p className="font-semibold text-[#171717]">{business?.offer?.mainProduct || 'Definido en el onboarding'}</p>
          </div>
        </div>
      </Card>

      {/* Google Integration Card */}
      <Card className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#171717]">Integración con Google Docs & Drive</h3>
            <p className="text-xs text-[#737373] leading-relaxed max-w-xl">
              Conectá tu cuenta de Google para exportar calendarios, guiones y estrategias directamente a tus Google Docs oficiales con un solo clic.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <GoogleSignInButton />
        </div>
      </Card>

      {/* Subscription Card */}
      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E1]">
          <div>
            <span className="text-[10px] font-bold text-[#6C5CE7] uppercase tracking-widest">Plan Actual</span>
            <h3 className="text-xl font-extrabold text-[#171717] mt-0.5">
              Plan {subscription.plan.toUpperCase()}
            </h3>
            <p className="text-xs text-[#737373] mt-1">
              {subscription.generationsUsed} de {subscription.generationsLimit === Infinity ? 'Ilimitadas' : subscription.generationsLimit} generaciones IA utilizadas este mes.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setUpgradePlanModalOpen(true)}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Subir a Plan PRO
          </Button>
        </div>
      </Card>

      {/* Demo and Reset Actions */}
      <Card className="space-y-4 border-red-100 bg-red-50/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#EF4444]">Zona de Restablecimiento</h3>
            <p className="text-xs text-[#737373] mt-0.5">
              Podés recargar los datos demo de ejemplo o reiniciar toda la app para comenzar de cero.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadDemoData}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Cargar Demo "Luna Café"
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (confirm('¿Estás seguro de que querés borrar todos los datos locales y reiniciar?')) {
                resetAllData();
              }
            }}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Borrar datos y reiniciar
          </Button>
        </div>
      </Card>
    </div>
  );
};
