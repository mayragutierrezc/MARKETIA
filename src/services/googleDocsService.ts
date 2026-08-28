import {
  BusinessProfile,
  CompleteStrategy,
  CalendarDayItem,
  CampaignItem,
  GeneratedReel,
  GeneratedContent
} from '../types';

export interface GoogleDocResult {
  documentId: string;
  title: string;
  documentUrl: string;
}

/**
 * Creates a new blank Google Doc and populates it with text content using batchUpdate
 */
export async function createGoogleDocument(
  title: string,
  content: string,
  accessToken: string
): Promise<GoogleDocResult> {
  // 1. Create document
  const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });

  if (!createRes.ok) {
    const errData = await createRes.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Error al crear el documento: ${createRes.statusText}`);
  }

  const docData = await createRes.json();
  const documentId = docData.documentId;

  // 2. Insert formatted text content
  if (content && content.trim().length > 0) {
    const updateRes = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: {
                index: 1
              },
              text: content
            }
          }
        ]
      })
    });

    if (!updateRes.ok) {
      console.warn('Document created but content insertion failed, returning doc anyway');
    }
  }

  return {
    documentId,
    title: docData.title || title,
    documentUrl: `https://docs.google.com/document/d/${documentId}/edit`
  };
}

/**
 * Formats and exports the entire marketing strategy to Google Docs
 */
export async function exportStrategyToGoogleDoc(
  business: BusinessProfile,
  strategy: CompleteStrategy,
  accessToken: string
): Promise<GoogleDocResult> {
  const dateStr = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const title = `Plan Estratégico de Marketing — ${business.name} (${dateStr})`;

  const text = `===============================================================
MARKETIA — PLAN ESTRATÉGICO INTEGRAL DE MARKETING
===============================================================
Negocio: ${business.name}
Categoría: ${business.category}
Ubicación: ${business.city}, ${business.country}
Fecha de generación: ${dateStr}
Score de Marketing Global: ${strategy.marketingScore?.overall || 0}/100

---------------------------------------------------------------
1. RESUMEN EJECUTIVO Y ANÁLISIS
---------------------------------------------------------------
${strategy.businessAnalysis.summary}

Propuesta de Valor:
${strategy.businessAnalysis.valueProposition}

Posicionamiento en el Mercado:
${strategy.businessAnalysis.positioning}

FORTALEZAS:
${strategy.businessAnalysis.strengths.map((s, i) => `  • ${s}`).join('\n')}

DEBILIDADES / ÁREAS DE MEJORA:
${strategy.businessAnalysis.weaknesses.map((w, i) => `  • ${w}`).join('\n')}

OPORTUNIDADES DE CRECIMIENTO:
${strategy.businessAnalysis.opportunities.map((o, i) => `  • ${o}`).join('\n')}

RIESGOS A MITIGAR:
${strategy.businessAnalysis.risks.map((r, i) => `  • ${r}`).join('\n')}

---------------------------------------------------------------
2. BUYER PERSONA (CLIENTE IDEAL)
---------------------------------------------------------------
Nombre del Arquetipo: ${strategy.businessAnalysis.buyerPersona.name} (${strategy.businessAnalysis.buyerPersona.archetype})
Demografía: ${strategy.businessAnalysis.buyerPersona.demographics}

Principales Dolores / Frustraciones:
${strategy.businessAnalysis.buyerPersona.painPoints.map((p) => `  • ${p}`).join('\n')}

Motivaciones de Compra:
${strategy.businessAnalysis.buyerPersona.motivations.map((m) => `  • ${m}`).join('\n')}

Canales Preferidos:
${strategy.businessAnalysis.buyerPersona.preferredChannels.join(', ')}

---------------------------------------------------------------
3. PILARES Y ESTRATEGIA DE CONTENIDO
---------------------------------------------------------------
Tono de Comunicación: ${strategy.contentStrategy.tone}
Frecuencia Recomendada: ${strategy.contentStrategy.frequency}
Formatos Principales: ${strategy.contentStrategy.formats.join(', ')}

Distribución de Pilares:
${strategy.contentStrategy.pillars
  .map(
    (p) =>
      `• ${p.name.toUpperCase()} (${p.percentage}%)\n  Descripción: ${p.description}\n  Ejemplos de ideas: ${p.examples.join(' | ')}`
  )
  .join('\n\n')}

Temas Clave de Conversación:
${strategy.contentStrategy.mainTopics.map((t) => `  • ${t}`).join('\n')}

---------------------------------------------------------------
4. PRIORIDADES ESTRATÉGICAS DE ACCIÓN
---------------------------------------------------------------
${strategy.strategicPriorities
  .map(
    (p, i) =>
      `${i + 1}. ${p.title.toUpperCase()} [Impacto: ${p.impact} | Plazo: ${p.timeframe}]
   Descripción: ${p.description}
   Pasos de acción:
   ${p.actionSteps.map((a) => `     - ${a}`).join('\n')}`
  )
  .join('\n\n')}

---------------------------------------------------------------
5. CAMPAÑAS PROMOCIONALES RECOMENDADAS
---------------------------------------------------------------
${strategy.campaigns
  .map(
    (c, i) =>
      `CAMPAÑA #${i + 1}: ${c.name.toUpperCase()}
Objetivo: ${c.objective}
Público Objetivo: ${c.targetAudience}
Concepto Creativo: ${c.concept}
Oferta / Gancho: ${c.offer}
Mensaje Clave: "${c.keyMessage}"
Llamado a la Acción (CTA): ${c.cta}
Canales: ${c.channels.join(', ')}
Duración: ${c.duration}
Presupuesto Sugerido: ${c.budgetSuggested || 'Optimización orgánica / Pauta moderada'}
KPIs Proyectados: ${c.kpis ? c.kpis.join(' | ') : 'Leads y Ventas'}
Copies de prueba sugeridos:
${c.copies ? c.copies.map((cp) => `  * "${cp}"`).join('\n') : '  * Consultar en MARKETIA'}
`
  )
  .join('\n---------------------------------------------------------------\n')}

===============================================================
Generado automáticamente por MARKETIA — Copiloto de Marketing con IA
`;

  return createGoogleDocument(title, text, accessToken);
}

