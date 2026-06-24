// ════════════════════════════════════════════════════════════════════════
// PIXFORME — Shared top navigation
// Injects into <div id="topnav"> with data-active="route-name"
// ════════════════════════════════════════════════════════════════════════

function renderTopNav() {
  const mount = document.getElementById('topnav');
  if (!mount) return;
  const active = mount.getAttribute('data-active') || '';

  const links = [
    { id: 'product', label: 'Produk', href: 'product.html' },
    { id: 'tools', label: 'AI Fix Tools', href: 'tools.html' },
    { id: 'pricing', label: 'Harga', href: 'pricing.html' },
  ];

  mount.innerHTML = `
    <a href="index.html" class="topnav-logo">
      <span data-pixel-logo data-pixel-size="26"></span>
      <span>PIXFORME</span>
    </a>
    <div class="topnav-links">
      ${links.map(l => `<a href="${l.href}" class="${active === l.id ? 'active' : ''}">${l.label}</a>`).join('')}
    </div>
    <div class="topnav-actions">
      <a href="login.html" class="pixel-btn pixel-btn-ghost" style="padding:8px 16px;">Masuk</a>
      <a href="wizard-step1.html" class="pixel-btn pixel-btn-accent" style="padding:8px 16px;">Mulai Gratis</a>
    </div>
  `;
  renderPixelIcons();
}

document.addEventListener('DOMContentLoaded', renderTopNav);
