# ADF Preview Extension Test

This document tests the newly implemented ADF Preview extension features.

## ADF Panel Elements

### Info Panel
> ℹ️ **Info:** This is an information panel that should be highlighted and render with blue styling in the preview.

### Warning Panel
> ⚠️ **Warning:** This is a warning panel that should be highlighted and render with yellow styling in the preview.

### Success Panel
> ✅ **Success:** This is a success panel that should be highlighted and render with green styling in the preview.

### Note Panel
> 📝 **Note:** This is a note panel that should be highlighted and render with neutral styling in the preview.

### Error Panel
> ❌ **Error:** This is an error panel that should be highlighted and render with red styling in the preview.

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

1. Open this file in VS Code
2. Click the "Open Preview" button in the editor toolbar (should appear for .md files)
3. Test the completion features:
   - Type `>` and see ADF panel completions
   - Type `info` and use the snippet
   - Try other ADF-related snippets
4. Test template creation:
   - Open Command Palette (Cmd/Ctrl+Shift+P)
   - Run "ADF: Create from Template"
   - Select a template and fill in variables

## Expected Results

- ✅ Preview tab opens when clicking the toolbar button
- ✅ ADF panels are syntax highlighted with appropriate colors
- ✅ Code completion works for ADF elements
- ✅ Hover information shows for ADF panel elements
- ✅ Templates create new markdown documents with ADF elements
- ✅ All ADF elements render properly in the preview