/**
 * Keyboard Navigation Detection Utility
 * Adds class to body when user is navigating with keyboard
 * This allows us to show focus outlines only for keyboard users
 * Improves UX for mouse users while maintaining accessibility
 */

class KeyboardNavigationDetector {
  constructor() {
    this.isTabbing = false;
    this.init();
  }

  init() {
    // Detect when user starts using keyboard
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.enableTabbing();
      }
    });

    // Detect when user starts using mouse
    window.addEventListener('mousedown', () => {
      this.disableTabbing();
    });

    // Also detect touch events for mobile
    window.addEventListener('touchstart', () => {
      this.disableTabbing();
    });
  }

  enableTabbing() {
    if (!this.isTabbing) {
      document.body.classList.add('user-is-tabbing');
      this.isTabbing = true;
    }
  }

  disableTabbing() {
    if (this.isTabbing) {
      document.body.classList.remove('user-is-tabbing');
      this.isTabbing = false;
    }
  }
}

// Initialize on load
if (typeof window !== 'undefined') {
  new KeyboardNavigationDetector();
}

export default KeyboardNavigationDetector;

