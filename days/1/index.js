const FIRST_DIGIT = /^\D*(\d)/;
const LAST_DIGIT = /(\d)\D*$/;

function replaceDigitWords(text) {
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

function extractNumberA(text) {
  const first = text.match(FIRST_DIGIT)[1];
  const last = text.match(LAST_DIGIT)[1];
  return Number(`${first}${last}`);
}

function extractNumberB(text) {
  return extractNumberA(replaceDigitWords(text));
}
function sum(numbers) {
  return numbers.reduce((acc, next) => acc + next);
}

function a(input) {
  return sum(input.trim().split("\n").map(extractNumberA));
}

function b(input) {
  return sum(input.trim().split("\n").map(extractNumberB));
}

const testInput = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

const testInput2 = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

export async function run(input) {
  console.log("A:", a(input));
  console.log("B:", b(input));
}
