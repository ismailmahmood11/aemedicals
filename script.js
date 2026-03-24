/* AE Medicals – Animations & interactivity */
(function () {
  'use strict';
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- Page transitions ----- */
  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(overlay, document.body.firstChild);

  function getPageId(pathname) {
    const p = (pathname || '/').replace(/\/$/, '') || '/';
    return p === '/' || p.endsWith('index.html') ? 'index' : p.replace(/^\//, '').split('.')[0];
  }

  function handlePageTransition(e) {
    if (prefersReducedMotion) return;
    const a = e.target.closest('a');
    if (!a || !a.href || a.target === '_blank') return;
    const href = a.getAttribute('href');
    if (!href || href === '#' || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    try {
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      const currentId = getPageId(location.pathname);
      const targetId = getPageId(url.pathname);
      if (currentId === targetId) return;
      e.preventDefault();
      const targetUrl = a.href;
      overlay.classList.add('is-visible');
      gsap.fromTo(overlay, { opacity: 0 }, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => { location.href = targetUrl; }
      });
    } catch (_) {}
  }

  document.addEventListener('click', handlePageTransition, true);

  if (prefersReducedMotion) {
    overlay.style.opacity = '0';
  } else {
    gsap.fromTo(overlay, { opacity: 1 }, {
      opacity: 0,
      duration: 0.5,
      delay: 0.1,
      ease: 'power2.out',
      onComplete: () => overlay.classList.remove('is-visible')
    });
  }

/* ----- Hero timeline ----- */
const heroLines = document.querySelectorAll('.hero-title .line');
const heroDesc = document.querySelector('.hero-desc');
const heroActions = document.querySelector('.hero-actions');

function wrapChars(el) {
  if (!el) return;
  const text = el.textContent;
  el.innerHTML = text.replace(/\S/g, '<span class="char">$&</span>');
  return el.querySelectorAll('.char');
}

function wrapWords(el) {
  if (!el) return;
  const text = el.textContent;
  el.innerHTML = text.split(/\s+/).map(w => `<span class="word"><span>${w}</span></span>`).join(' ');
  return el.querySelectorAll('.word span');
}

// Stagger hero text (index page only)
if (document.querySelector('.hero')) {
  const tlHero = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tlHero
    .fromTo(heroLines[0], { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.8 })
    .fromTo(heroDesc, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
    .fromTo(heroActions, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
}

// Scroll indicator fade (index page only)
if (document.querySelector('.hero-scroll')) {
  gsap.to('.hero-scroll', {
  opacity: 0,
  scrollTrigger: {
    trigger: '.hero',
    start: 'bottom 80%',
    end: 'bottom 20%',
    scrub: 0.5
  }
});

/* ----- Reveal on scroll ----- */
const revealTargets = document.querySelectorAll('.reveal-text');
revealTargets.forEach(el => {
  if (el.closest('.hero-content')) return;
  if (el.closest('[data-service], [data-product], [data-strength]')) return;
  gsap.fromTo(el, { y: 60, opacity: 0 }, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      end: 'top 50%',
      toggleActions: 'play none none none'
    }
  });
});

/* ----- Stats: count up when in view ----- */
const statCards = document.querySelectorAll('[data-stat]');
statCards.forEach(card => {
  const valueEl = card.querySelector('.stat-value');
  const target = valueEl?.getAttribute('data-count');
  if (!target || !valueEl) return;

  const num = parseInt(target, 10);
  const obj = { val: 0 };

  ScrollTrigger.create({
    trigger: card,
    start: 'top 88%',
    onEnter: () => {
      gsap.to(obj, {
        val: num,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => { valueEl.textContent = Math.round(obj.val); }
      });
    },
    once: true
  });
});

/* ----- Strength cards: stagger and lift ----- */
const strengthCards = document.querySelectorAll('[data-strength]');
gsap.fromTo(strengthCards, { y: 80, opacity: 0 }, {
  y: 0,
  opacity: 1,
  duration: 0.8,
  stagger: 0.15,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.strengths-grid',
    start: 'top 80%',
    end: 'top 45%',
    toggleActions: 'play none none none'
  }
});

/* ----- Service cards: stagger ----- */
const serviceCards = document.querySelectorAll('[data-service]');
gsap.fromTo(serviceCards, { y: 50, opacity: 0 }, {
  y: 0,
  opacity: 1,
  duration: 0.7,
  stagger: 0.08,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.services-grid',
    start: 'top 82%',
    toggleActions: 'play none none none'
  }
});

/* ----- Product cards: stagger ----- */
const productsShowcase = document.querySelector('.products-showcase');
if (productsShowcase) {
  const homeProductCards = productsShowcase.querySelectorAll('[data-product]');
  gsap.fromTo(homeProductCards, { y: 50, opacity: 0 }, {
    y: 0,
    opacity: 1,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: productsShowcase,
      start: 'top 82%',
      toggleActions: 'play none none none'
    }
  });
}

document.querySelectorAll('.products-subsection').forEach(subsection => {
  const cards = subsection.querySelectorAll('[data-product]');
  if (cards.length) {
    gsap.fromTo(cards, { y: 40, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.05,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: subsection,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  }
});

/* ----- Magnetic effect (desktop only – skip on touch) ----- */
const prefersTouch = window.matchMedia('(pointer: coarse)').matches;
if (!prefersTouch) {
  const magneticEls = document.querySelectorAll('[data-magnetic]');
  magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
      gsap.to(el, { x, y, duration: 0.35, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
    });
  });

  /* ----- Proximity effect: scale/lift when cursor near cards ----- */
  const proximityEls = document.querySelectorAll('[data-product], [data-service], [data-strength]');
  const PROX_RADIUS = 140;
  const PROX_SCALE = 1.03;
  const PROX_LIFT = 4;

  let rafId = null;
  document.addEventListener('mousemove', (e) => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const mx = e.clientX;
      const my = e.clientY;
      proximityEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const d = Math.hypot(dx, dy);
        const t = Math.max(0, 1 - d / PROX_RADIUS);
        const scale = 1 + (PROX_SCALE - 1) * t;
        const lift = -PROX_LIFT * t;
        gsap.to(el, {
          scale,
          y: lift,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: true
        });
      });
      rafId = null;
    });
  });
  document.addEventListener('mouseleave', () => {
    proximityEls.forEach(el => {
      gsap.to(el, { scale: 1, y: 0, duration: 0.35, ease: 'power2.out' });
    });
  });
}

