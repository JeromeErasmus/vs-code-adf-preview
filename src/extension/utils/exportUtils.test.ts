import { describe, it } from 'mocha';
import { expect } from 'chai';
import { exportAsHTML, exportAsMarkdown } from './exportUtils';
import { ADFDocument } from '../../shared/types';

describe('ExportUtils', () => {
  const sampleDoc: ADFDocument = {
    type: 'doc',
    version: 1,
    content: [
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [
          { type: 'text', text: 'Sample Document' }
        ]
      },
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'This is a ' },
          {
            type: 'text',
            text: 'bold',
            marks: [{ type: 'strong' }]
          },
          { type: 'text', text: ' word and an ' },
          {
            type: 'text',
            text: 'italic',
            marks: [{ type: 'em' }]
          },
          { type: 'text', text: ' word.' }
        ]
      }
    ]
  };

  describe('exportAsHTML', () => {
    it('should export basic ADF document to HTML', async () => {
      const result = await exportAsHTML(sampleDoc, false);

      expect(result).to.be.a('string');
      expect(result).to.include('<h1>Sample Document</h1>');
      expect(result).to.include('<p>');
      expect(result).to.include('<strong>bold</strong>');
      expect(result).to.include('<em>italic</em>');
    });

    it('should export with full HTML document when includeStyles is true', async () => {
      const result = await exportAsHTML(sampleDoc, true);

      expect(result).to.include('<!DOCTYPE html>');
      expect(result).to.include('<html lang="en">');
      expect(result).to.include('<head>');
      expect(result).to.include('<style>');
      expect(result).to.include('<body>');
      expect(result).to.include('</html>');
    });

    it('should handle empty document', async () => {
      const emptyDoc: ADFDocument = {
        type: 'doc',
        version: 1,
        content: []
      };

      const result = await exportAsHTML(emptyDoc, false);
      expect(result).to.equal('');
    });

    it('should convert text with multiple marks', async () => {
      const docWithMarks: ADFDocument = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Bold and italic',
                marks: [
                  { type: 'strong' },
                  { type: 'em' }
                ]
              }
            ]
          }
        ]
      };

      const result = await exportAsHTML(docWithMarks, false);
      expect(result).to.include('<strong><em>Bold and italic</em></strong>');
    });

    it('should convert links with href', async () => {
      const docWithLink: ADFDocument = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Visit Google',
                marks: [
                  {
                    type: 'link',
                    attrs: { href: 'https://google.com' }
                  }
                ]
              }
            ]
          }
        ]
      };

      const result = await exportAsHTML(docWithLink, false);
      expect(result).to.include('<a href="https://google.com">Visit Google</a>');
    });

    it('should convert bullet lists', async () => {
      const docWithList: ADFDocument = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Item 1' }]
                  }
                ]
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Item 2' }]
                  }
                ]
              }
            ]
          }
        ]
      };

      const result = await exportAsHTML(docWithList, false);
      expect(result).to.include('<ul>');
      expect(result).to.include('<li><p>Item 1</p></li>');
      expect(result).to.include('<li><p>Item 2</p></li>');
      expect(result).to.include('</ul>');
    });

    it('should convert panels with panelType', async () => {
      const docWithPanel: ADFDocument = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'panel',
            attrs: { panelType: 'info' },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Info message' }]
              }
            ]
          }
        ]
      };

      const result = await exportAsHTML(docWithPanel, false);
      expect(result).to.include('<div class="panel panel-info">');
      expect(result).to.include('Info message');
    });

    it('should handle status elements', async () => {
      const docWithStatus: ADFDocument = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'status',
                attrs: {
                  text: 'TODO',
                  color: 'blue'
                }
              }
            ]
          }
        ]
      };

      const result = await exportAsHTML(docWithStatus, false);
      expect(result).to.include('<span class="status status-blue">TODO</span>');
    });

    it('should escape HTML characters', async () => {
      const docWithSpecialChars: ADFDocument = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: '<script>alert("test")</script>' }
            ]
          }
        ]
      };

      const result = await exportAsHTML(docWithSpecialChars, false);
      expect(result).to.include('&lt;script&gt;');
      expect(result).to.include('&quot;test&quot;');
      expect(result).not.to.include('<script>');
    });
  });

  describe('exportAsMarkdown', () => {
    it('should export basic ADF document to Markdown', async () => {
      const result = await exportAsMarkdown(sampleDoc);

      expect(result).to.be.a('string');
      expect(result).to.include('# Sample Document');
      expect(result).to.include('**bold**');
      expect(result).to.include('*italic*');
    });

    it('should handle empty document', async () => {
      const emptyDoc: ADFDocument = {
        type: 'doc',
        version: 1,
        content: []
      };

      const result = await exportAsMarkdown(emptyDoc);
      expect(result).to.equal('');
    });

    it('should convert headings with proper levels', async () => {
      const docWithHeadings: ADFDocument = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'H1' }]
          },
          {
            type: 'heading',
            attrs: { level: 3 },
            content: [{ type: 'text', text: 'H3' }]
          }
        ]
      };

      const result = await exportAsMarkdown(docWithHeadings);
      expect(result).to.include('# H1');
      expect(result).to.include('### H3');
    });

    it('should convert bullet lists', async () => {
      const docWithList: ADFDocument = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Item 1' }]
                  }
                ]
              }
            ]
          }
        ]
      };

      const result = await exportAsMarkdown(docWithList);
      expect(result).to.include('- Item 1');
    });

    it('should convert ordered lists', async () => {
      const docWithOrderedList: ADFDocument = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'orderedList',
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'First item' }]
                  }
                ]
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Second item' }]
                  }
                ]
              }
            ]
          }
        ]
      };

      const result = await exportAsMarkdown(docWithOrderedList);
      expect(result).to.include('1. First item');
      expect(result).to.include('2. Second item');
    });

    it('should convert code blocks', async () => {
      const docWithCodeBlock: ADFDocument = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'codeBlock',
            attrs: { language: 'javascript' },
            content: [
              { type: 'text', text: 'console.log("Hello");' }
            ]
          }
        ]
      };

      const result = await exportAsMarkdown(docWithCodeBlock);
      expect(result).to.include('```javascript');
      expect(result).to.include('console.log("Hello");');
      expect(result).to.include('```');
    });

    it('should convert blockquotes', async () => {
      const docWithBlockquote: ADFDocument = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'blockquote',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Quoted text' }]
              }
            ]
          }
        ]
      };

      const result = await exportAsMarkdown(docWithBlockquote);
      expect(result).to.include('> Quoted text');
    });

    it('should convert panels to blockquotes with icons', async () => {
      const docWithPanel: ADFDocument = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'panel',
            attrs: { panelType: 'warning' },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Warning message' }]
              }
            ]
          }
        ]
      };

      const result = await exportAsMarkdown(docWithPanel);
      expect(result).to.include('> ⚠️ **WARNING**');
      expect(result).to.include('> Warning message');
    });

    it('should convert links', async () => {
      const docWithLink: ADFDocument = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Google',
                marks: [
                  {
                    type: 'link',
                    attrs: { href: 'https://google.com', title: 'Search Engine' }
                  }
                ]
              }
            ]
          }
        ]
      };

      const result = await exportAsMarkdown(docWithLink);
      expect(result).to.include('[Google](https://google.com "Search Engine")');
    });

    it('should convert status to uppercase brackets', async () => {
      const docWithStatus: ADFDocument = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'status',
                attrs: { text: 'todo', color: 'blue' }
              }
            ]
          }
        ]
      };

      const result = await exportAsMarkdown(docWithStatus);
      expect(result).to.include('[TODO]');
    });
  });
});