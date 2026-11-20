/* 1. Theme persistence — 3-layer: ?theme= param | localStorage | window.name */
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

/* 2. Logo image fallback */
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

/* 3. Scroll reveal + stagger children */
(function () {
  try {
    var items = document.querySelectorAll(".reveal, .title-line");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add("is-in");
        io.unobserve(el);
        /* stagger direct children when parent has .stagger-children */
        if (el.classList.contains("stagger-children")) {
          el.querySelectorAll(":scope > .stagger-item").forEach(function (child, i) {
            setTimeout(function () { child.classList.add("is-in"); }, i * 80);
          });
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (el) { io.observe(el); });
  } catch (e) { console.warn("Scroll reveal error:", e); }
})();

/* 4. Scroll progress bar */
(function () {
  try {
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
  } catch (e) { console.warn("Progress bar error:", e); }
})();

/* 5. Contact form (Formspree) */
(function () {
  try {
    var form = document.getElementById("contactForm");
    var status = document.getElementById("formStatus");
    if (!form) return;
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      status.className = "form-status";
      status.textContent = "Sending message...";
      var sendBtn = form.querySelector(".send");
      if (sendBtn) sendBtn.disabled = true;
      form.classList.add("is-sending");
      try {
        var res = await fetch(form.getAttribute("action"), {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });
        if (!res.ok) throw new Error("Request failed");
        form.reset();
        status.className = "form-status ok";
        status.textContent = "Message sent. I'll get back to you soon.";
      } catch (err) {
        status.className = "form-status error";
        status.textContent = "The message didn't send. Please try again, or email me directly.";
      } finally {
        var b = form.querySelector(".send");
        if (b) b.disabled = false;
        form.classList.remove("is-sending");
      }
    });
  } catch (e) { console.warn("Contact form error:", e); }
})();

/* 6. Name decode + fitRole */
(function () {
  try {
    var name = document.getElementById("heroName");
    var role = document.getElementById("heroRole");
    if (!name) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

    function init() { fitRole(); if (!reduce && !seen) decode(); }
    var ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    var fired = false;
    function go() { if (fired) return; fired = true; init(); }
    ready.then(go);
    setTimeout(go, 1500);
    window.addEventListener("load", fitRole);
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(fitRole, 120); });
  } catch (e) { console.warn("Name decode error:", e); }
})();

/* 7. Back-to-top button */
(function () {
  try {
    var btn = document.getElementById("toTop");
    if (!btn) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function toggle() { btn.classList.toggle("show", window.scrollY > 500); }
    window.addEventListener("scroll", toggle, { passive: true });
    toggle();
    btn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });
  } catch (e) { console.warn("Back-to-top error:", e); }
})();

/* 8. Custom cursor [NEW] */
(function () {
  try {
    var isTouch = ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduce) return;

    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    var ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var cursor = { x: -100, y: -100, rx: -100, ry: -100, scale: 1 };

    window.addEventListener("mousemove", function (e) {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      dot.style.transform = "translate(" + cursor.x + "px," + cursor.y + "px) translate(-50%,-50%)";
    }, { passive: true });

    window.addEventListener("mousedown", function () {
      cursor.scale = 0.75;
    }, { passive: true });
    window.addEventListener("mouseup", function () {
      cursor.scale = 1;
    }, { passive: true });

    document.querySelectorAll("a, button").forEach(function (el) {
      el.addEventListener("mouseover", function () { ring.classList.add("cursor-ring--hover"); });
      el.addEventListener("mouseout", function () { ring.classList.remove("cursor-ring--hover"); });
    });

    (function loop() {
      cursor.rx += (cursor.x - cursor.rx) * 0.12;
      cursor.ry += (cursor.y - cursor.ry) * 0.12;
      ring.style.transform = "translate(" + cursor.rx + "px," + cursor.ry + "px) translate(-50%,-50%) scale(" + cursor.scale + ")";
      requestAnimationFrame(loop);
    })();
  } catch (e) { console.warn("Custom cursor error:", e); }
})();

