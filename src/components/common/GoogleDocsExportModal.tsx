import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Download,
  Copy,
  Sparkles,
  Share2
} from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { GoogleSignInButton } from './GoogleSignInButton';
import {
  initAuth,
  googleSignIn,
  getAccessToken,
  logout
} from '../../services/googleAuth';
import {
  exportStrategyToGoogleDoc,
  exportCalendarToGoogleDoc,
  exportCampaignsToGoogleDoc,
  exportReelToGoogleDoc,
  exportContentToGoogleDoc,
  GoogleDocResult
} from '../../services/googleDocsService';
import { useApp } from '../../context/AppContext';
import {
  BusinessProfile,
  CompleteStrategy,
  CalendarDayItem,
  CampaignItem,
  GeneratedReel,
  GeneratedContent
} from '../../types';

export type ExportContentType =
  | { type: 'strategy'; data: { business: BusinessProfile; strategy: CompleteStrategy } }
  | { type: 'calendar'; data: { business: BusinessProfile; calendar: CalendarDayItem[] } }
  | { type: 'reel'; data: { business: BusinessProfile; reel: GeneratedReel } }
  | { type: 'content'; data: { business: BusinessProfile; content: GeneratedContent } }
  | { type: 'campaigns'; data: { business: BusinessProfile; campaigns: CampaignItem[] } };

interface GoogleDocsExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportPayload: ExportContentType | null;
}

