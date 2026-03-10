// Intersection Observer Module - Handles fade-in animations on scroll

export function initIntersectionObserver() {
  // Check if IntersectionObserver is supported
  if (!('IntersectionObserver' in window)) {
    // Fallback: show all elements immediately
    document.querySelectorAll('.fade-up, .fade-in').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }
  
  // Initialize different observers for different effects
  initFadeObserver();
  initStaggerObserver();
  initProgressObserver();
  initNumberCounterObserver();
}

function initFadeObserver() {
  const fadeElements = document.querySelectorAll('.fade-up, .fade-in');
  
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add delay if specified in data attribute
        const delay = entry.target.dataset.delay || 0;
        
        setTimeout(() => {
          entry.target.classList.add('visible');
          
          // Trigger any callbacks
          const callback = entry.target.dataset.callback;
          if (callback && window[callback]) {
            window[callback](entry.target);
          }
        }, delay);
        
        // Unobserve if not set to repeat
        if (!entry.target.dataset.repeat) {
          fadeObserver.unobserve(entry.target);
        }
      } else if (entry.target.dataset.repeat) {
        entry.target.classList.remove('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  fadeElements.forEach(el => fadeObserver.observe(el));
}

function initStaggerObserver() {
  const staggerContainers = document.querySelectorAll('[data-stagger]');
  
  staggerContainers.forEach(container => {
    const children = container.children;
    const staggerDelay = parseInt(container.dataset.stagger) || 100;
    
    // Add fade-up class to children if not already present
    Array.from(children).forEach((child, index) => {
      if (!child.classList.contains('fade-up') && !child.classList.contains('fade-in')) {
        child.classList.add('fade-up');
      }
      child.dataset.delay = index * staggerDelay;
    });
  });
}

function initProgressObserver() {
  const progressBars = document.querySelectorAll('.progress-bar');
  
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const targetWidth = progressBar.dataset.progress || '100%';
        
        // Animate progress bar
        progressBar.style.width = '0%';
        requestAnimationFrame(() => {
          progressBar.style.transition = 'width 1.5s ease-out';
          progressBar.style.width = targetWidth;
        });
        
        // Show percentage counter if exists
        const counter = progressBar.querySelector('.progress-counter');
        if (counter) {
          animateCounter(counter, 0, parseInt(targetWidth), 1500);
        }
        
        progressObserver.unobserve(progressBar);
      }
    });
  }, {
    threshold: 0.5
  });
  
  progressBars.forEach(bar => progressObserver.observe(bar));
}

function initNumberCounterObserver() {
  const counters = document.querySelectorAll('[data-count]');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.count);
        const duration = parseInt(counter.dataset.duration) || 2000;
        const prefix = counter.dataset.prefix || '';
        const suffix = counter.dataset.suffix || '';
        
        animateCounter(counter, 0, target, duration, prefix, suffix);
        counterObserver.unobserve(counter);
      }
    });
  }, {
    threshold: 0.5
  });
  
  counters.forEach(counter => counterObserver.observe(counter));
}

// Utility function to animate counters
function animateCounter(element, start, end, duration, prefix = '', suffix = '') {
  const startTime = performance.now();
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (end - start) * easeOutQuart);
    
    element.textContent = prefix + current.toLocaleString() + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = prefix + end.toLocaleString() + suffix;
    }
  }
  
  requestAnimationFrame(updateCounter);
}

// Advanced observer for parallax elements
export function initParallaxObserver() {
  const parallaxElements = document.querySelectorAll('[data-parallax-observer]');
  
  const parallaxObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const speed = parseFloat(element.dataset.parallaxObserver) || 0.5;
        
        // Calculate parallax offset based on intersection ratio
        const offset = (1 - entry.intersectionRatio) * 100 * speed;
        element.style.transform = `translateY(${offset}px)`;
      }
    });
  }, {
    threshold: Array.from({ length: 101 }, (_, i) => i / 100)
  });
  
  parallaxElements.forEach(el => parallaxObserver.observe(el));
}

// Text reveal animation observer
export function initTextRevealObserver() {
  const textElements = document.querySelectorAll('[data-text-reveal]');
  
  textElements.forEach(element => {
    // Split text into spans
    const text = element.textContent;
    element.innerHTML = '';
    
    text.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.opacity = '0';
      span.style.display = 'inline-block';
      span.style.transform = 'translateY(20px)';
      span.style.transition = `all 0.5s ease ${index * 30}ms`;
      element.appendChild(span);
    });
  });
  
  const textObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const spans = entry.target.querySelectorAll('span');
        spans.forEach(span => {
          span.style.opacity = '1';
          span.style.transform = 'translateY(0)';
        });
        textObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });
  
  textElements.forEach(el => textObserver.observe(el));
}

// Image lazy loading with blur effect
export function initImageObserver() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        
        // Create a new image to load
        const newImg = new Image();
        newImg.onload = () => {
          img.src = src;
          img.classList.add('loaded');
          img.removeAttribute('data-src');
        };
        newImg.src = src;
        
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px'
  });
  
  images.forEach(img => {
    img.classList.add('lazy-image');
    imageObserver.observe(img);
  });
}

// Initialize advanced observers if needed
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initParallaxObserver();
    initTextRevealObserver();
    initImageObserver();
  });
} else {
  initParallaxObserver();
  initTextRevealObserver();
  initImageObserver();
} 