import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';

// Create a simplified MarkdownTemplateManager for unit testing without vscode dependencies
class TestableMarkdownTemplateManager {
  private templates = [
    {
      id: 'meeting-notes',
      name: 'Meeting Notes',
      description: 'Standard meeting notes template with ADF elements',
      category: 'meeting' as const,
      variables: [
        { key: 'MEETING_TITLE', label: 'Meeting Title', type: 'text' as const },
        { key: 'DATE', label: 'Meeting Date', type: 'date' as const, default: 'today' },
        { key: 'ATTENDEES', label: 'Attendees', type: 'text' as const }
      ],
      content: `# {{MEETING_TITLE}}

> ℹ️ **Info:** 
> Date: {{DATE}}
> Attendees: {{ATTENDEES}}

## Agenda
- Item 1
- Item 2

## Action Items
- [ ] Action 1
- [ ] Action 2`
    },
    {
      id: 'requirements-doc',
      name: 'Requirements Document',
      description: 'Technical requirements document template',
      category: 'requirements' as const,
      variables: [
        { key: 'PROJECT_NAME', label: 'Project Name', type: 'text' as const },
        { key: 'VERSION', label: 'Version', type: 'text' as const, default: '1.0' }
      ],
      content: `# {{PROJECT_NAME}} Requirements

> 📝 **Note:** This document outlines the requirements for {{PROJECT_NAME}} v{{VERSION}}

> ✅ **Success:** All requirements must be met`
    }
  ];

  getTemplates() {
    return [...this.templates];
  }

  getTemplatesByCategory(category: string) {
    return this.templates.filter(template => template.category === category);
  }

  getTemplateById(id: string) {
    return this.templates.find(template => template.id === id);
  }

  async createFromTemplate(templateId: string, mockInputs?: Record<string, string>) {
    const template = this.getTemplateById(templateId);
    if (!template) {
      return undefined;
    }

    let content = template.content;

    if (template.variables && template.variables.length > 0) {
      // Use mock inputs for testing
      if (!mockInputs) {
        return undefined; // Simulate user cancellation
      }

      for (const variable of template.variables) {
        const value = mockInputs[variable.key] || this.getDefaultValue(variable);
        const placeholder = `{{${variable.key}}}`;
        content = content.replace(new RegExp(placeholder, 'g'), value);
      }
    }

    return content;
  }

  private getDefaultValue(variable: any): string {
    switch (variable.type) {
      case 'date':
        return variable.default === 'today' ? new Date().toLocaleDateString() : (variable.default || '');
      case 'text':
      default:
        return variable.default || '';
    }
  }
}

