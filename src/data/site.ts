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
  title: 'Interiorista en Barcelona para reformar tu vivienda · Femuix',
  description:
    'Interiorismo para reformar tu vivienda en Barcelona ciudad: cuatro fases aprobadas por escrito y un proyecto listo para contratar la obra. Plantea desde 297 €.',
  email: 'hola@femuix.com',
  city: 'Barcelona',
  // Dirección a la que el formulario «Cuéntame tu reforma» envía los datos (p. ej. Formspree).
  // Vacía: al enviar se abre el correo con el mensaje ya redactado.
  contactoAction: '', // TODO: servicio de formularios
};

// Desde la web no se reserva la llamada de compatibilidad (estrategia de captación): todo lo que
// llega en frío pasa antes por el formulario «Cuéntame tu reforma», y Andrea propone la llamada
// si la reforma encaja. Los botones abren el formulario; sin JavaScript, el email.

// Mensaje central de la marca (estrategia de captación): se repite igual en cada canal
export const mensajeCentral =
  'Antes de tocar una pared, nada se improvisa: cada decisión se aprueba por escrito, para que la obra no se pare a esperar decisiones ni se rehaga por un cambio de idea.';

export const nav = [
  { label: 'Para quién es', href: '#para-quien' },
  { label: 'Sobre mí', href: '#sobre-mi' },
  { label: 'El método', href: '#metodo' },
  { label: 'Cómo trabajo', href: '#como-trabajo' },
  { label: 'Preguntas', href: '#preguntas' },
];

// Para quién es (y para quién no): sección que sigue al hero
export const paraQuien = {
  intro:
    'Trabajo con particulares que reforman su propia vivienda en Barcelona ciudad, de hasta 130 m². Si tu vida ha cambiado y tu casa ya no responde a cómo vives, este proceso es para ti.',
  si: [
    'Tienes las llaves de tu casa y todavía no tienes un plan.',
    'Necesitas reorganizar la casa en la que ya vives.',
    'Quieres decidirlo todo, y por escrito, antes de pedir presupuestos.',
  ],
  no: [
    'La vivienda está fuera de Barcelona ciudad o pasa de 130 m².',
    'Es obra nueva, un local o solo buscas decoración.',
    'La obra ya ha empezado o solo buscas quien la ejecute.',
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
    texto: 'Todo documentado para pedir presupuestos comparables y llegar a la obra con todo decidido.',
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
    texto: 'Un portal de cliente donde viven los planos, las decisiones y los papeles. Sin buscar en WhatsApp.',
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
    texto: 'No los firmo yo: te derivo a un colaborador que sí puede hacerlo.',
  },
];

// Preguntas frecuentes. Solo con datos confirmados del servicio.
export const preguntas = [
  {
    q: '¿Cuánto dura todo el proceso?',
    a: 'De 12 a 14 semanas, desde la primera visita hasta tener el proyecto listo para contratar la obra, repartidas en cuatro fases cerradas.',
  },
  {
    q: '¿Cuánto cuesta?',
    a: 'Depende de la superficie de la vivienda. Plantea cuesta desde 297 € y el método completo, desde 3.488 €, con el IVA incluido. Cada fase se paga por separado.',
  },
  {
    q: '¿Tengo que contratar las cuatro fases de golpe?',
    a: 'No. Cada fase es un producto cerrado: se paga al abrirla y puedes parar al final de cualquiera de ellas.',
  },
  {
    q: '¿Ejecutas tú la obra?',
    a: 'No. Te acompaño a decidir tu reforma y la dejo lista para contratar. La obra la ejecutan los industriales que elijas, con presupuestos que puedes comparar.',
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
    { titulo: 'Una sola interlocutora', texto: 'De la primera visita al proyecto terminado, hablas siempre conmigo.' },
    { titulo: 'Piso cada obra', texto: 'Por eso solo trabajo en Barcelona ciudad.' },
    { titulo: 'Solo vivienda', texto: 'Solo acompaño reformas de vivienda: ni locales ni obra nueva.' },
  ],
};

// Precios publicados (estrategia de captación, 26 de octubre de 2026), con el IVA incluido.
// Cada fase se contrata y se paga por separado: 70 % al abrirla y 30 % antes de la entrega.
export const tramos = ['Hasta 45 m²', 'Hasta 90 m²', 'Hasta 130 m²'];
export const precios = [
  { fase: 'Plantea', importes: [297, 397, 497] },
  { fase: 'Visualiza', importes: [497, 697, 897] },
  { fase: 'Diseña', importes: [1097, 1497, 1997] },
  { fase: 'Materializa', importes: [1597, 2197, 2897] },
];
// El método completo es la suma de las cuatro fases de cada tramo
export const metodoCompleto = tramos.map((_, t) => precios.reduce((suma, p) => suma + p.importes[t], 0));
// 1097 → «1.097 €» (el formato español no agrupa por sí solo los números de cuatro cifras)
export const euros = (n: number) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} €`;
