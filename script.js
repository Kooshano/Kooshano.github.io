document.addEventListener("DOMContentLoaded", () => {
  // Select all accordions on the page
  const accordions = document.querySelectorAll(".accordion");

  accordions.forEach((accordion) => {
    const btn = accordion.querySelector(".accordion-btn");
    const content = accordion.querySelector(".accordion-content");

    btn.addEventListener("click", () => {
      // Check if this accordion is already open
      const isOpen = content.style.maxHeight;

      // OPTIONAL: If you only want one accordion open at a time, uncomment:
      accordions.forEach((otherAccordion) => {
        const otherBtn = otherAccordion.querySelector(".accordion-btn");
        const otherContent = otherAccordion.querySelector(".accordion-content");
        otherContent.style.maxHeight = null;
        otherBtn.classList.remove("active");
      });

      if (isOpen) {
        // It's open -> close it
        content.style.maxHeight = null;
        btn.classList.remove("active");
      } else {
        // It's closed -> open it
        content.style.maxHeight = content.scrollHeight + "px";
        btn.classList.add("active");
      }
    });
  });
});