import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Sparkles, Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, loginWithGoogleAccount, loginWithEmailAccount, registerWithEmailAccount, addToast } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithGoogleAccount();
      setAuthModalOpen(false);
      addToast({
        type: 'success',
        title: '¡Sesión iniciada con Google!',
        message: 'Tus negocios, estrategias y suscripción están sincronizados en la nube.'
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'No se pudo iniciar sesión con Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor ingresá tu email y contraseña');
      return;
    }
    if (mode === 'register' && password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        await loginWithEmailAccount(email, password);
        addToast({
          type: 'success',
          title: '¡Bienvenido de vuelta!',
          message: 'Tus datos han sido cargados exitosamente.'
        });
      } else {
        await registerWithEmailAccount(email, password, displayName);
        addToast({
          type: 'success',
          title: '¡Cuenta creada con éxito!',
          message: 'Ya podés disfrutar de MARKETIA y crear tus estrategias.'
        });
      }
      setAuthModalOpen(false);
      setEmail('');
      setPassword('');
      setDisplayName('');
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        setError('Email o contraseña incorrectos. Por favor verificá tus datos.');
      } else if (err?.code === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado. Probá iniciando sesión.');
      } else {
        setError(err?.message || 'Ocurrió un error al procesar tu solicitud');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={authModalOpen}
      onClose={() => setAuthModalOpen(false)}
      title={mode === 'login' ? 'Iniciar Sesión en MARKETIA' : 'Crear tu Cuenta en MARKETIA'}
      subtitle="Accedé a tus estrategias, calendarios de contenido y asistente de IA en cualquier dispositivo"
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Google One-Click Login */}
        <div>
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-white hover:bg-[#F9F9F8] active:bg-[#F0EFEB] border border-[#DCD9D0] text-[#171717] rounded-xl font-semibold text-sm flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continuar con Google</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px bg-[#E5E5E1] flex-1" />
          <span className="text-xs text-[#737373] uppercase font-medium">o con tu email</span>
          <div className="h-px bg-[#E5E5E1] flex-1" />
        </div>

        {/* Tab switch */}
        <div className="p-1 bg-[#EFECE6] rounded-xl flex items-center gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
              mode === 'login' ? 'bg-white text-[#171717] shadow-xs' : 'text-[#737373]'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
              mode === 'register' ? 'bg-white text-[#171717] shadow-xs' : 'text-[#737373]'
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">Tu Nombre o Nombre de Negocio</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#737373] absolute left-3 top-3" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ej: Mayra Gutiérrez"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#DCD9D0] rounded-xl text-xs text-[#171717] focus:outline-hidden focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#737373] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#DCD9D0] rounded-xl text-xs text-[#171717] focus:outline-hidden focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#737373] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#DCD9D0] rounded-xl text-xs text-[#171717] focus:outline-hidden focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7]"
              />
            </div>
            {mode === 'register' && (
              <p className="text-[10px] text-[#737373] mt-1">Mínimo 6 caracteres</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {mode === 'login' ? 'Entrar a mi Cuenta' : 'Registrarme Gratis'}
          </Button>
        </form>

        <div className="p-3 rounded-xl bg-[#F8F7F4] border border-[#EAE7DF] text-[11px] text-[#737373] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#22C55E] shrink-0" />
          <span>Autenticación segura con Firebase Auth & Encriptación SSL.</span>
        </div>
      </div>
    </Modal>
  );
};
