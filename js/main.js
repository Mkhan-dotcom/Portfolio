/* Theme: one choice shared by every page.
   It is kept in three places so it survives in any browser:
   1) in the links between pages (?theme=dark), which works even when files are opened straight from a folder,
   2) in localStorage, 3) in window.name. Each page's <head> reads them before it paints. */
(function () {
  var root = document.documentElement;
  function read() {
    var t = null, m = /[?&]theme=(light|dark)/.exec(location.search);
    if (m) t = m[1];
    if (!t) { try { t = localStorage.getItem("theme"); } catch (e) {} }
    if (!t) { var n = /mk-theme:(light|dark)/.exec(window.name); if (n) t = n[1]; }
    return t;
  }
  function apply(t) { if (t) { root.setAttribute("data-theme", t); tagLinks(t); } }
  function save(t) {
    try { localStorage.setItem("theme", t); } catch (e) {}
    window.name = (window.name || "").replace(/mk-theme:(light|dark)/g, "").trim() + " mk-theme:" + t;
  }
  /* add ?theme=... to links that go to our own pages */
  function tagLinks(t) {
    document.querySelectorAll("a[href]").forEach(function (a) {
      var h = a.getAttribute("href");
      if (!h || /^(#|mailto:|tel:|[a-z][a-z0-9+.-]*:)/i.test(h)) return;
      var hash = h.indexOf("#") > -1 ? h.slice(h.indexOf("#")) : "";
      var base = h.split("#")[0].split("?")[0];
      if (!base) return;
      a.setAttribute("href", base + "?theme=" + t + hash);
    });
  }

  var current = root.getAttribute("data-theme");
  if (current) tagLinks(current);

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

/* If a technology logo fails to load, try its backup source, then fall back to the name */
document.querySelectorAll(".logo-item img").forEach(function (img) {
  img.addEventListener("error", function () {
    var alt = img.getAttribute("data-alt");
    if (alt && !img.dataset.tried) { img.dataset.tried = "1"; img.src = alt; return; }
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

/* Contact form (Formspree) */
(function () {
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  if (!form) return;
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    status.className = "form-status";
    status.textContent = "Sending message...";
    try {
      var res = await fetch(form.getAttribute("action"), {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      status.className = "form-status ok";
      status.textContent = "Message sent. I’ll get back to you soon.";
    } catch (err) {
      status.className = "form-status error";
      status.textContent = "The message didn’t send. Please try again, or email me directly.";
    }
  });
})();
