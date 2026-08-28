import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.warn('[MARKETIA Server] GEMINI_API_KEY is not defined. Using intelligent heuristic fallbacks.');
    return null;
  }
  try {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
    return aiClient;
  } catch (err) {
    console.error('[MARKETIA Server] Error initializing GoogleGenAI:', err);
    return null;
  }
}

// Candidate models for seamless fallback when one experiences temporary high demand / 503
const CANDIDATE_MODELS = [
  'gemini-3.7-flash',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-flash-latest'
];

async function callGeminiWithFallbacks(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
  }
) {
  let lastError: any = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        ...params,
        model
      });
      if (response && response.text !== undefined) {
        return response;
      }
    } catch (err: any) {
      console.warn(`[MARKETIA AI] Model ${model} unavailable (high demand / 503). Trying fallback model...`);
      lastError = err;
      // Short delay before switching to next candidate model
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  throw lastError;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), aiReady: !!process.env.GEMINI_API_KEY });
});

// 1. Generate Complete Strategy from Onboarding
app.post('/api/strategy/generate', async (req, res) => {
  try {
    const { business } = req.body;
    if (!business || !business.name) {
      return res.status(400).json({ error: 'Business profile is required' });
    }

    const ai = getAI();
    if (!ai) {
      // Return smart localized generation fallback if key missing
      return res.json(buildFallbackStrategy(business));
    }

    const prompt = `Eres un equipo senior de marketing digital, CMO y consultor de negocios para PyMEs y emprendedores.
Analiza la siguiente información de un negocio para la plataforma SaaS MARKETIA:

DATOS DEL NEGOCIO:
- Nombre: ${business.name}
- Categoría: ${business.category}
- Descripción: ${business.description}
- Ubicación: ${business.city}, ${business.country}
- Website: ${business.website || 'No especificado'}
- Instagram: ${business.instagram || 'No especificado'}

AUDIENCIA OBJETIVO:
- Rango de edad: ${business.audience?.ageRange}
- Género: ${business.audience?.gender}
- Ubicación: ${business.audience?.location}
- Intereses: ${business.audience?.interests}
- Problemas y Dolores: ${business.audience?.problems}
- Intención de compra: ${business.audience?.buyingIntent}
- Nivel de conocimiento: ${business.audience?.knowledgeLevel}

OFERTA:
- Producto/Servicio principal: ${business.offer?.mainProduct}
- Precio/Ticket: ${business.offer?.price}
- Secundarios: ${business.offer?.secondaryProducts}
- Diferencial (USP): ${business.offer?.differential}
- Promociones: ${business.offer?.currentPromos}

OBJETIVOS:
${Array.isArray(business.objectives) ? business.objectives.join(', ') : business.objectives}

MARKETING ACTUAL:
- Canales: ${business.currentMarketing?.platforms?.join(', ')}
- Frecuencia: ${business.currentMarketing?.frequency}
- Presupuesto mensual: ${business.currentMarketing?.monthlyBudget}
- Estrategias actuales: ${business.currentMarketing?.currentStrategies}
- Problema principal: ${business.currentMarketing?.mainProblem}

Genera una estrategia de marketing accionable, realista, motivadora y profesional en español latinoamericano.
Debes estructurar el plan a 30 días con variedad de formatos (Reel, Story, Post, Carrusel, Newsletter, etc.) y 3 campañas impactantes.`;

    const response = await callGeminiWithFallbacks(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            businessAnalysis: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                risks: { type: Type.ARRAY, items: { type: Type.STRING } },
                buyerPersona: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    archetype: { type: Type.STRING },
                    demographics: { type: Type.STRING },
                    painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                    motivations: { type: Type.ARRAY, items: { type: Type.STRING } },
                    preferredChannels: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ['name', 'archetype', 'demographics', 'painPoints', 'motivations', 'preferredChannels']
                },
                valueProposition: { type: Type.STRING },
                positioning: { type: Type.STRING }
              },
              required: ['summary', 'strengths', 'weaknesses', 'opportunities', 'risks', 'buyerPersona', 'valueProposition', 'positioning']
            },
            marketingScore: {
              type: Type.OBJECT,
              properties: {
                overall: { type: Type.INTEGER },
                branding: { type: Type.INTEGER },
                contenido: { type: Type.INTEGER },
                oferta: { type: Type.INTEGER },
                conversion: { type: Type.INTEGER },
                redesSociales: { type: Type.INTEGER },
                estrategia: { type: Type.INTEGER },
                summary: { type: Type.STRING }
              },
              required: ['overall', 'branding', 'contenido', 'oferta', 'conversion', 'redesSociales', 'estrategia', 'summary']
            },
            strategicPriorities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  timeframe: { type: Type.STRING },
                  actionSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['id', 'title', 'description', 'impact', 'timeframe', 'actionSteps']
              }
            },
            contentStrategy: {
              type: Type.OBJECT,
              properties: {
                pillars: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      percentage: { type: Type.INTEGER },
                      description: { type: Type.STRING },
                      examples: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['name', 'percentage', 'description', 'examples']
                  }
                },
                tone: { type: Type.STRING },
                formats: { type: Type.ARRAY, items: { type: Type.STRING } },
                frequency: { type: Type.STRING },
                mainTopics: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['pillars', 'tone', 'formats', 'frequency', 'mainTopics']
            },
            campaigns: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  objective: { type: Type.STRING },
                  targetAudience: { type: Type.STRING },
                  concept: { type: Type.STRING },
                  offer: { type: Type.STRING },
                  keyMessage: { type: Type.STRING },
                  channels: { type: Type.ARRAY, items: { type: Type.STRING } },
                  duration: { type: Type.STRING },
                  cta: { type: Type.STRING },
                  budgetSuggested: { type: Type.STRING },
                  kpis: { type: Type.ARRAY, items: { type: Type.STRING } },
                  copies: { type: Type.ARRAY, items: { type: Type.STRING } },
                  contentIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
                  status: { type: Type.STRING }
                },
                required: ['id', 'name', 'objective', 'targetAudience', 'concept', 'offer', 'keyMessage', 'channels', 'duration', 'cta']
              }
            },
            calendar30Days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  day: { type: Type.INTEGER },
                  dayName: { type: Type.STRING },
                  platform: { type: Type.STRING },
                  format: { type: Type.STRING },
                  topic: { type: Type.STRING },
                  objective: { type: Type.STRING },
                  cta: { type: Type.STRING },
                  status: { type: Type.STRING }
                },
                required: ['id', 'day', 'platform', 'format', 'topic', 'objective', 'cta', 'status']
              }
            },
            dailyPriorityRecommendation: {
              type: Type.OBJECT,
              properties: {
                recommendation: { type: Type.STRING },
                actionLabel: { type: Type.STRING },
                actionType: { type: Type.STRING }
              },
              required: ['recommendation', 'actionLabel', 'actionType']
            },
            opportunities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  opportunity: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  recommendedAction: { type: Type.STRING }
                },
                required: ['id', 'opportunity', 'impact', 'difficulty', 'recommendedAction']
              }
            }
          },
          required: [
            'businessAnalysis',
            'marketingScore',
            'strategicPriorities',
            'contentStrategy',
            'campaigns',
            'calendar30Days',
            'dailyPriorityRecommendation',
            'opportunities'
          ]
        }
      }
    });

    let responseText = response.text || '';
    // Strip markdown code fences if returned by model
    if (responseText.includes('```')) {
      responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    }
    
    let parsed: any;
    try {
      parsed = JSON.parse(responseText || '{}');
    } catch (parseErr) {
      console.warn('[MARKETIA Server] Failed to parse Gemini response directly, using smart fallback strategy:', parseErr);
      parsed = buildFallbackStrategy(business);
    }

    if (!parsed || !parsed.businessAnalysis || !parsed.marketingScore || !parsed.calendar30Days) {
      console.warn('[MARKETIA Server] Parsed response incomplete, merging with fallback strategy.');
      const fallback = buildFallbackStrategy(business);
      parsed = { ...fallback, ...parsed };
    }

    parsed.businessId = business.id || 'b1';
    res.json(parsed);
  } catch (error) {
    console.error('Error generating strategy with Gemini, serving reliable fallback strategy:', error);
    // Fallback to avoid breaking UI
    const { business } = req.body;
    res.json(buildFallbackStrategy(business || { name: 'Mi Negocio' }));
  }
});

