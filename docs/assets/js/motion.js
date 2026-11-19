/* ==========================================================================
   MOTION LAYER — GSAP + ScrollTrigger
   Progressive enhancement: if GSAP is missing or the visitor prefers reduced
   motion, the page stays fully readable and static.
   ========================================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var hasGSAP = typeof window.gsap !== "undefined";
  var hasST = hasGSAP && typeof window.ScrollTrigger !== "undefined";

  if (hasST) gsap.registerPlugin(ScrollTrigger);

  /* ------------------------------------------------------------------ *
   * 1. Hero heading — word split with bilingual rebuild
   * ------------------------------------------------------------------ */
  var heroHeading = document.querySelector(".hero h2");
  var heroCopy = {
    en: "I am Ahmad Yusuf Bahtiar",
    id: "Saya Ahmad Yusuf Bahtiar"
  };

  function splitHero(lang) {
    if (!heroHeading) return [];
    var text = heroCopy[lang] || heroCopy.en;
    heroHeading.textContent = "";
    var words = text.split(/\s+/);
    var spans = [];
    words.forEach(function (word, i) {
      var outer = document.createElement("span");
      outer.className = "word";
      var inner = document.createElement("span");
      inner.textContent = word;
      outer.appendChild(inner);
      heroHeading.appendChild(outer);
      if (i < words.length - 1) heroHeading.appendChild(document.createTextNode(" "));
      spans.push(inner);
    });
    return spans;
  }

  var heroWords = splitHero(document.documentElement.lang === "id" ? "id" : "en");

  document.addEventListener("portfolio:language-change", function () {
    var lang = document.documentElement.lang === "id" ? "id" : "en";
    heroWords = splitHero(lang);
    if (hasGSAP && !reduce.matches) {
      gsap.fromTo(
        heroWords,
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.045 }
      );
    }
  });

  /* ------------------------------------------------------------------ *
   * 2. Section titles — mask reveal (text nodes untouched)
   * ------------------------------------------------------------------ */
  var maskedTitles = [];
  document.querySelectorAll(".section-title h2").forEach(function (h2) {
    if (h2.closest(".hero")) return;
    var mask = document.createElement("span");
    mask.className = "reveal-line";
    h2.parentNode.insertBefore(mask, h2);
    mask.appendChild(h2);
    maskedTitles.push(h2);
  });

  /* ------------------------------------------------------------------ *
   * 3. Preloader
   * ------------------------------------------------------------------ */
  var preloader = document.getElementById("preloader");
  var counter = preloader ? preloader.querySelector(".preloader-count") : null;
  var bar = preloader ? preloader.querySelector(".preloader-bar span") : null;

  function finishPreloader() {
    if (!preloader) return;
    if (!hasGSAP || reduce.matches) {
      preloader.remove();
      return;
    }
    var tl = gsap.timeline({
      onComplete: function () {
        preloader.remove();
        ScrollTrigger.refresh();
      }
    });
    tl.to(preloader.querySelector(".preloader-inner"), {
      yPercent: -30,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in"
    })
      .to(
        preloader,
        { yPercent: -100, duration: 0.9, ease: "expo.inOut" },
        "-=0.15"
      );
  }

  function runPreloader() {
    if (!preloader) return;
    if (!hasGSAP || reduce.matches) {
      finishPreloader();
      return;
    }
    var state = { v: 0 };
    gsap.to(state, {
      v: 100,
      duration: 1.15,
      ease: "power2.inOut",
      onUpdate: function () {
        if (counter) counter.textContent = String(Math.round(state.v)).padStart(3, "0");
      },
      onComplete: finishPreloader
    });
    if (bar) {
      gsap.to(bar, { scaleX: 1, duration: 1.15, ease: "power2.inOut" });
    }
  }

  /* ------------------------------------------------------------------ *
   * 4. Hero entrance + parallax
   * ------------------------------------------------------------------ */
  function heroIntro() {
    if (!hasGSAP || reduce.matches) return;
    var tl = gsap.timeline({ delay: 0.05 });
    tl.fromTo(
      heroWords,
      { yPercent: 115 },
      { yPercent: 0, duration: 1.15, ease: "expo.out", stagger: 0.07 }
    )
      .fromTo(
        ".hero p",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
        "-=0.7"
      )
      .fromTo(
        ".hero img",
        { scale: 1.18 },
        { scale: 1, duration: 1.8, ease: "expo.out" },
        "-=1.2"
      )
      .fromTo(
        ".header",
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=1.4"
      );
  }

  /* ------------------------------------------------------------------ *
   * 5. Scroll-driven reveals
   * ------------------------------------------------------------------ */
  function scrollReveals() {
    if (!hasST || reduce.matches) return;

    // section titles
    maskedTitles.forEach(function (h2) {
      gsap.fromTo(
        h2,
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: h2, start: "top 88%", once: true }
        }
      );
    });

    // generic fade-up groups
    var groups = [
      { sel: ".about .about-info p", y: 22, stagger: 0.07 },
      { sel: ".about .progress", y: 18, stagger: 0.06 },
      { sel: ".resume .resume-item", y: 30, stagger: 0.09 },
      { sel: ".services .service-item", y: 44, stagger: 0.1 },
      { sel: ".portfolio .portfolio-item", y: 40, stagger: 0.07 },
      { sel: ".contact .info-item", y: 24, stagger: 0.1 }
    ];

    groups.forEach(function (g) {
      var els = gsap.utils.toArray(g.sel);
      if (!els.length) return;
      gsap.fromTo(
        els,
        { y: g.y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.95,
          ease: "power3.out",
          stagger: g.stagger,
          scrollTrigger: { trigger: els[0], start: "top 90%", once: true }
        }
      );
    });

    // about portrait — clip reveal
    var portrait = document.querySelector(".about img.img-fluid");
    if (portrait) {
      gsap.fromTo(
        portrait,
        { clipPath: "inset(0 0 100% 0)", scale: 1.12 },
        {
          clipPath: "inset(0 0 0% 0)",
          scale: 1,
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: portrait, start: "top 88%", once: true }
        }
      );
    }

    // about copy
    var aboutMe = document.querySelector(".about .about-me");
    if (aboutMe) {
      gsap.fromTo(
        aboutMe,
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: aboutMe, start: "top 88%", once: true }
        }
      );
    }

    // parallax backgrounds
    [
      { sel: ".hero img", amount: 12 },
      { sel: ".stats img", amount: 14 },
      { sel: ".testimonials-bg", amount: 12 }
    ].forEach(function (p) {
      var el = document.querySelector(p.sel);
      if (!el) return;
      gsap.fromTo(
        el,
        { yPercent: -p.amount / 2 },
        {
          yPercent: p.amount / 2,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("section"),
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    });

    // section numerals drift (pseudo-element driven by a registered property)
    if (window.CSS && CSS.registerProperty) {
      try {
        CSS.registerProperty({
          name: "--num-shift",
          syntax: "<length>",
          inherits: false,
          initialValue: "0px"
        });
      } catch (err) {
        /* already registered */
      }
    }
    gsap.utils.toArray("section[id]").forEach(function (sec) {
      var num = getComputedStyle(sec, "::before").content;
      if (!num || num === "none") return;
      gsap.fromTo(
        sec,
        { "--num-shift": "0px" },
        {
          "--num-shift": "-46px",
          ease: "none",
          scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true }
        }
      );
    });
  }

  /* ------------------------------------------------------------------ *
   * 6. Marquee
   * ------------------------------------------------------------------ */
  function marquee() {
    var track = document.querySelector(".marquee-track");
    if (!track || !hasGSAP || reduce.matches) return;
    var group = track.querySelector(".marquee-group");
    if (!group) return;

    // duplicate until the track is at least 2x the viewport
    var guard = 0;
    while (track.scrollWidth < window.innerWidth * 2 && guard < 8) {
      track.appendChild(group.cloneNode(true));
      guard++;
    }

    var half = track.scrollWidth / 2;
    var tween = gsap.to(track, {
      x: -half,
      duration: half / 70,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: function (x) {
          return (parseFloat(x) % half) + "px";
        }
      }
    });

    var band = track.closest(".marquee-band");
    if (band && "IntersectionObserver" in window) {
      var inView = false;
      function syncPlayback() {
        tween.paused(!inView || document.hidden);
      }
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        syncPlayback();
      }).observe(band);
      document.addEventListener("visibilitychange", syncPlayback);
      tween.pause();
    }
    if (band) {
      band.addEventListener("pointerenter", function () {
        gsap.to(tween, { timeScale: 0.25, duration: 0.5 });
      });
      band.addEventListener("pointerleave", function () {
        gsap.to(tween, { timeScale: 1, duration: 0.5 });
      });
    }
  }

  /* ------------------------------------------------------------------ *
   * 7. Scroll progress + header state
   * ------------------------------------------------------------------ */
  function scrollProgress() {
    var barEl = document.querySelector(".scroll-progress");
    if (!barEl) return;
    function update() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? window.scrollY / h : 0;
      barEl.style.transform = "scaleX(" + Math.min(1, Math.max(0, p)) + ")";
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ------------------------------------------------------------------ *
   * 8. Custom cursor
   * ------------------------------------------------------------------ */
  function cursor() {
    if (!hasGSAP || reduce.matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    var dot = document.querySelector(".cursor-dot");
    var ring = document.querySelector(".cursor-ring");
    if (!dot || !ring) return;

    document.body.classList.add("has-cursor");

    var dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    var dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    var rx = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
    var ry = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });

    window.addEventListener(
      "pointermove",
      function (e) {
        dx(e.clientX);
        dy(e.clientY);
        rx(e.clientX);
        ry(e.clientY);
      },
      { passive: true }
    );

    var hot = "a, button, summary, .portfolio-item, .service-item, .project-spiral-cover";
    document.addEventListener("pointerover", function (e) {
      if (e.target.closest(hot)) ring.classList.add("is-active");
    });
    document.addEventListener("pointerout", function (e) {
      if (e.target.closest(hot)) ring.classList.remove("is-active");
    });
    document.addEventListener("pointerleave", function () {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    });
    document.addEventListener("pointerenter", function () {
      gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
    });
  }

  /* ------------------------------------------------------------------ *
   * 9. Magnetic buttons
   * ------------------------------------------------------------------ */
  function magnetic() {
    if (!hasGSAP || reduce.matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    document
      .querySelectorAll('.contact .php-email-form button[type="submit"], .scroll-top')
      .forEach(function (el) {
        el.addEventListener("pointermove", function (e) {
          var r = el.getBoundingClientRect();
          var mx = e.clientX - (r.left + r.width / 2);
          var my = e.clientY - (r.top + r.height / 2);
          gsap.to(el, {
            x: mx * 0.22,
            y: my * 0.22,
            duration: 0.5,
            ease: "power3.out"
          });
        });
        el.addEventListener("pointerleave", function () {
          gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
        });
      });
  }

  /* ------------------------------------------------------------------ *
   * 10. Boot
   * ------------------------------------------------------------------ */
  function boot() {
    runPreloader();
    heroIntro();
    scrollReveals();
    marquee();
    scrollProgress();
    // Native pointer stays visible inside the browser's modal top layer.
    if (hasST) {
      window.addEventListener("load", function () {
        ScrollTrigger.refresh();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // keep layout honest when fonts land late
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      if (hasST) ScrollTrigger.refresh();
    });
  }
})();
