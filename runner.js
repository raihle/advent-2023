import { readFile } from "node:fs/promises";

run(process.argv[2], process.argv[3] || "input");

async function run(day, inputFile) {
  const mod = await import(`./days/${day}/index.js`);
  const input = await readInput(`./days/${day}/${inputFile}.txt`);
  const start = new Date();
  mod.run(input);
  const end = new Date();
  console.log(`Took ${end - start} ms`);
}

async function readInput(path) {
  return readFile(path, "utf-8");
}
