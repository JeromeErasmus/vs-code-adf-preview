# ADF Preview for Confluence - VS Code/Cursor Extension

A powerful VS Code and Cursor IDE extension for previewing and editing Atlassian Document Format (ADF) files with live Confluence-style rendering.

![Version](https://img.shields.io/badge/version-0.2.7-blue)
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
- **Node.js**: 18+ (tested with v18.17.0)
- **Yarn**: 4.7.0+ (preferred package manager)
- **VS Code or Cursor IDE**: Latest version
- **@vscode/vsce**: For packaging extensions

### Exact Dependency Versions
This project uses **pinned exact versions** for consistent builds:

```json
{
  "dependencies": {
    "@atlaskit/adf-schema": "35.14.0",
    "@atlaskit/editor-common": "109.7.1", 
    "@atlaskit/media-client-react": "4.1.2",
    "@atlaskit/media-core": "37.0.0",
    "@atlaskit/renderer": "123.2.1",
    "@emotion/react": "11.14.0",
    "markdown-it": "13.0.2",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  }
}
```

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
├── dist/                  # Built files
│   ├── extension/         # Compiled extension code
│   └── webview/           # Compiled webview bundles
├── build/                 # VSIX packages
├── webpack.config.js      # Webpack configuration
├── tsconfig.json         # TypeScript config
└── package.json          # Project dependencies
```

### Complete Build Instructions

#### 1. Clean Setup (Recommended)
```bash
# Clone repository
git clone https://github.com/yourusername/adf-preview.git
cd adf-preview

# Clean any existing dependencies
rm -rf node_modules yarn.lock

# Install exact dependency versions
yarn install

# Verify installation
yarn --version  # Should be 4.7.0+
```

#### 2. Development Build
```bash
# Development build with watch mode
yarn watch

# Or build components separately
yarn watch:extension    # Watch extension code
yarn watch:webview      # Watch React webview
```

#### 3. Production Build ⚠️ IMPORTANT
```bash
# STEP 1: Build webview bundles first
yarn build:webview

# STEP 2: Build extension 
yarn build:extension

# OR: Run full build (does both steps)
yarn build

# CRITICAL: The webview bundles MUST be built before testing
# The extension expects these files in dist/webview/:
# - atlaskit-vendor.js (~7.3MB)
# - react-vendor.js (~132KB)  
# - vendor.js (~4MB)
# - bundle.js (~22KB)
```

#### 4. Package Extension
```bash
# Create VSIX package for distribution
# IMPORTANT: Use --no-dependencies flag to skip npm dependency validation
npx @vscode/vsce package --no-dependencies --out build/

# The generated file will be: build/adf-preview-X.X.X.vsix
# Note: Package includes browser polyfills for webview compatibility
```

### ⚙️ Webpack Configuration (v0.2.7)

The extension now includes comprehensive browser polyfills to resolve "process is not defined" errors:

**Key webpack.config.js changes:**
```javascript
resolve: {
  fallback: {
    "process": require.resolve("process/browser.js"),
    "path": require.resolve("path-browserify"),
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "buffer": require.resolve("buffer"),
    "util": require.resolve("util"),
    // ... additional polyfills for full Node.js compatibility
  },
  alias: {
    'react-intl-next': 'react-intl' // Atlaskit compatibility
  }
},
plugins: [
  new webpack.ProvidePlugin({
    process: 'process/browser.js',
    Buffer: ['buffer', 'Buffer'],
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
  }),
]
```

**Why these changes were needed:**
- VS Code webviews run in browser environment (no Node.js globals)
- @atlaskit/renderer and dependencies expect Node.js modules
- Polyfills bridge the gap between Node.js and browser environments

#### 5. Development Testing (VS Code/Cursor)
```bash
# BEFORE testing the extension:
# 1. Ensure webview is built (critical step)
yarn build:webview

# 2. Press F5 in VS Code to launch Extension Development Host
# OR manually install the VSIX:
code --install-extension build/adf-preview-X.X.X.vsix
cursor --install-extension build/adf-preview-X.X.X.vsix
```

#### 5. Install Development Extension
```bash
# Install in VS Code
code --install-extension build/adf-preview-X.X.X.vsix

# Install in Cursor
cursor --install-extension build/adf-preview-X.X.X.vsix
```

### Build Verification
After building, verify the build output:
```bash
# Check dist folder structure
ls -la dist/
ls -la dist/extension/  # Should contain extension.js
ls -la dist/webview/    # Should contain bundle.js and vendor files

# Check webview bundles (webpack code splitting)
ls -la dist/webview/*.js
# Should include:
# - atlaskit-vendor.js (~7.3MB - Contains @atlaskit/renderer)
# - react-vendor.js (~132KB - React/ReactDOM)  
# - vendor.js (~4MB - Other dependencies)
# - bundle.js (~22KB - Main application code)
```

### Build Troubleshooting

#### Dependency Version Conflicts
If you encounter peer dependency warnings:
```bash
# Clean slate approach
rm -rf node_modules yarn.lock
yarn install

# Or install with legacy peer deps (if needed)
yarn install --legacy-peer-deps
```

#### Packaging Issues
If `npx @vscode/vsce package` fails:
```bash
# Try with more lenient flags
npx @vscode/vsce package --no-yarn --no-dependencies --out build/

# If still failing, check npm list
npm list --depth=0 --production

# Clean and retry
rm -rf node_modules dist
yarn install
yarn build
npx @vscode/vsce package --no-yarn --no-dependencies --out build/
```

#### Large Bundle Size Warning
The extension bundles are intentionally large (~11.4MB total) due to @atlaskit/renderer:
- This is expected and required for full ADF compatibility
- webpack optimizations reduce bundle size where possible
- Code splitting separates vendor libraries for better caching

#### Development Mode Issues
If preview shows "Loading ADF Preview..." and doesn't load:

**🔧 SOLUTION - Recent Fixes Applied:**
1. **Build webview bundles first** (most common cause):
   ```bash
   yarn build:webview
   # This creates the required JS files the extension needs
   ```

2. **Fixed duplicate ready messages** - Extension now properly initializes
3. **Enhanced error reporting** - Script loading failures now show in console

**Common Issues:**
```bash
# Issue: Webview stuck on "Loading..." 
# Fix: Rebuild webview bundles
yarn build:webview

# Issue: Console shows script loading errors
# Fix: Check that all bundles exist
ls -la dist/webview/  # Should show:
# - atlaskit-vendor.js
# - react-vendor.js  
# - vendor.js
# - bundle.js

# Issue: Extension not activating
# Fix: Check VS Code console for errors
# Help -> Toggle Developer Tools -> Console

# Complete rebuild if still having issues:
yarn clean  # If available, or manually rm -rf dist/
yarn build
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

### 🔧 "Loading ADF Preview..." Fix (v0.2.7)
**Problem:** Extension shows "Loading ADF Preview..." with "process is not defined" error
**Root Cause:** Missing Node.js polyfills for browser environment in webview

**✅ FIXED - Complete solution:**
1. **Install all dependencies** (includes new browser polyfills):
   ```bash
   yarn install
   ```
2. **Build webview bundles** with updated webpack config:
   ```bash
   yarn build:webview
   ```
3. **Package and install**:
   ```bash
   npx @vscode/vsce package --no-dependencies --out build/
   cursor --install-extension build/adf-preview-0.2.7.vsix
   ```

**What was fixed in v0.2.7:**
- ✅ **Browser polyfills**: Added process, path, crypto, stream, buffer polyfills
- ✅ **Webpack configuration**: Proper fallbacks for Node.js modules
- ✅ **React Intl compatibility**: Added alias mapping for react-intl-next
- ✅ **Atlaskit dependencies**: Fixed missing peer dependencies
- ✅ **Process injection**: Added ProvidePlugin for global process/Buffer
- ✅ **Environment variables**: Proper NODE_ENV definition for webview

**Required polyfill packages (automatically installed):**
```json
{
  "devDependencies": {
    "process": "^0.11.10",
    "path-browserify": "^1.0.1",
    "crypto-browserify": "^3.12.1",
    "stream-browserify": "^3.0.0",
    "buffer": "^6.0.3",
    "util": "^0.12.5"
  },
  "dependencies": {
    "@atlaskit/analytics-next": "^11.1.1",
    "@atlaskit/link-provider": "^4.0.0",
    "@atlaskit/media-state": "^1.8.0",
    "react-intl": "^7.1.11"
  }
}
```

### Extension Not Activating
- Ensure you have a valid JSON file open
- Check that the file contains valid ADF structure (`type: "doc", version: 1`)
- Look for errors in Output → ADF Preview
- **NEW**: Verify webview bundles exist in `dist/webview/`

### Preview Not Updating
- Check `adf.preview.autoUpdate` setting
- Verify the JSON is valid ADF format
- Try manually refreshing with Command Palette
- **NEW**: Rebuild webview if preview was working before: `yarn build:webview`

### Rendering Issues
- Ensure all dependencies are installed: `yarn install`
- **CRITICAL**: Run `yarn build:webview` to create required bundles
- Check console for errors (Help → Toggle Developer Tools)
- **NEW**: Check for script loading failures in webview console
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