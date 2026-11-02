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
    'Acompaño tu reforma de principio a fin: decidimos qué se toca y qué no, lo ves antes de construirlo y llegas a la obra con todo definido. De 12 a 14 semanas, solo en Barcelona.',
  email: 'hola@femuix.com',
  city: 'Barcelona',
  // Enlaces externos (Systeme.io para el reto, agenda para la llamada)
  retoUrl: '#reto',
  llamadaUrl: '#reto', // TODO: enlace a la agenda de la llamada de compatibilidad
  systemeFormAction: '', // TODO: URL de acción del formulario de Systeme.io
};

// Mientras no haya enlace a la agenda, la web no anuncia una llamada que no se puede reservar:
// los botones pasan a invitar a escribir un email. Al rellenar `llamadaUrl` vuelven a ser llamadas.
const activa = !site.llamadaUrl.startsWith('#');
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

export const dolores = [
  'Tienes las llaves y mil fotos guardadas, pero ninguna decisión tomada.',
  'Te da miedo gastarte el presupuesto de tu vida y arrepentirte a los dos meses.',
  'Has pedido presupuestos que no se parecen en nada entre sí y no sabes cuál mirar.',
];

export const fases = [
  {
    n: '01',
    nombre: 'Plantea',
    texto: 'Qué necesita tu casa y qué no. Definimos el alcance antes de dibujar una sola línea.',
    entregable: '[Entregable de la fase]',
  },
  {
    n: '02',
    nombre: 'Visualiza',
    texto: 'La ves antes de que exista. Ahí es donde se cambian las cosas, no en obra.',
    entregable: '[Entregable de la fase]',
  },
  {
    n: '03',
    nombre: 'Crea',
    texto: 'El diseño decidido al detalle: distribución, materiales, acabados y equipamiento.',
    entregable: '[Entregable de la fase]',
  },
  {
    n: '04',
    nombre: 'Materializa',
    texto: 'Todo documentado para pedir presupuestos comparables y empezar sin sorpresas.',
    entregable: '[Entregable de la fase]',
  },
];

export const principios = [
  {
    titulo: 'Todo en un solo sitio',
    texto: 'Un portal de cliente donde viven los planos, las decisiones y los papeles. Sin buscar en WhatsApp.',
  },
  {
    titulo: 'Una fase se cierra antes de abrir la siguiente',
    texto: 'Nadie avanza con dudas a medias ni con decisiones sin tomar.',
  },
  {
    titulo: 'Contrato firmado siempre antes de empezar',
    texto: 'Alcance, plazos y precio por escrito desde el primer día.',
  },
  {
    titulo: 'Licencias y trámites, con arquitecto colegiado',
    texto: 'No los hago yo: te derivo a un colaborador que sí puede firmarlos.',
  },
];

// Preguntas frecuentes. Solo con datos confirmados del servicio.
export const preguntas = [
  {
    q: '¿Cuánto dura todo el proceso?',
    a: 'De 12 a 14 semanas de principio a fin, repartidas en cuatro fases cerradas: Plantea, Visualiza, Crea y Materializa.',
  },
  {
    q: '¿Tengo que contratar las cuatro fases de golpe?',
    a: 'No. Cada fase es un producto cerrado: se paga al abrirla y puedes parar al final de cualquiera de ellas.',
  },
  {
    q: '¿Y si quiero cambiar algo?',
    a: 'Cada fase incluye hasta dos rondas de revisión. Los cambios se hacen sobre el papel, antes de la obra, que es donde tiene sentido hacerlos.',
  },
  {
    q: '¿Habrá un contrato?',
    a: 'Sí, siempre firmado antes de empezar, con el alcance, los plazos y el precio por escrito desde el primer día.',
  },
  {
    q: '¿Qué tipo de proyectos acompañas?',
    a: 'Solo reformas de vivienda ya construida. No hago obra nueva, locales ni decoración suelta.',
  },
  {
    q: '¿Trabajas fuera de Barcelona?',
    a: 'No. Solo trabajo en Barcelona ciudad, porque piso cada obra que acompaño.',
  },
  {
    q: '¿Quién se encarga de las licencias?',
    a: 'No las firmo yo: te derivo a un arquitecto colegiado colaborador que sí puede firmarlas.',
  },
  {
    q: '¿Cómo sé en qué punto está mi reforma?',
    a: 'Todo vive en tu portal de cliente: el plan por fases, el cronograma, los documentos y las decisiones tomadas. Sin buscar en WhatsApp.',
  },
];

// Testimonios reales. Mientras la lista esté vacía se muestran huecos reservados.
// Formato: { cita: '...', nombre: 'Laura', barrio: 'Gràcia' }
export const testimonios: { cita: string; nombre: string; barrio: string }[] = [];

export const sobreMi = {
  intro:
    '[Dos o tres frases tuyas: de dónde vienes, por qué montaste Femuix y qué te hizo trabajar así y no de otra manera.]',
  cita: 'El espacio debe adaptarse a ti, y no al revés.',
  compromisos: [
    { titulo: 'Solo vivienda construida', texto: 'Ni obra nueva, ni locales, ni decoración suelta.' },
    { titulo: 'Solo Barcelona ciudad', texto: 'Porque piso cada obra que acompaño.' },
    { titulo: 'Una sola interlocutora', texto: 'De principio a fin, hablas siempre conmigo.' },
  ],
};
