import React, { useState } from 'react';
import {
  Video,
  Sparkles,
  Play,
  Copy,
  Check,
  Bookmark,
  RefreshCw,
  Clock,
  MessageSquare,
  Type,
  Music,
  Camera,
  Layers,
  ChevronRight,
  FileText
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card, CardHeader } from '../common/Card';
import { GoogleDocsExportModal } from '../common/GoogleDocsExportModal';
import { useApp } from '../../context/AppContext';
import { GeneratedReel, ReelSection } from '../../types';

export const ReelsGeneratorView: React.FC = () => {
  const { business, savedReels, saveReel, addToast, consumeGeneration } = useApp();

  const [product, setProduct] = useState(business?.offer?.mainProduct || '');
  const [targetProblem, setTargetProblem] = useState(business?.audience?.problems || '');
  const [style, setStyle] = useState('Dinámico, empático y profesional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [regeneratingSectionIndex, setRegeneratingSectionIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Active Reel
  const [currentReel, setCurrentReel] = useState<GeneratedReel>(() => {
    return (
      savedReels[0] || {
        id: 'reel-init',
        product: business?.offer?.mainProduct || 'Café de especialidad',
        hook: '3 errores que arruinan tu experiencia al tomar café y cómo solucionarlos.',
        sections: [
          {
            timestamp: '0–3 segundos',
            label: 'Gancho Visual & Sonoro',
            action: 'Primer plano directo a la taza sirviendo vapor caliente, mirada a cámara con gesto de sorpresa.',
            speech: 'Si todavía pensás que todo el café sabe igual, prestá atención.',
            screenText: '¡Dejá de tomar café quemado! 🛑'
          },
          {
            timestamp: '3–8 segundos',
            label: 'Planteo del Problema',
            action: 'Muestra rápida de paquetes industriales genéricos vs granos frescos seleccionados.',
            speech: 'El 90% de los cafés comerciales están sobretostados para ocultar defectos.',
            screenText: 'Lo que no te cuentan del café tradicional 🤫'
          },
          {
            timestamp: '8–15 segundos',
            label: 'Demostración de la Solución',
            action: 'Toma estética de extracción perfecta con crema dorada y tostado propio.',
            speech: `En ${business?.name || 'Luna Café'} tostamos granos de origen cada semana para que sientas notas dulces naturales sin agregar azúcar.`,
            screenText: 'Tostado propio semanal ✨'
          },
          {
            timestamp: '15–25 segundos',
            label: 'Llamado a la Acción y Cierre',
            action: 'Sonrisa a cámara, muestra del local o producto terminado con texto de contacto.',
            speech: 'Vení a probar la diferencia o pedí tu bolsa con 15% OFF esta semana. Te esperamos.',
            screenText: '💬 Comentá "CAFÉ" y te enviamos la carta'
          }
        ],
        screenTextSummary: '¡Dejá de tomar café quemado! // Lo que no te cuentan // Tostado propio semanal // Comentá CAFÉ',
        cta: 'Guardá este Reel y vení a visitarnos en Palermo ☕',
        caption: `¿Buscás café de verdad sin amargor excesivo? 👇

En ${business?.name || 'nuestro espacio'} cuidamos cada etapa del grano para ofrecerte una experiencia superior.

✨ Granos de origen único
🌿 Tostado propio semanal
🥐 Pastelería artesanal de masa madre

Comentá "CAFÉ" y te enviamos un beneficio exclusivo para tu primera visita.`,
        visualIdea: 'Tomas dinámicas de 2 a 3 segundos cada una con luz natural cálida y planos en primer plano.',
        imageVideoPrompt: 'Cinematic vertical 9:16 video of artisanal specialty coffee preparation with rich crema and warm cafe atmosphere.',
        audioSuggestion: 'Audio en tendencia con ritmo sutil de pop electrónico o chillout lofi.',
        createdAt: new Date().toISOString()
      }
    );
  });

  const handleGenerateFullReel = async () => {
    if (!product.trim()) {
      addToast({ type: 'warning', title: 'Ingresá el producto o tema para el Reel' });
      return;
    }
    if (!consumeGeneration()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/reels/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product,
          targetProblem,
          style,
          businessName: business?.name || 'Mi Negocio'
        })
      });
      const data = await res.json();
      setCurrentReel(data);
      addToast({ type: 'success', title: '¡Guion de Reel generado con éxito!' });
    } catch (err) {
      addToast({ type: 'error', title: 'Error al generar guion' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateSection = async (index: number) => {
    if (!consumeGeneration()) return;
    setRegeneratingSectionIndex(index);
    try {
      const res = await fetch('/api/reels/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product,
          targetProblem,
          style,
          businessName: business?.name || 'Mi Negocio',
          regenerateSectionIndex: index,
          currentSections: currentReel.sections
        })
      });
      const data = await res.json();
      if (data.sections && data.sections[index]) {
        const updatedSections = [...currentReel.sections];
        updatedSections[index] = data.sections[index];
        setCurrentReel({ ...currentReel, sections: updatedSections });
        addToast({ type: 'success', title: `Sección ${index + 1} regenerada` });
      }
    } catch (err) {
      addToast({ type: 'error', title: 'No se pudo regenerar esta sección' });
    } finally {
      setRegeneratingSectionIndex(null);
    }
  };

  const handleCopyScript = () => {
    const text = `GUION DE REEL - ${currentReel.product.toUpperCase()}
GANCHO: ${currentReel.hook}

${currentReel.sections
  .map(
    (s, i) =>
      `[${s.timestamp}] ${s.label.toUpperCase()}
- Acción en cámara: ${s.action}
- Locución / Diálogo: "${s.speech}"
- Texto en pantalla: "${s.screenText}"`
  )
  .join('\n\n')}

CAPTION PARA INSTAGRAM:
${currentReel.caption}

CTA: ${currentReel.cta}
SUGERENCIA DE AUDIO: ${currentReel.audioSuggestion || 'Audio en tendencia'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast({ type: 'success', title: 'Guion completo copiado al portapapeles' });
    setTimeout(() => setCopied(false), 2500);
  };

  const isSaved = savedReels.some((r) => r.id === currentReel.id);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#171717] font-display">
              Generador de Guiones para Reels & TikTok
            </h1>
            <Badge variant="accent" size="sm">
              División en Segundos
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#737373] mt-0.5">
            Estructuras probadas de 0 a 25 segundos para maximizar retención y ventas orgánicas.
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
            variant={isSaved ? 'secondary' : 'outline'}
            size="sm"
            leftIcon={<Bookmark className="w-3.5 h-3.5" />}
            onClick={() => {
              saveReel(currentReel);
            }}
          >
            {isSaved ? 'Guardado' : 'Guardar Guion'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
            onClick={handleCopyScript}
          >
            {copied ? 'Copiado' : 'Copiar Todo el Guion'}
          </Button>
        </div>
      </div>

      {/* Main Grid: Form Controls (4 cols) & Step-by-Step Script (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: 4 Cols */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="space-y-4">
            <CardHeader
              title="Configurar Guion"
              subtitle="Indicá qué querés promocionar hoy"
              icon={<Video className="w-4 h-4" />}
            />

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1.5">
                Producto o Servicio a promocionar *
              </label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Ej: Café con pastelería de autor, Sesión de masajes..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#EAE7DF] text-xs focus:border-[#6C5CE7] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1.5">
                Problema o deseo de tu cliente
              </label>
              <textarea
                rows={2}
                value={targetProblem}
                onChange={(e) => setTargetProblem(e.target.value)}
                placeholder="Ej: Se cansan del café amargo y buscan una experiencia placentera..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#EAE7DF] text-xs focus:border-[#6C5CE7] outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1.5">
                Estilo / Formato del video
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#EAE7DF] text-xs bg-white focus:border-[#6C5CE7] outline-none"
              >
                <option>Dinámico, empático y profesional</option>
                <option>POV (Punto de vista del cliente)</option>
                <option>Detrás de escena / Proceso de preparación</option>
                <option>3 Errores comunes + Solución</option>
                <option>Storytelling / Historia personal</option>
                <option>Unboxing o antes y después</option>
              </select>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isGenerating}
              rightIcon={<Sparkles className="w-4 h-4" />}
              onClick={handleGenerateFullReel}
            >
              Generar Guion Completo
            </Button>
          </Card>

          {/* Audio & Visual Tips */}
          <div className="p-4 rounded-2xl bg-white border border-[#EAE7DF] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#171717]">
              <Music className="w-4 h-4 text-[#6C5CE7]" /> Sugerencia de Audio:
            </div>
            <p className="text-xs text-[#525252] leading-relaxed">
              {currentReel.audioSuggestion || 'Audio trending en Instagram Reels con ritmo alegre o lofi.'}
            </p>

            <div className="pt-2 border-t border-[#EAE7DF] flex items-center gap-2 text-xs font-bold text-[#171717]">
              <Camera className="w-4 h-4 text-[#F59EBD]" /> Dirección Visual:
            </div>
            <p className="text-xs text-[#525252] leading-relaxed">
              {currentReel.visualIdea}
            </p>
          </div>
        </div>

        {/* Right Script: 8 Cols */}
        <div className="lg:col-span-8 space-y-4">
          {/* Main Hook Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#6C5CE7]/10 via-[#A78BFA]/10 to-[#F59EBD]/10 border border-[#6C5CE7]/30 space-y-1">
            <span className="text-[11px] font-extrabold text-[#6C5CE7] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F59EBD]" /> Gancho Principal (Primeros 3 segundos)
            </span>
            <p className="text-sm sm:text-base font-bold text-[#171717]">
              "{currentReel.hook}"
            </p>
          </div>

          {/* 4 Time-Splitted Sections */}
          <div className="space-y-3">
            {currentReel.sections.map((section, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-[#EAE7DF] shadow-2xs hover:border-[#D0CCC0] transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#6C5CE7] text-white font-extrabold text-xs">
                      {section.timestamp}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#171717]">{section.label}</h4>
                  </div>

                  <button
                    onClick={() => handleRegenerateSection(idx)}
                    disabled={regeneratingSectionIndex === idx}
                    className="text-[11px] font-semibold text-[#6C5CE7] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${regeneratingSectionIndex === idx ? 'animate-spin' : ''}`} />
                    Regenerar solo esta sección
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                  {/* Action */}
                  <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE7DF] space-y-1">
                    <span className="font-bold text-[#737373] text-[11px] flex items-center gap-1">
                      🎬 Acción en Cámara:
                    </span>
                    <p className="text-[#171717] leading-relaxed">{section.action}</p>
                  </div>

                  {/* Speech */}
                  <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE7DF] space-y-1 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#6C5CE7] text-[11px] flex items-center gap-1">
                        🎙️ Locución / Qué decir:
                      </span>
                      <span className="text-[10px] text-[#A3A3A3]">Diálogo exacto</span>
                    </div>
                    <p className="text-[#171717] font-medium leading-relaxed">
                      "{section.speech}"
                    </p>
                  </div>
                </div>

                {/* Screen Text */}
                <div className="p-2.5 rounded-xl bg-[#6C5CE7]/5 border border-[#6C5CE7]/15 flex items-center gap-2 text-xs">
                  <Type className="w-3.5 h-3.5 text-[#6C5CE7] shrink-0" />
                  <span className="font-bold text-[#6C5CE7] shrink-0">Texto en pantalla:</span>
                  <span className="text-[#171717] font-semibold truncate">{section.screenText}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Caption & Image Prompt */}
          <Card className="space-y-4">
            <CardHeader
              title="Caption Completo para Instagram / TikTok"
              subtitle="Listo para copiar y pegar debajo de tu video con llamado a la acción y formato."
              icon={<MessageSquare className="w-4 h-4" />}
            />

            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAE7DF] text-xs sm:text-sm text-[#171717] whitespace-pre-line leading-relaxed select-text">
              {currentReel.caption}
            </div>

            {currentReel.imageVideoPrompt && (
              <div className="pt-2 border-t border-[#EAE7DF] space-y-1">
                <span className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-wider">
                  Prompt para Portada o Video con IA:
                </span>
                <p className="text-xs font-mono bg-[#FAF9F6] p-2.5 rounded-lg border border-[#EAE7DF] text-[#737373] select-all">
                  {currentReel.imageVideoPrompt}
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Google Docs Export Modal */}
      {business && currentReel && (
        <GoogleDocsExportModal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          exportPayload={{
            type: 'reel',
            data: { business, reel: currentReel }
          }}
        />
      )}
    </div>
  );
};
