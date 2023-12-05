export function run(input) {
  console.log("A:", a(parseCalendar(input.trim())));
  console.log("B:", b(parseCalendarB(input.trim())));
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

function b(cal) {
  const locations = cal.mappers.reduce(
    (acc, mapper) => acc.flatMap(mapper),
    cal.seeds
  );
  return min(locations.map((loc) => loc.low));
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

function parseCalendarB(input) {
  const [seedLine, ...mapBlocks] = input
    .split("\n\n")
    .map((block) => block.trim());
  let seeds = [];
  for (const seedGroup of seedLine.matchAll(/(\d+)\s+(\d+)/g)) {
    const low = Number(seedGroup[1]);
    const high = low + Number(seedGroup[2]) - 1;
    seeds.push({ low, high });
  }
  const mappers = mapBlocks.map(parseRangeMapper);
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

function mapRange(input, mappers) {
  const mappersToTake = [...mappers].sort(
    (a, b) => a.source.low - b.source.low
  );
  let currentVal = input.low;
  let end = input.high;
  const output = [];
  while (currentVal <= end) {
    if (mappersToTake.length == 0) {
      output.push({
        low: currentVal,
        high: end,
      });
      currentVal = end;
    } else if (currentVal < mappersToTake[0].source.low) {
      const nextVal = mappersToTake[0].source.low - 1;
      output.push({
        low: currentVal,
        high: Math.min(end, nextVal),
      });
      currentVal = nextVal;
    } else {
      const mapper = mappersToTake.shift();
      if (currentVal > mapper.source.high) {
        continue;
      }
      const nextVal = Math.min(mapper.source.high, end);
      output.push({
        low: mapper.destination.low - mapper.source.low + currentVal,
        high: mapper.destination.low - mapper.source.low + nextVal,
      });
      currentVal = nextVal;
    }
    currentVal++;
  }
  return output;
}

function parseRangeMapper(block) {
  const [nameLine, ...rangeLines] = block
    .split("\n")
    .map((line) => line.trim());
  const ranges = rangeLines.map(parseRange);

  return function (inputRange) {
    return mapRange(inputRange, ranges);
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
