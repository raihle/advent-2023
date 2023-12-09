import { sum } from "../../utils.js";

export function run(input) {
  const series = parseSeries(input.trim());
  console.log("A:", a(series));
  console.log("B:", b(series));
}

function a(series) {
  return series.map(extrapolate).reduce(sum);
}

function b(series) {
  return series.map(baxtrapolate).reduce(sum);
}

function extrapolate(numbers) {
  const diffs = differencesUntil0(numbers);
  const nextValues = [0];
  for (let i = 1; i <= diffs.length; i++) {
    nextValues.push(
      nextValues[i - 1] +
        diffs[diffs.length - i][diffs[diffs.length - i].length - 1]
    );
  }
  return nextValues[nextValues.length - 1];
}

function baxtrapolate(numbers) {
  const diffs = differencesUntil0(numbers);
  const nextValues = [0];
  for (let i = 1; i <= diffs.length; i++) {
    nextValues.push(
      diffs[diffs.length - i][0] -
        nextValues[i - 1]
    );
  }
  return nextValues[nextValues.length - 1];
}

function differences(numbers) {
  const diffs = [];
  for (let i = 0; i < numbers.length - 1; i++) {
    diffs.push(numbers[i + 1] - numbers[i]);
  }
  return diffs;
}

function differencesUntil0(numbers) {
  const diffs = [[...numbers]];
  while (diffs[diffs.length - 1].some((number) => number != 0)) {
    diffs.push(differences(diffs[diffs.length - 1]));
  }
  return diffs;
}

function parseSeries(input) {
  const lines = input.split("\n");
  return lines.map((line) => line.split(/\s+/).map(Number));
}
