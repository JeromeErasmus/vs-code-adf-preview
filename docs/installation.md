# Installation Guide

This guide covers all installation methods for the ADF Preview extension in both VS Code and Cursor IDE.

## Quick Installation

### For VS Code Users

1. Download the latest `.vsix` file from [GitHub Releases](https://github.com/yourusername/adf-preview/releases)
2. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Type "Extensions: Install from VSIX"
4. Select the downloaded `.vsix` file
5. Restart VS Code

```bash
# Alternative: Command line installation
code --install-extension adf-preview-0.3.0.vsix
```

### For Cursor IDE Users

1. Download the latest `.vsix` file from [GitHub Releases](https://github.com/yourusername/adf-preview/releases)
2. **Drag & Drop Method** (Recommended):
   - Simply drag the `.vsix` file into the Cursor window
3. **Command Line Method**:
   ```bash
   cursor --install-extension adf-preview-0.3.0.vsix
   ```
4. **Manual Method**:
   - Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
   - Click "..." menu → "Install from VSIX"
   - Select the downloaded file

## Verification

After installation, verify the extension is working:

1. Create a new file with `.md` extension
2. Add some ADF-style markdown content:
   ```markdown
   # Test Document
   
   > ℹ️ **Info:** This is an ADF info panel
   
   - [ ] Task item
   - [x] Completed task
   ```
3. Right-click → "Open Preview" or use Command Palette → "ADF: Open Preview"
4. You should see the rendered preview in a new tab

## Build from Source

For developers or users who want the latest features:

### Prerequisites

- **Node.js**: 18+ (tested with v18.17.0)
- **Yarn**: 4.7.0+ (preferred package manager)
- **VS Code or Cursor IDE**: Latest version

### Build Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/adf-preview.git
   cd adf-preview
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Build the extension**:
   ```bash
   # Use Makefile for consistent builds
   make build
   ```

4. **Package the extension**:
   ```bash
   make package
   ```

5. **Install the built extension**:
   ```bash
   make install
   
   # Or for complete workflow:
   make full
   ```

### Alternative Build Method

If you prefer manual commands:

```bash
# Build webview bundles (required first)
yarn build:webview

# Build extension code  
yarn build:extension

# Package for distribution
npx @vscode/vsce package --no-dependencies --out build/

# Install
code --install-extension build/adf-preview-X.X.X.vsix
# OR for Cursor:
cursor --install-extension build/adf-preview-X.X.X.vsix
```

## Troubleshooting Installation

### Extension Not Appearing

- Restart your editor after installation
- Check the Extensions view to confirm installation
- Look for errors in Output → ADF Preview

### Build Issues

**Missing webview bundles**:
```bash
yarn build:webview
```

**Dependency conflicts**:
```bash
rm -rf node_modules yarn.lock
yarn install
```

**Package creation fails**:
```bash
npx @vscode/vsce package --no-yarn --no-dependencies --out build/
```

### Performance Issues

The extension bundles are large (~11.4MB total) due to @atlaskit/renderer dependencies. This is expected and required for full ADF compatibility.

## System Requirements

- **VS Code**: 1.74.0 or higher
- **Cursor IDE**: Latest version
- **Node.js**: 18+ (for building from source)
- **Memory**: At least 4GB RAM recommended for large ADF documents

## Next Steps

After installation, see the [Features Overview](features.md) to learn about available features, or jump to the [User Guide](user-guide.md) for practical usage examples.