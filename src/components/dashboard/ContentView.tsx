import React, { useState } from 'react';
import {
  FileText,
  Video,
  Sparkles,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Send,
  Hash,
  Eye,
  Camera,
  Trash2,
  Share2,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card, CardHeader } from '../common/Card';
import { GoogleDocsExportModal } from '../common/GoogleDocsExportModal';
import { useApp } from '../../context/AppContext';
import { ContentFormatType, GeneratedContent } from '../../types';

export const ContentView: React.FC = () => {
  const {
    business,
    savedContents,
    saveContent,
    deleteSavedContent,
    addToast,
    consumeGeneration,
    selectedCalendarEventForContent,
    setSelectedCalendarEventForContent
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'creator' | 'library'>('creator');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Form State
  const [selectedFormat, setSelectedFormat] = useState<ContentFormatType>('post');
  const [objective, setObjective] = useState('Conversión / Venta directa');
  const [product, setProduct] = useState(business?.offer?.mainProduct || '');
  const [audience, setAudience] = useState(business?.audience?.problems || '');
  const [tone, setTone] = useState('Cercano y profesional');
  const [platform, setPlatform] = useState('Instagram');
  const [cta, setCta] = useState('Escribinos un mensaje directo para más info');
  const [extraDetails, setExtraDetails] = useState('');

  // Result State
  const [generatedResult, setGeneratedResult] = useState<GeneratedContent | null>(() => {
    return savedContents[0] || null;
  });

  const formatOptions: { id: ContentFormatType; label: string; icon: string; desc: string }[] = [
    { id: 'reel', label: 'Reel / TikTok', icon: '🎥', desc: 'Video vertical de alto alcance' },
    { id: 'post', label: 'Post / Feed', icon: '🖼️', desc: 'Publicación clásica de imagen' },
    { id: 'carousel', label: 'Carrusel', icon: '📑', desc: 'Educativo de múltiples placas' },
    { id: 'story', label: 'Story Interactiva', icon: '📱', desc: 'Encuestas, stickers y cercanía' },
    { id: 'email', label: 'Email Newsletter', icon: '✉️', desc: 'Comunicación directa y fidelización' },
    { id: 'script', label: 'Guion de Venta', icon: '🎙️', desc: 'Audio o video para WhatsApp/DM' }
  ];

  const handleGenerate = async () => {
    if (!product.trim()) {
      addToast({ type: 'warning', title: 'Por favor indicá el producto o tema' });
      return;
    }
    if (!consumeGeneration()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedFormat,
          objective,
          product,
          audience,
          tone,
          platform,
          cta,
          extraDetails,
          businessName: business?.name || 'Nuestra Marca'
        })
      });

      const data = await res.json();
      setGeneratedResult(data);
      addToast({ type: 'success', title: '¡Contenido generado exitosamente!' });
    } catch (err) {
      addToast({ type: 'error', title: 'Error al generar contenido' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedResult) return;
    const text = `${generatedResult.title}

${generatedResult.hook}

${generatedResult.body}

👉 ${generatedResult.cta}

${generatedResult.hashtags?.join(' ')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast({ type: 'success', title: 'Copy copiado al portapapeles' });
    setTimeout(() => setCopied(false), 2500);
  };

  const isSaved = generatedResult && savedContents.some((c) => c.id === generatedResult.id);

  const handleToggleSave = () => {
    if (!generatedResult) return;
    if (isSaved) {
      deleteSavedContent(generatedResult.id);
    } else {
      saveContent(generatedResult);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#171717] font-display">
              Estudio de Contenido con IA
            </h1>
            <Badge variant="primary" size="sm">
              Copywriting de Conversión
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#737373] mt-0.5">
            Generá publicaciones, carruseles, stories y emails listos para publicar en segundos.
          </p>
        </div>

        <div className="flex items-center p-1 bg-[#FAF9F6] border border-[#EAE7DF] rounded-xl self-start">
          <button
            onClick={() => setActiveSubTab('creator')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'creator'
                ? 'bg-white text-[#171717] shadow-xs'
                : 'text-[#737373] hover:text-[#171717]'
            }`}
          >
            Generador
          </button>
          <button
            onClick={() => setActiveSubTab('library')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'library'
                ? 'bg-white text-[#171717] shadow-xs'
                : 'text-[#737373] hover:text-[#171717]'
            }`}
          >
            Biblioteca Guardada
            {savedContents.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 bg-[#6C5CE7]/15 text-[#6C5CE7] rounded-full font-bold">
                {savedContents.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* SUBTAB: CREATOR */}
      {activeSubTab === 'creator' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: 5 Cols */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-2">
                  1. ¿Qué formato querés crear?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {formatOptions.map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setSelectedFormat(fmt.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedFormat === fmt.id
                          ? 'border-[#6C5CE7] bg-[#6C5CE7]/5 text-[#6C5CE7]'
                          : 'border-[#EAE7DF] bg-[#FAF9F6] text-[#525252] hover:border-[#D0CCC0]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{fmt.icon}</span>
                        <span className="text-xs font-bold truncate">{fmt.label}</span>
                      </div>
                      <p className="text-[10px] text-[#737373] mt-0.5 truncate">{fmt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1.5">
                  2. Producto o tema principal a destacar
                </label>
                <input
                  type="text"
                  placeholder="Ej: Flat White de especialidad, Consultoría 1 a 1..."
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EAE7DF] text-xs focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1.5">
                    Objetivo
                  </label>
                  <select
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE7DF] text-xs bg-white focus:border-[#6C5CE7] outline-none"
                  >
                    <option>Conversión / Venta directa</option>
                    <option>Educación / Dar valor</option>
                    <option>Interacción / Alcance</option>
                    <option>Humanización / Detrás de escena</option>
                    <option>Lanzamiento / Promoción</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1.5">
                    Tono de voz
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE7DF] text-xs bg-white focus:border-[#6C5CE7] outline-none"
                  >
                    <option>Cercano y profesional</option>
                    <option>Inspiracional y empático</option>
                    <option>Directo y vendedor</option>
                    <option>Divertido y descontracturado</option>
                    <option>Técnico y de autoridad</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1.5">
                  Llamado a la Acción (CTA)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Dejanos tu consulta en comentarios"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EAE7DF] text-xs focus:border-[#6C5CE7] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1.5">
                  Detalles adicionales / Promo especial (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Mencionar que tenemos 15% OFF hasta el viernes..."
                  value={extraDetails}
                  onChange={(e) => setExtraDetails(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EAE7DF] text-xs focus:border-[#6C5CE7] outline-none resize-none"
                />
              </div>

              <Button
                variant="primary"
                size="md"
                className="w-full"
                isLoading={isGenerating}
                rightIcon={<Sparkles className="w-4 h-4" />}
                onClick={handleGenerate}
              >
                Generar Copy con IA
              </Button>
            </Card>
          </div>

          {/* Right Result View: 7 Cols */}
          <div className="lg:col-span-7 space-y-4">
            {generatedResult ? (
              <Card className="space-y-5 bg-white border-[#EAE7DF]">
                {/* Result Header & Quick Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE7DF]">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" size="sm">
                        {generatedResult.type?.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-[#737373]">
                        {generatedResult.createdAt ? new Date(generatedResult.createdAt).toLocaleDateString() : 'Hoy'}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#171717] mt-1">
                      {generatedResult.title}
                    </h3>
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
                      leftIcon={
                        isSaved ? (
                          <BookmarkCheck className="w-3.5 h-3.5 text-[#6C5CE7]" />
                        ) : (
                          <Bookmark className="w-3.5 h-3.5" />
                        )
                      }
                      onClick={handleToggleSave}
                    >
                      {isSaved ? 'Guardado' : 'Guardar'}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
                      onClick={handleCopy}
                    >
                      {copied ? 'Copiado' : 'Copiar'}
                    </Button>
                  </div>
                </div>

                {/* Hook Box */}
                {generatedResult.hook && (
                  <div className="p-3.5 rounded-xl bg-[#6C5CE7]/5 border border-[#6C5CE7]/20 space-y-1">
                    <span className="text-[11px] font-bold text-[#6C5CE7] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Gancho de Alto Impacto (Hook)
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-[#171717] leading-relaxed">
                      "{generatedResult.hook}"
                    </p>
                  </div>
                )}

                {/* Structure Breakdown */}
                {generatedResult.structure && generatedResult.structure.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-[#737373] uppercase tracking-wider">
                      Estructura del Contenido:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {generatedResult.structure.map((st, i) => (
                        <div key={i} className="p-2 rounded-lg bg-[#FAF9F6] border border-[#EAE7DF] text-xs text-[#525252]">
                          {st}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full Body Copy */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-[#737373] uppercase tracking-wider">
                    Copywriting Completo:
                  </span>
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAE7DF] text-xs sm:text-sm text-[#171717] whitespace-pre-line leading-relaxed font-normal select-text">
                    {generatedResult.body}
                  </div>
                </div>

                {/* CTA & Hashtags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white border border-[#EAE7DF] space-y-1">
                    <span className="text-[11px] font-bold text-[#171717] flex items-center gap-1">
                      🎯 Llamado a la Acción (CTA):
                    </span>
                    <p className="text-xs text-[#6C5CE7] font-semibold">{generatedResult.cta}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#EAE7DF] space-y-1">
                    <span className="text-[11px] font-bold text-[#171717] flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-[#737373]" /> Hashtags:
                    </span>
                    <p className="text-xs text-[#737373] truncate">
                      {generatedResult.hashtags?.join(' ')}
                    </p>
                  </div>
                </div>

                {/* Visual Direction & AI Image Prompt */}
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAE7DF] space-y-3">
                  {generatedResult.visualSuggestion && (
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-[#171717] flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#6C5CE7]" /> Dirección Visual / Grabación:
                      </span>
                      <p className="text-xs text-[#525252] leading-relaxed">
                        {generatedResult.visualSuggestion}
                      </p>
                    </div>
                  )}

                  {generatedResult.imagePrompt && (
                    <div className="space-y-1 pt-2 border-t border-[#EAE7DF]">
                      <span className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-wider">
                        Prompt en inglés para Generador de Imagen/Video IA:
                      </span>
                      <p className="text-xs font-mono bg-white p-2.5 rounded-lg border border-[#EAE7DF] text-[#737373] select-all">
                        {generatedResult.imagePrompt}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-[#EAE7DF] space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#6C5CE7]/10 text-[#6C5CE7] flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#171717]">Tu contenido generado aparecerá acá</h4>
                <p className="text-xs text-[#737373] max-w-sm mx-auto">
                  Elegí el formato y hacé clic en "Generar Copy con IA" para recibir el gancho, el copy y la sugerencia visual.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* SUBTAB: LIBRARY */
        <div className="space-y-4">
          {savedContents.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-[#EAE7DF] space-y-3">
              <p className="text-sm text-[#737373]">No tenés publicaciones guardadas todavía.</p>
              <Button variant="primary" size="sm" onClick={() => setActiveSubTab('creator')}>
                Crear primera publicación
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedContents.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white border border-[#EAE7DF] shadow-2xs hover:border-[#D0CCC0] transition-all space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <Badge variant="primary" size="sm">
                        {item.type.toUpperCase()}
                      </Badge>
                      <button
                        onClick={() => deleteSavedContent(item.id)}
                        className="text-[#A3A3A3] hover:text-[#EF4444] p-1 rounded-md transition-colors cursor-pointer"
                        title="Eliminar de guardados"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="font-bold text-sm text-[#171717] mt-2">{item.title}</h4>
                    <p className="text-xs text-[#737373] line-clamp-3 mt-1 leading-relaxed">
                      {item.body}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#EAE7DF] flex items-center justify-between text-xs">
                    <span className="text-[#6C5CE7] font-semibold truncate max-w-[150px]">
                      {item.cta}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        setGeneratedResult(item);
                        setActiveSubTab('creator');
                      }}
                    >
                      Ver / Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Google Docs Export Modal */}
      {business && generatedResult && (
        <GoogleDocsExportModal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          exportPayload={{
            type: 'content',
            data: { business, content: generatedResult }
          }}
        />
      )}
    </div>
  );
};
