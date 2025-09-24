import * as vscode from 'vscode';
import { ADFCustomEditorProvider } from './providers/adfCustomEditorProvider';
import { PreviewTabManager } from './providers/previewTabManager';
import { MarkdownADFCompletionProvider } from './providers/markdownAdfCompletionProvider';
import { MarkdownADFHoverProvider } from './providers/markdownAdfHoverProvider';
import { MarkdownTemplateManager } from './templates/markdownTemplateManager';
import { ADFValidator } from './validators/adfValidator';
import { ADFDocument } from '../shared/types';
import { processContent, detectFileType, FileType } from '../shared/converters/markdownConverter';

let customEditorProvider: ADFCustomEditorProvider;
let previewTabManager: PreviewTabManager;
let templateManager: MarkdownTemplateManager;

export function activate(context: vscode.ExtensionContext) {
  console.log('ADF Preview extension is now active!');

  // Initialize managers
  previewTabManager = new PreviewTabManager();
  templateManager = new MarkdownTemplateManager();
  
  // Register the custom editor provider
  customEditorProvider = new ADFCustomEditorProvider(context);
  
  // Register completion and hover providers for markdown files
  const markdownCompletionProvider = new MarkdownADFCompletionProvider();
  const markdownHoverProvider = new MarkdownADFHoverProvider();
  
  const completionProviderRegistration = vscode.languages.registerCompletionItemProvider(
    { language: 'markdown' },
    markdownCompletionProvider,
    '>', '-', '*', '+'
  );
  
  const hoverProviderRegistration = vscode.languages.registerHoverProvider(
    { language: 'markdown' },
    markdownHoverProvider
  );
  
  const providerRegistration = vscode.window.registerCustomEditorProvider(
    'adf.preview',
    customEditorProvider,
    {
      webviewOptions: {
        retainContextWhenHidden: true,
      },
      supportsMultipleEditorsPerDocument: false,
    }
  );

  // Register commands
  const openPreviewCommand = vscode.commands.registerCommand('adf.openPreview', async () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      vscode.window.showErrorMessage('No active editor found');
      return;
    }

    const document = activeEditor.document;
    const isValidFile = document.uri.fsPath.endsWith('.adf') || document.uri.fsPath.endsWith('.md');
    
    if (!isValidFile) {
      vscode.window.showErrorMessage('Current file is not an ADF or Markdown file (*.adf, *.md)');
      return;
    }

    // Use preview tab manager for smart tab handling
    await previewTabManager.openPreview(document.uri);
  });


  const validateDocumentCommand = vscode.commands.registerCommand('adf.validateDocument', async () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      vscode.window.showErrorMessage('No active editor found');
      return;
    }

    const document = activeEditor.document;
    const isValidFile = document.uri.fsPath.endsWith('.adf') || document.uri.fsPath.endsWith('.md');
    
    if (!isValidFile) {
      vscode.window.showErrorMessage('Current file is not an ADF or Markdown file (*.adf, *.md)');
      return;
    }

    try {
      const content = document.getText();
      const filePath = document.uri.fsPath;
      const fileType = detectFileType(filePath);
      
      let adfDocument: ADFDocument;
      
      if (fileType === FileType.MARKDOWN) {
        // Convert markdown to ADF first
        const conversionResult = await processContent(content, filePath);
        if (!conversionResult.success || !conversionResult.document) {
          vscode.window.showErrorMessage(`Markdown conversion failed: ${conversionResult.error}`);
          return;
        }
        adfDocument = conversionResult.document;
      } else {
        // Parse ADF JSON directly
        adfDocument = JSON.parse(content);
      }
      
      const validator = new ADFValidator();
      const validationResult = validator.validateDocument(adfDocument);
      
      if (validationResult.isValid) {
        const fileTypeLabel = fileType === FileType.MARKDOWN ? 'Markdown' : 'ADF';
        vscode.window.showInformationMessage(`✅ Valid ${fileTypeLabel} document`);
      } else {
        const errorMessages = validationResult.errors.map(e => e.message).join('\n');
        vscode.window.showErrorMessage(`Invalid ADF document:\n${errorMessages}`);
        
        // Create diagnostics for errors
        const diagnostics: vscode.Diagnostic[] = validationResult.errors.map(error => {
          const range = new vscode.Range(
            error.line || 0,
            error.column || 0,
            error.line || 0,
            error.column || 0
          );
          
          return new vscode.Diagnostic(
            range,
            error.message,
            vscode.DiagnosticSeverity.Error
          );
        });
        
        const diagnosticCollection = vscode.languages.createDiagnosticCollection('adf');
        diagnosticCollection.set(document.uri, diagnostics);
        context.subscriptions.push(diagnosticCollection);
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to validate: ${error}`);
    }
  });

  const createMarkdownFromTemplateCommand = vscode.commands.registerCommand('adf.createMarkdownFromTemplate', async () => {
    try {
      const templates = templateManager.getTemplates();
      
      // Show template selection
      const templateItems = templates.map(template => ({
        label: template.name,
        description: template.description,
        detail: `Category: ${template.category}`,
        template: template
      }));

      const selectedItem = await vscode.window.showQuickPick(templateItems, {
        placeHolder: 'Select a template to create a new markdown document'
      });

      if (!selectedItem) {
        return; // User cancelled
      }

      // Process template
      const content = await templateManager.createFromTemplate(selectedItem.template.id);
      if (!content) {
        return; // User cancelled during variable input
      }

      // Create new untitled document
      const document = await vscode.workspace.openTextDocument({
        content: content,
        language: 'markdown'
      });

      // Show the document
      await vscode.window.showTextDocument(document);
      
      vscode.window.showInformationMessage(`Created ${selectedItem.template.name} document`);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to create template: ${error}`);
    }
  });

  const exportAsHTMLCommand = vscode.commands.registerCommand('adf.exportAsHTML', async () => {
    if (customEditorProvider) {
      await customEditorProvider.exportDocument('html');
    }
  });

  const exportAsMarkdownCommand = vscode.commands.registerCommand('adf.exportAsMarkdown', async () => {
    if (customEditorProvider) {
      await customEditorProvider.exportDocument('markdown');
    }
  });

  const closePreviewCommand = vscode.commands.registerCommand('adf.closePreview', async () => {
    if (customEditorProvider) {
      const success = await customEditorProvider.closeActivePreview();
      if (!success) {
        vscode.window.showInformationMessage('No active ADF preview to close');
      }
    } else {
      vscode.window.showErrorMessage('ADF extension not properly initialized');
    }
  });

  // Test command to verify extension is loading
  const testCommand = vscode.commands.registerCommand('adf.test', () => {
    vscode.window.showInformationMessage('ADF Extension is loaded and working!');
  });

  // Debug log command
  const debugLogCommand = vscode.commands.registerCommand('adf.debugLog', async () => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ADF Debug Log - Extension is working\n`;
    
    try {
      const fs = require('fs');
      const path = require('path');
      const logPath = path.join(__dirname, '..', '..', 'adf-debug.log');
      fs.appendFileSync(logPath, logMessage);
      vscode.window.showInformationMessage(`Debug log written to: ${logPath}`);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to write debug log: ${error}`);
    }
  });

  // Register all disposables
  context.subscriptions.push(
    testCommand,
    debugLogCommand,
    providerRegistration,
    completionProviderRegistration,
    hoverProviderRegistration,
    openPreviewCommand,
    validateDocumentCommand,
    createMarkdownFromTemplateCommand,
    exportAsHTMLCommand,
    exportAsMarkdownCommand,
    closePreviewCommand
  );

  // Auto-detect ADF files
  vscode.workspace.onDidOpenTextDocument(async (document: vscode.TextDocument) => {
    if (document.languageId === 'json') {
      try {
        const content = document.getText();
        const jsonData = JSON.parse(content);
        
        // Quick check for ADF structure
        if (jsonData.type === 'doc' && jsonData.version === 1) {
          const shouldOpen = await vscode.window.showInformationMessage(
            'This appears to be an ADF document. Would you like to open it in the ADF Preview?',
            'Yes',
            'No'
          );
          
          if (shouldOpen === 'Yes') {
            await vscode.commands.executeCommand('vscode.openWith', document.uri, 'adf.preview');
          }
        }
      } catch {
        // Not valid JSON or not ADF, ignore
      }
    }
  });
}

export function deactivate() {
  console.log('ADF Preview extension deactivated');
}