/* 9. Vanilla-Tilt cards [NEW] */
(function () {
  try {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    var cards = document.querySelectorAll(".project");
    if (!cards.length) return;

    function initTilt() {
      if (typeof window.VanillaTilt === "undefined") return;
      if (window.innerWidth < 768) {
        cards.forEach(function (c) { if (c._tiltInstance) c._tiltInstance.destroy(); });
        return;
      }
      VanillaTilt.init(cards, { max: 8, speed: 400, glare: true, "max-glare": 0.15, perspective: 800 });
    }

    window.addEventListener("load", initTilt);

    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(initTilt, 120);
    }, { passive: true });
  } catch (e) { console.warn("VanillaTilt error:", e); }
})();

/* 10. Magnetic buttons [NEW] */
(function () {
  try {
    var isTouch = ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduce) return;

    /* Apply .magnetic to the .talk button in JS so it degrades if JS is off */
    document.querySelectorAll(".talk").forEach(function (el) { el.classList.add("magnetic"); });

    document.querySelectorAll(".magnetic").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) * 0.3;
        var dy = (e.clientY - cy) * 0.3;
        el.style.transform = "translate(" + dx + "px," + dy + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transition = "transform 0.4s cubic-bezier(.25,.46,.45,.94)";
        el.style.transform = "";
        setTimeout(function () { el.style.transition = ""; }, 400);
      });
    });
  } catch (e) { console.warn("Magnetic buttons error:", e); }
})();

/* 11. Active nav state [NEW] */
(function () {
  try {
    var page = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("nav a[href]").forEach(function (a) {
      var href = a.getAttribute("href").split("?")[0].split("#")[0];
      if (href === page || (page === "" && href === "index.html")) {
        a.setAttribute("aria-current", "page");
      }
    });
  } catch (e) { console.warn("Active nav error:", e); }
})();

/* 12. Cybersecurity Console Easter Egg */
(function () {
  try {
    var cRed = "color: #e24c3f; font-family: monospace; font-size: 13px; font-weight: bold;";
    var cGreen = "color: #2e8b57; font-family: monospace; font-size: 12px; font-weight: bold;";
    var cMuted = "color: #888888; font-family: monospace; font-size: 11px;";
    var cWhite = "color: #dcdcdc; font-family: monospace; font-size: 11px;";

    console.log("%c[+] SYSTEM INITIALIZED: Portfolio v2.0", cRed);
    console.log("%c$ whoami", cGreen);
    console.log("%c> Muhammad Khan | IT Undergraduate & Cybersecurity Enthusiast", cWhite);
    console.log("%c> Focus: Web Application Security, Network Analysis & IoT", cMuted);
    console.log("%c> Looking for internships / collaborations? Reach out: mkhansethar65@gmail.com", cMuted);
    console.log("%c> Security policy: /.well-known/security.txt", cGreen);
  } catch (e) {}
})();


/* 7. Copy email */
(function () {
  try {
    var btn = document.getElementById("copyEmail");
    var live = document.getElementById("copyStatus");
    if (!btn) return;
    var txt = btn.querySelector(".copy__txt");
    function done() {
      btn.classList.add("is-done");
      if (txt) txt.textContent = "Copied!";
      if (live) live.textContent = "Email address copied to clipboard";
      setTimeout(function () {
        btn.classList.remove("is-done");
        if (txt) txt.textContent = "Copy";
        if (live) live.textContent = "";
      }, 2000);
    }
    function fallback(v) {
      var ta = document.createElement("textarea");
      ta.value = v; ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) {}
      document.body.removeChild(ta);
    }
    btn.addEventListener("click", function () {
      var v = btn.getAttribute("data-copy");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(v).then(done, function () { fallback(v); });
      } else { fallback(v); }
    });
  } catch (e) { console.warn("Copy email error:", e); }
})();
