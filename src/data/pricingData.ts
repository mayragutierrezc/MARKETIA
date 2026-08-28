import { PricingConfig, AdminCustomer } from '../types';

export const INITIAL_PRICING_CONFIG: PricingConfig = {
  arsExchangeRate: 1500, // 1 USD = 1.500 ARS
  stripeEnabled: true,
  mercadoPagoEnabled: true,
  plans: {
    free: {
      id: 'free',
      name: 'FREE',
      tagline: 'Para probar y validar el potencial de tu negocio',
      priceUSD: 0,
      priceARS: 0,
      annualDiscountPercent: 0,
      generationsLimit: 3,
      popular: false,
      features: [
        'Análisis inicial de negocio con IA',
        'Marketing Score & Diagnóstico FODA',
        '3 generaciones de contenido al mes',
        'Calendario estructurado de 7 días',
        'Soporte estándar por comunidad'
      ]
    },
    starter: {
      id: 'starter',
      name: 'STARTER',
      tagline: 'El copiloto ideal para tu negocio en crecimiento continuo',
      priceUSD: 10,
      priceARS: 15000,
      annualDiscountPercent: 20,
      generationsLimit: 20,
      popular: true,
      features: [
        'Todo lo incluido en Free +',
        '20 generaciones de contenido al mes',
        'Calendario completo de 30 días con pilares',
        'Generador de Reels con desglose de segundos',
        '3 campañas publicitarias completas',
        'Exportación directa a Google Docs y PDF',
        'Soporte prioritario por WhatsApp / Email'
      ]
    },
    pro: {
      id: 'pro',
      name: 'PRO',
      tagline: 'Para marcas y negocios que quieren dominar su mercado',
      priceUSD: 17.5,
      priceARS: 26250,
      annualDiscountPercent: 20,
      generationsLimit: Infinity,
      popular: false,
      features: [
        'Todo lo incluido en Starter +',
        '✨ Generaciones IA ILIMITADAS',
        'Copiloto Asistente IA 24/7 sin restricciones',
        'Módulo Analytics con diagnóstico y KPIs',
        'Campañas, guiones y copies ilimitados',
        'Regeneración modular de hooks y escenas',
        'Exportaciones ilimitadas a Google Docs'
      ]
    }
  }
};

export const INITIAL_CUSTOMERS: AdminCustomer[] = [
  {
    id: 'cust-101',
    name: 'Valentina Rossi',
    email: 'valentina@lunacafe.com',
    businessName: 'Luna Café de Especialidad',
    category: 'Gastronomía / Cafetería',
    plan: 'starter',
    paymentMethod: 'mercadopago',
    status: 'active',
    monthlyRevenueUSD: 10,
    monthlyRevenueARS: 15000,
    generationsUsed: 14,
    signupDate: '12 Ago 2026',
    lastActive: 'Hoy a las 14:20',
    autoRenew: true
  },
  {
    id: 'cust-102',
    name: 'Mateo Benítez',
    email: 'mateo@aurafit.com',
    businessName: 'Aura Fitness & Wellness',
    category: 'Salud y Fitness',
    plan: 'pro',
    paymentMethod: 'stripe',
    status: 'active',
    monthlyRevenueUSD: 17.5,
    monthlyRevenueARS: 26250,
    generationsUsed: 46,
    signupDate: '02 Ago 2026',
    lastActive: 'Hace 30 min',
    autoRenew: true
  },
  {
    id: 'cust-103',
    name: 'Sofía Gomez',
    email: 'sofia@atelier.com',
    businessName: 'Atelier Cerámica Deco',
    category: 'Diseño y Decoración',
    plan: 'starter',
    paymentMethod: 'mercadopago',
    status: 'active',
    monthlyRevenueUSD: 10,
    monthlyRevenueARS: 15000,
    generationsUsed: 9,
    signupDate: '20 Ago 2026',
    lastActive: 'Ayer',
    autoRenew: true
  },
  {
    id: 'cust-104',
    name: 'Dr. Lucas Morales',
    email: 'lucas@moralesdental.com',
    businessName: 'Clínica Odontológica Morales',
    category: 'Salud / Consultorios',
    plan: 'pro',
    paymentMethod: 'stripe',
    status: 'active',
    monthlyRevenueUSD: 17.5,
    monthlyRevenueARS: 26250,
    generationsUsed: 62,
    signupDate: '15 Jul 2026',
    lastActive: 'Hoy a las 11:05',
    autoRenew: true
  },
  {
    id: 'cust-105',
    name: 'Camila Fernandez',
    email: 'camila@bloommoda.com',
    businessName: 'Bloom Indumentaria',
    category: 'Moda / Ecommerce',
    plan: 'free',
    paymentMethod: 'free',
    status: 'trial',
    monthlyRevenueUSD: 0,
    monthlyRevenueARS: 0,
    generationsUsed: 3,
    signupDate: '27 Ago 2026',
    lastActive: 'Hoy a las 09:12',
    autoRenew: false
  }
];
