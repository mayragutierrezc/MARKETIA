import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, Compass, Lightbulb, Zap, TrendingUp } from 'lucide-react';

interface GeneratingStrategyModalProps {
  businessName: string;
}

export const GeneratingStrategyModal: React.FC<GeneratingStrategyModalProps> = ({ businessName }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  const steps = [
    { title: 'Analizando el modelo de negocio y diferencial...', icon: Compass },
    { title: 'Estructurando tu Buyer Persona y FODA estratégico...', icon: Sparkles },
    { title: 'Generando el calendario de 30 días y guiones de Reels...', icon: Zap },
    { title: 'Calculando tu Marketing Score y campañas de venta...', icon: TrendingUp }
  ];

  const marketingTips = [
    '💡 Consejo: Los primeros 3 segundos de un Reel determinan el 80% de su retención.',
    '💡 Consejo: Publicar con un llamado a la acción claro (CTA) triplica las consultas directas.',
    '💡 Consejo: El contenido que muestra el detrás de escena genera 4x más confianza que una foto de producto estática.',
    '💡 Consejo: No compitas por precio; destacá la experiencia y la transformación que ofrecés.'
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2200);

    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % marketingTips.length);
    }, 3500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(tipInterval);
    };
  }, [steps.length, marketingTips.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#F8F7F4]/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white rounded-2xl border border-[#EAE7DF] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 text-center space-y-6"
      >
        {/* Animated AI Sparkle Orb */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#6C5CE7]/20 animate-ping opacity-75" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#A78BFA] flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#6C5CE7]">
            MARKETIA Intelligence
          </span>
          <h2 className="text-2xl font-extrabold text-[#171717] font-display mt-1">
            Construyendo la estrategia para {businessName || 'tu negocio'}
          </h2>
          <p className="text-xs text-[#737373] mt-1.5">
            Personalizando plan de 30 días, prioridades y contenidos con Gemini AI
          </p>
        </div>

        {/* Steps Progress */}
        <div className="space-y-3 text-left pt-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-[#6C5CE7]/5 border-[#6C5CE7]/30 text-[#171717]'
                    : isDone
                    ? 'bg-[#FAF9F6] border-[#EAE7DF] text-[#737373]'
                    : 'opacity-40 border-transparent text-[#A3A3A3]'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full border-2 border-[#6C5CE7] border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#EAE7DF] shrink-0" />
                )}
                <span className={`text-xs font-semibold ${isCurrent ? 'text-[#6C5CE7] font-bold' : ''}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Marketing tip carousel */}
        <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE7DF] text-xs text-[#525252] min-h-[50px] flex items-center justify-center italic">
          {marketingTips[tipIndex]}
        </div>
      </motion.div>
    </div>
  );
};
