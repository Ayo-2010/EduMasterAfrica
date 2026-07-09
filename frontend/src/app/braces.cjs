const fs = require("fs");
const lines = fs.readFileSync("App.tsx", "utf8").split("\n");

function braceRange(startLine) {
  let depth = 0;
  let i = startLine;
  // first non-empty line must contain opening brace
  let opened = false;
  for (; i < lines.length; i++) {
    const l = lines[i];
    let inStr = null, esc = false;
    for (let j = 0; j < l.length; j++) {
      const c = l[j];
      if (inStr) { if (esc) { esc = false; } else if (c === "\\") { esc = true; } else if (c === inStr) { inStr = null; } continue; }
      if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
      if (c === "{") { depth++; opened = true; }
      else if (c === "}") { depth--; }
    }
    if (opened && depth === 0) return i;
  }
  return -1;
}

const starts = [25,26,30,31,32,33,34,38,47,53,60,67,78,85,100,109,118,125,163,171,180,182,189,198,203,212,216,224,236,269,327,489,611,654,707,804,911,1058,1301,1412,1531,1634];
for (const s of starts) {
  const e = braceRange(s);
  console.log("start " + s + " -> end " + e + "  | " + lines[s].trim().slice(0, 40));
}
