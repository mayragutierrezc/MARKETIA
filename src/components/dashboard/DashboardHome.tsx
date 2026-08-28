import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Video,
  Calendar,
  Compass,
  Megaphone,
  BarChart3,
  Bot,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  AlertCircle,
  Play
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card, CardHeader } from '../common/Card';
import { ScoreGauge } from '../common/ScoreGauge';
import { useApp } from '../../context/AppContext';

export const DashboardHome: React.FC = () => {
  const {
    business,
    strategy,
    calendarItems,
    campaigns,
    setActiveTab,
    setSelectedCalendarEventForContent,
    loadDemoData,
    isDemoMode
  } = useApp();

  if (!strategy || !business) {
    return (
      <div className="p-8 text-center max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#6C5CE7]/10 text-[#6C5CE7] flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#171717]">No hay una estrategia activa aún</h2>
        <p className="text-xs text-[#737373]">
          Podés crear una estrategia personalizada con el asistente o cargar la demo de Luna Café.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="primary" size="md" onClick={loadDemoData}>
            Cargar Demo (Luna Café)
          </Button>
        </div>
      </div>
    );
  }

  const upcomingCalendar = calendarItems.slice(0, 3);
  const pendingCount = calendarItems.filter((i) => i.status === 'Pendiente' || i.status === 'Idea').length;
  const activeCampaign = campaigns.find((c) => c.status === 'Activa') || campaigns[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner Greeting - Geometric Balance */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-[#171717]">
            Buenos días, <span className="font-bold">{business.name}</span> 👋
          </h1>
          <p className="text-[#737373] text-xs sm:text-sm mt-1">
            Esto es lo que Marketia recomienda para hoy para maximizar tu alcance y ventas.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isDemoMode && (
            <span className="px-3 py-1 bg-[#F59EBD]/20 text-[#BE185D] text-[10px] font-bold rounded-full uppercase tracking-widest">
              Modo Demo
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab('calendar')}
            leftIcon={<Calendar className="w-3.5 h-3.5" />}
          >
            Ver Calendario
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveTab('reels')}
            leftIcon={<Zap className="w-3.5 h-3.5" />}
          >
            + Nueva Acción
          </Button>
        </div>
      </header>

      {/* 4 Summary Stat Cards - Geometric Balance */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1: Marketing Score with Circular SVG Arc */}
        <div
          onClick={() => setActiveTab('strategy')}
          className="bg-white p-6 rounded-[32px] border border-[#E5E5E1] shadow-xs flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#D0D0CA] transition-all group"
        >
          <div className="relative w-20 h-20 mb-3">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#F8F7F4]"
                strokeDasharray="100, 100"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-[#6C5CE7]"
                strokeDasharray={`${strategy.marketingScore.overall}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-[#171717]">
              {strategy.marketingScore.overall}
            </div>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-[#737373] font-bold">
            Marketing Score
          </span>
        </div>

        {/* Stat 2: Contenidos Pendientes */}
        <div
          onClick={() => setActiveTab('calendar')}
          className="bg-white p-6 rounded-[32px] border border-[#E5E5E1] shadow-xs flex flex-col justify-between cursor-pointer hover:border-[#D0D0CA] transition-all"
        >
          <div>
            <div className="text-4xl font-bold text-[#6C5CE7] mb-1 tracking-tight">
              {pendingCount}
            </div>
            <div className="text-sm font-medium text-[#171717]">Contenidos pendientes</div>
          </div>
          <div className="text-[11px] text-[#737373] mt-3">
            {calendarItems.filter((i) => i.format.toLowerCase().includes('reel')).length} Reels • {calendarItems.filter((i) => !i.format.toLowerCase().includes('reel')).length} Posts
          </div>
        </div>

        {/* Stat 3: Campaña Activa */}
        <div
          onClick={() => setActiveTab('campaigns')}
          className="bg-white p-6 rounded-[32px] border border-[#E5E5E1] shadow-xs flex flex-col justify-between cursor-pointer hover:border-[#D0D0CA] transition-all"
        >
          <div>
            <div className="bg-[#F59EBD]/20 text-[#BE185D] text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block mb-2 uppercase tracking-wider">
              {activeCampaign?.status || 'Activa'}
            </div>
            <div className="text-base font-bold text-[#171717] truncate leading-tight">
              {activeCampaign?.name || 'Campaña Mensual'}
            </div>
          </div>
          <div className="text-xs text-[#737373] mt-2">
            {activeCampaign?.duration || 'En curso (4 días restantes)'}
          </div>
        </div>

        {/* Stat 4: Objetivo Mensual */}
        <div
          onClick={() => setActiveTab('analytics')}
          className="bg-white p-6 rounded-[32px] border border-[#E5E5E1] shadow-xs flex flex-col justify-between cursor-pointer hover:border-[#D0D0CA] transition-all"
        >
          <div>
            <div className="text-xs font-medium text-[#737373] mb-1 uppercase tracking-wider">Objetivo Mensual</div>
            <div className="text-lg font-bold text-[#171717] truncate">
              {business.objectives?.[0] || 'Aumentar Ventas'}
            </div>
          </div>
          <div>
            <div className="h-1.5 w-full bg-[#F8F7F4] rounded-full overflow-hidden mt-3">
              <div className="bg-[#22C55E] h-1.5 rounded-full w-[65%]" />
            </div>
            <p className="text-[10px] text-[#737373] mt-1 text-right font-medium">65% completado</p>
          </div>
        </div>
      </div>

      {/* TODAY'S PRIORITY HERO CARD - Geometric Balance */}
      <div className="bg-white p-8 sm:p-10 rounded-[40px] border border-[#6C5CE7]/30 shadow-xl shadow-[#6C5CE7]/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 hidden sm:block">
          <div className="w-12 h-12 bg-[#F8F7F4] rounded-full flex items-center justify-center text-[#6C5CE7]">
            <Zap className="w-6 h-6 fill-[#6C5CE7]/20" />
          </div>
        </div>

        <h3 className="text-[#6C5CE7] font-bold text-xs uppercase tracking-widest mb-3">
          Prioridad de Hoy
        </h3>

        <p className="text-xl sm:text-2xl font-light leading-snug max-w-2xl mb-6 text-[#171717]">
          Hoy te conviene publicar un{' '}
          <span className="font-bold italic text-[#171717] underline decoration-[#F59EBD] decoration-4">
            Reel Demostrativo
          </span>{' '}
          mostrando la propuesta de {business.offer?.mainProduct || business.name} para activar conversiones inmediatas.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('reels')}
            className="bg-[#6C5CE7] text-white px-8 py-3 rounded-full text-sm font-semibold shadow-lg shadow-[#6C5CE7]/25 hover:opacity-95 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Video className="w-4 h-4" />
            Crear contenido ahora
          </button>
          <button
            onClick={() => setActiveTab('strategy')}
            className="bg-white border border-[#E5E5E1] text-[#171717] px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
          >
            Ver justificación estratégica
          </button>
        </div>
      </div>

      {/* TWO COLUMNS: Opportunities & Next 3 Days Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Strategic Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#6C5CE7]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#171717]">
                Oportunidades Detectadas
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('strategy')}
              className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider hover:underline cursor-pointer"
            >
              Ver estrategia →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {strategy.opportunities?.slice(0, 4).map((op) => (
              <div
                key={op.id}
                className="bg-white p-6 rounded-[32px] border border-[#E5E5E1] shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-[#171717] leading-snug">
                      {op.opportunity}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 uppercase tracking-wider ${
                        op.impact === 'Alto'
                          ? 'bg-[#22C55E]/10 text-[#15803D]'
                          : 'bg-[#F59E0B]/10 text-[#B45309]'
                      }`}
                    >
                      {op.impact === 'Alto' ? 'Alto Impacto' : 'Medio'}
                    </span>
                  </div>
                  <p className="text-xs text-[#737373] leading-relaxed line-clamp-3">
                    {op.recommendedAction}
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (op.opportunity.toLowerCase().includes('reel') || op.opportunity.toLowerCase().includes('video')) {
                      setActiveTab('reels');
                    } else if (op.opportunity.toLowerCase().includes('campañ') || op.opportunity.toLowerCase().includes('combo')) {
                      setActiveTab('campaigns');
                    } else {
                      setActiveTab('strategy');
                    }
                  }}
                  className="text-[#6C5CE7] text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-1.5 transition-all cursor-pointer self-start"
                >
                  Aplicar acción →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Próximas Publicaciones */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#6C5CE7]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#171717]">
                Próximas Publicaciones
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('calendar')}
              className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider hover:underline cursor-pointer"
            >
              Ver mes →
            </button>
          </div>

          <div className="space-y-3">
            {upcomingCalendar.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-[28px] border border-[#E5E5E1] shadow-xs space-y-2 hover:border-[#D0D0CA] transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#6C5CE7]">
                    Día {item.day} • {item.dayName}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#F8F7F4] text-[#737373] border border-[#E5E5E1]">
                    {item.format}
                  </span>
                </div>

                <p className="text-xs font-bold text-[#171717] line-clamp-2">
                  {item.topic}
                </p>

                <div className="flex items-center justify-between text-[11px] text-[#737373] pt-1">
                  <span className="text-[#737373]">
                    {item.platform}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCalendarEventForContent(item);
                      if (item.format.toLowerCase().includes('reel')) {
                        setActiveTab('reels');
                      } else {
                        setActiveTab('content');
                      }
                    }}
                    className="text-[#6C5CE7] font-bold hover:underline cursor-pointer"
                  >
                    Crear copy →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK ACCESS COPILOT TEASER */}
      <div className="p-5 rounded-2xl bg-white border border-[#EAE7DF] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-[#6C5CE7]/10 text-[#6C5CE7]">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#171717]">
              ¿Dudas sobre cómo vender más este mes?
            </h4>
            <p className="text-xs text-[#737373] mt-0.5">
              Tu copiloto de marketing conoce a fondo tu negocio y te responde al instante.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveTab('assistant')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Consultar al Asistente
        </Button>
      </div>
    </div>
  );
};
