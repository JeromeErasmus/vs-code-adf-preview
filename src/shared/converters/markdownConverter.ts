import { ADFDocument } from '../types';
import { Parser } from 'extended-markdown-adf-parser';

// Create a parser instance with ADF extensions enabled
// TypeScript definitions don't reflect v1.2.2 API yet, so use type assertion
const parser = new (Parser as any)({ enableAdfExtensions: true });

export enum FileType {
  ADF = 'adf',
  MARKDOWN = 'md'
}

export interface ConversionResult {
  success: boolean;
  document?: ADFDocument;
  error?: string;
  fileType: FileType;
}

/**
 * Detects the file type based on file extension
 */
export function detectFileType(filePath: string): FileType {
  const extension = filePath.split('.').pop()?.toLowerCase();
  return extension === 'md' ? FileType.MARKDOWN : FileType.ADF;
}

/**
 * Converts markdown content to ADF document
 */
export async function convertMarkdownToAdf(markdown: string): Promise<ConversionResult> {
  try {
    // Use sync method with parser configured with ADF extensions
    const adfDocument = parser.markdownToAdf(markdown);
    
    // If document has no content, create a simple fallback
    if (!adfDocument.content || adfDocument.content.length === 0) {
      // Create a simple paragraph with the markdown text
      const fallbackDocument = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: markdown
              }
            ]
          }
        ]
      };
      
      return {
        success: true,
        document: fallbackDocument as ADFDocument,
        fileType: FileType.MARKDOWN
      };
    }
    
    return {
      success: true,
      document: adfDocument as ADFDocument,
      fileType: FileType.MARKDOWN
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to convert markdown: ${error instanceof Error ? error.message : String(error)}`,
      fileType: FileType.MARKDOWN
    };
  }
}

/**
 * Converts ADF document to markdown
 */
export async function convertAdfToMarkdown(adfDocument: ADFDocument): Promise<string> {
  try {
    return parser.adfToMarkdown(adfDocument);
  } catch (error) {
    throw new Error(`Failed to convert ADF to markdown: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Unified content processor for both ADF and Markdown files
 */
export async function processContent(content: string, filePath: string): Promise<ConversionResult> {
  const fileType = detectFileType(filePath);
  
  if (fileType === FileType.MARKDOWN) {
    // Convert markdown to ADF for rendering
    return convertMarkdownToAdf(content);
  } else {
    // Parse ADF JSON directly
    try {
      const adfDocument = JSON.parse(content) as ADFDocument;
      
      // Basic validation
      if (!adfDocument.type || adfDocument.type !== 'doc') {
        return {
          success: false,
          error: 'Invalid ADF document: missing or incorrect type',
          fileType: FileType.ADF
        };
      }
      
      return {
        success: true,
        document: adfDocument,
        fileType: FileType.ADF
      };
    } catch (error) {
      return {
        success: false,
        error: `Invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
        fileType: FileType.ADF
      };
    }
  }
}

/**
 * Creates a fallback ADF document with error message
 */
export function createFallbackDocument(content: string, error: string): ADFDocument {
  return {
    type: 'doc',
    version: 1,
    content: [
      {
        type: 'panel',
        attrs: {
          panelType: 'error'
        },
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `Error: ${error}`
              }
            ]
          }
        ]
      },
      {
        type: 'codeBlock',
        attrs: {
          language: 'text'
        },
        content: [
          {
            type: 'text',
            text: content
          }
        ]
      }
    ]
  };
}