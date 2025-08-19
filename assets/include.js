// assets/include.js
(() => {
  const bust = url => url + (url.includes("?") ? "&" : "?") + "v=5";

  async function inject(id, url) {
    const slot = document.getElementById(id);
    if (!slot) return;
    try {
      const res = await fetch(bust(url), { credentials: "same-origin" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      slot.innerHTML = await res.text();
    } catch (err) {
      console.error(`Include failed for ${url}:`, err);
      slot.innerHTML = `<div style="background:#3b1b1b;color:#fff;padding:.75rem;border-radius:8px">
        Include failed: <code>${url}</code>. Open Console for details.
      </div>`;
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    await inject("site-header", "assets/header.html");
    await inject("site-footer", "assets/footer.html");

    // Highlight active link
    const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll("#site-header nav a").forEach(a => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      if (href === current) a.setAttribute("aria-current", "page");
    });

    // Mobile toggle
    const wrap  = document.querySelector("#site-header header .nav");
    const btn   = document.querySelector("#site-header .nav-toggle");
    const links = [...document.querySelectorAll("#site-header #primary-menu a")];
    function toggle() {
      const open = wrap?.classList.toggle("open");
      if (btn) btn.setAttribute("aria-expanded", String(!!open));
      document.documentElement.classList.toggle("no-scroll", !!open);
    }
    btn?.addEventListener("click", toggle);
    links.forEach(a => a.addEventListener("click", () => { if (wrap?.classList.contains("open")) toggle(); }));

    // Header shadow
    document.addEventListener("scroll", () => {
      document.documentElement.classList.toggle("is-scrolled", window.scrollY > 4);
    });
  });
})();
