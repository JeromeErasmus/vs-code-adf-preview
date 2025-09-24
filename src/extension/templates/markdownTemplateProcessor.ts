import * as vscode from 'vscode';
import { MarkdownTemplate, TemplateVariable } from './markdownTemplateManager';

export class MarkdownTemplateProcessor {
  async processTemplate(template: MarkdownTemplate): Promise<string | undefined> {
    if (!template.variables || template.variables.length === 0) {
      return template.content;
    }

    // Show input dialog for variables
    const values = await this.collectVariableValues(template.variables);
    if (!values) {
      return undefined; // User cancelled
    }

    // Process template with substitutions
    let markdownContent = template.content;

    // Replace variables
    for (const [key, value] of Object.entries(values)) {
      const placeholder = `{{${key}}}`;
      markdownContent = markdownContent.replace(new RegExp(placeholder, 'g'), value);
    }

    return markdownContent;
  }

  private async collectVariableValues(variables: TemplateVariable[]): Promise<Record<string, string> | undefined> {
    const values: Record<string, string> = {};

    for (const variable of variables) {
      const value = await this.promptForValue(variable);
      if (value === undefined) {
        return undefined; // User cancelled
      }
      values[variable.key] = value || this.getDefaultValue(variable);
    }

    return values;
  }

  private async promptForValue(variable: TemplateVariable): Promise<string | undefined> {
    switch (variable.type) {
      case 'date':
        if (variable.default === 'today') {
          return new Date().toLocaleDateString();
        }
        return await vscode.window.showInputBox({
          prompt: variable.label,
          placeHolder: variable.placeholder,
          value: variable.default
        });

      case 'select':
        if (variable.options && variable.options.length > 0) {
          return await vscode.window.showQuickPick(variable.options, {
            placeHolder: variable.label
          });
        }
        // Fall through to text input if no options

      case 'text':
      default:
        return await vscode.window.showInputBox({
          prompt: variable.label,
          placeHolder: variable.placeholder,
          value: variable.default
        });
    }
  }

  private getDefaultValue(variable: TemplateVariable): string {
    switch (variable.type) {
      case 'date':
        return variable.default === 'today' ? new Date().toLocaleDateString() : (variable.default || '');
      case 'text':
      case 'select':
      default:
        return variable.default || '';
    }
  }
}