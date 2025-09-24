# Developer Guide

This guide is for developers who want to contribute to the ADF Preview extension or customize it for their needs.

## Development Environment Setup

### Prerequisites

- **Node.js**: 18+ (tested with v18.17.0)
- **Yarn**: 4.7.0+ (preferred package manager)
- **VS Code**: Latest version with Extension Development Host
- **Git**: For version control

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/adf-preview.git
   cd adf-preview
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Build the project**:
   ```bash
   # Use Makefile for consistent builds
   make build
   
   # Or manually:
   yarn build:webview
   yarn build:extension
   ```

## Project Architecture

### Directory Structure

```
src/
├── extension/                    # VS Code extension code (Node.js)
│   ├── extension.ts             # Entry point with command registration
│   ├── providers/               # Custom providers
│   │   ├── adfEditorProvider.ts # ADF custom editor
│   │   ├── markdownAdfCompletionProvider.ts # Code completion
│   │   ├── markdownAdfHoverProvider.ts      # Hover information
│   │   └── previewTabManager.ts # Tab management
│   ├── templates/               # Document templates
│   │   ├── markdownTemplateManager.ts
│   │   └── predefinedMarkdownTemplates.ts
│   ├── validators/              # ADF validation
│   │   ├── adfValidator.ts
│   │   └── enhancedAdfValidator.ts
│   └── utils/                   # Utilities
│       └── exportUtils.ts
├── webview/                     # React components for preview
│   ├── App.tsx                  # Main React component
│   ├── components/              # React components
│   │   ├── ADFRenderer.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── LoadingSpinner.tsx
│   └── styles/                  # CSS styles
│       └── webview.css
├── shared/                      # Shared types and utilities
│   ├── types.ts                 # Common TypeScript interfaces
│   └── converters/              # Markdown ↔ ADF conversion
└── test/                        # Test files
    ├── extension/
    ├── webview/
    └── shared/
```

### Key Components

#### Extension Host (Node.js)
- **extension.ts**: Main entry point, command registration
- **ADFEditorProvider**: Custom editor for .adf files
- **TemplateManager**: Handles document templates
- **Validators**: ADF structure validation

#### Webview (Browser/React)
- **App.tsx**: Main React application
- **ADFRenderer**: Atlaskit renderer integration

### Data Flow

1. **User Action** → Extension Host processes command
2. **Extension Host** → Sends data to Webview via message passing
3. **Webview** → Renders content using React + Atlaskit
4. **Webview** → Sends updates back to Extension Host
5. **Extension Host** → Updates VS Code UI or file system

## Build System

### Makefile Commands

The project uses a Makefile for consistent builds:

```bash
# Full workflow
make full          # Build, package, and install

# Individual steps
make build         # Build extension and webview
make package       # Create VSIX package
make install       # Install in current editor
make clean         # Clean build artifacts

# Development
make dev-build     # Development build with watch
make lint          # Run ESLint
make test          # Run tests
```

### Manual Build Process

If you prefer manual control:

```bash
# 1. Build webview (must be first)
yarn build:webview

# 2. Build extension
yarn build:extension

# 3. Package
npx @vscode/vsce package --no-dependencies --out build/

# 4. Install
code --install-extension build/adf-preview-X.X.X.vsix
```

### Webpack Configuration

The build system uses Webpack 5 with code splitting:

**Extension Bundle** (`webpack.config.js`):
- Target: Node.js (VS Code extension host)
- Entry: `src/extension/extension.ts`
- Output: `dist/extension/extension.js`

**Webview Bundle** (`webpack.webview.config.js`):
- Target: Browser (VS Code webview)
- Entry: `src/webview/index.tsx`
- Code Splitting:
  - `atlaskit-vendor.js`: @atlaskit packages (~7.3MB)
  - `react-vendor.js`: React/ReactDOM (~132KB)
  - `vendor.js`: Other dependencies (~4MB)
  - `bundle.js`: Application code (~22KB)

### Browser Polyfills

The webview includes polyfills for Node.js modules:

```javascript
// webpack.webview.config.js
resolve: {
  fallback: {
    "process": require.resolve("process/browser.js"),
    "path": require.resolve("path-browserify"),
    "crypto": require.resolve("crypto-browserify"),
    // ... additional polyfills
  }
}
```

## Feature Implementation

### Adding New Commands

1. **Register Command** in `extension.ts`:
   ```typescript
   const myCommand = vscode.commands.registerCommand('adf.myCommand', async () => {
     // Command implementation
   });
   context.subscriptions.push(myCommand);
   ```

2. **Add to package.json**:
   ```json
   "contributes": {
     "commands": [
       {
         "command": "adf.myCommand",
         "title": "My Command",
         "category": "ADF"
       }
     ]
   }
   ```

