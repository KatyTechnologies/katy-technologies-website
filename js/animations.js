// Animations Module - Uses anime.js for smooth animations

export function initAnimations() {
  // Check if anime.js is loaded
  if (typeof anime === 'undefined') {
    console.warn('anime.js is not loaded. Skipping animations.');
    return;
  }
  
  // Initialize hero animations
  initHeroAnimations();
  
  // Initialize card hover animations
  initCardAnimations();
  
  // Initialize solution gallery animations
  initSolutionAnimations();
  
  // Initialize counter animations
  initCounterAnimations();
  
  // Initialize parallax effects
  initParallaxEffects();
}

function initHeroAnimations() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  // Animate hero background blobs
  const blobs = hero.querySelectorAll('.hero-bg::before, .hero-bg::after');
  if (blobs.length > 0) {
    anime({
      targets: blobs,
      translateX: () => anime.random(-100, 100),
      translateY: () => anime.random(-100, 100),
      scale: () => anime.random(0.8, 1.2),
      duration: 20000,
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true
    });
  }
  
  // Animate hero content on load
  const heroTitle = hero.querySelector('.hero-title');
  const heroSubtitle = hero.querySelector('.hero-subtitle');
  const heroButtons = hero.querySelector('.hero-buttons');
  
  if (heroTitle) {
    anime({
      targets: heroTitle,
      opacity: [0, 1],
      translateY: [-30, 0],
      duration: 1000,
      easing: 'easeOutExpo'
    });
  }
  
  if (heroSubtitle) {
    anime({
      targets: heroSubtitle,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 1000,
      delay: 200,
      easing: 'easeOutExpo'
    });
  }
  
  if (heroButtons) {
    anime({
      targets: heroButtons.children,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 1000,
      delay: anime.stagger(100, {start: 400}),
      easing: 'easeOutExpo'
    });
  }
  
  // Floating animation for hero elements
  const floatingElements = hero.querySelectorAll('[data-float]');
  floatingElements.forEach(element => {
    anime({
      targets: element,
      translateY: [-10, 10],
      duration: anime.random(3000, 5000),
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true
    });
  });
}

function initCardAnimations() {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    // Hover animation
    card.addEventListener('mouseenter', () => {
      anime({
        targets: card,
        scale: 1.05,
        translateY: -5,
        duration: 300,
        easing: 'easeOutCubic'
      });
      
      // Animate card icon
      const icon = card.querySelector('.card-icon');
      if (icon) {
        anime({
          targets: icon,
          rotate: 360,
          duration: 600,
          easing: 'easeOutCubic'
        });
      }
    });
    
    card.addEventListener('mouseleave', () => {
      anime({
        targets: card,
        scale: 1,
        translateY: 0,
        duration: 300,
        easing: 'easeOutCubic'
      });
      
      const icon = card.querySelector('.card-icon');
      if (icon) {
        anime({
          targets: icon,
          rotate: 0,
          duration: 600,
          easing: 'easeOutCubic'
        });
      }
    });
  });
}

function initSolutionAnimations() {
  const solutionCards = document.querySelectorAll('.solution-card');
  
  solutionCards.forEach((card, index) => {
    // Stagger animation on scroll into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          anime({
            targets: card,
            opacity: [0, 1],
            translateX: [-50, 0],
            duration: 800,
            delay: index * 100,
            easing: 'easeOutExpo'
          });
          observer.unobserve(card);
        }
      });
    }, { threshold: 0.2 });
    
    observer.observe(card);
    
    // Hover pulse animation
    card.addEventListener('mouseenter', () => {
      anime({
        targets: card.querySelector('.solution-icon'),
        scale: [1, 1.2, 1],
        duration: 600,
        easing: 'easeInOutQuad'
      });
    });
  });
}

function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-counter]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-counter'));
    const suffix = counter.getAttribute('data-suffix') || '';
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          anime({
            targets: counter,
            innerHTML: [0, target],
            duration: 2000,
            easing: 'easeInOutExpo',
            round: 1,
            update: function(anim) {
              counter.innerHTML = Math.round(anim.animations[0].currentValue) + suffix;
            }
          });
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(counter);
  });
}

function initParallaxEffects() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length === 0) return;
  
  // Throttled scroll handler
  let ticking = false;
  function updateParallax() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
          const speed = element.getAttribute('data-parallax') || 0.5;
          const yPos = -(scrolled * speed);
          
          anime({
            targets: element,
            translateY: yPos,
            duration: 0,
            easing: 'linear'
          });
        });
        
        ticking = false;
      });
      
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', updateParallax);
}

// Utility function for revealing elements on scroll
export function animateOnScroll(selector, animation) {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element, index) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = index * (animation.stagger || 0);
          
          anime({
            targets: element,
            ...animation,
            delay: animation.delay ? animation.delay + delay : delay,
            complete: () => {
              if (animation.complete) animation.complete();
            }
          });
          
          observer.unobserve(element);
        }
      });
    }, { threshold: animation.threshold || 0.1 });
    
    observer.observe(element);
  });
}

// Morphing SVG animation
export function morphSVG(from, to, options = {}) {
  if (!from || !to) return;
  
  anime({
    targets: from,
    d: [
      { value: from.getAttribute('d') },
      { value: to.getAttribute('d') }
    ],
    duration: options.duration || 1000,
    easing: options.easing || 'easeInOutQuad',
    direction: options.direction || 'normal',
    loop: options.loop || false
  });
}

// Text typing animation
export function typeText(element, text, options = {}) {
  if (!element) return;
  
  element.innerHTML = '';
  const chars = text.split('');
  
  chars.forEach((char, index) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.opacity = '0';
    element.appendChild(span);
  });
  
  anime({
    targets: element.querySelectorAll('span'),
    opacity: [0, 1],
    duration: options.duration || 50,
    delay: anime.stagger(options.delay || 50),
    easing: options.easing || 'easeInOutQuad',
    complete: options.complete
  });
}

// Loading animation
export function showLoading(element) {
  if (!element) return;
  
  const loader = document.createElement('div');
  loader.className = 'loading';
  element.appendChild(loader);
  
  anime({
    targets: loader,
    rotate: 360,
    duration: 1000,
    easing: 'linear',
    loop: true
  });
  
  return loader;
}

export function hideLoading(loader) {
  if (!loader) return;
  
  anime({
    targets: loader,
    opacity: [1, 0],
    scale: [1, 0],
    duration: 300,
    easing: 'easeOutCubic',
    complete: () => {
      loader.remove();
    }
  });
} 