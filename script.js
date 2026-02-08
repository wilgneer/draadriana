// ========================================
// NAVEGAÇÃO SUAVE
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ========================================
// HEADER SCROLL EFFECT
// ========================================
const header = document.querySelector('.site-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (header) {
    if (currentScroll > 100) {
      header.style.boxShadow = '0 4px 20px rgba(45, 27, 78, 0.15)';
    } else {
      header.style.boxShadow = '0 2px 8px rgba(45, 27, 78, 0.1)';
    }
  }

  lastScroll = currentScroll;
});

// ========================================
// MODAL FUNCTIONALITY
// ========================================
const modal = document.getElementById('leadModal');
const modalClose = document.getElementById('modalClose');
const openModalButtons = document.querySelectorAll('[data-open-modal]');

// Abrir modal
openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

// Fechar modal
if (modalClose) {
  modalClose.addEventListener('click', () => {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  });
}

// Fechar ao clicar fora
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Fechar com ESC
document.addEventListener('keydown', (e) => {
  if (!modal) return;
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ========================================
// FORMULÁRIO DE LEAD
// ========================================
const leadForm = document.getElementById('leadForm');
const formFeedback = document.getElementById('formFeedback');

if (leadForm) {
  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Coletar dados
    const formData = {
      nome: document.getElementById('nome')?.value || '',
      email: document.getElementById('email')?.value || '',
      profissao: document.getElementById('profissao')?.value || '',
      whatsapp: document.getElementById('whatsapp')?.value || '',
      timestamp: new Date().toISOString()
    };

    try {
      // Aqui você integraria com sua API, Google Sheets, etc.
      console.log('Dados do lead:', formData);

      // (Opcional) feedback instantâneo antes do redirect
      if (formFeedback) {
        formFeedback.style.display = 'block';
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = '✓ Enviando...';
      }

      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 1200));

      // (Opcional) salvar dados para usar na página obrigado.html
      sessionStorage.setItem('lead_nome', formData.nome);
      sessionStorage.setItem('lead_email', formData.email);
      sessionStorage.setItem('lead_profissao', formData.profissao);
      sessionStorage.setItem('lead_whatsapp', formData.whatsapp);
      sessionStorage.setItem('lead_timestamp', formData.timestamp);

      // Redirecionar para página de obrigado
      window.location.href = 'obrigado.html';

    } catch (error) {
      if (formFeedback) {
        formFeedback.style.display = 'block';
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = '✗ Erro ao processar inscrição. Tente novamente.';
      }
      console.error(error);
    }
  });
}

// Máscara para WhatsApp
const whatsappInput = document.getElementById('whatsapp');
if (whatsappInput) {
  whatsappInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    }

    e.target.value = value;
  });
}

// ========================================
// FAQ ACCORDION
// ========================================
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const isExpanded = question.getAttribute('aria-expanded') === 'true';
    const answer = question.nextElementSibling;

    // Fechar todas as outras
    faqQuestions.forEach(q => {
      if (q !== question) {
        q.setAttribute('aria-expanded', 'false');
        if (q.nextElementSibling) q.nextElementSibling.style.maxHeight = null;
      }
    });

    // Toggle atual
    question.setAttribute('aria-expanded', String(!isExpanded));

    if (!isExpanded) {
      if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
    } else {
      if (answer) answer.style.maxHeight = null;
    }
  });
});

// ========================================
// GALERIA CAROUSEL
// ========================================
const galleryTrack = document.getElementById('galleryTrack');
const prevButton = document.getElementById('galleryPrev');
const nextButton = document.getElementById('galleryNext');

let scrollAmount = 0;
const scrollStep = 420; // largura do item + gap

if (prevButton && galleryTrack) {
  prevButton.addEventListener('click', () => {
    scrollAmount = Math.max(0, scrollAmount - scrollStep);
    galleryTrack.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });
  });
}

if (nextButton && galleryTrack) {
  nextButton.addEventListener('click', () => {
    const maxScroll = galleryTrack.scrollWidth - galleryTrack.clientWidth;
    scrollAmount = Math.min(maxScroll, scrollAmount + scrollStep);
    galleryTrack.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });
  });
}

// Atualizar posição ao arrastar
if (galleryTrack) {
  galleryTrack.addEventListener('scroll', () => {
    scrollAmount = galleryTrack.scrollLeft;
  });
}

// ========================================
// ANIMAÇÕES DE ENTRADA
// ========================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Elementos para animar
document.querySelectorAll('.pillar-card, .topic-item, .gallery-item, .faq-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ========================================
// CONTADOR REGRESSIVO (OPCIONAL)
// ========================================
function updateCountdown() {
  // OBS: data passada no seu código original (2025). Ajuste se precisar.
  const eventDate = new Date('2025-02-26T19:00:00').getTime();
  const now = new Date().getTime();
  const distance = eventDate - now;

  if (distance > 0) {
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    console.log(`Faltam ${days}d ${hours}h ${minutes}m para a aula`);
  }
}

// Atualizar a cada minuto
setInterval(updateCountdown, 60000);
updateCountdown();

// ========================================
// PERFORMANCE: LAZY LOADING IMAGES
// ========================================
if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    // Só troca se existir data-src
    if (img.dataset && img.dataset.src) img.src = img.dataset.src;
  });
} else {
  // Fallback para navegadores antigos
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(script);
}

// ========================================
// ANALYTICS (PLACEHOLDER)
// ========================================
function trackEvent(category, action, label) {
  console.log('Event tracked:', { category, action, label });
  // Aqui você integraria com Google Analytics, Facebook Pixel, etc.
}

// Rastrear cliques nos botões CTA
openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    trackEvent('CTA', 'Click', 'Open Modal');
  });
});

// ========================================
// CONSOLE MESSAGE
// ========================================
console.log('%c🎯 Landing Page - Dra. Adriana', 'font-size: 20px; font-weight: bold; color: #D4AF37;');
console.log('%cDesenvolvido com atenção aos detalhes', 'font-size: 12px; color: #2D1B4E;');
