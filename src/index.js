import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import analyticsManager from './utils/analytics/analyticsManager';
import { initializePerformanceMonitoring } from './utils/analytics/performanceMonitoring';

// Initialize Performance Monitoring
initializePerformanceMonitoring();

// Initialize Analytics (deferred to not block initial render)
setTimeout(() => {
  analyticsManager.initialize();
}, 1000);

// Register Service Worker for offline support and caching
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 