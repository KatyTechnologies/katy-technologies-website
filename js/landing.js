/* Katy Technologies — landing V2 choreography (Lenis + GSAP + ScrollTrigger) */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    var burger = document.querySelector('.burger');
    var menu = document.querySelector('.mobile-menu');
    var scrim = document.querySelector('.scrim');
    if (!burger || !menu || !scrim) return;

    function setOpen(open) {
      burger.classList.toggle('active', open);
      menu.classList.toggle('active', open);
      scrim.classList.toggle('active', open);
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
    }
    burger.addEventListener('click', function () {
      setOpen(!burger.classList.contains('active'));
    });
    scrim.addEventListener('click', function () { setOpen(false); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  /* ---------- Header: scrolled state + light/dark theme ---------- */
  function initHeader() {
    var head = document.querySelector('.site-head');
    if (!head) return;

    var themed = Array.prototype.slice.call(document.querySelectorAll('section[data-theme], footer[data-theme]'));

    function onScroll() {
      head.classList.toggle('scrolled', window.scrollY > 24);

      // theme: which section sits under the header bar right now?
      var probeY = 40;
      var light = false;
      for (var i = 0; i < themed.length; i++) {
        var r = themed[i].getBoundingClientRect();
        if (r.top <= probeY && r.bottom > probeY) {
          light = themed[i].dataset.theme === 'light';
          break;
        }
      }
      head.classList.toggle('head-light', light);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Split helpers (hand-rolled, no SplitText dependency) ---------- */
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

  /* ---------- No-GSAP / reduced-motion fallback ---------- */
  function showEverything() {
    var preloader = document.querySelector('.preloader');
    if (preloader) preloader.remove();
    document.body.classList.add('static-page');
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    document.querySelectorAll('.hero-title .line-inner').forEach(function (el) {
      el.style.transform = 'none';
    });
    ['.hero-kicker', '.hero-sub', '.hero-cta', '.hero-meta'].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) el.style.opacity = '1';
    });
  }

  /* ---------- Lenis smooth scroll ---------- */
  function initLenis() {
    if (typeof window.Lenis === 'undefined') return null;
    var lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // anchor links route through lenis
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: 0 });
      });
    });
    return lenis;
  }

  /* ---------- Preloader 0→100 + hero intro ---------- */
  function initIntro() {
    var preloader = document.querySelector('.preloader');
    var tl = gsap.timeline();

    if (preloader) {
      var num = preloader.querySelector('.count-num');
      var counter = { v: 0 };
      tl.to(counter, {
        v: 100,
        duration: 1.1,
        ease: 'power2.inOut',
        onUpdate: function () { num.textContent = Math.round(counter.v); }
      })
        .to(preloader, {
          yPercent: -100,
          duration: 0.7,
          ease: 'power3.inOut',
          onComplete: function () { preloader.remove(); }
        }, '+=0.1');
    }

    tl.to('.hero-title .line-inner', {
      y: 0,
      duration: 1.1,
      ease: 'power4.out',
      stagger: 0.09
    }, preloader ? '-=0.35' : 0)
      .to('.hero-kicker', { opacity: 1, duration: 0.7, ease: 'power1.out' }, '<0.25')
      .to('.hero-sub', { opacity: 1, duration: 0.8, ease: 'power1.out' }, '<0.15')
      .to('.hero-cta', { opacity: 1, duration: 0.8, ease: 'power1.out' }, '<0.15')
      .to('.hero-meta', { opacity: 1, duration: 0.9, ease: 'power1.out' }, '<0.2');
  }

  /* ---------- Generic reveals ---------- */
  function initReveals() {
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
  }

  /* ---------- Manifesto: word-by-word opacity scrub ---------- */
  function initManifesto() {
    var line = document.querySelector('[data-manifesto]');
    if (!line) return;
    var words = splitWords(line);
    gsap.to(words, {
      opacity: 1,
      stagger: 0.06,
      ease: 'none',
      scrollTrigger: {
        trigger: line,
        start: 'top 78%',
        end: 'bottom 42%',
        scrub: 0.4
      }
    });
  }

  /* ---------- Chapters: giant word slide + fragment draw ---------- */
  function initChapters() {
    gsap.utils.toArray('.chapter').forEach(function (chapter) {
      var word = chapter.querySelector('.chapter-word');
      var slide = parseFloat(word.dataset.wordSlide || '-10');

      gsap.fromTo(word,
        { xPercent: slide },
        {
          xPercent: -slide,
          ease: 'none',
          scrollTrigger: {
            trigger: chapter,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5
          }
        });

      var info = chapter.querySelector('.chapter-info');
      gsap.from(info.children, {
        opacity: 0,
        y: 34,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: chapter, start: 'top 64%', once: true }
      });

      var frag = chapter.querySelector('.frag-svg');
      var tl = gsap.timeline({
        scrollTrigger: { trigger: frag, start: 'top 82%', once: true }
      });
      tl.to(frag.querySelectorAll('.draw'), {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: 'power1.inOut',
        stagger: 0.18
      })
        .to(frag.querySelectorAll('.fade'), {
          opacity: 1,
          duration: 0.5,
          ease: 'power1.out',
          stagger: 0.1
        }, '-=0.4');
    });
  }

  /* ---------- Footer wordmark rise ---------- */
  function initFooterWord() {
    var word = document.querySelector('.footer-word span');
    if (!word) return;
    gsap.from(word, {
      yPercent: 100,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.footer-word', start: 'top 96%', once: true }
    });
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHeader();

    if (!hasGsap || prefersReduced) {
      showEverything();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    initLenis();
    initIntro();
    initReveals();
    initManifesto();
    initChapters();
    initFooterWord();
  });
})();
