import * as vscode from 'vscode';
import { MarkdownTemplateManager } from '../templates/markdownTemplateManager';

export class MarkdownADFCompletionProvider implements vscode.CompletionItemProvider {
  private templateManager: MarkdownTemplateManager;

  constructor() {
    this.templateManager = new MarkdownTemplateManager();
  }

  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): Promise<vscode.CompletionItem[]> {
    const linePrefix = document.lineAt(position).text.substr(0, position.character);
    const completions: vscode.CompletionItem[] = [];

    // Check if we're starting a blockquote (which can be ADF panels)
    if (linePrefix.match(/^>\s*$/)) {
      completions.push(...this.getADFPanelCompletions());
    }

    // Check for info/warning/etc typing
    if (linePrefix.match(/^>\s*[ℹ⚠✅📝❌]?$/)) {
      completions.push(...this.getADFPanelCompletions());
    }

    // Check for task list items
    if (linePrefix.match(/^\s*[-*+]\s*$/)) {
      completions.push(this.getTaskItemCompletion());
    }

    // Template completions - trigger when typing "template" or at the beginning of empty document
    if (linePrefix.match(/^template$/i) || (document.getText().trim().length === 0 && linePrefix.match(/^\s*$/))) {
      completions.push(...await this.getTemplateCompletions());
    }

    // General ADF completions
    if (linePrefix.length === 0 || linePrefix.match(/^\s*$/)) {
      completions.push(...this.getGeneralADFCompletions());
    }

    return completions;
  }

  private getADFPanelCompletions(): vscode.CompletionItem[] {
    const panels = [
      {
        label: 'Info Panel',
        insertText: 'ℹ️ **Info:** ${1:Information text}',
        detail: 'ADF Info Panel',
        documentation: 'Insert an information panel with blue styling'
      },
      {
        label: 'Warning Panel',
        insertText: '⚠️ **Warning:** ${1:Warning text}',
        detail: 'ADF Warning Panel',
        documentation: 'Insert a warning panel with yellow styling'
      },
      {
        label: 'Success Panel',
        insertText: '✅ **Success:** ${1:Success text}',
        detail: 'ADF Success Panel',
        documentation: 'Insert a success panel with green styling'
      },
      {
        label: 'Note Panel',
        insertText: '📝 **Note:** ${1:Note text}',
        detail: 'ADF Note Panel',
        documentation: 'Insert a note panel with neutral styling'
      },
      {
        label: 'Error Panel',
        insertText: '❌ **Error:** ${1:Error text}',
        detail: 'ADF Error Panel',
        documentation: 'Insert an error panel with red styling'
      }
    ];

    return panels.map(panel => {
      const item = new vscode.CompletionItem(panel.label, vscode.CompletionItemKind.Snippet);
      item.insertText = new vscode.SnippetString(panel.insertText);
      item.detail = panel.detail;
      item.documentation = new vscode.MarkdownString(panel.documentation);
      item.sortText = 'adf-' + panel.label;
      return item;
    });
  }

  private getTaskItemCompletion(): vscode.CompletionItem {
    const item = new vscode.CompletionItem('Task Item', vscode.CompletionItemKind.Snippet);
    item.insertText = new vscode.SnippetString('[ ] ${1:Task description}');
    item.detail = 'ADF Task List Item';
    item.documentation = new vscode.MarkdownString('Insert a task list checkbox item');
    item.sortText = 'adf-task';
    return item;
  }

  private getGeneralADFCompletions(): vscode.CompletionItem[] {
    const completions = [
      {
        label: 'ADF Table',
        insertText: [
          '| ${1:Header 1} | ${2:Header 2} | ${3:Header 3} |',
          '|-------------|-------------|-------------|',
          '| ${4:Cell 1}   | ${5:Cell 2}   | ${6:Cell 3}   |',
          '| ${7:Cell 4}   | ${8:Cell 5}   | ${9:Cell 6}   |'
        ].join('\n'),
        detail: 'ADF Compatible Table',
        documentation: 'Insert a table structure compatible with ADF rendering'
      },
      {
        label: 'ADF Code Block',
        insertText: '```${1:language}\n${2:code}\n```',
        detail: 'ADF Code Block',
        documentation: 'Insert a code block with syntax highlighting'
      },
      {
        label: 'ADF Link',
        insertText: '[${1:Link text}](${2:https://example.com})',
        detail: 'ADF Link',
        documentation: 'Insert a hyperlink'
      }
    ];

    return completions.map(completion => {
      const item = new vscode.CompletionItem(completion.label, vscode.CompletionItemKind.Snippet);
      item.insertText = new vscode.SnippetString(completion.insertText);
      item.detail = completion.detail;
      item.documentation = new vscode.MarkdownString(completion.documentation);
      item.sortText = 'adf-' + completion.label;
      return item;
    });
  }

  private async getTemplateCompletions(): Promise<vscode.CompletionItem[]> {
    const templates = this.templateManager.getTemplates();
    
    return templates.map(template => {
      const item = new vscode.CompletionItem(template.name, vscode.CompletionItemKind.Snippet);
      item.detail = `Template: ${template.description}`;
      item.documentation = new vscode.MarkdownString(`**${template.name}**\n\n${template.description}\n\n*Category: ${template.category}*`);
      item.insertText = ''; // Will be handled by command
      item.sortText = 'template-' + template.name;
      
      // Add command to create template
      item.command = {
        command: 'adf.insertTemplate',
        title: 'Insert Template',
        arguments: [template.id]
      };
      
      return item;
    });
  }
}