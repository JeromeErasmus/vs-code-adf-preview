import { ADFDocument, ADFEntity, ValidationResult, ValidationError, ValidationWarning } from '../../shared/types';

export class ADFValidator {
  private errors: ValidationError[] = [];
  private warnings: ValidationWarning[] = [];

  public validateDocument(data: any): ValidationResult {
    this.errors = [];
    this.warnings = [];

    // Check if it's a valid object
    if (!data || typeof data !== 'object') {
      this.addError('', 'Document must be a valid JSON object');
      return this.getResult();
    }

    // Check for required ADF document properties
    if (data.type !== 'doc') {
      this.addError('type', `Document type must be "doc", found "${data.type}"`);
    }

    if (data.version !== 1) {
      this.addError('version', `Document version must be 1, found "${data.version}"`);
    }

    // Validate content array
    if (!Array.isArray(data.content)) {
      this.addError('content', 'Document must have a content array');
    } else {
      // Validate each content node
      data.content.forEach((node: any, index: number) => {
        this.validateNode(node, `content[${index}]`);
      });
    }

    return this.getResult();
  }

  private validateNode(node: any, path: string): void {
    if (!node || typeof node !== 'object') {
      this.addError(path, 'Node must be a valid object');
      return;
    }

    if (!node.type) {
      this.addError(`${path}.type`, 'Node must have a type property');
      return;
    }

    // Validate based on node type
    switch (node.type) {
      case 'paragraph':
      case 'heading':
      case 'bulletList':
      case 'orderedList':
      case 'blockquote':
      case 'codeBlock':
      case 'panel':
      case 'rule':
      case 'table':
        this.validateBlockNode(node, path);
        break;
      
      case 'text':
        this.validateTextNode(node, path);
        break;
      
      case 'emoji':
      case 'mention':
      case 'inlineCard':
      case 'status':
        this.validateInlineNode(node, path);
        break;
      
      case 'listItem':
      case 'tableRow':
      case 'tableCell':
      case 'tableHeader':
        this.validateStructuralNode(node, path);
        break;
      
      case 'media':
      case 'mediaGroup':
      case 'mediaSingle':
        this.validateMediaNode(node, path);
        break;
      
      default:
        this.addWarning(`${path}.type`, `Unknown node type: ${node.type}`);
    }

    // Validate marks if present
    if (node.marks && Array.isArray(node.marks)) {
      node.marks.forEach((mark: any, index: number) => {
        this.validateMark(mark, `${path}.marks[${index}]`);
      });
    }

    // Validate nested content
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach((child: any, index: number) => {
        this.validateNode(child, `${path}.content[${index}]`);
      });
    }
  }

  private validateBlockNode(node: ADFEntity, path: string): void {
    // Block nodes can have content
    if (node.content && !Array.isArray(node.content)) {
      this.addError(`${path}.content`, 'Block node content must be an array');
    }

    // Validate specific block node attributes
    switch (node.type) {
      case 'heading':
        if (!node.attrs || typeof node.attrs.level !== 'number') {
          this.addError(`${path}.attrs.level`, 'Heading must have a numeric level attribute');
        } else if (node.attrs.level < 1 || node.attrs.level > 6) {
          this.addError(`${path}.attrs.level`, 'Heading level must be between 1 and 6');
        }
        break;
      
      case 'codeBlock':
        if (node.attrs && node.attrs.language && typeof node.attrs.language !== 'string') {
          this.addError(`${path}.attrs.language`, 'Code block language must be a string');
        }
        break;
      
      case 'panel':
        if (!node.attrs || !node.attrs.panelType) {
          this.addWarning(`${path}.attrs.panelType`, 'Panel should have a panelType attribute');
        }
        break;
    }
  }

  private validateTextNode(node: ADFEntity, path: string): void {
    if (typeof node.text !== 'string') {
      this.addError(`${path}.text`, 'Text node must have a text property of type string');
    }

    // Text nodes should not have content
    if (node.content) {
      this.addError(`${path}.content`, 'Text nodes should not have content property');
    }
  }

  private validateInlineNode(node: ADFEntity, path: string): void {
    // Validate attrs based on node type
    if (!node.attrs) {
      this.addError(`${path}.attrs`, `${node.type} node must have attrs`);
      return;
    }

    switch (node.type) {
      case 'emoji':
        if (!node.attrs.shortName || !node.attrs.id) {
          this.addError(`${path}.attrs`, 'Emoji must have shortName and id attributes');
        }
        break;
      
      case 'mention':
        if (!node.attrs.id) {
          this.addError(`${path}.attrs.id`, 'Mention must have an id attribute');
        }
        break;
      
      case 'status':
        if (!node.attrs.text || !node.attrs.color) {
          this.addError(`${path}.attrs`, 'Status must have text and color attributes');
        }
        break;
    }
  }

  private validateStructuralNode(node: ADFEntity, path: string): void {
    // These nodes must have content
    if (!node.content || !Array.isArray(node.content)) {
      this.addError(`${path}.content`, `${node.type} must have content array`);
    }

    // Validate table structure
    if (node.type === 'tableCell' || node.type === 'tableHeader') {
      if (node.attrs && node.attrs.colspan && typeof node.attrs.colspan !== 'number') {
        this.addError(`${path}.attrs.colspan`, 'Colspan must be a number');
      }
      if (node.attrs && node.attrs.rowspan && typeof node.attrs.rowspan !== 'number') {
        this.addError(`${path}.attrs.rowspan`, 'Rowspan must be a number');
      }
    }
  }

  private validateMediaNode(node: ADFEntity, path: string): void {
    if (!node.attrs) {
      this.addError(`${path}.attrs`, 'Media node must have attrs');
      return;
    }

    if (node.type === 'media') {
      if (!node.attrs.id && !node.attrs.url) {
        this.addError(`${path}.attrs`, 'Media must have either id or url attribute');
      }
      if (!node.attrs.type) {
        this.addError(`${path}.attrs.type`, 'Media must have a type attribute');
      }
    }
  }

  private validateMark(mark: any, path: string): void {
    if (!mark || typeof mark !== 'object') {
      this.addError(path, 'Mark must be a valid object');
      return;
    }

    if (!mark.type) {
      this.addError(`${path}.type`, 'Mark must have a type property');
      return;
    }

    // Validate known mark types
    const validMarkTypes = [
      'strong', 'em', 'underline', 'strike', 'code',
      'link', 'textColor', 'backgroundColor', 'subsup'
    ];

    if (!validMarkTypes.includes(mark.type)) {
      this.addWarning(`${path}.type`, `Unknown mark type: ${mark.type}`);
    }

    // Validate mark-specific attributes
    if (mark.type === 'link' && (!mark.attrs || !mark.attrs.href)) {
      this.addError(`${path}.attrs.href`, 'Link mark must have href attribute');
    }

    if (mark.type === 'textColor' && (!mark.attrs || !mark.attrs.color)) {
      this.addError(`${path}.attrs.color`, 'TextColor mark must have color attribute');
    }
  }

  private addError(path: string, message: string): void {
    this.errors.push({ path, message });
  }

  private addWarning(path: string, message: string): void {
    this.warnings.push({ path, message });
  }

  private getResult(): ValidationResult {
    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }
}