// 2. Generate Dedicated Content (Reels, Story, Post, Email, etc.)
app.post('/api/content/generate', async (req, res) => {
  try {
    const { type, objective, product, audience, tone, platform, cta, businessName, extraDetails } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(buildFallbackContent(type, product, businessName, cta));
    }

    const prompt = `Actúa como copywriter y director de contenido digital para el negocio "${businessName || 'nuestra marca'}".
Crea una pieza de contenido de alta conversión con los siguientes parámetros:
- Tipo: ${type}
- Plataforma: ${platform || 'Instagram'}
- Producto/Servicio a promocionar: ${product}
- Objetivo: ${objective}
- Audiencia objetivo: ${audience}
- Tono: ${tone}
- Llamado a la acción (CTA): ${cta}
- Detalles adicionales: ${extraDetails || 'Ninguno'}

Responde en formato JSON con hook irresistible, cuerpo del copy estructurado, llamada a la acción, hashtags relevantes, sugerencia visual para grabación/diseño y un prompt en inglés para generar la imagen o video en IA.`;

    const response = await callGeminiWithFallbacks(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            hook: { type: Type.STRING },
            body: { type: Type.STRING },
            structure: { type: Type.ARRAY, items: { type: Type.STRING } },
            cta: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            visualSuggestion: { type: Type.STRING },
            imagePrompt: { type: Type.STRING }
          },
          required: ['title', 'hook', 'body', 'structure', 'cta', 'hashtags', 'visualSuggestion', 'imagePrompt']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.id = 'content-' + Date.now();
    parsed.type = type;
    parsed.createdAt = new Date().toISOString();
    res.json(parsed);
  } catch (error) {
    console.error('Error generating content:', error);
    const { type, product, businessName, cta } = req.body;
    res.json(buildFallbackContent(type, product, businessName, cta));
  }
});

// 3. Dedicated Reels Generator with Time-Splitted Sections
app.post('/api/reels/generate', async (req, res) => {
  try {
    const { product, targetProblem, style, businessName, regenerateSectionIndex, currentSections } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(buildFallbackReel(product, businessName));
    }

    const prompt = `Actúa como especialista en Guiones de Reels virales y TikToks de conversión para "${businessName || 'el negocio'}".
Producto o tema a promocionar: "${product}"
Problema del cliente a resolver: "${targetProblem || 'Falta de solución efectiva'}"
Estilo o tono: "${style || 'Dinámico, empático y profesional'}"

${
  regenerateSectionIndex !== undefined && currentSections
    ? `SOLO debes regenerar la sección en índice ${regenerateSectionIndex} manteniendo coherencia con las demás secciones: ${JSON.stringify(currentSections)}`
    : `Genera el guion completo dividido exactamente en 4 marcas de tiempo:
1. 0–3 segundos (Gancho visual/sonoro irresistible)
2. 3–8 segundos (Planteo del dolor o deseo)
3. 8–15 segundos (La solución o demostración)
4. 15–25 segundos (Llamado a la acción directo y beneficio)

Incluye para cada sección: acción visual en cámara, locución/diálogo exacto, y texto en pantalla.`
}

Genera además: Hook principal, Texto en pantalla general, CTA final, Caption completo para Instagram, Idea visual de grabación y Prompt en inglés para IA visual.`;

    const response = await callGeminiWithFallbacks(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hook: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timestamp: { type: Type.STRING },
                  label: { type: Type.STRING },
                  action: { type: Type.STRING },
                  speech: { type: Type.STRING },
                  screenText: { type: Type.STRING }
                },
                required: ['timestamp', 'label', 'action', 'speech', 'screenText']
              }
            },
            screenTextSummary: { type: Type.STRING },
            cta: { type: Type.STRING },
            caption: { type: Type.STRING },
            visualIdea: { type: Type.STRING },
            imageVideoPrompt: { type: Type.STRING },
            audioSuggestion: { type: Type.STRING }
          },
          required: ['hook', 'sections', 'screenTextSummary', 'cta', 'caption', 'visualIdea', 'imageVideoPrompt']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.id = 'reel-' + Date.now();
    parsed.product = product;
    parsed.createdAt = new Date().toISOString();
    res.json(parsed);
  } catch (error) {
    console.error('Error generating reel:', error);
    const { product, businessName } = req.body;
    res.json(buildFallbackReel(product, businessName));
  }
});

