import React from 'react';
import { ValidationError } from '../../shared/types';

interface ErrorDisplayProps {
  errors: ValidationError[];
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errors }) => {
  return (
    <div className="error-display">
      <h2>❌ Validation Errors</h2>
      <p>The document contains the following validation errors:</p>
      <ul className="error-list">
        {errors.map((error, index) => (
          <li key={index} className="error-item">
            <span className="error-path">{error.path || 'root'}</span>
            <span className="error-message">{error.message}</span>
            {error.line !== undefined && (
              <span className="error-location">Line {error.line}</span>
            )}
          </li>
        ))}
      </ul>
      <div className="error-help">
        <p>💡 Tips for fixing ADF documents:</p>
        <ul>
          <li>Ensure the root object has type: "doc" and version: 1</li>
          <li>Check that all nodes have required properties</li>
          <li>Verify that content arrays contain valid node objects</li>
          <li>Make sure text nodes have a "text" property</li>
        </ul>
      </div>
    </div>
  );
};