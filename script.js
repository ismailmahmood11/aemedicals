/* AE Medicals – Animations & interactivity */
gsap.registerPlugin(ScrollTrigger);

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

// Stagger hero text
const tlHero = gsap.timeline({ defaults: { ease: 'power3.out' } });

tlHero
  .fromTo(heroLines[0], { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.8 })
  .fromTo(heroDesc, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
  .fromTo(heroActions, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');

// Scroll indicator fade
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

/* ----- Blog: Read more toggle ----- */
document.querySelectorAll('.blog-readmore').forEach(btn => {
  btn.addEventListener('click', () => {
    const article = btn.closest('[data-blog]');
    if (!article) return;

    const extra = article.querySelector('.blog-extra');
    if (!extra) return;

    const isOpen = extra.classList.contains('is-open');

    if (isOpen) {
      // Collapse with animation
      extra.style.maxHeight = '0px';
      extra.classList.remove('is-open');
      btn.textContent = 'Read more';
      btn.setAttribute('aria-expanded', 'false');
      extra.setAttribute('aria-hidden', 'true');
      return;
    }

    // Expand with animation
    extra.classList.add('is-open');
    btn.textContent = 'Read less';
    btn.setAttribute('aria-expanded', 'true');
    extra.setAttribute('aria-hidden', 'false');
    extra.style.maxHeight = `${extra.scrollHeight}px`;
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

/* ----- Blog: stagger ----- */
const blogItems = document.querySelectorAll('[data-blog]');
gsap.fromTo(blogItems, { y: 40, opacity: 0 }, {
  y: 0,
  opacity: 1,
  duration: 0.7,
  stagger: 0.1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.blog-layout',
    start: 'top 82%',
    toggleActions: 'play none none none'
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
}

/* ----- Parallax orbs in hero ----- */
const orbs = document.querySelectorAll('.hero-orb');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const rate = 0.15;
  orbs.forEach((orb, i) => {
    const speed = (i + 1) * rate;
    orb.style.transform = `translateY(${scrolled * speed * 0.5}px)`;
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

/* ----- Reduce motion preference ----- */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.globalTimeline.timeScale(0);
  document.documentElement.style.setProperty('--ease-out-expo', 'linear');
}
