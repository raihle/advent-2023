export function run(input) {
  const games = input.trim().split("\n").map(toGame);
  console.log("A", a(games));
}

function a(games) {
  const allowed = {
    red: 12,
    green: 13,
    blue: 14,
  };
  const possibleGames = [];
  let sumOfPossible = 0;
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
    if (
      maxSeen.red <= allowed.red &&
      maxSeen.green <= allowed.green &&
      maxSeen.blue <= allowed.blue
    ) {
      possibleGames.push(game);
      sumOfPossible += game.id;
      console.log("Possible", JSON.stringify(game, null, 2));
    } else {
      console.log("Not possible", JSON.stringify(game, null, 2));
    }
  }
  return sumOfPossible;
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
