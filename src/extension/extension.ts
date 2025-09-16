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
    const isValidFile = document.languageId === 'json' && 
                       document.uri.fsPath.endsWith('.adf.json');
    
    if (!isValidFile) {
      vscode.window.showErrorMessage('Current file is not an ADF JSON file (*.adf.json)');
      return;
    }

    // Open with custom editor
    console.log('Opening custom editor for:', document.uri.fsPath);
    vscode.window.showInformationMessage('Opening ADF Preview...');
    await vscode.commands.executeCommand('vscode.openWith', document.uri, 'adf.preview');
    console.log('Custom editor command executed');
  });

  const checkAndPreviewCommand = vscode.commands.registerCommand('adf.checkAndPreview', async () => {
    // Very first debug message
    vscode.window.showInformationMessage('🚀 ADF: Check and Preview command started!');
    console.log('=== ADF checkAndPreview command executed ===');
    
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      vscode.window.showErrorMessage('No active editor found');
      return;
    }

    const document = activeEditor.document;
    const isValidFile = document.languageId === 'json' && 
                       document.uri.fsPath.endsWith('.adf.json');
    
    if (!isValidFile) {
      vscode.window.showErrorMessage('Current file is not an ADF JSON file (*.adf.json)');
      return;
    }

    try {
      const content = document.getText();
      const jsonData = JSON.parse(content);
      
      console.log('Parsed JSON successfully, opening preview for:', document.uri.fsPath);
      vscode.window.showInformationMessage('Opening ADF Preview...');
      
      // Check if it's an ADF document
      const validator = new ADFValidator();
      const validationResult = validator.validateDocument(jsonData);
      
      if (validationResult.isValid) {
        // Open with custom editor
        console.log('ADF validation passed, executing openWith command');
        await vscode.commands.executeCommand('vscode.openWith', document.uri, 'adf.preview');
        console.log('openWith command completed');
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
      console.error('Error in checkAndPreview command:', error);
      vscode.window.showErrorMessage(`❌ ADF Preview Error: ${error}`);
    }
    
    console.log('=== ADF checkAndPreview command completed ===');
  });

  const validateDocumentCommand = vscode.commands.registerCommand('adf.validateDocument', async () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      vscode.window.showErrorMessage('No active editor found');
      return;
    }

    const document = activeEditor.document;
    const isValidFile = document.languageId === 'json' && 
                       document.uri.fsPath.endsWith('.adf.json');
    
    if (!isValidFile) {
      vscode.window.showErrorMessage('Current file is not an ADF JSON file (*.adf.json)');
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