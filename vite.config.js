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
      // Pre-hook: registramos antes que el static-file middleware de Vite
      // para poder reescribir la URL antes de que intente servir el archivo.
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

export default defineConfig({
  plugins: [svelte(), embedSpaFallback()],
  build: {
    rollupOptions: {
      input: {
        embed: resolve(__dirname, 'embed/index.html'),
      },
    },
  },
  server: {
    port: 5174,
    proxy: {
      '/api-desarrollo': {
        target: 'http://127.0.0.1:8077',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-desarrollo/, ''),
      },
      '/api-staging': {
        target: 'http://172.10.30.15:8077',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-staging/, ''),
      },
      '/api-produccion': {
        target: 'http://172.10.30.16:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-produccion/, ''),
      },
    },
  },
  preview: {
    port: 4176,
    host: true,
  },
});
