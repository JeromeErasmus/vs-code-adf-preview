# ADF Preview Extension for VS Code

Preview and edit Atlassian Document Format (ADF) files and ADF-enhanced Markdown with live Confluence-style rendering.

![Version](https://img.shields.io/badge/version-0.3.0-blue)
![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.74.0-007ACC)
![License](https://img.shields.io/badge/license-MIT-green)

## Installation

**From VS Code Marketplace (Recommended):**
1. Open VS Code Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`)
2. Search for "ADF Preview"
3. Click "Install"
4. Restart VS Code

**From VSIX File:**
1. Download the latest `.vsix` file from [GitHub Releases](https://github.com/JeromeErasmus/vs-code-adf-preview/releases)
2. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Type "Extensions: Install from VSIX" and select the downloaded file
4. Restart VS Code

## Quick Start

1. **Create a Markdown file** with ADF content:
   ```markdown
   # My Document
   
   ~~~panel type=info title="Welcome"
   This is an ADF info panel
   ~~~
   
   - [ ] Task item
   - [x] Completed task
   ```

2. **Open Preview:**
   - Right-click → "Open with ADF Preview", OR
   - Command Palette → "ADF: Open Preview"

3. **Use Templates:**
   - Type `template` in a Markdown file for quick templates
   - Command Palette → "ADF: Create from Template"

## Documentation

- [Installation Guide](docs/installation.md) - Detailed setup instructions
- [User Guide](docs/user-guide.md) - Complete usage guide
- [Features Overview](docs/features.md) - All features and capabilities
- [Troubleshooting](docs/troubleshooting.md) - Common issues and solutions

## Supported Elements

| Element Category | Element | Markdown Syntax | Description |
|------------------|---------|----------------|-------------|
| **Document Structure** | Headings | `# ## ### #### ##### ######` | Document headings (H1-H6) |
| | Paragraphs | Regular text | Text paragraphs |
| | Line Breaks | Double space + newline | Hard line breaks |
| | Horizontal Rules | `---` or `***` | Horizontal dividers |
| **Text Formatting** | Bold | `**text**` or `__text__` | Strong emphasis |
| | Italic | `*text*` or `_text_` | Italic emphasis |
| | Strikethrough | `~~text~~` | Strikethrough text |
| | Underline | `<u>text</u>` | Underlined text |
| | Inline Code | `` `code` `` | Inline code formatting |
| | Subscript | `<sub>text</sub>` | Subscript text |
| | Superscript | `<sup>text</sup>` | Superscript text |
| **Links and References** | Links | `[text](url)` | Hyperlinks |
| | Mentions | `@username` | User mentions |
| | Date | ADF date syntax | Date references |
| | Status | ADF status syntax | Status badges |
| **Lists** | Bullet Lists | `- * +` | Unordered lists |
| | Ordered Lists | `1. 2. 3.` | Numbered lists |
| | Task Lists | `- [ ] - [x]` | Checkbox lists |
| | Nested Lists | Indented items | Multi-level lists |
| **Tables** | Tables | `\| Header \| Column \|` | Data tables |
| | Table Headers | First table row | Column headers |
| | Table Rows | `\|---|---\|` | Table separator |
| | Table Cells | Cell content | Individual cells |
| **Code and Quotes** | Code Blocks | ``` ```language ``` | Syntax-highlighted code |
| | Blockquotes | `> quoted text` | Quoted content |
| **ADF Panels** | Info Panels | `~~~panel type=info~~~` | Information panels |
| | Warning Panels | `~~~panel type=warning~~~` | Warning panels |
| | Error Panels | `~~~panel type=error~~~` | Error panels |
| | Success Panels | `~~~panel type=success~~~` | Success panels |
| | Note Panels | `~~~panel type=note~~~` | Note panels |
| **Advanced Elements** | Expand Sections | `~~~expand title="Title"~~~` | Collapsible content |
| | Emoji | `:emoji_name:` | Unicode emojis |
| | Inline Cards | ADF card syntax | Inline card references |
| **Media Elements** | Images | `![alt](src)` | Image references |
| | Media Single | `![alt](media:id)` | Single media items |
| | Media Groups | ADF media syntax | Media galleries |
| | File Attachments | ADF attachment syntax | File references |

## Features

- **Live Preview**: Real-time rendering with 100% Confluence fidelity
- **Smart Completion**: Auto-complete for panels, tables, and templates
- **Export Options**: HTML, Markdown, and JSON export
- **Template Library**: Meeting notes, requirements docs, technical specs
- **Validation**: Real-time ADF structure checking

## Commands

| Command | Action |
|---------|--------|
| `ADF: Open Preview` | Open preview in new tab |
| `ADF: Create from Template` | Create document from template |
| `ADF: Export as HTML` | Export to standalone HTML |
| `ADF: Validate Document` | Check ADF structure |

## Configuration

Add to your VS Code `settings.json` (File → Preferences → Settings → Open Settings JSON):

```json
{
  // Other VS Code settings...
  
  // ADF Preview Extension Settings
  "adf.preview.autoUpdate": true,
  "adf.preview.updateDelay": 500,
  "adf.completion.enabled": true,
  "adf.completion.templates": true,
  "adf.completion.snippets": true,
  "adf.validation.enabled": true,
  "adf.export.includeStyles": true
}
```

## Troubleshooting

**Extension not working?**
- Ensure your file has `.md` extension
- Restart VS Code after installation
- Check Output panel → "ADF Preview" for errors

**Need help?** Check the [complete documentation](docs/README.md) or report issues on [GitHub](https://github.com/JeromeErasmus/vs-code-adf-preview/issues).

---