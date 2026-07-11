/* Path Chapters — Lenis + GSAP choreography over story-field.js */
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

    var lenis = null;
    if (typeof Lenis !== "undefined") {
      lenis = new Lenis({
        duration: 1.15,
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
    var tl = gsap.timeline({
      onComplete: function () {
        if (pre) pre.classList.add("done");
      },
    });

    tl.to({}, { duration: 0.55 })
      .to(".brand-signal", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0.35)
      .to(
        ".hero-display .ln",
        { y: "0%", duration: 0.95, ease: "power3.out", stagger: 0.1 },
        0.45
      )
      .to(
        ".hero-foot",
        { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" },
        0.95
      )
      .to(
        ".scroll-cue",
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        1.15
      );

    document.querySelectorAll("[data-chapter]").forEach(function (section) {
      var sticky = section.querySelector(".chapter-sticky");
      if (!sticky) return;
      ScrollTrigger.create({
        trigger: section,
        start: "top 55%",
        end: "bottom 45%",
        onEnter: function () {
          sticky.classList.add("is-active");
        },
        onEnterBack: function () {
          sticky.classList.add("is-active");
        },
        onLeave: function () {
          sticky.classList.remove("is-active");
        },
        onLeaveBack: function () {
          sticky.classList.remove("is-active");
        },
      });
    });

    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
