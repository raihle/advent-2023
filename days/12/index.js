import { sum } from "../../utils.js";

export function run(input) {
  const springStatus = parseSprings(input.trim());
  console.log("A:", a(springStatus));
}

function a(springs) {
  return springs
    .map(({ status, groups }) => {
      return possibleStatusesByGroup({ status, groups })
        .map(groupsForStatus)
        .filter((possibleGroups) => groupsMatch(possibleGroups, groups)).length;
    })
    .reduce(sum);
}

function groupsMatch(a, b) {
  return a.join(",") === b.join(",");
}

function possibleStatusesByGroup({ status, groups }) {
  let possibilities = [""];
  for (let i = 0; i < status.length; i++) {
    possibilities = possibleStatusesByGroupAtIndex(
      status,
      groups,
      i,
      possibilities
    );
  }
  return possibilities;
}

function possibleStatusesByGroupAtIndex(originalStatus, groups, index, acc) {
  if (originalStatus[index] == "." || originalStatus[index] == "#") {
    return acc.map((pStatus) => pStatus + originalStatus[index]);
  } else {
    return acc
      .map((pStatus) => pStatus + ".")
      .concat(acc.map((pStatus) => pStatus + "#"));
  }
}

function parseSprings(input) {
  const lines = input.split("\n").map((line) => line.split(/\s+/));
  return lines.map(([status, groups]) => ({
    status: status,
    groups: groups.split(",").map(Number),
  }));
}

function groupsForStatus(status) {
  return parseStatus(status)
    .filter(({ type }) => type == "#")
    .map(({ length }) => length);
}

function parseStatus(status) {
  const statusSummary = [];
  let currentGroupStart = 0;
  let currentGroupType = status[0];
  for (let i = 0; i < status.length; i++) {
    if (currentGroupType != status[i]) {
      statusSummary.push({
        type: currentGroupType,
        length: i - currentGroupStart,
      });
      currentGroupType = status[i];
      currentGroupStart = i;
    }
  }
  statusSummary.push({
    type: currentGroupType,
    length: status.length - currentGroupStart,
  });
  return statusSummary;
}
