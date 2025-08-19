<script>
// assets/include.js
(() => {
  const q = v => v + (v.includes('?') ? '&' : '?') + 'v=5';  // cache-bust

  async function loadInto(id, url) {
    const slot = document.getElementById(id);
    if (!slot) return;

    try {
      const res = await fetch(q(url), { credentials: 'same-origin' });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      slot.innerHTML = await res.text();
    } catch (err) {
      console.error(`Include failed for ${url}:`, err);
      // visible hint so we know *why* it failed
      slot.innerHTML =
        `<div style="background:#3b1b1b;color:#fff;padding:.75rem;border-radius:8px">
           Include failed: <code>${url}</code><br>
           <small>Open the browser console for details (F12 → Console).</small>
         </div>`;
    }
  }

  // Run after DOM is ready
  document.addEventListener('DOMContentLoaded', async () => {
    await loadInto('site-header', 'assets/header.html');
    await loadInto('site-footer', 'assets/footer.html');

    // After header is in the DOM, set active link + mobile toggle
    const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('#site-header nav a').forEach(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href === current) a.setAttribute('aria-current', 'page');
    });

    const wrap  = document.querySelector('#site-header header .nav');
    const btn   = document.querySelector('#site-header .nav-toggle');
    const links = [...document.querySelectorAll('#site-header #primary-menu a')];

    function toggle() {
      const open = wrap?.classList.toggle('open');
      if (btn) btn.setAttribute('aria-expanded', String(!!open));
      document.documentElement.classList.toggle('no-scroll', !!open);
    }
    btn?.addEventListener('click', toggle);
    links.forEach(a => a.addEventListener('click', () => { if (wrap?.classList.contains('open')) toggle(); }));

    document.addEventListener('scroll', () => {
      document.documentElement.classList.toggle('is-scrolled', window.scrollY > 4);
    });
  });
})();
</script>