import { sum } from "../../utils.js";

export function run(input) {
  const games = input.trim().split("\n").map(parseGame);
  console.log("A:", a(games));
  console.log("B:", b(games));
}

function a(games) {
  return games
    .filter((game) => {
      const { red, green, blue } = maxSeen(game);
      return red <= 12 && green <= 13 && blue <= 14;
    })
    .map((game) => game.id)
    .reduce(sum);
}

function b(games) {
  return games
    .map(maxSeen)
    .map(({ red, green, blue }) => red * green * blue)
    .reduce(sum);
}

function maxSeen(game) {
  return {
    red: maxSeenOfColor(game, "red"),
    green: maxSeenOfColor(game, "green"),
    blue: maxSeenOfColor(game, "blue"),
  };
}

function maxSeenOfColor(game, color) {
  return game.sets.reduce((acc, set) => Math.max(acc, set[color]), 0);
}

function parseGame(text) {
  const [id, content] = text.split(":");
  const sets = content.split(";").map(parseSet);
  return { id: Number(id.replace("Game ", "")), sets };
}

function parseSet(setText) {
  const cubes = {
    red: 0,
    green: 0,
    blue: 0,
  };
  setText.split(",").forEach((t) => {
    const [count, color] = t.trim().split(" ");
    return (cubes[color] = Number(count));
  });
  return cubes;
}
