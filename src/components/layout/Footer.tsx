import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setView, loadDemoData } = useApp();

  return (
    <footer className="w-full bg-white border-t border-[#EAE7DF] py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6C5CE7] to-[#A78BFA] flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-[#171717]">
              MARKETIA
            </span>
            <p className="text-xs text-[#737373]">
              Tu equipo de marketing, sin contratar una agencia.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-[#737373]">
          <button
            onClick={() => setView('onboarding')}
            className="hover:text-[#171717] transition-colors cursor-pointer"
          >
            Crear mi estrategia gratis
          </button>
          <button
            onClick={loadDemoData}
            className="hover:text-[#171717] transition-colors cursor-pointer"
          >
            Ver demo en vivo
          </button>
          <a href="#precios" className="hover:text-[#171717] transition-colors">
            Planes y Precios
          </a>
          <a href="#como-funciona" className="hover:text-[#171717] transition-colors">
            Cómo funciona
          </a>
        </div>

        <div className="text-xs text-[#A3A3A3] flex items-center gap-1">
          <span>Diseñado para emprendedores y marcas</span>
        </div>
      </div>
    </footer>
  );
};
