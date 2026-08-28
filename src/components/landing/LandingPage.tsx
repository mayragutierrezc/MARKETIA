import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  TrendingUp,
  Target,
  FileText,
  Video,
  BarChart3,
  Bot,
  Calendar,
  Layers,
  Zap,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Users,
  Compass
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { useApp } from '../../context/AppContext';

export const LandingPage: React.FC = () => {
  const { setView, loadDemoData } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const painPoints = [
    {
      title: 'No sé qué publicar hoy',
      description: 'Abrís Instagram y te quedás mirando la pantalla en blanco sin saber qué decir.',
      icon: '🤦‍♂️'
    },
    {
      title: 'Me quedo sin ideas rápido',
      description: 'Publicás dos días seguidos con entusiasmo y al tercero no se te ocurre nada nuevo.',
      icon: '💡'
    },
    {
      title: 'No sé qué campaña hacer',
      description: 'Querés vender más pero no sabés qué oferta armar ni qué mensaje transmitir.',
      icon: '📣'
    },
    {
      title: 'No entiendo mis métricas',
      description: 'Miras likes y alcance pero no tenés idea si eso se traduce en clientes reales.',
      icon: '📊'
    },
    {
      title: 'No sé cómo usar mi presupuesto',
      description: 'Miedo a tirar plata a la basura promocionando publicaciones sin estrategia.',
      icon: '💸'
    }
  ];

  const teamRoles = [
    {
      role: 'Directora de Estrategia',
      name: 'Estrategia & FODA',
      desc: 'Analiza tu propuesta de valor, define tu buyer persona y crea tus 5 prioridades de negocio.',
      icon: Compass,
      tag: 'Posicionamiento'
    },
    {
      role: 'Copywriter & Creadora de Contenido',
      name: 'Guiones & Copies',
      desc: 'Escribe ganchos irresistibles, guiones de Reels divididos en segundos y publicaciones listas para subir.',
      icon: Video,
      tag: 'Creatividad'
    },
    {
      role: 'Media Planner & Especialista en Ads',
      name: 'Campañas & Ofertas',
      desc: 'Estructura conceptos de campaña, ofertas irresistibles, distribución de presupuesto y copies de prueba.',
      icon: Target,
      tag: 'Conversión'
    },
    {
      role: 'Analista de Crecimiento & Datos',
      name: 'Diagnóstico & Métricas',
      desc: 'Interpreta tus números reales y te explica en cristiano qué funciona, qué falla y qué deberías probar.',
      icon: BarChart3,
      tag: 'Analytics'
    }
  ];

  const features = [
    {
      id: 'f1',
      title: 'Estrategia Personalizada',
      desc: 'Diagnóstico integral, FODA, Buyer Persona y pilares de contenido calculados para tu rubro.',
      icon: Compass,
      color: 'text-[#6C5CE7] bg-[#6C5CE7]/10'
    },
    {
      id: 'f2',
      title: 'Generador de Reels por Segundos',
      desc: 'Guiones divididos en 0-3s, 3-8s, 8-15s y 15-25s con texto en pantalla y dirección visual.',
      icon: Video,
      color: 'text-[#F59EBD] bg-[#F59EBD]/15'
    },
    {
      id: 'f3',
      title: 'Calendario de 30 Días',
      desc: 'Plan mensual completo con plataforma, formato, tema y llamado a la acción para cada día.',
      icon: Calendar,
      color: 'text-[#A78BFA] bg-[#A78BFA]/15'
    },
    {
      id: 'f4',
      title: 'Creador de Campañas de Venta',
      desc: 'Genera conceptos de promoción, copies para anuncios, ideas de contenido y presupuesto sugerido.',
      icon: Target,
      color: 'text-[#22C55E] bg-[#22C55E]/10'
    },
    {
      id: 'f5',
      title: 'Analytics con "¿Qué significa esto?"',
      desc: 'Calcula engagement, CTR, CAC y ROAS con explicación en lenguaje humano de qué cambiar.',
      icon: BarChart3,
      color: 'text-[#F59E0B] bg-[#F59E0B]/10'
    },
    {
      id: 'f6',
      title: 'Asistente IA que Conoce tu Negocio',
      desc: 'Copiloto permanente que responde dudas conociendo tu estrategia, productos y objetivos.',
      icon: Bot,
      color: 'text-[#6C5CE7] bg-[#6C5CE7]/10'
    }
  ];

  return (
    <div className="w-full flex flex-col bg-[#F8F7F4] text-[#171717] overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 md:w-[600px] h-72 bg-gradient-to-r from-[#A78BFA]/20 via-[#F59EBD]/20 to-[#6C5CE7]/15 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E2E0D8] text-xs font-semibold text-[#6C5CE7] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F59EBD]" />
            <span>Copiloto de Marketing con Inteligencia Artificial</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#171717] font-display leading-[1.12]">
            Tu equipo de marketing,{' '}
            <span className="bg-gradient-to-r from-[#6C5CE7] via-[#8570ED] to-[#A78BFA] bg-clip-text text-transparent">
              sin contratar una agencia.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#525252] leading-relaxed max-w-2xl mx-auto font-normal">
            MARKETIA analiza tu negocio y crea estrategias, contenido y campañas personalizadas para ayudarte a vender más de forma constante y sin perder horas pensando qué publicar.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => setView('onboarding')}
              className="w-full sm:w-auto"
            >
              Crear mi estrategia gratis
            </Button>

            <Button
              variant="outline"
              size="lg"
              leftIcon={<Play className="w-4 h-4 text-[#6C5CE7] fill-[#6C5CE7]/20" />}
              onClick={loadDemoData}
              className="w-full sm:w-auto"
            >
              Explorar demo (Luna Café)
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-[#737373] pt-3">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> Gratis para empezar
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> Estrategia en 3 minutos
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> Sin tarjeta de crédito
            </span>
          </div>
        </div>

        {/* Dashboard Visual Representation Mockup */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="relative rounded-2xl bg-white border border-[#EAE7DF] shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-3 sm:p-5 overflow-hidden">
            {/* Top Mockup Bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F0EEE6] px-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]/60" />
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]/60" />
                <div className="w-3 h-3 rounded-full bg-[#22C55E]/60" />
                <span className="text-[11px] font-semibold text-[#737373] ml-2">marketia.app/dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] font-bold">
                  Luna Café • Palermo
                </span>
              </div>
            </div>

            {/* Mockup Dashboard Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Column: Score & Daily priority */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#FAF9F6] to-white border border-[#EAE7DF]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#737373]">Marketing Score</span>
                    <span className="text-xs font-bold text-[#6C5CE7]">Diagnóstico IA</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-[#171717]">78</span>
                    <span className="text-xs text-[#737373]">/ 100 • Saludable</span>
                  </div>
                  <div className="w-full h-2 bg-[#F0EEE6] rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-[#6C5CE7] rounded-full w-[78%]" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#6C5CE7]/5 border border-[#6C5CE7]/20">
                  <span className="text-[11px] font-bold text-[#6C5CE7] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Prioridad de hoy
                  </span>
                  <p className="text-xs font-semibold text-[#171717] mt-1">
                    Publicar Reel mostrando el arte del café recién tostado y el vapor de la mañana.
                  </p>
                  <button
                    onClick={loadDemoData}
                    className="mt-3 text-[11px] font-bold text-[#6C5CE7] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Abrir guion de Reel <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Center Column: 30-day Calendar item sneak-peek */}
              <div className="p-4 rounded-xl bg-white border border-[#EAE7DF] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#171717] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#6C5CE7]" /> Calendario 30 Días
                  </span>
                  <span className="text-[11px] text-[#737373]">Día 4 de 30</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-[#FAF9F6] border border-[#EAE7DF] text-xs">
                    <div className="flex items-center justify-between text-[11px] text-[#737373]">
                      <span className="font-semibold text-[#6C5CE7]">🎥 Reel • Instagram</span>
                      <span className="text-[#22C55E] font-semibold">Listo para grabar</span>
                    </div>
                    <p className="font-bold text-[#171717] mt-1">POV: Venís a trabajar a Luna Café con Wi-Fi rápido</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FAF9F6] border border-[#EAE7DF] text-xs opacity-75">
                    <div className="flex items-center justify-between text-[11px] text-[#737373]">
                      <span className="font-semibold text-[#A78BFA]">📱 Story Interactiva</span>
                      <span className="text-[#F59E0B] font-semibold">Pendiente</span>
                    </div>
                    <p className="font-medium text-[#171717] mt-1">Tostón de masa madre con palta y burrata</p>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Assistant Snippet */}
              <div className="p-4 rounded-xl bg-white border border-[#EAE7DF] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-md bg-[#6C5CE7] text-white flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#171717]">MARKETIA Copilot</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F8F7F4] text-xs text-[#4A4A4A] leading-relaxed">
                    “Te conviene lanzar la campaña <strong>Semana del Espresso</strong> con 2x1 matutino para aumentar tus visitas antes de las 11:00 hs.”
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3 text-xs w-full"
                  onClick={loadDemoData}
                >
                  Probar Copilot en vivo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-16 md:py-24 bg-white border-y border-[#EAE7DF] px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#EF4444]">
              El Problema Real
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] font-display">
              ¿Hacés marketing pero no sabés qué publicar?
            </h2>
            <p className="text-sm sm:text-base text-[#737373]">
              Hacer crecer un negocio ya es agotador. Tratar de ser community manager, copywriter y estratega a la vez termina en frustración.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {painPoints.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#EAE7DF] hover:border-[#D5D0C2] transition-all space-y-2"
              >
                <div className="text-2xl">{item.icon}</div>
                <h3 className="font-bold text-base text-[#171717]">{item.title}</h3>
                <p className="text-xs text-[#737373] leading-relaxed">{item.description}</p>
              </div>
            ))}

            {/* Solution bridge card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#6C5CE7] to-[#A78BFA] text-white space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider opacity-90">
                  La Solución
                </span>
                <h3 className="font-bold text-lg mt-1">MARKETIA resuelve esto por vos.</h3>
                <p className="text-xs text-white/85 mt-1 leading-relaxed">
                  Un sistema inteligente que te dice exactamente qué hacer cada día.
                </p>
              </div>
              <Button
                variant="accent"
                size="sm"
                className="w-full text-xs font-bold"
                onClick={() => setView('onboarding')}
              >
                Comenzar ahora
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION / VIRTUAL TEAM SECTION */}
      <section className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="space-y-12 max-w-5xl mx-auto">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6C5CE7]">
              Tu Equipo Virtual
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] font-display">
              Un equipo de marketing senior en tu bolsillo
            </h2>
            <p className="text-sm sm:text-base text-[#737373]">
              No es un chatbot genérico. Son módulos especializados que trabajan juntos conociendo el contexto de tu negocio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {teamRoles.map((role, i) => {
              const Icon = role.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white border border-[#EAE7DF] shadow-2xs hover:shadow-sm transition-all flex items-start gap-4"
                >
                  <div className="p-3 rounded-xl bg-[#6C5CE7]/10 text-[#6C5CE7] shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-[#6C5CE7] uppercase tracking-wider">
                        {role.role}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF9F6] border border-[#EAE7DF] text-[#737373] font-semibold">
                        {role.tag}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#171717]">{role.name}</h3>
                    <p className="text-xs text-[#737373] leading-relaxed">{role.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className="py-16 md:py-24 bg-white border-y border-[#EAE7DF] px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6C5CE7]">
              Paso a Paso
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] font-display">
              ¿Cómo funciona MARKETIA?
            </h2>
            <p className="text-sm sm:text-base text-[#737373]">
              En menos de 3 minutos pasás de la incertidumbre a un plan de marketing estructurado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#EAE7DF] space-y-3 text-center">
              <div className="w-10 h-10 rounded-full bg-[#6C5CE7] text-white font-extrabold flex items-center justify-center mx-auto text-base">
                1
              </div>
              <h3 className="font-bold text-base text-[#171717]">Contanos sobre tu negocio</h3>
              <p className="text-xs text-[#737373] leading-relaxed">
                Respondé 5 preguntas simples sobre tu oferta, cliente ideal, objetivos y redes actuales.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#EAE7DF] space-y-3 text-center">
              <div className="w-10 h-10 rounded-full bg-[#A78BFA] text-white font-extrabold flex items-center justify-center mx-auto text-base">
                2
              </div>
              <h3 className="font-bold text-base text-[#171717]">MARKETIA analiza tu situación</h3>
              <p className="text-xs text-[#737373] leading-relaxed">
                Gemini AI cruza tu información con patrones de marketing de alto rendimiento y calcula tu score.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#EAE7DF] space-y-3 text-center">
              <div className="w-10 h-10 rounded-full bg-[#22C55E] text-white font-extrabold flex items-center justify-center mx-auto text-base">
                3
              </div>
              <h3 className="font-bold text-base text-[#171717]">Recibí tu estrategia y ejecutá</h3>
              <p className="text-xs text-[#737373] leading-relaxed">
                Obtené tu calendario de 30 días, guiones de Reels y campañas listos para copiar y publicar.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setView('onboarding')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Comenzar en 3 minutos
            </Button>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="space-y-12 max-w-5xl mx-auto">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6C5CE7]">
              Funcionalidades
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] font-display">
              Todo lo que necesitás en una sola plataforma
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.id}
                  className="p-5 rounded-2xl bg-white border border-[#EAE7DF] space-y-3 hover:border-[#D5D0C2] transition-all"
                >
                  <div className={`p-3 rounded-xl w-fit ${feat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[#171717]">{feat.title}</h3>
                  <p className="text-xs text-[#737373] leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="precios" className="py-16 md:py-24 bg-white border-y border-[#EAE7DF] px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6C5CE7]">
              Precios Transparentes
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] font-display">
              Mucho menos que una agencia. Mucho más que un chatbot.
            </h2>
            <p className="text-sm text-[#737373]">
              Elegí el plan que mejor se adapte a la etapa de tu negocio.
            </p>

            {/* Toggle */}
            <div className="pt-3">
              <div className="p-1 bg-[#EFECE6] rounded-xl inline-flex items-center gap-1 text-xs font-semibold">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                    billingCycle === 'monthly' ? 'bg-white text-[#171717] shadow-xs' : 'text-[#737373]'
                  }`}
                >
                  Mensual
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    billingCycle === 'annual' ? 'bg-white text-[#171717] shadow-xs' : 'text-[#737373]'
                  }`}
                >
                  Anual <span className="text-[10px] px-1.5 py-0.2 bg-[#22C55E]/15 text-[#15803D] rounded-full">20% OFF</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* FREE */}
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#EAE7DF] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#171717]">FREE</h3>
                <p className="text-xs text-[#737373] mt-1">Para validar y probar</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-[#171717]">$0</span>
                  <span className="text-xs text-[#737373] ml-1">por siempre</span>
                </div>
                <div className="space-y-2.5 text-xs text-[#525252] pt-4 border-t border-[#EAE7DF]">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Análisis inicial de negocio</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Marketing Score & FODA</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> 3 generaciones con IA</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Calendario de 7 días</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="md"
                className="w-full mt-6"
                onClick={() => setView('onboarding')}
              >
                Comenzar gratis
              </Button>
            </div>

            {/* STARTER */}
            <div className="p-6 rounded-2xl bg-white border-2 border-[#6C5CE7] shadow-lg relative flex flex-col justify-between">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#6C5CE7] text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3" /> Recomendado
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#171717]">STARTER</h3>
                <p className="text-xs text-[#737373] mt-1">Para negocios en crecimiento</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-[#171717]">
                    {billingCycle === 'monthly' ? '$10' : '$8'}
                  </span>
                  <span className="text-xs text-[#737373] ml-1">USD / mes</span>
                  <p className="text-[11px] text-[#737373] mt-0.5">($15.000 pesos argentinos)</p>
                </div>
                <div className="space-y-2.5 text-xs text-[#525252] pt-4 border-t border-[#EAE7DF]">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Todo lo del plan Free</div>
                  <div className="flex items-center gap-2 font-semibold text-[#171717]"><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> 20 generaciones al mes</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Calendario de 30 días completo</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Generador de Reels en segundos</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> 3 campañas publicitarias</div>
                </div>
              </div>
              <Button
                variant="primary"
                size="md"
                className="w-full mt-6"
                onClick={() => setView('onboarding')}
              >
                Crear estrategia
              </Button>
            </div>

            {/* PRO */}
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#EAE7DF] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#171717]">PRO</h3>
                <p className="text-xs text-[#737373] mt-1">Para escalar con IA ilimitada</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-[#171717]">
                    {billingCycle === 'monthly' ? '$17.50' : '$14'}
                  </span>
                  <span className="text-xs text-[#737373] ml-1">USD / mes</span>
                  <p className="text-[11px] text-[#737373] mt-0.5">($26.250 pesos argentinos)</p>
                </div>
                <div className="space-y-2.5 text-xs text-[#525252] pt-4 border-t border-[#EAE7DF]">
                  <div className="flex items-center gap-2 font-bold text-[#6C5CE7]"><Sparkles className="w-3.5 h-3.5 text-[#F59EBD]" /> Generaciones IA ILIMITADAS</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Copilot Asistente 24/7 sin límites</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Analytics con diagnóstico IA</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Campañas y guiones ilimitados</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Soporte prioritario</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="md"
                className="w-full mt-6"
                onClick={() => setView('onboarding')}
              >
                Elegir Pro
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#171717] font-display">
          Empezá a hacer marketing con estrategia.
        </h2>
        <p className="text-base text-[#525252] max-w-xl mx-auto leading-relaxed">
          Dejá de improvisar publicaciones y transformá tu presencia digital en ventas reales con MARKETIA.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setView('onboarding')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Crear mi estrategia gratis
          </Button>
          <Button
            variant="soft"
            size="lg"
            onClick={loadDemoData}
          >
            Ver demo de Luna Café
          </Button>
        </div>
      </section>
    </div>
  );
};
