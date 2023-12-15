import { sum } from "../../utils.js";

export function run(input) {
  const sequences = parseInput(input.trim());
  console.log("A:", a(sequences));
  console.log("B:", b(sequences));
}

function a(sequences) {
  return sequences.map(HASH).reduce(sum);
}

function b(sequences) {
  const boxes = [];
  for (const sequence of sequences) {
    const [lensLabel, instruction] = sequence.split(/(?=[=-])/);
    const boxNum = HASH(lensLabel);
    if (!boxes[boxNum]) {
      boxes[boxNum] = [];
    }
    const box = boxes[boxNum];
    if (instruction == "-") {
      boxes[boxNum] = box.filter(({ label }) => label != lensLabel);
    } else {
      const existingLens = box.find(({ label }) => label == lensLabel);
      const value = Number(instruction.substring(1));
      if (existingLens) {
        existingLens.value = value;
      } else {
        box.push({ label: lensLabel, value });
      }
    }
  }
  return boxes.map(scoreBox).reduce(sum, 0);
}

function scoreBox(box, boxNum) {
  return (boxNum + 1) * box.map((lens, lensNum) => lens.value * (lensNum + 1)).reduce(sum, 0);
}

function HASH(input) {
  let curr = 0;
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    curr += code;
    curr = curr * 17;
    curr = curr % 256;
  }
  return curr;
}

function parseInput(input) {
  return input.split(",");
}
