import { product } from "../../utils.js";

export function run(input) {
  console.log("A:", a(parseRaces(input.trim())));
}

function a(races) {
  const waysToWin = races.map(waysToWinRace);
  return waysToWin.reduce(product);
}

function waysToWinRace({ time, distance }) {
  // Waiting 1 ms increases our speed by 1 mm / ms
  // The optimal time is achieved by waiting half the time
  // Our time to win is symmetrical around this
  // But usually we do not need to be optimal to win

  let ways = 0;
  for (let waited = 1; waited <= time - 1; waited++) {
    if (waited * (time - waited) > distance) {
      ways++;
    }
  }
  return ways;
}

function parseRaces(input) {
  const [timeLine, distanceLine] = input.split("\n").map((line) => line.trim());
  const times = parseNumbers(timeLine);
  const distances = parseNumbers(distanceLine);
  const races = [];
  for (let i = 0; i < times.length; i++) {
    races.push({
      time: times[i],
      distance: distances[i],
    });
  }
  console.log(races);
  return races;
}

function parseNumbers(line) {
  const [label, numbers] = line.split(":");
  return numbers
    .trim()
    .split(/\s+/)
    .map((number) => Number(number));
}
