import React, { useState, useEffect, useCallback } from 'react';
import { ADFRenderer } from './components/ADFRenderer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorDisplay } from './components/ErrorDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ADFDocument, WebviewMessage, UpdateMessage, ErrorMessage, ValidationError } from '../shared/types';

const App: React.FC = () => {
  const [adfDocument, setAdfDocument] = useState<ADFDocument | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [fontSize, setFontSize] = useState<number>(14);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fileType, setFileType] = useState<'adf' | 'md'>('adf');

  // Handle messages from extension
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message: WebviewMessage = event.data;
      
      switch (message.type) {
        case 'update': {
          const updateMsg = message as UpdateMessage;
          setAdfDocument(updateMsg.payload.document);
          setErrors([]);
          if (updateMsg.payload.theme) {
            // Always default to light mode, even for 'auto'
            setTheme(updateMsg.payload.theme === 'auto' ? 'light' : updateMsg.payload.theme);
          }
          if (updateMsg.payload.fontSize) {
            setFontSize(updateMsg.payload.fontSize);
          }
          if (updateMsg.payload.fileType) {
            setFileType(updateMsg.payload.fileType);
          }
          setIsLoading(false);
          break;
        }
        
        case 'error': {
          const errorMsg = message as ErrorMessage;
          setErrors(errorMsg.payload.errors);
          setIsLoading(false);
          break;
        }
        
        case 'theme': {
          const newTheme = message.payload.theme;
          // Always default to light mode, even for 'auto'
          setTheme(newTheme === 'auto' ? 'light' : newTheme);
          break;
        }
        
        default:
          console.log('Unknown message type:', message.type);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Note: detectTheme function removed - now always default to light mode

  // Apply theme to body
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.className = `theme-${theme}`;
    }
  }, [theme]);

  // Apply font size
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--adf-font-size', `${fontSize}px`);
    }
  }, [fontSize]);

  // Handle export request
  const handleExport = useCallback((format: 'html' | 'markdown' | 'pdf' | 'json') => {
    if (window.vscode) {
      window.vscode.postMessage({
        type: 'export',
        payload: { format }
      });
    }
  }, []);

  // Handle close preview
  const handleClosePreview = useCallback(() => {
    if (window.vscode) {
      window.vscode.postMessage({
        type: 'closePreview'
      });
    }
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <div className="adf-preview-container loading">
        <LoadingSpinner />
        <p>Loading ADF document...</p>
      </div>
    );
  }

  // Render error state
  if (errors.length > 0) {
    return (
      <div className="adf-preview-container error">
        <ErrorDisplay errors={errors} />
      </div>
    );
  }

  // Render empty state
  if (!adfDocument) {
    return (
      <div className="adf-preview-container empty">
        <div className="empty-state">
          <h2>No ADF Document</h2>
          <p>Open a valid ADF file to see the preview.</p>
          <p className="hint">ADF documents must have:</p>
          <ul className="hint-list">
            <li>type: "doc"</li>
            <li>version: 1</li>
            <li>content: [...]</li>
          </ul>
        </div>
      </div>
    );
  }

  // Render document
  return (
    <ErrorBoundary>
      <div className="adf-preview-container">
        <div className="adf-preview-toolbar">
          <div className="toolbar-group">
            <span className="toolbar-label">Source:</span>
            <span className={`file-type-badge ${fileType}`}>
              {fileType === 'md' ? '📝 Markdown' : '📄 ADF'}
            </span>
          </div>
          <div className="toolbar-group">
            <button 
              className="toolbar-button close-button"
              onClick={handleClosePreview}
              title="Close Preview and View Source"
            >
              ✕ View Source
            </button>
          </div>
          <div className="toolbar-group">
            <button 
              className="toolbar-button"
              onClick={() => handleExport('html')}
              title="Export as HTML"
            >
              📄 HTML
            </button>
            <button 
              className="toolbar-button"
              onClick={() => handleExport('markdown')}
              title="Export as Markdown"
            >
              📝 Markdown
            </button>
            <button 
              className="toolbar-button"
              onClick={() => handleExport('json')}
              title="Export as formatted JSON"
            >
              🔧 JSON
            </button>
          </div>
          <div className="toolbar-group">
            <span className="toolbar-label">Theme:</span>
            <select 
              className="toolbar-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
        <div className="adf-preview-content">
          <ADFRenderer document={adfDocument} />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;