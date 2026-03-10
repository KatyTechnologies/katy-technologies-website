// Forms Module - Handles form validation and submission

export function initForms() {
  // Initialize contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    initContactForm(contactForm);
  }
  
  // Initialize careers form
  const careersForm = document.getElementById('careers-form');
  if (careersForm) {
    initCareersForm(careersForm);
  }
  
  // Initialize all form inputs for real-time validation
  initFormInputs();
}

function initContactForm(form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm(form)) {
      return;
    }
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    
    try {
      // Since this is a static site, we'll use a service like Formspree or EmailJS
      // For now, we'll simulate sending
      await simulateEmailSend(data, 'sales@katytechnologies.com');
      
      // Show success message
      showMessage(form, 'success', 'Thank you! Your message has been sent successfully.');
      form.reset();
      
    } catch (error) {
      showMessage(form, 'error', 'Sorry, there was an error sending your message. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

function initCareersForm(form) {
  // Handle file upload preview
  const resumeInput = form.querySelector('input[type="file"]');
  if (resumeInput) {
    resumeInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const fileInfo = form.querySelector('.file-info');
        if (fileInfo) {
          fileInfo.textContent = `Selected: ${file.name} (${formatFileSize(file.size)})`;
        }
      }
    });
  }
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm(form)) {
      return;
    }
    
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span> Submitting...';
    
    try {
      // Simulate form submission
      await simulateFormSubmit(formData);
      
      // Show success message
      showMessage(form, 'success', 'Thank you for your application! We will review it and get back to you soon.');
      form.reset();
      
      // Clear file info
      const fileInfo = form.querySelector('.file-info');
      if (fileInfo) {
        fileInfo.textContent = '';
      }
      
    } catch (error) {
      showMessage(form, 'error', 'Sorry, there was an error submitting your application. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

function initFormInputs() {
  // Email validation
  const emailInputs = document.querySelectorAll('input[type="email"]');
  emailInputs.forEach(input => {
    input.addEventListener('blur', () => validateEmail(input));
  });
  
  // Phone validation
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    input.addEventListener('blur', () => validatePhone(input));
    input.addEventListener('input', (e) => formatPhone(e.target));
  });
  
  // Required field validation
  const requiredInputs = document.querySelectorAll('[required]');
  requiredInputs.forEach(input => {
    input.addEventListener('blur', () => validateRequired(input));
  });
  
  // Clear error on input
  const allInputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');
  allInputs.forEach(input => {
    input.addEventListener('input', () => {
      const formGroup = input.closest('.form-group');
      if (formGroup && formGroup.classList.contains('error')) {
        formGroup.classList.remove('error');
      }
    });
  });
}

// Validation functions
function validateForm(form) {
  let isValid = true;
  
  // Validate all required fields
  const requiredFields = form.querySelectorAll('[required]');
  requiredFields.forEach(field => {
    if (!validateRequired(field)) {
      isValid = false;
    }
  });
  
  // Validate email fields
  const emailFields = form.querySelectorAll('input[type="email"]');
  emailFields.forEach(field => {
    if (!validateEmail(field)) {
      isValid = false;
    }
  });
  
  // Validate phone fields
  const phoneFields = form.querySelectorAll('input[type="tel"]');
  phoneFields.forEach(field => {
    if (field.value && !validatePhone(field)) {
      isValid = false;
    }
  });
  
  return isValid;
}

function validateRequired(input) {
  const formGroup = input.closest('.form-group');
  const errorElement = formGroup.querySelector('.form-error');
  
  if (!input.value.trim()) {
    formGroup.classList.add('error');
    if (errorElement) {
      errorElement.textContent = 'This field is required';
    }
    return false;
  }
  
  formGroup.classList.remove('error');
  return true;
}

function validateEmail(input) {
  const formGroup = input.closest('.form-group');
  const errorElement = formGroup.querySelector('.form-error');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (input.value && !emailRegex.test(input.value)) {
    formGroup.classList.add('error');
    if (errorElement) {
      errorElement.textContent = 'Please enter a valid email address';
    }
    return false;
  }
  
  if (input.hasAttribute('required')) {
    return validateRequired(input);
  }
  
  formGroup.classList.remove('error');
  return true;
}

function validatePhone(input) {
  const formGroup = input.closest('.form-group');
  const errorElement = formGroup.querySelector('.form-error');
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  const cleanPhone = input.value.replace(/\D/g, '');
  
  if (input.value && (!phoneRegex.test(input.value) || cleanPhone.length < 10)) {
    formGroup.classList.add('error');
    if (errorElement) {
      errorElement.textContent = 'Please enter a valid phone number';
    }
    return false;
  }
  
  formGroup.classList.remove('error');
  return true;
}

function formatPhone(input) {
  let value = input.value.replace(/\D/g, '');
  let formattedValue = '';
  
  if (value.length > 0) {
    if (value.length <= 3) {
      formattedValue = value;
    } else if (value.length <= 6) {
      formattedValue = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value.length <= 10) {
      formattedValue = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
    } else {
      formattedValue = `+${value.slice(0, value.length - 10)} (${value.slice(-10, -7)}) ${value.slice(-7, -4)}-${value.slice(-4)}`;
    }
  }
  
  input.value = formattedValue;
}

// Message display
function showMessage(form, type, message) {
  // Remove any existing messages
  const existingMessage = form.querySelector('.message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create new message element
  const messageEl = document.createElement('div');
  messageEl.className = `message message-${type}`;
  messageEl.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      ${type === 'success' 
        ? '<path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-1 15l-5-5 1.41-1.41L9 12.17l6.59-6.59L17 7l-8 8z"/>'
        : '<path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15h-2v-2h2v2zm0-4h-2V5h2v6z"/>'}
    </svg>
    <span>${message}</span>
  `;
  
  // Insert message before the form
  form.parentNode.insertBefore(messageEl, form);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    messageEl.remove();
  }, 5000);
  
  // Scroll to message
  messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Utility functions
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Simulate email sending (replace with actual email service)
async function simulateEmailSend(data, recipient) {
  // In a real implementation, you would use:
  // - EmailJS: https://www.emailjs.com/
  // - Formspree: https://formspree.io/
  // - Netlify Forms: https://www.netlify.com/products/forms/
  // - Custom backend API
  
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Email sent to ${recipient}:`, data);
      resolve();
    }, 1500);
  });
}

// Simulate form submission
async function simulateFormSubmit(formData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Form submitted:', Object.fromEntries(formData));
      resolve();
    }, 1500);
  });
}

// Export validation functions for use in other modules
export { validateEmail, validatePhone, validateRequired }; 