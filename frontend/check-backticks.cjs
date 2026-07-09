const fs = require('fs');
const lines = fs.readFileSync('C:/Users/User/Documents/GitHub/EduMasterAfrica/design/build-offline-notes.js', 'utf8').split(/\r?\n/);
lines.forEach((l, i) => {
  if (l.includes('`')) {
    console.log((i + 1) + ': ' + l);
  }
});