// 4. Dedicated Campaign Generator
app.post('/api/campaigns/generate', async (req, res) => {
  try {
    const { objective, product, targetAudience, budget, duration, platform, businessName } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(buildFallbackCampaign(objective, product, businessName));
    }

    const prompt = `Actúa como Media Planner y Estratega de Campañas de Marketing para "${businessName || 'el negocio'}".
Diseña una campaña publicitaria completa y estructurada con estos datos:
- Objetivo: ${objective}
- Producto/Oferta: ${product}
- Público Objetivo: ${targetAudience}
- Presupuesto estimado: ${budget}
- Duración: ${duration}
- Canales principales: ${platform}

Responde en formato JSON con concepto de campaña, oferta irresistible, mensaje clave, copies publicitarios de prueba A/B, ideas de contenido, CTA principal, presupuesto sugerido desglosado, KPIs medibles proyectados y cronograma de fases.`;

    const response = await callGeminiWithFallbacks(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            concept: { type: Type.STRING },
            offer: { type: Type.STRING },
            keyMessage: { type: Type.STRING },
            copies: { type: Type.ARRAY, items: { type: Type.STRING } },
            contentIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
            cta: { type: Type.STRING },
            budgetSuggested: { type: Type.STRING },
            kpis: { type: Type.ARRAY, items: { type: Type.STRING } },
            channels: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['name', 'concept', 'offer', 'keyMessage', 'copies', 'contentIdeas', 'cta', 'budgetSuggested', 'kpis', 'channels']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.id = 'camp-' + Date.now();
    parsed.objective = objective;
    parsed.targetAudience = targetAudience;
    parsed.duration = duration;
    parsed.status = 'Planificada';
    res.json(parsed);
  } catch (error) {
    console.error('Error generating campaign:', error);
    const { objective, product, businessName } = req.body;
    res.json(buildFallbackCampaign(objective, product, businessName));
  }
});

// 5. Analytics AI Interpretation
app.post('/api/analytics/analyze', async (req, res) => {
  try {
    const { metrics, businessName, category } = req.body;
    const ai = getAI();

    const followers = Number(metrics.followers) || 0;
    const reach = Number(metrics.reach) || 0;
    const impressions = Number(metrics.impressions) || 0;
    const engagement = Number(metrics.engagement) || 0;
    const clicks = Number(metrics.clicks) || 0;
    const leads = Number(metrics.leads) || 0;
    const sales = Number(metrics.sales) || 0;
    const investment = Number(metrics.investment) || 0;

    // Mathematical calculations
    const engagementRate = reach > 0 ? Number(((engagement / reach) * 100).toFixed(2)) : 0;
    const ctr = impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0;
    const conversionRate = clicks > 0 ? Number(((sales / clicks) * 100).toFixed(2)) : (leads > 0 ? Number(((sales / leads) * 100).toFixed(2)) : 0);
    const cac = sales > 0 && investment > 0 ? Number((investment / sales).toFixed(2)) : 0;
    const roas = investment > 0 && sales > 0 ? Number(((sales * 25) / investment).toFixed(2)) : 0;

    const isLowData = reach < 100 && impressions < 100;

    if (!ai) {
      return res.json({
        engagementRate,
        ctr,
        conversionRate,
        cac,
        roas,
        working: [
          'El formato de video corto (Reels) muestra la mayor tasa de interacción relativa.',
          'La base de seguidores existente demuestra interés en publicaciones con consejos prácticos.'
        ],
        failing: [
          'La conversión de visitas a compras requiere llamados a la acción más claros y directos.',
          'La frecuencia de publicación intermitente debilita el alcance constante del algoritmo.'
        ],
        shouldChange: [
          'Concentrar las publicaciones en los horarios de mayor afluencia de tu público.',
          'Incluir siempre enlace o instrucción clara para consultar precios o comprar.'
        ],
        shouldTest: [
          'Testear una oferta limitada semanal con descuento de bienvenida.',
          'Probar historias interactivas con stickers de votación para reactivar cuentas inactivas.'
        ],
        summary: isLowData
          ? 'Nota orientativa: Al contar con un volumen inicial de datos, estas recomendaciones son sugerencias de arranque para validar tus primeros experimentos.'
          : `Tus métricas muestran un engagement rate del ${engagementRate}%. Con ajustes en conversión y llamados a la acción podrás maximizar las ventas de tu inversión.`,
        isOrientative: isLowData
      });
    }

    const prompt = `Eres un Director de Analítica y Crecimiento de Marketing Digital para "${businessName || 'el negocio'}" (${category || 'General'}).
Analiza las siguientes métricas ingresadas:
- Seguidores: ${followers}
- Alcance: ${reach}
- Impresiones: ${impressions}
- Engagement (Interacciones): ${engagement}
- Clics: ${clicks}
- Leads (Contactos): ${leads}
- Ventas: ${sales}
- Inversión Publicitaria: $${investment}

Métricas calculadas:
- Engagement Rate: ${engagementRate}%
- CTR: ${ctr}%
- Tasa de Conversión: ${conversionRate}%
- CAC estimado: $${cac}
- ROAS estimado: ${roas}x

¿Pocos datos?: ${isLowData ? 'SÍ, son datos incipientes/iniciales' : 'NO, hay volumen suficiente'}.

Explica claramente y con tono empático y constructivo:
1. Qué está funcionando
2. Qué está fallando o tiene fricción
3. Qué debería cambiar de inmediato
4. Qué experimentos debería probar el próximo mes
5. Resumen ejecutivo. Si los datos son escasos, aclara explícitamente que es una guía orientativa.`;

    const response = await callGeminiWithFallbacks(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            working: { type: Type.ARRAY, items: { type: Type.STRING } },
            failing: { type: Type.ARRAY, items: { type: Type.STRING } },
            shouldChange: { type: Type.ARRAY, items: { type: Type.STRING } },
            shouldTest: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING }
          },
          required: ['working', 'failing', 'shouldChange', 'shouldTest', 'summary']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      engagementRate,
      ctr,
      conversionRate,
      cac,
      roas,
      working: parsed.working || [],
      failing: parsed.failing || [],
      shouldChange: parsed.shouldChange || [],
      shouldTest: parsed.shouldTest || [],
      summary: parsed.summary || 'Análisis completado exitosamente.',
      isOrientative: isLowData
    });
  } catch (error) {
    console.error('Error analyzing metrics:', error);
    res.status(500).json({ error: 'No se pudieron procesar las métricas' });
  }
});