/**
 * Formats and exports the 30-Day Content Calendar to Google Docs
 */
export async function exportCalendarToGoogleDoc(
  business: BusinessProfile,
  calendar: CalendarDayItem[],
  accessToken: string
): Promise<GoogleDocResult> {
  const dateStr = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const title = `Calendario de Contenidos 30 Días — ${business.name} (${dateStr})`;

  const text = `===============================================================
CALENDARIO EDITORIAL DE MARKETING (30 DÍAS)
===============================================================
Negocio: ${business.name}
Fecha: ${dateStr}
Total de publicaciones planificadas: ${calendar.length}

---------------------------------------------------------------
DETALLE DÍA POR DÍA
---------------------------------------------------------------
${calendar
  .map(
    (item) =>
      `[DÍA ${item.day.toString().padStart(2, '0')}] ${item.dayName || ''} | ${item.platform.toUpperCase()} (${item.format})
Tema / Idea: ${item.topic}
Objetivo: ${item.objective}
Llamado a la Acción (CTA): ${item.cta}
Estado: [ ${item.status.toUpperCase()} ]
---------------------------------------------------------------`
  )
  .join('\n')}

===============================================================
Generado por MARKETIA — Tu equipo de marketing con IA
`;

  return createGoogleDocument(title, text, accessToken);
}

/**
 * Formats and exports a single Reel Script to Google Docs
 */
export async function exportReelToGoogleDoc(
  business: BusinessProfile,
  reel: GeneratedReel,
  accessToken: string
): Promise<GoogleDocResult> {
  const dateStr = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const title = `Guion de Reel — ${reel.product || 'Publicación'} (${business.name})`;

  const text = `===============================================================
GUION DE REEL / TIKTOK DE ALTA CONVERSIÓN
===============================================================
Marca: ${business.name}
Producto/Tema: ${reel.product}
Fecha de creación: ${dateStr}

GANCHO PRINCIPAL (HOOK):
"${reel.hook}"

---------------------------------------------------------------
ESTRUCTURA Y CRONOGRAMA DE GRABACIÓN
---------------------------------------------------------------
${reel.sections
  .map(
    (s, i) =>
      `BLOQUE ${i + 1}: ${s.label.toUpperCase()} (${s.timestamp})
• Acción en cámara: ${s.action}
• Locución / Diálogo: "${s.speech}"
• Texto en pantalla: [ ${s.screenText} ]
`
  )
  .join('\n---------------------------------------------------------------\n')}

---------------------------------------------------------------
ELEMENTOS DE PRODUCCIÓN Y CAPTION
---------------------------------------------------------------
Texto en pantalla resumido:
${reel.screenTextSummary}

Llamado a la Acción (CTA):
${reel.cta}

Idea visual de grabación:
${reel.visualIdea}

Sugerencia de Audio / Música:
${reel.audioSuggestion || 'Audio en tendencia con ritmo dinámico'}

Prompt para generación visual / IA:
${reel.imageVideoPrompt}

CAPTION SUGERIDO PARA INSTAGRAM / TIKTOK:
${reel.caption}

===============================================================
Generado por MARKETIA — Copiloto de Marketing con IA
`;

  return createGoogleDocument(title, text, accessToken);
}

