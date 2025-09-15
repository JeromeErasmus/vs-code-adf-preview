import * as vscode from 'vscode';
import * as path from 'path';
import { ADFValidator } from '../validators/adfValidator';
import { ADFDocument, WebviewMessage, UpdateMessage, ExportMessage } from '../../shared/types';
import { exportAsHTML, exportAsMarkdown } from '../utils/exportUtils';

export class ADFCustomEditorProvider implements vscode.CustomTextEditorProvider {
  private static readonly viewType = 'adf.preview';
  private currentDocument: vscode.TextDocument | undefined;
  private currentWebviewPanel: vscode.WebviewPanel | undefined;
  private updateTimer: NodeJS.Timeout | undefined;

  constructor(private readonly context: vscode.ExtensionContext) {}

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    this.currentDocument = document;
    this.currentWebviewPanel = webviewPanel;

    // Setup webview
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, 'dist'),
        vscode.Uri.joinPath(this.context.extensionUri, 'resources')
      ]
    };

    // Set webview HTML content
    webviewPanel.webview.html = this.getWebviewContent(webviewPanel.webview);

    // Handle messages from webview
    webviewPanel.webview.onDidReceiveMessage(
      async (message: WebviewMessage) => {
        await this.handleWebviewMessage(message, document, webviewPanel);
      },
      undefined,
      this.context.subscriptions
    );

    // Handle document changes
    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.uri.toString() === document.uri.toString()) {
        this.updateWebview(document, webviewPanel);
      }
    });

    // Handle webview disposal
    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
      if (this.updateTimer) {
        clearTimeout(this.updateTimer);
      }
      this.currentWebviewPanel = undefined;
    });

    // Initial update
    this.updateWebview(document, webviewPanel);
  }

  private async handleWebviewMessage(
    message: WebviewMessage,
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel
  ): Promise<void> {
    switch (message.type) {
      case 'ready':
        // Webview is ready, send initial content
        this.updateWebview(document, webviewPanel);
        break;

      case 'export':
        const exportMsg = message as ExportMessage;
        await this.handleExport(document, exportMsg.payload.format, exportMsg.payload.includeStyles);
        break;

      case 'validate':
        await this.validateAndShowDiagnostics(document);
        break;

      case 'error':
        vscode.window.showErrorMessage(`ADF Preview Error: ${message.payload}`);
        break;

      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  private updateWebview(document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel): void {
    const config = vscode.workspace.getConfiguration('adf.preview');
    const autoUpdate = config.get<boolean>('autoUpdate', true);
    const updateDelay = config.get<number>('updateDelay', 500);

    if (!autoUpdate) {
      return;
    }

    // Clear existing timer
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }

    // Set new timer for debounced update
    this.updateTimer = setTimeout(() => {
      try {
        const text = document.getText();
        const jsonData = JSON.parse(text);

        // Validate the document
        const validator = new ADFValidator();
        const validationResult = validator.validateDocument(jsonData);

        if (validationResult.isValid) {
          // Send valid document to webview
          const updateMessage: UpdateMessage = {
            type: 'update',
            payload: {
              document: jsonData as ADFDocument,
              theme: config.get<'light' | 'dark' | 'auto'>('theme', 'auto'),
              fontSize: config.get<number>('fontSize', 14)
            }
          };
          webviewPanel.webview.postMessage(updateMessage);
        } else {
          // Send validation errors to webview
          webviewPanel.webview.postMessage({
            type: 'error',
            payload: {
              errors: validationResult.errors,
              warnings: validationResult.warnings
            }
          });
        }
      } catch (error) {
        // JSON parse error
        webviewPanel.webview.postMessage({
          type: 'error',
          payload: {
            errors: [{
              path: '',
              message: `JSON Parse Error: ${error}`
            }],
            warnings: []
          }
        });
      }
    }, updateDelay);
  }

  private async validateAndShowDiagnostics(document: vscode.TextDocument): Promise<void> {
    try {
      const text = document.getText();
      const jsonData = JSON.parse(text);
      
      const validator = new ADFValidator();
      const validationResult = validator.validateDocument(jsonData);
      
      const diagnostics: vscode.Diagnostic[] = [];
      
      // Add errors as diagnostics
      validationResult.errors.forEach(error => {
        const range = new vscode.Range(
          error.line || 0,
          error.column || 0,
          error.line || 0,
          error.column || 0
        );
        diagnostics.push(new vscode.Diagnostic(
          range,
          error.message,
          vscode.DiagnosticSeverity.Error
        ));
      });
      
      // Add warnings as diagnostics
      validationResult.warnings.forEach(warning => {
        const range = new vscode.Range(
          warning.line || 0,
          warning.column || 0,
          warning.line || 0,
          warning.column || 0
        );
        diagnostics.push(new vscode.Diagnostic(
          range,
          warning.message,
          vscode.DiagnosticSeverity.Warning
        ));
      });
      
      const diagnosticCollection = vscode.languages.createDiagnosticCollection('adf');
      diagnosticCollection.set(document.uri, diagnostics);
    } catch (error) {
      vscode.window.showErrorMessage(`Validation failed: ${error}`);
    }
  }

  private async handleExport(
    document: vscode.TextDocument,
    format: 'html' | 'markdown' | 'pdf' | 'json',
    includeStyles?: boolean
  ): Promise<void> {
    try {
      const text = document.getText();
      const jsonData = JSON.parse(text) as ADFDocument;
      
      let exportedContent: string;
      let fileExtension: string;
      
      switch (format) {
        case 'html':
          exportedContent = await exportAsHTML(jsonData, includeStyles);
          fileExtension = 'html';
          break;
        case 'markdown':
          exportedContent = await exportAsMarkdown(jsonData);
          fileExtension = 'md';
          break;
        case 'json':
          exportedContent = JSON.stringify(jsonData, null, 2);
          fileExtension = 'json';
          break;
        default:
          vscode.window.showErrorMessage(`Export format ${format} not yet implemented`);
          return;
      }
      
      // Ask user where to save
      const saveUri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(
          document.uri.fsPath.replace(/\.[^.]+$/, `.${fileExtension}`)
        ),
        filters: {
          [format.toUpperCase()]: [fileExtension]
        }
      });
      
      if (saveUri) {
        await vscode.workspace.fs.writeFile(
          saveUri,
          Buffer.from(exportedContent, 'utf8')
        );
        vscode.window.showInformationMessage(`Exported to ${saveUri.fsPath}`);
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Export failed: ${error}`);
    }
  }

  public async exportDocument(format: 'html' | 'markdown'): Promise<void> {
    if (!this.currentDocument) {
      vscode.window.showErrorMessage('No active ADF document');
      return;
    }
    
    const config = vscode.workspace.getConfiguration('adf.export');
    const includeStyles = config.get<boolean>('includeStyles', true);
    
    await this.handleExport(this.currentDocument, format, includeStyles);
  }

  private getWebviewContent(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'webview', 'bundle.js')
    );
    
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'webview', 'bundle.css')
    );

    const nonce = this.getNonce();

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; 
        style-src ${webview.cspSource} 'unsafe-inline'; 
        script-src 'nonce-${nonce}';
        font-src ${webview.cspSource};
        img-src ${webview.cspSource} https: data:;">
      <link href="${styleUri}" rel="stylesheet">
      <title>ADF Preview</title>
    </head>
    <body>
      <div id="root"></div>
      <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        window.vscode = vscode;
      </script>
      <script nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>`;
  }

  private getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}