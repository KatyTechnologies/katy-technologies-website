/* Katy Technologies — landing page choreography (GSAP + ScrollTrigger) */
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

  /* ---------- Header scroll state ---------- */
  function initHeader() {
    var head = document.querySelector('.site-head');
    if (!head) return;
    function onScroll() {
      head.classList.toggle('scrolled', window.scrollY > 24);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- No-GSAP / reduced-motion fallback ---------- */
  function showEverything() {
    var preloader = document.querySelector('.preloader');
    if (preloader) preloader.remove();
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
    document.body.classList.add('static-diagram');
  }

  /* ---------- Preloader + hero intro ---------- */
  function initIntro() {
    var preloader = document.querySelector('.preloader');
    var tl = gsap.timeline();

    if (preloader) {
      tl.to('.preloader-tick', { scaleX: 1, duration: 0.7, ease: 'power2.inOut' })
        .to(preloader, {
          autoAlpha: 0,
          duration: 0.45,
          ease: 'power1.out',
          onComplete: function () { preloader.remove(); }
        });
    }

    tl.to('.hero-title .line-inner', {
      y: 0,
      duration: 1.05,
      ease: 'power4.out',
      stagger: 0.09
    }, preloader ? '-=0.15' : 0)
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
        delay: (i % 3) * 0.08,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      });
    });
  }

  /* ---------- Diagram: pinned scrub on desktop, simple draw on mobile ---------- */
  function buildDiagramTimeline(tl) {
    // 1) nodes + connectors draw
    tl.to('.g-nodes .draw', {
      strokeDashoffset: 0, duration: 1.6, ease: 'none', stagger: 0.25
    }, 0)
      .to('.g-links .draw', {
        strokeDashoffset: 0, duration: 1.2, ease: 'none', stagger: 0.3
      }, 0.4)
      .to('.g-node-labels .fade', {
        opacity: 1, duration: 0.5, ease: 'none', stagger: 0.12
      }, 0.6);

    // 2) bottleneck marker
    tl.to('.g-bneck .draw', {
      strokeDashoffset: 0, duration: 0.8, ease: 'none', stagger: 0.2
    }, 2.6)
      .to('.g-bneck .fade', { opacity: 1, duration: 0.5, ease: 'none' }, 3.1);

    // 3) automation layer
    tl.to('.g-auto .draw', { strokeDashoffset: 0, duration: 1.6, ease: 'none' }, 4.0)
      .to('.g-auto .fade', { opacity: 1, duration: 0.5, ease: 'none' }, 5.2);

    // 4) human review stays
    tl.to('.g-human .draw', { strokeDashoffset: 0, duration: 0.8, ease: 'none' }, 5.8)
      .to('.g-human .fade', { opacity: 1, duration: 0.5, ease: 'none' }, 6.3);

    return tl;
  }

  var BEAT_MARKS = [0, 2.6, 4.0, 5.8]; // timeline positions where each beat begins
  var TL_END = 7.0;

  function initDiagram() {
    var mm = gsap.matchMedia();

    mm.add('(min-width: 901px)', function () {
      var beats = gsap.utils.toArray('.beat');
      gsap.set(beats[0], { opacity: 1 });

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.diagram-sec',
          start: 'top top',
          end: '+=2800',
          pin: '.diagram-pin',
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1
        }
      });

      buildDiagramTimeline(tl);

      // beat crossfades synced to stages
      for (var i = 1; i < beats.length; i++) {
        tl.to(beats[i - 1], { opacity: 0, y: -16, duration: 0.35, ease: 'none' }, BEAT_MARKS[i] - 0.2)
          .fromTo(beats[i], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, ease: 'none' }, BEAT_MARKS[i] + 0.1);
      }
      tl.to({}, { duration: TL_END - tl.duration() > 0 ? TL_END - tl.duration() : 0.2 }); // tail room

      return function () {}; // cleanup handled by matchMedia
    });

    mm.add('(max-width: 900px)', function () {
      // No pin: draw the whole diagram once when it enters
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.diagram-canvas',
          start: 'top 78%',
          once: true
        }
      });
      buildDiagramTimeline(tl);
      tl.timeScale(2.4);
      return function () {};
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
    initIntro();
    initReveals();
    initDiagram();
  });
})();
