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

const initTrueFocus = (container) => {
  if (!container) return;

  const words = [...container.querySelectorAll(".focus-word")];
  const corners = {
    "top-left": container.querySelector(".focus-corner.top-left"),
    "top-right": container.querySelector(".focus-corner.top-right"),
    "bottom-left": container.querySelector(".focus-corner.bottom-left"),
    "bottom-right": container.querySelector(".focus-corner.bottom-right"),
  };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const blurAmount = 5;
  const cornerSize = 16;
  const frameGap = 10;
  const animationDuration = 0.5;
  const pauseBetweenAnimations = 1;
  let currentIndex = 0;

  const measure = (index) => {
    const word = words[index];
    if (!word) return;
    return {
      x: word.offsetLeft,
      y: word.offsetTop,
      width: word.offsetWidth,
      height: word.offsetHeight,
    };
  };

  const apply = (index) => {
    words.forEach((word, i) => {
      const active = i === index;
      word.classList.toggle("active", active);
      if (!reduceMotion) {
        word.style.filter = `blur(${active ? 0 : blurAmount}px)`;
      }
    });

    const rect = measure(index);
    if (!rect || reduceMotion) return;

    const positions = {
      "top-left": [rect.x - frameGap, rect.y - frameGap],
      "top-right": [rect.x + rect.width + frameGap - cornerSize, rect.y - frameGap],
      "bottom-left": [rect.x - frameGap, rect.y + rect.height + frameGap - cornerSize],
      "bottom-right": [
        rect.x + rect.width + frameGap - cornerSize,
        rect.y + rect.height + frameGap - cornerSize,
      ],
    };

    Object.entries(positions).forEach(([key, [x, y]]) => {
      const el = corners[key];
      if (!el) return;
      el.style.opacity = "1";
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
  };

  apply(0);

  if (reduceMotion || words.length < 2) return;

  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    apply(0);
    window.setInterval(() => {
      currentIndex = (currentIndex + 1) % words.length;
      apply(currentIndex);
    }, (animationDuration + pauseBetweenAnimations) * 1000);
  };

  if (container.classList.contains("in")) {
    start();
  } else {
    const wait = new MutationObserver(() => {
      if (container.classList.contains("in")) {
        wait.disconnect();
        start();
      }
    });
    wait.observe(container, { attributes: true, attributeFilter: ["class"] });
    window.setTimeout(start, 2000);
  }

  window.addEventListener("resize", () => apply(currentIndex));
};

initTrueFocus(document.getElementById("heroTitle"));
