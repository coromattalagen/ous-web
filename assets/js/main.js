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

  /* ---- mobile nav ---- */
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        nav.style.cssText = 'display:flex;flex-direction:column;position:fixed;top:0;inset-inline:0;bottom:0;background:#1B1A18;padding:120px 40px 40px;gap:28px;z-index:99;';
      } else {
        nav.style.cssText = '';
      }
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      nav.style.cssText = '';
    }));
  }

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
      if (note) {
        note.textContent = document.documentElement.dir === 'rtl'
          ? 'تم استلام رسالتك — سنعاود التواصل خلال ٤٨ ساعة.'
          : 'Message received — our team will reply within 48 hours.';
        note.style.color = '#A9843F';
      }
      form.reset();
    });
  }

});
