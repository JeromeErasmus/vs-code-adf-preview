import React, { useState, useEffect, useCallback } from 'react';
import { ADFRenderer } from './components/ADFRenderer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorDisplay } from './components/ErrorDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ADFDocument, WebviewMessage, UpdateMessage, ErrorMessage, ValidationError } from '../shared/types';

const App: React.FC = () => {
  const [adfDocument, setAdfDocument] = useState<ADFDocument | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);
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
        
        
        default:
          console.log('Unknown message type:', message.type);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Apply light theme to body
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.className = 'theme-light';
    }
  }, []);

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
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted">Loading ADF document...</p>
      </div>
    );
  }

  // Render error state
  if (errors.length > 0) {
    return (
      <div className="container-fluid p-3">
        <ErrorDisplay errors={errors} />
      </div>
    );
  }

  // Render empty state
  if (!adfDocument) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="alert alert-info" role="alert">
            <h4 className="alert-heading">
              <i className="bi bi-info-circle me-2"></i>
              No ADF Document
            </h4>
            <p>Open a valid ADF file to see the preview.</p>
            <hr />
            <p className="mb-0 small">
              <strong>ADF documents must have:</strong>
            </p>
            <ul className="list-unstyled small mt-2">
              <li><code>type: "doc"</code></li>
              <li><code>version: 1</code></li>
              <li><code>content: [...]</code></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Render document
  return (
    <ErrorBoundary>
      <div className="d-flex flex-column" style={{ height: '100vh' }}>
        {/* Bootstrap Dark Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
          <div className="container-fluid">
            {/* Source Badge */}
            <div className="navbar-brand mb-0 h1">
              <span className="badge badge-small badge-grey me-2">
                <i className={`bi ${fileType === 'md' ? 'bi-markdown' : 'bi-file-text'} me-1`}></i>
                {fileType === 'md' ? 'Markdown' : 'ADF'}
              </span>
            </div>
            
            {/* Navigation Links/Buttons */}
            <div className="navbar-nav ms-auto">
              <div className="nav-item dropdown me-2">
                <button 
                  className="btn btn-outline-light btn-sm dropdown-toggle" 
                  type="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <i className="bi bi-download me-1"></i>
                  Export
                </button>
                <ul className="dropdown-menu dropdown-menu-dark">
                  <li>
                    <button 
                      className="dropdown-item"
                      onClick={() => handleExport('html')}
                      title="Export as HTML"
                    >
                      <i className="bi bi-filetype-html me-2"></i>
                      HTML
                    </button>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item"
                      onClick={() => handleExport('markdown')}
                      title="Export as Markdown"
                    >
                      <i className="bi bi-markdown me-2"></i>
                      Markdown
                    </button>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item"
                      onClick={() => handleExport('json')}
                      title="Export as formatted JSON"
                    >
                      <i className="bi bi-filetype-json me-2"></i>
                      JSON
                    </button>
                  </li>
                </ul>
              </div>
              
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={handleClosePreview}
                title="Close Preview and View Source"
              >
                <i className="bi bi-x-circle me-1"></i>
                View Source
              </button>
            </div>
          </div>
        </nav>
        
        {/* Main Content Area */}
        <div className="flex-grow-1 overflow-auto p-3">
          <ADFRenderer document={adfDocument} />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;