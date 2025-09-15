import * as vscode from 'vscode';
import { ADFCustomEditorProvider } from './providers/adfCustomEditorProvider';
import { ADFValidator } from './validators/adfValidator';
import { ADFDocument } from '../shared/types';

let customEditorProvider: ADFCustomEditorProvider;

export function activate(context: vscode.ExtensionContext) {
  console.log('ADF Preview extension is now active!');

  // Register the custom editor provider
  customEditorProvider = new ADFCustomEditorProvider(context);
  
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
    if (document.languageId !== 'json') {
      vscode.window.showErrorMessage('Current file is not a JSON file');
      return;
    }

    // Open with custom editor
    await vscode.commands.executeCommand('vscode.openWith', document.uri, 'adf.preview');
  });

  const checkAndPreviewCommand = vscode.commands.registerCommand('adf.checkAndPreview', async () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      vscode.window.showErrorMessage('No active editor found');
      return;
    }

    const document = activeEditor.document;
    if (document.languageId !== 'json') {
      vscode.window.showErrorMessage('Current file is not a JSON file');
      return;
    }

    try {
      const content = document.getText();
      const jsonData = JSON.parse(content);
      
      // Check if it's an ADF document
      const validator = new ADFValidator();
      const validationResult = validator.validateDocument(jsonData);
      
      if (validationResult.isValid) {
        // Open with custom editor
        await vscode.commands.executeCommand('vscode.openWith', document.uri, 'adf.preview');
      } else {
        const choice = await vscode.window.showWarningMessage(
          'This JSON file does not appear to be a valid ADF document. Open anyway?',
          'Open',
          'Cancel'
        );
        
        if (choice === 'Open') {
          await vscode.commands.executeCommand('vscode.openWith', document.uri, 'adf.preview');
        }
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Invalid JSON: ${error}`);
    }
  });

  const validateDocumentCommand = vscode.commands.registerCommand('adf.validateDocument', async () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      vscode.window.showErrorMessage('No active editor found');
      return;
    }

    const document = activeEditor.document;
    if (document.languageId !== 'json') {
      vscode.window.showErrorMessage('Current file is not a JSON file');
      return;
    }

    try {
      const content = document.getText();
      const jsonData = JSON.parse(content);
      
      const validator = new ADFValidator();
      const validationResult = validator.validateDocument(jsonData);
      
      if (validationResult.isValid) {
        vscode.window.showInformationMessage('✅ Valid ADF document');
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

  // Register all disposables
  context.subscriptions.push(
    providerRegistration,
    openPreviewCommand,
    checkAndPreviewCommand,
    validateDocumentCommand,
    exportAsHTMLCommand,
    exportAsMarkdownCommand
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