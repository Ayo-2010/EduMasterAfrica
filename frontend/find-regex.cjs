const fs = require('fs');
const content = fs.readFileSync('C:/Users/User/Documents/GitHub/EduMasterAfrica/design/src/app/App.tsx', 'utf8');
const lines = content.split(/\r?\n/);
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Look for / that could start a regex: not //, not /*, not inside string
  // Simple heuristic: find unescaped / not followed by / or *
  const trimmed = line.trim();
  if (!trimmed) continue;
  // Skip lines that are obviously comments or JSX tags
  if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('</') || trimmed.startsWith('import ') || trimmed.startsWith('export ') || trimmed.startsWith('function ') || trimmed.startsWith('const ') || trimmed.startsWith('let ') || trimmed.startsWith('return') || trimmed.startsWith('if (') || trimmed.startsWith('}')) continue;
  for (let j = 0; j < line.length; j++) {
    if (line[j] === '/') {
      if (j + 1 < line.length && line[j + 1] === '/') break; // line comment
      if (j + 1 < line.length && line[j + 1] === '*') break; // block comment start
      // Could be a regex start
      const after = line.slice(j + 1).trimStart();
      if (after && !after.startsWith('/')) {
        const lineNum = i + 1;
        console.log(lineNum + ': ' + line.trim());
        break;
      }
    }
  }
}
