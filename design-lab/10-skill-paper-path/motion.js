(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

  function boot() {
    if (reduced || !hasGsap) {
      document.body.classList.add("static-page");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    if (typeof Lenis !== "undefined") {
      var lenis = new Lenis({ duration: 1.2, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add("lenis");
    }

    // Motion 1: brand lines rise
    gsap.to(".brand-display .line", {
      y: "0%", duration: 1.05, ease: "power3.out", stagger: 0.12, delay: 0.15
    });
    // Motion 2: supporting hero copy
    gsap.to([".headline", ".sub", ".hero .btn"], {
      opacity: 1, y: 0, duration: 0.75, ease: "power3.out", stagger: 0.1, delay: 0.55
    });
    // Motion 3: scroll reveals
    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
