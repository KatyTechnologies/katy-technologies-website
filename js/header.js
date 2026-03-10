// Header Module - Handles navigation, burger menu, and scroll effects

export function initHeader() {
  const header = document.querySelector('.header');
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.overlay');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  if (!header) return;
  
  // Scroll effect on header
  let lastScroll = 0;
  const scrollThreshold = 50;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class
    if (currentScroll > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Hide/show header on scroll (optional)
    if (currentScroll > lastScroll && currentScroll > 100) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
  });
  
  // Burger menu functionality
  if (burger && mobileMenu && overlay) {
    burger.addEventListener('click', toggleMobileMenu);
    overlay.addEventListener('click', closeMobileMenu);
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });
    
    // Close menu when clicking on a link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }
  
  // Active link highlighting
  highlightActiveLink();
  
  // Update active link on scroll
  window.addEventListener('scroll', throttle(highlightActiveSection, 100));
  
  function toggleMobileMenu() {
    const isActive = mobileMenu.classList.contains('active');
    
    if (isActive) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }
  
  function openMobileMenu() {
    burger.classList.add('active');
    mobileMenu.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Trap focus in mobile menu
    trapFocus(mobileMenu);
    
    // Announce to screen readers
    mobileMenu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
  }
  
  function closeMobileMenu() {
    burger.classList.remove('active');
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Release focus trap
    releaseFocus();
    
    // Update aria attributes
    mobileMenu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    
    // Return focus to burger button
    burger.focus();
  }
  
  function highlightActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (href === 'index.html' && currentPath === '')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + header.offsetHeight + 50;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${sectionId}`) {
            link.classList.add('active');
          } else if (href && href.startsWith('#')) {
            link.classList.remove('active');
          }
        });
      }
    });
  }
}

// Focus trap utility
let focusableElements = [];
let firstFocusableElement = null;
let lastFocusableElement = null;

function trapFocus(container) {
  focusableElements = container.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  );
  
  if (focusableElements.length === 0) return;
  
  firstFocusableElement = focusableElements[0];
  lastFocusableElement = focusableElements[focusableElements.length - 1];
  
  container.addEventListener('keydown', handleTabKey);
  firstFocusableElement.focus();
}

function releaseFocus() {
  if (focusableElements.length > 0) {
    const container = firstFocusableElement.closest('.mobile-menu');
    if (container) {
      container.removeEventListener('keydown', handleTabKey);
    }
  }
}

function handleTabKey(e) {
  if (e.key !== 'Tab') return;
  
  if (e.shiftKey) {
    if (document.activeElement === firstFocusableElement) {
      e.preventDefault();
      lastFocusableElement.focus();
    }
  } else {
    if (document.activeElement === lastFocusableElement) {
      e.preventDefault();
      firstFocusableElement.focus();
    }
  }
}

// Throttle utility
function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;
  
  return function (...args) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
} 