/**
 * Formats and exports Marketing Campaigns to Google Docs
 */
export async function exportCampaignsToGoogleDoc(
  business: BusinessProfile,
  campaigns: CampaignItem[],
  accessToken: string
): Promise<GoogleDocResult> {
  const dateStr = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const title = `Campañas Publicitarias & Ofertas — ${business.name}`;

  const text = `===============================================================
CAMPAÑAS DE MARKETING & PUBLICIDAD
===============================================================
Negocio: ${business.name}
Fecha de generación: ${dateStr}
Total de campañas: ${campaigns.length}

${campaigns
  .map(
    (camp, idx) => `---------------------------------------------------------------
CAMPAÑA #${idx + 1}: ${camp.name.toUpperCase()}
---------------------------------------------------------------
• Objetivo: ${camp.objective}
• Audiencia objetivo: ${camp.targetAudience}
• Concepto central: ${camp.concept}
• Oferta / Gancho irresistible: ${camp.offer}
• Mensaje clave: "${camp.keyMessage}"
• Canales / Plataformas: ${camp.channels.join(', ')}
• Duración sugerida: ${camp.duration}
• Presupuesto estimado: ${camp.budgetSuggested || 'A definir'}
• Llamado a la acción: ${camp.cta}

${camp.kpis && camp.kpis.length > 0 ? `KPIs y métricas a medir:\n${camp.kpis.map((k) => `  - ${k}`).join('\n')}` : ''}

${camp.copies && camp.copies.length > 0 ? `Variaciones de Copy para Anuncios:\n${camp.copies.map((c, i) => `  [Opción ${i + 1}]: ${c}`).join('\n\n')}` : ''}

${camp.contentIdeas && camp.contentIdeas.length > 0 ? `Ideas creativas y piezas:\n${camp.contentIdeas.map((ci) => `  - ${ci}`).join('\n')}` : ''}
`
  )
  .join('\n\n')}

===============================================================
Generado por MARKETIA — Copiloto de Marketing con IA
`;

  return createGoogleDocument(title, text, accessToken);
}

/**
 * Formats and exports dedicated Copy / Content piece to Google Docs
 */
export async function exportContentToGoogleDoc(
  business: BusinessProfile,
  content: GeneratedContent,
  accessToken: string
): Promise<GoogleDocResult> {
  const dateStr = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const title = `Copy & Contenido — ${content.title} (${business.name})`;

  const text = `===============================================================
PIEZA DE CONTENIDO Y COPYWRITING
===============================================================
Marca: ${business.name}
Título: ${content.title}
Tipo de formato: ${content.type.toUpperCase()}
Fecha: ${dateStr}

GANCHO INICIAL (HOOK):
${content.hook}

---------------------------------------------------------------
CUERPO DEL COPY
---------------------------------------------------------------
${content.body}

---------------------------------------------------------------
LLAMADO A LA ACCIÓN (CTA)
---------------------------------------------------------------
${content.cta}

HASHTAGS RECOMENDADOS:
${content.hashtags.join(' ')}

---------------------------------------------------------------
SUGERENCIAS VISUALES Y DE PRODUCCIÓN
---------------------------------------------------------------
Sugerencia de imagen / video:
${content.visualSuggestion}

Prompt para IA generativa de imágenes:
${content.imagePrompt}

Estructura de la pieza:
${content.structure.map((st) => `• ${st}`).join('\n')}

===============================================================
Generado por MARKETIA — Copiloto de Marketing con IA
`;

  return createGoogleDocument(title, text, accessToken);
}
