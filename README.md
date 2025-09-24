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

**Command Line:**
```bash
# From marketplace (when available)
code --install-extension jerome-erasmus.adf-preview

# From VSIX file
code --install-extension adf-preview-0.3.0.vsix
```

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

| Element | Markdown Syntax | Description |
|---------|----------------|-------------|
| **Panels** | `~~~panel type=info~~~` | Info, warning, error, success, note panels |
| **Tasks** | `- [ ] Task` | Checkbox task lists |
| **Tables** | `\| Header \| Column \|` | Data tables with formatting |
| **Code** | ``` ```language ``` | Syntax-highlighted code blocks |
| **Expand** | `~~~expand title="Title"~~~` | Collapsible sections |
| **Quotes** | `> quoted text` | Blockquote content |
| **Formatting** | `**bold**` `*italic*` `` `code` `` | Text formatting |

## Features

- **Live Preview**: Real-time rendering with 100% Confluence fidelity
- **Smart Completion**: Auto-complete for panels, tables, and templates
- **Export Options**: HTML, Markdown, and JSON export
- **Template Library**: Meeting notes, requirements docs, technical specs
- **Validation**: Real-time ADF structure checking
- **Theme Support**: Auto-sync with VS Code light/dark themes

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
  "adf.preview.theme": "auto",
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

**Built with @atlaskit/renderer for authentic Confluence rendering**