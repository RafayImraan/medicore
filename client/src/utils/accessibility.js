// Accessibility utilities and helpers

// Generate unique IDs for ARIA attributes
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Focus management utilities
export const focusManagement = {
  // Move focus to first focusable element
  focusFirst: (container) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  },

  // Move focus to last focusable element
  focusLast: (container) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  },

  // Trap focus within container
  trapFocus: (container, event) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }
};

// Screen reader announcements
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';

  document.body.appendChild(announcement);
  announcement.textContent = message;

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Keyboard navigation helpers
export const keyboardNavigation = {
  // Handle arrow key navigation for lists
  handleArrowKeys: (event, items, currentIndex, setCurrentIndex) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setCurrentIndex(Math.min(currentIndex + 1, items.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setCurrentIndex(Math.max(currentIndex - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        setCurrentIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setCurrentIndex(items.length - 1);
        break;
    }
  },

  // Handle Enter/Space for selection
  handleSelection: (event, callback) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  }
};

// Color contrast utilities
export const colorContrast = {
  // Calculate relative luminance
  getRelativeLuminance: (color) => {
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;

    const [r, g, b] = rgb.map(c => {
      c = parseInt(c) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },

  // Calculate contrast ratio
  getContrastRatio: (color1, color2) => {
    const l1 = colorContrast.getRelativeLuminance(color1);
    const l2 = colorContrast.getRelativeLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  },

  // Check if contrast meets WCAG standards
  meetsWCAG: (ratio, level = 'AA') => {
    if (level === 'AAA') {
      return ratio >= 7;
    }
    return ratio >= 4.5;
  }
};

// Skip link functionality
export const skipLinks = {
  // Initialize skip links
  init: () => {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
};

// Form accessibility helpers
export const formAccessibility = {
  // Associate labels with inputs
  associateLabel: (inputId, labelText) => {
    const input = document.getElementById(inputId);
    if (input) {
      const label = document.querySelector(`label[for="${inputId}"]`);
      if (!label) {
        const newLabel = document.createElement('label');
        newLabel.htmlFor = inputId;
        newLabel.textContent = labelText;
        newLabel.className = 'sr-only'; // Screen reader only
        input.parentNode.insertBefore(newLabel, input);
      }
    }
  },

  // Add error announcements
  announceError: (fieldId, errorMessage) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', `${fieldId}-error`);
      announceToScreenReader(errorMessage, 'assertive');
    }
  },

  // Clear error announcements
  clearError: (fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    }
  }
};

// High contrast mode detection
export const highContrastMode = {
  // Check if high contrast mode is enabled
  isEnabled: () => {
    const testElement = document.createElement('div');
    testElement.style.color = 'rgb(31, 41, 55)'; // Tailwind gray-800
    testElement.style.backgroundColor = 'rgb(255, 255, 255)';
    document.body.appendChild(testElement);

    const computedStyle = window.getComputedStyle(testElement);
    const isHighContrast = computedStyle.color === computedStyle.backgroundColor;

    document.body.removeChild(testElement);
    return isHighContrast;
  }
};

// Reduced motion preference
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Focus visible polyfill for older browsers
export const focusVisible = {
  init: () => {
    const hadKeyboardEvent = true;
    const hadFocusVisibleRecently = false;
    const hadFocusVisibleRecentlyTimeout = null;

    const inputTypesWhitelist = {
      text: true,
      search: true,
      url: true,
      tel: true,
      email: true,
      password: true,
      number: true,
      date: true,
      month: true,
      week: true,
      time: true,
      datetime: true,
      'datetime-local': true
    };

    const addFocusVisibleClass = (el) => {
      el.classList.add('focus-visible');
    };

    const removeFocusVisibleClass = (el) => {
      el.classList.remove('focus-visible');
    };

    const onKeyDown = (e) => {
      if (e.metaKey || e.altKey || e.ctrlKey) return;

      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    };

    const onPointerDown = () => {
      document.body.classList.remove('keyboard-navigation');
    };

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('mousedown', onPointerDown, true);
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('touchstart', onPointerDown, true);
  }
};

export default {
  generateId,
  focusManagement,
  announceToScreenReader,
  keyboardNavigation,
  colorContrast,
  skipLinks,
  formAccessibility,
  highContrastMode,
  prefersReducedMotion,
  focusVisible
};
