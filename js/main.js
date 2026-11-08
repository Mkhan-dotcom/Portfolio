/* Theme: one saved choice that every page reads (set in the <head> of each page) */
(function () {
  var root = document.documentElement;
  function read() {
    var t = null;
    try { t = localStorage.getItem("theme"); } catch (e) {}
    if (!t) { var m = /mk-theme:(light|dark)/.exec(window.name); if (m) t = m[1]; }
    return t;
  }
  function apply(t) { if (t) root.setAttribute("data-theme", t); }
  function save(t) {
    try { localStorage.setItem("theme", t); } catch (e) {}
    window.name = (window.name || "").replace(/mk-theme:(light|dark)/g, "").trim() + " mk-theme:" + t;
  }

  var btn = document.getElementById("themeToggle");
  if (btn) {
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      save(next);
    });
  }
  /* Changed in another tab or window: follow it */
  window.addEventListener("storage", function (e) { if (e.key === "theme") apply(e.newValue); });
  /* Returning with the Back button: re-check the saved choice */
  window.addEventListener("pageshow", function () { apply(read()); });
})();

/* If a technology logo fails to load, show its name instead of a broken image */
document.querySelectorAll(".logo-item img").forEach(function (img) {
  img.addEventListener("error", function () {
    var span = document.createElement("span");
    span.className = "logo-fallback";
    span.textContent = img.getAttribute("data-name") || img.alt;
    img.replaceWith(span);
  });
});

/* Scroll reveal: elements fade up once as they enter the screen */
(function () {
  var items = document.querySelectorAll(".reveal, .title-line");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  items.forEach(function (el) { io.observe(el); });
})();

/* Thin scroll-progress bar along the top of the page */
(function () {
  var bar = document.getElementById("progress");
  if (!bar) return;
  var ticking = false;
  function update() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ")";
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();
