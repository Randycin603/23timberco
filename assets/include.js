<script>
(async function () {
  async function inject(targetId, url) {
    const el = document.getElementById(targetId);
    if (!el) return;
    const res = await fetch(url + '?v=5');        // cache-bust
    el.innerHTML = await res.text();
  }

  // Inject header & footer
  await inject('site-header', 'partials/header.html');
  await inject('site-footer', 'partials/footer.html');

  // Mark active nav link
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('#site-header nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === current) a.setAttribute('aria-current', 'page');
  });

  // Mobile nav toggle + body scroll lock
  const wrap = document.querySelector('#site-header header .nav');
  const btn  = document.querySelector('#site-header .nav-toggle');
  const links = [...document.querySelectorAll('#site-header #primary-menu a')];
  function toggle() {
    const open = wrap.classList.toggle('open');
    btn?.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('no-scroll', open);
  }
  btn?.addEventListener('click', toggle);
  links.forEach(a => a.addEventListener('click', () => { if (wrap.classList.contains('open')) toggle(); }));

  // Shadow on scroll
  document.addEventListener('scroll', () => {
    document.documentElement.classList.toggle('is-scrolled', window.scrollY > 4);
  });
})();
</script>