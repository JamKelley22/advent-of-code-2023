import {
  Garden,
  Location,
  Tile,
  TileLocation,
  decodeLocation,
  encodeLocation,
  getGardenTile,
  getNeighbors,
  isOfTypeTile,
  locationEquals,
} from "./engine";

var fs = require("fs");
const util = require("util");
const readline = require("readline");

export const parseGarden = (input: string): Garden => {
  const gardenMap = new Map<string, Tile>();
  let startingLocation = { x: -1, y: -1 };
  let width = 0,
    height = 0;
  const lines = input.split("\n");
  height = lines.length;
  lines.forEach((line, y) => {
    const chars = line.split("");
    width = chars.length;
    chars.map((char, x) => {
      if (!isOfTypeTile(char)) {
        throw new Error(`Invalid Tile type: ${char}`);
      }
      gardenMap.set(encodeLocation({ x, y }), char);
      if (char === "S") {
        startingLocation = { x, y };
      }
    });
  });
  return {
    map: gardenMap,
    startingLocation,
    width,
    height,
  };
};

export const gardenToString = (
  garden: Garden,
  visited?: Set<string>
): string => {
  console.log(garden.width, garden.height);

  let ret = "";
  for (let y = -garden.height * 2; y < garden.height * 2; y++) {
    for (let x = -garden.width * 2; x < garden.width * 2; x++) {
      const loc: Location = { x, y };
      let tile = getGardenTile(garden, loc);
      if (visited?.has(encodeLocation(loc))) {
        ret += "0 ";
        continue;
      }
      ret += `${tile ?? "?"} `;
    }
    ret += "\n";
  }
  return ret;
};

try {
  const useExample = true;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input: string = fs.readFileSync(filePath, "utf8");
  const garden = parseGarden(input);
  const maxStepNum = 50;

  //   console.log(
  //     gardenToString({
  //       ...garden,
  //       //   height: garden.height * 2,
  //       //   width: garden.width * 2,
  //     })
  //   );

  //   const visited = new Set<string>();
  const currentLocations = new Set<string>();

  let processStack = new Map<string, Tile>();
  processStack.set(encodeLocation(garden.startingLocation), "S");
  let nextProcessStack = new Map<string, Tile>();

  for (let step = 0; step <= maxStepNum; step++) {
    // console.log({ step });
    currentLocations.clear();

    while (processStack.size > 0) {
      let iterator = processStack.entries();
      let entry = iterator.next();
      let location = entry.value[0];

      processStack.delete(encodeLocation(decodeLocation(location)));

      const currentTileLocation = encodeLocation(decodeLocation(location));
      if (!currentTileLocation)
        throw new Error("Weird, why no currentTileLocation?");

      //   visited.add(encodeLocation(decodeLocation(location)));
      currentLocations.add(encodeLocation(decodeLocation(location)));
      const currentTileNeighbors = getNeighbors(
        garden,
        decodeLocation(location)
      );

      currentTileNeighbors.forEach((neighbor) => {
        nextProcessStack.set(encodeLocation(neighbor.location), neighbor.tile);
      });
    }
    processStack = new Map(nextProcessStack);
    nextProcessStack.clear();
  }

  console.log(gardenToString(garden));

  console.log(currentLocations.size);
} catch (e: any) {
  console.log("Error:", e.stack);
}
