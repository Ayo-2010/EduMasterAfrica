import { parse } from "esbuild";
import fs from "fs";

const src = fs.readFileSync("App.tsx", "utf8");
const result = parse(src, { loader: "tsx", jsx: "preserve" });
const program = result as any;
const body = program.body;
console.log("body.length", body.length);
for (const n of body) {
  const start = n.start, end = n.end;
  const text = src.slice(start, end).split("\n")[0].slice(0, 60);
  console.log(n.type + " [" + start + "," + end + "] " + text);
}
