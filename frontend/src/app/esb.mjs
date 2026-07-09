import pkg from "esbuild";
import fs from "fs";

const { parse } = pkg;
const src = fs.readFileSync("App.tsx", "utf8");
const result = await parse(src, { loader: "tsx", jsx: "preserve" });
const body = result.body;
console.log("body.length", body.length);
for (const n of body) {
  const start = n.start, end = n.end;
  const text = src.slice(start, end).split("\n")[0].slice(0, 70);
  console.log(n.type + " [" + start + "," + end + "] " + text.replace(/\n/g, " "));
}
