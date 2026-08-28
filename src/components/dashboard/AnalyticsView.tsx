import React, { useState } from 'react';
import {
  BarChart3,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  DollarSign,
  Users,
  Target,
  RefreshCw,
  Info
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card, CardHeader } from '../common/Card';
import { useApp } from '../../context/AppContext';
import { AnalyticsRecord, AnalyticsInsights } from '../../types';

export const AnalyticsView: React.FC = () => {
  const { analyticsData, setAnalyticsData, analyticsInsights, setAnalyticsInsights, business, addToast, consumeGeneration } = useApp();

  const [metricsForm, setMetricsForm] = useState<AnalyticsRecord>(analyticsData);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Calculations
  const followers = Number(metricsForm.followers) || 0;
  const reach = Number(metricsForm.reach) || 0;
  const impressions = Number(metricsForm.impressions) || 0;
  const engagement = Number(metricsForm.engagement) || 0;
  const clicks = Number(metricsForm.clicks) || 0;
  const leads = Number(metricsForm.leads) || 0;
  const sales = Number(metricsForm.sales) || 0;
  const investment = Number(metricsForm.investment) || 0;

  const calculatedEngagementRate = reach > 0 ? Number(((engagement / reach) * 100).toFixed(2)) : 0;
  const calculatedCTR = impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0;
  const calculatedConversionRate =
    clicks > 0 ? Number(((sales / clicks) * 100).toFixed(2)) : leads > 0 ? Number(((sales / leads) * 100).toFixed(2)) : 0;
  const calculatedCAC = sales > 0 && investment > 0 ? Math.round(investment / sales) : 0;
  const calculatedROAS = investment > 0 && sales > 0 ? Number(((sales * 15000) / investment).toFixed(1)) : 0;

  const handleAnalyze = async () => {
    if (!consumeGeneration()) return;
    setIsAnalyzing(true);
    setAnalyticsData(metricsForm);

    try {
      const res = await fetch('/api/analytics/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metrics: metricsForm,
          businessName: business?.name,
          category: business?.category
        })
      });
      const data = await res.json();
      setAnalyticsInsights(data);
      addToast({ type: 'success', title: 'Diagnóstico analítico generado con éxito' });
    } catch (err) {
      addToast({ type: 'error', title: 'Error al procesar métricas' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#171717] font-display">
              Analytics & Diagnóstico Inteligente
            </h1>
            <Badge variant="primary" size="sm">
              Traductor a Lenguaje Humano
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#737373] mt-0.5">
            Ingresá tus métricas reales y MARKETIA te explicará exactamente qué significa y qué ajustar.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          isLoading={isAnalyzing}
          leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          onClick={handleAnalyze}
        >
          Diagnosticar con IA
        </Button>
      </div>

      {/* 5 Calculated KPI Highlight Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-[#EAE7DF] space-y-1">
          <span className="text-[11px] font-semibold text-[#737373] block truncate">
            Engagement Rate
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-[#6C5CE7]">
            {calculatedEngagementRate}%
          </p>
          <p className="text-[10px] text-[#737373]">
            {calculatedEngagementRate >= 5 ? '🔥 Alto' : calculatedEngagementRate >= 2 ? '👍 Bueno' : '📉 Mejorable'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#EAE7DF] space-y-1">
          <span className="text-[11px] font-semibold text-[#737373] block truncate">
            CTR (Clics/Impr.)
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-[#171717]">
            {calculatedCTR}%
          </p>
          <p className="text-[10px] text-[#737373]">Tasa de interés</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#EAE7DF] space-y-1">
          <span className="text-[11px] font-semibold text-[#737373] block truncate">
            Tasa Conversión
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-[#22C55E]">
            {calculatedConversionRate}%
          </p>
          <p className="text-[10px] text-[#737373]">Ventas por contacto</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#EAE7DF] space-y-1">
          <span className="text-[11px] font-semibold text-[#737373] block truncate">
            CAC Estimado
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-[#171717]">
            ${calculatedCAC.toLocaleString()}
          </p>
          <p className="text-[10px] text-[#737373]">Costo por cliente</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#EAE7DF] space-y-1">
          <span className="text-[11px] font-semibold text-[#737373] block truncate">
            ROAS Proyectado
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-[#F59E0B]">
            {calculatedROAS}x
          </p>
          <p className="text-[10px] text-[#737373]">Retorno de inversión</p>
        </div>
      </div>

      {/* Main Grid: Input Form (5 cols) & AI Interpretation (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: 5 Cols */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="space-y-4">
            <CardHeader
              title="Tus Métricas Actuales"
              subtitle="Copia los datos de tu Instagram / Meta Ads"
              icon={<BarChart3 className="w-4 h-4" />}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#171717] mb-1">
                  Seguidores
                </label>
                <input
                  type="number"
                  value={metricsForm.followers}
                  onChange={(e) =>
                    setMetricsForm({ ...metricsForm, followers: Number(e.target.value) })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-[#EAE7DF] text-xs focus:border-[#6C5CE7] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#171717] mb-1">
                  Alcance (Cuentas)
                </label>
                <input
                  type="number"
                  value={metricsForm.reach}
                  onChange={(e) =>
                    setMetricsForm({ ...metricsForm, reach: Number(e.target.value) })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-[#EAE7DF] text-xs focus:border-[#6C5CE7] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#171717] mb-1">
                  Impresiones
                </label>
                <input
                  type="number"
                  value={metricsForm.impressions}
                  onChange={(e) =>
                    setMetricsForm({ ...metricsForm, impressions: Number(e.target.value) })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-[#EAE7DF] text-xs focus:border-[#6C5CE7] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#171717] mb-1">
                  Interacciones (Likes/Com.)
                </label>
                <input
                  type="number"
                  value={metricsForm.engagement}
                  onChange={(e) =>
                    setMetricsForm({ ...metricsForm, engagement: Number(e.target.value) })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-[#EAE7DF] text-xs focus:border-[#6C5CE7] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#171717] mb-1">
                  Clics en enlace
                </label>
                <input
                  type="number"
                  value={metricsForm.clicks}
                  onChange={(e) =>
                    setMetricsForm({ ...metricsForm, clicks: Number(e.target.value) })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-[#EAE7DF] text-xs focus:border-[#6C5CE7] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#171717] mb-1">
                  Consultas / Leads
                </label>
                <input
                  type="number"
                  value={metricsForm.leads}
                  onChange={(e) =>
                    setMetricsForm({ ...metricsForm, leads: Number(e.target.value) })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-[#EAE7DF] text-xs focus:border-[#6C5CE7] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#171717] mb-1">
                  Ventas cerradas
                </label>
                <input
                  type="number"
                  value={metricsForm.sales}
                  onChange={(e) =>
                    setMetricsForm({ ...metricsForm, sales: Number(e.target.value) })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-[#EAE7DF] text-xs focus:border-[#6C5CE7] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#171717] mb-1">
                  Inversión publicitaria ($)
                </label>
                <input
                  type="number"
                  value={metricsForm.investment}
                  onChange={(e) =>
                    setMetricsForm({ ...metricsForm, investment: Number(e.target.value) })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-[#EAE7DF] text-xs focus:border-[#6C5CE7] outline-none"
                />
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isAnalyzing}
              rightIcon={<Sparkles className="w-4 h-4" />}
              onClick={handleAnalyze}
            >
              Actualizar y Analizar con IA
            </Button>
          </Card>
        </div>

        {/* Right AI Diagnostics: 7 Cols */}
        <div className="lg:col-span-7 space-y-4">
          {analyticsInsights ? (
            <Card className="space-y-5 bg-white border-[#EAE7DF]">
              <div className="pb-4 border-b border-[#EAE7DF]">
                <div className="flex items-center gap-2">
                  <Badge variant="primary">Diagnóstico Ejecutivo</Badge>
                  {analyticsInsights.isOrientative && (
                    <Badge variant="warning">Pocos datos • Guía orientativa</Badge>
                  )}
                </div>
                <h3 className="text-lg font-bold text-[#171717] mt-1.5">
                  ¿Qué significan estos números para {business?.name}?
                </h3>
                <p className="text-xs text-[#525252] leading-relaxed mt-1">
                  {analyticsInsights.summary}
                </p>
              </div>

              {/* 4 Pillars of Action */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Qué funciona */}
                <div className="p-4 rounded-xl bg-[#22C55E]/5 border border-[#22C55E]/20 space-y-2">
                  <h4 className="text-xs font-bold text-[#15803D] uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 1. Qué está funcionando
                  </h4>
                  <ul className="text-xs text-[#374151] space-y-1.5">
                    {analyticsInsights.working?.map((w, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#22C55E] mt-0.5">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Qué falla */}
                <div className="p-4 rounded-xl bg-[#EF4444]/5 border border-[#EF4444]/20 space-y-2">
                  <h4 className="text-xs font-bold text-[#B91C1C] uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> 2. Dónde hay fricción / falla
                  </h4>
                  <ul className="text-xs text-[#374151] space-y-1.5">
                    {analyticsInsights.failing?.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#EF4444] mt-0.5">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Qué cambiar de inmediato */}
                <div className="p-4 rounded-xl bg-[#6C5CE7]/5 border border-[#6C5CE7]/20 space-y-2">
                  <h4 className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" /> 3. Qué deberías cambiar
                  </h4>
                  <ul className="text-xs text-[#374151] space-y-1.5">
                    {analyticsInsights.shouldChange?.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#6C5CE7] mt-0.5">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. Qué probar el próximo mes */}
                <div className="p-4 rounded-xl bg-[#F59E0B]/5 border border-[#F59E0B]/20 space-y-2">
                  <h4 className="text-xs font-bold text-[#B45309] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> 4. Qué experimentos probar
                  </h4>
                  <ul className="text-xs text-[#374151] space-y-1.5">
                    {analyticsInsights.shouldTest?.map((t, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#F59E0B] mt-0.5">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-[#EAE7DF] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#6C5CE7]/10 text-[#6C5CE7] flex items-center justify-center mx-auto">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#171717]">Diagnóstico listo para calcular</h4>
              <p className="text-xs text-[#737373] max-w-sm mx-auto">
                Ajustá las métricas de tu negocio a la izquierda y hacé clic en "Diagnosticar con IA" para recibir recomendaciones personalizadas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
