import React from 'react';
import { ADFDocument } from '../../shared/types';

interface ADFRendererProps {
  document: ADFDocument;
}

export const ADFRenderer: React.FC<ADFRendererProps> = ({ document }) => {
  // Temporary simple renderer until we resolve @atlaskit/renderer import issues
  // This provides basic ADF rendering while we work on the dependency issues
  
  const renderContent = (content: any[]): React.ReactNode => {
    return content.map((node, index) => {
      switch (node.type) {
        case 'paragraph':
          return <p key={index}>{node.content?.map((child: any) => child.text).join('')}</p>;
        case 'heading':
          const HeadingTag = `h${node.attrs?.level || 1}` as keyof JSX.IntrinsicElements;
          return <HeadingTag key={index}>{node.content?.map((child: any) => child.text).join('')}</HeadingTag>;
        case 'text':
          return <span key={index}>{node.text}</span>;
        case 'bulletList':
          return (
            <ul key={index}>
              {node.content?.map((item: any, i: number) => (
                <li key={i}>{renderContent(item.content)}</li>
              ))}
            </ul>
          );
        case 'orderedList':
          return (
            <ol key={index}>
              {node.content?.map((item: any, i: number) => (
                <li key={i}>{renderContent(item.content)}</li>
              ))}
            </ol>
          );
        case 'codeBlock':
          return (
            <pre key={index} className={`language-${node.attrs?.language || ''}`}>
              <code>{node.content?.map((child: any) => child.text).join('')}</code>
            </pre>
          );
        case 'rule':
          return <hr key={index} />;
        case 'hardBreak':
          return <br key={index} />;
        default:
          return <div key={index} className="unknown-node">Unsupported node type: {node.type}</div>;
      }
    });
  };

  return (
    <div className="adf-renderer-wrapper">
      <div className="temp-renderer">
        <div className="notice">
          ⚠️ <strong>Development Mode:</strong> Using simplified renderer. Full @atlaskit/renderer integration coming soon.
        </div>
        {document.content && renderContent(document.content)}
      </div>
    </div>
  );
};