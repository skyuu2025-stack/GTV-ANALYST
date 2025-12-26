
import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root container missing');
}

// Better fallback to prevent "Blank Page" during initial load/auth redirect
const AppLoader = () => (
  <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyCenter: 'center', backgroundColor: '#FDFDFD' }}>
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
      <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#CCC' }}>Initialising...</p>
    </div>
  </div>
);

const root = createRoot(rootElement);

root.render(
  <HelmetProvider>
    <Suspense fallback={<AppLoader />}>
      <App />
    </Suspense>
  </HelmetProvider>
);
