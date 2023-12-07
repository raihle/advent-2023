import { sum } from "../../utils.js";

const CARDS_BY_STRENGTH = "AKQT98765432J";
const FIVE_OF_A_KIND_REGEX = [/(\w)\1\1\1\1/];
const FOUR_OF_A_KIND_REGEX = [/(\w)\1\1\1\w/, /\w(\w)\1\1\1/];
const FULL_HOUSE_REGEX = [/(\w)\1\1(\w)\2/, /(\w)\1(\w)\2\2/];
const THREE_OF_A_KIND_REGEX = [/(\w)\1\1\w\w/, /\w(\w)\1\1\w/, /\w\w(\w)\1\1/];
const TWO_PAIR_REGEX = [/(\w)\1(\w)\2\w/, /(\w)\1\w(\w)\2/, /\w(\w)\1(\w)\2/];
const PAIR_REGEX = [
  /(\w)\1\w\w\w/,
  /\w(\w)\1\w\w/,
  /\w\w(\w)\1\w/,
  /\w\w\w(\w)\1/,
];

/*const CARDS_BY_STRENGTH = "AKQT98765432Z";
const FIVE_OF_A_KIND_REGEX = [/(\w)(\1|Z)(\1|Z)(\1|Z)(\1|Z)/];
const FOUR_OF_A_KIND_REGEX = [/(\w)(\1|Z)(\1|Z)(\1|Z)\w/, /\w(\w)(\1|Z)(\1|Z)(\1|Z)/];
const FULL_HOUSE_REGEX = [/(\w)(\1|Z)(\1|Z)(\w)(\2|Z)/, /(\w)(\1|Z)(\w)(\2|Z)(\2|Z)/];
const THREE_OF_A_KIND_REGEX = [/(\w)(\1|Z)(\1|Z)\w\w/, /\w(\w)(\1|Z)(\1|Z)\w/, /\w\w(\w)(\1|Z)(\1|Z)/];
const TWO_PAIR_REGEX = [/(\w)(\1|Z)(\w)(\2|Z)\w/, /(\w)(\1|Z)\w(\w)(\2|Z)/, /\w(\w)(\1|Z)(\w)(\2|Z)/];
const PAIR_REGEX = [
  /(\w)(\1|Z)\w\w\w/,
  /\w(\w)(\1|Z)\w\w/,
  /\w\w(\w)(\1|Z)\w/,
  /\w\w\w(\w)(\1|Z)/,
];*/
const HAND_TYPES = [
  {
    description: "five-of-a-kind",
    value: 6,
    regexes: FIVE_OF_A_KIND_REGEX,
  },
  {
    description: "four-of-a-kind",
    value: 5,
    regexes: FOUR_OF_A_KIND_REGEX,
  },
  {
    description: "full-house",
    value: 4,
    regexes: FULL_HOUSE_REGEX,
  },
  {
    description: "three-of-a-kind",
    value: 3,
    regexes: THREE_OF_A_KIND_REGEX,
  },
  {
    description: "two-pairs",
    value: 2,
    regexes: TWO_PAIR_REGEX,
  },
  {
    description: "pair",
    value: 1,
    regexes: PAIR_REGEX,
  },
];

export function run(input) {
  console.log("B:", b(parseHands(input.trim().split("\n"))));
}

function b(hands) {
  const scoredHands = hands.map(scoreHand).sort(compareHands);
  return scoredHands
    .map((hand, index) => {
      const rank = scoredHands.length - index;
      const bid = hand.bid;
      return bid * rank;
    })
    .reduce(sum);
}

function compareHands(a, b) {
  if (a.value != b.value) {
    return b.value - a.value;
  }
  if (a.hand[0] != b.hand[0])
    return (
      CARDS_BY_STRENGTH.indexOf(a.hand[0]) -
      CARDS_BY_STRENGTH.indexOf(b.hand[0])
    );
  if (a.hand[1] != b.hand[1])
    return (
      CARDS_BY_STRENGTH.indexOf(a.hand[1]) -
      CARDS_BY_STRENGTH.indexOf(b.hand[1])
    );
  if (a.hand[2] != b.hand[2])
    return (
      CARDS_BY_STRENGTH.indexOf(a.hand[2]) -
      CARDS_BY_STRENGTH.indexOf(b.hand[2])
    );
  if (a.hand[3] != b.hand[3])
    return (
      CARDS_BY_STRENGTH.indexOf(a.hand[3]) -
      CARDS_BY_STRENGTH.indexOf(b.hand[3])
    );
  return (
    CARDS_BY_STRENGTH.indexOf(a.hand[4]) - CARDS_BY_STRENGTH.indexOf(b.hand[4])
  );
  return 0;
}

function scoreHand(hand) {
  const handVariants = [];
  if (hand.hand.includes("J")) {
    for (const card of CARDS_BY_STRENGTH) {
      handVariants.push(
        [...hand.sortedHand.replace(/J/g, card)].sort().join("")
      );
    }
  } else {
    handVariants.push(hand.sortedHand);
  }
  for (const handType of HAND_TYPES) {
    for (const variant of handVariants) {
      if (handType.regexes.find((regex) => variant.match(regex))) {
        return {
          ...hand,
          type: handType.description,
          value: handType.value,
        };
      }
    }
  }
  return {
    ...hand,
    type: "high-card",
    value: 0,
  };
}

function parseHands(lines) {
  return lines.map(parseHand);
}

function parseHand(line) {
  const [hand, bid] = line.split(/\s+/).map((text) => text.trim());
  return {
    hand,
    sortedHand: [...hand].sort().join(""),
    bid: Number(bid),
  };
}
