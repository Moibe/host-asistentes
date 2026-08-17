import { resolve } from 'path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Reescribe cualquier ruta /embed/<algo> (sin extensión) a /embed/index.html
// para que el router del cliente resuelva /embed/chat/<slug> y /embed/admin/<slug>.
// Las rutas con extensión (.js, .css, .svg, etc.) se sirven tal cual.
function embedSpaFallback() {
  const rewrite = (req) => {
    if (!req.url) return;
    const [pathname] = req.url.split('?');
    if (
      pathname.startsWith('/embed/') &&
      pathname !== '/embed/index.html' &&
      !/\.[a-zA-Z0-9]+$/.test(pathname)
    ) {
      const search = req.url.includes('?') ? '?' + req.url.split('?').slice(1).join('?') : '';
      req.url = '/embed/index.html' + search;
    }
  };

  return {
    name: 'embed-spa-fallback',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewrite(req);
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewrite(req);
        next();
      });
    },
  };
}

// El widget llama al API por ruta relativa (/api/...) en vez de host:8077
// directo — ver Embed.svelte/ContextLightEmbed.svelte. Este proxy es lo que
// hace que /api/* llegue de verdad al backend, tanto en dev como en el
// servidor real (que corre `vite preview`). Sin este bloque, /api/* devolvería
// 404 del propio Vite en vez de reenviarse a FastAPI.
const apiProxy = {
  '/api': {
    target: 'http://127.0.0.1:8077',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
};

export default defineConfig({
  plugins: [svelte(), embedSpaFallback()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        embed: resolve(__dirname, 'embed/index.html'),
      },
    },
  },
  server: {
    port: 4176,
    host: true,
    proxy: apiProxy,
  },
  preview: {
    port: 4176,
    host: true,
    proxy: apiProxy,
  },
});