export const GoogleDocsExportModal: React.FC<GoogleDocsExportModalProps> = ({
  isOpen,
  onClose,
  exportPayload
}) => {
  const { addToast } = useApp();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [resultDoc, setResultDoc] = useState<GoogleDocResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Reset state when opening/closing
  useEffect(() => {
    if (isOpen) {
      setResultDoc(null);
      setError(null);
    }
  }, [isOpen, exportPayload]);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setError(null);
    try {
      const res = await googleSignIn();
      setUser(res.user);
      setToken(res.accessToken);
      addToast({
        type: 'success',
        title: 'Cuenta conectada',
        message: `Sesión iniciada como ${res.user.displayName || res.user.email}`
      });
    } catch (err: any) {
      setError(err?.message || 'No se pudo completar la autenticación con Google');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setResultDoc(null);
      addToast({
        type: 'info',
        title: 'Sesión cerrada',
        message: 'Tu cuenta de Google fue desconectada'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleExecuteExport = async () => {
    if (!exportPayload) return;

    let currentAccessToken = token || (await getAccessToken());

    // If not authenticated, prompt sign-in first
    if (!currentAccessToken) {
      try {
        setIsAuthenticating(true);
        const res = await googleSignIn();
        setUser(res.user);
        setToken(res.accessToken);
        currentAccessToken = res.accessToken;
      } catch (err: any) {
        setIsAuthenticating(false);
        setError('Debes iniciar sesión con Google para crear documentos en tu cuenta.');
        return;
      } finally {
        setIsAuthenticating(false);
      }
    }

    if (!currentAccessToken) return;

    setIsExporting(true);
    setError(null);

    try {
      let result: GoogleDocResult;

      switch (exportPayload.type) {
        case 'strategy':
          result = await exportStrategyToGoogleDoc(
            exportPayload.data.business,
            exportPayload.data.strategy,
            currentAccessToken
          );
          break;
        case 'calendar':
          result = await exportCalendarToGoogleDoc(
            exportPayload.data.business,
            exportPayload.data.calendar,
            currentAccessToken
          );
          break;
        case 'reel':
          result = await exportReelToGoogleDoc(
            exportPayload.data.business,
            exportPayload.data.reel,
            currentAccessToken
          );
          break;
        case 'content':
          result = await exportContentToGoogleDoc(
            exportPayload.data.business,
            exportPayload.data.content,
            currentAccessToken
          );
          break;
        case 'campaigns':
          result = await exportCampaignsToGoogleDoc(
            exportPayload.data.business,
            exportPayload.data.campaigns,
            currentAccessToken
          );
          break;
        default:
          throw new Error('Tipo de exportación no reconocido');
      }

      setResultDoc(result);
      addToast({
        type: 'success',
        title: '¡Documento creado!',
        message: `"${result.title}" se guardó en tu Google Drive`
      });
    } catch (err: any) {
      console.error('Error al exportar a Google Docs:', err);
      setError(err?.message || 'Ocurrió un error al intentar crear el documento en Google Docs');
      // If token expired, clear it
      if (err?.message?.includes('401') || err?.message?.includes('UNAUTHENTICATED')) {
        setToken(null);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const getExportTitle = () => {
    if (!exportPayload) return 'Exportar a Google Docs';
    switch (exportPayload.type) {
      case 'strategy':
        return 'Exportar Plan Estratégico a Google Docs';
      case 'calendar':
        return 'Exportar Calendario Editorial (30 Días)';
      case 'reel':
        return `Exportar Guion de Reel: ${exportPayload.data.reel.product || 'Publicación'}`;
      case 'content':
        return `Exportar Copy: ${exportPayload.data.content.title}`;
      case 'campaigns':
        return 'Exportar Campañas a Google Docs';
    }
  };

  const getExportDescription = () => {
    if (!exportPayload) return '';
    switch (exportPayload.type) {
      case 'strategy':
        return `Se creará un nuevo archivo en tu Google Drive con el análisis FODA, Buyer Persona, pilares de contenido, matriz de prioridades y campañas de ${exportPayload.data.business.name}.`;
      case 'calendar':
        return `Se generará un documento en Google Docs con el cronograma detallado de los 30 días de contenido para ${exportPayload.data.business.name}.`;
      case 'reel':
        return `Se creará un documento con el guion estructurado segundo a segundo, hook, caption y sugerencias de grabación.`;
      case 'content':
        return `Se creará un documento editable con el copy completo, llamados a la acción, hashtags y sugerencias visuales.`;
      case 'campaigns':
        return `Se creará un documento con el desglose de todas las campañas publicitarias, ofertas y copys de prueba.`;
    }
  };

  const handleCopyLink = () => {
    if (!resultDoc) return;
    navigator.clipboard.writeText(resultDoc.documentUrl);
    setCopiedLink(true);
    addToast({ type: 'success', title: 'Enlace copiado al portapapeles' });
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getExportTitle()} size="lg">
      <div className="space-y-6">
        {/* Banner / Header */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#4285F4]/10 via-[#6C5CE7]/10 to-transparent border border-[#4285F4]/20 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#4285F4] text-white flex items-center justify-center shrink-0 shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#171717]">
              Integración oficial con Google Docs & Google Drive
            </h4>
            <p className="text-xs text-[#525252] mt-0.5 leading-relaxed">
              Crea y edita tus documentos directamente en tu cuenta de Google. Tu contenido queda sincronizado y listo para compartir con tu equipo o clientes.
            </p>
          </div>
        </div>

        {/* Authentication State Card */}
        <div className="p-4 rounded-xl bg-[#F8F7F4] border border-[#EAE7DF] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#737373] uppercase tracking-wider">
              Cuenta de Google
            </span>
            {user && (
              <span className="text-[11px] font-semibold text-[#22C55E] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Autorizado para Google Docs
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <GoogleSignInButton
              user={user}
              isLoading={isAuthenticating}
              onSignIn={handleSignIn}
              onSignOut={handleSignOut}
            />

            {!user && (
              <p className="text-xs text-[#737373] italic">
                Inicia sesión para autorizar la creación del documento en tu Google Drive.
              </p>
            )}
          </div>
        </div>

        {/* Summary Description of Document to Export */}
        <div className="p-4 rounded-xl bg-white border border-[#EAE7DF] space-y-2">
          <h5 className="text-xs font-bold text-[#171717] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#6C5CE7]" />
            Contenido que se exportará:
          </h5>
          <p className="text-xs text-[#525252] leading-relaxed">
            {getExportDescription()}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-start gap-2.5 text-xs text-[#DC2626]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Error al exportar</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Success Result View */}
        {resultDoc && (
          <div className="p-4 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#15803D]">
              <CheckCircle2 className="w-4 h-4" />
              ¡Documento exportado con éxito a Google Docs!
            </div>
            <p className="text-xs text-[#166534]">
              <strong>{resultDoc.title}</strong> ya está disponible en tu Google Drive.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={resultDoc.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                Abrir en Google Docs
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F2EFEB] text-[#171717] border border-[#EAE7DF] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-[#6C5CE7]" />
                {copiedLink ? '¡Enlace copiado!' : 'Copiar enlace directo'}
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#EAE7DF]">
          <Button variant="ghost" onClick={onClose} disabled={isExporting}>
            {resultDoc ? 'Cerrar' : 'Cancelar'}
          </Button>

          {!resultDoc && (
            <Button
              variant="primary"
              onClick={handleExecuteExport}
              isLoading={isExporting || isAuthenticating}
              leftIcon={<Download className="w-4 h-4" />}
            >
              {isExporting
                ? 'Creando documento en Google Docs...'
                : user
                ? 'Confirmar y Exportar a Google Docs'
                : 'Conectar y Exportar a Google Docs'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