/* ----- Parallax orbs and hero image (index page only) ----- */
const heroSection = document.querySelector('.hero');
if (heroSection) {
  const orbs = heroSection.querySelectorAll('.hero-orb');
  const heroImage = heroSection.querySelector('.hero-image');
  const heroGradient = heroSection.querySelector('.hero-gradient');

  ScrollTrigger.create({
    trigger: heroSection,
    start: 'top top',
    end: 'bottom top',
    scrub: 0.8,
    onUpdate: (self) => {
      const progress = self.progress;
      const y = progress * 80;
      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 0.12;
        orb.style.transform = `translateY(${y * speed}px)`;
      });
      if (heroImage) heroImage.style.transform = `translateY(${y * 0.25}px) scale(${1.1 * (1 + progress * 0.02)})`;
      if (heroGradient) heroGradient.style.opacity = String(1 - progress * 0.3);
    }
  });
}

/* ----- Section headers: scrub scale/fade on scroll ----- */
document.querySelectorAll('.section-header').forEach(header => {
  gsap.fromTo(header, { opacity: 0.6, scale: 0.98 }, {
    opacity: 1,
    scale: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: header,
      start: 'top 90%',
      end: 'top 50%',
      scrub: 0.6
    }
  });
});

/* ----- Mobile menu ----- */
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navCta = document.querySelector('.nav-cta');

let menuScrollLock = 0;

function closeMenu() {
  document.body.classList.remove('menu-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  // Always restore scroll, even when the stored scroll position is 0.
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  window.scrollTo(0, menuScrollLock);
  menuScrollLock = 0;
}

function openMenu() {
  menuScrollLock = window.scrollY || window.pageYOffset;
  document.body.classList.add('menu-open');
  menuToggle?.setAttribute('aria-expanded', 'true');
  document.body.style.position = 'fixed';
  document.body.style.top = `-${menuScrollLock}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  gsap.fromTo(navLinks?.children || [], { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.06, ease: 'power2.out' });
  if (navCta) gsap.fromTo(navCta, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, delay: 0.2 });
}

menuToggle?.addEventListener('click', () => {
  if (document.body.classList.contains('menu-open')) {
    closeMenu();
  } else {
    openMenu();
  }
});

document.querySelector('.nav-overlay')?.addEventListener('click', closeMenu);
document.querySelectorAll('.nav-links a, .nav-cta').forEach(link => {
  link.addEventListener('click', closeMenu);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

/* When menu is open, body is position:fixed so no scroll; no need to close on scroll */

/* ----- Smooth scroll for anchor links ----- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id === '#') return;
    e.preventDefault();
    const target = document.querySelector(id);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ----- Contact form ----- */
const contactForm = document.getElementById('contact-form');
contactForm?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const btn = this.querySelector('.btn-submit');
  const originalText = btn?.textContent;
  if (btn) {
    btn.textContent = 'Sending…';
    btn.disabled = true;
  }
  try {
    const res = await fetch(this.action, {
      method: 'POST',
      body: new FormData(this),
      headers: { Accept: 'application/json' }
    });
    const data = await res.json().catch(() => ({}));
    const success = res.ok && (data.ok === true || data.success === true || !data.error);
    if (success) {
    if (btn) {
      btn.textContent = 'Thanks — we’ll be in touch!';
      btn.style.background = 'var(--accent)';
    }
    this.reset();
    } else {
      throw new Error(data.error || data.message || 'Something went wrong');
    }
  } catch (err) {
    if (btn) {
      btn.textContent = 'Try again or email us directly';
    }
  }
  setTimeout(() => {
      if (btn) {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
      }
    }, 3000);
});

  /* ----- Product card image fallback (products page) ----- */
  const productCardMedia = document.querySelectorAll('.product-card-media img');
  const iconSvg = '<svg class="product-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2v4M14 2v4M6 8h12l-1 12H7L6 8z"/></svg>';
  productCardMedia.forEach(img => {
    const media = img.parentElement;
    if (!media || !media.classList.contains('product-card-media')) return;
    if (!media.querySelector('.product-card-icon')) {
      media.insertAdjacentHTML('beforeend', iconSvg);
    }
    img.addEventListener('error', () => media.classList.add('icon-fallback'));
  });

  /* ----- Reduce motion preference ----- */
  if (prefersReducedMotion) {
    gsap.globalTimeline.timeScale(0);
    document.documentElement.style.setProperty('--ease-out-expo', 'linear');
  } else {
    ScrollTrigger.refresh();
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
})();
