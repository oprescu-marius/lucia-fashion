/* ============================================
   LUCIA FASHION — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ── Custom Cursor ─────────────────────────── */
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');

  if (cursor && follower) {
    let fx = 0, fy = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', (e) => {
      cx = e.clientX; cy = e.clientY;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
    });

    // Follower lags behind
    const animateFollower = () => {
      fx += (cx - fx) * 0.12;
      fy += (cy - fy) * 0.12;
      follower.style.left = fx + 'px';
      follower.style.top = fy + 'px';
      requestAnimationFrame(animateFollower);
    };
    animateFollower();

    // Hover effect on interactive elements
    document.querySelectorAll('a, button, .filter-btn, .collection-card, .product-card, .value-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      });
    });
  }

  /* ── Navbar Scroll ─────────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Active Nav Link ───────────────────────── */
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Scroll Reveal ─────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const show = (el) => el.classList.add('visible');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            show(e.target);
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

      revealEls.forEach(el => io.observe(el));

      // Plasă de siguranță: dacă observerul nu declanșează din orice motiv,
      // afișează tot conținutul după 2.5s ca să nu rămână secțiuni goale.
      setTimeout(() => revealEls.forEach(show), 2500);
    } else {
      // Browser fără IntersectionObserver — afișează tot direct.
      revealEls.forEach(show);
    }
  }

  /* ── Filter Buttons (Colecții page) ─────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.dataset.filter;
        productCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = '';
            setTimeout(() => card.style.opacity = '1', 10);
          } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 300);
          }
        });
      });
    });
  }

  /* ── Counter Animation (Stats) ─────────────── */
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterIO.observe(c));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    const from = 0;

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(from + (target - from) * eased) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }

  /* ── Gallery stagger reveal (colecții/tablouri) ──
     Aplică intrare fade-up decalată pe copiii unui container.
     Auto: orice element cu [data-stagger]. Manual: window.luciaStagger(el)
     (pentru grile construite din JS, ex. tablouri.html). */
  const reduceMotionGallery = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.luciaStagger = function (container) {
    if (!container) return;
    const items = Array.from(container.children);
    if (!items.length) return;

    // Curățare completă — elementul revine la stilurile lui normale
    const finish = (el) => {
      el.classList.remove('g-reveal', 'g-in');
      el.style.transitionDelay = '';
    };

    if (reduceMotionGallery || !('IntersectionObserver' in window)) return;

    const gio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('g-in');
        setTimeout(() => finish(en.target), 900);
        gio.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });

    items.forEach((el, i) => {
      el.classList.add('g-reveal');
      el.style.transitionDelay = (i % 6) * 70 + 'ms';
      gio.observe(el);
    });

    // Plasă de siguranță: nimic nu rămâne ascuns după 3s
    setTimeout(() => items.forEach((el) => {
      if (el.classList.contains('g-reveal')) {
        el.classList.add('g-in');
        setTimeout(() => finish(el), 900);
      }
    }), 3000);
  };

  document.querySelectorAll('[data-stagger]').forEach(window.luciaStagger);

  /* ── Contact Form ──────────────────────────── */
  // Handlerul complet pentru contact form este în contact.html
  // main.js nu intervine pentru a evita conflicte

  /* ── Copyright year dinamic ────────────────── */
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Gold shimmer pe titluri ───────────────────
     Aplică automat clasa .shimmer-title (definită în style.css,
     respectiv inline în poveste.html) pe titlurile principale. */
  document.querySelectorAll('h1, .section-title, .featured-gallery-header h2, .lenjerii-preview-text h2')
    .forEach(el => el.classList.add('shimmer-title'));

  /* ── Smooth page transitions ───────────────── */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion) {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      // Excludem mailto, tel, _blank si ancore
      if (
        !href.startsWith('#') &&
        !href.startsWith('mailto') &&
        !href.startsWith('tel') &&
        link.getAttribute('target') !== '_blank'
      ) {
        link.addEventListener('click', function (e) {
          // IMPORTANT: href-ul se citește LA CLICK, nu din closure-ul de la
          // încărcare — unele linkuri își schimbă href-ul dinamic (ex. butonul
          // „Comandă acest tablou" din lightbox-ul tablouri.html, care adaugă
          // ?subiect=Tablou&tablou=<nume>). Cu valoarea veche se pierdeau parametrii.
          const dest = link.getAttribute('href');
          e.preventDefault();
          document.body.style.opacity = '0';
          document.body.style.transition = 'opacity 0.22s ease';
          setTimeout(() => window.location = dest, 200);
        });
      }
    });

    // Fade in on load — cu plasă de siguranță ca pagina să nu rămână albă
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    const showBody = () => { document.body.style.opacity = '1'; };
    window.addEventListener('load', showBody);
    // Fallback: dacă 'load' întârzie sau nu se declanșează, afișăm oricum
    setTimeout(showBody, 1200);
  }

})();

/* ── Mobile Hamburger Menu ─────────────────── */
(function() {
  const hamburger = document.querySelector('.nav-hamburger');
  const overlay = document.querySelector('.nav-mobile-overlay');
  const closeBtn = document.querySelector('.nav-mobile-close');

  if (!hamburger || !overlay) return;

  function openMenu() {
    hamburger.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Închide meniul când se apasă pe un link
  overlay.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  // Închide la tasta Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ── Buton „Înapoi sus" ───────────────────────
   Injectat din JS (stil + element), ca să funcționeze pe toate
   paginile fără modificări de HTML — inclusiv poveste.html. */
(function () {
  var style = document.createElement('style');
  style.textContent =
    '.back-to-top{position:fixed;right:1.4rem;bottom:1.4rem;width:46px;height:46px;border-radius:50%;' +
      'background:rgba(61,26,92,0.92);border:1px solid rgba(201,168,112,0.5);color:#C9A86C;' +
      'display:flex;align-items:center;justify-content:center;padding:0;z-index:950;' +
      'opacity:0;visibility:hidden;transform:translateY(12px);' +
      'transition:opacity .35s ease,transform .35s ease,visibility .35s,background .25s,border-color .25s;' +
      'box-shadow:0 6px 24px rgba(13,13,13,0.35);}' +
    '.back-to-top.show{opacity:1;visibility:visible;transform:translateY(0);}' +
    '.back-to-top:hover{background:rgba(61,26,92,1);border-color:#C9A86C;transform:translateY(-2px);}' +
    '.back-to-top:active{transform:translateY(0) scale(0.94);}' +
    '@media (max-width:600px){.back-to-top{right:1rem;bottom:1rem;width:42px;height:42px;}}' +
    '@media (prefers-reduced-motion: reduce){.back-to-top{transition:opacity .01ms,visibility .01ms;transform:none;}}';
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Înapoi sus');
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
    '<path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" stroke="currentColor" stroke-width="1.4" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(btn);

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  var toggle = function () {
    btn.classList.toggle('show', window.scrollY > 600);
  };
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
})();
/* sfârșit main.js */
