import { sum } from "../../utils.js";

export function run(input) {
  const cards = parseCards(input.trim().split("\n"));
  console.log("A:", a(cards));
  console.log("B:", b(cards));
}

function a(cards) {
  return cards.map(scoreCard).reduce(sum);
}

function parseCards(lines) {
  const cards = lines.map(parseCard);
  return cards;
}

function parseCard(line) {
  const [, winning, actual] = line.split(/[:|]/);
  return {
    winning: winning
      .trim()
      .split(/\s+/)
      .map((num) => Number(num.trim())),
    actual: actual
      .trim()
      .split(/\s+/)
      .map((num) => Number(num.trim())),
  };
}

function scoreCard(card) {
  const wins = card.actual.filter((actual) => {
    return card.winning.includes(actual);
  });
  if (wins.length == 0) {
    return 0;
  }
  console.log(
    card,
    " has ",
    wins.length,
    "wins (",
    wins,
    ") worth ",
    Math.pow(2, wins.length - 1)
  );
  return Math.pow(2, wins.length - 1);
}
