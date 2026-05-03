/* ============================================================
   SYNAPSE NEUROBAR — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initSmoothScroll();
  initRevealObserver();
  initMoleculeObserver();
  initHeroParallax();
  initVideoBoomerang();
  initCoverflow();
});

/* ================================================================
   NAVIGATION
   ================================================================ */
function initNav() {
  const nav     = document.getElementById('nav');
  const toggle  = document.getElementById('navToggle');
  let lastY     = 0;
  let ticking   = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        nav.classList.toggle('nav--scrolled', y > 50);
        // Hide nav on fast downscroll past 200px, reveal on upscroll
        if (y > 200) {
          nav.classList.toggle('nav--hidden', y > lastY + 4);
          if (y < lastY) nav.classList.remove('nav--hidden');
        }
        lastY = y;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Mobile toggle
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('nav--open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  // Close mobile nav on outside click
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('nav--open') && !nav.contains(e.target)) {
      nav.classList.remove('nav--open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ================================================================
   SMOOTH SCROLL
   ================================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const hash = link.getAttribute('href');
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();

      const navHeight = document.getElementById('nav').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });

      // Close mobile nav if open
      const nav = document.getElementById('nav');
      nav.classList.remove('nav--open');
      const toggle = document.getElementById('navToggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ================================================================
   SCROLL REVEAL — IntersectionObserver
   ================================================================ */
function initRevealObserver() {
  const elements = document.querySelectorAll('.reveal');

  // Apply stagger delays from data-delay attribute
  elements.forEach(el => {
    const delay = el.dataset.delay || '0';
    el.style.setProperty('--delay', delay + 'ms');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ================================================================
   MOLECULE FADE — hero molecule fades on hero exit
   ================================================================ */
function initMoleculeObserver() {
  const molecule = document.getElementById('heroMolecule');
  const hero     = document.getElementById('hero');
  if (!molecule || !hero) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      molecule.classList.toggle('faded', !entry.isIntersecting);
    });
  }, { threshold: 0.05 });

  observer.observe(hero);
}

/* ================================================================
   HERO PARALLAX
   ================================================================ */
function initHeroParallax() {
  const content  = document.querySelector('.hero__content');
  const molecule = document.getElementById('heroMolecule');
  const blob     = document.querySelector('.blob-wrap');
  let ticking    = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;

        if (content) {
          content.style.transform = `translateY(${y * 0.28}px)`;
          content.style.opacity   = String(Math.max(0, 1 - y / 500));
        }
        if (molecule) {
          molecule.style.transform = `translateY(calc(-50% + ${y * 0.12}px))`;
        }
        if (blob) {
          blob.style.transform = `translateY(${y * 0.15}px)`;
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ================================================================
   VIDEO BOOMERANG
   ================================================================ */
function initVideoBoomerang() {
  const video = document.getElementById('heroVideo');
  const blob  = document.getElementById('heroBlob');
  if (!video) return;

  // If the browser can't load the video source, keep blob visible
  video.addEventListener('error', () => {
    video.style.display = 'none';
  }, { once: true });

  // Try to load — if no src (client hasn't provided video yet) nothing happens
  video.addEventListener('canplaythrough', () => {
    // Reveal video, hide blob
    video.classList.add('loaded');
    if (blob) blob.classList.add('hidden');

    startBoomerang(video);
  }, { once: true });

  // Attempt load
  video.load();
}

function startBoomerang(video) {
  let direction = 1;   // 1 = forward, -1 = reverse
  const STEP    = 1 / 30; // ~30fps step
  let rafId;
  let lastTime  = 0;
  const INTERVAL = 1000 / 30;

  function loop(timestamp) {
    if (timestamp - lastTime < INTERVAL) {
      rafId = requestAnimationFrame(loop);
      return;
    }
    lastTime = timestamp;

    video.currentTime += direction * STEP;

    const near = 0.08;
    if (video.currentTime >= video.duration - near) {
      direction = -1;
    } else if (video.currentTime <= near) {
      direction = 1;
    }

    rafId = requestAnimationFrame(loop);
  }

  video.pause();
  video.removeAttribute('loop');
  rafId = requestAnimationFrame(loop);

  // Stop boomerang when hero is fully out of view
  const hero = document.getElementById('hero');
  if (hero) {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!rafId) rafId = requestAnimationFrame(loop);
        } else {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
    }, { threshold: 0.01 }).observe(hero);
  }
}

