import { sum } from "../../utils.js";

export function run(input) {
  const patterns = parsePatterns(input.trim());
  console.log("A:", a(patterns));
  console.log("B:", b(patterns));
}

function a(patterns) {
  return patterns.map(findReflection).map(scoreReflection).reduce(sum, 0);
}

function b(patterns) {
  return patterns
    .map(findSmudgedReflection)
    .map(scoreReflection)
    .reduce(sum, 0);
}

function allVariations(pattern) {
  const variations = [];
  for (let y = 0; y < pattern.length; y++) {
    const line = pattern[y];
    for (let x = 0; x < line.length; x++) {
      const variation = [...pattern];
      variation[y] =
        line.substring(0, x) +
        (line.at(x) == "." ? "#" : ".") +
        line.substring(x + 1);
      variations.push(variation);
    }
  }
  return variations;
}

function findReflection(
  pattern,
  reflectionToIgnore = { horizontal: 0, vertical: 0 }
) {
  const verticalSplit = findVReflection(pattern, reflectionToIgnore.vertical);
  const horizontalSplit = findHReflection(
    pattern,
    reflectionToIgnore.horizontal
  );
  return {
    vertical: verticalSplit,
    horizontal: horizontalSplit,
  };
}

function findSmudgedReflection(pattern) {
  const or = findReflection(pattern);

  const variations = allVariations(pattern);
  for (const variation of variations) {
    const vr = findReflection(variation, or);
    if (vr.vertical == 0 && vr.horizontal == 0) {
      continue;
    }
    if (vr.vertical != or.vertical || vr.horizontal != or.horizontal) {
      const smudgedReflection = {
        vertical: or.vertical == vr.vertical ? 0 : vr.vertical,
        horizontal: or.horizontal == vr.horizontal ? 0 : vr.horizontal,
      };
      //console.log("Smudged reflection", smudgedReflection);
      return smudgedReflection;
    }
  }
  throw new Error(`No smudged reflection found for pattern ${pattern}`);
}

function findHReflection(pattern, positionToIgnore) {
  for (let reflectAfter = 1; reflectAfter < pattern.length; reflectAfter++) {
    if (reflectAfter == positionToIgnore) {
      continue;
    }
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

function findVReflection(pattern, positionToIgnore) {
  return findHReflection(transpose(pattern), positionToIgnore);
}

function scoreReflection(reflection) {
  if (reflection.vertical && reflection.horizontal) {
    console.log("Double reflection", reflection);
  } else if (reflection.vertical == 0 && reflection.horizontal == 0) {
    console.log("Missing reflection");
  } else {
    //console.log(reflection);
  }
  return reflection.vertical + reflection.horizontal * 100;
}

function parsePatterns(input) {
  const blocks = input.split("\n\n");
  return blocks.map((block) => block.split("\n"));
}
