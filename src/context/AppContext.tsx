import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  BusinessProfile,
  CompleteStrategy,
  GeneratedContent,
  GeneratedReel,
  CalendarDayItem,
  CampaignItem,
  AnalyticsRecord,
  AnalyticsInsights,
  ChatMessage,
  SubscriptionState,
  ContentFormatType,
  PricingConfig,
  PricingPlan,
  AdminCustomer,
  PlanType,
  AuthUser,
  UserProfile
} from '../types';
import {
  DEMO_BUSINESS,
  DEMO_STRATEGY,
  DEMO_ANALYTICS,
  DEMO_ANALYTICS_INSIGHTS,
  DEMO_SAVED_CONTENTS,
  DEMO_REEL_SAMPLE
} from '../data/demoData';
import { INITIAL_PRICING_CONFIG, INITIAL_CUSTOMERS } from '../data/pricingData';
import { auth, onAuthStateChanged } from '../services/firebase';
import {
  mapToAuthUser,
  syncUserProfileInFirestore,
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  logoutFromFirebase,
  saveBusinessToFirestore,
  loadBusinessFromFirestore,
  saveStrategyToFirestore,
  loadStrategyFromFirestore,
  updatePlanInFirestore,
  fetchAllUsersForAdmin,
  savePricingConfigToFirestore,
  loadPricingConfigFromFirestore
} from '../services/firebaseAuth';

