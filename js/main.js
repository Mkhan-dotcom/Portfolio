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

/* Home: name decode effect (plays once per visit) and role line sized to sit under the name */
(function () {
  var name = document.getElementById("heroName");
  var role = document.getElementById("heroRole");
  if (!name) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Role line: fit it to about 86% of the name's width so it always ends before the name does */
  function fitRole() {
    if (!role) return;
    role.style.fontSize = "";
    role.style.letterSpacing = "";
    if (window.innerWidth <= 760) return;
    var base = parseFloat(getComputedStyle(role).fontSize);
    var w = role.offsetWidth, n = name.offsetWidth;
    if (!w || !n) return;
    var size = base * (n * 0.86) / w;
    if (size < 11) {
      /* name is narrow (tablet): tighten the spacing first so the text can stay readable */
      role.style.letterSpacing = ".01em";
      w = role.offsetWidth;
      size = base * (n * 0.86) / w;
    }
    role.style.fontSize = Math.max(10.5, Math.min(size, base * 1.25)) + "px";
  }

  function decode() {
    var pool = "abcdefghijklmnopqrstuvwxyz0123456789#$%&@*+=?";
    var parts = Array.prototype.slice.call(name.querySelectorAll(".decode"));
    var jobs = [], idx = 0;
    parts.forEach(function (el) {
      var text = el.textContent;
      el.textContent = "";
      var letters = [];
      text.split("").forEach(function (ch) {
        var s = document.createElement("span");
        s.className = "dl"; s.textContent = ch;
        el.appendChild(s); letters.push({ s: s, ch: ch, at: 350 + idx * 75 });
        idx++;
      });
      /* lock each letter to its real width so the name never jumps around while it scrambles */
      letters.forEach(function (l) { l.s.style.width = l.s.getBoundingClientRect().width + "px"; });
      jobs.push({ el: el, text: text, letters: letters });
    });
    var start = performance.now();
    (function tick(now) {
      var t = now - start, pending = false;
      jobs.forEach(function (j) {
        j.letters.forEach(function (l) {
          if (t >= l.at) { if (l.s.textContent !== l.ch) l.s.textContent = l.ch; }
          else { pending = true; l.s.textContent = pool.charAt(Math.floor(Math.random() * pool.length)); }
        });
      });
      if (pending) { setTimeout(function () { requestAnimationFrame(tick); }, 45); }
      else { jobs.forEach(function (j) { j.el.textContent = j.text; }); fitRole(); }
    })(start);
  }

  var seen = false;
  try { seen = sessionStorage.getItem("decoded") === "1"; sessionStorage.setItem("decoded", "1"); } catch (e) {}

  function init() {
    fitRole();
    if (!reduce && !seen) decode();
  }
  var ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  var fired = false;
  function go() { if (fired) return; fired = true; init(); }
  ready.then(go);
  setTimeout(go, 1500);
  window.addEventListener("load", fitRole);
  var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(fitRole, 120); });
})();

/* Back-to-top button: appears after scrolling down */
(function () {
  var btn = document.getElementById("toTop");
  if (!btn) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function toggle() { btn.classList.toggle("show", window.scrollY > 500); }
  window.addEventListener("scroll", toggle, { passive: true });
  toggle();
  btn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });
})();