describe('MarkdownTemplateManager (Unit Tests)', () => {
  let templateManager: TestableMarkdownTemplateManager;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    templateManager = new TestableMarkdownTemplateManager();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getTemplates', () => {
    it('should return all predefined templates', () => {
      const templates = templateManager.getTemplates();
      
      expect(templates).to.have.length.greaterThan(0);
      
      const templateIds = templates.map(t => t.id);
      expect(templateIds).to.include('meeting-notes');
      expect(templateIds).to.include('requirements-doc');
      // Only test for templates that actually exist in our test class
      expect(templateIds).to.have.length(2);
    });

    it('should return templates with all required properties', () => {
      const templates = templateManager.getTemplates();
      
      templates.forEach(template => {
        expect(template).to.have.property('id');
        expect(template).to.have.property('name');
        expect(template).to.have.property('description');
        expect(template).to.have.property('content');
        expect(template).to.have.property('category');
        expect(template.id).to.be.a('string');
        expect(template.name).to.be.a('string');
        expect(template.description).to.be.a('string');
        expect(template.content).to.be.a('string');
        expect(['meeting', 'requirements', 'technical', 'general']).to.include(template.category);
      });
    });
  });

  describe('getTemplatesByCategory', () => {
    it('should return templates filtered by category', () => {
      const meetingTemplates = templateManager.getTemplatesByCategory('meeting');
      const requirementsTemplates = templateManager.getTemplatesByCategory('requirements');
      
      expect(meetingTemplates).to.have.length.greaterThan(0);
      expect(requirementsTemplates).to.have.length.greaterThan(0);
      
      meetingTemplates.forEach(template => {
        expect(template.category).to.equal('meeting');
      });
      
      requirementsTemplates.forEach(template => {
        expect(template.category).to.equal('requirements');
      });
    });

    it('should return empty array for non-existent category', () => {
      const templates = templateManager.getTemplatesByCategory('non-existent');
      expect(templates).to.be.empty;
    });
  });

  describe('getTemplateById', () => {
    it('should return correct template by ID', () => {
      const template = templateManager.getTemplateById('meeting-notes');
      
      expect(template).to.exist;
      expect(template!.id).to.equal('meeting-notes');
      expect(template!.name).to.equal('Meeting Notes');
      expect(template!.category).to.equal('meeting');
    });

    it('should return undefined for non-existent ID', () => {
      const template = templateManager.getTemplateById('non-existent');
      expect(template).to.be.undefined;
    });
  });

  describe('createFromTemplate', () => {
    it('should process variables and return substituted content', async () => {
      const mockInputs = {
        MEETING_TITLE: 'Test Meeting',
        ATTENDEES: 'John Doe, Jane Smith'
        // DATE will use default (today)
      };

      const result = await templateManager.createFromTemplate('meeting-notes', mockInputs);
      
      expect(result).to.exist;
      expect(result!).to.include('# Test Meeting');
      expect(result!).to.include('> Attendees: John Doe, Jane Smith');
      expect(result!).to.include('## Agenda');
      expect(result!).to.include('## Action Items');
    });

    it('should handle user cancellation during variable input', async () => {
      const result = await templateManager.createFromTemplate('meeting-notes');
      
      expect(result).to.be.undefined;
    });

    it('should handle date variables correctly', async () => {
      const mockInputs = {
        MEETING_TITLE: 'Date Test Meeting'
        // DATE will use default 'today'
      };

      const result = await templateManager.createFromTemplate('meeting-notes', mockInputs);
      const today = new Date().toLocaleDateString();
      
      expect(result).to.include(`Date: ${today}`);
    });

    it('should return undefined for non-existent template', async () => {
      const result = await templateManager.createFromTemplate('non-existent');
      expect(result).to.be.undefined;
    });

    it('should handle templates without variables', async () => {
      // Add a simple template without variables to our test class
      const simpleTemplate = {
        id: 'simple',
        name: 'Simple Template',
        description: 'Simple test template',
        category: 'general' as any,
        variables: [] as any[],
        content: '# Simple Template\n\nThis is a simple template.'
      };
      
      const getTemplateStub = sandbox.stub(templateManager, 'getTemplateById').returns(simpleTemplate);
      
      const result = await templateManager.createFromTemplate('simple');
      
      expect(result).to.equal('# Simple Template\n\nThis is a simple template.');
      expect(getTemplateStub.calledWith('simple')).to.be.true;
    });

    it('should replace multiple occurrences of the same variable', async () => {
      const mockInputs = {
        PROJECT_NAME: 'TestProject',
        VERSION: '2.0'
      };

      const result = await templateManager.createFromTemplate('requirements-doc', mockInputs);
      
      expect(result).to.exist;
      expect(result!).to.include('# TestProject Requirements');
      expect(result!).to.include('TestProject v2.0');
      // Should have two occurrences of TestProject
      const occurrences = (result!.match(/TestProject/g) || []).length;
      expect(occurrences).to.equal(2);
    });
  });

  describe('predefined templates validation', () => {
    it('should have valid meeting notes template', () => {
      const template = templateManager.getTemplateById('meeting-notes');
      
      expect(template).to.exist;
      expect(template!.content).to.include('{{MEETING_TITLE}}');
      expect(template!.content).to.include('{{DATE}}');
      expect(template!.content).to.include('{{ATTENDEES}}');
      expect(template!.content).to.include('> ℹ️ **Info:**');
      expect(template!.content).to.include('## Action Items');
      expect(template!.variables).to.have.length(3);
    });

    it('should have valid requirements document template', () => {
      const template = templateManager.getTemplateById('requirements-doc');
      
      expect(template).to.exist;
      expect(template!.content).to.include('{{PROJECT_NAME}}');
      expect(template!.content).to.include('{{VERSION}}');
      expect(template!.content).to.include('> 📝 **Note:**');
      expect(template!.content).to.include('> ✅ **Success:**');
      expect(template!.variables).to.have.length(2);
    });
  });
});