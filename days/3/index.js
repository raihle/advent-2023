import { sum } from "../../utils.js";

export function run(input) {
  const field = parseField(input.trim().split("\n"));
  console.log("A:", a(field));
  console.log("B:", b(field));
}

function a(field) {
  const numbers = field.numbers.filter(
    (number) => getNearbySymbols(number, field.symbols).length >= 1
  );
  return numbers.map(({ value }) => value).reduce(sum);
}

function b(field) {
  return field.symbols
    .filter(({ symbol }) => symbol == "*")
    .map((symbol) => getNearbyNumbers(symbol, field.numbers))
    .filter((nearbyNumbers) => nearbyNumbers.length == 2)
    .map(([num1, num2]) => num1.value * num2.value)
    .reduce(sum);
}

function getNearbySymbols(number, symbols) {
  const lowY = number.line - 1;
  const highY = number.line + 1;
  const lowX = number.start - 1;
  const highX = number.end + 1;
  const matches = symbols.filter((symbol) => {
    return (
      symbol.line >= lowY &&
      symbol.line <= highY &&
      symbol.index >= lowX &&
      symbol.index <= highX
    );
  });
  return matches;
}

function getNearbyNumbers(symbol, numbers) {
  const lowY = symbol.line - 1;
  const highY = symbol.line + 1;
  const lowX = symbol.index - 1;
  const highX = symbol.index + 1;
  const matches = numbers.filter((number) => {
    return (
      number.line >= lowY &&
      number.line <= highY &&
      number.end >= lowX &&
      number.start <= highX
    );
  });
  return matches;
}

function parseField(lines) {
  const NUMBER_REGEX = /\d+/g;
  const SYMBOL_REGEX = /[^0-9\.]/g;
  const numbers = [];
  const symbols = [];
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    for (const number of line.matchAll(NUMBER_REGEX)) {
      numbers.push({
        value: Number(number[0]),
        start: number.index,
        end: number.index + number[0].length - 1,
        line: y,
      });
    }
    for (const symbol of line.matchAll(SYMBOL_REGEX)) {
      symbols.push({
        symbol: symbol[0],
        index: symbol.index,
        line: y,
      });
    }
  }
  return {
    numbers,
    symbols,
  };
}
