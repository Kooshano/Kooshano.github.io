const titleElement = document.querySelector('.title');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navInner = document.querySelector('.nav-inner');
const underline = document.querySelector('.nav-underline');
const themeToggle = document.getElementById('themeToggle');

function runTypewriter() {
  if (!titleElement) return;
  const text = 'Kooshan Maleki';
  titleElement.textContent = '';
  let index = 0;

  const tick = () => {
    if (index < text.length) {
      titleElement.textContent += text.charAt(index);
      index += 1;
      setTimeout(tick, 85);
    }
  };

  tick();
}

function swapThemeImages(mode) {
  document
    .querySelectorAll('img[data-src-dark], img[data-src-light], img[data-dark], img[data-light]')
    .forEach((img) => {
      const darkSrc = img.getAttribute('data-src-dark') || img.getAttribute('data-dark');
      const lightSrc = img.getAttribute('data-src-light') || img.getAttribute('data-light');
      const nextSrc = mode === 'dark' ? darkSrc : lightSrc;
      if (nextSrc) img.setAttribute('src', nextSrc);
    });
}

function applyTheme(mode) {
  document.body.setAttribute('data-theme', mode);
  swapThemeImages(mode);
  if (themeToggle) {
    themeToggle.textContent = mode === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute(
      'aria-label',
      mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
    );
  }
}

function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));

  themeToggle?.addEventListener('click', () => {
    const next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });
}

function toggleMobileNav() {
  if (!navLinks || !navToggle) return;
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
}

function closeMobileNav() {
  if (!navLinks || !navToggle) return;
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}

function updateUnderline(link) {
  if (!link || !underline || !navInner) return;
  const linkRect = link.getBoundingClientRect();
  const navRect = navInner.getBoundingClientRect();
  underline.style.width = `${linkRect.width}px`;
  underline.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
  underline.style.opacity = '1';
}

function initNavigation() {
  if (!navLinks) return;

  navToggle?.addEventListener('click', toggleMobileNav);

  const sections = [...document.querySelectorAll('section[id]')];
  const navAnchors = [...document.querySelectorAll('.nav-link')];
  const trackedSections = sections.filter((section) =>
    navAnchors.some((a) => a.getAttribute('href') === `#${section.id}`)
  );

  navAnchors.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
      closeMobileNav();
    });
  });

  const setActive = () => {
    const offset = 120;
    const scrollBottom = window.scrollY + window.innerHeight;
    let current = trackedSections[0];

    trackedSections.forEach((section) => {
      const top = section.offsetTop - offset;
      if (window.scrollY >= top) current = section;
      if (scrollBottom >= document.body.scrollHeight - 10) {
        current = trackedSections[trackedSections.length - 1];
      }
    });

    navAnchors.forEach((a) => a.classList.remove('active'));

    const active = current
      ? navAnchors.find((a) => a.getAttribute('href') === `#${current.id}`)
      : null;
    if (active) {
      active.classList.add('active');
      if (window.innerWidth > 980) updateUnderline(active);
    }
  };

  window.addEventListener('scroll', setActive, { passive: true });
  window.addEventListener('resize', () => {
    const active = document.querySelector('.nav-link.active');
    if (active && window.innerWidth > 980) updateUnderline(active);
  });

  setActive();
}

function initAccordions() {
  document.querySelectorAll('.accordion-btn').forEach((btn) => {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.accordion');
      if (!wrapper) return;
      const nextState = !wrapper.classList.contains('active');
      wrapper.classList.toggle('active', nextState);
      btn.setAttribute('aria-expanded', String(nextState));
    });
  });
}

function initReveal() {
  const items = document.querySelectorAll(
    'section, .section-content, .accordion, .publication-item, .highlight-card'
  );

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );

  items.forEach((el) => {
    el.classList.add('reveal');
    obs.observe(el);
  });
}

async function fetchRepoStars(repoPath, outputNode) {
  if (!repoPath || !outputNode) return;

  try {
    const res = await fetch(`https://api.github.com/repos/${repoPath}`);
    if (!res.ok) throw new Error('Failed to fetch stars');
    const data = await res.json();
    outputNode.textContent = Number(data.stargazers_count || 0).toLocaleString();
  } catch (_) {
    outputNode.textContent = '-';
  }
}

function initRepoStars() {
  document.querySelectorAll('.github-link').forEach((link) => {
    const span = link.querySelector('.stars-count');
    const href = link.getAttribute('href') || '';
    const repoPath = href.split('github.com/')[1];
    fetchRepoStars(repoPath, span);
  });
}

function initQuantumCanvas() {
  const canvas = document.getElementById('quantumCanvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const particleCount = 64;
  const maxDistance = 150;
  const speed = 0.28;
  let width = 0;
  let height = 0;
  let particles = [];

  const setSize = () => {
    width = Math.floor(window.innerWidth * dpr);
    height = Math.floor(window.innerHeight * dpr);
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * speed * dpr,
      vy: (Math.random() - 0.5) * speed * dpr,
      r: (Math.random() * 1.7 + 0.45) * dpr,
    }));
  };

  const draw = () => {
    const theme = document.body.getAttribute('data-theme');
    const isDark = theme === 'dark';
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(45,212,191,0.62)' : 'rgba(15,118,110,0.36)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > maxDistance * dpr) continue;

        const alpha = 1 - dist / (maxDistance * dpr);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = isDark
          ? `rgba(251,146,60,${alpha * 0.2})`
          : `rgba(15,118,110,${alpha * 0.22})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  };

  setSize();
  draw();
  window.addEventListener('resize', setSize);
}

window.addEventListener('DOMContentLoaded', () => {
  runTypewriter();
  initTheme();
  initNavigation();
  initAccordions();
  initReveal();
  initRepoStars();
  initQuantumCanvas();
});
