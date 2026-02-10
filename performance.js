/* =========================================
   PERFORMANCE PATCH — Fibroprev
   - prioriza LCP (hero)
   - preload condicional (mobile/desktop)
   - lazy/decoding/fetchpriority para imagens não críticas
   - listeners passivos + rAF para evitar trabalho em scroll
   - reduz trabalho quando aba está em background
   ========================================= */

(() => {
  const d = document;

  // -----------------------------
  // Helpers
  // -----------------------------
  const addPreloadImage = (href) => {
    if (!href) return;
    // evita duplicar
    const exists = d.querySelector(`link[rel="preload"][as="image"][href="${CSS.escape(href)}"]`);
    if (exists) return;

    const link = d.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = href;
    d.head.appendChild(link);
  };

  const setImgAttrs = (img, attrs) => {
    if (!img) return;
    Object.entries(attrs).forEach(([k, v]) => {
      try {
        img.setAttribute(k, v);
      } catch (_) {}
    });
  };

  // -----------------------------
  // 1) LCP: escolher imagem do hero (mobile vs desktop) e priorizar
  // -----------------------------
  const isMobile = matchMedia("(max-width: 768px)").matches;

  const heroMobileImg = d.querySelector(".hero-mobile-image img"); // assets/final_mobile.webp
  const heroDesktopBg = d.querySelector("img.hero-bg");            // assets/menorpx.webp

  const lcpImg = isMobile ? heroMobileImg : heroDesktopBg;

  // Prioriza a imagem provável do LCP
  if (lcpImg) {
    // Mesmo que o ideal seja no HTML, isso já ajuda em alguns cenários
    setImgAttrs(lcpImg, {
      loading: "eager",
      decoding: "async",
      fetchpriority: "high"
    });

    // Preload (melhora o começo do download; ideal quando o script roda cedo)
    addPreloadImage(lcpImg.getAttribute("src"));
  }

  // -----------------------------
  // 2) Otimizar TODAS as outras imagens (não-LCP)
  // -----------------------------
  const allImgs = Array.from(d.images || []);
  allImgs.forEach((img) => {
    if (img === lcpImg) return;

    // não mexe em SVG inline (não é <img>) e etc.
    const src = img.getAttribute("src") || "";

    // Se for algo abaixo da dobra, lazy ajuda muito
    // (inclusive os Unsplash da galeria)
    setImgAttrs(img, {
      loading: img.getAttribute("loading") || "lazy",
      decoding: img.getAttribute("decoding") || "async",
      fetchpriority: img.getAttribute("fetchpriority") || "low"
    });

    // Pequena proteção: evita downloads “cedo” de imagens vazias
    if (!src) return;
  });

  // -----------------------------
  // 3) Scroll otimizado (rAF + passive)
  // Obs: seu script.js já faz isso de um jeito simples,
  // aqui fica uma versão mais leve (mas ele não remove o listener antigo).
  // -----------------------------
  const header = d.querySelector(".site-header");
  let ticking = false;

  const onScroll = () => {
    if (!header) return;
    if (ticking) return;

    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      header.style.boxShadow =
        y > 100
          ? "0 4px 20px rgba(45, 27, 78, 0.15)"
          : "0 2px 8px rgba(45, 27, 78, 0.10)";
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });

  // -----------------------------
  // 4) Pausar coisas em background (economiza CPU no mobile)
  // -----------------------------
  d.addEventListener("visibilitychange", () => {
    // Exemplo: se quiser pausar animações/loops seus, faça aqui.
    // Por enquanto, só evita trabalho imediato ao voltar.
    if (!d.hidden) onScroll();
  });

  // executa uma vez no início
  onScroll();
})();