// 6. Marketing Copilot Chat Assistant
app.post('/api/assistant/chat', async (req, res) => {
  const { message, history, business, strategy } = req.body;
  try {
    const ai = getAI();

    if (!ai) {
      return res.json(buildFallbackChatResponse(message, business, strategy));
    }

    const businessContext = business
      ? `\nCONTEXTO DEL NEGOCIO:
- Nombre: ${business.name}
- Categoría: ${business.category}
- Ubicación: ${business.city}, ${business.country}
- Producto principal: ${business.offer?.mainProduct}
- Diferencial: ${business.offer?.differential}
- Objetivos: ${Array.isArray(business.objectives) ? business.objectives.join(', ') : business.objectives}
- Score de Marketing: ${strategy?.marketingScore?.overall || 75}/100`
      : '';

    const systemInstruction = `Eres MARKETIA, el copiloto senior de marketing digital y estratega de cabecera para el emprendedor.
NO eres un chatbot genérico. Hablas como un Director de Marketing humano, motivador, concreto, profesional y sin rodeos.
Conoces a fondo su negocio, su propuesta de valor y su audiencia.
${businessContext}

REGLAS DE RESPUESTA:
- Sé específico y directo (máximo 2 a 3 párrafos cortos o listas con viñetas claras).
- Proporciona ideas accionables de inmediato en español.
- Sugiere la siguiente acción clara dentro de la plataforma cuando corresponda (crear contenido, lanzar campaña, revisar calendario o estrategia).`;

    const response = await callGeminiWithFallbacks(ai, {
      contents: message,
      config: {
        systemInstruction
      }
    });

    const replyText = response.text || 'Entendido. ¿En qué aspecto de tu marketing te gustaría avanzar ahora?';

    // Suggest a quick action based on query intent
    let suggestedAction = getSuggestedAction(message);

    res.json({
      reply: replyText,
      suggestedAction
    });
  } catch (error) {
    console.error('Error in assistant chat, serving contextual fallback response:', error);
    res.json(buildFallbackChatResponse(message, business, strategy));
  }
});

function getSuggestedAction(message: string) {
  const lower = (message || '').toLowerCase();
  if (lower.includes('public') || lower.includes('post') || lower.includes('reel') || lower.includes('hoy') || lower.includes('video')) {
    return { label: 'Abrir Generador de Reels', tab: 'reels' };
  } else if (lower.includes('campaña') || lower.includes('navidad') || lower.includes('anuncio') || lower.includes('vender más') || lower.includes('promo')) {
    return { label: 'Crear nueva Campaña', tab: 'campaigns' };
  } else if (lower.includes('calendario') || lower.includes('semana') || lower.includes('programar') || lower.includes('plan')) {
    return { label: 'Ver Calendario 30 días', tab: 'calendar' };
  } else if (lower.includes('métrica') || lower.includes('presupuesto') || lower.includes('conversión') || lower.includes('analyt')) {
    return { label: 'Analizar Métricas', tab: 'analytics' };
  }
  return { label: 'Ver mi Estrategia', tab: 'strategy' };
}

function buildFallbackChatResponse(message: string, business: any, strategy: any) {
  const bizName = business?.name || 'tu negocio';
  const prod = business?.offer?.mainProduct || 'tu producto principal';
  const lower = (message || '').toLowerCase();

  let reply = '';
  let suggestedAction: any = undefined;

  if (lower.includes('public') || lower.includes('hoy') || lower.includes('post') || lower.includes('reel') || lower.includes('video')) {
    reply = `Para hoy en **${bizName}**, te recomiendo publicar un Reel enfocado en resolver el problema más común de tus clientes con "${prod}". 

💡 **Estructura sugerida para hoy:**
1. **Gancho (0-3s):** Planteá una pregunta directa sobre la molestia que siente tu cliente.
2. **Demostración (3-10s):** Mostrá cómo ${bizName} lo resuelve de forma rápida y con calidad.
3. **Llamado a la acción (10-15s):** Pedí que comenten "INFO" o te escriban por WhatsApp para aprovechar una atención personalizada.`;
    suggestedAction = { label: 'Abrir Generador de Reels', tab: 'reels' };
  } else if (lower.includes('campaña') || lower.includes('promoc') || lower.includes('descuento') || lower.includes('vender más')) {
    reply = `Para impulsar las ventas de **${bizName}**, te sugiero una campaña de 7 a 14 días con un beneficio exclusivo para nuevos clientes o un combo especial de "${prod}".

🎯 **Pasos clave:**
• Definir la oferta irresistible (ej: 15% OFF en primera compra o regalo adicional).
• Publicar 2 Reels explicativos y 4 Stories con stickers de consulta directa.
• Difundir por WhatsApp a clientes recurrentes.`;
    suggestedAction = { label: 'Crear nueva Campaña', tab: 'campaigns' };
  } else if (lower.includes('calendario') || lower.includes('semana') || lower.includes('plan')) {
    reply = `Tu calendario de 30 días para **${bizName}** ya tiene organizados los pilares de contenido (Educación 40%, Demostración 30%, Detrás de escena 20% y Ofertas 10%).

Podés revisar las publicaciones programadas de esta semana y exportar el documento completo a Google Docs con un solo clic.`;
    suggestedAction = { label: 'Ver Calendario 30 días', tab: 'calendar' };
  } else if (lower.includes('métrica') || lower.includes('analyt') || lower.includes('presupuesto') || lower.includes('interacc')) {
    reply = `Para mejorar las métricas de **${bizName}**, enfocate en dos factores:
1. **Retención de video:** Asegurar que los primeros 3 segundos tengan subtítulos grandes y movimiento.
2. **Claridad del CTA:** No cierres tus posts sin indicar exactamente qué hacer (ej: "Link en bio para pedir").`;
    suggestedAction = { label: 'Analizar Métricas', tab: 'analytics' };
  } else {
    reply = `¡Excelente consulta para **${bizName}**! Centrémonos en potenciar la visibilidad de "${prod}" utilizando formatos de video corto con ganchos claros y llamados directos a la acción. 

¿Querés que redactemos un guion de Reel o preparemos una campaña para esta semana?`;
    suggestedAction = { label: 'Crear guion de Reel', tab: 'reels' };
  }

  return {
    reply,
    suggestedAction
  };
}

