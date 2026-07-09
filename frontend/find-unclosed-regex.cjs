const fs = require('fs');
const content = fs.readFileSync('C:/Users/User/Documents/GitHub/EduMasterAfrica/design/src/app/App.tsx', 'utf8');
const lines = content.split(/\r?\n/);

// Find all / occurrences that could start a regex
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  let inStr = false;
  let strCh = '';
  let escaped = false;
  let inTplExpr = false;
  
  for (let j = 0; j < line.length; j++) {
    const c = line[j];
    if (escaped) { escaped = false; continue; }
    if (c === '\\') { escaped = true; continue; }
    
    if (inStr) {
      if (c === strCh) inStr = false;
      continue;
    }
    
    if (c === '"' || c === "'") {
      inStr = true;
      strCh = c;
      continue;
    }
    
    // Template literal - we need to track ${ and }
    // Simplified: just ignore content inside `...`
    
    if (c === '/' && j + 1 < line.length) {
      if (line[j + 1] === '/') break; // line comment
      if (line[j + 1] === '*') break; // block comment start
      
      // Check if preceded by something that starts a regex
      const before = line.slice(0, j).trimRight();
      const lastChar = before[before.length - 1];
      const regexStarters = ['=', '(', ':', ',', '[', '!', '~', '+', '-', '*', '%', '&', '|', '?', '<', '>', '{', '}'];
      
      if (regexStarters.includes(lastChar) || before.endsWith('return') || before.endsWith('case')) {
        // Potential regex start - check if it looks unterminated
        let k = j + 1;
        let hasClose = false;
        while (k < line.length) {
          if (line[k] === '\\') { k += 2; continue; }
          if (line[k] === '/') { hasClose = true; break; }
          k++;
        }
        if (!hasClose) {
          console.log((i + 1) + ': ' + line.trim());
        }
      }
    }
  }
}
