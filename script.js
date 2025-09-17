//
// 1) Typing Effect for the title
//
const titleElement = document.querySelector('.title');
const text = 'Kooshan Maleki'; // The text to "type out"
let index = -1;

function type() {
  if (index === -1) {
    titleElement.textContent = '';
  } else {
    titleElement.textContent += text[index];
  }
  index++;
  if (index === text.length) {
    // Done typing
    return;
  }
  setTimeout(type, 100); // Adjust speed
}

window.addEventListener('load', () => {
  type();
});

//
// 2) Accordion Toggle
//
document.addEventListener("DOMContentLoaded", function () {
  const accordionBtns = document.querySelectorAll(".accordion-btn");

  accordionBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const accordion = this.parentElement;
      accordion.classList.toggle("active");
    });
  });
});

//
// 3) GitHub Star Count
//
async function extractStars(repoPath, elementId) {
  const url = `https://img.shields.io/github/stars/${repoPath}?style=for-the-badge&label=&color=fff&labelColor=333`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch the SVG');
    }
    const svgText = await response.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    const textElement = svgDoc.querySelector('text');
    if (textElement) {
      const starsCount = textElement.textContent.trim();
      document.getElementById(elementId).textContent = starsCount;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function updateStars() {
  const links = document.querySelectorAll('.github-link');
  links.forEach((link, index) => {
    const href = link.href;
    const repoPath = href.split('github.com/')[1];
    if (repoPath) {
      const elementId = `starsCount${index}`;
      const starSpan = link.querySelector('.stars-count');
      if (starSpan) {
        starSpan.id = elementId;
        extractStars(repoPath, elementId);
      }
    }
  });
}

window.onload = updateStars;


// (modal preview removed; gallery opens directly)
// (theme block consolidated below)
// === NAVBAR (toggle + smooth scrolling) ===
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => navLinks?.classList.toggle('open'));
document.querySelectorAll('a.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(targetId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
        navLinks?.classList.remove('open');
      }
    }
  });
});

// === Scroll spy ===
const sections = document.querySelectorAll('section[id]');
const navMap = {};
document.querySelectorAll('.nav-link').forEach(a => { const id = a.getAttribute('href').replace('#',''); navMap[id] = a; });
const underline = document.querySelector('.nav-underline');
const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      Object.values(navMap).forEach(el => el?.classList.remove('active'));
      navMap[id]?.classList.add('active');
      if (underline && navMap[id]) underline.style.width = navMap[id].getBoundingClientRect().width + 'px';
    }
  });
}, { rootMargin: '-50% 0px -40% 0px', threshold: 0.1 });
sections.forEach(sec => spy.observe(sec));

// === Reveal on scroll ===
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); revObs.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.section-content, .accordion, .publication-item, h2').forEach(el => { el.classList.add('reveal'); revObs.observe(el); });

// === Make entire accordion clickable ===
document.querySelectorAll('.accordion').forEach(acc => {
  const btn = acc.querySelector('.accordion-btn');
  const content = acc.querySelector('.accordion-content');
  if (btn && content) {
    [acc, btn].forEach(el => el.addEventListener('click', (e) => {
      if (e.target.closest('a')) return; // don't toggle when clicking links
      acc.classList.toggle('active');
    }));
  }
});

// === Quantum particle background ===
(function(){
  const canvas = document.getElementById('quantumCanvas');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext('2d');
  let width, height, particles;
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const N = 70, SPEED = 0.3;
  function resize(){ width = canvas.width = innerWidth*DPR; height = canvas.height = innerHeight*DPR;
    canvas.style.width = innerWidth+'px'; canvas.style.height = innerHeight+'px'; init(); }
  function init(){ particles = Array.from({length:N}, () => ({
    x: Math.random()*width, y: Math.random()*height,
    vx:(Math.random()-0.5)*SPEED*DPR, vy:(Math.random()-0.5)*SPEED*DPR, r:(Math.random()*1.8+0.5)*DPR
  })); }
  function step(){
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = document.body.getAttribute('data-theme') || (systemDark ? 'dark' : 'light');
    const isDark = theme === 'dark';
    ctx.clearRect(0,0,width,height);
    for (let i=0;i<N;i++){
      const p = particles[i]; p.x+=p.vx; p.y+=p.vy;
      if (p.x<0||p.x>width) p.vx*=-1; if (p.y<0||p.y>height) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = isDark ? 'rgba(34,211,238,0.6)' : 'rgba(108,92,231,0.5)';
      ctx.shadowColor = isDark ? 'rgba(34,211,238,0.8)' : 'rgba(108,92,231,0.8)';
      ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0;
      for (let j=i+1;j<N;j++){
        const q = particles[j], dx=p.x-q.x, dy=p.y-q.y, d2=dx*dx+dy*dy;
        if (d2 < (150*DPR)*(150*DPR)) {
          const a = 1 - d2/(150*DPR*150*DPR);
          ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
          ctx.strokeStyle = isDark ? 'rgba(34,211,238,'+(0.2*a)+')' : 'rgba(108,92,231,'+(0.2*a)+')';
          ctx.lineWidth = 1; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(step);
  }
  resize(); addEventListener('resize', resize); step();
})();


// === Theme detection + toggle (robust) ===
(function() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  const themeToggle = document.getElementById('themeToggle');

  function swapThemeImages(mode) {
    const imgs = document.querySelectorAll('.theme-logo, .theme-image, img[data-dark], img[data-light], img[data-src-dark], img[data-src-light]');
    imgs.forEach(img => {
      const darkSrc = img.getAttribute('data-dark') || img.getAttribute('data-src-dark') || img.dataset.dark || img.dataset.srcDark;
      const lightSrc = img.getAttribute('data-light') || img.getAttribute('data-src-light') || img.dataset.light || img.dataset.srcLight;
      const target = (mode === 'dark') ? (darkSrc || img.src) : (lightSrc || img.src);
      if (target) { img.setAttribute('src', target); }
    });
  }

  function applyTheme(mode) {
    document.body.setAttribute('data-theme', mode);
    swapThemeImages(mode);
    if (themeToggle) {
      themeToggle.textContent = (mode === 'dark') ? '☀️' : '🌙';
      themeToggle.setAttribute('aria-label', (mode === 'dark') ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  // initialize
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = (document.body.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      applyTheme(next);
    });
  }
})();


// === Robust accordion toggle (works even if earlier listeners didn't attach) ===
document.querySelectorAll('.accordion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const parent = btn.closest('.accordion');
    if (parent) parent.classList.toggle('active');
  });
});


/* Delegated click handler: ensures all accordions open/close */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.accordion-btn');
  if (btn) {
    const parent = btn.closest('.accordion');
    if (parent) parent.classList.toggle('active');
  }
});