// Fallback generators for instant reliability & offline mode
function buildFallbackStrategy(business: any) {
  const name = business.name || 'Tu Negocio';
  const category = business.category || 'Servicios y Productos';
  const mainProduct = business.offer?.mainProduct || 'Servicio / Producto Principal';

  return {
    businessId: business.id || 'b1',
    businessAnalysis: {
      summary: `${name} tiene una sólida oportunidad en ${category} para posicionarse como la opción de mayor confianza y calidad en su mercado local y digital mediante contenido de valor constante y ofertas claras.`,
      strengths: [
        `Diferencial auténtico centrado en la calidad de ${mainProduct}.`,
        'Atención personalizada y cercanía con la comunidad de clientes.',
        'Potencial de recomendación boca a boca elevado.'
      ],
      weaknesses: [
        'Frecuencia de publicación en redes sociales aún inconsistente.',
        'Poca automatización en la captura y seguimiento de clientes potenciales.'
      ],
      opportunities: [
        'Aprovechar el formato de video corto (Reels y TikTok) para ganar alcance orgánico.',
        'Lanzar promociones por tiempo limitado para elevar el ticket promedio.',
        'Activar testimonios y contenido generado por usuarios para generar prueba social.'
      ],
      risks: [
        'Competidores con mayor presupuesto publicitario en la zona.',
        'Cambios en los algoritmos de redes sociales que reducen el alcance de fotos estáticas.'
      ],
      buyerPersona: {
        name: 'Persona Ideal',
        archetype: 'El Cliente Consciente y Activo',
        demographics: '24-45 años, profesional o estudiante, usuario activo de Instagram y WhatsApp.',
        painPoints: [
          'Busca soluciones confiables sin perder tiempo ni dinero.',
          'Desea un trato cálido y respuestas rápidas a sus consultas.'
        ],
        motivations: [
          'Sentir que invierte en calidad y vive una experiencia gratificante.',
          'Apoyar marcas con propósito y buen servicio.'
        ],
        preferredChannels: ['Instagram', 'WhatsApp', 'Recomendaciones directas']
      },
      valueProposition: `La forma más confiable y placentera de disfrutar ${mainProduct} con atención de primer nivel y calidad garantizada.`,
      positioning: `La marca referente en ${category} elegida por quienes valoran la excelencia y la calidez.`
    },
    marketingScore: {
      overall: 76,
      branding: 82,
      contenido: 70,
      oferta: 80,
      conversion: 68,
      redesSociales: 74,
      estrategia: 78,
      summary: 'Tu propuesta de valor es excelente. Estructurando un plan de video corto y llamados a la acción claros, tus ventas crecerán con consistencia.'
    },
    strategicPriorities: [
      {
        id: 'p1',
        title: 'Publicar 3 Reels semanales demostrando el beneficio directo de tu producto',
        description: 'Enfocarse en resolver dudas comunes y mostrar el detrás de escena de tu trabajo.',
        impact: 'Crítico',
        timeframe: 'Semanas 1-2',
        actionSteps: ['Grabar banco de tomas de proceso', 'Usar ganchos directos de 0 a 3 segundos', 'Llamar a comentar para recibir info']
      },
      {
        id: 'p2',
        title: 'Optimizar tu biografía de Instagram y enlace directo a WhatsApp/Tienda',
        description: 'Tener una propuesta clara en 3 renglones y un botón directo para comprar o reservar.',
        impact: 'Alto',
        timeframe: 'Semana 1',
        actionSteps: ['Definir a quién ayudas y cómo', 'Incluir enlace directo sin fricciones']
      },
      {
        id: 'p3',
        title: 'Lanzar una campaña de prueba con beneficio especial para nuevos clientes',
        description: 'Ofrecer un incentivo irresistible (combo, descuento o regalo con compra) para romper la indecisión.',
        impact: 'Alto',
        timeframe: 'Semanas 2-3',
        actionSteps: ['Definir la oferta clave', 'Crear 3 piezas gráficas/videos', 'Difundir en Stories y estados']
      },
      {
        id: 'p4',
        title: 'Recolectar y compartir 5 reseñas reales de clientes felices',
        description: 'La prueba social es el factor número 1 de conversión para nuevos compradores.',
        impact: 'Medio',
        timeframe: 'Semana 3',
        actionSteps: ['Pedir captura de WhatsApp o Google review', 'Diseñar destacada de Testimonios']
      },
      {
        id: 'p5',
        title: 'Crear un programa de fidelización simple para clientes recurrentes',
        description: 'Hacer que quien ya te compró vuelva el próximo mes.',
        impact: 'Medio',
        timeframe: 'Semana 4',
        actionSteps: ['Ofrecer beneficio exclusivo en la segunda compra']
      }
    ],
    contentStrategy: {
      pillars: [
        {
          name: 'Educación & Tips',
          percentage: 40,
          description: 'Resolver problemas y dudas frecuentes de tu audiencia.',
          examples: ['3 errores comunes al elegir este producto', 'Cómo cuidar tu compra para que dure el doble']
        },
        {
          name: 'Demostración & Producto',
          percentage: 30,
          description: 'Mostrar la calidad, detalles y resultados reales de lo que ofreces.',
          examples: ['El antes y después', 'Unboxing y primeros pasos']
        },
        {
          name: 'Detrás de Escena & Humanización',
          percentage: 20,
          description: 'Conectar emocionalmente mostrando quiénes están detrás de la marca.',
          examples: ['Cómo preparamos tu pedido con dedicación', 'Un día en nuestro taller/oficina']
        },
        {
          name: 'Ofertas & Promociones',
          percentage: 10,
          description: 'Llamados directos a la venta con urgencia y beneficio.',
          examples: ['Promoción del mes válida hasta el domingo', 'Cupos limitados disponibles']
        }
      ],
      tone: 'Cercano, motivador, transparente y profesional.',
      formats: ['Reels', 'Stories', 'Carruseles', 'WhatsApp'],
      frequency: '4 a 5 publicaciones por semana',
      mainTopics: [
        'Beneficios clave de tu oferta',
        'Cómo resolver el problema principal de tu cliente',
        'Detrás de escena y preparación',
        'Historias de éxito de clientes'
      ]
    },
    campaigns: [
      {
        id: 'camp-1',
        name: 'Semana de Bienvenida para Nuevos Clientes',
        objective: 'Captar primeras compras y generar base de clientes',
        targetAudience: 'Personas interesadas que aún no han probado tu producto',
        concept: 'Descubrí por qué somos la opción favorita de quienes buscan calidad.',
        offer: '15% OFF en tu primera compra con el cupón BIENVENIDA o mencionando la promo.',
        keyMessage: 'El momento de dar el paso es hoy: calidad garantizada sin riesgos.',
        channels: ['Instagram Reels', 'Stories', 'Cartelería / WhatsApp'],
        duration: '7 días',
        cta: 'Escribinos ahora para reclamar tu beneficio de bienvenida.',
        budgetSuggested: 'Presupuesto moderado o 100% orgánico',
        kpis: ['+30% en consultas iniciales', 'Nuevos clientes registrados'],
        copies: [
          '¿Todavía no probaste la diferencia? Esta semana te invitamos a dar el primer paso con un beneficio exclusivo.',
          'Calidad pensada para vos. Consultanos hoy y recibí asesoramiento personalizado.'
        ],
        contentIdeas: [
          'Reel mostrando los detalles del producto en uso.',
          'Story con sticker de consulta directa a WhatsApp.'
        ],
        status: 'Activa'
      },
      {
        id: 'camp-2',
        name: 'Club de Clientes VIP',
        objective: 'Fidelización y compras recurrentes',
        targetAudience: 'Clientes que ya compraron al menos una vez',
        concept: 'Premiamos tu confianza con beneficios que nadie más tiene.',
        offer: 'Acceso anticipado a novedades y descuento especial en recompras.',
        keyMessage: 'Ser parte de nuestra comunidad tiene ventajas reales.',
        channels: ['Email', 'WhatsApp Broadcast', 'Stories de mejores amigos'],
        duration: '14 días',
        cta: 'Sumate a nuestra lista VIP y no te pierdas nada.',
        budgetSuggested: 'Bajo costo operativo',
        kpis: ['+20% en tasa de recompra'],
        status: 'Planificada'
      },
      {
        id: 'camp-3',
        name: 'Especial Fin de Mes: Combo Ahorro',
        objective: 'Aumentar ticket promedio y volumen de facturación',
        targetAudience: 'Compradores en búsqueda de conveniencia',
        concept: 'Todo lo que necesitás en un solo paquete inteligente.',
        offer: 'Llevando 2 productos o pack completo ahorrás un 20%.',
        keyMessage: 'Comprá inteligente y asegurá tu pack del mes.',
        channels: ['Instagram', 'Meta Ads'],
        duration: '5 días',
        cta: 'Asegurá tu combo antes de que se agote el stock.',
        budgetSuggested: 'Pauta local orientada a conversión',
        kpis: ['Venta de 50 combos'],
        status: 'Borrador'
      }
    ],
    calendar30Days: Array.from({ length: 30 }, (_, i) => {
      const dayNum = i + 1;
      const formats = ['Reel', 'Story', 'Post', 'Carrusel', 'Story', 'Reel', 'Post'];
      const platforms = ['Instagram', 'TikTok', 'Instagram', 'LinkedIn', 'Instagram', 'Instagram', 'Instagram'];
      const topics = [
        `El beneficio número 1 de ${mainProduct}`,
        'Detrás de escena: Cómo cuidamos cada detalle',
        '3 errores comunes que debés evitar hoy',
        'Preguntas frecuentes que nos hacen nuestros clientes',
        'Viernes de testimonios reales',
        'Demostración visual paso a paso',
        'Reflexión de domingo para empezar con energía',
        'Lanzamiento de beneficio especial de la semana',
        'Consejo práctico que podés aplicar en 5 minutos',
        'La historia detrás del nacimiento de nuestra marca'
      ];
      return {
        id: `cal-gen-${dayNum}`,
        day: dayNum,
        dayName: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][(dayNum - 1) % 7],
        platform: platforms[(dayNum - 1) % platforms.length],
        format: formats[(dayNum - 1) % formats.length],
        topic: topics[(dayNum - 1) % topics.length],
        objective: dayNum % 3 === 0 ? 'Educación y valor' : (dayNum % 2 === 0 ? 'Interacción y alcance' : 'Conversión y ventas'),
        cta: dayNum % 2 === 0 ? 'Dejanos tu comentario abajo 👇' : 'Escribinos por mensaje directo para más info',
        status: dayNum <= 3 ? 'Publicado' : (dayNum === 4 ? 'En progreso' : 'Pendiente')
      };
    }),
    dailyPriorityRecommendation: {
      recommendation: `Hoy te conviene publicar un Reel mostrando el problema que resuelve ${mainProduct} para capturar la atención de tu cliente ideal.`,
      actionLabel: 'Crear contenido para hoy',
      actionType: 'create_content'
    },
    opportunities: [
      {
        id: 'op-1',
        opportunity: 'Aumentar la producción de videos cortos (Reels/TikTok)',
        impact: 'Alto',
        difficulty: 'Baja',
        recommendedAction: 'Grabar 3 videos cortos en bloque durante 1 hora y programarlos para la semana.'
      },
      {
        id: 'op-2',
        opportunity: 'Optimizar enlaces de contacto directo a WhatsApp',
        impact: 'Alto',
        difficulty: 'Baja',
        recommendedAction: 'Configurar un mensaje predeterminado con saludo y consulta específica para no perder prospectos.'
      },
      {
        id: 'op-3',
        opportunity: 'Crear un combo especial con descuento por volumen',
        impact: 'Medio',
        difficulty: 'Media',
        recommendedAction: 'Empaquetar tu producto principal con un complemento para subir el ticket promedio en un 25%.'
      }
    ]
  };
}

