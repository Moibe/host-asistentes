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
    <div style="font-family: 'Inter', system-ui, sans-serif; padding: 3rem 2rem; text-align: center; color: #6b7280; background: #f0f2f5; height: 100dvh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem;">
      <h1 style="font-size: 3rem; margin: 0; color: #1a1a2e;">404</h1>
      <p style="margin: 0; font-size: 0.95rem;">Ruta no reconocida.</p>
      <p style="margin: 0; font-size: 0.8rem; color: #9ca3af;">Formato esperado: <code>/embed/chat/&lt;slug&gt;</code> o <code>/embed/admin/&lt;slug&gt;</code></p>
    </div>
  `;
}

export default app;
