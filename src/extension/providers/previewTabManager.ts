import * as vscode from 'vscode';
import * as path from 'path';

export class PreviewTabManager {
  private previewPanels: Map<string, vscode.WebviewPanel> = new Map();

  async openPreview(sourceUri: vscode.Uri): Promise<void> {
    const sourceKey = sourceUri.toString();
    
    // Close existing preview for this source to prevent clutter
    const existingPanel = this.previewPanels.get(sourceKey);
    if (existingPanel) {
      existingPanel.dispose();
    }
    
    // Open new preview in current tab group
    try {
      await vscode.commands.executeCommand(
        'vscode.openWith',
        sourceUri,
        'adf.preview'
      );
      
      // Note: We can't directly get the panel from the command above
      // The custom editor provider will handle the webview creation
      console.log(`Preview opened for: ${path.basename(sourceUri.path)}`);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to open preview: ${error}`);
    }
  }

  // Track panels created by the custom editor provider
  registerPanel(sourceUri: vscode.Uri, panel: vscode.WebviewPanel): void {
    const sourceKey = sourceUri.toString();
    
    // Clean up any existing panel
    const existingPanel = this.previewPanels.get(sourceKey);
    if (existingPanel && existingPanel !== panel) {
      existingPanel.dispose();
    }
    
    // Track and cleanup
    this.previewPanels.set(sourceKey, panel);
    panel.onDidDispose(() => {
      this.previewPanels.delete(sourceKey);
    });

    // Clear naming convention
    panel.title = `Preview: ${path.basename(sourceUri.path)}`;
  }

  // Check if preview exists for a source
  hasPreview(sourceUri: vscode.Uri): boolean {
    const sourceKey = sourceUri.toString();
    return this.previewPanels.has(sourceKey);
  }

  // Close preview for a specific source
  closePreview(sourceUri: vscode.Uri): boolean {
    const sourceKey = sourceUri.toString();
    const panel = this.previewPanels.get(sourceKey);
    
    if (panel) {
      panel.dispose();
      return true;
    }
    
    return false;
  }

  // Close all previews
  closeAllPreviews(): void {
    for (const panel of this.previewPanels.values()) {
      panel.dispose();
    }
    this.previewPanels.clear();
  }
}