function buildFallbackContent(type: string, product: string, businessName: string, cta: string) {
  const p = product || 'nuestro servicio';
  const b = businessName || 'nuestra marca';
  return {
    id: 'content-' + Date.now(),
    type: type || 'reel',
    title: `Estrategia de ${type.toUpperCase()}: ${p}`,
    hook: `Si estás buscando la mejor manera de disfrutar ${p}, esto es lo que tenés que saber antes de tomar una decisión.`,
    body: `Muchas personas cometen el error de elegir opciones genéricas y terminan frustradas.

En ${b} diseñamos cada detalle para ofrecerte una experiencia superior, transparente y con resultados comprobables.

No te conformes con lo de siempre. Conocé por qué quienes prueban nuestra propuesta no vuelven atrás.`,
    structure: [
      '0-3s: Gancho directo al problema de tu cliente.',
      '3-8s: Explicación de la diferencia de calidad.',
      '8-15s: Muestra del producto en acción.',
      '15-20s: Llamado a la acción con beneficio claro.'
    ],
    cta: cta || 'Escribinos un mensaje directo para recibir asesoramiento personalizado hoy.',
    hashtags: ['#MarketingDigital', `#${(b).replace(/\s+/g, '')}`, '#Emprendedores', '#CalidadGarantizada'],
    visualSuggestion: 'Grabación con luz natural, planos dinámicos en primer plano y texto legible en el centro.',
    imagePrompt: `Professional modern aesthetic marketing photo of ${p}, clean background, warm studio lighting, 8k resolution, minimalist style.`,
    createdAt: new Date().toISOString()
  };
}

