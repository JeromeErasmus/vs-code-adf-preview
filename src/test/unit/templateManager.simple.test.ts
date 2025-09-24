import { describe, it } from 'mocha';
import { expect } from 'chai';

describe('Template Manager Core Logic (Unit Tests)', () => {
  
  describe('Template Variable Replacement', () => {
    function replaceVariables(content: string, variables: Record<string, string>): string {
      let result = content;
      for (const [key, value] of Object.entries(variables)) {
        const placeholder = `{{${key}}}`;
        result = result.replace(new RegExp(placeholder, 'g'), value);
      }
      return result;
    }

    it('should replace single variable occurrence', () => {
      const template = 'Hello {{NAME}}!';
      const variables = { NAME: 'World' };
      
      const result = replaceVariables(template, variables);
      
      expect(result).to.equal('Hello World!');
    });

    it('should replace multiple variable occurrences', () => {
      const template = 'Hello {{NAME}}! Welcome {{NAME}} to our system.';
      const variables = { NAME: 'Alice' };
      
      const result = replaceVariables(template, variables);
      
      expect(result).to.equal('Hello Alice! Welcome Alice to our system.');
    });

    it('should replace multiple different variables', () => {
      const template = '# {{TITLE}}\n\nAuthor: {{AUTHOR}}\nDate: {{DATE}}';
      const variables = { 
        TITLE: 'My Document', 
        AUTHOR: 'John Doe', 
        DATE: '2024-01-01' 
      };
      
      const result = replaceVariables(template, variables);
      
      expect(result).to.equal('# My Document\n\nAuthor: John Doe\nDate: 2024-01-01');
    });

    it('should handle variables with special regex characters', () => {
      const template = 'Price: {{PRICE}}';
      const variables = { PRICE: '$19.99 (special)' };
      
      const result = replaceVariables(template, variables);
      
      expect(result).to.equal('Price: $19.99 (special)');
    });

    it('should leave undefined variables unchanged', () => {
      const template = 'Hello {{NAME}}! Your score is {{SCORE}}.';
      const variables = { NAME: 'Alice' };
      
      const result = replaceVariables(template, variables);
      
      expect(result).to.equal('Hello Alice! Your score is {{SCORE}}.');
    });

    it('should handle empty variables', () => {
      const template = 'Title: {{TITLE}} - {{SUBTITLE}}';
      const variables = { TITLE: 'Main Title', SUBTITLE: '' };
      
      const result = replaceVariables(template, variables);
      
      expect(result).to.equal('Title: Main Title - ');
    });
  });

  describe('Date Variable Processing', () => {
    function getDefaultValue(variable: any): string {
      switch (variable.type) {
        case 'date':
          return variable.default === 'today' ? new Date().toLocaleDateString() : (variable.default || '');
        case 'text':
        default:
          return variable.default || '';
      }
    }

    it('should handle today date default', () => {
      const variable = { type: 'date', default: 'today' };
      const result = getDefaultValue(variable);
      const today = new Date().toLocaleDateString();
      
      expect(result).to.equal(today);
    });

    it('should handle custom date default', () => {
      const variable = { type: 'date', default: '2024-01-01' };
      const result = getDefaultValue(variable);
      
      expect(result).to.equal('2024-01-01');
    });

    it('should handle text variable with default', () => {
      const variable = { type: 'text', default: 'Default Value' };
      const result = getDefaultValue(variable);
      
      expect(result).to.equal('Default Value');
    });

    it('should handle variable without default', () => {
      const variable = { type: 'text' };
      const result = getDefaultValue(variable);
      
      expect(result).to.equal('');
    });
  });

  describe('Template Categories', () => {
    const templates = [
      { id: 'meeting1', category: 'meeting', name: 'Meeting Notes' },
      { id: 'meeting2', category: 'meeting', name: 'Team Standup' },
      { id: 'req1', category: 'requirements', name: 'Requirements Doc' },
      { id: 'tech1', category: 'technical', name: 'Tech Spec' },
      { id: 'general1', category: 'general', name: 'General Doc' }
    ];

    function filterByCategory(templates: any[], category: string) {
      return templates.filter(template => template.category === category);
    }

    it('should filter templates by meeting category', () => {
      const meetingTemplates = filterByCategory(templates, 'meeting');
      
      expect(meetingTemplates).to.have.length(2);
      expect(meetingTemplates.every(t => t.category === 'meeting')).to.be.true;
    });

    it('should filter templates by requirements category', () => {
      const reqTemplates = filterByCategory(templates, 'requirements');
      
      expect(reqTemplates).to.have.length(1);
      expect(reqTemplates[0].id).to.equal('req1');
    });

    it('should return empty array for non-existent category', () => {
      const nonExistentTemplates = filterByCategory(templates, 'non-existent');
      
      expect(nonExistentTemplates).to.be.empty;
    });
  });

  describe('ADF Panel Recognition', () => {
    function recognizeADFPanels(content: string): string[] {
      const panelPatterns = [
        /> ℹ️ \*\*Info:\*\*/g,
        /> ⚠️ \*\*Warning:\*\*/g,
        /> ✅ \*\*Success:\*\*/g,
        /> 📝 \*\*Note:\*\*/g,
        /> ❌ \*\*Error:\*\*/g
      ];
      
      const panels: string[] = [];
      for (const pattern of panelPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          panels.push(...matches);
        }
      }
      
      return panels;
    }

    it('should recognize info panels', () => {
      const content = '> ℹ️ **Info:** This is information';
      const panels = recognizeADFPanels(content);
      
      expect(panels).to.have.length(1);
      expect(panels[0]).to.include('ℹ️ **Info:**');
    });

    it('should recognize multiple panel types', () => {
      const content = `
        > ℹ️ **Info:** Information
        > ⚠️ **Warning:** Be careful
        > ✅ **Success:** Done!
      `;
      const panels = recognizeADFPanels(content);
      
      expect(panels).to.have.length(3);
    });

    it('should handle content without panels', () => {
      const content = 'Regular markdown content without panels';
      const panels = recognizeADFPanels(content);
      
      expect(panels).to.be.empty;
    });
  });
});