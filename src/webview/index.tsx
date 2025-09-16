import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/main.css';

declare global {
  interface Window {
    vscode: {
      postMessage: (message: any) => void;
      getState: () => any;
      setState: (state: any) => void;
    };
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

function initializeApp() {
  console.log('Initializing ADF Preview app...');
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }

  console.log('Root element found, creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  
  console.log('Rendering React app...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  console.log('React app rendered, notifying extension...');
  // Notify extension that webview is ready
  if (window.vscode) {
    window.vscode.postMessage({ type: 'ready' });
    console.log('Ready message sent to extension');
  } else {
    console.error('vscode API not available');
  }
}