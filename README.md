# ADF Preview for Confluence - VS Code/Cursor Extension

A powerful VS Code and Cursor IDE extension for previewing and editing Atlassian Document Format (ADF) files with live Confluence-style rendering.

![Version](https://img.shields.io/badge/version-0.2.7-blue)
![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.74.0-007ACC)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### 🎯 Core Features
- **Live Preview**: Real-time rendering of ADF documents with 100% Confluence fidelity
- **@atlaskit/renderer Integration**: Uses Atlassian's official renderer for authentic display
- **Auto-detection**: Automatically detects ADF structure in files
- **Split View**: View source JSON and rendered preview side-by-side
- **Dark Mode Support**: Seamless theme switching between light and dark modes
- **Validation**: Built-in ADF structure validation with error highlighting

### 📤 Export Capabilities
- **HTML Export**: Export with embedded styles for sharing
- **Markdown Export**: Convert ADF to standard Markdown format
- **JSON Export**: Formatted/minified ADF JSON

### 🛠️ Enhanced Features (NEW)
- **Tab-Based Preview**: Open preview in separate tab for better workflow
- **ADF-Aware Syntax Highlighting**: Special highlighting for info/warning/success panels
- **Smart Code Completion**: Auto-complete for ADF elements in Markdown
- **Document Templates**: Pre-built templates for meeting notes, requirements, technical specs
- **Enhanced Validation**: Real-time validation with detailed error messages
- **Live Updates**: Preview updates as you edit (configurable delay)
- **Error Display**: Clear validation errors with helpful messages
- **Customizable**: Font size, theme, and update settings

## Quick Installation

### For VS Code
1. Download the latest `.vsix` file from [GitHub Releases](https://github.com/yourusername/adf-preview/releases)
2. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Type "Extensions: Install from VSIX" and select the downloaded file
4. Restart VS Code

### For Cursor IDE
1. Download the latest `.vsix` file from [GitHub Releases](https://github.com/yourusername/adf-preview/releases)  
2. Drag the `.vsix` file into the Cursor window (easiest method)
3. Restart Cursor

### Build from Source
```bash
git clone https://github.com/yourusername/adf-preview.git
cd adf-preview
yarn install
make full  # Build, package, and install
```

> 📚 **For detailed installation instructions, build guides, and troubleshooting**: See the [**📖 Documentation**](docs/README.md)

## Usage

### Opening ADF Files
1. **Automatic Detection**: When you open an ADF file (`.adf` extension), it will automatically open in ADF Preview
2. **Manual Opening**: 
   - Right-click on any ADF file → "Open with ADF Preview"
   - Command Palette → "ADF: Open Preview"

### Supported ADF Elements
- ✅ Text formatting (bold, italic, underline, strike, code)
- ✅ Headings (h1-h6)
- ✅ Paragraphs and line breaks
- ✅ Lists (bullet, ordered, nested)
- ✅ Tables with colspan/rowspan
- ✅ Code blocks with syntax highlighting
- ✅ Blockquotes
- ✅ Panels (info, note, warning, error, success)
- ✅ Status badges
- ✅ Emojis
- ✅ Links
- ✅ Horizontal rules
- ✅ Media placeholders

### Commands
| Command | Description |
|---------|-------------|
| `ADF: Open Preview` | Open current file in ADF Preview tab |
| `ADF: Create from Template` | Create new document from template (NEW) |
| `ADF: Validate Document` | Check if document is valid ADF |
| `ADF: Export as HTML` | Export current preview to HTML |
| `ADF: Export as Markdown` | Export current preview to Markdown |

> 📚 **For complete feature documentation and usage guides**: See [**Features Overview**](docs/features.md) and [**User Guide**](docs/user-guide.md)

### Configuration
Configure the extension in VS Code/Cursor settings:

```json
{
  "adf.preview.theme": "auto",           // "auto" | "light" | "dark"
  "adf.preview.fontSize": 14,            // Font size in pixels
  "adf.preview.autoUpdate": true,        // Auto-update preview on changes
  "adf.preview.updateDelay": 500,        // Delay before updating (ms)
  "adf.export.includeStyles": true,      // Include CSS in HTML export
  "adf.validation.strict": true          // Use strict ADF validation
}
```

## Development

> 📚 **For complete development setup, architecture details, and contribution guidelines**: See the [**Developer Guide**](docs/developer-guide.md)

### Quick Setup
```bash
git clone https://github.com/yourusername/adf-preview.git
cd adf-preview
yarn install
make full  # Build, package, and install
```

### Key Technologies
- **TypeScript**: Type-safe development  
- **React 18**: Modern UI framework for webview
- **@atlaskit/renderer**: Official Atlassian ADF renderer
- **Webpack 5**: Module bundling with code splitting
- **VS Code Extension API**: Custom editor implementation

## ADF Document Structure

A valid ADF document must have:
```json
{
  "type": "doc",
  "version": 1,
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Hello World"
        }
      ]
    }
  ]
}
```

## Troubleshooting

> 🔧 **For comprehensive troubleshooting guide**: See [**Troubleshooting Documentation**](docs/troubleshooting.md)

### Quick Fixes

**Extension not working after installation:**
```bash
# Rebuild webview bundles (most common issue)
yarn build:webview
```

**Preview stuck on "Loading...":**  
1. Check that all webview bundles exist: `ls -la dist/webview/`
2. Rebuild if missing: `yarn build:webview`
3. Reinstall extension

**Build issues:**
```bash
# Clean rebuild
make clean
make build
```

## Known Limitations
- **Confluence Macros**: Rendered as info panels with macro details
- **Smart Links**: Display as regular links
- **Media**: External media URLs may require authentication
- **File Size**: Large documents (>5MB) may have performance impacts

## Contributing
Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License
MIT License - see LICENSE file for details

## Credits
- Built with [@atlaskit/renderer](https://atlaskit.atlassian.com/) for authentic Confluence rendering
- Inspired by the need for better ADF tooling in development workflows
- Thanks to the Atlassian team for the ADF specification

## Documentation & Support

📖 **Complete Documentation**: Visit our comprehensive [**Documentation**](docs/README.md) for:
- [Installation Guide](docs/installation.md) - Detailed setup instructions
- [Features Overview](docs/features.md) - Complete feature reference  
- [User Guide](docs/user-guide.md) - Step-by-step usage instructions
- [Developer Guide](docs/developer-guide.md) - For contributors and customization
- [Troubleshooting](docs/troubleshooting.md) - Solutions to common issues

🌐 **GitBook Documentation**: [View Online Documentation](https://your-gitbook-url.gitbook.io/adf-preview) (Coming Soon)

💬 **Support**:
- Report issues on [GitHub Issues](https://github.com/yourusername/adf-preview/issues)  
- For feature requests, open a discussion
- Check the [troubleshooting guide](docs/troubleshooting.md) for common solutions

### Quick Start Commands
```bash
# Clone and setup
git clone https://github.com/yourusername/adf-preview.git
cd adf-preview
yarn install

# Development
yarn watch     # Start development build with watch
yarn test      # Run unit tests
yarn package   # Create VSIX package

# Quality checks
yarn lint      # Check code style
yarn test:coverage  # Generate test coverage
```

---

## Important references:
https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/