# Features Overview

The ADF Preview extension provides comprehensive support for Atlassian Document Format (ADF) files with enhanced Markdown integration.

## Core Features

### 🎯 Live Preview
- **Tab-based Preview**: Open markdown files in a separate preview tab
- **Real-time Updates**: Preview updates as you edit (configurable delay)
- **Split View**: View source and rendered preview side-by-side
- **100% Confluence Fidelity**: Uses @atlaskit/renderer for authentic display

### 🎨 Enhanced Markdown Support

#### ADF-Aware Syntax Highlighting
Special highlighting for ADF panel elements:

- **Info Panels**: `~~~panel type=info` blocks - Blue highlighting
- **Warning Panels**: `~~~panel type=warning` blocks - Yellow highlighting  
- **Success Panels**: `~~~panel type=success` blocks - Green highlighting
- **Note Panels**: `~~~panel type=note` blocks - Gray highlighting
- **Error Panels**: `~~~panel type=error` blocks - Red highlighting

#### Smart Code Completion
Intelligent autocomplete for ADF panel elements:

- Type `panel-info` → `~~~panel type=info title="${1:Title}"` block
- Type `panel-warn` → `~~~panel type=warning title="${1:Title}"` block
- Type `panel-success` → `~~~panel type=success title="${1:Title}"` block
- Type `panel-note` → `~~~panel type=note title="${1:Title}"` block
- Type `panel-error` → `~~~panel type=error title="${1:Title}"` block

### 📋 Document Templates

Pre-built templates for common document types:

#### Meeting Notes Template
```markdown
# Meeting Notes

~~~panel type=info title="Meeting Details"
**Date:** {{DATE}}
**Attendees:** {{ATTENDEES}}
~~~

## Agenda
- Item 1
- Item 2

## Action Items
- [ ] Action 1
- [ ] Action 2
```

#### Requirements Document Template
```markdown
# {{PROJECT_NAME}} Requirements

~~~panel type=note title="Document Overview"
This document outlines the requirements for {{PROJECT_NAME}}
~~~

## Overview

## Functional Requirements

## Non-Functional Requirements
```

#### Technical Specification Template
```markdown
# {{PROJECT_NAME}} Technical Specification

~~~panel type=warning title="Technical Details"
This document contains technical implementation details
~~~

## Architecture Overview

## API Specifications

## Implementation Notes
```

#### Status Report Template
```markdown
# Status Report - {{DATE}}

~~~panel type=info title="Report Summary"
Project status as of {{DATE}}
~~~

## Progress Summary

## Completed Items
- [x] Item 1
- [x] Item 2

## In Progress
- [ ] Item 3
- [ ] Item 4

## Blockers
- [ ] Issue 1
- [ ] Issue 2
```

### 🔧 Developer Tools

#### Enhanced Schema Validation
- **Real-time Validation**: Immediate feedback on ADF structure
- **Detailed Error Messages**: Precise error locations and descriptions
- **Auto-fix Suggestions**: Quick fixes for common validation errors
- **Performance Warnings**: Alerts for documents that may render slowly

#### Document Inspector
- **Structure Tree View**: Navigate document hierarchy
- **Node Properties**: View detailed node attributes and content
- **Validation Panel**: Comprehensive validation results
- **Performance Metrics**: Document size, rendering time analysis

### 📤 Export Capabilities

#### HTML Export
- **Styled Output**: Export with embedded CSS styles
- **Confluence-compatible**: Maintains visual fidelity
- **Standalone Files**: Self-contained HTML files

#### Markdown Export  
- **Standard Markdown**: Compatible with GitHub, GitLab
- **ADF Extensions**: Preserves ADF-specific elements where possible
- **Table Support**: Complex tables with proper formatting

#### JSON Export
- **Formatted ADF**: Pretty-printed JSON structure
- **Minified ADF**: Compact JSON for production use
- **Validation**: Ensures exported JSON is valid ADF

### ⚙️ Configuration Options

