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
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }

  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // Notify extension that webview is ready
  if (window.vscode) {
    window.vscode.postMessage({ type: 'ready' });
  }
}