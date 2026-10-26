// Configuración y contenido editable de la web.
// Los textos entre [CORCHETES] son marcadores: sustitúyelos cuando tengas el contenido real.

// Ruta interna respetando la carpeta donde se publica la web (en GitHub Pages, /nombre-del-repo/).
// Úsala para cualquier enlace que empiece por «/»: url('/privacidad'), url('/').
// Las páginas se publican como carpeta, así que su dirección termina en «/» (la misma que la
// canónica y la del mapa del sitio, sin redirección); los archivos (favicon.svg) se dejan tal cual.
export const url = (path = '/') => {
  const clean = path.replace(/^\//, '');
  const isPage = clean !== '' && !clean.endsWith('/') && !/\.[a-z0-9]+$/i.test(clean);
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${clean}${isPage ? '/' : ''}`;
};

export const site = {
  name: 'Femuix',
  title: 'Femuix · Reformas de vivienda en Barcelona',
  description:
    'Acompaño tu reforma de principio a fin: decidimos qué se toca y qué no, lo ves antes de construirlo y llegas a la obra con todo definido. De 12 a 14 semanas, solo en Barcelona ciudad.',
  email: 'hola@femuix.com',
  city: 'Barcelona',
  // Enlace externo a la agenda de la llamada de compatibilidad
  llamadaUrl: '', // TODO: enlace a la agenda de la llamada de compatibilidad
  // Dirección a la que el formulario «Cuéntame tu reforma» envía los datos (p. ej. Formspree).
  // Vacía: al enviar se abre el correo con el mensaje ya redactado.
  contactoAction: '', // TODO: servicio de formularios
};

// Mientras no haya enlace a la agenda, la web no anuncia una llamada que no se puede reservar:
// los botones invitan a escribir y abren el formulario «Cuéntame tu reforma» (sin JavaScript,
// el email). Al rellenar `llamadaUrl` vuelven a ser llamadas.
const activa = site.llamadaUrl !== '';
export const llamada = {
  activa,
  href: activa ? site.llamadaUrl : `mailto:${site.email}`,
  corta: activa ? 'Llamada de compatibilidad' : 'Escríbeme un email',
  reservar: activa ? 'Reservar una llamada' : 'Escríbeme un email',
  hablar: activa ? 'Hablemos en una llamada' : 'Escríbeme tu caso',
  enlace: activa ? 'Reserva una llamada de compatibilidad' : `Escríbeme a ${site.email}`,
};

export const nav = [
  { label: 'El método', href: '#metodo' },
  { label: 'Cómo trabajo', href: '#como-trabajo' },
  { label: 'Sobre mí', href: '#sobre-mi' },
  { label: 'Preguntas', href: '#preguntas' },
];

// Para quién es (y para quién no): sección que sigue al hero
export const paraQuien = {
  intro:
    'Trabajo con particulares que reforman su propia vivienda en Barcelona ciudad, de hasta 130 m². Si tu vida ha cambiado y tu casa ya no responde a cómo vives, este proceso es para ti.',
  si: [
    'Has comprado una vivienda y quieres reformarla.',
    'Necesitas reorganizar la casa en la que ya vives.',
    'Quieres revisar y aprobar cada fase antes de seguir.',
  ],
  no: [
    'La vivienda está fuera de Barcelona ciudad.',
    'Es obra nueva, un local o solo buscas decoración.',
    'Buscas que alguien ejecute la obra rápido, sin una fase de definición.',
  ],
};

export const fases = [
  {
    n: '01',
    nombre: 'Plantea',
    semanas: 'Semanas 1 a 2',
    texto: 'Qué necesita tu casa y qué no. Definimos el alcance antes de dibujar una sola línea.',
    entregable:
      'Planos del estado actual acotados, dos alternativas de distribución en planta y una primera estimación de inversión por capítulos.',
    aprueba: 'el briefing, la distribución en planta y las condiciones.',
  },
  {
    n: '02',
    nombre: 'Visualiza',
    semanas: 'Semanas 3 a 5',
    texto: 'La ves antes de que exista. Ahí es donde se cambian las cosas, no en obra.',
    entregable:
      'El concepto del proyecto, la dirección de materiales con muestras físicas y propuestas para cocina, baños, puertas y armarios.',
    aprueba: 'el concepto y la dirección material, antes de abrir Diseña.',
  },
  {
    n: '03',
    nombre: 'Diseña',
    semanas: 'Semanas 6 a 8',
    texto: 'El diseño decidido al detalle: distribución, materiales, acabados y equipamiento.',
    entregable:
      'Planta propuesta acotada, alzados de las estancias, renders de las decisiones más importantes y fichas de carpinterías a medida.',
    aprueba: 'el proyecto de diseño, antes de pasar a Materializa.',
  },
  {
    n: '04',
    nombre: 'Materializa',
    semanas: 'Semanas 9 a 12',
    texto: 'Todo documentado para pedir presupuestos comparables y empezar sin sorpresas.',
    entregable:
      'Planos de fontanería, electricidad, evacuación y climatización, mediciones para pedir presupuestos comparables y la comparativa de ofertas de los industriales.',
    // La última fase no da paso a otra: en vez de lo que se aprueba, dice cómo queda todo al cerrar
    alCerrar:
      'el proyecto queda listo para construir y decides la obra con las ofertas comparadas sobre la mesa.',
  },
];

export const principios = [
  {
    titulo: 'Todo en un solo sitio.',
    texto: 'Planos, decisiones y papeles viven en tu portal. Sin buscar en WhatsApp.',
  },
  {
    titulo: 'Una fase se cierra antes de abrir la siguiente.',
    texto: 'Nadie avanza con dudas a medias ni con decisiones sin tomar.',
  },
  {
    titulo: 'Contrato firmado antes de empezar.',
    texto: 'Alcance, plazos y precio por escrito desde el primer día.',
  },
  {
    titulo: 'Licencias y trámites con arquitecto colegiado.',
    texto: 'No los hago yo: te derivo a un colaborador que sí puede firmarlos.',
  },
];

// Preguntas frecuentes. Solo con datos confirmados del servicio.
export const preguntas = [
  {
    q: '¿Cuánto dura todo el proceso?',
    a: 'De 12 a 14 semanas de principio a fin, repartidas en cuatro fases cerradas.',
  },
  {
    q: '¿Tengo que contratar las cuatro fases de golpe?',
    a: 'No. Cada fase es un producto cerrado: se paga al abrirla y puedes parar al final de cualquiera de ellas.',
  },
  {
    q: '¿Trabajas fuera de Barcelona?',
    a: 'No. Solo trabajo en Barcelona ciudad, porque piso cada obra que acompaño.',
  },
];

// Testimonios reales. Mientras la lista esté vacía se muestran huecos reservados.
// Formato: { cita: '...', nombre: 'Laura', barrio: 'Gràcia' }
export const testimonios: { cita: string; nombre: string; barrio: string }[] = [];

export const sobreMi = {
  cita: 'El espacio debe adaptarse a ti, y no al revés.',
  compromisos: [
    { titulo: 'Una sola interlocutora', texto: 'De la primera visita a la entrega de llaves, hablas siempre conmigo.' },
    { titulo: 'Piso cada obra', texto: 'Por eso solo trabajo en Barcelona ciudad.' },
    { titulo: 'Solo vivienda', texto: 'Reformar viviendas es lo único que hago.' },
  ],
};
