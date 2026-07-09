const fs = require('fs');
const content = fs.readFileSync('C:/Users/User/Documents/GitHub/EduMasterAfrica/design/src/app/App.tsx', 'utf8');
const start = content.indexOf('<style>{`');
const end = content.indexOf('</style>');
if (start >= 0 && end >= 0) {
  const css = content.slice(start, end);
  const bt = css.split('`');
  console.log('Template literal backticks:', bt.length - 1);
  if (bt.length - 1 !== 2) {
    console.log('PROBLEM: extra backticks!');
    bt.forEach((part, i) => {
      if (part.includes('`')) console.log('Part', i, 'contains backtick');
    });
  }
}
