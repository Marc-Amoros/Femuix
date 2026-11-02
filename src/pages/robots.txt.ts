import type { APIRoute } from 'astro';
import { url } from '../data/site';

// Indica a los buscadores dónde está el mapa del sitio
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(url('/sitemap.xml'), site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
