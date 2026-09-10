// =========================================================
// OUS ACADEMY — shared behavior
// =========================================================
document.addEventListener('DOMContentLoaded', () => {

  /* ---- header scroll state ---- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- mobile nav (professional full-screen overlay) ---- */
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (navToggle && nav) {
    const closeMobileNav = () => {
      nav.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    };
    const openMobileNav = () => {
      nav.classList.add('is-open');
      navToggle.classList.add('is-open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-open');
    };
    navToggle.addEventListener('click', () => {
      if (nav.classList.contains('is-open')) closeMobileNav();
      else openMobileNav();
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) closeMobileNav();
    });
  }

  /* ---- nav dropdown (e.g. OUS Books) ---- */
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(dd => {
    const trigger = dd.querySelector('.nav-dropdown-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dd.classList.contains('is-open');
      dropdowns.forEach(other => { other.classList.remove('is-open'); other.querySelector('.nav-dropdown-trigger')?.setAttribute('aria-expanded', 'false'); });
      if (!isOpen) {
        dd.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
  document.addEventListener('click', (e) => {
    dropdowns.forEach(dd => {
      if (!dd.contains(e.target)) {
        dd.classList.remove('is-open');
        dd.querySelector('.nav-dropdown-trigger')?.setAttribute('aria-expanded', 'false');
      }
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdowns.forEach(dd => {
        dd.classList.remove('is-open');
        dd.querySelector('.nav-dropdown-trigger')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  /* ---- active nav link ---- */
  const page = document.body.getAttribute('data-page');
  if (page) {
    document.querySelectorAll('.nav a[data-page]').forEach(a => {
      if (a.getAttribute('data-page') === page) a.classList.add('active');
    });
  }

  /* ---- footer year ---- */
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---- reveal on scroll ---- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---- hero stars field ---- */
  const starsField = document.querySelector('.hero-stars');
  if (starsField) {
    const w = 1600, h = 700;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.style.width = '100%';
    svg.style.height = '100%';
    let count = 70;
    for (let i = 0; i < count; i++) {
      const c = document.createElementNS(ns, 'circle');
      const x = Math.random() * w;
      const y = Math.random() * (h * 0.75);
      const r = Math.random() * 1.1 + 0.3;
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', r);
      c.setAttribute('fill', '#F3EBD6');
      c.style.opacity = (Math.random() * 0.6 + 0.15).toFixed(2);
      svg.appendChild(c);
    }
    starsField.appendChild(svg);
  }

  /* (decorative wolf-pack horizon line removed) */

  /* ---- course filter tabs ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('[data-course-cat]');
  if (filterBtns.length && courseCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const cat = btn.getAttribute('data-filter');
        courseCards.forEach(card => {
          const match = cat === 'all' || card.getAttribute('data-course-cat') === cat;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* ---- contact form (front-end only placeholder) ---- */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = form.querySelector('.form-status');
      const isRTL = document.documentElement.dir === 'rtl';

      // Honeypot: if this hidden field got filled in, silently drop the submission.
      // Real bots fill every field; real users never see or touch it.
      const honeypot = form.querySelector('#website');
      if (honeypot && honeypot.value.trim() !== '') {
        form.reset();
        return;
      }

      // Minimal client-side validation (server-side validation is still required
      // once this form is wired to a real backend — never trust client input alone).
      if (!form.checkValidity()) {
        if (note) {
          note.textContent = isRTL
            ? 'يرجى تعبئة الحقول المطلوبة بشكل صحيح.'
            : 'Please fill in the required fields correctly.';
          note.style.color = '#b3432b';
        }
        return;
      }

      if (note) {
        note.textContent = isRTL
          ? 'تم استلام رسالتك — سنعاود التواصل خلال ٤٨ ساعة.'
          : 'Message received — our team will reply within 48 hours.';
        note.style.color = '#A9843F';
      }
      form.reset();
    });
  }

  /* ---- back to top ---- */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    const toggleBackToTop = () => backToTop.classList.toggle('is-visible', window.scrollY > 600);
    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- card tilt micro-interaction (desktop pointer devices only) ---- */
  const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canTilt) {
    const tiltTargets = document.querySelectorAll('.offer-card, .book-card, .ref-card, .pillar');
    tiltTargets.forEach(card => {
      let raf = null;
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateY = px * 8;
        const rotateX = -py * 8;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
      });
      card.addEventListener('mouseleave', () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = '';
      });
    });
  }

  /* ---- number count-up for stat blocks (OUS Test section) ---- */
  const statNums = document.querySelectorAll('.test-stat .num');
  if ('IntersectionObserver' in window && statNums.length) {
    const countIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const raw = el.textContent.trim();
        if (/^\d+$/.test(raw)) {
          const target = parseInt(raw, 10);
          const duration = 800;
          let start = null;
          const step = (ts) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            el.textContent = String(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = String(target);
          };
          requestAnimationFrame(step);
        }
        countIo.unobserve(el);
      });
    }, { threshold: 0.6 });
    statNums.forEach(el => countIo.observe(el));
  }

  /* ---- announcement modal (entry promo) ----
     Content is data-driven via data-i18n on the markup itself, so swapping
     what's being promoted later is just an HTML/i18n edit — no JS changes needed.
     Shown once per browser session (sessionStorage), with a short entrance delay. */
  const announceOverlay = document.getElementById('announceOverlay');
  if (announceOverlay) {
    const announceCard = announceOverlay.querySelector('.announce-card');
    const announceClose = document.getElementById('announceClose');
    const announceDismiss = document.getElementById('announceDismiss');
    const announceDownload = document.getElementById('announceDownload');
    const announceExplore = document.getElementById('announceExplore');
    const STORAGE_KEY = 'ousAnnouncementSeen';
    let lastFocused = null;

    const hasSeenAnnouncement = () => {
      try { return sessionStorage.getItem(STORAGE_KEY) === '1'; }
      catch (e) { return false; }
    };
    const markAnnouncementSeen = () => {
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) { /* ignore (private mode, etc.) */ }
    };

    const onAnnounceKeydown = (e) => {
      if (e.key === 'Escape') { closeAnnounce(); return; }
      if (e.key === 'Tab') {
        const focusables = announceCard.querySelectorAll('a[href], button:not([disabled])');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };

    function openAnnounce() {
      if (hasSeenAnnouncement()) return;
      lastFocused = document.activeElement;
      announceOverlay.hidden = false;
      requestAnimationFrame(() => announceOverlay.classList.add('is-open'));
      document.body.style.overflow = 'hidden';
      if (announceClose) announceClose.focus();
      document.addEventListener('keydown', onAnnounceKeydown);
    }

    function closeAnnounce() {
      announceOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onAnnounceKeydown);
      markAnnouncementSeen();
      window.setTimeout(() => { announceOverlay.hidden = true; }, 380);
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    if (announceClose) announceClose.addEventListener('click', closeAnnounce);
    if (announceDismiss) announceDismiss.addEventListener('click', closeAnnounce);
    if (announceDownload) announceDownload.addEventListener('click', closeAnnounce);
    if (announceExplore) announceExplore.addEventListener('click', closeAnnounce);
    announceOverlay.addEventListener('click', (e) => {
      if (e.target === announceOverlay) closeAnnounce();
    });

    window.setTimeout(openAnnounce, 1100);
  }

});
