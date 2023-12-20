export function run(input) {
  const modules = parseModules(input.trim());
  console.log(
    "A:",
    simulate(modules, 1000)
  );
}

function simulate(modules, targetPresses) {
  const queue = [];
  let highs = 0;
  let lows = 0;
  let presses = 0;
  const emit = function (from, to, pulse) {
    queue.push({ from, to, pulse });
    if (pulse) {
      highs++;
    } else {
      lows++;
    }
  };
  while (presses < targetPresses) {
    emit("button", "broadcaster", false);
    presses++;
    while (queue.length > 0) {
      const { from, to, pulse } = queue.shift();
      modules[to](from, pulse, emit);
    }
  }
  return highs * lows;
}

function parseModules(input) {
  const lines = input.split("\n");
  const modules = {};
  const moduleDescriptions = {};
  for (const line of lines) {
    const [nameWithPrefix, targetList] = line.split(" -> ");
    const name = nameWithPrefix.replace("&", "").replace("%", "");
    const outgoings = targetList.split(", ");
    if (!moduleDescriptions[name]) {
      moduleDescriptions[name] = {
        name,
        outgoing: [],
        incoming: [],
      };
    }
    moduleDescriptions[name].type = nameWithPrefix.substring(0, 1);
    outgoings.forEach((target) => {
      if (!moduleDescriptions[target]) {
        moduleDescriptions[target] = {
          name: target,
          outgoing: [],
          incoming: [],
        };
      }
      moduleDescriptions[target].incoming.push(name);
      moduleDescriptions[name].outgoing.push(target);
    });
  }

  for (const md of Object.values(moduleDescriptions)) {
    modules[md.name] = makeModule(md);
  }

  return modules;
}

function makeModule({ name, type, incoming, outgoing }) {
  switch (type) {
    case "b":
      return makeBroadcaster(outgoing);
    case "%":
      return makeFlipFlopper(name, outgoing);
    case "&":
      return makeConjunction(name, incoming, outgoing);
    case undefined:
      return makeOutput(name);
  }
  throw new Error(`Could not work with description for "${name}" (${type})`);
}

function makeOutput(name) {
  return function output(_sender, pulse, _emit) {
  }
}


function makeBroadcaster(outgoing) {
  return function broadcaster(_sender, pulse, emit) {
    outgoing.forEach((target) => emit("broadcaster", target, pulse));
  };
}

function makeFlipFlopper(name, outgoing) {
  let state = false;
  return function flipflopper(_sender, pulse, emit) {
    if (!pulse) {
      state = !state;
      outgoing.forEach((target) => emit(name, target, state));
    }
  };
}

function makeConjunction(name, incoming, outgoing) {
  let state = incoming.reduce((memory, i) => {
    memory[i] = false;
    return memory;
  }, {});
  return function conjunction(sender, pulse, emit) {
    state[sender] = pulse;
    const toSend = !Object.values(state).every((m) => m);
    outgoing.forEach((target) => emit(name, target, toSend));
  };
}