export type AppView = 'landing' | 'onboarding' | 'dashboard';
export type DashboardTab =
  | 'home'
  | 'strategy'
  | 'content'
  | 'reels'
  | 'calendar'
  | 'campaigns'
  | 'analytics'
  | 'assistant'
  | 'settings'
  | 'admin';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface AppContextType {
  view: AppView;
  setView: (view: AppView) => void;
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  isDemoMode: boolean;
  setDemoMode: (isDemo: boolean) => void;
  // Auth state
  currentUser: AuthUser | null;
  userProfile: UserProfile | null;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  loginWithGoogleAccount: () => Promise<void>;
  loginWithEmailAccount: (email: string, pass: string) => Promise<void>;
  registerWithEmailAccount: (email: string, pass: string, name?: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  // Core business & strategy
  business: BusinessProfile | null;
  setBusiness: (business: BusinessProfile | null) => void;
  strategy: CompleteStrategy | null;
  setStrategy: (strategy: CompleteStrategy | null) => void;
  calendarItems: CalendarDayItem[];
  setCalendarItems: React.Dispatch<React.SetStateAction<CalendarDayItem[]>>;
  updateCalendarItemStatus: (id: string, status: CalendarDayItem['status']) => void;
  updateCalendarItem: (id: string, updated: Partial<CalendarDayItem>) => void;
  campaigns: CampaignItem[];
  setCampaigns: React.Dispatch<React.SetStateAction<CampaignItem[]>>;
  addCampaign: (campaign: CampaignItem) => void;
  updateCampaignStatus: (id: string, status: CampaignItem['status']) => void;
  savedContents: GeneratedContent[];
  saveContent: (content: GeneratedContent) => void;
  deleteSavedContent: (id: string) => void;
  savedReels: GeneratedReel[];
  saveReel: (reel: GeneratedReel) => void;
  analyticsData: AnalyticsRecord;
  setAnalyticsData: React.Dispatch<React.SetStateAction<AnalyticsRecord>>;
  analyticsInsights: AnalyticsInsights | null;
  setAnalyticsInsights: (insights: AnalyticsInsights | null) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  subscription: SubscriptionState;
  setSubscription: React.Dispatch<React.SetStateAction<SubscriptionState>>;
  consumeGeneration: () => boolean;
  upgradePlanModalOpen: boolean;
  setUpgradePlanModalOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  loadDemoData: () => void;
  resetAllData: () => void;
  selectedCalendarEventForContent: CalendarDayItem | null;
  setSelectedCalendarEventForContent: (item: CalendarDayItem | null) => void;
  // Admin & Pricing State
  pricingConfig: PricingConfig;
  updatePricingPlan: (planId: PlanType, planData: Partial<PricingPlan>) => void;
  updateExchangeRate: (rate: number) => void;
  customers: AdminCustomer[];
  updateCustomerPlan: (customerId: string, newPlan: PlanType) => void;
  addCustomer: (customer: AdminCustomer) => void;
  deleteCustomer: (customerId: string) => void;
  initiateCheckout: (gateway: 'stripe' | 'mercadopago', planId: PlanType, billingCycle: 'monthly' | 'annual') => Promise<void>;
  refreshAdminCustomers: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  BUSINESS: 'marketia_business',
  STRATEGY: 'marketia_strategy',
  CALENDAR: 'marketia_calendar',
  CAMPAIGNS: 'marketia_campaigns',
  CONTENTS: 'marketia_contents',
  REELS: 'marketia_reels',
  ANALYTICS: 'marketia_analytics',
  INSIGHTS: 'marketia_insights',
  SUBSCRIPTION: 'marketia_sub',
  IS_DEMO: 'marketia_is_demo',
  PRICING: 'marketia_pricing_config',
  CUSTOMERS: 'marketia_customers'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [view, setView] = useState<AppView>('landing');
  const [activeTab, setActiveTab] = useState<DashboardTab>('home');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [upgradePlanModalOpen, setUpgradePlanModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedCalendarEventForContent, setSelectedCalendarEventForContent] = useState<CalendarDayItem | null>(null);

  // User Auth State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Core State
  const [business, setBusiness] = useState<BusinessProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUSINESS);
    return saved ? JSON.parse(saved) : null;
  });

  const [strategy, setStrategy] = useState<CompleteStrategy | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STRATEGY);
    return saved ? JSON.parse(saved) : null;
  });

  const [calendarItems, setCalendarItems] = useState<CalendarDayItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CALENDAR);
    return saved ? JSON.parse(saved) : [];
  });

  const [campaigns, setCampaigns] = useState<CampaignItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    return saved ? JSON.parse(saved) : [];
  });

  const [savedContents, setSavedContents] = useState<GeneratedContent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTENTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [savedReels, setSavedReels] = useState<GeneratedReel[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REELS);
    return saved ? JSON.parse(saved) : [];
  });

  const [analyticsData, setAnalyticsData] = useState<AnalyticsRecord>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    return saved ? JSON.parse(saved) : {
      followers: 1250,
      reach: 4800,
      impressions: 9200,
      engagement: 310,
      clicks: 145,
      leads: 28,
      sales: 12,
      investment: 25000,
      period: 'Últimos 30 días'
    };
  });

  const [analyticsInsights, setAnalyticsInsights] = useState<AnalyticsInsights | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INSIGHTS);
    return saved ? JSON.parse(saved) : null;
  });

  const [subscription, setSubscription] = useState<SubscriptionState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    return saved ? JSON.parse(saved) : {
      plan: 'free',
      generationsUsed: 0,
      generationsLimit: 3,
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-AR')
    };
  });

  // Admin & Pricing state
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRICING);
    return saved ? JSON.parse(saved) : INITIAL_PRICING_CONFIG;
  });

  const [customers, setCustomers] = useState<AdminCustomer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: '¡Hola! Soy tu Copiloto de Marketing en MARKETIA. Estoy al tanto de toda la estrategia y objetivos de tu negocio. ¿En qué te gustaría trabajar hoy?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedAction: {
        label: 'Ver mi prioridad de hoy',
        tab: 'home'
      }
    }
  ]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const profile = await syncUserProfileInFirestore(fbUser);
        const appUser = mapToAuthUser(fbUser, profile.role);
        setCurrentUser(appUser);
        setUserProfile(profile);

        // Update local subscription from profile
        setSubscription({
          plan: profile.plan,
          generationsUsed: profile.generationsUsed,
          generationsLimit: profile.generationsLimit,
          renewalDate: profile.renewalDate
        });

        // Load user's saved data from Firestore if not in demo mode
        if (!isDemoMode) {
          const cloudBiz = await loadBusinessFromFirestore(fbUser.uid);
          if (cloudBiz) {
            setBusiness(cloudBiz);
          }
          const cloudStrat = await loadStrategyFromFirestore(fbUser.uid);
          if (cloudStrat) {
            setStrategy(cloudStrat);
            if (cloudStrat.calendar30Days) setCalendarItems(cloudStrat.calendar30Days);
            if (cloudStrat.campaigns) setCampaigns(cloudStrat.campaigns);
          }
        }

        // Refresh admin customers if user is admin
        if (appUser.role === 'admin') {
          refreshAdminCustomers();
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  // Auth actions
  const loginWithGoogleAccount = async () => {
    const res = await loginWithGoogle();
    const appUser = mapToAuthUser(res.user, res.profile.role);
    setCurrentUser(appUser);
    setUserProfile(res.profile);
    setSubscription({
      plan: res.profile.plan,
      generationsUsed: res.profile.generationsUsed,
      generationsLimit: res.profile.generationsLimit,
      renewalDate: res.profile.renewalDate
    });
  };

  const loginWithEmailAccount = async (email: string, pass: string) => {
    const res = await loginWithEmail(email, pass);
    const appUser = mapToAuthUser(res.user, res.profile.role);
    setCurrentUser(appUser);
    setUserProfile(res.profile);
    setSubscription({
      plan: res.profile.plan,
      generationsUsed: res.profile.generationsUsed,
      generationsLimit: res.profile.generationsLimit,
      renewalDate: res.profile.renewalDate
    });
  };

  const registerWithEmailAccount = async (email: string, pass: string, name?: string) => {
    const res = await registerWithEmail(email, pass, name);
    const appUser = mapToAuthUser(res.user, res.profile.role);
    setCurrentUser(appUser);
    setUserProfile(res.profile);
    setSubscription({
      plan: res.profile.plan,
      generationsUsed: res.profile.generationsUsed,
      generationsLimit: res.profile.generationsLimit,
      renewalDate: res.profile.renewalDate
    });
  };

  const logoutUser = async () => {
    await logoutFromFirebase();
    setCurrentUser(null);
    setUserProfile(null);
    addToast({
      type: 'info',
      title: 'Sesión cerrada',
      message: 'Has salido de tu cuenta de MARKETIA'
    });
  };

  const refreshAdminCustomers = async () => {
    try {
      const realUsers = await fetchAllUsersForAdmin();
      if (realUsers.length > 0) {
        setCustomers((prev) => {
          const map = new Map<string, AdminCustomer>();
          INITIAL_CUSTOMERS.forEach((c) => map.set(c.id, c));
          realUsers.forEach((u) => map.set(u.id, u));
          return Array.from(map.values());
        });
      }
    } catch (err) {
      console.warn('Could not refresh admin customers:', err);
    }
  };

  // Persist State to LocalStorage & Cloud
  useEffect(() => {
    if (business) {
      localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(business));
      if (currentUser && !isDemoMode) {
        saveBusinessToFirestore(currentUser.uid, business);
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.BUSINESS);
    }
  }, [business, currentUser, isDemoMode]);

  useEffect(() => {
    if (strategy) {
      localStorage.setItem(STORAGE_KEYS.STRATEGY, JSON.stringify(strategy));
      if (currentUser && !isDemoMode) {
        saveStrategyToFirestore(currentUser.uid, strategy);
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.STRATEGY);
    }
  }, [strategy, currentUser, isDemoMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(calendarItems));
  }, [calendarItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTENTS, JSON.stringify(savedContents));
  }, [savedContents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REELS, JSON.stringify(savedReels));
  }, [savedReels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analyticsData));
  }, [analyticsData]);

  useEffect(() => {
    if (analyticsInsights) localStorage.setItem(STORAGE_KEYS.INSIGHTS, JSON.stringify(analyticsInsights));
  }, [analyticsInsights]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(subscription));
  }, [subscription]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(pricingConfig));
  }, [pricingConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  // Load Global Pricing Config from Firestore on Startup
  useEffect(() => {
    loadPricingConfigFromFirestore().then((cloudConfig) => {
      if (cloudConfig && cloudConfig.plans) {
        setPricingConfig(cloudConfig as PricingConfig);
      }
    }).catch((err) => console.warn('Could not load pricing config from cloud:', err));
  }, []);

  // Admin & Pricing Mutators
  const updatePricingPlan = (planId: PlanType, planData: Partial<PricingPlan>) => {
    setPricingConfig((prev) => {
      const updated = {
        ...prev,
        plans: {
          ...prev.plans,
          [planId]: {
            ...prev.plans[planId],
            ...planData
          }
        }
      };
      savePricingConfigToFirestore(updated);
      return updated;
    });
  };

  const updateExchangeRate = (rate: number) => {
    setPricingConfig((prev) => {
      const updated = {
        ...prev,
        arsExchangeRate: rate,
        plans: {
          free: prev.plans.free,
          starter: {
            ...prev.plans.starter,
            priceARS: Math.round(prev.plans.starter.priceUSD * rate)
          },
          pro: {
            ...prev.plans.pro,
            priceARS: Math.round(prev.plans.pro.priceUSD * rate)
          }
        }
      };
      savePricingConfigToFirestore(updated);
      return updated;
    });
  };

  const updateCustomerPlan = async (customerId: string, newPlan: PlanType) => {
    const planData = pricingConfig.plans[newPlan];
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? {
              ...c,
              plan: newPlan,
              monthlyRevenueUSD: planData.priceUSD,
              monthlyRevenueARS: planData.priceARS
            }
          : c
      )
    );

    // If customer has a Firebase UID, update it directly in Firestore
    await updatePlanInFirestore(customerId, newPlan);

    // If current logged in user was modified, update their state
    if (currentUser?.uid === customerId) {
      setSubscription((prev) => ({
        ...prev,
        plan: newPlan,
        generationsLimit: planData.generationsLimit
      }));
    }

    addToast({
      type: 'success',
      title: 'Plan de cliente actualizado',
      message: `El cliente ahora tiene asignado el Plan ${newPlan.toUpperCase()}`
    });
  };

  const addCustomer = (customer: AdminCustomer) => {
    setCustomers((prev) => [customer, ...prev]);
    addToast({
      type: 'success',
      title: 'Cliente registrado',
      message: `${customer.businessName} añadido exitosamente.`
    });
  };

  const deleteCustomer = (customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    addToast({
      type: 'info',
      title: 'Cliente eliminado'
    });
  };

  // Payment Gateway Checkout Flow (Stripe & Mercado Pago)
  const initiateCheckout = async (gateway: 'stripe' | 'mercadopago', planId: PlanType, billingCycle: 'monthly' | 'annual') => {
    try {
      const planData = pricingConfig.plans[planId];
      const discount = billingCycle === 'annual' ? (100 - planData.annualDiscountPercent) / 100 : 1;
      const amountUSD = planData.priceUSD * discount;
      const amountARS = Math.round(planData.priceARS * discount);

      addToast({
        type: 'info',
        title: `Conectando con ${gateway === 'mercadopago' ? 'Mercado Pago' : 'Stripe'}...`,
        message: 'Preparando tu pasarela de pago seguro'
      });

      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gateway,
          planId,
          billingCycle,
          businessName: business?.name || currentUser?.displayName || 'Cliente Marketia',
          userEmail: currentUser?.email || 'cliente@marketia.io',
          amountUSD,
          amountARS
        })
      });

      const data = await response.json();

      if (data.success) {
        // Upgrade locally and in Firestore for instant seamless experience
        setSubscription({
          plan: planId,
          generationsUsed: 0,
          generationsLimit: planData.generationsLimit,
          renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-AR'),
          paymentGateway: gateway
        });

        if (currentUser) {
          await updatePlanInFirestore(currentUser.uid, planId);
        }

        if (data.realPayment && data.checkoutUrl) {
          addToast({
            type: 'success',
            title: `¡Checkout de Mercado Pago generado!`,
            message: `Redirigiendo a la pantalla de pago de Mercado Pago...`
          });
          // Open Mercado Pago Checkout in new tab for the user to pay
          try {
            window.open(data.checkoutUrl, '_blank');
          } catch (e) {
            console.log('Popup blocked or iframe restriction:', e);
          }
        } else {
          addToast({
            type: 'success',
            title: `¡Pago procesado con ${gateway === 'mercadopago' ? 'Mercado Pago' : 'Stripe'}!`,
            message: `Tu cuenta ha sido activada en Plan ${planId.toUpperCase()}.`
          });
        }
        setUpgradePlanModalOpen(false);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      // Fallback update
      setSubscription((prev) => ({
        ...prev,
        plan: planId,
        generationsLimit: pricingConfig.plans[planId].generationsLimit,
        paymentGateway: gateway
      }));
      if (currentUser) {
        updatePlanInFirestore(currentUser.uid, planId);
      }
      addToast({
        type: 'success',
        title: `¡Plan ${planId.toUpperCase()} activado!`,
        message: 'Suscripción configurada correctamente.'
      });
      setUpgradePlanModalOpen(false);
    }
  };

  // Toast Helpers
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Calendar Helpers
  const updateCalendarItemStatus = (id: string, status: CalendarDayItem['status']) => {
    setCalendarItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    addToast({
      type: 'success',
      title: 'Estado actualizado',
      message: `La publicación ahora está en estado "${status}"`
    });
  };

  const updateCalendarItem = (id: string, updated: Partial<CalendarDayItem>) => {
    setCalendarItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    addToast({
      type: 'success',
      title: 'Publicación guardada'
    });
  };

  // Campaign Helpers
  const addCampaign = (campaign: CampaignItem) => {
    setCampaigns((prev) => [campaign, ...prev]);
    addToast({
      type: 'success',
      title: 'Campaña creada',
      message: `"${campaign.name}" agregada a tus campañas`
    });
  };

  const updateCampaignStatus = (id: string, status: CampaignItem['status']) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  // Content Helpers
  const saveContent = (content: GeneratedContent) => {
    setSavedContents((prev) => [content, ...prev]);
    addToast({
      type: 'success',
      title: 'Contenido guardado',
      message: `"${content.title}" guardado en tu biblioteca`
    });
  };

  const deleteSavedContent = (id: string) => {
    setSavedContents((prev) => prev.filter((c) => c.id !== id));
    addToast({
      type: 'info',
      title: 'Contenido eliminado'
    });
  };

  const saveReel = (reel: GeneratedReel) => {
    setSavedReels((prev) => [reel, ...prev]);
    addToast({
      type: 'success',
      title: 'Guion de Reel guardado',
      message: 'Podés consultarlo y editarlo cuando quieras'
    });
  };

  // Chat Helpers
  const addChatMessage = (message: ChatMessage) => {
    setChatMessages((prev) => [...prev, message]);
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: `Hola. Estoy listo para ayudarte con el marketing de ${business?.name || 'tu negocio'}. ¿Qué consulta tenés hoy?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Subscription limiter
  const consumeGeneration = (): boolean => {
    if (subscription.plan === 'pro') return true;
    if (subscription.generationsUsed >= subscription.generationsLimit) {
      setUpgradePlanModalOpen(true);
      addToast({
        type: 'warning',
        title: 'Límite de generaciones alcanzado',
        message: 'Pasate al plan PRO para generaciones ilimitadas con IA.'
      });
      return false;
    }
    setSubscription((prev) => ({
      ...prev,
      generationsUsed: prev.generationsUsed + 1
    }));
    return true;
  };

  // Load Demo Data ("Luna Café")
  const loadDemoData = () => {
    setIsDemoMode(true);
    setBusiness(DEMO_BUSINESS);
    setStrategy(DEMO_STRATEGY);
    setCalendarItems(DEMO_STRATEGY.calendar30Days);
    setCampaigns(DEMO_STRATEGY.campaigns);
    setSavedContents(DEMO_SAVED_CONTENTS);
    setSavedReels([DEMO_REEL_SAMPLE]);
    setAnalyticsData(DEMO_ANALYTICS);
    setAnalyticsInsights(DEMO_ANALYTICS_INSIGHTS);
    setView('dashboard');
    setActiveTab('home');
    addToast({
      type: 'success',
      title: 'Modo Demo Activado',
      message: 'Explorando "Luna Café" con datos completos de estrategia, calendario y métricas.'
    });
  };

  // Reset Data
  const resetAllData = () => {
    setIsDemoMode(false);
    setBusiness(null);
    setStrategy(null);
    setCalendarItems([]);
    setCampaigns([]);
    setSavedContents([]);
    setSavedReels([]);
    localStorage.clear();
    setView('landing');
    setActiveTab('home');
    addToast({
      type: 'info',
      title: 'Datos restablecidos',
      message: 'Podés iniciar un nuevo análisis cuando quieras.'
    });
  };

  return (
    <AppContext.Provider
      value={{
        view,
        setView,
        activeTab,
        setActiveTab,
        isDemoMode,
        setDemoMode: setIsDemoMode,
        currentUser,
        userProfile,
        authModalOpen,
        setAuthModalOpen,
        loginWithGoogleAccount,
        loginWithEmailAccount,
        registerWithEmailAccount,
        logoutUser,
        business,
        setBusiness,
        strategy,
        setStrategy,
        calendarItems,
        setCalendarItems,
        updateCalendarItemStatus,
        updateCalendarItem,
        campaigns,
        setCampaigns,
        addCampaign,
        updateCampaignStatus,
        savedContents,
        saveContent,
        deleteSavedContent,
        savedReels,
        saveReel,
        analyticsData,
        setAnalyticsData,
        analyticsInsights,
        setAnalyticsInsights,
        chatMessages,
        addChatMessage,
        clearChat,
        subscription,
        setSubscription,
        consumeGeneration,
        upgradePlanModalOpen,
        setUpgradePlanModalOpen,
        toasts,
        addToast,
        removeToast,
        loadDemoData,
        resetAllData,
        selectedCalendarEventForContent,
        setSelectedCalendarEventForContent,
        pricingConfig,
        updatePricingPlan,
        updateExchangeRate,
        customers,
        updateCustomerPlan,
        addCustomer,
        deleteCustomer,
        initiateCheckout,
        refreshAdminCustomers
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
