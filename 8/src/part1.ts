var fs = require("fs");
const util = require("util");

export const parseInstructions = (line: string): boolean[] => {
  return line.split("").map((char) => (char === "R" ? true : false));
};

export const parseDessertMap = (
  lines: string[]
): Map<string, { left: string; right: string }> => {
  const dessertMap = new Map<string, { left: string; right: string }>();

  lines.forEach((line) => {
    const [loc, leftRight] = line.split(" = ");
    const [left, right] = leftRight.slice(1, leftRight.length - 1).split(", ");
    dessertMap.set(loc, { left, right });
  });

  return dessertMap;
};

try {
  const useExample = false;
  const filePath = useExample ? "input-example2.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  const lines: string[] = input.split("\n");
  const instructions = parseInstructions(lines.shift() ?? "");
  // Throw away the empty line
  lines.shift();

  const dessertMap = parseDessertMap(lines);

  let numSteps = 0;
  let currentLoc = "AAA";
  for (
    let instructionIndex = 0;
    currentLoc !== "ZZZ" || numSteps > 1000000000;
    instructionIndex = (instructionIndex + 1) % instructions.length
  ) {
    numSteps++;
    const isRight = instructions[instructionIndex];

    const { left, right } = dessertMap.get(currentLoc) ?? {};
    console.log(
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

  console.log(numSteps);
} catch (e: any) {
  console.log("Error:", e.stack);
}
