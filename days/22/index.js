import { max } from "../../utils.js";

export function run(input) {
  const bricks = parseBricks(input.trim());
  const settledBricks = settleBricks(bricks);
  console.log("A:", a(settledBricks));
}

function a(bricks) {
  bricks.forEach((brick, index) => (brick.index = index));
  const bricksWithSupports = bricks.map((brick) => ({
    brick,
    supporters: findSupporters(brick, bricks),
    supportees: findSupportees(brick, bricks),
  }));
  return bricksWithSupports.filter(({ brick, supportees }) => {
    return supportees.every(
      (s) => bricksWithSupports[s.index].supporters.length > 1
    );
  }).length;
}

function findSupporters(brick, bricks) {
  return bricks.filter((other) => isSupporting(other, brick));
}

function findSupportees(brick, bricks) {
  return bricks.filter((other) => isSupporting(brick, other));
}

function isSupporting(support, brick) {
  return (
    support.z2 == brick.z1 - 1 &&
    support.x1 <= brick.x2 &&
    support.x2 >= brick.x1 &&
    support.y1 <= brick.y2 &&
    support.y2 >= brick.y1
  );
}

function parseBricks(input) {
  const lines = input.split("\n");
  return lines.map(parseBrick);
}

function parseBrick(line) {
  // Input was pre-checked to make sure 0 <= x1 <= x2, 0 <= y1 <= y2, 1 <= z1 <= z2
  const [x1, y1, z1, x2, y2, z2] = line.split(/[,~]/).map(Number);
  return {
    x1,
    x2,
    y1,
    y2,
    z1,
    z2,
  };
}

function settleBricks(bricks) {
  bricks.sort((a, b) => a.z1 - b.z1);
  let highX = max(bricks.map(({ x2 }) => x2));
  let highY = max(bricks.map(({ y2 }) => y2));
  const heightMap = [];

  for (let y = 0; y <= highY; y++) {
    heightMap.push([]);
    for (let x = 0; x <= highX; x++) {
      heightMap[y].push(0);
    }
  }
  for (const brick of bricks) {
    let highestZ = 0;
    for (let x = brick.x1; x <= brick.x2; x++) {
      for (let y = brick.y1; y <= brick.y2; y++) {
        highestZ = Math.max(highestZ, heightMap[y][x]);
      }
    }
    const zDelta = brick.z1 - (highestZ + 1);
    brick.z1 -= zDelta;
    brick.z2 -= zDelta;
    for (let x = brick.x1; x <= brick.x2; x++) {
      for (let y = brick.y1; y <= brick.y2; y++) {
        heightMap[y][x] = brick.z2;
      }
    }
  }
  return bricks;
}
