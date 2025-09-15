export interface ADFEntity {
  type: string;
  version?: number;
  content?: ADFEntity[];
  marks?: ADFMark[];
  attrs?: Record<string, any>;
  text?: string;
}

export interface ADFMark {
  type: string;
  attrs?: Record<string, any>;
}

export interface ADFDocument extends ADFEntity {
  type: 'doc';
  version: 1;
  content: ADFEntity[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  path: string;
  message: string;
  line?: number;
  column?: number;
}

export interface ValidationWarning {
  path: string;
  message: string;
  line?: number;
  column?: number;
}

export type MessageType = 
  | 'update'
  | 'patch'
  | 'error'
  | 'export'
  | 'scroll'
  | 'theme'
  | 'validate'
  | 'ready';

export interface WebviewMessage {
  type: MessageType;
  payload?: any;
}

export interface UpdateMessage extends WebviewMessage {
  type: 'update';
  payload: {
    document: ADFDocument;
    theme?: 'light' | 'dark' | 'auto';
    fontSize?: number;
  };
}

export interface ExportMessage extends WebviewMessage {
  type: 'export';
  payload: {
    format: 'html' | 'markdown' | 'pdf' | 'json';
    includeStyles?: boolean;
  };
}

export interface ErrorMessage extends WebviewMessage {
  type: 'error';
  payload: {
    errors: ValidationError[];
    warnings: ValidationWarning[];
  };
}

export interface ThemeMessage extends WebviewMessage {
  type: 'theme';
  payload: {
    theme: 'light' | 'dark' | 'auto';
  };
}

export interface ExportOptions {
  format: 'html' | 'markdown' | 'pdf' | 'json';
  includeStyles?: boolean;
  embedImages?: boolean;
}

export interface ADFPreviewConfig {
  theme: 'auto' | 'light' | 'dark';
  fontSize: number;
  autoUpdate: boolean;
  updateDelay: number;
  includeStyles: boolean;
  strictValidation: boolean;
}