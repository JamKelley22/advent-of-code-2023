var fs = require("fs");
const util = require("util");

export const parseInstructions = (line: string): boolean[] => {
  return line.split("").map((char) => (char === "R" ? true : false));
};

export const parseDessertMap = (
  lines: string[]
): {
  dessertMap: Map<string, { left: string; right: string }>;
  startingNodes: string[];
} => {
  const dessertMap = new Map<string, { left: string; right: string }>();
  const startingNodes = [] as string[];

  lines.forEach((line) => {
    const [loc, leftRight] = line.split(" = ");
    const [left, right] = leftRight.slice(1, leftRight.length - 1).split(", ");
    dessertMap.set(loc, { left, right });
    if (loc[loc.length - 1] === "A") startingNodes.push(loc);
  });

  return { dessertMap, startingNodes };
};

try {
  const useExample = false;
  const filePath = useExample ? "input-example3.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  const lines: string[] = input.split("\n");
  const instructions = parseInstructions(lines.shift() ?? "");
  // Throw away the empty line
  lines.shift();

  const dessertMap = parseDessertMap(lines);

  console.log(dessertMap.startingNodes);

  //   const cycleSet = new Set<string>();

  let numSteps = 0;
  let currentLocs = dessertMap.startingNodes;
  for (
    let instructionIndex = 0;
    !currentLocs.every((loc) => loc[loc.length - 1] === "Z");
    instructionIndex = (instructionIndex + 1) % instructions.length
  ) {
    numSteps++;
    // cycleSet.add(currentLocs.reduce((acc, loc) => acc + loc, ""));
    const isRight = instructions[instructionIndex];

    let newLocs = [] as string[];

    for (
      let currentLocIndex = 0;
      currentLocIndex < currentLocs.length;
      currentLocIndex++
    ) {
      const currentLoc = currentLocs[currentLocIndex];

      const { left, right } = dessertMap.dessertMap.get(currentLoc) ?? {};

      if (isRight) newLocs.push(right ?? "");
      else {
        newLocs.push(left ?? "");
      }
    }

    // if (cycleSet.has(newLocs.reduce((acc, loc) => acc + loc, ""))) {
    //   console.log("Has Cycle");
    //   break;
    // }

    if (numSteps % 1000000 === 0) {
      console.log("Num Steps: ", numSteps);
    }

    // console.log(
    //   "Current Locs: ",
    //   currentLocs,
    //   "\tDir: ",
    //   isRight ? "R" : "L",
    //   "\tNew Locs: ",
    //   newLocs
    // );
    currentLocs = newLocs;
    newLocs = [];
  }

  console.log(numSteps);
} catch (e: any) {
  console.log("Error:", e.stack);
}