3. **Add Menu Items** (optional):
   ```json
   "menus": {
     "editor/context": [
       {
         "command": "adf.myCommand",
         "when": "resourceExtname == .md"
       }
     ]
   }
   ```

### Adding New Templates

1. **Define Template** in `predefinedMarkdownTemplates.ts`:
   ```typescript
   export const MY_TEMPLATE: MarkdownTemplate = {
     id: 'my-template',
     name: 'My Template',
     description: 'Description of my template',
     variables: [
       {
         key: 'TITLE',
         label: 'Document Title',
         type: 'text',
         placeholder: 'Enter title'
       }
     ],
     content: `# {{TITLE}}\n\nContent here...`
   };
   ```

2. **Register Template** in `markdownTemplateManager.ts`:
   ```typescript
   getTemplates(): MarkdownTemplate[] {
     return [
       // ... existing templates
       MY_TEMPLATE
     ];
   }
   ```

### Adding Syntax Highlighting

1. **Create Grammar** in `syntaxes/markdown-adf.tmLanguage.json`:
   ```json
   {
     "patterns": [
       {
         "name": "markup.quote.adf.my-element",
         "match": "^(>\\s*)(🎯\\s*\\*\\*MyElement:\\*\\*)(.*)",
         "captures": {
           "1": {"name": "punctuation.definition.quote.markdown"},
           "2": {"name": "entity.name.tag.adf.my-element"},
           "3": {"name": "markup.quote.adf.content"}
         }
       }
     ]
   }
   ```

2. **Register in package.json**:
   ```json
   "contributes": {
     "grammars": [
       {
         "scopeName": "text.html.markdown.adf",
         "path": "./syntaxes/markdown-adf.tmLanguage.json",
         "injectTo": ["text.html.markdown"]
       }
     ]
   }
   ```

### Adding Code Completion

1. **Create Provider** in `providers/markdownAdfCompletionProvider.ts`:
   ```typescript
   export class MyCompletionProvider implements vscode.CompletionItemProvider {
     provideCompletionItems(
       document: vscode.TextDocument,
       position: vscode.Position
     ): vscode.CompletionItem[] {
       const completion = new vscode.CompletionItem(
         'my-snippet',
         vscode.CompletionItemKind.Snippet
       );
       completion.insertText = new vscode.SnippetString('My ${1:content}');
       return [completion];
     }
   }
   ```

2. **Register Provider** in `extension.ts`:
   ```typescript
   const completionProvider = new MyCompletionProvider();
   const disposable = vscode.languages.registerCompletionItemProvider(
     'markdown',
     completionProvider,
     '>' // Trigger character
   );
   context.subscriptions.push(disposable);
   ```

## Testing

### Test Structure

```
src/test/
├── extension/               # Extension tests (Node.js)
│   ├── extension.test.ts
│   ├── validators/
│   └── utils/
├── webview/                # Webview tests (Jest + React Testing Library)
│   ├── App.test.tsx
│   └── components/
└── shared/                 # Shared code tests
    ├── types.test.ts
    └── converters/
```

### Running Tests

```bash
# All tests
yarn test

# Extension tests (Mocha)
yarn test:extension

# Webview tests (Jest)
yarn test:webview

# Watch mode
yarn test:watch

# Coverage
yarn test:coverage
```

### Writing Extension Tests

```typescript
// src/test/extension/validators/adfValidator.test.ts
import * as assert from 'assert';
import { ADFValidator } from '../../../extension/validators/adfValidator';

suite('ADF Validator Tests', () => {
  test('should validate valid ADF document', () => {
    const validator = new ADFValidator();
    const validDoc = {
      type: 'doc',
      version: 1,
      content: []
    };
    
    const result = validator.validate(validDoc);
    assert.strictEqual(result.isValid, true);
  });
});
```

### Writing Webview Tests

```typescript
// src/test/webview/App.test.tsx
import { render, screen } from '@testing-library/react';
import App from '../../webview/App';

test('renders ADF content correctly', () => {
  const adfDoc = {
    type: 'doc',
    version: 1,
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Hello World' }]
      }
    ]
  };
  
  render(<App initialDoc={adfDoc} />);
  expect(screen.getByText('Hello World')).toBeInTheDocument();
});
```

## Debugging

### Extension Debugging

1. **VS Code Debug Configuration**:
   ```json
   // .vscode/launch.json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Run Extension",
         "type": "extensionHost",
         "request": "launch",
         "runtimeExecutable": "${execPath}",
         "args": ["--extensionDevelopmentPath=${workspaceFolder}"],
         "outFiles": ["${workspaceFolder}/dist/**/*.js"]
       }
     ]
   }
   ```

2. **Launch Debug Session**: Press `F5` in VS Code

3. **Set Breakpoints**: In TypeScript source files

### Webview Debugging

1. **Open Developer Tools**:
   - Command Palette → "Developer: Open Webview Developer Tools"
   - Or right-click in webview → "Inspect"

2. **Console Debugging**:
   ```typescript
   // In webview code
   console.log('Debug message', data);
   ```

3. **React DevTools**: Available in webview developer tools

### Logging

```typescript
// Extension logging
import * as vscode from 'vscode';

