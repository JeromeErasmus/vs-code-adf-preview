import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });

    // Send error to extension
    if (window.vscode) {
      window.vscode.postMessage({
        type: 'error',
        payload: `Rendering error: ${error.message}`
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <h2>⚠️ Rendering Error</h2>
          <p>Something went wrong while rendering the ADF document.</p>
          {this.state.error && (
            <details className="error-details">
              <summary>Error Details</summary>
              <pre>{this.state.error.toString()}</pre>
              {this.state.errorInfo && (
                <pre>{this.state.errorInfo.componentStack}</pre>
              )}
            </details>
          )}
          <button 
            className="retry-button"
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}