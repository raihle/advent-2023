export function run(input) {
  const plan = parsePlan(input.trim());
  console.log("A:", a(plan));
}

function a(plan) {
  const dug = {};
  let x = 0;
  let y = 0;
  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;
  dug[`${x},${y}`] = true;
  for (const step of plan) {
    for (let i = 0; i < step.length; i++) {
      x += hComp(step.direction);
      y += vComp(step.direction);
      dug[`${x},${y}`] = true;
    }
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  let dugSpace = 0;
  let edge = "no";
  let inside = false;
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (dug[`${x},${y}`]) {
        if (dug[`${x},${y - 1}`]) {
          if (edge == "down") {
            inside = !inside;
            edge = "no";
          } else if (edge == "up") {
            edge = "no";
          } else {
            edge = "up";
          }
        }
        if (dug[`${x},${y + 1}`]) {
          if (edge == "up") {
            inside = !inside;
            edge = "no";
          } else if (edge == "down") {
            edge = "no";
          } else {
            edge = "down";
          }
        }
        dugSpace++;
      } else if (inside) {
        dugSpace++;
      }
    }
    edge = false;
    inside = false;
  }
  return dugSpace;
}

function hComp(direction) {
  switch (direction) {
    case "L":
      return -1;
    case "R":
      return 1;
  }
  return 0;
}

function vComp(direction) {
  switch (direction) {
    case "U":
      return -1;
    case "D":
      return 1;
  }
  return 0;
}

function parsePlan(input) {
  const lines = input.split("\n");
  return lines.map(parseStep);
}

function parseStep(line) {
  const [direction, lengthString, colorCode] = line.split(/\s+/);
  return {
    direction,
    length: Number(lengthString),
    color: colorCode.substring(1, colorCode.length - 1),
  };
}
