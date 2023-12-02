import { sum } from "../../utils.js";

export async function run(input) {
  const lines = input.trim().split("\n");
  console.log("A:", a(lines));
  console.log("B:", b(lines));
}

function a(lines) {
  return lines.map(firstAndLastDigit).reduce(sum);
}

function b(lines) {
  return lines.map(replaceDigitWords).map(firstAndLastDigit).reduce(sum);
}

function firstAndLastDigit(text) {
  const digits = text.match(/\d/g);
  const first = digits[0];
  const last = digits.at(-1);
  return Number(`${first}${last}`);
}

function replaceDigitWords(text) {
  // These replacements could be much shorter, but I'm keeping it simple
  return text
    .replace(/one/g, "one1one")
    .replace(/two/g, "two2two")
    .replace(/three/g, "three3three")
    .replace(/four/g, "four4four")
    .replace(/five/g, "five5five")
    .replace(/six/g, "six6six")
    .replace(/seven/g, "seven7seven")
    .replace(/eight/g, "eight8eight")
    .replace(/nine/g, "nine9nine");
}
