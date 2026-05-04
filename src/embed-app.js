import { mount } from 'svelte';
import Embed from './Embed.svelte';
import ContextLightEmbed from './ContextLightEmbed.svelte';

const target = document.getElementById('embed');
const path = window.location.pathname;

const chatMatch = path.match(/^\/embed\/chat\/([^\/]+)\/?$/);
const adminMatch = path.match(/^\/embed\/admin\/([^\/]+)\/?$/);

let app;

if (chatMatch) {
  app = mount(Embed, {
    target,
    props: { slug: decodeURIComponent(chatMatch[1]) },
  });
} else if (adminMatch) {
  app = mount(ContextLightEmbed, {
    target,
    props: { slug: decodeURIComponent(adminMatch[1]) },
  });
} else {
  target.innerHTML = `
    <style>
      :root { color-scheme: dark; }
      html, body { margin: 0; height: 100%; }
      body {
        font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        background:
          radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.18), transparent 55%),
          radial-gradient(circle at 80% 80%, rgba(56, 189, 248, 0.14), transparent 55%),
          #0b1020;
        color: #e6e8ef;
        -webkit-font-smoothing: antialiased;
      }
      .nf-wrap {
        min-height: 100dvh;
        display: grid;
        place-items: center;
        padding: 24px;
        box-sizing: border-box;
      }
      .nf-card {
        max-width: 520px;
        width: 100%;
        text-align: center;
        padding: 40px 32px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(8px);
        box-sizing: border-box;
      }
      .nf-badge {
        display: inline-block;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #fca5a5;
        background: rgba(244, 63, 94, 0.12);
        border: 1px solid rgba(244, 63, 94, 0.28);
        padding: 6px 12px;
        border-radius: 999px;
        margin-bottom: 20px;
      }
      .nf-card h1 {
        margin: 0 0 12px;
        font-size: 26px;
        font-weight: 600;
        letter-spacing: -0.01em;
      }
      .nf-card p {
        margin: 0;
        font-size: 15px;
        line-height: 1.55;
        color: #b8becd;
      }
      .nf-hint { margin-top: 20px; font-size: 13px; color: #7d8499; }
      .nf-card code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 12.5px;
        background: rgba(255, 255, 255, 0.06);
        padding: 2px 6px;
        border-radius: 6px;
        color: #cdd3e1;
      }
    </style>
    <div class="nf-wrap">
      <main class="nf-card">
        <span class="nf-badge">Error 404</span>
        <h1>Ruta no reconocida</h1>
        <p>El formato esperado es <code>/embed/chat/&lt;slug&gt;</code> o <code>/embed/admin/&lt;slug&gt;</code>.</p>
        <p class="nf-hint">Verificá la URL del iframe en el sitio que la incluye.</p>
      </main>
    </div>
  `;
}

export default app;
