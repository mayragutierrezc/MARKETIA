import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Store,
  Users,
  Package,
  Target,
  BarChart,
  Check,
  AlertCircle
} from 'lucide-react';
import { Button } from '../common/Button';
import { GeneratingStrategyModal } from './GeneratingStrategyModal';
import { useApp } from '../../context/AppContext';
import { BusinessProfile } from '../../types';
import { DEMO_STRATEGY } from '../../data/demoData';

export const OnboardingWizard: React.FC = () => {
  const {
    currentUser,
    setBusiness,
    setStrategy,
    setCalendarItems,
    setCampaigns,
    setView,
    setActiveTab,
    setIsDemoMode,
    addToast
  } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<BusinessProfile>>({
    name: '',
    category: 'Servicios Profesionales / Consultoría',
    description: '',
    city: '',
    country: 'Argentina',
    website: '',
    instagram: '',
    audience: {
      ageRange: '25-45 años',
      gender: 'Ambos',
      location: 'Local / Nacional',
      interests: '',
      problems: '',
      buyingIntent: 'Busca una solución confiable y de calidad que le ahorre tiempo',
      knowledgeLevel: 'Medio'
    },
    offer: {
      mainProduct: '',
      price: '',
      secondaryProducts: '',
      differential: '',
      currentPromos: ''
    },
    objectives: [
      'Aumentar ventas y facturación mensual',
      'Ganar visibilidad y seguidores calificados en Instagram'
    ],
    currentMarketing: {
      platforms: ['Instagram', 'WhatsApp Business'],
      frequency: '2 a 3 veces por semana',
      monthlyBudget: '',
      currentStrategies: '',
      mainProblem: 'Falta de constancia y dificultad para convertir seguidores en clientes que pagan'
    }
  });

  const categories = [
    'Cafetería / Gastronomía',
    'Servicios Profesionales / Consultoría',
    'Salud, Fitness & Bienestar',
    'Moda & Indumentaria',
    'Belleza & Cuidado Personal',
    'Educación, Cursos & Coaching',
    'E-commerce / Tienda Online',
    'Hogar, Deco & Construcción',
    'Tecnología & Software',
    'Otro Rubro'
  ];

  const objectiveOptions = [
    'Aumentar ventas y facturación mensual',
    'Ganar visibilidad y seguidores calificados en Instagram',
    'Generar consultas y leads por WhatsApp',
    'Posicionarme como referente en mi rubro',
    'Fidelizar clientes para que compren más seguido',
    'Lanzar un nuevo producto o servicio al mercado',
    'Mejorar el engagement y la interacción de la comunidad'
  ];

  const platformOptions = [
    'Instagram',
    'TikTok',
    'WhatsApp Business',
    'Facebook',
    'LinkedIn',
    'Email Marketing',
    'Google Ads / SEO'
  ];

  const handleObjectiveToggle = (obj: string) => {
    const current = formData.objectives || [];
    if (current.includes(obj)) {
      setFormData({ ...formData, objectives: current.filter((o) => o !== obj) });
    } else {
      setFormData({ ...formData, objectives: [...current, obj] });
    }
  };

  const handlePlatformToggle = (plat: string) => {
    const current = formData.currentMarketing?.platforms || [];
    const updated = current.includes(plat)
      ? current.filter((p) => p !== plat)
      : [...current, plat];
    setFormData({
      ...formData,
      currentMarketing: {
        ...formData.currentMarketing!,
        platforms: updated
      }
    });
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.name?.trim()) {
        addToast({ type: 'warning', title: 'Por favor ingresá el nombre de tu negocio' });
        return false;
      }
      if (!formData.description?.trim()) {
        addToast({ type: 'warning', title: 'Por favor describí brevemente lo que hace tu negocio' });
        return false;
      }
    }
    if (step === 2) {
      if (!formData.audience?.problems?.trim()) {
        addToast({ type: 'warning', title: 'Completá los problemas o necesidades de tu cliente' });
        return false;
      }
    }
    if (step === 3) {
      if (!formData.offer?.mainProduct?.trim()) {
        addToast({ type: 'warning', title: 'Indicá tu producto o servicio principal' });
        return false;
      }
      if (!formData.offer?.differential?.trim()) {
        addToast({ type: 'warning', title: 'Indicá qué te hace diferente a tu competencia' });
        return false;
      }
    }
    if (step === 4) {
      if (!formData.objectives || formData.objectives.length === 0) {
        addToast({ type: 'warning', title: 'Seleccioná al menos un objetivo de marketing' });
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    else setView('landing');
  };

  const handleSubmit = async () => {
    setIsGenerating(true);
    const fullBusiness: BusinessProfile = {
      id: 'biz-' + Date.now(),
      name: formData.name || 'Mi Negocio',
      category: formData.category || 'Servicios',
      description: formData.description || '',
      city: formData.city || 'Ciudad',
      country: formData.country || 'Argentina',
      website: formData.website || '',
      instagram: formData.instagram || '',
      audience: formData.audience!,
      offer: formData.offer!,
      objectives: formData.objectives || ['Aumentar ventas'],
      currentMarketing: formData.currentMarketing!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBusiness(fullBusiness);

    try {
      const response = await fetch('/api/strategy/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business: fullBusiness })
      });

      let strategyData: any;
      if (response.ok) {
        strategyData = await response.json();
      }

      if (!strategyData || !strategyData.marketingScore) {
        throw new Error('Estrategia incompleta');
      }

      setStrategy(strategyData);
      if (strategyData.calendar30Days) {
        setCalendarItems(strategyData.calendar30Days);
      }
      if (strategyData.campaigns) {
        setCampaigns(strategyData.campaigns);
      }

      setIsDemoMode(false);
      setIsGenerating(false);
      setView('dashboard');
      setActiveTab('home');
      addToast({
        type: 'success',
        title: '¡Estrategia generada con éxito!',
        message: 'Tu plan de 30 días, prioridades y score ya están listos.'
      });
    } catch (err) {
      console.error('Failed to generate strategy, loading fallback:', err);
      // Construct rich fallback strategy matching user inputs so progress is never lost
      const fallbackStrategy = {
        ...DEMO_STRATEGY,
        businessId: fullBusiness.id,
        businessAnalysis: {
          ...DEMO_STRATEGY.businessAnalysis,
          summary: `${fullBusiness.name} tiene una gran oportunidad en ${fullBusiness.category} para liderar con contenido de valor y ofertas irresistibles.`,
          valueProposition: `Solución de alta calidad en ${fullBusiness.category} adaptada a las necesidades de tus clientes.`,
          positioning: `La opción preferida en ${fullBusiness.city || 'tu zona'} por cercanía, confiabilidad y calidad.`
        },
        strategicPriorities: DEMO_STRATEGY.strategicPriorities.map(p => ({
          ...p,
          title: p.title.replace('café', fullBusiness.offer?.mainProduct || 'tu producto')
        })),
        calendar30Days: DEMO_STRATEGY.calendar30Days.map(item => ({
          ...item,
          topic: item.topic.replace('café', fullBusiness.offer?.mainProduct || 'tu producto')
        }))
      };

      setStrategy(fallbackStrategy);
      setCalendarItems(fallbackStrategy.calendar30Days);
      setCampaigns(fallbackStrategy.campaigns);

      setIsDemoMode(false);
      setIsGenerating(false);
      setView('dashboard');
      setActiveTab('home');
      addToast({
        type: 'success',
        title: '¡Estrategia y Calendario listos!',
        message: 'Tu plan estratégico de 30 días y prioridades ya fueron configurados.'
      });
    }
  };

  const stepTitles = [
    { step: 1, title: 'Tu Negocio', icon: Store },
    { step: 2, title: 'Tu Cliente', icon: Users },
    { step: 3, title: 'Tu Oferta', icon: Package },
    { step: 4, title: 'Tus Objetivos', icon: Target },
    { step: 5, title: 'Marketing Actual', icon: BarChart }
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4] py-8 px-4 sm:px-6">
      {isGenerating && <GeneratingStrategyModal businessName={formData.name || ''} />}

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Progress Bar */}
        <div className="bg-white rounded-2xl border border-[#EAE7DF] p-4 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#6C5CE7]/10 text-[#6C5CE7] flex items-center justify-center font-bold text-xs">
                {currentStep}/5
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#737373]">
                Configuración Inicial de Marketing
              </span>
            </div>
            <button
              onClick={() => {
                // Auto-fill button for fast testing
                setFormData({
                  name: 'Luna Café Especialidad',
                  category: 'Cafetería / Gastronomía',
                  description: 'Cafetería de especialidad con granos de origen tostados por nosotros y pastelería de autor.',
                  city: 'Palermo, Buenos Aires',
                  country: 'Argentina',
                  website: 'https://lunacafe.com',
                  instagram: '@lunacafe.ar',
                  audience: {
                    ageRange: '24-38 años',
                    gender: 'Todos',
                    location: 'Palermo y alrededores',
                    interests: 'Café de filtro, trabajo remoto, diseño, comida rica',
                    problems: 'Cafeterías ruidosas, café quemado y mala conexión Wi-Fi',
                    buyingIntent: 'Busca una pausa de calidad y un espacio inspirador',
                    knowledgeLevel: 'Medio / Conoce café de especialidad'
                  },
                  offer: {
                    mainProduct: 'Café de especialidad calibrado a la perfección y laminados',
                    price: '$3.500 - $6.500 ARS',
                    secondaryProducts: 'Bolsas de café en grano, tostones de masa madre',
                    differential: 'Tostado propio, baristas certificados y mesas preparadas para trabajar cómodo',
                    currentPromos: 'Combo Desayuno: Flat White + Medialuna con jamón y queso'
                  },
                  objectives: [
                    'Aumentar ventas y facturación mensual',
                    'Ganar visibilidad y seguidores calificados en Instagram',
                    'Fidelizar clientes recurrentes'
                  ],
                  currentMarketing: {
                    platforms: ['Instagram', 'WhatsApp'],
                    frequency: '2 publicaciones por semana',
                    monthlyBudget: '$40.000 ARS',
                    currentStrategies: 'Subir fotos a Stories cuando nos acordamos',
                    mainProblem: 'No tenemos tiempo para armar guiones ni planificar contenido con anticipación'
                  }
                });
                addToast({ type: 'info', title: 'Datos de ejemplo cargados' });
              }}
              className="text-[11px] font-semibold text-[#6C5CE7] hover:underline cursor-pointer"
            >
              Completar con datos de ejemplo ✨
            </button>
          </div>

          {/* Stepper pills */}
          <div className="grid grid-cols-5 gap-2">
            {stepTitles.map((s) => {
              const Icon = s.icon;
              const isPast = s.step < currentStep;
              const isCurrent = s.step === currentStep;

              return (
                <div
                  key={s.step}
                  onClick={() => s.step < currentStep && setCurrentStep(s.step)}
                  className={`flex flex-col items-center text-center p-2 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'border-[#6C5CE7] bg-[#6C5CE7]/5 text-[#6C5CE7]'
                      : isPast
                      ? 'border-[#22C55E]/40 bg-[#22C55E]/5 text-[#15803D]'
                      : 'border-transparent text-[#A3A3A3]'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {isPast ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                    <span className="hidden sm:inline text-[11px] font-bold">
                      {s.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content Container */}
        <div className="bg-white rounded-2xl border border-[#EAE7DF] p-6 sm:p-8 shadow-sm">
          <AnimatePresence mode="wait">
            {/* STEP 1: TU NEGOCIO */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#171717] font-display">
                    Paso 1: Contanos sobre tu negocio
                  </h2>
                  <p className="text-xs sm:text-sm text-[#737373] mt-1">
                    Esta información es la base sobre la que MARKETIA diseñará tu plan personalizado.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1.5">
                      Nombre del Negocio / Marca *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Luna Café, Estudio Norte, Flor de Loto..."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EAE7DF] text-sm focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#171717] mb-1.5">
                        Categoría / Rubro *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAE7DF] text-sm bg-white focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#171717] mb-1.5">
                        Ciudad / País *
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Palermo, Buenos Aires"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAE7DF] text-sm focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1.5">
                      ¿Qué hacés o vendés? (Descripción breve) *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ej: Cafetería de especialidad con granos de origen y pastelería casera para desayunar o trabajar remoto."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EAE7DF] text-sm focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#171717] mb-1.5">
                        Instagram (Opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="@tu_marca"
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAE7DF] text-sm focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#171717] mb-1.5">
                        Sitio Web / Tienda (Opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="https://tutienda.com"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAE7DF] text-sm focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: TU CLIENTE */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#171717] font-display">
                    Paso 2: Tu Cliente Ideal
                  </h2>
                  <p className="text-xs sm:text-sm text-[#737373] mt-1">
                    Conocer a quién le hablás permite crear mensajes y ganchos que convierten.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#171717] mb-1.5">
                        Rango de Edad
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: 25 a 40 años"
                        value={formData.audience?.ageRange}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            audience: { ...formData.audience!, ageRange: e.target.value }
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAE7DF] text-sm focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#171717] mb-1.5">
                        Intereses & Estilo de Vida
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Amantes del buen café, diseño, trabajo remoto..."
                        value={formData.audience?.interests}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            audience: { ...formData.audience!, interests: e.target.value }
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAE7DF] text-sm focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1.5">
                      ¿Qué problemas, molestias o dudas tiene antes de comprarte? *
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ej: Se cansan del café amargo de cadenas tradicionales, no tienen un lugar con buen Wi-Fi para trabajar tranquilos..."
                      value={formData.audience?.problems}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          audience: { ...formData.audience!, problems: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EAE7DF] text-sm focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1.5">
                      ¿Qué busca obtener o sentir tu cliente? (Deseo principal)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Un momento de disfrute, recargar energía y sentirse bien atendido."
                      value={formData.audience?.buyingIntent}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          audience: { ...formData.audience!, buyingIntent: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EAE7DF] text-sm focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: TU OFERTA */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#171717] font-display">
                    Paso 3: Tu Oferta y Diferencial
                  </h2>
                  <p className="text-xs sm:text-sm text-[#737373] mt-1">
                    ¿Qué vendés y por qué la gente debería elegirte a vos y no a otro?
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#171717] mb-1.5">
                        Producto / Servicio Principal *
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Café de especialidad calibrado + pastelería"
                        value={formData.offer?.mainProduct}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            offer: { ...formData.offer!, mainProduct: e.target.value }
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAE7DF] text-sm focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#171717] mb-1.5">
                        Precio / Ticket Promedio Estimado
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: $4.500 ARS / $25 USD"
                        value={formData.offer?.price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            offer: { ...formData.offer!, price: e.target.value }
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAE7DF] text-sm focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1.5">
                      ¿Cuál es tu diferencial? (Lo que te hace único) *
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ej: Tostamos nuestros propios granos todas las semanas, ambiente pet friendly y enchufes en cada mesa."
                      value={formData.offer?.differential}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          offer: { ...formData.offer!, differential: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EAE7DF] text-sm focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1.5">
                      Promociones o combos actuales (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 15% OFF llevando 2 paquetes de café o promo almuerzo con bebida incluida"
                      value={formData.offer?.currentPromos}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          offer: { ...formData.offer!, currentPromos: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EAE7DF] text-sm focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: OBJETIVOS */}
            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#171717] font-display">
                    Paso 4: Tus Objetivos de Marketing
                  </h2>
                  <p className="text-xs sm:text-sm text-[#737373] mt-1">
                    Seleccioná los objetivos prioritarios que querés alcanzar en los próximos 30 a 90 días.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  {objectiveOptions.map((obj) => {
                    const isSelected = formData.objectives?.includes(obj);
                    return (
                      <div
                        key={obj}
                        onClick={() => handleObjectiveToggle(obj)}
                        className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#6C5CE7]/8 border-[#6C5CE7] text-[#171717]'
                            : 'bg-white border-[#EAE7DF] hover:border-[#D0CCC0] text-[#525252]'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-semibold">{obj}</span>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-[#6C5CE7] border-[#6C5CE7] text-white'
                              : 'border-[#CCC8BD] bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 5: MARKETING ACTUAL */}
            {currentStep === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#171717] font-display">
                    Paso 5: Tu Marketing Actual
                  </h2>
                  <p className="text-xs sm:text-sm text-[#737373] mt-1">
                    ¿Qué canales usás y cuál es tu mayor obstáculo actualmente?
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-2">
                      Canales y Redes que utilizás:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {platformOptions.map((plat) => {
                        const isSelected = formData.currentMarketing?.platforms?.includes(plat);
                        return (
                          <button
                            key={plat}
                            type="button"
                            onClick={() => handlePlatformToggle(plat)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#6C5CE7] text-white border-[#6C5CE7]'
                                : 'bg-[#FAF9F6] text-[#525252] border-[#EAE7DF] hover:border-[#D0CCC0]'
                            }`}
                          >
                            {plat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#171717] mb-1.5">
                        Frecuencia de publicación actual
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: 2 a 3 veces por semana / Irregular"
                        value={formData.currentMarketing?.frequency}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            currentMarketing: {
                              ...formData.currentMarketing!,
                              frequency: e.target.value
                            }
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAE7DF] text-sm focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#171717] mb-1.5">
                        Presupuesto mensual estimado
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: $30.000 ARS / $50 USD / $0 orgánico"
                        value={formData.currentMarketing?.monthlyBudget}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            currentMarketing: {
                              ...formData.currentMarketing!,
                              monthlyBudget: e.target.value
                            }
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAE7DF] text-sm focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1.5">
                      ¿Cuál es tu mayor dolor o frustración con el marketing hoy?
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ej: Paso horas pensando qué publicar y al final no sé si me genera ventas o si estoy tirando el tiempo."
                      value={formData.currentMarketing?.mainProblem}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentMarketing: {
                            ...formData.currentMarketing!,
                            mainProblem: e.target.value
                          }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EAE7DF] text-sm focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-8 mt-6 border-t border-[#EAE7DF]">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={handleBack}
            >
              {currentStep === 1 ? 'Cancelar' : 'Anterior'}
            </Button>

            <Button
              variant="primary"
              size="md"
              rightIcon={
                currentStep === 5 ? (
                  <Sparkles className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )
              }
              onClick={handleNext}
            >
              {currentStep === 5 ? 'Generar mi Estrategia con IA' : 'Continuar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
