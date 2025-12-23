import React, { Component, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
  errorInfo: any;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Critical React Error Boundary Caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error instanceof Error 
        ? this.state.error.message 
        : typeof this.state.error === 'string' 
          ? this.state.error 
          : "A rendering synchronization mismatch occurred (Error #525).";

      return (
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Inter, sans-serif', backgroundColor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '540px', width: '100%', padding: '20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🛡️</div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#000', marginBottom: '16px', letterSpacing: '-0.03em' }}>System Shield</h1>
            <p style={{ color: '#666', marginBottom: '32px', fontSize: '14px', lineHeight: '1.6' }}>
              The application encountered a synchronization issue. This happens when UI state transitions occur outside of prioritized frames.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '40px' }}>
              <button 
                onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href = '/'; }}
                style={{ padding: '16px 32px', background: '#000', color: '#fff', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '11px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              >
                Full Reset & Restart
              </button>
            </div>
            <div style={{ textAlign: 'left', background: '#f8f8f8', padding: '20px', borderRadius: '20px', border: '1px solid #eee' }}>
              <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#999', marginBottom: '10px', letterSpacing: '0.1em' }}>Trace Diagnostics:</p>
              <pre style={{ fontSize: '11px', color: '#444', overflow: 'auto', whiteSpace: 'pre-wrap', maxHeight: '150px', fontFamily: 'monospace' }}>
                {errorMsg}
                {'\n\n'}
                {this.state.errorInfo ? `Trace: ${this.state.errorInfo.componentStack}` : ''}
              </pre>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <HelmetProvider>
        <ErrorBoundary>
          <Suspense fallback={
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDFDFD' }}>
              <div className="spin-loader" style={{ width: '32px', height: '32px', border: '3px solid #f3f3f3', borderTop: '3px solid #000', borderRadius: '50%' }}></div>
            </div>
          }>
            <App />
          </Suspense>
        </ErrorBoundary>
      </HelmetProvider>
    </React.StrictMode>
  );
}