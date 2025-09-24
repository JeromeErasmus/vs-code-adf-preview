import * as vscode from 'vscode';

export class MarkdownADFHoverProvider implements vscode.HoverProvider {
  async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Hover | undefined> {
    const line = document.lineAt(position).text;
    const wordRange = document.getWordRangeAtPosition(position, />\s*[ℹ⚠✅📝❌]\s*\*\*\w+:\*\*/);
    
    if (!wordRange) {
      return undefined;
    }

    const word = document.getText(wordRange);
    
    // Check for ADF panel patterns
    if (word.includes('ℹ️ **Info:**')) {
      return this.createPanelHover('Info Panel', 'Displays information with blue styling in ADF preview', '💙');
    }
    
    if (word.includes('⚠️ **Warning:**')) {
      return this.createPanelHover('Warning Panel', 'Displays warnings with yellow styling in ADF preview', '💛');
    }
    
    if (word.includes('✅ **Success:**')) {
      return this.createPanelHover('Success Panel', 'Displays success messages with green styling in ADF preview', '💚');
    }
    
    if (word.includes('📝 **Note:**')) {
      return this.createPanelHover('Note Panel', 'Displays notes with neutral styling in ADF preview', '🤍');
    }
    
    if (word.includes('❌ **Error:**')) {
      return this.createPanelHover('Error Panel', 'Displays errors with red styling in ADF preview', '❤️');
    }

    return undefined;
  }

  private createPanelHover(title: string, description: string, color: string): vscode.Hover {
    const content = new vscode.MarkdownString();
    content.appendMarkdown(`### ${color} ${title}\n\n`);
    content.appendMarkdown(`${description}\n\n`);
    content.appendMarkdown('---\n\n');
    content.appendMarkdown('This element will be rendered as a styled panel in the ADF preview.');
    content.isTrusted = true;
    
    return new vscode.Hover(content);
  }
}