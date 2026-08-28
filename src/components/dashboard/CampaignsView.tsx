import React, { useState } from 'react';
import {
  Megaphone,
  Sparkles,
  Plus,
  Target,
  DollarSign,
  Calendar,
  Layers,
  Copy,
  Check,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card, CardHeader } from '../common/Card';
import { Modal } from '../common/Modal';
import { GoogleDocsExportModal } from '../common/GoogleDocsExportModal';
import { useApp } from '../../context/AppContext';
import { CampaignItem } from '../../types';

export const CampaignsView: React.FC = () => {
  const { campaigns, addCampaign, updateCampaignStatus, business, addToast, consumeGeneration } = useApp();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignItem>(() => {
    return campaigns[0] || null;
  });

  // Modal Form State
  const [campObjective, setCampObjective] = useState('Aumentar ventas de producto principal');
  const [campProduct, setCampProduct] = useState(business?.offer?.mainProduct || '');
  const [campAudience, setCampAudience] = useState(business?.audience?.problems || 'Clientes locales y nuevos visitantes');
  const [campBudget, setCampBudget] = useState('$40.000 ARS / $50 USD');
  const [campDuration, setCampDuration] = useState('7 días');
  const [campPlatform, setCampPlatform] = useState('Instagram & WhatsApp');

  const handleGenerateCampaign = async () => {
    if (!campProduct.trim()) {
      addToast({ type: 'warning', title: 'Ingresá el producto u oferta para la campaña' });
      return;
    }
    if (!consumeGeneration()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/campaigns/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objective: campObjective,
          product: campProduct,
          targetAudience: campAudience,
          budget: campBudget,
          duration: campDuration,
          platform: campPlatform,
          businessName: business?.name || 'Mi Negocio'
        })
      });

      const newCamp = await res.json();
      addCampaign(newCamp);
      setSelectedCampaign(newCamp);
      setCreateModalOpen(false);
      addToast({ type: 'success', title: '¡Campaña generada con éxito!' });
    } catch (err) {
      addToast({ type: 'error', title: 'Error al generar la campaña' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#171717] font-display">
              Campañas de Marketing & Publicidad
            </h1>
            <Badge variant="success" size="sm">
              Estructura Completa
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#737373] mt-0.5">
            Ofertas irresistibles, copies para anuncios, desglose de presupuesto y KPIs medibles.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            className="bg-[#4285F4] hover:bg-[#3367D6] text-white border-transparent shadow-2xs"
            leftIcon={<FileText className="w-3.5 h-3.5" />}
            onClick={() => setExportModalOpen(true)}
          >
            Exportar a Google Docs
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setCreateModalOpen(true)}
          >
            Crear Nueva Campaña con IA
          </Button>
        </div>
      </div>

      {/* Campaigns Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {campaigns.map((camp) => {
          const isSelected = selectedCampaign?.id === camp.id;
          return (
            <div
              key={camp.id}
              onClick={() => setSelectedCampaign(camp)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'border-[#6C5CE7] bg-white shadow-md ring-2 ring-[#6C5CE7]/15'
                  : 'border-[#EAE7DF] bg-[#FAF9F6] hover:border-[#D0CCC0]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      camp.status === 'Activa'
                        ? 'success'
                        : camp.status === 'Planificada'
                        ? 'primary'
                        : 'outline'
                    }
                    size="sm"
                  >
                    {camp.status}
                  </Badge>
                  <span className="text-[11px] text-[#737373] font-medium">{camp.duration}</span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-[#171717] mt-2 line-clamp-1">
                  {camp.name}
                </h3>
                <p className="text-xs text-[#737373] line-clamp-2 mt-1 leading-relaxed">
                  {camp.concept}
                </p>
              </div>

              <div className="pt-2 border-t border-[#EAE7DF] flex items-center justify-between text-xs">
                <span className="text-[#6C5CE7] font-semibold">{camp.channels?.[0]}</span>
                <span className="font-bold text-[#171717]">{camp.budgetSuggested || 'Orgánico'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed View of Selected Campaign */}
      {selectedCampaign && (
        <Card className="space-y-6 bg-white border-[#EAE7DF]">
          {/* Campaign Title & Status Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE7DF]">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="primary">{selectedCampaign.status}</Badge>
                <span className="text-xs text-[#737373]">Duración: {selectedCampaign.duration}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#171717] font-display mt-1">
                {selectedCampaign.name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#737373] font-semibold">Cambiar Estado:</span>
              <select
                value={selectedCampaign.status}
                onChange={(e) => {
                  const newStatus = e.target.value as CampaignItem['status'];
                  updateCampaignStatus(selectedCampaign.id, newStatus);
                  setSelectedCampaign({ ...selectedCampaign, status: newStatus });
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#EAE7DF] bg-[#FAF9F6] outline-none cursor-pointer"
              >
                <option value="Activa">Activa</option>
                <option value="Planificada">Planificada</option>
                <option value="Borrador">Borrador</option>
                <option value="Completada">Completada</option>
              </select>
            </div>
          </div>

          {/* Concept & Offer Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAE7DF] space-y-1.5">
              <span className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider">
                Concepto Central:
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[#171717] leading-relaxed">
                "{selectedCampaign.concept}"
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#22C55E]/5 border border-[#22C55E]/20 space-y-1.5">
              <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider">
                Oferta / Gancho Promocional:
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#171717] leading-relaxed">
                {selectedCampaign.offer}
              </p>
            </div>
          </div>

          {/* Key Message */}
          <div className="p-3.5 rounded-xl bg-white border border-[#EAE7DF] text-xs text-[#525252]">
            <span className="font-bold text-[#171717]">Mensaje Clave:</span> {selectedCampaign.keyMessage}
          </div>

          {/* Copies for Ads / A/B Testing */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#6C5CE7]" /> Copies Publicitarios Sugeridos (Prueba A/B):
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedCampaign.copies?.map((copy, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAE7DF] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#6C5CE7]">Variación {String.fromCharCode(65 + i)}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(copy);
                        addToast({ type: 'success', title: 'Copy copiado' });
                      }}
                      className="text-[#737373] hover:text-[#171717] flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copiar
                    </button>
                  </div>
                  <p className="text-[#171717] leading-relaxed italic">"{copy}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Content Ideas & KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Content Ideas */}
            <div className="p-4 rounded-xl bg-white border border-[#EAE7DF] space-y-2">
              <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                Piezas de Contenido a Producir:
              </h4>
              <ul className="text-xs text-[#525252] space-y-1.5">
                {selectedCampaign.contentIdeas?.map((idea, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#6C5CE7] mt-0.5">•</span>
                    <span>{idea}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* KPIs & Budget */}
            <div className="p-4 rounded-xl bg-white border border-[#EAE7DF] space-y-3">
              <div>
                <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                  Presupuesto & Distribución:
                </h4>
                <p className="text-xs font-bold text-[#6C5CE7] mt-1">
                  {selectedCampaign.budgetSuggested}
                </p>
              </div>

              <div className="pt-2 border-t border-[#EAE7DF]">
                <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                  Métricas de Éxito (KPIs):
                </h4>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedCampaign.kpis?.map((kpi, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-[#22C55E]/10 text-[#15803D] font-semibold"
                    >
                      ✓ {kpi}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Modal: Create Campaign Wizard */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Crear Nueva Campaña de Marketing con IA"
        subtitle="Definí el objetivo y recibí una estrategia publicitaria completa."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              1. Objetivo de la campaña
            </label>
            <select
              value={campObjective}
              onChange={(e) => setCampObjective(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#EAE7DF] text-xs bg-white focus:border-[#6C5CE7] outline-none"
            >
              <option>Aumentar ventas de producto principal</option>
              <option>Atraer clientes nuevos con beneficio de bienvenida</option>
              <option>Promoción especial de fin de mes o temporada</option>
              <option>Lanzamiento de nuevo producto / servicio</option>
              <option>Reactivar clientes inactivos (Fidelización)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              2. Producto u Oferta a promocionar *
            </label>
            <input
              type="text"
              value={campProduct}
              onChange={(e) => setCampProduct(e.target.value)}
              placeholder="Ej: Combo 2x1 en Flat White matutino"
              className="w-full px-3.5 py-2 rounded-xl border border-[#EAE7DF] text-xs focus:border-[#6C5CE7] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                Presupuesto estimado
              </label>
              <input
                type="text"
                value={campBudget}
                onChange={(e) => setCampBudget(e.target.value)}
                placeholder="Ej: $30.000 ARS"
                className="w-full px-3.5 py-2 rounded-xl border border-[#EAE7DF] text-xs focus:border-[#6C5CE7] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">Duración</label>
              <input
                type="text"
                value={campDuration}
                onChange={(e) => setCampDuration(e.target.value)}
                placeholder="Ej: 7 días / 14 días"
                className="w-full px-3.5 py-2 rounded-xl border border-[#EAE7DF] text-xs focus:border-[#6C5CE7] outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isGenerating}
              rightIcon={<Sparkles className="w-3.5 h-3.5" />}
              onClick={handleGenerateCampaign}
            >
              Generar Campaña
            </Button>
          </div>
        </div>
      </Modal>

      {/* Google Docs Export Modal */}
      {business && (
        <GoogleDocsExportModal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          exportPayload={{
            type: 'campaigns',
            data: { business, campaigns }
          }}
        />
      )}
    </div>
  );
};
