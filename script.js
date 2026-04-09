// [TRACE: ARCHITECTURE.md] — BlockPanel landing page interactions

'use strict';

// ── Nav scroll state ──────────────────────────────────────────
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ── Mobile menu toggle ────────────────────────────────────────
(function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu   = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close menu when a link is clicked
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    });
  });
})();

// ── Scroll reveal ─────────────────────────────────────────────
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback: show all immediately
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();

// ── Active nav link highlighting ──────────────────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile-menu a');
  if (!sections.length || !navLinks.length) return;

  function updateActive() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${current}`);
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();

// ── Console typing animation loop ─────────────────────────────
(function initConsoleAnimation() {
  const lines = [
    { time: '12:01:32', level: 'INFO', cls: 'cl-info',  text: 'Server Online' },
    { time: '12:03:14', level: 'INFO', cls: 'cl-info',  text: 'Ryan joined the game' },
    { time: '12:08:47', level: 'WARN', cls: 'cl-warn',  text: 'Saving chunks...' },
    { time: '12:22:09', level: 'INFO', cls: 'cl-info',  text: 'Entities: 204' },
    { time: '12:31:05', level: 'INFO', cls: 'cl-info',  text: 'Composer joined the game' },
    { time: '12:35:22', level: 'INFO', cls: 'cl-info',  text: 'Overworld ticking at 20 TPS' },
    { time: '12:41:10', level: 'WARN', cls: 'cl-warn',  text: 'Low disk space warning' },
    { time: '12:55:00', level: 'INFO', cls: 'cl-info',  text: 'Auto-backup completed' },
  ];

  const console_ = document.querySelector('.mockup-console');
  if (!console_) return;

  let lineIndex = 0;

  function buildLine(lineData, isLast) {
    const div = document.createElement('div');
    div.className = 'console-line' + (isLast ? ' typing' : '');

    const time = document.createElement('span');
    time.className = 'cl-time';
    time.textContent = lineData.time;

    const level = document.createElement('span');
    level.className = lineData.cls;
    level.textContent = lineData.level;

    const text = document.createTextNode(' ' + lineData.text);

    div.appendChild(time);
    div.appendChild(document.createTextNode(' '));
    div.appendChild(level);
    div.appendChild(text);

    if (isLast) {
      const cursor = document.createElement('span');
      cursor.className = 'cursor-blink';
      cursor.textContent = '▋';
      div.appendChild(cursor);
    }

    return div;
  }

  function tickConsole() {
    const visibleLines = console_.querySelectorAll('.console-line');
    // Remove old cursor from previous last line
    visibleLines.forEach(l => {
      const cursor = l.querySelector('.cursor-blink');
      if (cursor) cursor.remove();
      l.classList.remove('typing');
    });

    // Add new line
    const line = lines[lineIndex % lines.length];
    lineIndex++;

    console_.appendChild(buildLine(line, true));

    // Keep 4 lines max
    while (console_.children.length > 4) {
      console_.removeChild(console_.firstChild);
    }

    setTimeout(tickConsole, 2200 + Math.random() * 1000);
  }

  setTimeout(tickConsole, 3000);
})();

// ── Smooth anchor scroll with offset ──────────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const offset = 72; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ── Download click tracking (console log only — no analytics) ──
(function initDownloadTracking() {
  const dlButtons = [
    document.getElementById('nsis-dl'),
    document.getElementById('msi-dl'),
    document.getElementById('hero-download-btn'),
  ];

  dlButtons.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      // Only log for direct download links, not internal anchor navigation
      if (btn.hasAttribute('download')) {
        console.info('[BlockPanel] Download initiated:', btn.getAttribute('href'));
      }
    });
  });
})();
