import { min } from "../../utils.js";

export function run(input) {
  const map = parseMap(input.trim());
  console.log("A:", a(map));
  console.log("B:", b(map));
}

function a({ nodes, instructions }) {
  const start = "AAA";
  const goal = "ZZZ";
  let location = start;
  let steps = 0;
  while (location != goal) {
    const nextStep = instructions[steps % instructions.length];
    location = nodes[location][nextStep];
    steps++;
  }
  return steps;
}

function b({ nodes, instructions }) {
  let ghosts = Object.keys(nodes)
    .filter((node) => node.endsWith("A"))
    .map((node) => {
      return {
        node,
        seenZ: {},
        inCycle: false,
        cycleStart: 0,
        cycleLength: 0,
      };
    });
  let steps = 0;
  while (ghosts.some(({ inCycle }) => !inCycle)) {
    const nextStep = instructions[steps % instructions.length];
    steps++;
    ghosts.forEach((ghost) => {
      const nextNode = nodes[ghost.node][nextStep];
      ghost.node = nextNode;
      if (!ghost.inCycle && nextNode.endsWith("Z")) {
        if (ghost.seenZ[nextNode]) {
          ghost.inCycle = true;
          ghost.seenZ[nextNode].push(steps);
          ghost.cycleLength = steps - ghost.cycleStart;
        } else {
          ghost.seenZ[nextNode] = [steps];
          ghost.cycleStart = steps;
        }
      }
    });
  }

  console.warn("Found cycles");

  const cycles = ghosts.map((ghost) => {
    return {
      start: ghost.cycleStart,
      length: ghost.cycleLength,
    };
  });
  const firstCycleStart = min(cycles.map((cycle) => cycle.start));
  const smallestCycleLength = min(cycles.map((cycle) => cycle.length));
  let at = firstCycleStart;
  let rounds = 0;
  while (cycles.some((cycle) => (at - cycle.start) % cycle.length != 0)) {
    at += smallestCycleLength;
    rounds++;
    if (rounds % 100000000 == 0) {
      console.warn(`Round ${rounds} testing ${at}`);
    }
    if (at >= Number.MAX_SAFE_INTEGER) {
      throw new Error("Reached MAX_SAFE_INTEGER");
    }
  }
  return at;
}

function parseMap(input) {
  const [instructions, mapText] = input.split("\n\n");
  const nodes = mapText.split("\n").reduce((acc, line) => {
    const [node, left, right] = line.split(/\W+/);
    acc[node] = {
      L: left,
      R: right,
    };
    return acc;
  }, {});
  return {
    instructions,
    nodes,
  };
}
