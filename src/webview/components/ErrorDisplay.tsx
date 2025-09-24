import React from 'react';
import { ValidationError } from '../../shared/types';

interface ErrorDisplayProps {
  errors: ValidationError[];
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errors }) => {
  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Validation Errors
          </h4>
          <p className="mb-3">The document contains the following validation errors:</p>
          
          <div className="list-group mb-3">
            {errors.map((error, index) => (
              <div key={index} className="list-group-item list-group-item-danger">
                <div className="d-flex w-100 justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <h6 className="mb-1 text-danger">
                      <code>{error.path || 'root'}</code>
                    </h6>
                    <p className="mb-1">{error.message}</p>
                    {error.line !== undefined && (
                      <small className="text-muted">
                        <i className="bi bi-geo-alt me-1"></i>
                        Line {error.line}
                      </small>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="alert alert-info" role="alert">
          <h6 className="alert-heading">
            <i className="bi bi-lightbulb me-2"></i>
            Tips for fixing ADF documents:
          </h6>
          <ul className="mb-0 small">
            <li>Ensure the root object has <code>type: "doc"</code> and <code>version: 1</code></li>
            <li>Check that all nodes have required properties</li>
            <li>Verify that content arrays contain valid node objects</li>
            <li>Make sure text nodes have a <code>"text"</code> property</li>
          </ul>
        </div>
      </div>
    </div>
  );
};