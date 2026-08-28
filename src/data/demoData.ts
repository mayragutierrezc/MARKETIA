import {
  BusinessProfile,
  CompleteStrategy,
  AnalyticsRecord,
  AnalyticsInsights,
  GeneratedContent,
  GeneratedReel
} from '../types';

export const DEMO_BUSINESS: BusinessProfile = {
  id: 'demo-luna-cafe',
  name: 'Luna Café',
  category: 'Cafetería de Especialidad & Bakery',
  description: 'Cafetería de especialidad con café de origen tostado en casa, pastelería artesanal de masa madre y un espacio cálido pet-friendly ideal para trabajar y conectar en Palermo.',
  city: 'Buenos Aires',
  country: 'Argentina',
  website: 'https://lunacafe.com.ar',
  instagram: '@lunacafe.ba',
  audience: {
    ageRange: '22 a 38 años',
    gender: 'Mixto (60% mujeres, 40% hombres)',
    location: 'Palermo, Colegiales, Villa Crespo y Belgrano',
    interests: 'Café de especialidad, trabajo remoto, diseño, brunch con amigos, gastronomía consciente y pet-friendly.',
    problems: 'Cansados del café quemado industrial; buscan lugares cómodos con buen Wi-Fi para trabajar sin sentirse apurados y merendar pastelería fresca.',
    buyingIntent: 'Café diario al paso, brunch de fin de semana y bolsas de café en grano para consumo hogareño.',
    knowledgeLevel: 'Intermedio: valoran el buen sabor, la textura de la leche y preguntan por el origen del grano.'
  },
  offer: {
    mainProduct: 'Café de Especialidad (Flat White, Cold Brew, Filtrados V60) y Brunch Artesanal',
    price: 'Ticket promedio $7.500 - $14.000 ARS',
    secondaryProducts: 'Bolsas de granos tostados de origen (Etiopía, Colombia, Brasil), Bakery de masa madre y workshops de cata.',
    differential: 'Micro-tostaduría propia a la vista, atención cálida sin esnobismos, mesas con tomas de corriente y patio verde pet-friendly.',
    currentPromos: 'Combo Mañanero: Flat White + Croissant de almendras 20% OFF antes de las 11:00 hs.'
  },
  objectives: [
    'Aumentar ventas',
    'Conseguir clientes',
    'Fidelizar clientes',
    'Aumentar seguidores'
  ],
  currentMarketing: {
    platforms: ['Instagram', 'TikTok', 'Google Maps'],
    frequency: '2-3 veces por semana de forma intermitente',
    monthlyBudget: '$180.000 ARS',
    currentStrategies: 'Fotos de platos en Instagram Stories y cartel de pizarra en la vereda.',
    mainProblem: 'Falta de constancia, dificultad para crear videos atractivos (Reels/TikTok) y poca conversión de visualizaciones a visitas físicas.'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const DEMO_STRATEGY: CompleteStrategy = {
  businessId: 'demo-luna-cafe',
  businessAnalysis: {
    summary: 'Luna Café cuenta con un producto excelente y un diferencial tangible (tostaduría propia y espacio acogedor). Su principal oportunidad radica en estructurar un embudo de contenidos orgánicos en video corto y campañas de geolocalización hiper-local para convertir tráfico peatonal y digital en clientes recurrentes.',
    strengths: [
      'Tueste artesanal propio que garantiza frescura y aroma inigualable.',
      'Espacio físico estético, luminoso, pet-friendly y optimizado para nómades digitales.',
      'Excelente retención orgánica una vez que el cliente prueba el café.',
      'Pastelería fresca elaborada diariamente con masa madre.'
    ],
    weaknesses: [
      'Comunicación en redes sociales inconsistente y centrada solo en fotos estáticas.',
      'Baja venta de café en grano para llevar a casa (ticket secundario desaprovechado).',
      'Poca captura de datos (sin base de emails o WhatsApp para avisos de workshops).'
    ],
    opportunities: [
      'Aprovechar el auge de los "Morning Vlog" y "Cafeterías aesthetics" en TikTok y Reels.',
      'Alianzas con oficinas y coworkings cercanos mediante combos corporativos.',
      'Lanzar suscripción mensual de granos de café para clientes de Palermo/CABA.',
      'Eventos de tarde (Catas guiadas, latte art jam) en días de menor afluencia (martes/miércoles).'
    ],
    risks: [
      'Alta densidad de cafeterías de especialidad competidoras en el polo gastronómico de Palermo.',
      'Sensibilidad a aumentos en insumos importados (granos verdes, packaging).'
    ],
    buyerPersona: {
      name: 'Camila Rossi',
      archetype: 'La Creativa Nómada Digital',
      demographics: '28 años, Diseñadora UX / Content Creator, vive en Palermo Soho.',
      painPoints: [
        'Se aburre de trabajar siempre en su departamento pero le cuesta encontrar cafeterías con enchufes accesibles y música adecuada.',
        'Detesta pagar caro por un café quemado o amargo servido con mala onda.',
        'Busca opciones de pastelería rica pero con ingredientes nobles.'
      ],
      motivations: [
        'Empezar la mañana con un ritual de café premium que la inspire.',
        'Tener su "café de confianza" donde los baristas la saluden por su nombre.',
        'Compartir rincones estéticos en sus Stories con una estética cuidada.'
      ],
      preferredChannels: ['Instagram (Reels y Stories)', 'TikTok', 'Google Maps para reseñas', 'Recomendaciones de amigos']
    },
    valueProposition: 'El café de especialidad tostado en casa que te hace sentir en tu rincón favorito de la ciudad: sin pretensiones, con pastelería de verdad y el mejor ambiente para inspirarte.',
    positioning: 'La cafetería de especialidad de referencia en Palermo que combina la maestría del café de origen con la calidez humana y un espacio pensado para tu ritmo diario.'
  },
  marketingScore: {
    overall: 78,
    branding: 88,
    contenido: 68,
    oferta: 84,
    conversion: 66,
    redesSociales: 74,
    estrategia: 80,
    summary: 'Tu base de producto y marca es sólida y atractiva. Con una estrategia de contenido en video más dinámica y llamados a la acción claros hacia el local, tu conversión y ventas se multiplicarán.'
  },
  strategicPriorities: [
    {
      id: 'p1',
      title: 'Dominar el formato Reel/TikTok con foco en la experiencia sensorial',
      description: 'Publicar 3 Reels semanales mostrando el arte del café (vertido, tueste, latte art) y el ambiente acogedor para atraer visitas locales.',
      impact: 'Crítico',
      timeframe: 'Semanas 1-2',
      actionSteps: [
        'Grabar banco de tomas B-Roll durante el tueste de los lunes.',
        'Usar audios en tendencia y textos directos al grano en los primeros 3 segundos.',
        'Incluir siempre la dirección exacta y llamado a probar el Combo Mañanero.'
      ]
    },
    {
      id: 'p2',
      title: 'Activar campaña de fidelización "Pasaporte Cafetero"',
      description: 'Lanzar tarjeta digital o física donde el 6to café es de cortesía o con 50% de descuento en granos.',
      impact: 'Alto',
      timeframe: 'Semanas 2-3',
      actionSteps: [
        'Imprimir tarjetas o activar sello digital.',
        'Capacitar al equipo de baristas para ofrecerla en cada compra.',
        'Promocionar en Stories destacadas y sticker en vaso.'
      ]
    },
    {
      id: 'p3',
      title: 'Optimización y campañas en Google Maps & Meta Ads Hiperlocal',
      description: 'Capturar la búsqueda "cafetería de especialidad cerca de mí" y correr anuncios de $1.500/día a 2 km a la redonda.',
      impact: 'Alto',
      timeframe: 'Semanas 3-4',
      actionSteps: [
        'Actualizar fotos de menú y horarios en Google My Business.',
        'Incentivar reseñas positivas obsequiando una galleta de masa madre.',
        'Configurar campaña de alcance geográfico en Meta Ads.'
      ]
    },
    {
      id: 'p4',
      title: 'Impulsar la venta de café en grano para el hogar',
      description: 'Empaquetar bolsas de 250g con tips de preparación para elevar el ticket promedio de compra.',
      impact: 'Medio',
      timeframe: 'Semana 3 en adelante',
      actionSteps: [
        'Colocar exhibidor en el punto de cobro con muestras olfativas.',
        'Entregar una guía impresa o QR con receta V60 y cafetera italiana en cada compra.'
      ]
    },
    {
      id: 'p5',
      title: 'Eventos y Catas de Miércoles para dinamizar días de baja afluencia',
      description: 'Organizar workshops quincenales "Descubrí tu café ideal" de 19:00 a 20:30 hs con cupos limitados.',
      impact: 'Medio',
      timeframe: 'Mes 2',
      actionSteps: [
        'Diseñar temario y precio de entrada con cata y degustación de pastelería.',
        'Abrir preventa exclusiva para seguidores de Instagram.'
      ]
    }
  ],
  contentStrategy: {
    pillars: [
      {
        name: 'Cultura & Tips Cafeteros',
        percentage: 35,
        description: 'Educación accesible sobre cómo pedir tu café, diferencias entre orígenes y mitos del café.',
        examples: ['¿Por qué el café de especialidad no necesita azúcar?', '3 errores al hacer café en cafetera italiana', 'Qué significa Flat White vs Latte']
      },
      {
        name: 'Experiencia & Lifestyle',
        percentage: 30,
        description: 'Vistas del local, brunch, perros visitantes, momentos de trabajo y atmósfera de relax.',
        examples: ['Tu oficina improvisada de los jueves', 'Brunch tour: probando el tostón de palta y huevo poché', 'Los perritos clientes de la semana']
      },
      {
        name: 'Detrás de Escena & Tostaduría',
        percentage: 20,
        description: 'El proceso artesanal del tueste, calibración de molinos y pasión del equipo de baristas.',
        examples: ['Día de tueste: del grano verde al aroma perfecto', 'Conocé a Sofi, nuestra barista jefa', 'Cómo limpiamos la máquina cada noche']
      },
      {
        name: 'Ofertas & Promociones Clave',
        percentage: 15,
        description: 'Llamados directos a la acción: Combo Mañanero, bolsas de granos y eventos.',
        examples: ['Tu desayuno de campeones antes de las 11:00 hs', 'Llevá 2 bolsas de granos con 15% OFF', 'Cupos abiertos para el taller de barista']
      }
    ],
    tone: 'Cálido, cómplice, entusiasta y relajado. Habla de tú o vos según la cercanía, evitando términos pedantes pero demostrando profundo conocimiento de barista.',
    formats: ['Reels (60%)', 'Stories interactivas (25%)', 'Carruseles educativos (10%)', 'TikTok (5%)'],
    frequency: '4 a 5 publicaciones semanales + 4 a 6 Stories diarias',
    mainTopics: [
      'Secretos del tueste propio',
      'Rituales matutinos y desayunos',
      'Café para llevar en vaso sustentable',
      'Pastelería de masa madre recién horneada',
      'Cultura pet-friendly y cowork agradable'
    ]
  },
  campaigns: [
    {
      id: 'c1',
      name: 'Semana del Espresso Perfecto',
      objective: 'Aumentar visitas matutinas y captar nuevos clientes en Palermo',
      targetAudience: 'Vecinos, profesionales y estudiantes en un radio de 2 km',
      concept: 'Convertir el café de la mañana en el mejor momento del día.',
      offer: '2x1 en Flat White de 8:30 a 10:30 hs de lunes a jueves mencionando la palabra clave "LUNA MAÑANERO" en caja.',
      keyMessage: 'Empezá el día con café de verdad recién tostado.',
      channels: ['Instagram Reels', 'Stories con sticker de cuenta regresiva', 'Meta Ads Geofencing', 'Cartel en vereda'],
      duration: '7 días (Lunes a Domingo)',
      cta: 'Vení hoy por tu 2x1 y descubrí la diferencia del tueste fresco.',
      budgetSuggested: '$35.000 ARS en pauta Meta Ads',
      kpis: ['+25% en tickets matutinos', '150 nuevos canjes de promoción', '+400 nuevos seguidores locales'],
      copies: [
        '☕ ¿Sabías que el café que tomaste hoy fue tostado hace apenas 4 días? Sentí la diferencia.',
        'La alarma sonó temprano, pero el café de Luna te espera. 2x1 en tu Flat White preferido esta semana.'
      ],
      contentIdeas: [
        'Reel POV llegando a Luna a las 8:30 AM con vapor y sonido de extracción.',
        'Story interactiva: Encuesta "¿Sos team Flat White o Cold Brew?".',
        'Carrusel con 4 razones por las que el café fresco cambia tu energía del día.'
      ],
      status: 'Activa'
    },
    {
      id: 'c2',
      name: 'Club de Granos para Casa',
      objective: 'Elevar la venta de productos de retail y ticket promedio',
      targetAudience: 'Clientes habituales que preparan café en sus hogares',
      concept: 'El sabor inconfundible de Luna Café, en la comodidad de tu cocina.',
      offer: 'Con la compra de tu bolsa de café de 250g, llevate una guía de preparación y un café espresso de cortesía.',
      keyMessage: 'No arruines tu grano favorito con una mala extracción: te enseñamos el secreto.',
      channels: ['Instagram Carrusel', 'Email Newsletter', 'Exhibidor en mostrador'],
      duration: '14 días',
      cta: 'Elegí tu origen preferido en caja y llevate tu guía de barista.',
      budgetSuggested: '$15.000 ARS en material impreso y packaging',
      kpis: ['Venta de 80 bolsas de café', 'Incremento del 18% en ticket promedio'],
      status: 'Planificada'
    },
    {
      id: 'c3',
      name: 'Pet-Friendly Coffee Date',
      objective: 'Fidelizar a la comunidad local y generar contenido generado por usuarios (UGC)',
      targetAudience: 'Dueños de mascotas que pasean por los parques de Palermo',
      concept: 'Un café para vos, un Puppuccino con crema sin lactosa para tu compañero de 4 patas.',
      offer: 'Puppuccino de cortesía para tu perro con cualquier consumo de cafetería.',
      keyMessage: 'En Luna, los mejores amigos siempre son bienvenidos.',
      channels: ['Instagram Stories', 'Reels divertidos', 'TikTok'],
      duration: 'Campaña continua (fines de semana)',
      cta: 'Etiquetanos en @lunacafe.ba y aparecé en nuestro muro de clientes peludos.',
      budgetSuggested: '$10.000 ARS',
      kpis: ['+50 menciones en Stories por fin de semana', 'Mayor afluencia en mesas exteriores'],
      status: 'Borrador'
    }
  ],
  calendar30Days: [
    {
      id: 'cal-1',
      day: 1,
      dayName: 'Lunes',
      platform: 'Instagram',
      format: 'Reel',
      topic: 'Día de Tueste: El viaje del grano verde al aroma perfecto',
      objective: 'Educar sobre el diferencial de tostaduría propia y generar antojo',
      cta: 'Guardá este video si amás el olor a café recién tostado ☕',
      status: 'Publicado'
    },
    {
      id: 'cal-2',
      day: 2,
      dayName: 'Martes',
      platform: 'Instagram',
      format: 'Story',
      topic: 'Trivia cafetera: ¿Qué tanta cafeína tiene un espresso vs un filtrado?',
      objective: 'Interacción y engagement con sticker de encuesta',
      cta: 'Votá en la encuesta y descubrí la respuesta correcta',
      status: 'Publicado'
    },
    {
      id: 'cal-3',
      day: 3,
      dayName: 'Miércoles',
      platform: 'Instagram',
      format: 'Carrusel',
      topic: '3 errores comunes que arruinan tu café en casa (y cómo evitarlos)',
      objective: 'Aportar valor práctico y posicionar a Luna como referente técnico',
      cta: 'Compartíselo a ese amigo que hierve el agua del café 🤦‍♂️',
      status: 'Publicado'
    },
    {
      id: 'cal-4',
      day: 4,
      dayName: 'Jueves',
      platform: 'Instagram',
      format: 'Reel',
      topic: 'POV: Venís a trabajar a Luna Café con Wi-Fi rápido y un Cold Brew helado',
      objective: 'Atraer nómades digitales y trabajadores remotos',
      cta: 'Etiquetá a tu colega de home office para cambiar de aire hoy',
      status: 'En progreso'
    },
    {
      id: 'cal-5',
      day: 5,
      dayName: 'Viernes',
      platform: 'Instagram',
      format: 'Story',
      topic: 'Anticipo del fin de semana: Tostón de masa madre con palta, burrata y tomates confitados',
      objective: 'Generar reservas y visitas para el brunch de sábado y domingo',
      cta: 'Deslizá para ver la carta completa de Brunch',
      status: 'Pendiente'
    },
    {
      id: 'cal-6',
      day: 6,
      dayName: 'Sábado',
      platform: 'TikTok',
      format: 'Video',
      topic: 'Audio viral con nuestro barista sirviendo un latte art impecable',
      objective: 'Alcance orgánico y descubrimiento por público joven',
      cta: '¿Qué figura querés que te dibujemos en tu próximo café?',
      status: 'Idea'
    },
    {
      id: 'cal-7',
      day: 7,
      dayName: 'Domingo',
      platform: 'Instagram',
      format: 'Post',
      topic: 'Foto estética: Café al sol en nuestro patio pet-friendly con un perrito feliz',
      objective: 'Reforzar la calidez de marca y el sentimiento de pertenencia',
      cta: 'Dejanos un 🐾 en comentarios si tu finde incluyó café rico',
      status: 'Idea'
    },
    {
      id: 'cal-8',
      day: 8,
      dayName: 'Lunes',
      platform: 'Instagram',
      format: 'Reel',
      topic: 'Lanzamiento Semana del Espresso Perfecto: 2x1 en Flat White mañanero',
      objective: 'Disparar visitas y ventas en horario de 8:30 a 10:30 hs',
      cta: 'Mencioná "LUNA MAÑANERO" en caja y disfrutá tu 2x1 hoy',
      status: 'Pendiente'
    },
    {
      id: 'cal-9',
      day: 9,
      dayName: 'Martes',
      platform: 'Email',
      format: 'Newsletter',
      topic: 'La guía secreta de Luna: Cómo catar café como un profesional en 4 pasos',
      objective: 'Nutrir la base de clientes y fomentar la compra de café en grano',
      cta: 'Conocé los 3 nuevos orígenes tostados esta semana',
      status: 'Idea'
    },
    {
      id: 'cal-10',
      day: 10,
      dayName: 'Miércoles',
      platform: 'Instagram',
      format: 'Story',
      topic: 'Detrás de escena: Horneando la pastelería artesanal a las 6:30 AM',
      objective: 'Demostrar frescura y artesanía real en cada producto',
      cta: 'Reaccioná con 🔥 si te tienta el olor a masa madre recién horneada',
      status: 'Idea'
    },
    {
      id: 'cal-11',
      day: 11,
      dayName: 'Jueves',
      platform: 'TikTok',
      format: 'Video',
      topic: 'Desmitificando: "¿Por qué el café de especialidad tiene notas ácidas o frutales?"',
      objective: 'Educación sin tecnicismos pesados',
      cta: 'Guardá el tip para cuando pruebes tu próximo filtrado',
      status: 'Idea'
    },
    {
      id: 'cal-12',
      day: 12,
      dayName: 'Viernes',
      platform: 'Instagram',
      format: 'Reel',
      topic: 'Brunch Tour: Los 3 platos más pedidos de Luna para arrancar el finde',
      objective: 'Aumentar ticket promedio con recomendaciones de maridaje café + comida',
      cta: '¿Cuál es tu favorito: dulce o salado? Te leemos abajo 👇',
      status: 'Idea'
    },
    {
      id: 'cal-13',
      day: 13,
      dayName: 'Sábado',
      platform: 'Instagram',
      format: 'Story',
      topic: 'Reposteo de fotos y Stories de clientes disfrutando el patio',
      objective: 'Prueba social y contenido generado por usuarios (UGC)',
      cta: 'Etiquetanos en tus fotos para aparecer en nuestras Stories',
      status: 'Idea'
    },
    {
      id: 'cal-14',
      day: 14,
      dayName: 'Domingo',
      platform: 'Instagram',
      format: 'Post',
      topic: 'Reflexión de domingo: El ritual de parar 15 minutos y saborear la vida',
      objective: 'Branding emocional y conexión con la comunidad',
      cta: 'Que tengan un hermoso cierre de semana ☕💛',
      status: 'Idea'
    },
    {
      id: 'cal-15',
      day: 15,
      dayName: 'Lunes',
      platform: 'Instagram',
      format: 'Reel',
      topic: '¿Cómo pedir café en Luna si es tu primera vez? Guía rápida en 20 segundos',
      objective: 'Eliminar la fricción de entrada para clientes novatos en café de especialidad',
      cta: 'Vení sin miedo: nuestros baristas te asesoran con la mejor onda',
      status: 'Idea'
    },
    {
      id: 'cal-16',
      day: 16,
      dayName: 'Martes',
      platform: 'Instagram',
      format: 'Story',
      topic: 'Caja de preguntas: "Preguntale lo que quieras a nuestro tostador"',
      objective: 'Generación de contenido interactivo directo con la audiencia',
      cta: 'Dejá tu pregunta en el sticker de abajo',
      status: 'Idea'
    },
    {
      id: 'cal-17',
      day: 17,
      dayName: 'Miércoles',
      platform: 'Instagram',
      format: 'Carrusel',
      topic: 'Etiopía vs Colombia vs Brasil: ¿Qué origen de grano va mejor con tu gusto?',
      objective: 'Promoción directa de la venta de bolsas de café para el hogar',
      cta: 'Pedí tu bolsa molida a medida en mostrador o tienda online',
      status: 'Idea'
    },
    {
      id: 'cal-18',
      day: 18,
      dayName: 'Jueves',
      platform: 'Instagram',
      format: 'Reel',
      topic: 'El sonido ASMR definitivo: Molido, prensado, extracción y cremado de leche',
      objective: 'Viralidad sensorial y alto guardado de video',
      cta: 'Subí el volumen 🎧 y disfrutá el sonido de la felicidad',
      status: 'Idea'
    },
    {
      id: 'cal-19',
      day: 19,
      dayName: 'Viernes',
      platform: 'Instagram',
      format: 'Story',
      topic: 'Anuncio: Taller de Latte Art para principiantes este próximo sábado (cupos limitados)',
      objective: 'Monetización secundaria y fidelización de fans de la marca',
      cta: 'Escribinos "TALLER" por DM para reservar tu lugar',
      status: 'Idea'
    },
    {
      id: 'cal-20',
      day: 20,
      dayName: 'Sábado',
      platform: 'TikTok',
      format: 'Video',
      topic: 'Cosas que solo pasan trabajando en una cafetería de especialidad',
      objective: 'Humanización del equipo con humor cómplice',
      cta: 'Seguinos para más detrás de escena de la vida barista',
      status: 'Idea'
    },
    {
      id: 'cal-21',
      day: 21,
      dayName: 'Domingo',
      platform: 'Instagram',
      format: 'Post',
      topic: 'Nuestro rincón favorito: La biblioteca compartida donde podés dejar y llevar libros',
      objective: 'Destacar elementos únicos de la experiencia física del local',
      cta: '¿Cuál es tu libro favorito para acompañar un café con leche?',
      status: 'Idea'
    },
    {
      id: 'cal-22',
      day: 22,
      dayName: 'Lunes',
      platform: 'Instagram',
      format: 'Reel',
      topic: '¿Por qué enfriamos el Cold Brew durante 18 horas por goteo lento?',
      objective: 'Explicar el valor del proceso y justificar el precio premium',
      cta: 'Probalo hoy con hielo y una rodaja de naranja fresca',
      status: 'Idea'
    },
    {
      id: 'cal-23',
      day: 23,
      dayName: 'Martes',
      platform: 'Instagram',
      format: 'Story',
      topic: 'Check-in de martes: ¿Cuántos cafés llevás hoy? 1, 2 o perdiste la cuenta',
      objective: 'Micro-interacciones diarias para elevar el alcance algorítmico',
      cta: 'Marcá tu nivel de cafeína en el slider de Stories',
      status: 'Idea'
    },
    {
      id: 'cal-24',
      day: 24,
      dayName: 'Miércoles',
      platform: 'Instagram',
      format: 'Carrusel',
      topic: 'Guía de maridaje: Qué pedir según tu antojo (dulce, salado, cítrico o chocolatoso)',
      objective: 'Inspirar pedidos combinados y aumentar el gasto promedio',
      cta: 'Guardá esta guía para tu próxima visita a Palermo',
      status: 'Idea'
    },
    {
      id: 'cal-25',
      day: 25,
      dayName: 'Jueves',
      platform: 'Instagram',
      format: 'Reel',
      topic: 'Conocé a los artesanos locales detrás de nuestras tazas de cerámica',
      objective: 'Resaltar la sustentabilidad y el apoyo al diseño local',
      cta: 'Disponibles también para llevarte un set a tu casa',
      status: 'Idea'
    },
    {
      id: 'cal-26',
      day: 26,
      dayName: 'Viernes',
      platform: 'Instagram',
      format: 'Story',
      topic: 'Viernes de música en vivo acústica de 18:30 a 20:30 hs',
      objective: 'Llenar el salón en el horario de transición tarde-noche',
      cta: 'Vení a cerrar la semana con café de especialidad y buena vibra',
      status: 'Idea'
    },
    {
      id: 'cal-27',
      day: 27,
      dayName: 'Sábado',
      platform: 'Instagram',
      format: 'Post',
      topic: 'Sábado de brunch completo: Mesa servida con café, jugo natural, tostón y alfajor de pistacho',
      objective: 'Impacto visual gastronómico de alta tentación',
      cta: 'Te esperamos de 9:00 a 20:00 hs en Gurruchaga 1420, Palermo',
      status: 'Idea'
    },
    {
      id: 'cal-28',
      day: 28,
      dayName: 'Domingo',
      platform: 'TikTok',
      format: 'Video',
      topic: 'Desafío Barista: ¿Puede adivinar el café solo oliendo el grano molido?',
      objective: 'Entretenimiento dinámico y viral',
      cta: 'Dejá en comentarios si acertaste con él',
      status: 'Idea'
    },
    {
      id: 'cal-29',
      day: 29,
      dayName: 'Lunes',
      platform: 'Instagram',
      format: 'Story',
      topic: 'Lunes de recarga: Tu vaso térmico recargable tiene 15% de descuento permanente',
      objective: 'Compromiso ecológico y hábito de compra recurrente para llevar',
      cta: 'Traé tu vaso favorito y cuidemos el planeta juntos',
      status: 'Idea'
    },
    {
      id: 'cal-30',
      day: 30,
      dayName: 'Martes',
      platform: 'Instagram',
      format: 'Reel',
      topic: 'Resumen del mes en Luna: Momentos mágicos, nuevos amigos y miles de tazas servidas',
      objective: 'Cierre de ciclo mensual, agradecimiento y sentido de comunidad',
      cta: 'Gracias por ser parte de nuestra familia cafetera. ¿Qué querés ver el próximo mes?',
      status: 'Idea'
    }
  ],
  dailyPriorityRecommendation: {
    recommendation: 'Hoy te conviene publicar un Reel mostrando el arte del café recién tostado y el vapor de la mañana para activar el flujo de clientes antes del mediodía.',
    actionLabel: 'Crear Reel para hoy',
    actionType: 'create_content'
  },
  opportunities: [
    {
      id: 'op-1',
      opportunity: 'Aprovechar la tendencia de videos de "Ritual matutino en Palermo"',
      impact: 'Alto',
      difficulty: 'Baja',
      recommendedAction: 'Grabar un clip de 15 segundos con audio de tendencia mostrando el vertido del Flat White a primera hora.'
    },
    {
      id: 'op-2',
      opportunity: 'Capturar el tráfico de búsqueda en Google Maps de "café de especialidad"',
      impact: 'Alto',
      difficulty: 'Baja',
      recommendedAction: 'Publicar el menú actualizado con fotos de alta resolución y responder las 4 reseñas pendientes con agradecimiento personalizado.'
    },
    {
      id: 'op-3',
      opportunity: 'Activar venta de bolsas de café para consumo hogareño',
      impact: 'Medio',
      difficulty: 'Media',
      recommendedAction: 'Ofrecer una degustación de café filtrado gratis en caja al comprar 1 bolsa de 250g de granos de Colombia.'
    }
  ]
};

export const DEMO_ANALYTICS: AnalyticsRecord = {
  followers: 12450,
  reach: 84200,
  impressions: 142800,
  engagement: 5890,
  clicks: 1840,
  leads: 320,
  sales: 940,
  investment: 65000,
  period: 'Últimos 30 días'
};

export const DEMO_ANALYTICS_INSIGHTS: AnalyticsInsights = {
  engagementRate: 4.73,
  ctr: 2.18,
  conversionRate: 17.39,
  cac: 203.12,
  roas: 4.85,
  working: [
    'Los Reels con tomas B-Roll de preparación de café tienen un 140% más de retención que las fotos estáticas.',
    'La promoción matutina (Combo Mañanero) generó un aumento del 22% en ventas antes de las 11:00 hs.',
    'El tráfico proveniente de Google Maps tiene la tasa de conversión más alta hacia visita presencial.'
  ],
  failing: [
    'Los posts con fotos de platos sin personas ni movimiento reciben 40% menos comentarios y alcance.',
    'Las publicaciones después de las 20:00 hs tienen muy bajo engagement por el rubro diurno del café.'
  ],
  shouldChange: [
    'Cambiar el horario de publicación principal a la franja de 7:30 a 9:00 AM y 16:00 a 17:30 PM (horarios de antojo de café).',
    'Incluir siempre la ubicación exacta en el sticker de Stories y el primer renglón del copy.'
  ],
  shouldTest: [
    'Probar un formato de "Minutero Barista": responder preguntas rápidas en video de 30 segundos.',
    'Lanzar un anuncio con cupón de 1er café con 30% OFF segmentado únicamente a personas que viven o trabajan a menos de 1,5 km.'
  ],
  summary: 'Tus métricas muestran un engagement rate muy saludable (4.73%, superior al promedio de gastronomía del 2.5%). Tu foco debe ser convertir ese gran alcance digital en visitas físicas al local mediante llamados a la acción con beneficios inmediatos.',
  isOrientative: false
};

export const DEMO_SAVED_CONTENTS: GeneratedContent[] = [
  {
    id: 'demo-c-1',
    type: 'reel',
    title: 'El error que arruina tu café de la mañana',
    hook: 'Si tu café tiene gusto a quemado o amargo extremo, no es culpa del grano: cometiste este error de principiante.',
    body: `La mayoría de la gente hierve el agua a 100°C y quema los aceites aromáticos del café al instante. 

En Luna Café tostamos cada lote a baja temperatura para preservar notas a chocolate y frutos rojos. Cuando preparás café en casa, dejá reposar el agua 1 minuto después de que rompa el hervor (ideal: 90-93°C).

Vení a probar la diferencia de una extracción perfecta hecha por baristas apasionados.

📍 Te esperamos en Gurruchaga 1420, Palermo.`,
    structure: [
      '0-3s: Gancho visual arrojando café amargo a la pileta.',
      '3-8s: Explicación rápida de la temperatura del agua.',
      '8-15s: Demostración con termómetro y vertido sedoso en Luna Café.',
      '15-20s: Toma final del Flat White con latte art y dirección.'
    ],
    cta: 'Guardá este video para tu café de mañana y pasá por Luna por tu dosis de felicidad.',
    hashtags: ['#LunaCafe', '#CafeDeEspecialidad', '#PalermoSoho', '#BaristaTips', '#CafeBuenosAires'],
    visualSuggestion: 'Grabado en vertical en barra de mármol, luz natural de mañana, planos detalle macro del vapor y vertido.',
    imagePrompt: 'A warm aesthetic coffee shop counter in Palermo Buenos Aires, barista pouring milk into a specialty flat white cup with latte art, morning golden hour sunlight, 8k professional photography.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'demo-c-2',
    type: 'story',
    title: 'Sticker Interactivo de Desayuno',
    hook: '¿Sos de los que no pueden hablar antes del primer sorbo de café? ☕👀',
    body: 'Votación interactiva en Stories: "Team Flat White" vs "Team Espresso Doble". El ganador tiene 15% OFF hasta las 11:30 hs mostrando esta Story en caja.',
    structure: [
      'Foto aesthetic del mostrador con pastelería humeante.',
      'Sticker de encuesta en el tercio inferior.',
      'Texto legible con beneficio directo en caja.'
    ],
    cta: 'Votá y vení a reclamar tu café con descuento hoy.',
    hashtags: [],
    visualSuggestion: 'Foto cenital con luz cálida, taza con latte art y croissant de masa madre al lado.',
    imagePrompt: 'Top down aesthetic view of artisan sourdough croissant and specialty coffee with latte art on a rustic wooden cafe table, soft natural light.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

export const DEMO_REEL_SAMPLE: GeneratedReel = {
  id: 'demo-reel-1',
  product: 'Combo Mañanero: Flat White + Croissant de Almendras',
  hook: 'El secreto para transformar un lunes cualquiera en tu mejor mañana de la semana.',
  sections: [
    {
      timestamp: '0–3 segundos',
      label: 'Gancho Visual & Sonoro',
      action: 'Plano detalle del corte crocante de un croissant de almendras recién salido del horno. Sonido crujiente súper nítido (ASMR).',
      speech: 'Si tus mañanas se sienten en piloto automático, necesitás ver esto.',
      screenText: 'Tu mañana merece algo mejor ✨'
    },
    {
      timestamp: '3–8 segundos',
      label: 'Planteo del Problema & Deseo',
      action: 'El barista muele granos frescos de café tostado en casa, cae el polvo aromático y se prepara el portafiltro.',
      speech: 'El café quemado de máquina rápida no te despierta, te estresa. Un grano tostado hace 4 días te cambia el humor.',
      screenText: 'Café tostado en casa vs Café quemado ☕'
    },
    {
      timestamp: '8–15 segundos',
      label: 'La Solución / Experiencia Luna',
      action: 'Extracción cremosa del espresso doble cayendo en la taza de cerámica artesanal y emulsionado de leche brillante.',
      speech: 'En Luna Café combinamos nuestro tueste artesanal con pastelería de masa madre horneada antes de que salga el sol.',
      screenText: 'Combo Mañanero 20% OFF antes de las 11:00 hs'
    },
    {
      timestamp: '15–25 segundos',
      label: 'Llamado a la Acción y Cierre',
      action: 'Una clienta sonríe sentada en el patio luminoso con su perrito al lado dando el primer sorbo.',
      speech: 'Pasá antes de las 11 por Gurruchaga 1420 en Palermo y empezá el día como te merecés. Te esperamos.',
      screenText: '📍 Gurruchaga 1420, Palermo Soho'
    }
  ],
  screenTextSummary: 'Tu mañana merece algo mejor ✨ // Café tostado en casa // Combo Mañanero 20% OFF // 📍 Gurruchaga 1420, Palermo',
  cta: 'Guardá este Reel para venir mañana o etiquetá a quien te debe un desayuno 🥐☕',
  caption: `Un buen día no empieza por casualidad, empieza con café de especialidad recién tostado y masa madre crocante 🥐✨

Hasta las 11:00 hs tenemos nuestro Combo Mañanero con 20% OFF para que arranques con toda la energía que necesitás.

📍 Gurruchaga 1420, Palermo Soho
⏰ Abiertos de Lunes a Domingo de 8:30 a 20:00 hs
🐾 Pet friendly & patio verde

¿Con quién venís a desayunar hoy?`,
  visualIdea: 'Video vertical grabado a 60fps con cámara en mano, planos cortos y dinámicos, iluminación cálida matutina, énfasis en texturas (crema del café, hojaldre del croissant).',
  imageVideoPrompt: 'Cinematic vertical shot of a modern specialty coffee shop in Palermo Buenos Aires, pouring silky latte art into a ceramic cup, warm morning sunbeams, cozy bohemian ambience, 4k ultra-detailed.',
  audioSuggestion: 'Audio en tendencia suave de Neo-Soul o Lofi Beats con ritmo sutil de batería.',
  createdAt: new Date().toISOString()
};
