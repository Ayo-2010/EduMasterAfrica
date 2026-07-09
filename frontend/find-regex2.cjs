const fs = require('fs');
const content = fs.readFileSync('C:/Users/User/Documents/GitHub/EduMasterAfrica/design/src/app/App.tsx', 'utf8');
const lines = content.split(/\r?\n/);

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  let inStr = false;
  let strCh = '';
  let escaped = false;
  
  for (let j = 0; j < line.length; j++) {
    const c = line[j];
    if (escaped) { escaped = false; continue; }
    if (c === '\\') { escaped = true; continue; }
    if (inStr) {
      if (c === strCh) inStr = false;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      inStr = true;
      strCh = c;
      continue;
    }
    if (c === '/' && j + 1 < line.length) {
      if (line[j + 1] === '/') break; // line comment
      if (line[j + 1] === '*') break; // block comment start
      // Could be regex - check if it looks like it
      let k = j + 1;
      // skip whitespace
      while (k < line.length && (line[k] === ' ' || line[k] === '\t')) k++;
      if (k < line.length) {
        const after = line.slice(k);
        // if it looks like a regex start (not a string, not JSX)
        if (after[0] !== '>' && !after.startsWith('//') && !after.startsWith('/*')) {
          const lineNum = i + 1;
          // Only report if it looks like actual regex usage
          if (after.match(/^[a-zA-Z$_\\/]|^\./)) {
            console.log(lineNum + ': ' + line.trim());
          }
        }
      }
    }
  }
}
