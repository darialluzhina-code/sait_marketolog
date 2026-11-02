const header = document.getElementById("header");
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menuBtn");
const year = document.getElementById("year");

document.body.classList.add("js-ready");
if (year) year.textContent = new Date().getFullYear();

const onScroll = () => {
  header.classList.toggle("scrolled", window.scrollY > 12);
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Открыть меню");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
);

document.querySelectorAll(".reveal").forEach((el, i) => {
  const delay = [...el.classList].find((c) => c.startsWith("delay-"));
  const ms = delay ? Number(delay.split("-")[1]) * 80 : (i % 4) * 40;
  el.style.transitionDelay = `${ms}ms`;
  observer.observe(el);
});

window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
      el.classList.add("in");
    });
  }, 1800);
});

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq-item").forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});
