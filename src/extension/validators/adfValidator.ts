import { ADFDocument, ADFEntity, ValidationResult, ValidationError, ValidationWarning } from '../../shared/types';
import { Parser } from 'extended-markdown-adf-parser';

export class ADFValidator {
  private errors: ValidationError[] = [];
  private warnings: ValidationWarning[] = [];
  private parser: any;

  constructor() {
    // Initialize parser with ADF extensions enabled for validation
    this.parser = new (Parser as any)({ enableAdfExtensions: true });
  }

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
      // Use the extended-markdown-adf-parser to validate the document structure
      try {
        // First try to convert ADF to markdown and back to validate structure
        const markdown = this.parser.adfToMarkdown(data);
        const reconstructedAdf = this.parser.markdownToAdf(markdown);
        
        // If conversion succeeds without throwing, the document structure is valid
        if (!reconstructedAdf || typeof reconstructedAdf !== 'object') {
          this.addError('structure', 'Document structure is invalid - parser could not reconstruct ADF');
        }
      } catch (error) {
        // Parser threw an error, document structure is invalid
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.addError('structure', `Document structure validation failed: ${errorMessage}`);
      }

      // Still run basic node validation for additional checks
      data.content.forEach((node: any, index: number) => {
        this.validateNode(node, `content[${index}]`);
      });
    }

    return this.getResult();
  }

  /**
   * Validates markdown content by attempting to parse it with the extended-markdown-adf-parser
   */
  public validateMarkdown(markdown: string): ValidationResult {
    this.errors = [];
    this.warnings = [];

    try {
      const adfDocument = this.parser.markdownToAdf(markdown);
      
      if (!adfDocument || typeof adfDocument !== 'object') {
        this.addError('', 'Markdown could not be converted to valid ADF document');
      } else if (!adfDocument.content || !Array.isArray(adfDocument.content)) {
        this.addError('content', 'Markdown conversion resulted in document without valid content');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.addError('', `Markdown parsing failed: ${errorMessage}`);
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

    // Basic validation for common issues that the parser might not catch
    if (node.type === 'text' && typeof node.text !== 'string') {
      this.addError(`${path}.text`, 'Text node must have a text property of type string');
    }

    // Validate nested content
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach((child: any, index: number) => {
        this.validateNode(child, `${path}.content[${index}]`);
      });
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