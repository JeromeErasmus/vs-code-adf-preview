# Claude Instructions for ADF Preview Extension

## Build System

This project uses a **Makefile** for all build operations. Always use the Makefile commands instead of direct yarn/npm commands.

### Available Make Commands

- `make build` - Build the extension (TypeScript + Webpack)
- `make package` - Package extension into .vsix file
- `make install` - Install the packaged extension in VS Code
- `make full` - Build, package, and install (complete workflow)
- `make clean` - Clean build artifacts
- `make version` - Show current version
- `make help` - Show help message

### Development Commands

- `make dev-build` - Development build with watch mode
- `make lint` - Run ESLint
- `make test` - Run tests

### Typical Workflows

**For testing changes:**
```bash
make full
```

**For development:**
```bash
make dev-build
```

**For publishing:**
```bash
make build
make package
# Then publish the .vsix file to marketplace
```

## Project Structure

- `src/extension/` - VS Code extension code (Node.js)
- `src/webview/` - React components for preview (Browser)
- `src/shared/` - Shared types and utilities
- `dist/` - Built output
- `build/` - Packaged .vsix files

## Important Notes

- Always use `make` commands for consistency
- The extension supports both Cursor and VS Code
- Package version is automatically read from package.json
- Build artifacts are cleaned with `make clean`