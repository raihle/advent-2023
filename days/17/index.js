export function run(input) {
  const map = parseMap(input.trim());
  console.log("A:", a(map));
}

function a(map) {
  return pathfind(
    map,
    { x: 0, y: 0 },
    { x: map[0].length - 1, y: map.length - 1 }
  );
}

function moveInDirections(position) {
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  return directions.map((delta) => ({
    x: position.x + delta[0],
    y: position.y + delta[1],
  }));
}

function getTrivialPathCost(map) {
  if (map.length != map[0].length) {
    throw new Error("Map is not square, getTrivialPathCost needs an update");
  }
  let cost = 0;
  for (let y = 0; y < map.length; y++) {
    if (y > 0) {
      cost += map[y][y];
    }
    if (y < map.length - 1) {
      cost += map[y][y + 1];
    }
  }
  return cost;
}

function saw(seen, key, next, bestCost) {
  const from = next.route.at(-2);
  if (from == undefined) {
    seen[key].push({
      cost: next.cost,
      straightSteps: next.straightSteps,
      from,
    });
    return;
  }
  seen[key] = seen[key].filter((s) => s.cost <= bestCost);
  const existing = seen[key].find(
    (s) =>
      (s.from != undefined &&
        s.from.x == from.x &&
        s.from.y == from.y &&
        s.cost >= next.cost &&
        s.straightSteps >= next.straightSteps) ||
      s.cost >= next.cost + 18
  );
  if (existing) {
    existing.cost = next.cost;
    existing.straightSteps = next.straightSteps;
  } else {
    seen[key].push({
      cost: next.cost,
      straightSteps: next.straightSteps,
      from,
    });
  }
}

function pathfind(map, start, goal) {
  const trivialPathCost = getTrivialPathCost(map);
  const goals = [];
  let bestCost = trivialPathCost;
  const seen = {};
  const queue = [{ at: start, cost: 0, route: [start], straightSteps: 0 }];
  let handled = 0;
  while (queue.length > 0) {
    if (handled % 1_000_000 == 0) {
      console.log(
        `Handled ${handled}. In queue: ${queue.length}. Seen: ${
          Object.entries(seen).length
        }. Arrivals: ${goals.length}. Best cost: ${bestCost}`
      );
    }
    const next = queue.pop();
    handled++;
    const key = `${next.at.x},${next.at.y}`;
    const minRemainingCost =
      Math.abs(goal.x - next.x) + Math.abs(goal.y - next.y);
    seen[key] = seen[key] ?? [];
    if (
      next.cost + minRemainingCost >= bestCost ||
      seen[key].some(
        (s) =>
          (s.cost <= next.cost &&
            s.straightSteps <= next.straightSteps &&
            ((s.from == undefined && next.route.length < 2) ||
              (s.from != undefined &&
                s.from.x == next.route.at(-2).x &&
                s.from.y == next.route.at(-2).y))) ||
          s.cost <= next.cost - 18
      )
    ) {
      continue;
    }
    saw(seen, key, next, bestCost);
    if (next.at.x == goal.x && next.at.y == goal.y) {
      goals.push(next);
      if (next.cost < bestCost) {
        bestCost = next.cost;
      }
      continue;
    }
    let legalSteps = moveInDirections(next.at)
      .filter(
        ({ x, y }) => x >= 0 && y >= 0 && x < map[0].length && y < map.length
      )
      .map(({ x, y }) => {
        return {
          at: { x, y },
          cost: next.cost + map[y][x],
          route: [...next.route, { x, y }],
          straightSteps: 1,
        };
      })
      .filter(({ cost }) => cost < bestCost);
    if (next.route.length >= 2) {
      const lastAt = next.route.at(-2);
      legalSteps = legalSteps.filter(
        ({ at }) => at.x != lastAt.x || at.y != lastAt.y
      );
      const lastDirection = {
        x: next.at.x - lastAt.x,
        y: next.at.y - lastAt.y,
      };
      const nextStraightStep = {
        x: next.at.x + lastDirection.x,
        y: next.at.y + lastDirection.y,
      };
      if (next.straightSteps >= 3) {
        legalSteps = legalSteps.filter(
          ({ at }) => at.x != nextStraightStep.x || at.y != nextStraightStep.y
        );
      } else {
        const straightStep = legalSteps.find(
          ({ at }) => at.x == nextStraightStep.x || at.y == nextStraightStep.y
        );
        if (straightStep) {
          straightStep.straightSteps = next.straightSteps + 1;
        }
      }
    }
    for (const l of legalSteps) {
      queue.push(l);
    }
  }
  return goals.reduce((best, curr) => {
    if (best.cost < curr.cost) {
      return best;
    }
    return curr;
  }).cost;
}

function parseMap(input) {
  return input.split("\n").map((line) => line.split("").map(Number));
}
