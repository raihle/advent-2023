const DEBUG = false;

export function run(input) {
  const map = parseMap(input.trim());
  console.log("A:", a(map));
}

function a({ start, map }) {
  const costs = pathfind(map, start, 64);
  const reachable = Object.entries(costs).filter(([_key, cost]) => cost % 2 == 0);
  DEBUG && console.log(viz(reachable, map))
  return reachable.length;
}

function viz(costs, map) {
  const c = Object.fromEntries(costs);
  return map.map((line, y) => {
    return [...line].map((char, x) => c[`${x},${y}`] ?? char).join("");
  }).join("\n");
}

function pathfind(map, start, maxSteps) {
  const costs = {};
  let queue = [];
  let nextQueue = [start];
  let steps = -1;
  while (nextQueue.length > 0 && steps < maxSteps) {
    steps++;
    queue = nextQueue;
    nextQueue = [];
    while (queue.length > 0) {
      const pos = queue.shift();
      const key = `${pos.x},${pos.y}`;
      if (costs[key]) {
        continue;
      } else {
        costs[key] = steps;
        const neighbors = [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ]
          .map(([x, y]) => ({ x: x + pos.x, y: y + pos.y }))
          .filter(
            ({ x, y }) =>
              x >= 0 && x < map[0].length && y >= 0 && y < map.length && map[y][x] != "#"
          );
        nextQueue.push(...neighbors);
      }
    }
  }
  return costs;
}

function parseMap(input) {
  const lines = input.split("\n");
  const startY = lines.findIndex((line) => line.includes("S"));
  const startX = lines[startY].indexOf("S");
  lines[startY] = lines[startY].replace("S", ".");
  return {
    start: { x: startX, y: startY },
    map: lines,
  };
}
