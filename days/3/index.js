import { sum } from "../../utils.js";

export function run(input) {
  const field = parseField(input.trim().split("\n"));
  console.log("A:", a(field));
}

function a(field) {
  const numbers = field.numbers.filter((number) =>
    hasNearbySymbol(number, field.symbols)
  );
  return numbers.map(({ value }) => value).reduce(sum);
}

function hasNearbySymbol(number, symbols) {
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
  return matches.length >= 1;
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
