export function run(input) {
  const games = input.trim().split("\n").map(toGame);
  console.log("A", a(games));
  console.log("B", b(games));
}

function maxSeenInGames(games) {
  const maxSeenInGames = [];
  for (const game of games) {
    const maxSeen = {
      red: 0,
      green: 0,
      blue: 0,
    };
    for (const set of game.sets) {
      for (const cubes of set) {
        maxSeen[cubes.color] = Math.max(maxSeen[cubes.color], cubes.count);
      }
    }
    maxSeenInGames.push({
      ...game,
      maxSeen,
    });
  }
  return maxSeenInGames;
}

function a(games) {
  const allowed = {
    red: 12,
    green: 13,
    blue: 14,
  };
  const processedGames = maxSeenInGames(games);
  const possibleGames = processedGames.filter(
    (game) =>
      game.maxSeen.red <= allowed.red &&
      game.maxSeen.green <= allowed.green &&
      game.maxSeen.blue <= allowed.blue
  );
  const sumOfPossibleGameIds = possibleGames.reduce(
    (acc, game) => acc + game.id,
    0
  );
  return sumOfPossibleGameIds;
}

function b(games) {
  const processedGames = maxSeenInGames(games);
  const powerOfGames = processedGames.map(
    (game) => game.maxSeen.red * game.maxSeen.green * game.maxSeen.blue
  );
  return powerOfGames.reduce((acc, power) => acc + power);
}
function toGame(text) {
  const [id, content] = text.split(":");
  const sets = content.split(";").map(toCubes);
  return { id: Number(id.replace("Game ", "")), sets };
}

function toCubes(setText) {
  return setText.split(",").map((t) => {
    const [count, color] = t.trim().split(" ");
    return { count: Number(count), color };
  });
}
