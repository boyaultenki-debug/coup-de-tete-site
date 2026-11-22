/* Coup de Tête — interactions (vanilla, no dependencies) */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Header shadow on scroll ---- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    var setMenu = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* ---- Scroll reveal ----
     - n'anime que opacity + transform (fluide, géré par le GPU)
     - attend que l'image soit chargée avant de la faire apparaître
     - filet de sécurité si IntersectionObserver rate un élément (Safari + colonnes CSS)
     - nettoie les classes après l'animation pour rendre aux boutons leurs transitions normales */
  var pending = Array.prototype.slice.call(document.querySelectorAll(".reveal, .reveal-img"));

  var revealCleanup = function (el) {
    var t = el.__revealTimer; if (t) clearTimeout(t);
    el.classList.remove("reveal", "reveal-img", "is-visible");
    el.style.removeProperty("--i");
  };
  var revealNow = function (el) {
    if (el.__shown) return;
    el.__shown = true;
    requestAnimationFrame(function () {
      el.classList.add("is-visible");
      var onEnd = function (e) {
        if (e.target !== el || e.propertyName !== "opacity") return;
        el.removeEventListener("transitionend", onEnd);
        revealCleanup(el);
      };
      el.addEventListener("transitionend", onEnd);
      el.__revealTimer = setTimeout(function () { revealCleanup(el); }, 2200);
    });
  };
  var reveal = function (el) {
    if (el.__queued) return;
    el.__queued = true;
    var img = el.classList.contains("reveal-img") ? (el.tagName === "IMG" ? el : el.querySelector("img")) : null;
    if (img && !(img.complete && img.naturalWidth)) {
      if (img.loading === "lazy") img.loading = "eager";
      var go = function () { revealNow(el); };
      img.addEventListener("load", go, { once: true });
      img.addEventListener("error", go, { once: true });
      setTimeout(go, 2500);
    } else {
      revealNow(el);
    }
  };

  if (pending.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      pending.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { reveal(entry.target); io.unobserve(entry.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
      pending.forEach(function (el) { io.observe(el); });

      var scanTimer = null;
      var scan = function () {
        var vh = window.innerHeight;
        pending = pending.filter(function (el) {
          if (el.__queued) return false;
          var r = el.getBoundingClientRect();
          if (r.height && r.top < vh * 0.95 && r.bottom > 0) { reveal(el); io.unobserve(el); return false; }
          return true;
        });
        if (!pending.length) { window.removeEventListener("scroll", onScan); window.removeEventListener("resize", onScan); }
      };
      var onScan = function () { if (scanTimer) return; scanTimer = setTimeout(function () { scanTimer = null; scan(); }, 120); };
      window.addEventListener("scroll", onScan, { passive: true });
      window.addEventListener("resize", onScan);
      window.addEventListener("load", onScan);
    }
  }

  /* ---- Lightbox ---- */
  var gallery = document.querySelector("[data-lightbox]");
  if (gallery) {
    var items = Array.prototype.slice.call(gallery.querySelectorAll(".g-item"));
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Galerie des réalisations");
    box.innerHTML =
      '<button class="lb-btn lb-close" aria-label="Fermer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
      '<button class="lb-btn lb-prev" aria-label="Image précédente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>' +
      '<button class="lb-btn lb-next" aria-label="Image suivante"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>' +
      '<img alt="">';
    document.body.appendChild(box);
    var lbImg = box.querySelector("img");
    var current = 0;
    var lastFocus = null;

    var show = function (i) {
      current = (i + items.length) % items.length;
      var a = items[current];
      lbImg.src = a.getAttribute("data-full") || a.querySelector("img").src;
      lbImg.alt = a.querySelector("img").alt || "";
    };
    var open = function (i) {
      lastFocus = document.activeElement;
      show(i);
      box.classList.add("open");
      document.body.style.overflow = "hidden";
      box.querySelector(".lb-close").focus();
    };
    var close = function () {
      box.classList.remove("open");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };

    items.forEach(function (a, i) {
      a.addEventListener("click", function (e) { e.preventDefault(); open(i); });
    });
    box.querySelector(".lb-close").addEventListener("click", close);
    box.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
    box.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    window.addEventListener("keydown", function (e) {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(current + 1);
      if (e.key === "ArrowLeft") show(current - 1);
    });

    // swipe on touch
    var startX = null;
    box.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) show(current + (dx < 0 ? 1 : -1));
      startX = null;
    }, { passive: true });
  }

  /* ---- Page-transition fallback (browsers without View Transitions) ---- */
  if (!reduce && !("startViewTransition" in document)) {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a) return;
      var url = a.getAttribute("href");
      var sameOrigin = a.host === location.host;
      var isHash = url.charAt(0) === "#";
      var newTab = a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey;
      var isTel = url.indexOf("tel:") === 0 || url.indexOf("mailto:") === 0;
      if (!sameOrigin || isHash || newTab || isTel) return;
      e.preventDefault();
      document.body.style.transition = "opacity .25s ease";
      document.body.style.opacity = "0";
      setTimeout(function () { window.location.href = url; }, 230);
    });
  }
})();
