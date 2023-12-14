import { sum } from "../../utils.js";

export function run(input) {
  const platform = parsePlatform(input.trim());
  console.log("A:", a(platform));
}

function a(platform) {
  const rolledPlatform = rollNorth(platform);
  return scorePlatform(platform);
}

function scorePlatform(platform) {
  return platform.map(scoreLine).reduce(sum);
}

function scoreLine(line, index, platform) {
  return (
    line.filter((space) => space == "O").length * (platform.length - index)
  );
}

function rollNorth(platform) {
  let rolledPlatform = [...platform];
  for (let x = 0; x < platform[0].length; x++) {
    let latestBlock = -1;
    for (let y = 0; y < platform.length; y++) {
      const inSpace = platform[y][x];
      if (inSpace == ".") {
        continue;
      } else if (inSpace == "#") {
        latestBlock = y;
      } else if (inSpace == "O") {
        if (y > latestBlock + 1) {
          rolledPlatform[latestBlock + 1][x] = "O";
          rolledPlatform[y][x] = ".";
        }
        latestBlock++;
      }
    }
  }
  return rolledPlatform;
}

function parsePlatform(input) {
  const lines = input.split("\n").map((line) => line.trim().split(""));
  return lines;
}
