# ADF Preview Extension Test

This document tests the newly implemented ADF Preview extension features.

## ADF Panel Elements

### Info Panel (Proper ADF Syntax)
~~~panel type=info title="Information"
This is an information panel that should be highlighted and render with blue styling in the preview.
~~~

### Warning Panel (Proper ADF Syntax)
~~~panel type=warning title="Warning"
This is a warning panel that should be highlighted and render with yellow styling in the preview.
~~~

### Success Panel (Proper ADF Syntax)
~~~panel type=success title="Success"
This is a success panel that should be highlighted and render with green styling in the preview.
~~~

### Note Panel (Proper ADF Syntax)
~~~panel type=note title="Note"
This is a note panel that should be highlighted and render with neutral styling in the preview.
~~~

### Error Panel (Proper ADF Syntax)
~~~panel type=error title="Error"
This is an error panel that should be highlighted and render with red styling in the preview.
~~~

## Markdown-Compatible Panels (Legacy Support)

### Info Panel (Legacy)
> ℹ️ **Info:** This is an information panel using markdown-compatible syntax.

### Warning Panel (Legacy)
> ⚠️ **Warning:** This is a warning panel using markdown-compatible syntax.

### Success Panel (Legacy)
> ✅ **Success:** This is a success panel using markdown-compatible syntax.

### Note Panel (Legacy)
> 📝 **Note:** This is a note panel using markdown-compatible syntax.

## Task Lists

- [ ] Incomplete task 1
- [ ] Incomplete task 2
- [x] Completed task
- [ ] Another incomplete task

## ADF Compatible Table

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

## Code Block

```typescript
// TypeScript code block
interface ADFDocument {
  type: 'doc';
  version: 1;
  content: ADFNode[];
}
```

## Testing Instructions

1. Open this file in VS Code or Cursor
2. Click the "Open Preview" button in the editor toolbar (should appear for .md files)
3. Test the completion features:
   - Type `panel-info` and use Tab to expand the proper ADF panel snippet
   - Type `panel-warn` for warning panels
   - Try legacy completions: type `info` for markdown-compatible panels
   - Test other panel types: `panel-success`, `panel-note`, `panel-error`
4. Test template creation:
   - Open Command Palette (Cmd/Ctrl+Shift+P)
   - Run "ADF: Create from Template"
   - Select a template and fill in variables
5. Test syntax highlighting:
   - Both `~~~panel type=info` blocks and `> ℹ️ **Info:**` should be highlighted
   - Check that different panel types get appropriate colors

## Expected Results

- ✅ Preview tab opens when clicking the toolbar button
- ✅ ADF panels are syntax highlighted with appropriate colors
- ✅ Code completion works for ADF elements
- ✅ Hover information shows for ADF panel elements
- ✅ Templates create new markdown documents with ADF elements
- ✅ All ADF elements render properly in the preview