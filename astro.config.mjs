// @ts-check
import { defineConfig } from 'astro/config';

// En GitHub Pages el flujo de publicación (.github/workflows/deploy.yml) pasa la dirección y la
// carpeta reales: https://usuario.github.io + /nombre-del-repo. Con dominio propio o en local,
// la web va en la raíz de femuix.com.
export default defineConfig({
  site: process.env.SITE_URL || 'https://femuix.com',
  base: process.env.BASE_PATH || '/',
});