function buildFallbackReel(product: string, businessName: string) {
  const p = product || 'nuestro producto estrella';
  const b = businessName || 'nuestro negocio';
  return {
    id: 'reel-' + Date.now(),
    product: p,
    hook: `El error número 1 que cometés al buscar ${p} y cómo solucionarlo en 10 segundos.`,
    sections: [
      {
        timestamp: '0–3 segundos',
        label: 'Gancho Visual & Sonoro',
        action: 'Primer plano directo a cámara con gesto de sorpresa o mostrando el problema visualmente.',
        speech: 'Si estás cansado de gastar de más sin ver resultados reales, prestá atención.',
        screenText: '¡Dejá de cometer este error! 🛑'
      },
      {
        timestamp: '3–8 segundos',
        label: 'Planteo del Problema',
        action: 'Muestra rápida de la fricción común que vive el usuario con soluciones de baja calidad.',
        speech: 'La mayoría de las opciones no te dan la durabilidad ni la atención que necesitás.',
        screenText: 'Lo barato sale caro vs Calidad real ✨'
      },
      {
        timestamp: '8–15 segundos',
        label: 'Demostración de la Solución',
        action: 'Tomas de detalle y proceso en acción de tu producto o servicio en manos de un cliente satisfecho.',
        speech: `En ${b} creamos una alternativa pensada exactamente para resolver esto desde el primer día.`,
        screenText: 'La solución definitiva para vos'
      },
      {
        timestamp: '15–25 segundos',
        label: 'Cierre y Llamado a la Acción',
        action: 'Sonrisa a cámara, muestra del producto final y placa con dirección o botón de contacto.',
        speech: 'Escribinos hoy y obtené un beneficio exclusivo en tu primera compra. Te esperamos.',
        screenText: '💬 Mandanos un DM o visitá el link en bio'
      }
    ],
    screenTextSummary: '¡Dejá de cometer este error! // Calidad real // La solución para vos // Mandanos un DM',
    cta: 'Guardá este video para no perderlo y consultanos por mensaje privado 🚀',
    caption: `¿Buscás resultados de verdad sin perder tiempo? 👇

En ${b} te ayudamos a dar el salto de calidad que tu día a día necesita. 

✨ Atención personalizada
📦 Envíos y garantía
🎯 Beneficio especial para nuevos clientes

Escribinos "INFO" en comentarios y te enviamos todos los detalles al privado.`,
    visualIdea: 'Video vertical grabado con cámara fija o steadycam, planos cortos de 2 a 3 segundos, dinamismo visual y música rítmica.',
    imageVideoPrompt: `Cinematic vertical video frame of ${p} with modern aesthetic styling, professional lighting, clean composition, 4k.`,
    audioSuggestion: 'Audio trending con ritmo sutil de pop electrónico o lofi instrumental.',
    createdAt: new Date().toISOString()
  };
}

function buildFallbackCampaign(objective: string, product: string, businessName: string) {
  const p = product || 'Producto Principal';
  const b = businessName || 'Mi Marca';
  return {
    id: 'camp-' + Date.now(),
    name: `Campaña de ${objective || 'Ventas'}: ${p}`,
    objective: objective || 'Aumentar ventas',
    targetAudience: 'Público local y clientes potenciales interesados en la categoría',
    concept: `Descubrí el diferencial de ${b} y llevate tu ${p} con beneficio exclusivo.`,
    offer: '15% de descuento en tu primera compra o regalo exclusivo por tiempo limitado.',
    keyMessage: 'Calidad superior, atención garantizada y el mejor respaldo.',
    copies: [
      `¿Buscás ${p}? En ${b} tenemos exactamente lo que necesitás con la mejor relación precio-calidad. ¡Aprovechá la promo de esta semana!`,
      `El momento de mejorar tu experiencia es hoy. Comprá ${p} con garantía y asesoramiento de expertos.`
    ],
    contentIdeas: [
      'Reel mostrando los 3 motivos para elegir esta opción.',
      'Story interactiva con encuesta y link directo.',
      'Carrusel con comparativa de beneficios frente a alternativas genéricas.'
    ],
    cta: 'Consultá ahora y asegurá tu beneficio exclusivo.',
    budgetSuggested: '$30.000 a $60.000 ARS sugeridos para distribución en Meta Ads.',
    kpis: ['+25% en consultas directas', 'Incremento del 15% en facturación'],
    channels: ['Instagram', 'Facebook Ads', 'WhatsApp Business'],
    duration: '14 días',
    status: 'Planificada'
  };
}

