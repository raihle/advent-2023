import { sum } from "../../utils.js";

export function run(input) {
  const galaxyMap = parseUniverse(input.trim());
  const emptySpace = findEmptySpace(galaxyMap);
  const galaxies = findGalaxies(galaxyMap);
  const pairs = makePairs(galaxies);
  console.log("A:", a(pairs, emptySpace));
  console.log("B:", b(pairs, emptySpace));
}

function a(pairs, emptySpace) {
  const distances = pairs.map(([a, b]) => galaxyDistance(a, b, emptySpace, 2));
  return distances.reduce(sum);
}

function b(pairs, emptySpace) {
  const distances = pairs.map(([a, b]) =>
    galaxyDistance(a, b, emptySpace, 1000000)
  );
  return distances.reduce(sum);
}

function galaxyDistance(a, b, emptySpace, expansionFactor) {
  const unexpandedDistance = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  const passedEmptyRows = emptySpace.rows.filter(
    (row) => row > Math.min(a.y, b.y) && row < Math.max(a.y, b.y)
  ).length;
  const passedEmptyCols = emptySpace.cols.filter(
    (col) => col > Math.min(a.x, b.x) && col < Math.max(a.x, b.x)
  ).length;
  return (
    unexpandedDistance +
    (expansionFactor - 1) * (passedEmptyRows + passedEmptyCols)
  );
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

function findEmptySpace(galaxyMap) {
  const emptyRows = [];
  const emptyCols = [];
  galaxyMap.forEach((line, y) => {
    if (!line.includes("#")) {
      emptyRows.push(y);
    }
  });
  for (let x = 0; x < galaxyMap[0].length; x++) {
    const column = galaxyMap.map((row) => row[x]);
    if (!column.includes("#")) {
      emptyCols.push(x);
    }
  }

  return {
    rows: emptyRows,
    cols: emptyCols,
  };
}

function parseUniverse(input) {
  return input.split("\n").map((line) => line.trim());
}
