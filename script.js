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
      console.info('[BlockPanel] Download click:', btn.getAttribute('href'));
    });
  });
})();

// ── Theme Swatch interactivity & Infinite Drag ────────────────
(function initThemeInteractivity() {
  const strip = document.querySelector('.theme-strip');
  if (!strip) return;

  // 01. Clone nodes for infinite effect
  const originalSwatches = [...strip.querySelectorAll('.theme-swatch')];
  originalSwatches.forEach(sw => {
    const clone = sw.cloneNode(true);
    strip.appendChild(clone);
  });

  // Calculate the total width of one full set
  const getLoopWidth = () => {
    const gap = 16; // from css
    const swatchWidth = 160; // from css
    return originalSwatches.length * (swatchWidth + gap);
  };

  let loopWidth = getLoopWidth();
  window.addEventListener('resize', () => { loopWidth = getLoopWidth(); });

  // Drag to scroll state
  let isDown = false;
  let startX;
  let scrollLeft;

  // 02. Seamless wrap logic
  function checkWrap() {
    if (strip.scrollLeft >= loopWidth) {
      strip.scrollLeft -= loopWidth;
    } else if (strip.scrollLeft <= 0) {
      strip.scrollLeft += loopWidth;
    }
  }

  strip.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - strip.offsetLeft;
    scrollLeft = strip.scrollLeft;
    checkWrap(); // Ensure we are in a safe zone before starting
  });

  strip.addEventListener('mouseleave', () => { isDown = false; });
  strip.addEventListener('mouseup', () => { isDown = false; });

  strip.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - strip.offsetLeft;
    const walk = (x - startX) * 2;
    strip.scrollLeft = scrollLeft - walk;
    
    // Wrap during drag
    if (strip.scrollLeft >= loopWidth) {
      strip.scrollLeft -= loopWidth;
      startX = x; // Reset pivot
      scrollLeft = strip.scrollLeft;
    } else if (strip.scrollLeft <= 0) {
      strip.scrollLeft += loopWidth;
      startX = x; // Reset pivot
      scrollLeft = strip.scrollLeft;
    }
  });

  // 03. Auto-scroll logic
  let scrollSpeed = 0.5;
  let animationId;

  function animate() {
    if (!isDown) {
      strip.scrollLeft += scrollSpeed;
      checkWrap();
    }
    animationId = requestAnimationFrame(animate);
  }

  // Handle hover to pause/resume
  strip.addEventListener('mouseenter', () => { scrollSpeed = 0; });
  strip.addEventListener('mouseleave', () => { if (!isDown) scrollSpeed = 0.5; });

  animate();

  // Preview click (on all swatches, original and clones)
   strip.addEventListener('click', (e) => {
     const swatch = e.target.closest('.theme-swatch');
     if (!swatch) return;
     
     // Prevent click if we were dragging
     const currentX = e.pageX - strip.offsetLeft;
     if (isDown || Math.abs(startX - currentX) > 5) return;
     
     const name = swatch.getAttribute('data-name');
     const accentColor = swatch.style.getPropertyValue('--swatch-bg');
     const accentRgb = hexToRgb(accentColor);
     
     // Update theme swapper to reflect this selection
     root.style.setProperty('--accent', accentColor);
     root.style.setProperty('--accent-dim', accentColor);
     root.style.setProperty('--bp-accent', accentColor);
     root.style.setProperty('--bp-accent-rgb', accentRgb);
     root.style.setProperty('--accent-glow', `rgba(${accentRgb}, 0.25)`);
     
     // Highlight the selected swatch
     document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('selected'));
     swatch.classList.add('selected');
     
     console.info('[BlockPanel] Theme selected:', name);
   });

   // Helper to convert hex to RGB
   function hexToRgb(hex) {
     const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
     return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '74, 222, 128';
   }
 })();

