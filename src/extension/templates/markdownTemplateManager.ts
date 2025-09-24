import * as vscode from 'vscode';
import * as path from 'path';

export interface MarkdownTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  category: 'meeting' | 'requirements' | 'technical' | 'general';
  variables?: TemplateVariable[];
}

export interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'date' | 'select';
  default?: string;
  placeholder?: string;
  options?: string[];
}

export class MarkdownTemplateManager {
  private templates: MarkdownTemplate[] = [
    {
      id: 'meeting-notes',
      name: 'Meeting Notes',
      description: 'Standard meeting notes template with ADF elements',
      category: 'meeting',
      variables: [
        {
          key: 'MEETING_TITLE',
          label: 'Meeting Title',
          type: 'text',
          placeholder: 'Weekly Team Meeting'
        },
        {
          key: 'DATE',
          label: 'Meeting Date',
          type: 'date',
          default: 'today'
        },
        {
          key: 'ATTENDEES',
          label: 'Attendees',
          type: 'text',
          placeholder: 'John Doe, Jane Smith'
        }
      ],
      content: `# {{MEETING_TITLE}}

> ℹ️ **Info:** 
> Date: {{DATE}}
> Attendees: {{ATTENDEES}}

## Agenda
- Item 1
- Item 2

## Discussion

## Action Items
- [ ] Action 1
- [ ] Action 2

## Next Steps`
    },
    {
      id: 'requirements-doc',
      name: 'Requirements Document',
      description: 'Technical requirements document template',
      category: 'requirements',
      variables: [
        {
          key: 'PROJECT_NAME',
          label: 'Project Name',
          type: 'text',
          placeholder: 'My Project'
        },
        {
          key: 'VERSION',
          label: 'Version',
          type: 'text',
          default: '1.0'
        }
      ],
      content: `# {{PROJECT_NAME}} Requirements

> 📝 **Note:** This document outlines the requirements for {{PROJECT_NAME}} v{{VERSION}}

## Overview

## Functional Requirements

### Core Features
- [ ] Feature 1
- [ ] Feature 2

## Non-Functional Requirements

### Performance
- Response time: < 200ms
- Throughput: 1000 requests/second

### Security
- Authentication required
- Data encryption at rest

## Success Criteria

> ✅ **Success:** All requirements must be met before release`
    },
    {
      id: 'technical-spec',
      name: 'Technical Specification',
      description: 'Technical specification document template',
      category: 'technical',
      variables: [
        {
          key: 'FEATURE_NAME',
          label: 'Feature Name',
          type: 'text',
          placeholder: 'User Authentication'
        }
      ],
      content: `# {{FEATURE_NAME}} - Technical Specification

## Overview

## Architecture

### Components

### Data Flow

## Implementation Details

### API Endpoints

### Database Schema

## Testing Strategy

> ⚠️ **Warning:** All tests must pass before deployment

## Deployment Plan

## Rollback Strategy`
    },
    {
      id: 'status-report',
      name: 'Status Report',
      description: 'Weekly/monthly status report template',
      category: 'general',
      variables: [
        {
          key: 'REPORT_PERIOD',
          label: 'Report Period',
          type: 'text',
          placeholder: 'Week of March 1-7, 2024'
        },
        {
          key: 'TEAM_NAME',
          label: 'Team Name',
          type: 'text',
          placeholder: 'Development Team'
        }
      ],
      content: `# {{TEAM_NAME}} Status Report

> 📝 **Note:** Status report for {{REPORT_PERIOD}}

## Accomplishments

### Completed Tasks
- [ ] Task 1
- [ ] Task 2

## Current Progress

### In Progress
- Work item 1 (50% complete)
- Work item 2 (75% complete)

## Upcoming Work

### Next Sprint
- [ ] Planned task 1
- [ ] Planned task 2

## Issues & Blockers

> ⚠️ **Warning:** No critical blockers at this time

## Metrics

| Metric | Value |
|--------|--------|
| Sprint Velocity | 32 points |
| Bug Count | 3 |
| Test Coverage | 85% |`
    }
  ];

  getTemplates(): MarkdownTemplate[] {
    return [...this.templates];
  }

  getTemplatesByCategory(category: string): MarkdownTemplate[] {
    return this.templates.filter(template => template.category === category);
  }

  getTemplateById(id: string): MarkdownTemplate | undefined {
    return this.templates.find(template => template.id === id);
  }

  async createFromTemplate(templateId: string): Promise<string | undefined> {
    const template = this.getTemplateById(templateId);
    if (!template) {
      return undefined;
    }

    let content = template.content;

    // Process variables if any
    if (template.variables && template.variables.length > 0) {
      const values = await this.collectVariableValues(template.variables);
      if (!values) {
        return undefined; // User cancelled
      }

      // Replace variables
      for (const [key, value] of Object.entries(values)) {
        const placeholder = `{{${key}}}`;
        content = content.replace(new RegExp(placeholder, 'g'), value);
      }
    }

    return content;
  }

  private async collectVariableValues(variables: TemplateVariable[]): Promise<Record<string, string> | undefined> {
    const values: Record<string, string> = {};

    for (const variable of variables) {
      const value = await this.promptForValue(variable);
      if (value === undefined) {
        return undefined; // User cancelled
      }
      values[variable.key] = value;
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
}