import { product } from "../../utils.js";

export function run(input) {
  console.log("A:", solve(parseRaces(input.trim())));
  console.log("B:", solve(parseRaces(input.replace(/ +/g, ""))));
}

function solve(races) {
  const waysToWin = races.map(waysToWinRace);
  return waysToWin.reduce(product);
}

function waysToWinRace(race) {
  // Waiting 1 ms increases our speed by 1 mm / ms
  // The optimal time is achieved by waiting half the time
  // Our time to win is symmetrical around this (because distance is just speed * time)
  // But usually we do not need to be optimal to win
  // There are three kinds of outcomes:
  // - Not waiting enough (speed too low)
  // - Winning
  // - Waiting too much (time too low)
  // This means we have a single inflection point (in "the middle")
  // With these characteristics we only need to find "first" win on either side and can
  // calculate how many values are inside the winning range based on the distance to the
  // middle.

  for (let waited = 1; true; waited++) {
    if (isWinning(waited, race)) {
      return race.time - waited * 2 + 1;
    }
  }
}

function isWinning(waitTime, race) {
  return waitTime * (race.time - waitTime) > race.distance;
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
  return races;
}

function parseNumbers(line) {
  const [label, numbers] = line.split(":");
  return numbers
    .trim()
    .split(/\s+/)
    .map((number) => Number(number));
}
