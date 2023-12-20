import { lcm } from "../../utils.js";

export function run(input) {
  const moduleDescriptions = parseModules(input.trim());
  console.log("A:", a(moduleDescriptions));
  console.log("B:", b(moduleDescriptions));
}

function a(moduleDescriptions) {
  return simulate(makeModules(moduleDescriptions), 1000);
}

function b(moduleDescriptions) {
  // We rely on the fact that RX is fed by a conjunction with periodic inputs
  // Find the period of each input and find the lowest common multiple,
  // which will be the first cycle that has all inputs "high", causing a low
  // pulse to RX (our exit condition)
  
  const target = "rx";
  const incoming = moduleDescriptions[target].incoming;
  if (incoming.length > 1) {
    throw new Error("More than one incoming for RX, b needs work");
  }
  return simulateB(
    makeModules(moduleDescriptions),
    moduleDescriptions[incoming]
  ).reduce(lcm, 1);
}

function simulate(modules, targetPresses) {
  const queue = [];
  let highs = 0;
  let lows = 0;
  const emit = function (from, to, pulse) {
    queue.push({ from, to, pulse });
    if (pulse) {
      highs++;
    } else {
      lows++;
    }
  };
  for (let i = 0; i < targetPresses; i++) {
    simulateOnePress(modules, emit, queue);
  }
  return highs * lows;
}

function simulateB(modules, stopWhenTrue) {
  const queue = [];
  let presses = 0;
  let done = false;
  let diff = false;
  const incoming = {};
  const emit = function (from, to, pulse) {
    if (to == stopWhenTrue.name && pulse) {
      if (!incoming[from]) {
        incoming[from] = presses;
      }
      if (Object.keys(incoming).length == stopWhenTrue.incoming.length) {
        done = true;
      }
    }
    queue.push({ from, to, pulse });
  };
  while (!done) {
    presses++;
    simulateOnePress(modules, emit, queue);
    if (diff) {
      console.log(hjTrues);
      diff = false;
    }
  }
  return Object.values(incoming);
}

function simulateOnePress(modules, emit, queue) {
  emit("button", "broadcaster", false);
  while (queue.length > 0) {
    const { from, to, pulse } = queue.shift();
    modules[to](from, pulse, emit);
  }
}

function parseModules(input) {
  const lines = input.split("\n");
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

  return moduleDescriptions;
}

function makeModules(moduleDescriptions) {
  const modules = {};
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

function makeOutput(_name) {
  return function output(_sender, _pulse, _emit) {};
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
