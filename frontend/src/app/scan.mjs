import fs from "fs";

const src = fs.readFileSync("App.tsx", "utf8");
const n = src.length;
const lineStarts = [];
{ let p = 0; while (p < n) { const nl = src.indexOf("\n", p); if (nl === -1) break; lineStarts.push(nl + 1); p = nl + 1; } }
function lineOf(offset) {
  let ans = 1;
  for (let p = 0; p < lineStarts.length; p++) if (lineStarts[p] <= offset) ans = p + 2;
  return ans;
}

function findEnd(openOffset) {
  let d = 0, k = openOffset;
  while (k < n) {
    const c = src[k];
    if (c === "/" && src[k+1] === "/") { k += 2; while (k < n && src[k] !== "\n") k++; continue; }
    if (c === "/" && src[k+1] === "*") { k += 2; while (k < n && !(src[k] === "*" && src[k+1] === "/")) k++; k += 2; continue; }
    if (c === '"' || c === "'") { const q=c; k++; while(k<n){ if(src[k]==="\\"){k+=2;continue;} if(src[k]===q){k++;break;} k++; } continue; }
    if (c === "`") { k++; let td=0; while(k<n){ if(src[k]==="\\"){k+=2;continue;} if(src[k]==="`"&&td===0){k++;break;} if(src[k]==="`"){k++;continue;} if(src[k]==="$"&&src[k+1]==="{"){td++;k+=2;continue;} if(src[k]==="}"&&td>0){td--;k++;continue;} k++; } continue; }
    if (c === "{") { d++; k++; continue; }
    if (c === "}") { d--; k++; if (d === 0) return k; continue; }
    k++;
  }
  return -1;
}

const re = /function\s+([A-Za-z_$][\w$]*)/g;
let m;
const fns = [];
while ((m = re.exec(src))) {
  const name = m[1];
  const declStart = m.index;
  // find the '{' after the signature (skip params)
  let j = declStart + m[0].length;
  // skip to first '{', handling nested () in params
  let paren = 0, inStr = null;
  while (j < n) {
    const c = src[j];
    if (inStr) { if (c === "\\") { j += 2; continue; } if (c === inStr) inStr = null; j++; continue; }
    if (c === '"' || c === "'" || c === "`") { inStr = c; j++; continue; }
    if (c === "(") { paren++; j++; continue; }
    if (c === ")") { paren--; j++; continue; }
    if (c === "{" && paren === 0) break;
    j++;
  }
  const end = findEnd(j);
  fns.push({ name, start: declStart, end, startLine: lineOf(declStart), endLine: lineOf(end) });
}
const names = ["App","LandingPage","PricingPage","CBTSetup","CBTExam","CoursesPage","TeacherPortal","ParentPortal","AuthPage","MyCoursesTab","PracticeTab","AnalyticsTab","LeaderboardTab","StudentDashboard","initialsOf","AvatarComp","BadgeComp","ProgressBar","Logo","NotifPanel","CourseModal","CoursePlayerPage","AITutorTab","SettingsTab","ProfilePage"];
for (const f of fns) {
  console.log(f.name.padEnd(20) + " L" + String(f.startLine).padStart(5) + "-L" + String(f.endLine).padStart(5));
}
console.log("TOTAL functions:", fns.length);