// ── Live Theme Swapper ────────────────────────────────────────
(function initThemeSwapper() {
  const container = document.getElementById('theme-swapper');
  if (!container) return;

  const root = document.documentElement;
  const buttons = container.querySelectorAll('.swap-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const accent = btn.getAttribute('data-accent');
      const accentRgb = btn.getAttribute('data-accent-rgb');
      
      // Update global CSS variables
      root.style.setProperty('--accent', accent);
      root.style.setProperty('--accent-dim', accent);
      root.style.setProperty('--bp-accent', accent);
      root.style.setProperty('--bp-accent-rgb', accentRgb);
      root.style.setProperty('--accent-glow', `rgba(${accentRgb}, 0.25)`);
      
      console.info('[BlockPanel] Landing page theme updated:', accent);
    });
  });
})();


// ── Hero Mockup Tab Cycling ───────────────────────────────────
(function initMockupCycler() {
  const panels = ['dashboard', 'console', 'players'];
  const sidebarItems = document.querySelectorAll('.sidebar-item[data-panel]');
  let current = 0;
  let timer = null;

  function showPanel(index) {
    panels.forEach((id, i) => {
      const el = document.getElementById('panel-' + id);
      if (!el) return;
      el.style.display = i === index ? 'flex' : 'none';
    });
    sidebarItems.forEach(item => {
      const isActive = item.getAttribute('data-panel') === panels[index];
      item.classList.toggle('mk-active', isActive);
      item.classList.toggle('active', false);
    });
    // WHY: sync status bar indicator dots with active panel
    document.querySelectorAll('.msb-dot').forEach((dot, i) => {
      dot.classList.toggle('msb-active', i === index);
    });
    current = index;
  }

  function tick() {
    const next = (current + 1) % panels.length;
    showPanel(next);
  }

  // WHY: clicking a sidebar item immediately switches + resets cycle
  sidebarItems.forEach((item, i) => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      clearInterval(timer);
      showPanel(i);
      timer = setInterval(tick, 4000);
    });
  });

  if (sidebarItems.length > 0) {
    timer = setInterval(tick, 4000);
  }
})();

// ── Mockup 3D Tilt on Hover ──────────────────────────────────
(function initMockupTilt() {
  const mockup = document.getElementById('hero-mockup');
  if (!mockup) return;

  // WHY: CSS perspective enables the 3D rotation illusion
  mockup.style.transition = 'transform 0.4s ease';
  mockup.parentElement.style.perspective = '800px';

  mockup.addEventListener('mousemove', (e) => {
    const rect = mockup.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mockup.style.transform =
      `rotateY(${x * 8}deg) rotateX(${-y * 6}deg) scale(1.02)`;
  });

  mockup.addEventListener('mouseleave', () => {
    mockup.style.transform = 'rotateY(0) rotateX(0) scale(1)';
  });
})();

// ── Live-Ticking TPS Stat ────────────────────────────────────
(function initLiveTPS() {
  const tpsEl = document.querySelector(
    '#panel-dashboard .stat-value.green'
  );
  const tpsBar = document.querySelector(
    '#panel-dashboard .mockup-card:first-child .stat-bar-fill'
  );
  if (!tpsEl) return;

  setInterval(() => {
    // WHY: small jitter sells the "live data" illusion
    const val = (19.9 + Math.random() * 0.1).toFixed(1);
    tpsEl.textContent = val;
    if (tpsBar) {
      tpsBar.style.width = (parseFloat(val) / 20 * 100) + '%';
    }
  }, 1500);
})();

// ── Live RAM Telemetry ──────────────────────────────────────
(function initLiveRAM() {
  const ramEl = document.querySelector(
    '#panel-dashboard .mockup-card:nth-child(2) .stat-value'
  );
  const ramBar = document.querySelector(
    '#panel-dashboard .mockup-card:nth-child(2) .stat-bar-fill'
  );
  if (!ramEl || !ramBar) return;

  setInterval(() => {
    // WHY: RAM fluctuates as GC runs or players move
    const val = (3.2 + Math.random() * 0.4).toFixed(1);
    ramEl.textContent = `${val} GB`;
    ramBar.style.width = (parseFloat(val) / 8 * 100) + '%';
  }, 3000);
})();

