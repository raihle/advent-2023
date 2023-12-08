import { product } from "../../utils.js";

export function run(input) {
  console.log("A:", a(parseMap(input.trim())));
}

function a({nodes, instructions}) {
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
