// Preguntas del formulario «Cuéntame tu reforma» (ContactoModal.astro), según la estrategia de
// captación (campos de la p. 8 y criterio de encaje de la p. 9).
//
// Pantalla 1 · Tus datos (en el componente): nombre, email, móvil y consentimiento.
// Pantalla 2 · Tu vivienda: cuatro preguntas que filtran. Si alguna respuesta descarta, la
//   persona ve la despedida con el motivo y la consulta llega como «No encaja» (estado Descartada).
// Pantalla 3 · Último paso: cinco preguntas que perfilan. Al enviar, la consulta llega como
//   «Encaja» o «Dudoso» (estado Nueva).
//
// Cada opción encaja salvo que diga lo contrario: `encaje: 'Dudoso'` la marca para revisar y
// `motivo` la descarta, con la frase que se le muestra a la persona.

export type Encaje = 'Encaja' | 'Dudoso' | 'No encaja';

export interface Opcion {
  valor: string;
  encaje?: Encaje;
  motivo?: string;
}

export interface Pregunta {
  nombre: string;
  etiqueta: string;
  tipo: 'opciones' | 'lista' | 'texto';
  opciones?: Opcion[];
  obligatoria: boolean;
  ayuda?: string;
  error?: string;
}

const distritos = [
  'Ciutat Vella',
  "L'Eixample",
  'Sants-Montjuïc',
  'Les Corts',
  'Sarrià-Sant Gervasi',
  'Gràcia',
  'Horta-Guinardó',
  'Nou Barris',
  'Sant Andreu',
  'Sant Martí',
];

export const filtro: Pregunta[] = [
  {
    nombre: 'distrito',
    etiqueta: 'Distrito de la vivienda',
    tipo: 'lista',
    obligatoria: true,
    opciones: [
      ...distritos.map((valor) => ({ valor })),
      {
        valor: 'Fuera de Barcelona ciudad',
        encaje: 'No encaja',
        motivo: 'Solo trabajo en Barcelona ciudad, porque piso cada obra que acompaño.',
      },
    ],
    error: 'Elige el distrito o «Fuera de Barcelona ciudad».',
  },
  {
    nombre: 'tipo',
    etiqueta: 'Qué vas a reformar',
    tipo: 'opciones',
    obligatoria: true,
    opciones: [
      { valor: 'Mi vivienda, que ya existe' },
      {
        valor: 'Una vivienda de obra nueva',
        encaje: 'No encaja',
        motivo: 'Solo acompaño reformas de viviendas que ya existen, y la obra nueva queda fuera.',
      },
      {
        valor: 'Un local, una oficina o una promoción',
        encaje: 'No encaja',
        motivo: 'Solo acompaño a particulares que reforman su propia vivienda.',
      },
      {
        valor: 'Solo decoración, sin obra',
        encaje: 'No encaja',
        motivo: 'Mi método es para reformas con obra, y la decoración suelta queda fuera.',
      },
    ],
    error: 'Elige qué vas a reformar.',
  },
  {
    nombre: 'superficie',
    etiqueta: 'Superficie aproximada',
    tipo: 'opciones',
    obligatoria: true,
    opciones: [
      { valor: 'Hasta 45 m²' },
      { valor: 'De 45 a 90 m²' },
      { valor: 'De 90 a 130 m²' },
      {
        valor: 'Más de 130 m²',
        encaje: 'No encaja',
        motivo: 'Ahora solo acompaño viviendas de hasta 130 m², para dar a cada una el tiempo que necesita.',
      },
      { valor: 'No lo sé', encaje: 'Dudoso' },
    ],
    error: 'Elige la superficie aproximada.',
  },
  {
    nombre: 'punto',
    etiqueta: 'En qué punto estás',
    tipo: 'opciones',
    obligatoria: true,
    opciones: [
      { valor: 'Aún no he comprado', encaje: 'Dudoso' },
      { valor: 'Tengo las llaves y aún no tengo plan' },
      { valor: 'Vivo en ella y quiero reformarla' },
      { valor: 'Ya tengo presupuestos de obra', encaje: 'Dudoso' },
      {
        valor: 'La obra ya ha empezado',
        encaje: 'No encaja',
        motivo: 'Mi método va antes de la obra, y la tuya ya ha empezado.',
      },
    ],
    error: 'Dime en qué punto estás.',
  },
];

export const perfil: Pregunta[] = [
  {
    nombre: 'alcance',
    etiqueta: 'Qué quieres reformar',
    tipo: 'opciones',
    obligatoria: true,
    opciones: [{ valor: 'Toda la vivienda' }, { valor: 'Cocina o baños' }, { valor: 'Varias estancias' }],
    error: 'Elige qué quieres reformar.',
  },
  {
    nombre: 'mensaje',
    etiqueta: 'Cuéntame brevemente tu reforma',
    tipo: 'texto',
    obligatoria: true,
    ayuda: 'Por ejemplo: abrir la cocina al salón y rehacer el baño.',
    error: 'Cuéntame en pocas palabras tu reforma.',
  },
  {
    nombre: 'ahora',
    etiqueta: '¿Qué te ha llevado a buscar ayuda ahora?',
    tipo: 'texto',
    obligatoria: true,
    ayuda: 'Con tus palabras: me ayuda a entender tu momento.',
    error: 'Cuéntame qué te ha llevado a buscar ayuda ahora.',
  },
  {
    nombre: 'plazo',
    etiqueta: 'Plazo aproximado',
    tipo: 'lista',
    obligatoria: false,
    opciones: [
      { valor: 'Lo antes posible' },
      { valor: 'En los próximos 3 meses' },
      { valor: 'De 3 a 6 meses' },
      { valor: 'Más adelante' },
      { valor: 'Aún no lo sé' },
    ],
  },
  {
    nombre: 'origen',
    etiqueta: 'Cómo has conocido Femuix',
    tipo: 'lista',
    obligatoria: false,
    opciones: [
      { valor: 'Me lo recomendaron' },
      { valor: 'Instagram' },
      { valor: 'Google u otro buscador' },
      { valor: 'Otro' },
    ],
  },
];

// Resultado de la pantalla 2: «No encaja» con los motivos si alguna respuesta descarta; si no,
// «Dudoso» si alguna lo es y «Encaja» en el resto
export function encajeDe(respuestas: Record<string, string>) {
  const elegidas = filtro.map((p) => p.opciones?.find((o) => o.valor === respuestas[p.nombre]));
  const motivos = elegidas.flatMap((o) => (o?.motivo ? [o.motivo] : []));
  if (motivos.length) return { encaje: 'No encaja' as Encaje, motivos };
  const dudoso = elegidas.some((o) => o?.encaje === 'Dudoso');
  return { encaje: (dudoso ? 'Dudoso' : 'Encaja') as Encaje, motivos };
}