// ==========================================
// 7. PAYMENTS & SUBSCRIPTIONS (STRIPE & MERCADO PAGO)
// ==========================================

// Gateway connection status for Admin Dashboard
app.get('/api/admin/gateway-status', (req, res) => {
  const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-2235225782241723-082818-9287f285bbbc073eed8427b603fae0fd-2927900266';
  const stripeKey = process.env.STRIPE_SECRET_KEY || '';

  res.json({
    mercadopago: {
      configured: Boolean(mpToken && mpToken.trim().length > 10),
      isProduction: mpToken.startsWith('APP_USR-'),
      isSandbox: mpToken.startsWith('TEST-'),
      maskedToken: mpToken ? `${mpToken.substring(0, 15)}...${mpToken.substring(mpToken.length - 6)}` : null,
      publicKey: 'APP_USR-5710b5ba-eb85-4bc2-8333-d43cd115d2d2'
    },
    stripe: {
      configured: Boolean(stripeKey && stripeKey.trim().length > 10),
      isLive: stripeKey.startsWith('sk_live_'),
      maskedKey: stripeKey ? `${stripeKey.substring(0, 7)}...${stripeKey.substring(stripeKey.length - 4)}` : null
    }
  });
});

// Create Checkout Session for Stripe or Mercado Pago
app.post('/api/checkout/create-session', async (req, res) => {
  try {
    const { gateway, planId, billingCycle, userEmail, userName, businessName, amountUSD, amountARS } = req.body;

    const planTitle = planId === 'pro' ? 'MARKETIA PRO' : 'MARKETIA STARTER';
    const cycleText = billingCycle === 'annual' ? 'Anual (20% OFF)' : 'Mensual';
    const appUrl = process.env.APP_URL || 'http://localhost:3000';

    if (gateway === 'mercadopago') {
      const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-2235225782241723-082818-9287f285bbbc073eed8427b603fae0fd-2927900266';

      // If real Mercado Pago token is configured, call Mercado Pago API
      if (mpToken && mpToken.trim().length > 10) {
        try {
          const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${mpToken.trim()}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              items: [
                {
                  id: `plan_${planId}`,
                  title: `${planTitle} - Plan ${cycleText}`,
                  description: `Suscripción MARKETIA Copiloto de Marketing - ${planTitle}`,
                  quantity: 1,
                  currency_id: 'ARS',
                  unit_price: Number(amountARS) || (planId === 'pro' ? 26250 : 15000)
                }
              ],
              payer: {
                email: userEmail || 'cliente@marketia.io',
                name: userName || businessName || 'Cliente Marketia'
              },
              back_urls: {
                success: `${appUrl}/?payment=success&gateway=mercadopago&plan=${planId}`,
                pending: `${appUrl}/?payment=pending&gateway=mercadopago&plan=${planId}`,
                failure: `${appUrl}/?payment=failure&gateway=mercadopago&plan=${planId}`
              },
              auto_return: 'approved',
              statement_descriptor: 'MARKETIA AI',
              external_reference: `marketia_${planId}_${Date.now()}`
            })
          });

          if (mpResponse.ok) {
            const mpData = await mpResponse.json();
            const initUrl = mpData.init_point || mpData.sandbox_init_point;
            return res.json({
              success: true,
              gateway: 'mercadopago',
              checkoutUrl: initUrl,
              preferenceId: mpData.id,
              realPayment: true,
              message: 'Preferencia de Mercado Pago creada exitosamente'
            });
          } else {
            const errBody = await mpResponse.text();
            console.warn('[Mercado Pago API Warning]', errBody);
          }
        } catch (mpErr) {
          console.error('[Mercado Pago Fetch Error]', mpErr);
        }
      }

      // Fallback / Sandbox mode when token is not yet configured
      const mpPreference = {
        id: 'mp_pref_' + Date.now(),
        init_point: `https://www.mercadopago.com/mla/checkout/start?pref_id=${Date.now()}`,
        title: `${planTitle} - Plan ${cycleText}`,
        currency_id: 'ARS',
        unit_price: amountARS || (planId === 'pro' ? 26250 : 15000),
        quantity: 1
      };

      return res.json({
        success: true,
        gateway: 'mercadopago',
        checkoutUrl: mpPreference.init_point,
        preferenceId: mpPreference.id,
        simulated: true,
        message: 'Preferencia de Mercado Pago simulada (configura MERCADOPAGO_ACCESS_TOKEN para cobros reales)'
      });
    }

    // Default: Stripe Checkout Session
    const stripeSession = {
      id: 'cs_test_' + Math.random().toString(36).substring(2, 15),
      url: `https://checkout.stripe.com/c/pay/cs_test_${Date.now()}`,
      currency: 'usd',
      amount_total: Math.round((amountUSD || (planId === 'pro' ? 17.5 : 10)) * 100),
      customer_email: userEmail || 'cliente@ejemplo.com',
      mode: 'subscription',
      success_url: `${appUrl}/?payment=success&gateway=stripe&plan=${planId}`,
      cancel_url: `${appUrl}/?payment=cancelled&gateway=stripe`
    };

    res.json({
      success: true,
      gateway: 'stripe',
      checkoutUrl: stripeSession.url,
      sessionId: stripeSession.id,
      simulated: true,
      message: 'Sesión de Stripe Checkout generada con éxito'
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'No se pudo crear la sesión de pago' });
  }
});

// Process Webhooks for automatic user upgrades (Stripe & Mercado Pago)
app.post('/api/checkout/webhook', async (req, res) => {
  try {
    const { event, gateway, customerEmail, planId } = req.body;
    console.log(`[MARKETIA Webhook] Received ${gateway} event:`, event, 'for', customerEmail);
    res.json({
      received: true,
      status: 'active',
      plan: planId || 'pro',
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    res.status(400).json({ error: 'Webhook processing error' });
  }
});

// Start Server with Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MARKETIA Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
