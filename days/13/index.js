import { sum } from "../../utils.js";

let stats = {};
export function run(input) {
  const patterns = parsePatterns(input.trim());
  console.log("A:", solve(patterns));
}

function solve(patterns) {
  return patterns.map(findReflection).map(scoreReflection).reduce(sum, 0);
}

function findReflection(pattern) {
  const verticalSplit = findVReflection(pattern);
  const horizontalSplit = findHReflection(pattern);
  return {
    vertical: verticalSplit,
    horizontal: horizontalSplit,
  };
}

function findHReflection(pattern) {
  for (
    let reflectAfter = 1;
    reflectAfter < pattern.length;
    reflectAfter++
  ) {
    let possibleReflection = true;
    const reflectedLength = Math.min(
      reflectAfter,
      pattern.length - reflectAfter
    );
    for (let i = 0; i < reflectedLength; i++) {
      const before = pattern[reflectAfter - i - 1];
      const after = pattern[reflectAfter + i];
      if (before != after) {
        possibleReflection = false;
        break;
      }
    }
    if (possibleReflection) {
      return reflectAfter;
    }
  }
  return 0;
}

function transpose(pattern) {
  const transposed = [];
  for (let x = 0; x < pattern[0].length; x++) {
    transposed.push("");
  }
  for (let y = 0; y < pattern.length; y++) {
    for (let x = 0; x < pattern[y].length; x++) {
      transposed[x] += pattern[y][x];
    }
  }
  return transposed;
}

function findVReflection(pattern) {
  return findHReflection(transpose(pattern));
}

function scoreReflection(reflection) {
  return reflection.vertical + reflection.horizontal * 100;
}

function parsePatterns(input) {
  const blocks = input.split("\n\n");
  return blocks.map((block) => block.split("\n"));
}
