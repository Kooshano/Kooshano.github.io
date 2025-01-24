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

//
// 4) Modal Preview Logic
//
const modalOverlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');
const modalCloseBtn = document.getElementById('modalClose');

// Capture clicks on .cert-thumbnail to open modal
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('cert-thumbnail')) {
    const fullPath = e.target.getAttribute('data-full');
    if (!fullPath) return;

    // Clear previous content
    modalBody.innerHTML = '';

    // Check if it's a PDF (ends with .pdf) or an image
    const isPDF = fullPath.toLowerCase().endsWith('.pdf');

    if (isPDF) {
      // Embed PDF in iframe
      const iframe = document.createElement('iframe');
      iframe.src = fullPath;
      iframe.width = '100%';
      iframe.height = '600'; 
      iframe.style.border = 'none';
      modalBody.appendChild(iframe);
    } else {
      // Show large image
      const img = document.createElement('img');
      img.src = fullPath;
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      modalBody.appendChild(img);
    }

    // Show modal
    modalOverlay.style.display = 'flex';
  }
});

// Close modal on "X" click
modalCloseBtn.addEventListener('click', () => {
  modalOverlay.style.display = 'none';
});

// Close modal on clicking outside the modal content
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.style.display = 'none';
  }
});