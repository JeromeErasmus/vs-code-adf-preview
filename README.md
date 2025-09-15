# ADF Preview for Confluence - VS Code/Cursor Extension

A powerful VS Code and Cursor IDE extension for previewing and editing Atlassian Document Format (ADF) files with live Confluence-style rendering.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.74.0-007ACC)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### 🎯 Core Features
- **Live Preview**: Real-time rendering of ADF JSON documents with 100% Confluence fidelity
- **@atlaskit/renderer Integration**: Uses Atlassian's official renderer for authentic display
- **Auto-detection**: Automatically detects ADF structure in JSON files
- **Split View**: View source JSON and rendered preview side-by-side
- **Dark Mode Support**: Seamless theme switching between light and dark modes
- **Validation**: Built-in ADF structure validation with error highlighting

### 📤 Export Capabilities
- **HTML Export**: Export with embedded styles for sharing
- **Markdown Export**: Convert ADF to standard Markdown format
- **JSON Export**: Formatted/minified ADF JSON

### 🛠️ Developer Features
- **Live Updates**: Preview updates as you edit (configurable delay)
- **Error Display**: Clear validation errors with helpful messages
- **Customizable**: Font size, theme, and update settings

## Installation

### From VSIX (Recommended for Cursor)
1. Download the latest `.vsix` file from the releases
2. Install via command line:
   ```bash
   cursor --install-extension adf-preview-0.1.0.vsix
   ```
   Or drag the VSIX file into the Cursor window

### From Source
1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Package the extension:
   ```bash
   npm run package
   ```
5. Install the generated `.vsix` file

## Usage

### Opening ADF Files
1. **Automatic Detection**: When you open a JSON file with ADF structure (`type: "doc"`, `version: 1`), you'll be prompted to open it in ADF Preview
2. **Manual Opening**: 
   - Right-click on any JSON file → "Open with ADF Preview"
   - Command Palette → "ADF: Open Preview"
3. **Check and Preview**: Right-click on JSON file → "Check and Preview as ADF"

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
| `ADF: Open Preview` | Open current JSON file in ADF Preview |
| `ADF: Check and Preview` | Validate and open as ADF |
| `ADF: Validate Document` | Check if document is valid ADF |
| `ADF: Export as HTML` | Export current preview to HTML |
| `ADF: Export as Markdown` | Export current preview to Markdown |

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

### Prerequisites
- Node.js 18+
- npm or yarn
- VS Code or Cursor IDE

### Project Structure
```
adf-preview/
├── src/
│   ├── extension/          # VS Code extension code
│   │   ├── extension.ts    # Entry point
│   │   ├── providers/      # Custom editor provider
│   │   ├── validators/     # ADF validation
│   │   └── utils/          # Export utilities
│   ├── webview/           # React webview app
│   │   ├── App.tsx        # Main React component
│   │   ├── components/    # React components
│   │   └── styles/        # CSS styles
│   └── shared/            # Shared types
├── webpack.config.js      # Webpack configuration
├── tsconfig.json         # TypeScript config
└── package.json          # Project dependencies
```

### Building from Source
```bash
# Install dependencies
npm install

# Development build with watch
npm run watch

# Production build
npm run build

# Run tests
npm test

# Run tests with watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Package as VSIX
npm run package
```

### Running Tests
The extension includes comprehensive unit tests covering:

- **ADF Validator**: Tests for document structure validation
- **Export Utils**: Tests for HTML/Markdown export functionality  
- **Type Safety**: Tests for shared TypeScript interfaces

```bash
# Run all tests
npm test

# Run tests in watch mode for development
npm run test:watch

# Generate test coverage report
npm run test:coverage

# Quick test runner with colored output
node scripts/test.js
```

**Test Coverage Areas:**
- ✅ Valid/invalid ADF document validation
- ✅ HTML export with styling and escaping
- ✅ Markdown export with proper formatting
- ✅ Complex document structures (tables, lists, panels)
- ✅ Type safety for message passing interfaces
- ✅ Error handling and edge cases

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

### Extension Not Activating
- Ensure you have a valid JSON file open
- Check that the file contains valid ADF structure
- Look for errors in Output → ADF Preview

### Preview Not Updating
- Check `adf.preview.autoUpdate` setting
- Verify the JSON is valid
- Try manually refreshing with Command Palette

### Rendering Issues
- Ensure all dependencies are installed
- Check console for errors (Help → Toggle Developer Tools)
- Try reloading the window

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

## Support
- Report issues on [GitHub Issues](https://github.com/yourusername/adf-preview/issues)
- For feature requests, open a discussion
- Check the [wiki](https://github.com/yourusername/adf-preview/wiki) for detailed documentation

---
Made with ❤️ for the Confluence and developer community