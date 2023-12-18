import {
  DigInstruction,
  Direction,
  Location,
  TrenchMap,
  digTrench,
  encodeLocation,
  isOfTypeDirection,
  stackFloodFill,
} from "./engine";

var fs = require("fs");
const util = require("util");
const readline = require("readline");

var stream = fs.createWriteStream("trench.txt", { flags: "w" });

// 0 means R, 1 means D, 2 means L, and 3 means U.

const numStringToDirection: { [numStr: string]: Direction } = {
  "0": "R",
  "1": "D",
  "2": "L",
  "3": "U",
};

export const extractHexInstructions = (hex: string): DigInstruction[] => {
  // ex. #70c710 = R 461937

  const [distHex, dirEncoded] = [
    hex.slice(2, hex.length - 2),
    hex.slice(-2)[0],
  ];
  //   console.log({ distHex, dirEncoded });

  const dist = parseInt(distHex, 16);
  console.log({ dist });

  const direction = numStringToDirection[dirEncoded];

  return [...Array(dist).keys()].map((_) => ({
    direction,
    color: "",
  }));
};

export const parseDigPlan = (input: string): DigInstruction[] => {
  const lines = input.split("\n");
  return lines.flatMap((line) => {
    const [direction, distanceStr, colorStr] = line.split(" ");

    return extractHexInstructions(colorStr);
    // if (!isOfTypeDirection(direction)) {
    //   throw new Error(`Invalid direction: ${direction}`);
    // }
    // const distance = parseInt(distanceStr);
    // const color = colorStr.slice(1, colorStr.length - 1);
    // return [...Array(distance).keys()].map((_) => ({
    //   direction,
    //   color,
    // }));
  });
};

export const trenchToString = (trench: TrenchMap, mark?: Location): string => {
  let ret = "";

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

export const writeTrenchToFile = (trench: TrenchMap) => {
  for (let y = trench.minY; y < trench.maxY; y++) {
    for (let x = trench.minX; x < trench.maxX; x++) {
      if (trench.map.has(encodeLocation({ x, y }))) {
        stream.write("# ");
        continue;
      }
      if (trench.interior.has(encodeLocation({ x, y }))) {
        stream.write("@ ");
        continue;
      }
      stream.write(". ");
    }
    stream.write("\n");
  }
};

try {
  const useExample = true;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input: string = fs.readFileSync(filePath, "utf8");
  let startTime = 0,
    endTime = 0;

  console.log("===Parsing Dig Plan===");
  startTime = performance.now();
  const digPlan = parseDigPlan(input);
  endTime = performance.now();
  console.log(`===${(endTime - startTime) / 1000} seconds===`);

  console.log("===Digging Trench===");
  startTime = performance.now();
  const trenchMap = digTrench(digPlan);
  endTime = performance.now();
  console.log(`===${(endTime - startTime) / 1000} seconds===`);

  const startLoc = {
    x: Math.floor(trenchMap.minX + (trenchMap.maxX - trenchMap.minX) / 2),
    y: Math.floor(trenchMap.minY + (trenchMap.maxY - trenchMap.minY) / 2),
  };
  //   console.log(trenchToString(trenchMap, startLoc));

  console.log(startLoc);

  //   console.log("===Writing Trench to File===");
  //   startTime = performance.now();
  //   writeTrenchToFile(trenchMap);
  //   endTime = performance.now();
  //   console.log(`===${(endTime - startTime) / 1000} seconds===`);

  //   console.log("===Digging Interior===");
  //   startTime = performance.now();
  //   const filledArea = stackFloodFill(trenchMap, startLoc);
  //   endTime = performance.now();
  //   console.log(`===${(endTime - startTime) / 1000} seconds===`);

  //   trenchMap.interior = filledArea;
  //   console.log(trenchMap.map.size + trenchMap.interior.size);
} catch (e: any) {
  console.log("Error:", e.stack);
}
