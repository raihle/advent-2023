import { sum } from "../../utils.js";

export function run(input) {
  const cal = parseCalendar(input.trim());
  console.log("A:", a(cal));
  console.log("B:", b(cal));
}

function min(array) {
  let smallest = Number.MAX_SAFE_INTEGER;
  for (const num of array) {
    if (num < smallest) {
      smallest = num;
    }
  }
  return smallest;
}

function a(cal) {
  const locations = cal.mappers.reduce(
    (acc, mapper) => acc.map(mapper),
    cal.seeds
  );
  return min(locations);
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

function parseCalendar(input) {
  const [seedLine, ...mapBlocks] = input
    .split("\n\n")
    .map((block) => block.trim());
  const seeds = seedLine
    .split(":")[1]
    .trim()
    .split(/\s+/)
    .map((seed) => Number(seed.trim()));
  const mappers = mapBlocks.map(parseMapper);
  return { seeds, mappers };
}

function parseMapper(block) {
  const [nameLine, ...rangeLines] = block
    .split("\n")
    .map((line) => line.trim());
  const ranges = rangeLines.map(parseRange);
  return function (num) {
    for (const range of ranges) {
      if (range.source.low <= num && range.source.high >= num) {
        return range.destination.low + num - range.source.low;
      }
    }
    return num;
  };
}

function parseRange(line) {
  const [to, from, length] = line.split(/\s+/).map((num) => Number(num.trim()));
  return {
    source: {
      low: from,
      high: from + length - 1,
    },
    destination: {
      low: to,
      high: to + length - 1,
    },
  };
}
