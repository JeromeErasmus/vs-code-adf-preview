import { describe, it } from 'mocha';
import { expect } from 'chai';
import {
  ADFDocument,
  ADFEntity,
  ValidationResult,
  WebviewMessage,
  UpdateMessage,
  ExportMessage,
  ErrorMessage,
  ThemeMessage
} from './types';

describe('Shared Types', () => {
  describe('ADFDocument', () => {
    it('should create valid ADF document structure', () => {
      const doc: ADFDocument = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Hello World'
              }
            ]
          }
        ]
      };

      expect(doc.type).to.equal('doc');
      expect(doc.version).to.equal(1);
      expect(doc.content).to.be.an('array');
      expect(doc.content).to.have.lengthOf(1);
    });

    it('should support nested content structures', () => {
      const doc: ADFDocument = {
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
                    content: [
                      { type: 'text', text: 'Nested item' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      };

      expect(doc.content[0].type).to.equal('bulletList');
      expect(doc.content[0].content![0].type).to.equal('listItem');
      expect(doc.content[0].content![0].content![0].type).to.equal('paragraph');
    });
  });

  describe('ADFEntity', () => {
    it('should support text nodes with marks', () => {
      const textEntity: ADFEntity = {
        type: 'text',
        text: 'Bold text',
        marks: [
          { type: 'strong' },
          { type: 'em' }
        ]
      };

      expect(textEntity.type).to.equal('text');
      expect(textEntity.text).to.equal('Bold text');
      expect(textEntity.marks).to.have.lengthOf(2);
      expect(textEntity.marks![0].type).to.equal('strong');
      expect(textEntity.marks![1].type).to.equal('em');
    });

    it('should support nodes with attributes', () => {
      const headingEntity: ADFEntity = {
        type: 'heading',
        attrs: { level: 2 },
        content: [
          { type: 'text', text: 'Heading text' }
        ]
      };

      expect(headingEntity.type).to.equal('heading');
      expect(headingEntity.attrs!.level).to.equal(2);
      expect(headingEntity.content).to.have.lengthOf(1);
    });

    it('should support complex attributes', () => {
      const statusEntity: ADFEntity = {
        type: 'status',
        attrs: {
          text: 'TODO',
          color: 'blue',
          localId: 'abc123'
        }
      };

      expect(statusEntity.attrs!.text).to.equal('TODO');
      expect(statusEntity.attrs!.color).to.equal('blue');
      expect(statusEntity.attrs!.localId).to.equal('abc123');
    });
  });

  describe('ValidationResult', () => {
    it('should represent valid document result', () => {
      const validResult: ValidationResult = {
        isValid: true,
        errors: [],
        warnings: []
      };

      expect(validResult.isValid).to.be.true;
      expect(validResult.errors).to.be.empty;
      expect(validResult.warnings).to.be.empty;
    });

    it('should represent invalid document result with errors', () => {
      const invalidResult: ValidationResult = {
        isValid: false,
        errors: [
          {
            path: 'content[0].type',
            message: 'Invalid node type',
            line: 5,
            column: 12
          }
        ],
        warnings: [
          {
            path: 'content[1]',
            message: 'Unknown node type',
            line: 10
          }
        ]
      };

      expect(invalidResult.isValid).to.be.false;
      expect(invalidResult.errors).to.have.lengthOf(1);
      expect(invalidResult.warnings).to.have.lengthOf(1);
      expect(invalidResult.errors[0].path).to.equal('content[0].type');
      expect(invalidResult.errors[0].line).to.equal(5);
      expect(invalidResult.errors[0].column).to.equal(12);
    });
  });

  describe('WebviewMessage Types', () => {
    it('should create update message', () => {
      const updateMsg: UpdateMessage = {
        type: 'update',
        payload: {
          document: {
            type: 'doc',
            version: 1,
            content: []
          },
          theme: 'dark',
          fontSize: 16
        }
      };

      expect(updateMsg.type).to.equal('update');
      expect(updateMsg.payload.document.type).to.equal('doc');
      expect(updateMsg.payload.theme).to.equal('dark');
      expect(updateMsg.payload.fontSize).to.equal(16);
    });

    it('should create export message', () => {
      const exportMsg: ExportMessage = {
        type: 'export',
        payload: {
          format: 'html',
          includeStyles: true
        }
      };

      expect(exportMsg.type).to.equal('export');
      expect(exportMsg.payload.format).to.equal('html');
      expect(exportMsg.payload.includeStyles).to.be.true;
    });

    it('should create error message', () => {
      const errorMsg: ErrorMessage = {
        type: 'error',
        payload: {
          errors: [
            { path: 'root', message: 'Document invalid' }
          ],
          warnings: []
        }
      };

      expect(errorMsg.type).to.equal('error');
      expect(errorMsg.payload.errors).to.have.lengthOf(1);
      expect(errorMsg.payload.errors[0].message).to.equal('Document invalid');
    });

    it('should create theme message', () => {
      const themeMsg: ThemeMessage = {
        type: 'theme',
        payload: {
          theme: 'light'
        }
      };

      expect(themeMsg.type).to.equal('theme');
      expect(themeMsg.payload.theme).to.equal('light');
    });

    it('should create generic webview message', () => {
      const genericMsg: WebviewMessage = {
        type: 'ready'
      };

      expect(genericMsg.type).to.equal('ready');
      expect(genericMsg.payload).to.be.undefined;
    });

    it('should create webview message with payload', () => {
      const msgWithPayload: WebviewMessage = {
        type: 'validate',
        payload: { strictMode: true }
      };

      expect(msgWithPayload.type).to.equal('validate');
      expect(msgWithPayload.payload.strictMode).to.be.true;
    });
  });

  describe('Type Guards and Validation', () => {
    it('should validate message type discrimination', () => {
      const messages: WebviewMessage[] = [
        { type: 'ready' },
        { type: 'update', payload: { document: { type: 'doc', version: 1, content: [] } } },
        { type: 'export', payload: { format: 'html' } },
        { type: 'error', payload: { errors: [], warnings: [] } },
        { type: 'theme', payload: { theme: 'dark' } }
      ];

      messages.forEach(msg => {
        expect(['ready', 'update', 'export', 'error', 'theme', 'validate', 'scroll', 'patch']).to.include(msg.type);
      });
    });

    it('should support all export formats', () => {
      const formats: Array<'html' | 'markdown' | 'pdf' | 'json'> = ['html', 'markdown', 'pdf', 'json'];
      
      formats.forEach(format => {
        const exportMsg: ExportMessage = {
          type: 'export',
          payload: { format }
        };
        
        expect(['html', 'markdown', 'pdf', 'json']).to.include(exportMsg.payload.format);
      });
    });

    it('should support all theme options', () => {
      const themes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto'];
      
      themes.forEach(theme => {
        const themeMsg: ThemeMessage = {
          type: 'theme',
          payload: { theme: theme === 'auto' ? 'light' : theme } // auto resolves to light/dark
        };
        
        expect(['light', 'dark']).to.include(themeMsg.payload.theme);
      });
    });
  });

  describe('Complex Document Structures', () => {
    it('should support table with complex attributes', () => {
      const tableDoc: ADFDocument = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'table',
            content: [
              {
                type: 'tableRow',
                content: [
                  {
                    type: 'tableCell',
                    attrs: {
                      colspan: 2,
                      rowspan: 1,
                      background: '#f0f0f0'
                    },
                    content: [
                      {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'Merged cell' }]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      };

      const cell = tableDoc.content[0].content![0].content![0];
      expect(cell.attrs!.colspan).to.equal(2);
      expect(cell.attrs!.rowspan).to.equal(1);
      expect(cell.attrs!.background).to.equal('#f0f0f0');
    });

    it('should support link marks with complex attributes', () => {
      const linkDoc: ADFDocument = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Visit our site',
                marks: [
                  {
                    type: 'link',
                    attrs: {
                      href: 'https://example.com',
                      title: 'Example Site',
                      target: '_blank'
                    }
                  }
                ]
              }
            ]
          }
        ]
      };

      const link = linkDoc.content[0].content![0].marks![0];
      expect(link.attrs!.href).to.equal('https://example.com');
      expect(link.attrs!.title).to.equal('Example Site');
      expect(link.attrs!.target).to.equal('_blank');
    });
  });
});