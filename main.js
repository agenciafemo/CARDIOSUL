/**
 * Main JS Entry Point
 * Inicializa todos os modules
 */

import { initFAQ } from './modules/faq.js';
import { initNav } from './modules/nav.js';
import { initCookieConsent } from './modules/cookie-consent.js';

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  initFAQ();
  initNav();
  initCookieConsent();

  // Service Worker Registration (Offline cache & PWA readiness)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // navigator.serviceWorker.register('/sw.js').catch(console.error);
    });
  }
});