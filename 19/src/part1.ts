import { Part, Rule, Workflow, isOfTypeCategory } from "./engine";

var fs = require("fs");
const util = require("util");
const readline = require("readline");

export const parseWorkflows = (input: string): Map<string, Workflow> => {
  const lines = input.split("\n");

  const workflowMap = new Map<string, Workflow>();

  lines.forEach((line) => {
    const [workflowName, secondHalf] = line.split("{");
    // remove trailing '}'
    const rules: Rule[] = secondHalf
      .slice(0, secondHalf.length - 1)
      .split(",")
      .map((ruleStr) => {
        if (!ruleStr.includes(":")) {
          // The final condition workflow to go to
          return {
            condition: () => true,
            toWorkflowOnPassCondition: ruleStr,
          } satisfies Rule;
        }
        const [conditionStr, workflowIfSatisfies] = ruleStr.split(":");
        const [category, numberStr] = conditionStr.split(/<|>/);
        if (!isOfTypeCategory(category)) {
          throw new Error(
            `Invalid category ${category} found when parsing workflows`
          );
        }
        const number = parseInt(numberStr);
        if (conditionStr.includes("<")) {
          return {
            condition: (part) => part[category] < number,
            toWorkflowOnPassCondition: workflowIfSatisfies,
          };
        } else if (conditionStr.includes(">")) {
          return {
            condition: (part) => part[category] > number,
            toWorkflowOnPassCondition: workflowIfSatisfies,
          };
        } else {
          throw new Error(
            `Invalid condition in ${workflowName} workflow when parsing. Condition: ${conditionStr}`
          );
        }
      });

    workflowMap.set(workflowName, { rules, name: workflowName });
    return {
      name: workflowName,
      rules,
    };
  });

  return workflowMap;
};

export const parseParts = (input: string): Part[] => {
  const lines = input.split("\n");
  const parts = lines.map((line) => {
    // Remove starting '{' and ending '}'
    const core = line.slice(1, line.length - 1);
    return core.split(",").reduce(
      (acc, categoryStr) => {
        const [category, numberStr] = categoryStr.split("=");
        if (!isOfTypeCategory(category)) {
          throw new Error(`Invalid Category: ${category}`);
        }
        const number = parseInt(numberStr);
        return {
          ...acc,
          [category]: number,
        };
      },
      {
        x: -1,
        m: -1,
        a: -1,
        s: -1,
      } satisfies Part
    );
  });
  return parts;
};

try {
  const useExample = false;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input: string = fs.readFileSync(filePath, "utf8");
  const blocks = input.split("\n\n");

  const allWorkflows = parseWorkflows(blocks[0]);

  const parts = parseParts(blocks[1]);

  const startWorkflowName = "in";
  const startWorkflow = allWorkflows.get(startWorkflowName);
  if (!startWorkflow) {
    throw new Error(
      `Could not find start workflow labeled: ${startWorkflowName}`
    );
  }
  //   startWorkflow.partQueue = parts;

  const accepted: Part[] = [],
    rejected: Part[] = [];

  for (let partIndex = 0; partIndex < parts.length; partIndex++) {
    let currentWorkflow = startWorkflow;
    const part = parts[partIndex];
    // console.log({ part });

    // while (true) {
    for (
      let ruleIndex = 0;
      ruleIndex < currentWorkflow.rules.length;
      ruleIndex++
    ) {
      const rule = currentWorkflow.rules[ruleIndex];
      const pass = rule.condition(part);
      //   console.log({ pass });

      if (pass) {
        // console.log("pass on", { ruleIndex });

        const nextWorkflow = allWorkflows.get(rule.toWorkflowOnPassCondition);

        if (!nextWorkflow) {
          if (rule.toWorkflowOnPassCondition === "R") {
            // console.log("Rejected");

            rejected.push(part);
            break;
          } else if (rule.toWorkflowOnPassCondition === "A") {
            // console.log("Accepted");

            accepted.push(part);
            break;
          } else {
            throw new Error(
              `Invalid next workflow ${nextWorkflow} when evaluating part: ${part}`
            );
          }
        }
        // console.log("Next workflow:", nextWorkflow.name);

        currentWorkflow = nextWorkflow;
        ruleIndex = -1;
        // break;
      }
    }
  }

  //   console.log(accepted, rejected);
  const total = accepted.reduce((acc, part) => {
    return acc + part.x + part.m + part.a + part.s;
  }, 0);
  console.log(total);
} catch (e: any) {
  console.log("Error:", e.stack);
}
