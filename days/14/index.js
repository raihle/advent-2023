import { sum } from "../../utils.js";

export function run(input) {
  const platform = parsePlatform(input.trim());
  console.log("A:", a(platform));
  // The solvers actually mutate the platform, but it doesn't matter because
  // rolling north twice is the same are rolling north once
  console.log("B:", b(platform));
}

function a(platform) {
  return scorePlatform(rollNorth(platform));
}

function b(platform) {
  const seen = {};
  const times = 1_000_000_000;
  let skipped = false;
  for (let i = 0; i < 1_000_000_000; i++) {
    rollCycle(platform);
    if (!skipped) {
      const key = JSON.stringify(platform);
      const lastSeen = seen[key];
      if (lastSeen != undefined) {
        const diff = i - lastSeen;
        const remainder = (times - i) % diff;
        i = times - remainder;
        skipped = true;
      } else {
        seen[key] = i;
      }
    }
  }
  return scorePlatform(platform);
}

function rollCycle(platform) {
  return rollEast(rollSouth(rollWest(rollNorth(platform))));
}

function scorePlatform(platform) {
  return platform.map(scoreLine).reduce(sum);
}

function scoreLine(line, index, platform) {
  return (
    line.filter((space) => space == "O").length * (platform.length - index)
  );
}

function rollY(platform, direction) {
  const yStart = direction == -1 ? 0 : platform.length - 1;
  for (let x = 0; x < platform[0].length; x++) {
    let latestBlock = direction == -1 ? -1 : platform.length;
    for (let y = yStart; y < platform.length && y >= 0; y -= direction) {
      const inSpace = platform[y][x];
      if (inSpace == ".") {
        continue;
      } else if (inSpace == "#") {
        latestBlock = y;
      } else if (inSpace == "O") {
        if (direction == -1 ? y > latestBlock + 1 : y < latestBlock - 1) {
          platform[latestBlock - direction][x] = "O";
          platform[y][x] = ".";
        }
        latestBlock -= direction;
      }
    }
  }
  return platform;
}

function rollX(platform, direction) {
  const xStart = direction == -1 ? 0 : platform[0].length - 1;
  for (let y = 0; y < platform.length; y++) {
    let latestBlock = direction == -1 ? -1 : platform[0].length;
    for (let x = xStart; x < platform[0].length && x >= 0; x -= direction) {
      const inSpace = platform[y][x];
      if (inSpace == ".") {
        continue;
      } else if (inSpace == "#") {
        latestBlock = x;
      } else if (inSpace == "O") {
        if (direction == -1 ? x > latestBlock + 1 : x < latestBlock - 1) {
          platform[y][latestBlock - direction] = "O";
          platform[y][x] = ".";
        }
        latestBlock -= direction;
      }
    }
  }
  return platform;
}

function rollNorth(platform) {
  return rollY(platform, -1);
}

function rollSouth(platform) {
  return rollY(platform, 1);
}

function rollWest(platform) {
  return rollX(platform, -1);
}

function rollEast(platform) {
  return rollX(platform, 1);
}

function parsePlatform(input) {
  const lines = input.split("\n").map((line) => line.trim().split(""));
  return lines;
}
