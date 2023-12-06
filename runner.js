import { readFile } from "node:fs/promises";

run(process.argv[2]);

async function run(day) {
  const mod = await import(`./days/${day}/index.js`);
  const input = await readInput(`./days/${day}/input.txt`);
  const start = new Date();
  mod.run(input);
  const end = new Date();
  console.log(`Took ${end - start} ms`);
}

async function readInput(path) {
  return readFile(path, "utf-8");
}
