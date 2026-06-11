(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('.site-head');
    var toggle = document.querySelector('.menu-toggle');
    var menu = document.getElementById('site-menu');
    if (!header || !toggle || !menu) return;
    var closeTimer = null;
    var closeDuration = 300;

    function setOpen(open) {
      window.clearTimeout(closeTimer);

      if (open) {
        header.classList.remove('menu-closing');
        header.classList.add('menu-open');
        document.body.classList.add('menu-open');
        toggle.setAttribute('aria-expanded', 'true');
        return;
      }

      if (!header.classList.contains('menu-open')) {
        header.classList.remove('menu-closing');
        document.body.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
        return;
      }

      header.classList.remove('menu-open');
      header.classList.add('menu-closing');
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');

      closeTimer = window.setTimeout(function () {
        header.classList.remove('menu-closing');
      }, closeDuration);
    }

    toggle.addEventListener('click', function (event) {
      event.stopPropagation();
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', function (event) {
      event.stopPropagation();
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setOpen(false);
    });

    document.addEventListener('click', function (event) {
      if (!header.contains(event.target)) setOpen(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) setOpen(false);
    });
  });
}());
