import { lcm, min } from "../../utils.js";

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

  const cycles = ghosts.map((ghost) => {
    return {
      start: ghost.cycleStart,
      length: ghost.cycleLength,
    };
  });

  const firstCycleStart = min(cycles.map((cycle) => cycle.start));
  let at = firstCycleStart;
  let matched = 0;
  let stepSize = 1;
  while (at < Number.MAX_SAFE_INTEGER) {
    const matchingCycles = cycles.filter(
      (cycle) => (at - cycle.start) % cycle.length == 0
    );
    if (matchingCycles.length == cycles.length) {
      return at;
    }
    if (matchingCycles.length > matched) {
      stepSize = matchingCycles.map((cycle) => cycle.length).reduce(lcm);
      matched = matchingCycles.length;
    }
    at += stepSize;
  }
  throw new Error("Reached MAX_SAFE_INTEGER");
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
