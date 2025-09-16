import React from 'react';
import { ReactRenderer } from '@atlaskit/renderer';
import { DocNode } from '@atlaskit/adf-schema';
import { ADFDocument } from '../../shared/types';

interface ADFRendererProps {
  document: ADFDocument;
}

export const ADFRenderer: React.FC<ADFRendererProps> = ({ document }) => {
  return (
    <div className="adf-renderer-wrapper">
      <ReactRenderer document={document as unknown as DocNode} />
    </div>
  );
};