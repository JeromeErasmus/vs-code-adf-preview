import React from 'react';
import { Renderer } from '@atlaskit/renderer';
import { ADFDocument } from '../../shared/types';

interface ADFRendererProps {
  document: ADFDocument;
}

export const ADFRenderer: React.FC<ADFRendererProps> = ({ document }) => {
  // The @atlaskit/renderer handles all the complex rendering logic
  // It provides 100% fidelity with Confluence rendering
  return (
    <div className="adf-renderer-wrapper">
      <Renderer 
        document={document}
        appearance="full-page"
        allowHeadingAnchorLinks={true}
        allowColumnSorting={true}
        allowCopyToClipboard={true}
        useSpecBasedValidator={true}
      />
    </div>
  );
};