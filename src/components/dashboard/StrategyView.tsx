import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Users,
  Target,
  FileCheck,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  Copy,
  Check,
  RefreshCw,
  Share2,
  ChevronDown,
  Layers,
  Award,
  FileText
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card, CardHeader } from '../common/Card';
import { ScoreGauge } from '../common/ScoreGauge';
import { GoogleDocsExportModal, ExportContentType } from '../common/GoogleDocsExportModal';
import { useApp } from '../../context/AppContext';

export const StrategyView: React.FC = () => {
  const { strategy, business, setStrategy, setCalendarItems, setCampaigns, addToast, consumeGeneration } = useApp();
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [exportModalOpen, setExportModalOpen] = useState(false);

  if (!strategy || !business) {
    return null;
  }

  const handleOpenGoogleDocsExport = () => {
    setExportModalOpen(true);
  };

  const handleCopyStrategy = () => {
    const text = `ESTRATEGIA DE MARKETING - ${business.name.toUpperCase()}
Score General: ${strategy.marketingScore.overall}/100

RESUMEN EJECUTIVO:
${strategy.businessAnalysis.summary}

PROPUESTA DE VALOR:
${strategy.businessAnalysis.valueProposition}

BUYER PERSONA:
${strategy.businessAnalysis.buyerPersona.name} (${strategy.businessAnalysis.buyerPersona.archetype})
${strategy.businessAnalysis.buyerPersona.demographics}
Dolores: ${strategy.businessAnalysis.buyerPersona.painPoints.join(', ')}

PILARES DE CONTENIDO:
${strategy.contentStrategy.pillars.map((p) => `- ${p.name} (${p.percentage}%): ${p.description}`).join('\n')}

PRIORIDADES ESTRATÉGICAS:
${strategy.strategicPriorities.map((p, i) => `${i + 1}. ${p.title} (${p.impact})`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast({ type: 'success', title: 'Estrategia copiada al portapapeles' });
    setTimeout(() => setCopied(false), 3000);
  };

  const handleRegenerateStrategy = async () => {
    if (!consumeGeneration()) return;
    setIsRegenerating(true);
    try {
      const res = await fetch('/api/strategy/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business })
      });
      const data = await res.json();
      setStrategy(data);
      if (data.calendar30Days) setCalendarItems(data.calendar30Days);
      if (data.campaigns) setCampaigns(data.campaigns);
      addToast({ type: 'success', title: 'Estrategia recalculada con IA' });
    } catch (err) {
      addToast({ type: 'error', title: 'No se pudo regenerar en este momento' });
    } finally {
      setIsRegenerating(false);
    }
  };

  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => ({ ...prev, [stepKey]: !prev[stepKey] }));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#171717] font-display">
              Estrategia Integral de Marketing
            </h1>
            <Badge variant="primary" size="sm">
              IA Personalizada
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#737373] mt-0.5">
            Diagnóstico, posicionamiento, buyer persona y pilares diseñados para {business.name}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            className="bg-[#4285F4] hover:bg-[#3367D6] text-white border-transparent shadow-2xs"
            leftIcon={<FileText className="w-3.5 h-3.5" />}
            onClick={handleOpenGoogleDocsExport}
          >
            Exportar a Google Docs
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
            onClick={handleCopyStrategy}
          >
            {copied ? 'Copiado' : 'Copiar Resumen'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            isLoading={isRegenerating}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={handleRegenerateStrategy}
          >
            Regenerar con IA
          </Button>
        </div>
      </div>

      {/* MARKETING SCORE GAUGE */}
      <ScoreGauge score={strategy.marketingScore} />

      {/* EXECUTIVE SUMMARY & VALUE PROPOSITION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-4">
          <CardHeader
            title="Diagnóstico & Posicionamiento"
            icon={<Compass className="w-5 h-5" />}
            badge={<Badge variant="primary">Estrategia</Badge>}
          />
          <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
            {strategy.businessAnalysis.summary}
          </p>

          <div className="pt-3 border-t border-[#EAE7DF] space-y-3">
            <div>
              <span className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider">
                Propuesta de Valor Única
              </span>
              <p className="text-sm font-bold text-[#171717] mt-1">
                "{strategy.businessAnalysis.valueProposition}"
              </p>
            </div>

            <div>
              <span className="text-xs font-bold text-[#737373] uppercase tracking-wider">
                Posicionamiento en la Mente del Cliente
              </span>
              <p className="text-xs text-[#525252] mt-0.5">
                {strategy.businessAnalysis.positioning}
              </p>
            </div>
          </div>
        </Card>

        {/* BUYER PERSONA CARD */}
        <Card className="space-y-4 bg-gradient-to-br from-white to-[#FAF9F6]">
          <CardHeader
            title="Buyer Persona"
            icon={<Users className="w-5 h-5" />}
            badge={<Badge variant="secondary">Perfil Ideal</Badge>}
          />

          <div className="space-y-3">
            <div>
              <h4 className="text-base font-bold text-[#171717]">
                {strategy.businessAnalysis.buyerPersona.name}
              </h4>
              <p className="text-xs text-[#6C5CE7] font-semibold">
                {strategy.businessAnalysis.buyerPersona.archetype}
              </p>
              <p className="text-xs text-[#737373] mt-1">
                {strategy.businessAnalysis.buyerPersona.demographics}
              </p>
            </div>

            <div className="pt-2 border-t border-[#EAE7DF] space-y-2">
              <span className="text-[11px] font-bold text-[#EF4444] uppercase tracking-wider">
                Dolores & Fricciones:
              </span>
              <ul className="text-xs text-[#525252] space-y-1">
                {strategy.businessAnalysis.buyerPersona.painPoints.map((pain, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#EF4444] mt-0.5">•</span>
                    <span>{pain}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-[#EAE7DF] space-y-1.5">
              <span className="text-[11px] font-bold text-[#22C55E] uppercase tracking-wider">
                Canales Favoritos:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {strategy.businessAnalysis.buyerPersona.preferredChannels.map((ch, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-[#EAE7DF] text-[#171717] font-medium">
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* CONTENT PILLARS */}
      <Card className="space-y-5">
        <CardHeader
          title="Pilares de Contenido (Distribución Semanal)"
          subtitle="Proporción recomendada para balancear educación, interacción y ventas."
          icon={<Layers className="w-5 h-5" />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {strategy.contentStrategy.pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAE7DF] space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs sm:text-sm text-[#171717]">{pillar.name}</h4>
                  <span className="text-xs font-extrabold text-[#6C5CE7]">{pillar.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-[#EAE7DF] rounded-full my-2 overflow-hidden">
                  <div
                    className="h-full bg-[#6C5CE7] rounded-full"
                    style={{ width: `${pillar.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-[#737373] leading-relaxed">{pillar.description}</p>
              </div>

              {pillar.examples && (
                <div className="pt-2 border-t border-[#EAE7DF] space-y-1">
                  <span className="text-[10px] font-bold text-[#A3A3A3] uppercase">Ideas:</span>
                  <ul className="text-[11px] text-[#525252] space-y-0.5">
                    {pillar.examples.map((ex, i) => (
                      <li key={i} className="truncate">💡 {ex}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#EAE7DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#525252]">
          <div>
            <span className="font-bold text-[#171717]">Tono de Comunicación:</span> {strategy.contentStrategy.tone}
          </div>
          <div>
            <span className="font-bold text-[#171717]">Frecuencia Sugerida:</span> {strategy.contentStrategy.frequency}
          </div>
        </div>
      </Card>

      {/* 5 STRATEGIC PRIORITIES (Interactive) */}
      <Card className="space-y-4">
        <CardHeader
          title="Tus 5 Prioridades Estratégicas"
          subtitle="Acciones de alto impacto ordenadas por orden de ejecución para los próximos 30 días."
          icon={<Target className="w-5 h-5" />}
        />

        <div className="space-y-3">
          {strategy.strategicPriorities.map((priority, index) => (
            <div
              key={priority.id}
              className="p-4 rounded-xl bg-white border border-[#EAE7DF] hover:border-[#D5D0C2] transition-all space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#6C5CE7] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <h4 className="text-sm font-bold text-[#171717]">{priority.title}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={priority.impact === 'Crítico' ? 'danger' : 'primary'} size="sm">
                    {priority.impact}
                  </Badge>
                  <span className="text-xs text-[#737373] font-medium bg-[#FAF9F6] px-2 py-0.5 rounded-md border border-[#EAE7DF]">
                    {priority.timeframe}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#525252] leading-relaxed pl-8">
                {priority.description}
              </p>

              {priority.actionSteps && (
                <div className="pl-8 pt-1 space-y-1.5">
                  {priority.actionSteps.map((step, sIdx) => {
                    const stepKey = `${priority.id}-${sIdx}`;
                    const isDone = !!completedSteps[stepKey];
                    return (
                      <div
                        key={sIdx}
                        onClick={() => toggleStep(stepKey)}
                        className="flex items-center gap-2 text-xs text-[#4A4A4A] cursor-pointer group"
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isDone ? 'bg-[#22C55E] border-[#22C55E] text-white' : 'border-[#CCC8BD] group-hover:border-[#6C5CE7]'
                          }`}
                        >
                          {isDone && <Check className="w-3 h-3" />}
                        </div>
                        <span className={isDone ? 'line-through text-[#A3A3A3]' : ''}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* SWOT / FODA GRID */}
      <Card className="space-y-4">
        <CardHeader
          title="Matriz FODA del Negocio"
          subtitle="Fortalezas, Oportunidades, Debilidades y Amenazas identificadas por la IA."
          icon={<Award className="w-5 h-5" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="p-4 rounded-xl bg-[#22C55E]/5 border border-[#22C55E]/20 space-y-2">
            <h4 className="text-xs font-bold text-[#15803D] uppercase tracking-wider flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Fortalezas (Internas)
            </h4>
            <ul className="text-xs text-[#374151] space-y-1.5">
              {strategy.businessAnalysis.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#22C55E] mt-0.5">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="p-4 rounded-xl bg-[#6C5CE7]/5 border border-[#6C5CE7]/20 space-y-2">
            <h4 className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Oportunidades (Externas)
            </h4>
            <ul className="text-xs text-[#374151] space-y-1.5">
              {strategy.businessAnalysis.opportunities.map((o, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#6C5CE7] mt-0.5">•</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="p-4 rounded-xl bg-[#F59E0B]/5 border border-[#F59E0B]/20 space-y-2">
            <h4 className="text-xs font-bold text-[#B45309] uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Debilidades (Internas)
            </h4>
            <ul className="text-xs text-[#374151] space-y-1.5">
              {strategy.businessAnalysis.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#F59E0B] mt-0.5">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Threats / Risks */}
          <div className="p-4 rounded-xl bg-[#EF4444]/5 border border-[#EF4444]/20 space-y-2">
            <h4 className="text-xs font-bold text-[#B91C1C] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> Amenazas (Externas)
            </h4>
            <ul className="text-xs text-[#374151] space-y-1.5">
              {strategy.businessAnalysis.risks.map((r, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#EF4444] mt-0.5">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Google Docs Export Modal */}
      <GoogleDocsExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        exportPayload={{
          type: 'strategy',
          data: { business, strategy }
        }}
      />
    </div>
  );
};
