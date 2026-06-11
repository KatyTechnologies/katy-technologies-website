/* Katy Technologies — landing V4 "Swiss Glow" choreography (Lenis + GSAP + ScrollTrigger)
   Swiss type kinetics over the Three.js glowing-path scene (js/story-field.js). */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  /* ---------- fallback: show everything, no choreography ---------- */
  function showEverything() {
    var pre = document.getElementById('preloader');
    if (pre && pre.parentNode) pre.parentNode.removeChild(pre);
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

  /* ---------- hero intro: lines slide in from alternating sides ---------- */
  function heroIntro() {
    if (!hasGsap || reduced) return;
    var tl = gsap.timeline();
    tl.to('.hero-display .ln', {
      xPercent: 0,
      x: 0,
      skewX: 0,
      duration: 1.15,
      ease: 'power4.out',
      stagger: 0.09,
      overwrite: 'auto'
    });
    tl.to('.hero-foot', { opacity: 1, duration: 0.8, ease: 'power1.out' }, '-=0.5');
  }

  /* ---------- preloader: hard-cut flashes navy -> blue -> paper ---------- */
  function initPreloader() {
    var pre = document.getElementById('preloader');

    if (hasGsap && !reduced) {
      gsap.set('.hero-display .ln', {
        xPercent: function (i) { return i % 2 === 0 ? -110 : 110; },
        skewX: function (i) { return i % 2 === 0 ? 8 : -8; },
        x: 0
      });
    }

    function end() {
      if (pre && pre.parentNode) pre.parentNode.removeChild(pre);
      heroIntro();
    }

    if (!pre || reduced || !hasGsap) {
      if (pre && pre.parentNode) pre.parentNode.removeChild(pre);
      if (reduced || !hasGsap) showEverything(); else heroIntro();
      return;
    }

    var stages = ['s-blue', 's-paper'];
    var step = 0;
    var timer = window.setInterval(function () {
      if (step >= stages.length) {
        window.clearInterval(timer);
        end();
        return;
      }
      pre.className = stages[step];
      step += 1;
    }, 150);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!hasGsap || reduced) {
      showEverything();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    initPreloader();

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

    /* ---------- headline tracking tightens as the hero scrolls past ---------- */
    gsap.fromTo('.hero-display',
      { letterSpacing: '-0.01em' },
      {
        letterSpacing: '-0.045em',
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });

    /* ---------- hero words hold, then lift away as MAP slides in ---------- */
    gsap.fromTo('.hero-display',
      { yPercent: 0, autoAlpha: 1 },
      {
        yPercent: -16,
        autoAlpha: 0,
        immediateRender: false,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: '15% top', end: 'bottom 35%', scrub: true }
      });

    /* ---------- oversized numerals parallax at their own speed ---------- */
    gsap.utils.toArray('.sec-num, .step-num').forEach(function (num) {
      var host = num.closest('section, footer, article');
      gsap.to(num, {
        yPercent: -42,
        ease: 'none',
        scrollTrigger: { trigger: host, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* ---------- scroll-velocity skew on the big type ---------- */
    gsap.set('[data-skew]', { transformOrigin: 'center center', force3D: true });
    var skewSetter = gsap.quickSetter('[data-skew]', 'skewY', 'deg');
    var skewClamp = gsap.utils.clamp(-4, 4);
    var skewProxy = { v: 0 };
    ScrollTrigger.create({
      onUpdate: function (self) {
        var s = skewClamp(self.getVelocity() / -400);
        if (Math.abs(s) > Math.abs(skewProxy.v)) {
          skewProxy.v = s;
          gsap.to(skewProxy, {
            v: 0,
            duration: 0.9,
            ease: 'power3',
            overwrite: true,
            onUpdate: function () { skewSetter(skewProxy.v); }
          });
        }
      }
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

    /* ---------- manifesto: word-by-word rise + opacity scrub ---------- */
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

    /* ---------- method panels: pinned words hold while the next set
         rises in from below, then compress away ---------- */
    gsap.utils.toArray('.chapter').forEach(function (chapter) {
      var inner = chapter.querySelector('.panel-inner');
      var lines = chapter.querySelectorAll('.panel-title .tline');
      var aux = chapter.querySelectorAll('.panel-meta, .panel-copy, .panel-diagram');

      // entrance: big words rise out of their masks while the previous
      // chapter's words are still pinned above
      var inTl = gsap.timeline({
        scrollTrigger: { trigger: chapter, start: 'top 85%', end: 'top 20%', scrub: 0.5 }
      });
      inTl.fromTo(lines,
        { yPercent: 120, skewY: 7 },
        { yPercent: 0, skewY: 0, stagger: 0.12, ease: 'power2.out' }, 0)
        .fromTo(aux,
          { y: 70, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, stagger: 0.1, ease: 'power2.out' }, 0.15);

      // exit: the pinned words hold, then lift away as the next set arrives
      gsap.fromTo(inner,
        { yPercent: 0, autoAlpha: 1, scale: 1 },
        {
          yPercent: -10,
          autoAlpha: 0,
          scale: 0.97,
          immediateRender: false,
          ease: 'power1.in',
          scrollTrigger: { trigger: chapter, start: 'bottom 92%', end: 'bottom 52%', scrub: 0.4 }
        });

      var frag = chapter.querySelector('.frag-svg');
      if (!frag) return;
      var tl = gsap.timeline({
        scrollTrigger: { trigger: frag, start: 'top 90%', once: true }
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

    /* ---------- CTA: shock-panel words rise once ---------- */
    gsap.from('#contact .tline', {
      yPercent: 120,
      skewY: 6,
      duration: 1.0,
      ease: 'power4.out',
      stagger: 0.1,
      scrollTrigger: { trigger: '#contact', start: 'top 70%', once: true }
    });

    /* ---------- story rail: visibility + active chapter ---------- */
    var rail = document.querySelector('.story-nav');
    var story = document.querySelector('.story');
    if (rail && story) {
      ScrollTrigger.create({
        trigger: story,
        start: 'top top-=1',
        end: 'bottom 70%',
        onToggle: function (self) { rail.classList.toggle('visible', self.isActive); }
      });
      gsap.utils.toArray('.chapter').forEach(function (chapter) {
        var link = rail.querySelector('[data-chapter="' + chapter.id + '"]');
        if (!link) return;
        ScrollTrigger.create({
          trigger: chapter,
          start: 'top 55%',
          end: 'bottom 45%',
          onToggle: function (self) { link.classList.toggle('active', self.isActive); }
        });
      });
    }

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
