import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root container missing');
}

// Single createRoot call for React 18 stability
// StrictMode is disabled to resolve Error #525 and race conditions
const root = createRoot(rootElement);

root.render(
  <HelmetProvider>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </HelmetProvider>
);