import { sum } from "../../utils.js";

export function run(input) {
  const cards = parseCards(input.trim().split("\n"));
  console.log("A:", a(cards));
  console.log("B:", b(cards));
}

function a(cards) {
  return cards.map(scoreCard).reduce(sum);
}

function b(cards) {
  const cardWins = cards.map((card) => wins(card).length);
  const instances = [];
  for (let i = 0; i < cards.length; i++) {
    instances.push(1);
  }
  console.log("start with", instances.reduce(sum));
  for (let i = 0; i < cards.length - 1; i++) {
    for (
      let copyOf = i + 1;
      copyOf <= i + cardWins[i] && copyOf < cards.length;
      copyOf++
    ) {
      instances[copyOf] = instances[copyOf] + instances[i];
    }
    console.log(
      `After ${i + 1} (${cardWins[i]}), have ${instances.reduce(sum)}`
    );
  }
  return instances.reduce(sum);
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

function wins(card) {
  return card.actual.filter((actual) => {
    return card.winning.includes(actual);
  });
}

function scoreCard(card) {
  const cardWins = wins(card);
  if (cardWins.length == 0) {
    return 0;
  }
  return Math.pow(2, cardWins.length - 1);
}
