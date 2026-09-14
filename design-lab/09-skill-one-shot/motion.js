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
      var lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add("lenis");
    }

    // Motion 1: staged hero entrance
    gsap.to("[data-in]", {
      opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.2
    });

    // Motion 2: section reveals
    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.85, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });

    // Motion 3: belief headline scale presence
    var belief = document.querySelector(".belief h2");
    if (belief) {
      gsap.fromTo(belief,
        { letterSpacing: "-0.01em" },
        {
          letterSpacing: "-0.03em", ease: "none",
          scrollTrigger: { trigger: ".belief", start: "top 80%", end: "top 30%", scrub: true }
        }
      );
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
