import React from 'react';
import { MarketingScore } from '../../types';
import { Sparkles, TrendingUp, Award } from 'lucide-react';

interface ScoreGaugeProps {
  score: MarketingScore;
  size?: 'compact' | 'full';
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, size = 'full' }) => {
  const getScoreColor = (val: number) => {
    if (val >= 80) return 'text-[#22C55E] bg-[#22C55E]';
    if (val >= 60) return 'text-[#6C5CE7] bg-[#6C5CE7]';
    if (val >= 40) return 'text-[#F59E0B] bg-[#F59E0B]';
    return 'text-[#EF4444] bg-[#EF4444]';
  };

  const getScoreLevel = (val: number) => {
    if (val >= 85) return 'Excelente';
    if (val >= 70) return 'Saludable & Competitivo';
    if (val >= 50) return 'Con Alto Potencial';
    return 'Requiere Optimización Urgente';
  };

  const categories = [
    { label: 'Branding', value: score.branding, icon: '✨' },
    { label: 'Contenido', value: score.contenido, icon: '📱' },
    { label: 'Oferta', value: score.oferta, icon: '💎' },
    { label: 'Conversión', value: score.conversion, icon: '🎯' },
    { label: 'Redes Sociales', value: score.redesSociales, icon: '🚀' },
    { label: 'Estrategia', value: score.estrategia, icon: '🧭' }
  ];

  if (size === 'compact') {
    return (
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] font-extrabold text-base border-2 border-[#6C5CE7]/30">
          {score.overall}
        </div>
        <div>
          <div className="text-xs font-semibold text-[#171717] flex items-center gap-1">
            Marketing Score <Sparkles className="w-3 h-3 text-[#F59EBD]" />
          </div>
          <p className="text-[11px] text-[#737373]">{getScoreLevel(score.overall)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] border border-[#E5E5E1] p-6 md:p-8 shadow-xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#E5E5E1]">
        <div className="flex items-center gap-5">
          {/* Circular Score Highlight */}
          <div className="relative flex flex-col items-center justify-center w-24 h-24 rounded-full bg-[#6C5CE7] text-white shadow-md shrink-0">
            <span className="text-3xl font-extrabold tracking-tight">{score.overall}</span>
            <span className="text-[10px] font-bold opacity-90 uppercase tracking-widest">/ 100</span>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] text-xs font-bold uppercase tracking-wider mb-1">
              <Award className="w-3.5 h-3.5" /> Diagnóstico de Madurez
            </div>
            <h4 className="text-xl font-bold text-[#171717] tracking-tight">
              Marketing Score: {getScoreLevel(score.overall)}
            </h4>
            <p className="text-xs md:text-sm text-[#737373] mt-1 max-w-xl leading-relaxed">
              {score.summary}
            </p>
          </div>
        </div>

        <div className="bg-[#F8F7F4] border border-[#E5E5E1] rounded-2xl px-5 py-3 text-right hidden sm:block shrink-0">
          <span className="text-xs text-[#737373] flex items-center justify-end gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-[#22C55E]" /> Proyección
          </span>
          <p className="text-sm font-bold text-[#171717] mt-0.5">+35% en conversión</p>
          <p className="text-[11px] text-[#737373]">implementando el plan de 30 días</p>
        </div>
      </div>

      {/* Category breakdown bar visualizers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-6">
        {categories.map((cat) => (
          <div
            key={cat.label}
            className="p-4 rounded-2xl bg-[#F8F7F4] border border-[#E5E5E1] transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-[#737373] mb-2">
              <span className="truncate font-medium">{cat.icon} {cat.label}</span>
              <span className="font-bold text-[#171717]">{cat.value}%</span>
            </div>
            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  cat.value >= 80
                    ? 'bg-[#22C55E]'
                    : cat.value >= 65
                    ? 'bg-[#6C5CE7]'
                    : 'bg-[#F59E0B]'
                }`}
                style={{ width: `${cat.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
