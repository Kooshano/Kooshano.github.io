/* Theme toggle, hero canvas, GitHub star counts. Nothing else needs JS. */

const THEME_KEY = 'theme';

function applyTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode);

  // Which icon shows is CSS's job; JS only keeps the label truthful.
  document.querySelectorAll('.theme-toggle').forEach((button) => {
    const label = mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
  });
}

function initTheme() {
  // The pre-paint inline script in <head> already set the attribute; this only
  // syncs the button icons and wires up the click handler.
  applyTheme(document.documentElement.getAttribute('data-theme') || 'light');

  document.querySelectorAll('.theme-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const next =
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (_) {
        /* private browsing */
      }
      applyTheme(next);
    });
  });
}

/* Node-and-edge field behind the hero. Sized to the hero, not the window, so
   it stops costing anything once you scroll past it. */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  const hero = canvas?.closest('.hero');
  if (!canvas || !hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const maxDistance = 150;
  const speed = 0.28;

  let width = 0;
  let height = 0;
  let nodes = [];
  let frame = null;
  let visible = true;

  const setSize = () => {
    const rect = hero.getBoundingClientRect();
    const cssWidth = Math.max(1, Math.round(rect.width));
    const cssHeight = Math.max(1, Math.round(rect.height));

    width = Math.floor(cssWidth * dpr);
    height = Math.floor(cssHeight * dpr);
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    // Roughly one node per 18,000 css px², clamped so phones stay cheap.
    const count = Math.round(
      Math.min(80, Math.max(24, (cssWidth * cssHeight) / 18000))
    );

    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * speed * dpr,
      vy: (Math.random() - 0.5) * speed * dpr,
      r: (Math.random() * 1.6 + 0.5) * dpr,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < nodes.length; i += 1) {
      const p = nodes[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fill();

      for (let j = i + 1; j < nodes.length; j += 1) {
        const q = nodes[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist > maxDistance * dpr) continue;

        const alpha = (1 - dist / (maxDistance * dpr)) * 0.22;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    frame = requestAnimationFrame(draw);
  };

  const start = () => {
    if (frame === null) frame = requestAnimationFrame(draw);
  };

  const stop = () => {
    if (frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }
  };

  setSize();
  start();

  // Resizing on iOS fires for address-bar show/hide too; only rebuild when the
  // hero's own box actually changed.
  if (typeof ResizeObserver === 'function') {
    let last = `${hero.clientWidth}x${hero.clientHeight}`;
    new ResizeObserver(() => {
      const next = `${hero.clientWidth}x${hero.clientHeight}`;
      if (next === last) return;
      last = next;
      setSize();
    }).observe(hero);
  } else {
    window.addEventListener('resize', setSize);
  }

  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) start();
      else stop();
    },
    { threshold: 0 }
  ).observe(hero);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden || !visible) stop();
    else start();
  });
}

async function initRepoStars() {
  const links = [...document.querySelectorAll('[data-repo]')];
  if (!links.length) return;

  await Promise.all(
    links.map(async (link) => {
      const output = link.querySelector('.stars-count');
      if (!output) return;

      try {
        const res = await fetch(`https://api.github.com/repos/${link.dataset.repo}`);
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        output.textContent = Number(data.stargazers_count || 0).toLocaleString();
      } catch (_) {
        // Rate-limited or offline: hide the counter rather than showing an error.
        link.querySelector('.stars')?.remove();
      }
    })
  );
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeroCanvas();
  initRepoStars();
});
