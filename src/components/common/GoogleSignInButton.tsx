import React from 'react';
import { User } from 'firebase/auth';
import { LogOut, CheckCircle2, Loader2 } from 'lucide-react';

interface GoogleSignInButtonProps {
  user: User | null;
  isLoading?: boolean;
  onSignIn: () => void;
  onSignOut?: () => void;
  compact?: boolean;
  className?: string;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  user,
  isLoading = false,
  onSignIn,
  onSignOut,
  compact = false,
  className = ''
}) => {
  if (user) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#EAE7DF] shadow-2xs ${className}`}>
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'Google User'}
            className="w-5 h-5 rounded-full object-cover border border-[#EAE7DF]"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-[#6C5CE7] text-white text-[10px] font-bold flex items-center justify-center">
            {user.displayName?.[0] || 'G'}
          </div>
        )}
        <div className="flex flex-col text-left">
          <span className="text-xs font-semibold text-[#171717] truncate max-w-[130px]">
            {user.displayName || user.email?.split('@')[0]}
          </span>
          <span className="text-[10px] text-[#22C55E] flex items-center gap-0.5 font-medium">
            <CheckCircle2 className="w-2.5 h-2.5" /> Conectado a Google Docs
          </span>
        </div>
        {onSignOut && (
          <button
            onClick={onSignOut}
            title="Desconectar cuenta"
            className="ml-1 p-1 hover:bg-black/5 rounded-lg text-[#737373] hover:text-[#EF4444] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={onSignIn}
      disabled={isLoading}
      className={`relative inline-flex items-center justify-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1F1F1F] bg-white hover:bg-[#F8F9FA] active:bg-[#F1F3F4] border border-[#747775]/30 rounded-xl transition-all shadow-2xs hover:shadow-xs disabled:opacity-60 cursor-pointer ${
        compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm'
      } ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 text-[#6C5CE7] animate-spin" />
      ) : (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
        </svg>
      )}
      <span>{isLoading ? 'Conectando con Google...' : 'Conectar Google Docs'}</span>
    </button>
  );
};
