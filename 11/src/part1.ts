import {
  Galaxy,
  Point,
  expandGalaxy,
  getDecodedCoordinates,
  getEmptyRowColumnIndices,
  getEncodedCoordinates,
  manhattanDistance,
} from "./engine";

var fs = require("fs");
const util = require("util");

const galaxyChar = "#";

export const parseGalaxy = (input: string): Galaxy => {
  const lines: string[] = input.split("\n").reduce((acc, line) => {
    if (line) return [...acc, line];
    return acc;
  }, [] as string[]);
  const field = new Set<string>();
  lines.forEach((line, y) => {
    line.split("").forEach((char, x) => {
      if (char === galaxyChar) {
        field.add(getEncodedCoordinates({ x, y }));
      }
    });
  });

  return {
    field,
    width: lines[0].length,
    height: lines.length,
  };
};

export const galaxyToString = (
  galaxy: Galaxy,
  showEmptyRowCols?: boolean
): string => {
  const { field, height, width } = galaxy;
  let ret = "";
  const { rows: emptyRowIndices, cols: emptyColumnIndices } =
    getEmptyRowColumnIndices(galaxy);

  ret += "  ";

  for (let x = 0; x < width; x++) {
    if (emptyColumnIndices.has(x)) {
      ret += "↓";
      continue;
    }
    ret += " ";
  }
  ret += "\n";
  for (let y = 0; y < height; y++) {
    ret += emptyRowIndices.has(y) ? "→ " : "  ";
    for (let x = 0; x < width; x++) {
      if (field.has(getEncodedCoordinates({ y, x }))) {
        ret += galaxyChar;
        continue;
      }
      ret += ".";
    }
    ret += "\n";
  }
  return ret;
};

try {
  const useExample = false;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");
  const galaxy = parseGalaxy(input);
  //   console.log(galaxyToString(galaxy));
  const expandedGalaxy = expandGalaxy(galaxy, 1000000);
  //   console.log(galaxyToString(expandedGalaxy));

  let manhattanTotal = 0;
  [...expandedGalaxy.field].forEach((coordI, i) => {
    [...expandedGalaxy.field].slice(i + 1).forEach((coordJ, j) => {
      const manhattan = manhattanDistance(
        getDecodedCoordinates(coordI),
        getDecodedCoordinates(coordJ)
      );
      //   console.log({ manhattan });
      manhattanTotal += manhattan;
    });
  });

  console.log(manhattanTotal);
} catch (e: any) {
  console.log("Error:", e.stack);
}
