import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';
import { initializeGA } from './utils/googleAnalytics';

import './utils/keyboardNavigation';
import { Analytics } from '@vercel/analytics/react';

// Initialize Google Analytics on app load
// Deferred to not block initial render
setTimeout(() => {
  initializeGA();
}, 1000);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
); 