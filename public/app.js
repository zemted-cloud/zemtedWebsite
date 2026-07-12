const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const inquiryForm = document.querySelector("[data-inquiry-form]");
const formStatus = document.querySelector("[data-form-status]");
const revealTargets = document.querySelectorAll(
  ".section-heading, .intro > p, .capability-card, .timeline, .timeline-item, .quality-copy, .quality-board div, .contact-panel > div, .inquiry-form"
);
const counters = document.querySelectorAll("[data-counter]");

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
}

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  header.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("is-open");
    header.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
  }
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

revealTargets.forEach((target, index) => {
  target.classList.add("reveal");
  target.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealTargets.forEach((target) => revealObserver.observe(target));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const target = entry.target;
      const end = Number(target.dataset.count);
      const suffix = target.dataset.suffix || "";
      const duration = 900;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        target.textContent = `${Math.round(end * eased)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
      counterObserver.unobserve(target);
    });
  },
  { threshold: 0.7 }
);

counters.forEach((counter) => counterObserver.observe(counter));

inquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "Thanks. Your production request is ready to connect to a real inbox.";
  inquiryForm.reset();
});
