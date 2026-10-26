import type { APIRoute } from 'astro';
import { url } from '../data/site';

// Indica a los buscadores dónde está el mapa del sitio. Los rastreadores de los buscadores con IA
// (ChatGPT, Claude, Perplexity, Gemini, Apple) tienen permiso explícito: así pueden leer la web y
// citarla cuando alguien pregunta por una interiorista o una reforma en Barcelona.
const ia = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
];

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(url('/sitemap.xml'), site);
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    '# Buscadores con IA',
    ...ia.map((bot) => `User-agent: ${bot}`),
    'Allow: /',
    '',
    `Sitemap: ${sitemap.href}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
