const fs = require("fs");
const lines = fs.readFileSync("App.tsx", "utf8").split("\n");
let depth = 0;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  let d = 0, inStr = null, esc = false;
  for (let j = 0; j < l.length; j++) {
    const c = l[j];
    if (inStr) { if (esc) { esc = false; } else if (c === "\\") { esc = true; } else if (c === inStr) { inStr = null; } continue; }
    if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
    if (c === "{") d++; else if (c === "}") d--;
  }
  depth += d;
  const m = l.match(/^(function |const [A-Z])/);
  if (m && depth === 1) {
    console.log((i + 1) + " TOP-LEVEL-FN depth=" + depth + " | " + l.trim().slice(0, 55));
  }
}
