declare module 'extended-markdown-adf-parser' {
  export class Parser {
    constructor();
    markdownToAdf(markdown: string): any;
    adfToMarkdown(adf: any): string;
  }
  
  export class MarkdownParser {
    constructor();
    parse(markdown: string): any;
  }
  
  export class EnhancedMarkdownParser {
    constructor();
    parse(markdown: string): Promise<any>;
    parseSync(markdown: string): any;
  }
}