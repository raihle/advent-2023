import { sum } from "../../utils.js";

let stats = {};
export function run(input) {
  const springs = parseSprings(input.trim());
  console.log("A:", solve(springs));
  printStats();
  stats = {};
  console.log("B:", solve(springs.map(unfold)));
  printStats();
}

function updateStats(key) {
  stats[key] = stats[key] ?? 0;
  stats[key]++;
}

function printStats() {
  console.log("Stats:");
  Object.keys(stats)
    .sort()
    .forEach((key) => console.log(` - ${key}: ${stats[key]}`));
}

function solve(lines) {
  const counts = lines.map((spring) => solveSingleLine(spring, {}));
  return counts.reduce(sum, 0);
}

function solveSingleLine({ status, groups }, memo) {
  updateStats("solveSingleLine");
  if (groups.length == 0) {
    if (status.indexOf("#") != -1) {
      updateStats("solveSingleLine_backtrack_leftovers");
      return 0;
    }
    return 1;
  }
  const key = `${groups.join(",")} ${status}`;
  if (!memo[key]) {
    const groupEnds = findLastGroupPlacements(status, groups);
    if (!groupEnds) {
      updateStats("solveSingleLine_backtrack_no_match");
      return 0;
    }
    const areaOfInterest = status.substring(0, groupEnds[0].to);

    const optionsForFirstGroup = findGroupPlacements(areaOfInterest, groups[0])
      .map((placement) => {
        return solveSingleLine(
          {
            status: status.substring(placement.to + 1),
            groups: groups.slice(1),
          },
          memo
        );
      })
      .reduce(sum, 0);
    updateStats("solveSingleLine_memo_write");
    memo[key] = optionsForFirstGroup;
  } else {
    updateStats("solveSingleLine_memo_read");
  }
  return memo[key];
}

function findGroupPlacements(status, group) {
  updateStats("findGroupPlacements");
  const allWorking = status.replace(/\?/g, ".");
  const allBroken = status.replace(/\?/g, "#");
  const placements = [];
  for (let i = 0; i <= status.length - group; i++) {
    if (
      allBroken.substring(i, i + group).match(/^#+$/) &&
      (i == 0 || allWorking[i - 1] == ".") &&
      (i + group == status.length || allWorking[i + group] == ".")
    ) {
      placements.push({ from: i, to: i + group });
    }
  }
  return placements;
}

function findLastGroupPlacements(status, groups) {
  updateStats("findLastGroupPlacements");
  const groupRegex = groupsToRegex([...groups].reverse());
  const match = [...status].reverse().join("").match(groupRegex);
  if (match) {
    const [, ...indices] = match.indices;
    return indices
      .map(([from, to]) => ({
        from: status.length - to,
        to: status.length - from,
      }))
      .reverse();
  } else {
    return false;
  }
}

function groupsToRegex(groups) {
  updateStats("groupsToRegex");
  const groupRegexes = groups.map((group) => `([#\\?]{${group}})`);
  return new RegExp(
    `^[\\.\\?]*?${groupRegexes.join("[\\.\\?]+?")}[\\.\\?]*$`,
    "d"
  );
}

function unfold({ status, groups }) {
  return {
    status: [status, status, status, status, status].join("?"),
    groups: [groups, groups, groups, groups, groups].flat(),
  };
}

function parseSprings(input) {
  const lines = input.split("\n").map((line) => line.split(/\s+/));
  return lines.map(([status, groups]) => ({
    status: status,
    groups: groups.split(",").map(Number),
  }));
}
