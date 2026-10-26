import type { APIRoute } from 'astro';
import {
  euros,
  fases,
  mensajeCentral,
  metodoCompleto,
  paraQuien,
  precios,
  preguntas,
  site,
  tramos,
  url,
} from '../data/site';

// /llms.txt: resumen de la web en texto plano para los buscadores y asistentes con IA (propuesta
// llmstxt.org). Sale de los mismos datos que la página, así que nunca la contradice.
export const GET: APIRoute = ({ site: base }) => {
  const abs = (path: string) => new URL(url(path), base).href;
  const fila = (cols: string[]) => `| ${cols.join(' | ')} |`;

  const texto = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    'Femuix es el estudio de Andrea, interiorista en Barcelona. Acompaña a particulares a decidir la reforma de su vivienda en cuatro fases cerradas, hasta dejar el proyecto listo para contratar la obra. No ejecuta la obra: la ejecutan los industriales que elige la clienta, con presupuestos comparables.',
    '',
    mensajeCentral,
    '',
    '## Para quién es',
    '',
    paraQuien.intro,
    '',
    ...paraQuien.si.map((t) => `- Sí: ${t}`),
    ...paraQuien.no.map((t) => `- No: ${t}`),
    '',
    '## El método Femuix: cuatro fases, de 12 a 14 semanas',
    '',
    ...fases.flatMap((f) => [
      `### Fase ${f.n} · ${f.nombre}${f.semanas ? ` (${f.semanas.toLowerCase()})` : ''}`,
      '',
      f.texto,
      '',
      `- Recibes: ${f.entregable}`,
      ...(f.aprueba ? [`- Apruebas por escrito: ${f.aprueba}`] : []),
      ...(f.alCerrar ? [`- Al cerrar: ${f.alCerrar}`] : []),
      '',
    ]),
    '## Precios, con el IVA incluido',
    '',
    'Según la superficie de la vivienda. Cada fase se contrata y se paga por separado: el 70 % al abrirla y el 30 % antes de la entrega. Se puede parar al final de cualquier fase.',
    '',
    fila(['Fase', ...tramos]),
    fila(['---', ...tramos.map(() => '---:')]),
    ...precios.map((p) => fila([p.fase, ...p.importes.map(euros)])),
    fila(['Método completo', ...metodoCompleto.map(euros)]),
    '',
    '## Preguntas frecuentes',
    '',
    ...preguntas.flatMap((p) => [`### ${p.q}`, '', p.a, '']),
    '## Cómo empezar',
    '',
    `- Formulario «Cuéntame tu reforma» en ${abs('/')}: Andrea lo lee y, si la reforma encaja, propone una llamada de compatibilidad gratuita y sin compromiso, de 30 a 45 minutos.`,
    `- Email: ${site.email}`,
    '',
    '## Páginas',
    '',
    `- [Inicio](${abs('/')}): método, fases, precios y preguntas`,
    `- [Política de privacidad](${abs('/privacidad')})`,
    `- [Accesibilidad](${abs('/accesibilidad')})`,
    '',
  ].join('\n');

  return new Response(texto, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
