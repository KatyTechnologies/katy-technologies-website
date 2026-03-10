// Main JavaScript Module
import { initHeader } from './header.js';
import { initAnimations } from './animations.js';
import { initForms } from './forms.js';
import { initIntersectionObserver } from './intersection-observer.js';

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize header functionality
  initHeader();
  
  // Initialize animations
  initAnimations();
  
  // Initialize forms if they exist on the page
  initForms();
  
  // Initialize intersection observer for fade-in animations
  initIntersectionObserver();
  
  // Initialize team member expandable bios
  initTeamMembers();
  
  // Add smooth scroll behavior for anchor links
  initSmoothScroll();
  
  // Initialize page-specific functionality
  initPageSpecific();
});

// Team member expandable bios
function initTeamMembers() {
  const teamMembers = document.querySelectorAll('.team-member');
  
  teamMembers.forEach(member => {
    member.addEventListener('click', () => {
      member.classList.toggle('expanded');
      
      // Update aria-expanded attribute for accessibility
      const isExpanded = member.classList.contains('expanded');
      member.setAttribute('aria-expanded', isExpanded);
    });
    
    // Add keyboard support
    member.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        member.classList.toggle('expanded');
        const isExpanded = member.classList.contains('expanded');
        member.setAttribute('aria-expanded', isExpanded);
      }
    });
  });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerHeight - 20;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without jumping
        history.pushState(null, null, href);
        
        // Focus management for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  });
}

// Page-specific initialization
function initPageSpecific() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  switch (currentPage) {
    case 'index.html':
    case '':
      initHomePage();
      break;
    case 'solutions.html':
      initSolutionsPage();
      break;
    case 'about.html':
      initAboutPage();
      break;
    case 'careers.html':
      initCareersPage();
      break;
    case 'contact.html':
      initContactPage();
      break;
  }
}

// Home page specific functionality
function initHomePage() {
  // Add any home page specific JS here
  console.log('Home page initialized');
}

// Solutions page with scroll-snap gallery
function initSolutionsPage() {
  const gallery = document.querySelector('.solutions-gallery');
  if (!gallery) return;
  
  // Add scroll indicators
  const solutions = gallery.querySelectorAll('.solution-card');
  const indicatorContainer = document.createElement('div');
  indicatorContainer.className = 'scroll-indicators';
  
  solutions.forEach((_, index) => {
    const indicator = document.createElement('button');
    indicator.className = 'scroll-indicator';
    indicator.setAttribute('aria-label', `Go to solution ${index + 1}`);
    
    indicator.addEventListener('click', () => {
      solutions[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
    
    indicatorContainer.appendChild(indicator);
  });
  
  gallery.parentElement.appendChild(indicatorContainer);
  
  // Update active indicator on scroll
  gallery.addEventListener('scroll', () => {
    const scrollPosition = gallery.scrollLeft;
    const cardWidth = solutions[0].offsetWidth + parseInt(getComputedStyle(gallery).gap);
    const activeIndex = Math.round(scrollPosition / cardWidth);
    
    indicatorContainer.querySelectorAll('.scroll-indicator').forEach((indicator, index) => {
      indicator.classList.toggle('active', index === activeIndex);
    });
  });
  
  // Set initial active indicator
  indicatorContainer.querySelector('.scroll-indicator')?.classList.add('active');
}

// About page functionality
function initAboutPage() {
  console.log('About page initialized');
}

// Careers page functionality
function initCareersPage() {
  console.log('Careers page initialized');
}

// Contact page functionality
function initContactPage() {
  console.log('Contact page initialized');
}

// Performance optimization: lazy load images
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

// Initialize lazy loading
initLazyLoading();

// Service Worker registration for offline support
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
  navigator.serviceWorker.register('/sw.js').catch(() => {
    console.log('Service Worker registration failed');
  });
} 