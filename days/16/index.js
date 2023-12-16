import { max } from "../../utils.js";

export function run(input) {
  const cave = parseCave(input.trim());
  console.log("A:", a(cave));
  console.log("B:", b(cave));
}

function a(cave) {
  return score(cave, {
    x: 0,
    y: 0,
    direction: "east",
  });
}

function b(cave) {
  const starts = [];
  for (let y = 0; y < cave.length; y++) {
    starts.push({
      x: 0,
      y,
      direction: "east",
    });
    starts.push({
      x: cave[0].length - 1,
      y,
      direction: "west",
    });
  }
  for (let x = 0; x < cave[0].length; x++) {
    starts.push({
      x,
      y: 0,
      direction: "south",
    });
    starts.push({
      x,
      y: cave.length - 1,
      direction: "north",
    });
  }
  return max(starts.map((start) => score(cave, start)));
}

function score(cave, startingBeam) {
  let beams = [startingBeam];
  const seen = {};
  while (beams.length > 0) {
    const nextBeams = [];
    for (const beam of beams) {
      const key = `${beam.x},${beam.y}`;
      if (seen[key] && seen[key].includes(beam.direction)) {
        continue;
      } else {
        seen[key] = seen[key] || [];
        seen[key].push(beam.direction);
        const newDirections = cave[beam.y][beam.x](beam.direction);
        for (const direction of newDirections) {
          const newBeam = step({
            ...beam,
            direction,
          });
          if (
            newBeam.y >= 0 &&
            newBeam.y < cave.length &&
            newBeam.x >= 0 &&
            newBeam.x < cave[0].length
          ) {
            nextBeams.push(newBeam);
          }
        }
      }
    }
    beams = nextBeams;
  }
  return Object.keys(seen).length;
}

function step(beam) {
  const deltas = {
    north: [0, -1],
    south: [0, 1],
    west: [-1, 0],
    east: [1, 0],
  };
  const delta = deltas[beam.direction];
  return {
    x: beam.x + delta[0],
    y: beam.y + delta[1],
    direction: beam.direction,
  };
}

function parseCave(input) {
  return input.split("\n").map((line) => line.split("").map(actionForSymbol));
}

function actionForSymbol(symbol) {
  switch (symbol) {
    case ".":
      return noChange;
    case "/":
      return forwardReflect;
    case "\\":
      return backwardReflect;
    case "|":
      return verticalSplit;
    case "-":
      return horizontalSplit;
  }
  throw new Error(`Unknown symbol "${symbol}`);
}

function noChange(beam) {
  return [beam];
}

function forwardReflect(beam) {
  switch (beam) {
    case "east":
      return ["north"];
    case "north":
      return ["east"];
    case "west":
      return ["south"];
    case "south":
      return ["west"];
  }
  throw new Error(`Unknown direction ${beam}`);
}

function backwardReflect(beam) {
  switch (beam) {
    case "east":
      return ["south"];
    case "north":
      return ["west"];
    case "west":
      return ["north"];
    case "south":
      return ["east"];
  }
  throw new Error(`Unknown direction ${beam}`);
}

function horizontalSplit(beam) {
  switch (beam) {
    case "east":
    case "west":
      return [beam];
    case "north":
    case "south":
      return ["east", "west"];
  }
  throw new Error(`Unknown direction ${beam}`);
}

function verticalSplit(beam) {
  switch (beam) {
    case "east":
    case "west":
      return ["north", "south"];
    case "north":
    case "south":
      return [beam];
  }
  throw new Error(`Unknown direction ${beam}`);
}
