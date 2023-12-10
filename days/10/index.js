import { max } from "../../utils.js";

const PIPE_MAP = {
  "-": [
    [-1, 0],
    [1, 0],
  ],
  "|": [
    [0, -1],
    [0, 1],
  ],
  7: [
    [-1, 0],
    [0, 1],
  ],
  F: [
    [1, 0],
    [0, 1],
  ],
  L: [
    [1, 0],
    [0, -1],
  ],
  J: [
    [-1, 0],
    [0, -1],
  ],
};

export function run(input) {
  const pipes = parsePipes(input.trim());
  console.log("A:", a(pipes));
}

function a({ pipes, start }) {
  console.log(pipes.map((line) => line.join("")).join("\n"));
  const distances = pipeDistancesFromStart(pipes, start);
  console.log(distances.map((line) => line.join("")).join("\n"));

  return max(distances.map(max));
}

function parsePipes(input) {
  const lines = input.split("\n");
  const pipes = lines.map((line) => line.split(""));
  const start = {};
  for (let y = 0; y < pipes.length; y++) {
    const x = lines[y].indexOf("S");
    if (x >= 0) {
      start.x = x;
      start.y = y;
      pipes[y][x] = whatIsStart(pipes, start);
      return {
        pipes,
        start,
      };
    }
  }
}

function whatIsStart(pipes, start) {
  const left = pipes[start.y][start.x - 1];
  const right = pipes[start.y][start.x + 1];
  const top = pipes[start.y - 1][start.x];
  const bottom = pipes[start.y + 1][start.x];
  if (connectsRight(left)) {
    if (connectsLeft(right)) {
      return "-";
    } else if (connectsDown(top)) {
      return "J";
    } else if (connectsUp(bottom)) {
      return "7";
    }
  } else if (connectsLeft(right)) {
    if (connectsDown(top)) {
      return "L";
    } else if (connectsUp(bottom)) {
      return "F";
    }
  } else {
    return "|";
  }
}

function connectsRight(pipe) {
  const connections = PIPE_MAP[pipe];
  return connections && (connections[0][0] == 1 || connections[1][0] == 1);
}

function connectsLeft(pipe) {
  const connections = PIPE_MAP[pipe];
  return connections && (connections[0][0] == -1 || connections[1][0] == -1);
}

function connectsUp(pipe) {
  const connections = PIPE_MAP[pipe];
  return connections && (connections[0][1] == -1 || connections[1][1] == -1);
}

function connectsDown(pipe) {
  const connections = PIPE_MAP[pipe];
  return connections && (connections[0][1] == 1 || connections[1][1] == 1);
}

function pipeDistancesFromStart(pipes, start) {
  const distances = pipes.map((line) => line.map(() => "."));
  let queue = [start];
  let distance = 0;
  while (queue.length > 0) {
    const roundQueue = queue;
    queue = [];
    for (const pipe of roundQueue) {
      if (distances[pipe.y][pipe.x] !== ".") {
        continue;
      }
      distances[pipe.y][pipe.x] = distance;
      PIPE_MAP[pipes[pipe.y][pipe.x]].forEach((conn) => {
        queue.push({
          x: conn[0] + pipe.x,
          y: conn[1] + pipe.y,
        });
      });
    }
    distance++;
  }
  return distances;
}
