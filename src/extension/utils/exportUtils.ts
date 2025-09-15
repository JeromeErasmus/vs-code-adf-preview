import { ADFDocument, ADFEntity } from '../../shared/types';
import MarkdownIt from 'markdown-it';

export async function exportAsHTML(document: ADFDocument, includeStyles: boolean = true): Promise<string> {
  const content = convertADFToHTML(document);
  
  if (!includeStyles) {
    return content;
  }

  // Wrap with full HTML document including styles
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ADF Document</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      color: #172b4d;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 { font-size: 2em; margin: 0.67em 0; }
    h2 { font-size: 1.5em; margin: 0.75em 0; }
    h3 { font-size: 1.17em; margin: 0.83em 0; }
    h4 { font-size: 1em; margin: 1.12em 0; }
    h5 { font-size: 0.83em; margin: 1.5em 0; }
    h6 { font-size: 0.75em; margin: 1.67em 0; }
    code {
      background-color: #f4f5f7;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
    pre {
      background-color: #f4f5f7;
      padding: 12px;
      border-radius: 3px;
      overflow-x: auto;
    }
    pre code {
      background: none;
      padding: 0;
    }
    blockquote {
      border-left: 3px solid #dfe1e6;
      margin: 1em 0;
      padding-left: 1em;
      color: #6b778c;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid #dfe1e6;
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background-color: #f4f5f7;
      font-weight: 600;
    }
    .panel {
      border: 1px solid #dfe1e6;
      border-radius: 3px;
      padding: 16px;
      margin: 1em 0;
    }
    .panel-info { background-color: #deebff; border-color: #4c9aff; }
    .panel-note { background-color: #eae6ff; border-color: #998dd9; }
    .panel-warning { background-color: #fff7e6; border-color: #ffab00; }
    .panel-error { background-color: #ffebe6; border-color: #ff5630; }
    .panel-success { background-color: #e3fcef; border-color: #00b887; }
    .status {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 3px;
      font-size: 0.9em;
      font-weight: 600;
    }
    .status-neutral { background-color: #dfe1e6; color: #42526e; }
    .status-purple { background-color: #eae6ff; color: #5243aa; }
    .status-blue { background-color: #deebff; color: #0052cc; }
    .status-red { background-color: #ffebe6; color: #bf2600; }
    .status-yellow { background-color: #fff7e6; color: #ff8b00; }
    .status-green { background-color: #e3fcef; color: #006644; }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;
}

function convertADFToHTML(node: ADFEntity): string {
  let html = '';

  switch (node.type) {
    case 'doc':
      if (node.content) {
        html = node.content.map(child => convertADFToHTML(child)).join('');
      }
      break;

    case 'paragraph':
      html = `<p>${convertContent(node)}</p>`;
      break;

    case 'heading':
      const level = node.attrs?.level || 1;
      html = `<h${level}>${convertContent(node)}</h${level}>`;
      break;

    case 'text':
      html = escapeHtml(node.text || '');
      if (node.marks) {
        html = applyMarks(html, node.marks);
      }
      break;

    case 'bulletList':
      html = `<ul>${convertContent(node)}</ul>`;
      break;

    case 'orderedList':
      html = `<ol>${convertContent(node)}</ol>`;
      break;

    case 'listItem':
      html = `<li>${convertContent(node)}</li>`;
      break;

    case 'blockquote':
      html = `<blockquote>${convertContent(node)}</blockquote>`;
      break;

    case 'codeBlock':
      const language = node.attrs?.language || '';
      html = `<pre><code class="language-${language}">${convertContent(node)}</code></pre>`;
      break;

    case 'rule':
      html = '<hr>';
      break;

    case 'panel':
      const panelType = node.attrs?.panelType || 'info';
      html = `<div class="panel panel-${panelType}">${convertContent(node)}</div>`;
      break;

    case 'table':
      html = `<table>${convertContent(node)}</table>`;
      break;

    case 'tableRow':
      html = `<tr>${convertContent(node)}</tr>`;
      break;

    case 'tableCell':
      const colspan = node.attrs?.colspan ? ` colspan="${node.attrs.colspan}"` : '';
      const rowspan = node.attrs?.rowspan ? ` rowspan="${node.attrs.rowspan}"` : '';
      html = `<td${colspan}${rowspan}>${convertContent(node)}</td>`;
      break;

    case 'tableHeader':
      const thColspan = node.attrs?.colspan ? ` colspan="${node.attrs.colspan}"` : '';
      const thRowspan = node.attrs?.rowspan ? ` rowspan="${node.attrs.rowspan}"` : '';
      html = `<th${thColspan}${thRowspan}>${convertContent(node)}</th>`;
      break;

    case 'status':
      const statusText = node.attrs?.text || '';
      const statusColor = node.attrs?.color || 'neutral';
      html = `<span class="status status-${statusColor}">${escapeHtml(statusText)}</span>`;
      break;

    case 'emoji':
      const shortName = node.attrs?.shortName || '';
      html = `<span class="emoji">${shortName}</span>`;
      break;

    case 'hardBreak':
      html = '<br>';
      break;

    default:
      // For unknown nodes, try to convert content if available
      if (node.content) {
        html = convertContent(node);
      } else if (node.text) {
        html = escapeHtml(node.text);
      }
  }

  return html;
}

function convertContent(node: ADFEntity): string {
  if (!node.content || !Array.isArray(node.content)) {
    return '';
  }
  return node.content.map(child => convertADFToHTML(child)).join('');
}

function applyMarks(html: string, marks: any[]): string {
  let result = html;
  
  // Apply marks in reverse order so nested tags work correctly
  marks.slice().reverse().forEach(mark => {
    switch (mark.type) {
      case 'strong':
        result = `<strong>${result}</strong>`;
        break;
      case 'em':
        result = `<em>${result}</em>`;
        break;
      case 'underline':
        result = `<u>${result}</u>`;
        break;
      case 'strike':
        result = `<s>${result}</s>`;
        break;
      case 'code':
        result = `<code>${result}</code>`;
        break;
      case 'link':
        const href = mark.attrs?.href || '#';
        const title = mark.attrs?.title ? ` title="${escapeHtml(mark.attrs.title)}"` : '';
        result = `<a href="${href}"${title}>${result}</a>`;
        break;
      case 'textColor':
        const color = mark.attrs?.color || 'inherit';
        result = `<span style="color: ${color}">${result}</span>`;
        break;
    }
  });
  
  return result;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  return text.replace(/[&<>"'/]/g, char => map[char]);
}

export async function exportAsMarkdown(document: ADFDocument): Promise<string> {
  return convertADFToMarkdown(document);
}

function convertADFToMarkdown(node: ADFEntity, depth: number = 0): string {
  let markdown = '';

  switch (node.type) {
    case 'doc':
      if (node.content) {
        markdown = node.content.map(child => convertADFToMarkdown(child, depth)).join('\n\n');
      }
      break;

    case 'paragraph':
      markdown = convertMarkdownContent(node, depth);
      break;

    case 'heading':
      const level = node.attrs?.level || 1;
      const prefix = '#'.repeat(level);
      markdown = `${prefix} ${convertMarkdownContent(node, depth)}`;
      break;

    case 'text':
      markdown = node.text || '';
      if (node.marks) {
        markdown = applyMarkdownMarks(markdown, node.marks);
      }
      break;

    case 'bulletList':
      if (node.content) {
        markdown = node.content
          .map(child => convertADFToMarkdown(child, depth))
          .join('\n');
      }
      break;

    case 'orderedList':
      if (node.content) {
        markdown = node.content
          .map((child, index) => {
            const content = convertMarkdownContent(child, depth);
            return `${index + 1}. ${content}`;
          })
          .join('\n');
      }
      break;

    case 'listItem':
      const indent = '  '.repeat(depth);
      const content = convertMarkdownContent(node, depth + 1);
      markdown = `${indent}- ${content}`;
      break;

    case 'blockquote':
      const quoteContent = convertMarkdownContent(node, depth);
      markdown = quoteContent.split('\n').map(line => `> ${line}`).join('\n');
      break;

    case 'codeBlock':
      const language = node.attrs?.language || '';
      const codeContent = convertMarkdownContent(node, depth);
      markdown = `\`\`\`${language}\n${codeContent}\n\`\`\``;
      break;

    case 'rule':
      markdown = '---';
      break;

    case 'panel':
      const panelType = node.attrs?.panelType || 'info';
      const panelContent = convertMarkdownContent(node, depth);
      const panelIcon = getPanelIcon(panelType);
      markdown = `> ${panelIcon} **${panelType.toUpperCase()}**\n> ${panelContent.replace(/\n/g, '\n> ')}`;
      break;

    case 'table':
      if (node.content) {
        const rows = node.content.map(row => convertTableRow(row));
        if (rows.length > 0) {
          markdown = rows[0] + '\n';
          // Add separator after header row
          const firstRow = node.content[0];
          if (firstRow.content) {
            markdown += '|' + firstRow.content.map(() => '---').join('|') + '|\n';
          }
          if (rows.length > 1) {
            markdown += rows.slice(1).join('\n');
          }
        }
      }
      break;

    case 'status':
      const statusText = node.attrs?.text || '';
      const statusColor = node.attrs?.color || 'neutral';
      markdown = `[${statusText.toUpperCase()}]`;
      break;

    case 'emoji':
      const shortName = node.attrs?.shortName || '';
      markdown = shortName;
      break;

    case 'hardBreak':
      markdown = '  \n';
      break;

    default:
      // For unknown nodes, try to convert content if available
      if (node.content) {
        markdown = convertMarkdownContent(node, depth);
      } else if (node.text) {
        markdown = node.text;
      }
  }

  return markdown;
}

function convertMarkdownContent(node: ADFEntity, depth: number): string {
  if (!node.content || !Array.isArray(node.content)) {
    return '';
  }
  return node.content.map(child => convertADFToMarkdown(child, depth)).join('');
}

function convertTableRow(row: ADFEntity): string {
  if (!row.content) return '';
  
  const cells = row.content.map(cell => {
    const content = convertMarkdownContent(cell, 0);
    return content.replace(/\|/g, '\\|'); // Escape pipes in cell content
  });
  
  return '|' + cells.join('|') + '|';
}

function applyMarkdownMarks(text: string, marks: any[]): string {
  let result = text;
  
  marks.forEach(mark => {
    switch (mark.type) {
      case 'strong':
        result = `**${result}**`;
        break;
      case 'em':
        result = `*${result}*`;
        break;
      case 'strike':
        result = `~~${result}~~`;
        break;
      case 'code':
        result = `\`${result}\``;
        break;
      case 'link':
        const href = mark.attrs?.href || '#';
        const title = mark.attrs?.title;
        if (title) {
          result = `[${result}](${href} "${title}")`;
        } else {
          result = `[${result}](${href})`;
        }
        break;
    }
  });
  
  return result;
}

function getPanelIcon(panelType: string): string {
  switch (panelType) {
    case 'info': return 'ℹ️';
    case 'note': return '📝';
    case 'warning': return '⚠️';
    case 'error': return '❌';
    case 'success': return '✅';
    default: return '📋';
  }
}