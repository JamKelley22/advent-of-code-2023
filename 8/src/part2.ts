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
  const useExample = true;
  const filePath = useExample ? "input-example3.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  const lines: string[] = input.split("\n");
  const instructions = parseInstructions(lines.shift() ?? "");
  // Throw away the empty line
  lines.shift();

  const dessertMap = parseDessertMap(lines);

  console.log(dessertMap.startingNodes);

  let numSteps = 0;
  let currentLocs = dessertMap.startingNodes;
  for (
    let instructionIndex = 0;
    currentLocs.every((loc) => loc[loc.length - 1] === "Z") && numSteps < 10;
    instructionIndex = (instructionIndex + 1) % instructions.length
  ) {
    numSteps++;
    const isRight = instructions[instructionIndex];

    for (
      let currentLocIndex = 0;
      currentLocIndex < currentLocs.length;
      currentLocIndex++
    ) {
      const currentLoc = currentLocs[currentLocIndex];
      
      const { left, right } = dessertMap.dessertMap.get(currentLoc) ?? {};
      console.log(
        numSteps,
        "CurrentLoc: ",
        currentLoc,
        "Next Options: [",
        left,
        right,
        "]"
      );
      if (isRight) currentLoc = right ?? "";
      else {
        currentLoc = left ?? "";
      }
    }
  }

  console.log(numSteps);
} catch (e: any) {
  console.log("Error:", e.stack);
}
