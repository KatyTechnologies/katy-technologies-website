/* Valley Signal — Lenis + GSAP over story-field.js */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  function showEverything() {
    var pre = document.getElementById("preloader");
    if (pre) pre.classList.add("done");
    document.body.classList.add("static-page");
  }

  function boot() {
    if (reduced || !hasGsap) {
      showEverything();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    if (typeof Lenis !== "undefined") {
      var lenis = new Lenis({
        duration: 1.2,
        easing: function (t) {
          return Math.min(1, 1.001 - Math.pow(2, -10 * t));
        },
        smoothWheel: true,
      });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add("lenis");
    }

    var pre = document.getElementById("preloader");
    var intro = gsap.timeline({
      onComplete: function () {
        if (pre) pre.classList.add("done");
      },
    });

    intro
      .to(".pl-bar span", { width: "100%", duration: 0.85, ease: "power2.inOut" })
      .to({}, { duration: 0.15 })
      .to(".brand-display .ln", { y: "0%", duration: 1, ease: "power3.out", stagger: 0.12 }, "-=0.05")
      .to(".hero-kicker", { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, "-=0.55")
      .to(".hero-line", { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, "-=0.35")
      .to(".hero-sub", { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, "-=0.4")
      .to(".hero-cta", { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, "-=0.4")
      .to(
        ".hero-meter",
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
        "-=0.35"
      )
      .from(
        ".hero-meter span",
        { scaleX: 0, duration: 0.7, ease: "power3.out", stagger: 0.06 },
        "-=0.45"
      );

    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      });
    });

    gsap.utils.toArray(".signal-card").forEach(function (card) {
      gsap.fromTo(
        card,
        { opacity: 0.35, y: 30 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "top 35%",
            scrub: true,
          },
        }
      );
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
