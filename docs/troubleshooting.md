# Troubleshooting Guide

This guide helps resolve common issues with the ADF Preview extension.

## Installation Issues

### Extension Not Installing

**Problem**: VSIX installation fails or extension doesn't appear

**Solutions**:

1. **Check VS Code/Cursor Version**:
   ```bash
   code --version
   # Ensure version is 1.74.0 or higher
   ```

2. **Manual Installation**:
   ```bash
   # Try with force flag
   code --install-extension adf-preview.vsix --force
   
   # Or for Cursor
   cursor --install-extension adf-preview.vsix --force
   ```

3. **Clear Extension Cache**:
   - Close VS Code/Cursor completely
   - Delete extension cache:
     - **Windows**: `%USERPROFILE%\.vscode\extensions\`
     - **macOS**: `~/.vscode/extensions/`
     - **Linux**: `~/.vscode/extensions/`
   - Reinstall the extension

4. **Permissions Issues**:
   ```bash
   # macOS/Linux: Fix permissions
   sudo chown -R $USER ~/.vscode/extensions/
   
   # Windows: Run as administrator
   ```

### Build from Source Issues

**Problem**: Build fails or produces errors

**Solutions**:

1. **Clean Build**:
   ```bash
   rm -rf node_modules dist build
   yarn install
   make build
   ```

2. **Dependency Conflicts**:
   ```bash
   # Clear yarn cache
   yarn cache clean
   
   # Reinstall with exact versions
   rm yarn.lock
   yarn install
   ```

3. **Node.js Version Issues**:
   ```bash
   # Use Node.js 18+
   node --version  # Should be 18.0.0 or higher
   
   # Update Node.js if needed
   nvm install 18
   nvm use 18
   ```

## Extension Activation Issues

### Extension Not Activating

**Problem**: Extension appears installed but doesn't activate

**Diagnostics**:
1. Check Output panel → "ADF Preview" for errors
2. Open Command Palette → Type "ADF" - no commands appear
3. Right-click on .md file → "Open Preview" not available

**Solutions**:

1. **Verify File Types**:
   - Extension activates on `.md` and `.adf` files
   - Ensure you're working with supported file types

2. **Check Activation Events**:
   ```json
   // In package.json - verify these exist:
   "activationEvents": [
     "onLanguage:markdown",
     "onCustomEditor:adf.preview"
   ]
   ```

3. **Manual Activation**:
   - Command Palette → "Developer: Reload Window"
   - Or restart VS Code/Cursor completely

4. **Extension Host Issues**:
   - Command Palette → "Developer: Restart Extension Host"
   - Check for conflicting extensions

### Commands Not Working

**Problem**: ADF commands don't appear or fail when executed

**Solutions**:

1. **Verify Command Registration**:
   - Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
   - Type "ADF" - should show extension commands
   - If no commands appear, extension isn't properly activated

2. **Check File Context**:
   - Commands may be context-sensitive
   - Ensure you have a `.md` file open and focused

3. **Reset Command Cache**:
   - Command Palette → "Developer: Reload Window"
   - Try commands again

## Preview Issues

### Preview Not Loading

**Problem**: Preview shows "Loading ADF Preview..." indefinitely

**Root Causes**:
- Missing webview bundles
- JavaScript errors in webview
- Extension-webview communication issues

**Solutions**:

1. **Check Webview Bundles** (Most Common Issue):
   ```bash
   # Verify bundles exist
   ls -la dist/webview/
   # Should show:
   # - atlaskit-vendor.js (~7.3MB)
   # - react-vendor.js (~132KB)  
   # - vendor.js (~4MB)
   # - bundle.js (~22KB)
   
   # If missing, rebuild webview
   yarn build:webview
   ```

2. **Check JavaScript Errors**:
   - Right-click in preview → "Inspect"
   - Look for console errors
   - Common error: "process is not defined"

3. **Webview Communication**:
   - Open Output panel → "ADF Preview"
   - Look for communication errors
   - Restart window if communication is broken

4. **Complete Rebuild**:
   ```bash
   # Nuclear option - full clean rebuild
   make clean  # or rm -rf dist/
   make build
   make package
   make install
   ```

### Preview Not Updating

**Problem**: Preview doesn't reflect changes to source file

**Solutions**:

1. **Check Auto-Update Settings**:
   ```json
   {
     "adf.preview.autoUpdate": true,
     "adf.preview.updateDelay": 500
   }
   ```

2. **Manual Refresh**:
   - Command Palette → "ADF: Open Preview" (reopens preview)
   - Or close and reopen the preview tab

3. **File Change Detection**:
   - Save the file (`Ctrl+S` / `Cmd+S`)
   - Some changes require explicit save to trigger update

4. **Large File Performance**:
   - Increase update delay for large files:
   ```json
   {
     "adf.preview.updateDelay": 1000
   }
   ```

### Rendering Issues

**Problem**: Content renders incorrectly or not at all

**Solutions**:

1. **ADF Structure Validation**:
   - Command Palette → "ADF: Validate Document"
   - Fix any structural errors reported

2. **Supported Elements**:
   - Check [Features Overview](features.md) for supported ADF elements
   - Some elements may render as placeholders

3. **Theme Issues**:
   ```json
   {
     "adf.preview.theme": "light"  // Try explicit theme
   }
   ```

4. **Font and Styling**:
   ```json
   {
     "adf.preview.fontSize": 14,
     "adf.export.includeStyles": true
   }
   ```

## Webview Errors

### "process is not defined" Error

**Problem**: Console shows "ReferenceError: process is not defined"

**Status**: ✅ **FIXED in v0.2.7+**

**Solution** (if still occurring):
1. Ensure you have v0.2.7 or later
2. Rebuild webview bundles:
   ```bash
   yarn build:webview
   ```
3. Reinstall extension

**Technical Details**:
- Fixed by adding Node.js polyfills to webpack config
- Extension now includes process, path, crypto, and buffer polyfills

### React/Atlaskit Errors

**Problem**: React component errors or Atlaskit rendering failures

**Solutions**:

1. **Check Bundle Integrity**:
   ```bash
   # Verify bundle sizes
   ls -lh dist/webview/*.js
   # atlaskit-vendor.js should be ~7.3MB
   # If much smaller, rebuild failed
   ```

2. **Dependency Issues**:
   ```bash
   # Reinstall with exact versions
   rm -rf node_modules yarn.lock
   yarn install
   yarn build:webview
   ```

3. **Memory Issues**:
   - Large documents may cause memory issues
   - Try with smaller test documents
   - Increase VS Code memory if possible

## Performance Issues

### Slow Preview Updates

**Problem**: Preview updates are sluggish or delayed

**Solutions**:

1. **Adjust Update Delay**:
   ```json
   {
     "adf.preview.updateDelay": 1000  // Increase delay
   }
   ```

2. **Disable Real-time Features**:
   ```json
   {
     "adf.validation.realtime": false,  // Disable real-time validation
     "adf.preview.autoUpdate": false    // Manual updates only
   }
   ```

3. **Document Size Optimization**:
   - Split large documents into smaller sections
   - Remove or optimize images
   - Simplify complex nested structures

### High Memory Usage

**Problem**: Extension consumes excessive memory

**Solutions**:

1. **Webview Management**:
   - Close unused preview tabs
   - Extension automatically disposes old webviews

2. **Validation Caching**:
   - Extension caches validation results
   - Restart to clear cache if needed

3. **Large File Handling**:
   - Use pagination for very large documents
   - Consider splitting into multiple files

## Code Completion Issues

### Completions Not Working

**Problem**: Code completion doesn't trigger or provide ADF suggestions

**Solutions**:

1. **Verify Language Mode**:
   - Ensure file is recognized as Markdown
   - Check status bar shows "Markdown" language

2. **Trigger Characters**:
   - Type `>` to trigger panel completions
   - Type `info`, `warn`, etc. for snippet completions

3. **Settings Check**:
   ```json
   {
     "adf.completion.enabled": true,
     "adf.completion.templates": true,
     "adf.completion.snippets": true
   }
   ```

4. **IntelliSense Settings**:
   ```json
   {
     "editor.suggestOnTriggerCharacters": true,
     "editor.quickSuggestions": {
       "strings": true
     }
   }
   ```

### Template Variables Not Working

**Problem**: Template variables ({{VARIABLE}}) not being replaced

**Solutions**:

1. **Template Processing**:
   - Use "ADF: Create from Template" command
   - Manual copy-paste won't process variables

2. **Variable Format**:
   - Ensure variables use `{{VARIABLE}}` format
   - Case-sensitive variable names

3. **Input Dialogs**:
   - Extension should prompt for variable values
   - If prompts don't appear, check notification permissions

## Export Issues

### Export Commands Fail

**Problem**: HTML/Markdown export produces errors or empty files

**Solutions**:

1. **Validate Before Export**:
   - Command Palette → "ADF: Validate Document"
   - Fix any errors before attempting export

2. **File Permissions**:
   ```bash
   # Check write permissions to target directory
   ls -la /target/directory/
   ```

3. **Export Settings**:
   ```json
   {
     "adf.export.includeStyles": true,
     "adf.export.format": "pretty"
   }
   ```

4. **Large Document Export**:
   - Very large documents may timeout during export
   - Try exporting smaller sections

### Incorrect Export Format

**Problem**: Exported content doesn't match preview

**Solutions**:

1. **Styling Issues**:
   - HTML export: Ensure `includeStyles: true`
   - Check exported file in web browser

2. **Markdown Compatibility**:
   - Some ADF elements have limited Markdown equivalents
   - Review exported file for fallback formatting

3. **Character Encoding**:
   ```json
   {
     "adf.export.encoding": "utf8"
   }
   ```

## Syntax Highlighting Issues

### ADF Elements Not Highlighted

**Problem**: ADF panel syntax not getting proper highlighting

**Solutions**:

1. **Grammar Registration**:
   - Check that grammar injection is working
   - Restart VS Code to reload grammars

2. **File Association**:
   - Ensure file is recognized as Markdown
   - May need to set language mode manually

3. **Theme Compatibility**:
   - Some themes may not support custom grammar scopes
   - Try different themes to verify highlighting works

## Development/Debug Issues

### Extension Development Host Issues

**Problem**: Issues when developing/debugging the extension

**Solutions**:

1. **Build Before Debug**:
   ```bash
   # Always build before debugging
   make build
   # Then press F5 in VS Code
   ```

2. **Source Maps**:
   ```json
   // Ensure webpack generates source maps
   "devtool": "source-map"
   ```

3. **Debug Console**:
   - Use VS Code Debug Console for extension debugging
   - Use webview Developer Tools for React debugging

### Test Failures

**Problem**: Tests fail during development

**Solutions**:

1. **Test Environment**:
   ```bash
   # Ensure test dependencies are installed
   yarn install
   
   # Run tests individually to isolate issues
   yarn test:extension
   yarn test:webview
   ```

2. **Mock VS Code API**:
   - Tests need proper VS Code API mocking
   - Check test setup files

3. **Async Test Issues**:
   - Use proper async/await in tests
   - Ensure promises are resolved

## Getting Help

### Diagnostic Information

When reporting issues, include:

1. **Extension Version**: Check Extensions view
2. **Editor Version**: `code --version` or `cursor --version`
3. **Operating System**: Windows/macOS/Linux version
4. **Error Messages**: From Output panel → "ADF Preview"
5. **Console Errors**: From webview Developer Tools

### Export Debug Information

```bash
# Generate debug info
Command Palette → "ADF: Write Debug Log"
# Saves comprehensive diagnostic data
```

### Support Channels

1. **GitHub Issues**: Report bugs and feature requests
2. **Documentation**: Check other guides in this docs folder
3. **VS Code Community**: For VS Code-specific issues
4. **Atlassian Community**: For ADF specification questions

## Common Error Messages

### "Extension failed to activate"
- Check VS Code version compatibility
- Look for dependency conflicts
- Verify extension integrity

### "Webview failed to load"
- Rebuild webview bundles: `yarn build:webview`
- Check for JavaScript errors in webview console
- Verify all required bundles exist

### "Command not found"
- Extension may not be activated
- Check file type and activation events
- Restart extension host

### "Invalid ADF structure"
- Run document validation
- Check ADF specification compliance
- Use templates for valid structure examples

This troubleshooting guide should resolve most common issues. For persistent problems, create a GitHub issue with diagnostic information.