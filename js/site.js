/* Katy Technologies — Swiss Glow subpage choreography (Lenis + GSAP + ScrollTrigger)
   Shared by solutions / contact / about. Same kinetic language as js/landing.js,
   minus the preloader and the WebGL story scene. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  /* ---------- fallback: show everything, no choreography ---------- */
  function showEverything() {
    document.body.classList.add('static-page');
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    document.querySelectorAll('.hero-display .ln').forEach(function (el) {
      el.style.transform = 'none';
    });
    var foot = document.querySelector('.hero-foot');
    if (foot) foot.style.opacity = '1';
  }

  /* ---------- split helper (word scrub, no SplitText dependency) ---------- */
  function splitWords(el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach(function (w, i) {
      var span = document.createElement('span');
      span.className = 'w';
      span.textContent = w;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    return el.querySelectorAll('.w');
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!hasGsap || reduced) {
      showEverything();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ nullTargetWarn: false });

    /* ---------- hero intro: lines slide in from alternating sides ---------- */
    gsap.set('.hero-display .ln', {
      xPercent: function (i) { return i % 2 === 0 ? -110 : 110; },
      x: 0
    });
    var intro = gsap.timeline();
    intro.to('.hero-display .ln', {
      xPercent: 0,
      x: 0,
      duration: 1.15,
      ease: 'power4.out',
      stagger: 0.09,
      overwrite: 'auto'
    });
    intro.to('.hero-foot', { opacity: 1, duration: 0.8, ease: 'power1.out' }, '-=0.5');

    /* ---------- Lenis smooth scroll ---------- */
    var lenis = null;
    if (typeof window.Lenis !== 'undefined') {
      lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (!id || id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(target, { offset: 0 });
        else target.scrollIntoView({ behavior: 'smooth' });
      });
    });

    /* ---------- marquee rushes with scroll velocity ---------- */
    var track = document.querySelector('.mq-track');
    if (track) {
      track.classList.add('gs');
      var mqTl = gsap.to(track, { xPercent: -50, repeat: -1, ease: 'none', duration: 26 });
      ScrollTrigger.create({
        onUpdate: function (self) {
          var ts = gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 700);
          gsap.to(mqTl, { timeScale: ts, duration: 0.4, overwrite: true });
        }
      });
    }

    /* ---------- generic reveals ---------- */
    gsap.utils.toArray('[data-reveal]').forEach(function (el, i) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: (i % 3) * 0.07,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    /* ---------- manifesto pull-quote: word-by-word rise + opacity scrub ---------- */
    var line = document.querySelector('[data-manifesto]');
    if (line) {
      var words = splitWords(line);
      gsap.fromTo(words,
        { opacity: 0.14, y: '0.35em' },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: { trigger: line, start: 'top 78%', end: 'bottom 42%', scrub: 0.4 }
        });
    }

    /* ---------- CTA: shock-panel words rise once ---------- */
    gsap.from('.cta .tline', {
      yPercent: 120,
      duration: 1.0,
      ease: 'power4.out',
      stagger: 0.1,
      scrollTrigger: { trigger: '.cta', start: 'top 70%', once: true }
    });

    /* ---------- footer wordmark rise ---------- */
    var word = document.querySelector('.foot-mark');
    if (word) {
      gsap.from(word, {
        yPercent: 100,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.foot-mark-wrap', start: 'top 96%', once: true }
      });
    }

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  });
}());
