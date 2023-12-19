import { sum, makePairs } from "../../utils.js";

export function run(input) {
  const plan = parsePlan(input.trim());
  console.log("A:", solve(plan));
  console.log("B:", solve(plan.map(convertStep)));
}

function solve(plan) {
  const edges = makeEdges(plan);
  const queue = [...edges];
  let squares = [];
  while (queue.length > 0) {
    const edge = queue.pop();
    const left = findLeft(edges, edge);
    const crossingCount = countLeftCrossings(left, edge);
    const leftInside = crossingCount % 2 == 1;
    if (!leftInside) {
      continue;
    }
    squares = squares.concat(makeSquares(edge, left));
  }

  const overlap = makePairs(squares)
    .map(([a, b]) => {
      if (a.highY == b.lowY || a.lowY == b.highY) {
        if (a.highX >= b.lowX && a.lowX <= b.highX) {
          const start = Math.max(a.lowX, b.lowX);
          const end = Math.min(a.highX, b.highX);
          return end - start + 1;
        }
      }
      return 0;
    })
    .reduce(sum, 0);
  return squares.map(({ area }) => area).reduce(sum, 0) - overlap;
}

function makeSquares(edge, edgesOnLeft) {
  const squares = [];
  let lowY = edge.lowY;
  let highY = edge.highY;
  // Sorted right-to-left, because we are "looking left" into the shape
  const sortedCrossings = [...edgesOnLeft].sort((a, b) => b.x - a.x);
  for (const crosser of sortedCrossings) {
    if (crosser.lowY >= highY || crosser.highY <= lowY) {
      continue;
    }
    if (crosser.highY >= highY && crosser.lowY <= lowY) {
      const square = {
        highY: highY,
        lowY: lowY,
        highX: edge.x,
        lowX: crosser.x,
        area: (highY - lowY + 1) * (edge.x - crosser.x + 1),
      };
      squares.push(square);
      break;
    } else if (crosser.highY < highY && crosser.lowY > lowY) {
      const splitA = {
        highY: highY,
        lowY: crosser.highY,
        x: edge.x,
      };
      const splitB = {
        highY: crosser.lowY,
        lowY: lowY,
        x: edge.x,
      };
      const square = {
        lowY: crosser.lowY,
        highY: crosser.highY,
        lowX: crosser.x,
        highX: edge.x,
        area: (crosser.highY - crosser.lowY + 1) * (edge.x - crosser.x + 1),
      };
      squares.push(square);
      return makeSquares(splitA, edgesOnLeft)
        .concat(makeSquares(splitB, edgesOnLeft))
        .concat(squares);
    } else if (crosser.lowY <= lowY && crosser.highY < highY) {
      const square = {
        lowY: lowY,
        highY: crosser.highY,
        lowX: crosser.x,
        highX: edge.x,
        area: (crosser.highY - lowY + 1) * (edge.x - crosser.x + 1),
      };
      squares.push(square);
      lowY = crosser.highY;
    } else if (crosser.highY >= highY && crosser.lowY > lowY) {
      const square = {
        lowY: crosser.lowY,
        highY: highY,
        lowX: crosser.x,
        highX: edge.x,
        area: (highY - crosser.lowY + 1) * (edge.x - crosser.x + 1),
      };
      squares.push(square);
      highY = crosser.lowY;
    }
  }
  return squares;
}

function countLeftCrossings(edges, edge) {
  // Any "half" y within the edge will do
  const y = edge.highY - 0.5;
  const crossings = edges.filter((e) => e.highY > y && e.lowY < y);
  return crossings.length;
}

function findLeft(edges, edge) {
  return edges.filter(
    (e) => e.x < edge.x && e.highY >= edge.lowY && e.lowY <= edge.highY
  );
}

function makeEdges(plan) {
  const edges = [];
  let x = 0;
  let y = 0;
  for (const step of plan) {
    const x2 = x + hComp(step.direction) * step.length;
    const y2 = y + vComp(step.direction) * step.length;
    if (vComp(step.direction) != 0) {
      // Since we are dealing with (overlapping) rectangles,
      // we only really need edges in one dimension to define them
      edges.push({
        x,
        lowY: Math.min(y, y2),
        highY: Math.max(y, y2),
      });
    }
    x = x2;
    y = y2;
  }
  return edges;
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

function convertStep({ color }) {
  return {
    direction: convertDirection(color.at(-1)),
    length: parseInt(color.substring(1, color.length - 1), 16),
  };
}

function convertDirection(directionCode) {
  switch (directionCode) {
    case "0":
      return "R";
    case "1":
      return "D";
    case "2":
      return "L";
    case "3":
      return "U";
  }
}

function parseStep(line) {
  const [direction, lengthString, colorCode] = line.split(/\s+/);
  return {
    direction,
    length: Number(lengthString),
    color: colorCode.substring(1, colorCode.length - 1),
  };
}
