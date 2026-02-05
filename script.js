// Mobile menu
const burger = document.getElementById("burger");
const mobileNav = document.getElementById("mobileNav");

if (burger && mobileNav) {
  burger.addEventListener("click", () => {
    const isOpen = mobileNav.style.display === "block";
    mobileNav.style.display = isOpen ? "none" : "block";
  });

  mobileNav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => (mobileNav.style.display = "none"));
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    const el = document.querySelector(id);
    if (!el) return;

    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Reveal on scroll
const revealEls = [...document.querySelectorAll("[data-reveal]")];
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("revealed");
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

/* Modal Lead */
const modal = document.getElementById("leadModal");
const openBtns = document.querySelectorAll(".js-open-lead");
const closeTargets = modal ? modal.querySelectorAll("[data-close-modal]") : [];
const leadForm = document.getElementById("leadForm");
const formStatus = document.getElementById("formStatus");

function openModal(){
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // foco no primeiro input
  const firstInput = modal.querySelector("input[name='nome']");
  if (firstInput) setTimeout(() => firstInput.focus(), 50);
}

function closeModal(){
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

openBtns.forEach(btn => btn.addEventListener("click", openModal));
closeTargets.forEach(el => el.addEventListener("click", closeModal));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal?.classList.contains("is-open")) closeModal();
});

// Submit (placeholder)
if (leadForm) {
  leadForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(leadForm).entries());

    // validação simples
    if (!data.nome || !data.email || !data.whatsapp) {
      if (formStatus) formStatus.textContent = "Por favor, preencha Nome, Email e WhatsApp.";
      return;
    }

    if (formStatus) formStatus.textContent = "Enviando...";

    // Simula envio (troco para API/Planilha quando você quiser)
   setTimeout(() => {
  if (formStatus) formStatus.textContent = "Recebido! Redirecionando... ✓";
  leadForm.reset();

  // redireciona após 0.8s
  setTimeout(() => {
    window.location.href = "obrigado.html";
  }, 800);

}, 700);
  });
}

