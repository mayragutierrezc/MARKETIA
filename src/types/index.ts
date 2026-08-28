export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'client';
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'client';
  plan: PlanType;
  billingCycle: 'monthly' | 'annual';
  generationsUsed: number;
  generationsLimit: number;
  renewalDate: string;
  createdAt: string;
  updatedAt: string;
}

export type PlanType = 'free' | 'starter' | 'pro';

export interface BusinessProfile {
  id: string;
  name: string;
  category: string;
  description: string;
  city: string;
  country: string;
  website?: string;
  instagram?: string;
  audience: {
    ageRange: string;
    gender: string;
    location: string;
    interests: string;
    problems: string;
    buyingIntent: string;
    knowledgeLevel: string;
  };
  offer: {
    mainProduct: string;
    price: string;
    secondaryProducts: string;
    differential: string;
    currentPromos: string;
  };
  objectives: string[];
  currentMarketing: {
    platforms: string[];
    frequency: string;
    monthlyBudget: string;
    currentStrategies: string;
    mainProblem: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MarketingScore {
  overall: number;
  branding: number;
  contenido: number;
  oferta: number;
  conversion: number;
  redesSociales: number;
  estrategia: number;
  summary: string;
}

export interface BuyerPersona {
  name: string;
  archetype: string;
  demographics: string;
  painPoints: string[];
  motivations: string[];
  preferredChannels: string[];
}

export interface BusinessAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  risks: string[];
  buyerPersona: BuyerPersona;
  valueProposition: string;
  positioning: string;
}

export interface StrategicPriority {
  id: string;
  title: string;
  description: string;
  impact: 'Alto' | 'Medio' | 'Crítico';
  timeframe: string;
  actionSteps: string[];
}

export interface ContentPillar {
  name: string;
  percentage: number;
  description: string;
  examples: string[];
}

export interface ContentStrategy {
  pillars: ContentPillar[];
  tone: string;
  formats: string[];
  frequency: string;
  mainTopics: string[];
}

export interface CampaignItem {
  id: string;
  name: string;
  objective: string;
  targetAudience: string;
  concept: string;
  offer: string;
  keyMessage: string;
  channels: string[];
  duration: string;
  cta: string;
  budgetSuggested?: string;
  kpis?: string[];
  copies?: string[];
  contentIdeas?: string[];
  status?: 'Activa' | 'Borrador' | 'Planificada' | 'Finalizada';
}

export interface CalendarDayItem {
  id: string;
  day: number;
  dayName?: string;
  dateStr?: string;
  platform: 'Instagram' | 'TikTok' | 'LinkedIn' | 'Email' | 'Facebook' | 'YouTube' | 'Twitter / X';
  format: 'Reel' | 'Story' | 'Post' | 'Carrusel' | 'Newsletter' | 'Video' | 'Anuncio';
  topic: string;
  objective: string;
  cta: string;
  status: 'Idea' | 'Pendiente' | 'En progreso' | 'Publicado';
  generatedContentId?: string;
}

export interface CompleteStrategy {
  businessId: string;
  businessAnalysis: BusinessAnalysis;
  marketingScore: MarketingScore;
  strategicPriorities: StrategicPriority[];
  contentStrategy: ContentStrategy;
  campaigns: CampaignItem[];
  calendar30Days: CalendarDayItem[];
  dailyPriorityRecommendation: {
    recommendation: string;
    actionLabel: string;
    actionType: 'create_content' | 'review_campaign' | 'optimize_bio' | 'send_email';
  };
  opportunities: {
    id: string;
    opportunity: string;
    impact: 'Alto' | 'Medio' | 'Crítico';
    difficulty: 'Baja' | 'Media' | 'Alta';
    recommendedAction: string;
  }[];
}

export type ContentFormatType = 'reel' | 'story' | 'post' | 'carousel' | 'linkedin' | 'email' | 'script' | 'ad';

export interface ContentGenerationRequest {
  type: ContentFormatType;
  objective: string;
  product: string;
  audience: string;
  tone: string;
  platform: string;
  cta: string;
  extraDetails?: string;
}

export interface GeneratedContent {
  id: string;
  type: ContentFormatType;
  title: string;
  hook: string;
  body: string;
  structure: string[];
  cta: string;
  hashtags: string[];
  visualSuggestion: string;
  imagePrompt: string;
  createdAt: string;
}

export interface ReelSection {
  timestamp: '0–3 segundos' | '3–8 segundos' | '8–15 segundos' | '15–25 segundos';
  label: string;
  action: string;
  speech: string;
  screenText: string;
}

export interface GeneratedReel {
  id: string;
  product: string;
  hook: string;
  sections: ReelSection[];
  screenTextSummary: string;
  cta: string;
  caption: string;
  visualIdea: string;
  imageVideoPrompt: string;
  audioSuggestion?: string;
  createdAt: string;
}

export interface AnalyticsRecord {
  followers: number;
  reach: number;
  impressions: number;
  engagement: number;
  clicks: number;
  leads: number;
  sales: number;
  investment: number;
  period: string;
}

export interface AnalyticsInsights {
  engagementRate: number; // in %
  ctr: number; // in %
  conversionRate: number; // in %
  cac: number; // in $
  roas: number; // in x
  working: string[];
  failing: string[];
  shouldChange: string[];
  shouldTest: string[];
  summary: string;
  isOrientative: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    tab: string;
    payload?: any;
  };
}

export interface PricingPlan {
  id: PlanType;
  name: string;
  tagline: string;
  priceUSD: number;
  priceARS: number;
  annualDiscountPercent: number;
  generationsLimit: number; // Infinity for unlimited
  popular?: boolean;
  features: string[];
}

export interface PricingConfig {
  plans: {
    free: PricingPlan;
    starter: PricingPlan;
    pro: PricingPlan;
  };
  arsExchangeRate: number;
  stripeEnabled: boolean;
  mercadoPagoEnabled: boolean;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  businessName: string;
  category: string;
  plan: PlanType;
  paymentMethod: 'stripe' | 'mercadopago' | 'free';
  status: 'active' | 'past_due' | 'canceled' | 'trial';
  monthlyRevenueUSD: number;
  monthlyRevenueARS: number;
  generationsUsed: number;
  signupDate: string;
  lastActive: string;
  autoRenew: boolean;
}

export interface SubscriptionState {
  plan: PlanType;
  generationsUsed: number;
  generationsLimit: number;
  renewalDate: string;
  paymentGateway?: 'stripe' | 'mercadopago';
}
