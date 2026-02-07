// ====================================
// MOBILE MENU
// ====================================
const burger = document.getElementById("burger");
const mobileNav = document.getElementById("mobileNav");

if (burger && mobileNav) {
  burger.addEventListener("click", () => {
    const isOpen = mobileNav.style.display === "block";
    mobileNav.style.display = isOpen ? "none" : "block";
    burger.classList.toggle("active");
  });

  mobileNav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      mobileNav.style.display = "none";
      burger.classList.remove("active");
    });
  });
}

// ====================================
// SMOOTH SCROLL (offset dinâmico)
// ====================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", (e) => {
    const id = anchor.getAttribute("href");
    const target = document.querySelector(id);

    if (!target) return;

    e.preventDefault();

    const header = document.querySelector('.topbar');
    const offset = (header && window.getComputedStyle(header).display !== 'none') ? header.offsetHeight : 0;

    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });
  });
});

// ====================================
// REVEAL ON SCROLL (Intersection Observer)
// ====================================
const revealElements = document.querySelectorAll("[data-reveal]");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  }
);

revealElements.forEach((el) => revealObserver.observe(el));

// ====================================
// MODAL LEAD
// ====================================
const modal = document.getElementById("leadModal");
const openButtons = document.querySelectorAll(".js-open-lead");
const closeTargets = modal ? modal.querySelectorAll("[data-close-modal]") : [];
const leadForm = document.getElementById("leadForm");
const formStatus = document.getElementById("formStatus");

function openModal() {
  if (!modal) return;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const firstInput = modal.querySelector("input[name='nome']");
  if (firstInput) setTimeout(() => firstInput.focus(), 100);
}

function closeModal() {
  if (!modal) return;

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

openButtons.forEach((btn) => btn.addEventListener("click", openModal));
closeTargets.forEach((el) => el.addEventListener("click", closeModal));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal?.classList.contains("is-open")) {
    closeModal();
  }
});

// ====================================
// FORM SUBMISSION (simulado)
// ====================================
if (leadForm) {
  leadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(leadForm);
    const data = Object.fromEntries(formData.entries());

    if (!data.nome || !data.email || !data.whatsapp) {
      if (formStatus) {
        formStatus.textContent = "Por favor, preencha Nome, Email e WhatsApp.";
        formStatus.style.color = "#ff0000";
      }
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      if (formStatus) {
        formStatus.textContent = "Por favor, insira um email válido.";
        formStatus.style.color = "#ff0000";
      }
      return;
    }

    if (formStatus) {
      formStatus.textContent = "Enviando...";
      formStatus.style.color = "#5c00a8";
    }

    // Simula API
    await new Promise(resolve => setTimeout(resolve, 800));

    if (formStatus) {
      formStatus.textContent = "Recebido! Redirecionando... ✓";
      formStatus.style.color = "#25D366";
    }

    leadForm.reset();

    setTimeout(() => {
      window.location.href = "obrigado.html";
    }, 1000);
  });
}

// ====================================
// TOPBAR SHADOW ON SCROLL
// ====================================
const topbar = document.querySelector(".topbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    topbar?.classList.add("scrolled");
  } else {
    topbar?.classList.remove("scrolled");
  }
});

const style = document.createElement("style");
style.textContent = `
  .topbar.scrolled {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    background: rgba(255, 255, 255, 0.92);
  }
`;
document.head.appendChild(style);
