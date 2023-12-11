import { sum } from "../../utils.js";

export function run(input) {
  const galaxyMap = parseUniverse(input.trim());
  console.log("A:", a(galaxyMap));
}

function a(galaxyMap) {
  const expanded = expandEmptySpace(galaxyMap);
  const galaxies = findGalaxies(expanded);
  const pairs = makePairs(galaxies);
  const distances = pairs.map(
    ([a, b]) => Math.abs(a.y - b.y) + Math.abs(a.x - b.x)
  );
  console.log(expanded, galaxies, pairs, distances);
  return distances.reduce(sum);
}

function findGalaxies(galaxyMap) {
  const galaxies = [];
  for (let y = 0; y < galaxyMap.length; y++) {
    for (let x = 0; x < galaxyMap[0].length; x++) {
      if (galaxyMap[y][x] == "#") {
        galaxies.push({ x, y });
      }
    }
  }
  return galaxies;
}

function makePairs(items) {
  const pairs = [];
  for (let a = 0; a < items.length; a++) {
    for (let b = a + 1; b < items.length; b++) {
      pairs.push([items[a], items[b]]);
    }
  }
  return pairs;
}

function expandEmptySpace(galaxyMap) {
  let expandedMap = [];
  galaxyMap.forEach((line) => {
    if (!line.includes("#")) {
      expandedMap.push(line);
    }
    expandedMap.push(line);
  });
  let addedCols = 0;
  for (let x = 0; x < galaxyMap[0].length; x++) {
    const column = galaxyMap.map((row) => row[x]);
    if (!column.includes("#")) {
      expandedMap = expandedMap.map(
        (row) =>
          row.substring(0, x + addedCols) + "." + row.substring(x + addedCols)
      );
      addedCols++;
    }
  }

  return expandedMap;
}

function parseUniverse(input) {
  return input.split("\n").map((line) => line.trim());
}