#### Preview Settings
```json
{
  "adf.preview.theme": "auto",           // "auto" | "light" | "dark"
  "adf.preview.fontSize": 14,            // Font size in pixels
  "adf.preview.autoUpdate": true,        // Auto-update preview
  "adf.preview.updateDelay": 500,        // Update delay in milliseconds
}
```

#### Completion Settings
```json
{
  "adf.completion.enabled": true,        // Enable code completion
  "adf.completion.templates": true,      // Template suggestions
  "adf.completion.snippets": true        // Snippet completions
}
```

#### Validation Settings
```json
{
  "adf.validation.enabled": true,        // Enable validation
  "adf.validation.strict": true,         // Strict ADF compliance
  "adf.validation.realtime": true        // Real-time validation
}
```

#### Export Settings
```json
{
  "adf.export.includeStyles": true,      // Include CSS in HTML export
  "adf.export.format": "pretty",         // "pretty" | "minified"
  "adf.export.encoding": "utf8"          // File encoding
}
```

## Supported ADF Elements

### Text Formatting
- ✅ **Bold**, *italic*, ~~strikethrough~~, `inline code`
- ✅ Headings (H1-H6)
- ✅ Paragraphs with proper spacing
- ✅ Line breaks and horizontal rules

### Lists
- ✅ Bullet lists (unordered)
- ✅ Numbered lists (ordered)  
- ✅ Nested lists (multi-level)
- ✅ Task lists with checkboxes

### Advanced Elements
- ✅ **Tables**: Complex tables with colspan/rowspan
- ✅ **Code Blocks**: Syntax highlighting for 100+ languages
- ✅ **Blockquotes**: Standard and nested quotes
- ✅ **Panels**: Info, warning, success, note, and error panels
- ✅ **Status Badges**: Colored status indicators
- ✅ **Emojis**: Full Unicode emoji support
- ✅ **Links**: Internal and external links
- ✅ **Media**: Image and file placeholders

## Commands

| Command | Description | Keybinding |
|---------|-------------|------------|
| `ADF: Open Preview` | Open current file in preview tab | `Ctrl+Shift+V` |
| `ADF: Create from Template` | Create new document from template | - |
| `ADF: Validate Document` | Run comprehensive validation | - |
| `ADF: Export as HTML` | Export current preview to HTML | - |
| `ADF: Export as Markdown` | Export to standard Markdown | - |
| `ADF: Inspect Document` | Open document structure inspector | - |
| `ADF: Debug Info` | Export debug information | - |

## Menus and Context Actions

### Editor Context Menu
- **Open Preview** - Available on `.md` files
- **Validate ADF** - Check document structure
- **Export Options** - Quick access to export formats

### Editor Title Bar
- **Preview Button** - Quick preview access
- **Template Button** - Create from template
- **Export Button** - Export options dropdown

### Command Palette
All commands are available via Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)

## Theme Support

The extension supports all VS Code and Cursor themes:
- **Light Themes**: Clean, bright rendering
- **Dark Themes**: Proper contrast and readability  
- **High Contrast**: Accessibility-focused rendering
- **Custom Themes**: Adapts to user color schemes

## Performance Features

### Optimization
- **Debounced Updates**: Prevents excessive re-rendering
- **Lazy Loading**: Templates and schemas load on demand
- **Worker Threads**: Background validation processing
- **Caching**: Validation results and completions cached

### Scalability
- **Large Documents**: Handles documents up to 10MB efficiently
- **Complex Structures**: Optimized for nested elements
- **Memory Management**: Automatic cleanup of unused resources

## Accessibility

- **Screen Reader Support**: Semantic HTML output
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: Supports high contrast modes
- **ARIA Labels**: Proper accessibility attributes

## Next Steps

- See the [User Guide](user-guide.md) for detailed usage instructions
- Check the [Troubleshooting Guide](troubleshooting.md) for common issues
- Review [Developer Guide](developer-guide.md) for customization options