// ── Console Auto-Typing Simulation ──────────────────────────
(function initConsoleTyping() {
  const inputEl = document.querySelector('.console-input-mock');
  const consoleEl = document.querySelector('.mockup-console-full');
  if (!inputEl || !consoleEl) return;

  const commands = ['/tps', '/list', '/save-all', '/weather clear'];
  let cmdIdx = 0;

  function typeAction() {
    // Only type if the console panel is actually visible/active
    if (consoleEl.offsetParent === null) {
      setTimeout(typeAction, 4000);
      return;
    }

    const cmd = commands[cmdIdx];
    let charIdx = 0;
    inputEl.textContent = '';

    const typeInterval = setInterval(() => {
      inputEl.textContent += cmd[charIdx];
      charIdx++;
      if (charIdx >= cmd.length) {
        clearInterval(typeInterval);
        setTimeout(submitAction, 800);
      }
    }, 100);
  }

  function submitAction() {
    const cmd = inputEl.textContent;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Create new line
    const line = document.createElement('div');
    line.className = 'console-line';
    line.innerHTML = `<span class="cl-time">[${time}]</span> <span class="cl-info">[Server]</span> ${cmd === '/tps' ? 'TPS: 20.0' : cmd === '/list' ? 'Players: 4/20' : 'Command executed.'}`;
    
    // Add to console and scroll
    consoleEl.insertBefore(line, consoleEl.lastElementChild);
    if (consoleEl.children.length > 8) consoleEl.removeChild(consoleEl.firstChild);
    
    inputEl.textContent = '';
    cmdIdx = (cmdIdx + 1) % commands.length;
    setTimeout(typeAction, 8000);
  }

  setTimeout(typeAction, 2000);
})();


// ── Animated Sparkline ───────────────────────────────────────
(function initSparklineAnimation() {
  const svg = document.querySelector('.sparkline');
  if (!svg) return;

  const W = 200;
  const H = 36;
  const POINTS = 20;
  let data = [];

  // WHY: seed with initial data matching the static SVG look
  for (let i = 0; i < POINTS; i++) {
    data.push(8 + Math.random() * 20);
  }

  function buildPath(pts, close) {
    const step = W / (pts.length - 1);
    let d = `M0,${pts[0]}`;
    for (let i = 1; i < pts.length; i++) {
      const cx = (i - 0.5) * step;
      const py = pts[i - 1];
      const cy = pts[i];
      d += ` C${cx},${py} ${cx},${cy} ${i * step},${cy}`;
    }
    if (close) d += ` L${W},${H} L0,${H} Z`;
    return d;
  }

  const paths = svg.querySelectorAll('path');
  if (paths.length < 2) return;

  setInterval(() => {
    data.shift();
    data.push(8 + Math.random() * 20);
    paths[0].setAttribute('d', buildPath(data, false));
    paths[1].setAttribute('d', buildPath(data, true));
  }, 2000);
})();

// ── Live Uptime Counter ──────────────────────────────────────
(function initLiveUptime() {
  const uptimes = [
    document.getElementById('mk-uptime-1'),
    document.getElementById('mk-uptime-2')
  ];
  let hours = 4;
  let minutes = 22;

  setInterval(() => {
    minutes++;
    if (minutes >= 60) {
      minutes = 0;
      hours++;
    }
    const str = `${hours}h ${minutes}m`;
    uptimes.forEach(el => {
      if (el) {
        if (el.id === 'mk-uptime-1') el.textContent = `↑ ${str}`;
        else el.textContent = str;
      }
    });
  }, 60000); // WHY: updating every minute is realistic for an uptime display
})();