const outputChannel = vscode.window.createOutputChannel('ADF Preview');
outputChannel.appendLine('Debug message');
outputChannel.show();

// Webview logging
console.log('Webview debug:', data);
```

## Performance Optimization

### Extension Performance

- **Lazy Loading**: Load providers and validators on demand
- **Caching**: Cache validation results and completions
- **Debouncing**: Debounce file change events

```typescript
// Debounced updates
const debouncedUpdate = debounce((document: vscode.TextDocument) => {
  updatePreview(document);
}, 500);
```

### Webview Performance

- **Code Splitting**: Separate vendor and application bundles
- **React Optimization**: Use React.memo for expensive components
- **Virtual Scrolling**: For large documents

```typescript
// React.memo optimization
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* Expensive rendering */}</div>;
});
```

### Bundle Size Optimization

- **Tree Shaking**: Webpack eliminates unused code
- **Dynamic Imports**: Load features on demand
- **Compression**: Webpack compression plugins

## Contributing Guidelines

### Code Style

- **Prettier**: Code formatting (`.prettierrc`)
- **ESLint**: Code linting (`.eslintrc.js`)
- **TypeScript**: Strict type checking

### Commit Messages

Use conventional commit format:
```
feat: add tab-based preview functionality
fix: resolve webview loading issues
docs: update installation guide
test: add validator unit tests
```

### Pull Request Process

1. **Fork** the repository
2. **Create Feature Branch**: `git checkout -b feat/my-feature`
3. **Implement Changes**: Follow code style guidelines
4. **Add Tests**: Ensure adequate test coverage
5. **Update Documentation**: Update relevant docs
6. **Submit PR**: Include detailed description

### Testing Requirements

- **Unit Tests**: All new functions must have tests
- **Integration Tests**: Test extension commands and webview interactions
- **Manual Testing**: Test in both VS Code and Cursor
- **Performance Testing**: Verify no performance regressions

## Deployment

### Version Management

1. **Update Version**:
   ```bash
   npm version patch  # or minor, major
   ```

2. **Update Changelog**: Document changes in `CHANGELOG.md`

3. **Tag Release**:
   ```bash
   git tag -a v0.3.0 -m "Release v0.3.0"
   git push origin v0.3.0
   ```

### Publishing

1. **Build Production Package**:
   ```bash
   make build
   make package
   ```

2. **Test Package**:
   ```bash
   code --install-extension build/adf-preview-X.X.X.vsix
   # Test all features
   ```

3. **Publish to Marketplace**:
   ```bash
   npx @vscode/vsce publish
   ```

## Troubleshooting Development Issues

### Common Build Issues

**Webview not loading**:
```bash
# Ensure webview bundles exist
ls -la dist/webview/
# Rebuild if missing
yarn build:webview
```

**TypeScript errors**:
```bash
# Check TypeScript configuration
npx tsc --noEmit
# Fix any type errors
```

**Package creation fails**:
```bash
# Use no-dependencies flag
npx @vscode/vsce package --no-dependencies
```

### Extension Development Issues

**Extension not activating**:
- Check `package.json` activation events
- Verify command registration
- Check VS Code console for errors

**Commands not working**:
- Verify command registration in `extension.ts`
- Check `package.json` command definitions
- Test with Command Palette

**Webview communication issues**:
- Check message passing between extension and webview
- Verify data serialization
- Use developer tools for debugging

## API Reference

### Extension API

Key classes and interfaces:

```typescript
// ADFEditorProvider
class ADFEditorProvider implements vscode.CustomTextEditorProvider {
  resolveCustomTextEditor(document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel): void;
}

// TemplateManager
class TemplateManager {
  getTemplates(): MarkdownTemplate[];
  processTemplate(template: MarkdownTemplate): Promise<string>;
}

// Validator
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}
```

### Webview API

Message passing interface:

```typescript
// Messages from extension to webview
interface ToWebviewMessage {
  type: 'updateContent' | 'export';
  data: any;
}

// Messages from webview to extension
interface FromWebviewMessage {
  type: 'ready' | 'contentChanged' | 'error';
  data: any;
}
```

This developer guide provides a comprehensive foundation for contributing to and extending the ADF Preview extension. For additional questions, see the project's GitHub issues or start a discussion.