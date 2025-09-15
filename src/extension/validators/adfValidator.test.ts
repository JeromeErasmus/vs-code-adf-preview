import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import { ADFValidator } from './adfValidator';
import { ADFDocument } from '../../shared/types';

describe('ADFValidator', () => {
  let validator: ADFValidator;

  beforeEach(() => {
    validator = new ADFValidator();
  });

  describe('validateDocument', () => {
    it('should validate a simple valid ADF document', () => {
      const validDoc: ADFDocument = {
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

      const result = validator.validateDocument(validDoc);

      expect(result.isValid).to.be.true;
      expect(result.errors).to.be.empty;
      expect(result.warnings).to.be.empty;
    });

    it('should reject document without type', () => {
      const invalidDoc = {
        version: 1,
        content: []
      };

      const result = validator.validateDocument(invalidDoc);

      expect(result.isValid).to.be.false;
      expect(result.errors).to.have.lengthOf(1);
      expect(result.errors[0].path).to.equal('type');
      expect(result.errors[0].message).to.include('must be "doc"');
    });

    it('should reject document with wrong version', () => {
      const invalidDoc = {
        type: 'doc',
        version: 2,
        content: []
      };

      const result = validator.validateDocument(invalidDoc);

      expect(result.isValid).to.be.false;
      expect(result.errors).to.have.lengthOf(1);
      expect(result.errors[0].path).to.equal('version');
      expect(result.errors[0].message).to.include('must be 1');
    });

    it('should reject document without content array', () => {
      const invalidDoc = {
        type: 'doc',
        version: 1
      };

      const result = validator.validateDocument(invalidDoc);

      expect(result.isValid).to.be.false;
      expect(result.errors).to.have.lengthOf(1);
      expect(result.errors[0].path).to.equal('content');
      expect(result.errors[0].message).to.include('content array');
    });

    it('should reject non-object input', () => {
      const result = validator.validateDocument('invalid');

      expect(result.isValid).to.be.false;
      expect(result.errors).to.have.lengthOf(1);
      expect(result.errors[0].message).to.include('valid JSON object');
    });

    it('should validate heading with correct level', () => {
      const validDoc: ADFDocument = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'heading',
            attrs: { level: 3 },
            content: [
              { type: 'text', text: 'Heading' }
            ]
          }
        ]
      };

      const result = validator.validateDocument(validDoc);

      expect(result.isValid).to.be.true;
    });

    it('should reject heading with invalid level', () => {
      const invalidDoc = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'heading',
            attrs: { level: 7 }, // Invalid level
            content: [
              { type: 'text', text: 'Heading' }
            ]
          }
        ]
      };

      const result = validator.validateDocument(invalidDoc);

      expect(result.isValid).to.be.false;
      expect(result.errors[0].message).to.include('between 1 and 6');
    });

    it('should validate text node with marks', () => {
      const validDoc: ADFDocument = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Bold text',
                marks: [
                  { type: 'strong' },
                  { type: 'em' }
                ]
              }
            ]
          }
        ]
      };

      const result = validator.validateDocument(validDoc);

      expect(result.isValid).to.be.true;
    });

    it('should reject text node without text property', () => {
      const invalidDoc = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text' } // Missing text property
            ]
          }
        ]
      };

      const result = validator.validateDocument(invalidDoc);

      expect(result.isValid).to.be.false;
      expect(result.errors[0].message).to.include('text property');
    });

    it('should validate panel with panelType', () => {
      const validDoc: ADFDocument = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'panel',
            attrs: { panelType: 'info' },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Info panel' }]
              }
            ]
          }
        ]
      };

      const result = validator.validateDocument(validDoc);

      expect(result.isValid).to.be.true;
    });

    it('should validate list structures', () => {
      const validDoc: ADFDocument = {
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

      const result = validator.validateDocument(validDoc);

      expect(result.isValid).to.be.true;
    });

    it('should validate table structure', () => {
      const validDoc: ADFDocument = {
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
                    type: 'tableHeader',
                    content: [
                      {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'Header' }]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      };

      const result = validator.validateDocument(validDoc);

      expect(result.isValid).to.be.true;
    });

    it('should warn about unknown node types', () => {
      const docWithUnknownNode = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'unknownType',
            content: []
          }
        ]
      };

      const result = validator.validateDocument(docWithUnknownNode);

      expect(result.isValid).to.be.true; // Should still be valid
      expect(result.warnings).to.have.lengthOf(1);
      expect(result.warnings[0].message).to.include('Unknown node type');
    });

    it('should validate status node', () => {
      const validDoc: ADFDocument = {
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

      const result = validator.validateDocument(validDoc);

      expect(result.isValid).to.be.true;
    });

    it('should reject status node without required attributes', () => {
      const invalidDoc = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'status',
                attrs: {
                  text: 'TODO'
                  // Missing color
                }
              }
            ]
          }
        ]
      };

      const result = validator.validateDocument(invalidDoc);

      expect(result.isValid).to.be.false;
      expect(result.errors[0].message).to.include('text and color');
    });
  });
});