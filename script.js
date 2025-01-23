document.addEventListener("DOMContentLoaded", () => {
  // Select all .accordion elements
  const accordions = document.querySelectorAll(".accordion");

  accordions.forEach((accordion) => {
    // Grab the button and the collapsible content
    const btn = accordion.querySelector(".accordion-btn");
    const content = accordion.querySelector(".accordion-content");

    // Toggle open/close on button click
    btn.addEventListener("click", () => {
      // Check if this section is already open
      const isOpen = content.style.maxHeight;

      // If you only want one section open at a time, uncomment this block:
      /*
      accordions.forEach(a => {
        const c = a.querySelector(".accordion-content");
        const b = a.querySelector(".accordion-btn");
        c.style.maxHeight = null;
        b.classList.remove("active");
      });
      */

      if (isOpen) {
        // It's open, so close it
        content.style.maxHeight = null;
        btn.classList.remove("active");
      } else {
        // It's closed, so open it by setting maxHeight
        content.style.maxHeight = content.scrollHeight + "px";
        btn.classList.add("active");
      }
    });
  });
});