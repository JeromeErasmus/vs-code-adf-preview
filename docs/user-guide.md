# User Guide

This guide provides practical instructions for using the ADF Preview extension's features.

## Getting Started

### Opening Files

1. **Automatic Detection**: Files with ADF content are automatically detected
2. **Manual Preview**: Right-click → "Open Preview" or use Command Palette
3. **Tab-Based Workflow**: Preview opens in a separate tab for easy switching

### Basic Workflow

1. **Create/Open** a Markdown file
2. **Write Content** using ADF-enhanced Markdown syntax
3. **Preview** using the preview tab
4. **Export** to HTML, Markdown, or JSON when ready

## Using the Tab-Based Preview

### Opening Preview

**Method 1: Command Palette**
1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type "ADF: Open Preview"
3. Press Enter

**Method 2: Editor Button**
1. Look for the preview button in the editor title bar
2. Click the preview icon

**Method 3: Context Menu**
1. Right-click in the editor
2. Select "Open Preview"

### Preview Tab Behavior

- **Live Updates**: Preview updates automatically as you edit
- **Theme Sync**: Preview matches your editor theme
- **Independent Tabs**: Source and preview can be viewed side-by-side

## Writing ADF-Enhanced Markdown

> 📖 **Complete ADF Markdown Reference**: For comprehensive documentation on all ADF markdown extensions and syntax, see the [Extended Markdown ADF Parser Package Documentation](https://www.npmjs.com/package/extended-markdown-adf-parser)

### Text Formatting

ADF supports rich text formatting including bold, italic, underline, strikethrough, code, and more. Text can be combined with links, mentions, and inline elements.

> 📖 **Text Formatting Documentation**: See [Text Formatting](https://jeromeerasmus.gitbook.io/extended-markdown-adf-parser/text-formatting) for complete syntax including emphasis, strong text, inline code, and advanced formatting options.

### Headings

Create document structure using headings from H1 through H6. Headings support custom attributes and can include rich text content.

> 📖 **Heading Documentation**: See [Heading Specifications](https://jeromeerasmus.gitbook.io/extended-markdown-adf-parser/core-elements/element-specifications-headings) for syntax and advanced heading features.

### Panel Syntax

Create visually distinct information panels using ADF panel syntax. Panels provide rich content containers with semantic meaning and visual styling.

**Available Panel Types:**
- **Info Panel** - Blue styling for informational content
- **Warning Panel** - Yellow styling for cautionary content  
- **Success Panel** - Green styling for positive feedback
- **Note Panel** - Gray styling for additional context
- **Error Panel** - Red styling for critical information

> 📖 **Complete Panel Documentation**: See [Panel Specifications](https://jeromeerasmus.gitbook.io/extended-markdown-adf-parser/adf-extensions/element-specifications-panels) for syntax examples, custom titles, and advanced panel features.

### Task Lists

Create interactive task lists with checkboxes for tracking completion status. Task lists support nested items and rich content.

> 📖 **List Documentation**: See [Lists](https://jeromeerasmus.gitbook.io/extended-markdown-adf-parser/lists) for complete syntax including bullet lists, numbered lists, and task lists with advanced features.

### Tables

Create structured data tables with headers, rows, and rich content. Tables support text formatting, alignment, and complex layouts including merged cells.

> 📖 **Table Documentation**: See [Table Specifications](https://jeromeerasmus.gitbook.io/extended-markdown-adf-parser/block-elements/element-specifications-tables) for complete syntax including column alignment, cell merging, and advanced table features.

### Code Blocks

Display formatted code with syntax highlighting for 100+ programming languages. Code blocks preserve indentation and line breaks while providing visual styling.

> 📖 **Code Block Documentation**: See [Code Block Specifications](https://jeromeerasmus.gitbook.io/extended-markdown-adf-parser/block-elements/element-specifications-code-blocks) for language support, syntax highlighting options, and advanced code block features.

### Media Elements

Embed images, videos, and file attachments in your documents. Media elements support dimensions, captions, and accessibility attributes.

> 📖 **Media Documentation**: See [Media Elements](https://jeromeerasmus.gitbook.io/extended-markdown-adf-parser/media-elements) for syntax including image references, file attachments, and media galleries.

### Blockquotes

Create quoted content with proper attribution and nested quote support. Blockquotes can contain rich content and multiple paragraphs.

> 📖 **Blockquote Documentation**: See [Blockquote Specifications](https://jeromeerasmus.gitbook.io/extended-markdown-adf-parser/block-elements/element-specifications-blockquotes) for syntax and advanced blockquote features.

## Using Code Completion

### Enabling Snippet Support

If snippets are not working in your markdown files, you may need to configure VS Code settings. Create or update your workspace `.vscode/settings.json` file:

```json
{
  "editor.quickSuggestions": {
    "other": true,
    "comments": false,
    "strings": true
  },
  "editor.suggestOnTriggerCharacters": true,
  "editor.wordBasedSuggestions": "off",
  "editor.snippetSuggestions": "top",
  "editor.suggest.showSnippets": true,
  "[markdown]": {
    "editor.quickSuggestions": {
      "other": true,
      "comments": false,
      "strings": true
    },
    "editor.snippetSuggestions": "top",
    "editor.suggest.showSnippets": true,
    "editor.tabCompletion": "on",
    "editor.wordBasedSuggestions": "off"
  }
}
```

After adding these settings, restart VS Code or reload the window (`Ctrl+Shift+P` → "Developer: Reload Window").

### Available Snippets

The extension provides two types of code completion: **Static Snippets** and **Dynamic Completions**.

#### Static Snippets (from snippets file)

These snippets are triggered by typing their prefix and pressing `Tab` or `Ctrl+Space`:

**Panel Snippets:**
- `info` or `panel-info` → ADF Info Panel with custom title
  ```markdown
  ~~~panel type=info title="Information Panel"
  Your content here
  ~~~
  ```

- `warn`, `panel-warn`, or `panel-warning` → ADF Warning Panel
  ```markdown
  ~~~panel type=warning title="Warning Panel"
  Your content here
  ~~~
  ```

- `success` or `panel-success` → ADF Success Panel
  ```markdown
  ~~~panel type=success title="Success Panel"
  Your content here
  ~~~
  ```

- `note` or `panel-note` → ADF Note Panel
  ```markdown
  ~~~panel type=note title="Note Panel"
  Your content here
  ~~~
  ```

- `error` or `panel-error` → ADF Error Panel
  ```markdown
  ~~~panel type=error title="Error Panel"
  Your content here
  ~~~
  ```

**Content Snippets:**
- `tasks` → Task List with checkboxes
  ```markdown
  - [ ] Task 1
  - [ ] Task 2
  - [ ] Task 3
  ```

- `table` → ADF Compatible Table
  ```markdown
  | Header 1 | Header 2 | Header 3 |
  |----------|----------|----------|
  | Cell 1   | Cell 2   | Cell 3   |
  | Cell 4   | Cell 5   | Cell 6   |
  ```

- `meeting` → Meeting Notes Template (see Template section below)

- `expand` or `collapsible` → Expandable Section
  ```markdown
  ~~~expand title="Click to expand"
  Hidden content goes here
  ~~~
  ```

#### Dynamic Completions (context-aware)

These appear automatically based on what you're typing:


**General Completions (triggered in empty lines)**:
- **ADF Table** → Multi-line table with headers and sample data
- **ADF Code Block** → Fenced code block with language placeholder
- **ADF Link** → Markdown hyperlink format

**Task Item Completion (triggered after `-`, `*`, or `+`)**:
- **Task Item** → `[ ] Task description` (creates checkbox)

#### Template Completions

Full document templates available via Command Palette or `template` snippet:

1. **Meeting Notes Template** (`meeting-notes`)
   - Variables: Meeting Title, Date, Attendees
   - Includes info panel, agenda, discussion, action items, next steps

2. **Requirements Document Template** (`requirements-doc`)  
   - Variables: Project Name, Version
   - Includes overview, functional requirements, non-functional requirements, success criteria

3. **Technical Specification Template** (`technical-spec`)
   - Variables: Feature Name
   - Includes overview, architecture, implementation details, testing strategy

4. **Status Report Template** (`status-report`)
   - Variables: Report Period, Team Name
   - Includes accomplishments, progress, upcoming work, issues, metrics

**To use templates:**
- **Method 1:** Command Palette → "ADF: Create from Template" → Select template → Fill variables
- **Method 2:** Type `template` → Select from list → Fill variables  
- **Method 3:** Type specific template prefix (e.g., `meeting`) → Press Tab

**Troubleshooting Snippets:**
- Ensure the ADF Preview extension is installed and active
- Check that your file has a `.md` extension
- Try typing the snippet prefix and pressing `Ctrl+Space` to trigger suggestions
- Verify the workspace settings above are applied correctly

## Working with Document Templates

### Creating from Template

**Method 1: Command Palette**
1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type "ADF: Create from Template"
3. Select your desired template
4. Fill in the variable prompts

**Method 2: New File with Template**
1. Create a new file
2. Use code completion to insert a template
3. Customize the generated content

### Template Variables

Templates support dynamic variables:

- `{{DATE}}` - Current date
- `{{PROJECT_NAME}}` - Project name (prompted)
- `{{ATTENDEES}}` - Meeting attendees (prompted)
- `{{AUTHOR}}` - Document author (prompted)

### Customizing Templates

You can modify template content after insertion:
1. Replace placeholder text
2. Add or remove sections
3. Customize the structure as needed

## Validation and Error Checking

### Real-Time Validation

The extension validates your ADF content in real-time:
- **Green Indicators**: Valid ADF structure
- **Red Underlines**: Validation errors
- **Yellow Underlines**: Warnings or suggestions

### Understanding Validation Messages

**Structural Errors**:
- Invalid parent-child relationships
- Missing required attributes
- Incorrect node types

**Content Errors**:
- Invalid text formatting
- Malformed links
- Incorrect table structure

**Performance Warnings**:
- Large document size
- Complex nested structures
- Potential rendering issues

### Manual Validation

Run comprehensive validation:
1. Command Palette → "ADF: Validate Document"
2. View detailed validation results
3. Use suggested fixes to resolve issues

## Export Features

### HTML Export

**Standard HTML Export**:
1. Command Palette → "ADF: Export as HTML"
2. Choose location and filename
3. File includes embedded styles for standalone viewing

**Configuration Options**:
```json
{
  "adf.export.includeStyles": true,
  "adf.export.format": "pretty"
}
```

### Markdown Export

**GitHub-Compatible Markdown**:
1. Command Palette → "ADF: Export as Markdown"
2. ADF panels converted to blockquotes
3. Tables and lists preserved

**Export Features**:
- Standard Markdown compatibility
- Preserves formatting where possible
- Includes fallbacks for ADF-specific elements

### JSON Export

**Formatted ADF JSON**:
1. Command Palette → "ADF: Export as JSON"
2. Choose pretty-printed or minified format
3. Valid ADF structure guaranteed

## Customization Options

### Preview Settings

**Theme Selection**:
```json
{
  "adf.preview.theme": "auto"  // Matches editor theme
}
```

**Update Behavior**:
```json
{
  "adf.preview.autoUpdate": true,
  "adf.preview.updateDelay": 500
}
```

**Font Settings**:
```json
{
  "adf.preview.fontSize": 14
}
```

### Completion Settings

**Enable/Disable Features**:
```json
{
  "adf.completion.enabled": true,
  "adf.completion.templates": true,
  "adf.completion.snippets": true
}
```

### Validation Settings

**Validation Behavior**:
```json
{
  "adf.validation.enabled": true,
  "adf.validation.strict": true,
  "adf.validation.realtime": true
}
```

## Advanced Usage

### Debug Information

Export debug information for troubleshooting:
1. Command Palette → "ADF: Write Debug Log"
2. Saves comprehensive diagnostic data
3. Useful for reporting issues

### Performance Optimization

For large documents:
1. Increase update delay: `"adf.preview.updateDelay": 1000`
2. Disable real-time validation: `"adf.validation.realtime": false`
3. Use manual validation instead of automatic

## Keyboard Shortcuts

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Open Preview | `Ctrl+Shift+V` | `Cmd+Shift+V` |
| Command Palette | `Ctrl+Shift+P` | `Cmd+Shift+P` |
| Quick Open | `Ctrl+P` | `Cmd+P` |
| Toggle Sidebar | `Ctrl+B` | `Cmd+B` |

## Tips and Best Practices

### Writing Effective ADF Content

1. **Use Semantic Panels**: Choose the right panel type for your content
2. **Structure Documents**: Use headings to create clear hierarchy
3. **Leverage Templates**: Start with templates for consistent formatting
4. **Validate Early**: Check validation as you write

### Performance Tips

1. **Break Large Documents**: Split very large documents into sections
2. **Optimize Images**: Use appropriate image sizes
3. **Minimize Nesting**: Avoid deeply nested structures when possible

### Collaboration Tips

1. **Export for Sharing**: Use HTML export for non-technical stakeholders
2. **Version Control**: Use Markdown format for git-friendly versioning
3. **Documentation Standards**: Establish team templates and conventions

## Common Workflows

### Meeting Notes Workflow

1. Create new file from Meeting Notes template
2. Fill in date, attendees, and agenda items
3. Take notes during meeting
4. Export to HTML for distribution

### Requirements Documentation

1. Start with Requirements Document template
2. Use panels to highlight important information
3. Create task lists for tracking completion
4. Export to Confluence-compatible format

### Technical Documentation

1. Use Technical Specification template
2. Include code blocks for examples
3. Use warning panels for critical information
4. Maintain in Markdown for version control

## Next Steps

- See [Troubleshooting](troubleshooting.md) for common issues
- Check [Developer Guide](developer-guide.md) for advanced customization
- Visit [Features Overview](features.md) for complete feature reference