/* ================================================================
   COVERFLOW CAROUSEL
   ================================================================ */
function initCoverflow() {
  const track   = document.getElementById('coverflowTrack');
  if (!track) return;

  const cards   = Array.from(track.querySelectorAll('.cf-card'));
  const dots    = Array.from(document.querySelectorAll('.cf-dot'));
  const btnPrev = document.getElementById('cfPrev');
  const btnNext = document.getElementById('cfNext');
  const total   = cards.length;

  let current  = 0;
  let isDrag   = false;
  let startX   = 0;
  let dragDelta = 0;
  const THRESHOLD = 50;

  // Initial render
  updatePositions(current);

  // ── Button navigation ───────────────────────────────────────
  if (btnPrev) btnPrev.addEventListener('click', () => advance(-1));
  if (btnNext) btnNext.addEventListener('click', () => advance(1));

  // ── Dot navigation ──────────────────────────────────────────
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      if (!isNaN(idx)) { current = idx; updatePositions(current); }
    });
  });

  // ── Keyboard ────────────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    const carta = document.getElementById('carta');
    if (!carta) return;
    const rect = carta.getBoundingClientRect();
    // Only respond when the carta section is visible
    if (rect.top > window.innerHeight || rect.bottom < 0) return;

    if (e.key === 'ArrowRight') advance(1);
    if (e.key === 'ArrowLeft')  advance(-1);
  });

  // ── Mouse drag ──────────────────────────────────────────────
  track.addEventListener('mousedown', (e) => {
    isDrag   = true;
    startX   = e.clientX;
    dragDelta = 0;
    track.classList.add('dragging');
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDrag) return;
    dragDelta = e.clientX - startX;
  });

  window.addEventListener('mouseup', () => {
    if (!isDrag) return;
    isDrag = false;
    track.classList.remove('dragging');
    if (Math.abs(dragDelta) > THRESHOLD) {
      advance(dragDelta < 0 ? 1 : -1);
    }
    dragDelta = 0;
  });

  // ── Touch ────────────────────────────────────────────────────
  let touchStartX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > THRESHOLD - 10) {
      advance(delta < 0 ? 1 : -1);
    }
  }, { passive: true });

  // ── Auto-advance (optional, pauses on interaction) ──────────
  let autoTimer = setInterval(() => advance(1), 5000);

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => advance(1), 5000);
  }

  [btnPrev, btnNext].forEach(b => b && b.addEventListener('click', resetAuto));
  track.addEventListener('mousedown', () => clearInterval(autoTimer));
  track.addEventListener('touchstart', () => clearInterval(autoTimer), { passive: true });

  // ── Core functions ───────────────────────────────────────────
  function advance(dir) {
    current = (current + dir + total) % total;
    updatePositions(current);
  }

  function updatePositions(idx) {
    cards.forEach((card, i) => {
      // Remove all position classes
      card.classList.remove(
        'cf-card--center',
        'cf-card--left', 'cf-card--right',
        'cf-card--far-left', 'cf-card--far-right'
      );

      const offset = i - idx;

      if (offset === 0)       card.classList.add('cf-card--center');
      else if (offset === -1) card.classList.add('cf-card--left');
      else if (offset === 1)  card.classList.add('cf-card--right');
      else if (offset < -1)   card.classList.add('cf-card--far-left');
      else                    card.classList.add('cf-card--far-right');

      // ARIA: announce current card to screen readers
      card.setAttribute('aria-hidden', String(offset !== 0));
    });

    updateDots(idx);
  }

  function updateDots(idx) {
    dots.forEach((dot, i) => {
      const active = i === idx;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-selected', String(active));
    });
  }
}
