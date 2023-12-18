import {
  DigInstruction,
  Location,
  TrenchMap,
  dfsFloodFill,
  digTrench,
  encodeLocation,
  isOfTypeDirection,
  stackFloodFill,
  travelDirection,
} from "./engine";

var fs = require("fs");
const util = require("util");
const readline = require("readline");

export const parseDigPlan = (input: string): DigInstruction[] => {
  const lines = input.split("\n");
  return lines.flatMap((line) => {
    const [direction, distanceStr, colorStr] = line.split(" ");
    if (!isOfTypeDirection(direction)) {
      throw new Error(`Invalid direction: ${direction}`);
    }
    const distance = parseInt(distanceStr);
    const color = colorStr.slice(1, colorStr.length - 1);
    return [...Array(distance).keys()].map((_) => ({
      direction,
      color,
    }));
  });
};

export const trenchToString = (trench: TrenchMap, mark?: Location): string => {
  let ret = "";

  //   console.log(trench.minY, trench.maxY);

  //   console.log(trench.minX, trench.maxX);

  for (let y = trench.minY; y < trench.maxY; y++) {
    for (let x = trench.minX; x < trench.maxX; x++) {
      if (mark?.x === x && mark.y === y) {
        ret += "+ ";
        continue;
      }
      if (trench.map.has(encodeLocation({ x, y }))) {
        ret += "# ";
        continue;
      }
      if (trench.interior.has(encodeLocation({ x, y }))) {
        ret += "@ ";
        continue;
      }
      ret += ". ";
    }
    ret += "\n";
  }

  return ret;
};

try {
  const useExample = false;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input: string = fs.readFileSync(filePath, "utf8");
  const digPlan = parseDigPlan(input);
  const trenchMap = digTrench(digPlan);
  //   const startLoc = {
  //     x: 100,
  //     y: 200,
  //   };
  // Guess the start location since I don't want to figure out what point is in the interior
  // Could do raycasting to randomly guess a point and check if it is in the interior
  const startLoc = {
    x: Math.floor(trenchMap.minX + (trenchMap.maxX - trenchMap.minX) / 2),
    y: Math.floor(trenchMap.minY + (trenchMap.maxY - trenchMap.minY) / 2),
  };
  console.log(trenchToString(trenchMap, startLoc));

  console.log(startLoc);

  const filledArea = stackFloodFill(trenchMap, startLoc);
  trenchMap.interior = filledArea;
  console.log(trenchMap.map.size + trenchMap.interior.size);
} catch (e: any) {
  console.log("Error:", e.stack);
}
