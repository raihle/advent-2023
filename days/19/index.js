import { sum } from "../../utils.js";

export function run(input) {
  const { parts, workflows } = parseInput(input.trim());
  console.log(
    "A:",
    parts
      .filter((part) => applyWorkflows(workflows, part))
      .map(addProperties)
      .reduce(sum, 0)
  );
  console.log("B:", countAcceptableValues(workflows));
}

function countAcceptableValues(workflows) {
  const accepted = findAcceptableValues(workflows, "in");
  console.log(accepted);
  return accepted.map(countAcceptableValuesForLimits).reduce(sum, 0);
}

function countAcceptableValuesForLimits({ x, m, a, s }) {
  return (
    (x.max - x.min + 1) *
    (m.max - m.min + 1) *
    (a.max - a.min + 1) *
    (s.max - s.min + 1)
  );
}

function mergeLimits(la, lb) {
  const mergedLimits = {};
  ["x", "m", "a", "s"].forEach((property) => {
    mergedLimits[property] = {
      min: Math.max(la[property].min, lb[property].min),
      max: Math.min(la[property].max, lb[property].max),
    };
  });
  return mergedLimits;
}

const ACCEPTABLE_VALUES = {
  A: [
    {
      x: { min: 1, max: 4000 },
      m: { min: 1, max: 4000 },
      a: { min: 1, max: 4000 },
      s: { min: 1, max: 4000 },
    },
  ],
  R: [],
};
function findAcceptableValues(workflows, workflowName) {
  if (!ACCEPTABLE_VALUES[workflowName]) {
    console.log("Calc AV", workflowName);
    let limits = {
      x: { min: 1, max: 4000 },
      m: { min: 1, max: 4000 },
      a: { min: 1, max: 4000 },
      s: { min: 1, max: 4000 },
    };
    const workflow = workflows[workflowName];
    let accepted = [];
    for (const rule of workflow) {
      const limitsForRule = mergeLimits(limits, passingValues(rule));
      const acceptedValues = findAcceptableValues(workflows, rule.target).map(
        (l) => mergeLimits(limitsForRule, l)
      );
      accepted = accepted.concat(acceptedValues);
      limits = mergeLimits(limits, failingValues(rule));
    }
    ACCEPTABLE_VALUES[workflowName] = accepted;
  }
  return ACCEPTABLE_VALUES[workflowName];
}

function passingValues(rule) {
  const limits = {
    x: { min: 1, max: 4000 },
    m: { min: 1, max: 4000 },
    a: { min: 1, max: 4000 },
    s: { min: 1, max: 4000 },
  };
  if (!rule.condition) {
    return limits;
  }
  if (rule.condition.test == ">") {
    limits[rule.condition.property].min = rule.condition.value + 1;
  } else if (rule.condition.test == "<") {
    limits[rule.condition.property].max = rule.condition.value - 1;
  } else {
    throw new Error(`Unknown operator ${rule.condition.test}`);
  }
  return limits;
}

function failingValues(rule) {
  if (!rule.condition) {
    return {
      x: { min: 0, max: -1 },
      m: { min: 0, max: -1 },
      a: { min: 0, max: -1 },
      s: { min: 0, max: -1 },
    };
  }
  const limits = {
    x: { min: 1, max: 4000 },
    m: { min: 1, max: 4000 },
    a: { min: 1, max: 4000 },
    s: { min: 1, max: 4000 },
  };
  if (rule.condition.test == ">") {
    limits[rule.condition.property].max = rule.condition.value;
  } else if (rule.condition.test == "<") {
    limits[rule.condition.property].min = rule.condition.value;
  } else {
    throw new Error(`Unknown operator ${rule.condition.test}`);
  }
  return limits;
}

function applyWorkflows(workflows, part) {
  let nextWorkflow = "in";
  while (nextWorkflow != "R" && nextWorkflow != "A") {
    nextWorkflow = applyWorkflow(workflows[nextWorkflow], part);
  }
  return nextWorkflow == "A";
}

function addProperties(part) {
  return part.x + part.m + part.a + part.s;
}

function applyWorkflow(workflow, part) {
  const { target } = workflow.find((rule) => applyRule(rule, part));
  return target;
}

function applyRule(rule, part) {
  if (!rule.condition) {
    return true;
  }
  const comparisonValue = rule.condition.value;
  const operator = rule.condition.test;
  const partValue = part[rule.condition.property];
  switch (operator) {
    case ">":
      return partValue > comparisonValue;
    case "<":
      return partValue < comparisonValue;
  }
  throw new Error(`Unknown operator ${operator}`);
}
function parseInput(input) {
  const [workflowBlock, partBlock] = input.split("\n\n");
  return {
    workflows: parseWorkflows(workflowBlock),
    parts: parseParts(partBlock),
  };
}

function parseWorkflows(workflowBlock) {
  const workflows = {};
  workflowBlock
    .split("\n")
    .map(parseWorkflow)
    .forEach((wf) => {
      workflows[wf.name] = wf.rules;
    });
  return workflows;
}

// e.g. px{a<2006:qkq,m>2090:A,rfg}
const WF_REGEX = /(?<name>\w+)\{(?<rules>.+)\}/;
const RULE_REGEX =
  /(?:(?<property>[xmas])(?<test>[><])(?<value>\d+):)?(?<target>\w+)/g;
function parseWorkflow(workflowLine) {
  const { name, rules: rulePart } = WF_REGEX.exec(workflowLine).groups;
  const rules = [];
  let match;
  while ((match = RULE_REGEX.exec(rulePart))) {
    if (match.groups.test) {
      rules.push({
        condition: {
          property: match.groups.property,
          test: match.groups.test,
          value: parseInt(match.groups.value),
        },
        target: match.groups.target,
      });
    } else {
      rules.push({
        target: match.groups.target,
      });
    }
  }
  return {
    name,
    rules,
  };
}

function parseParts(partBlock) {
  return partBlock.split("\n").map(parsePart);
}

// e.g. {x=787,m=2655,a=1222,s=2876}
const PART_REGEX = /([xmas])=(\d+)/g;
function parsePart(partLine) {
  let match;
  const part = {};
  while ((match = PART_REGEX.exec(partLine))) {
    part[match[1]] = parseInt(match[2]);
  }
  return part;
}
