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

### VS Code Installation

#### Method 1: VS Code Extension Marketplace (Coming Soon)
1. Open VS Code
2. Go to Extensions view (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "ADF Preview"
4. Click "Install"

#### Method 2: Install from VSIX
1. Download the latest `.vsix` file from [GitHub Releases](https://github.com/yourusername/adf-preview/releases)
2. **Via Command Palette:**
   - Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
   - Type "Extensions: Install from VSIX"
   - Select the downloaded `.vsix` file
3. **Via Command Line:**
   ```bash
   code --install-extension adf-preview-0.1.0.vsix
   ```

### Cursor IDE Installation

#### Method 1: Install from VSIX (Recommended)
1. Download the latest `.vsix` file from [GitHub Releases](https://github.com/yourusername/adf-preview/releases)
2. **Via Drag & Drop:**
   - Simply drag the `.vsix` file into the Cursor window
3. **Via Command Line:**
   ```bash
   cursor --install-extension adf-preview-0.1.0.vsix
   ```
4. **Via Cursor Settings:**
   - Open Cursor
   - Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
   - Click the "..." menu → "Install from VSIX"
   - Select the downloaded file

#### Method 2: Manual Installation (Advanced)
1. Extract the `.vsix` file (it's a ZIP archive)
2. Copy the extracted folder to:
   - **Windows:** `%USERPROFILE%\.cursor\extensions\`
   - **macOS:** `~/.cursor/extensions/`
   - **Linux:** `~/.cursor/extensions/`
3. Restart Cursor

### Build from Source
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/adf-preview.git
   cd adf-preview
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Build the extension:
   ```bash
   yarn build
   ```
4. Package the extension:
   ```bash
   yarn package
   ```
5. Install the generated `.vsix` file using methods above

### Verification
After installation, verify the extension is working:
1. Open a JSON file or create a new one
2. Paste sample ADF content (see Usage section)
3. Right-click → "Check and Preview as ADF"
4. The ADF Preview should open showing rendered content

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
- Yarn (recommended package manager)
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
yarn install

# Development build with watch
yarn watch

# Production build
yarn build

# Run tests
yarn test

# Run tests with watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage

# Package as VSIX
yarn package
```

### Running Tests
The extension includes comprehensive unit tests covering:

- **ADF Validator**: Tests for document structure validation
- **Export Utils**: Tests for HTML/Markdown export functionality  
- **Type Safety**: Tests for shared TypeScript interfaces

```bash
# Run all tests
yarn test

# Run tests in watch mode for development
yarn test:watch

# Generate test coverage report
yarn test:coverage

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
Made with ❤️ for the Confluence and developer community