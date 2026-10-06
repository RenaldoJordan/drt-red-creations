// Plain JavaScript enhancement file.
// This adds a simple reveal animation to cards and sections as users scroll.

document.addEventListener("DOMContentLoaded", function () {
  const revealItems = document.querySelectorAll(
    ".product-card, .promo-box, .about-card, .contact-strip, .smart-form, .preview-panel"
  );

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  revealItems.forEach(function (item) {
    item.classList.add("reveal");
    observer.observe(item);
  });
});
