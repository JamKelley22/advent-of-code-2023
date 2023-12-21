import {
  Garden,
  Location,
  Tile,
  TileLocation,
  decodeLocation,
  encodeLocation,
  getNeighbors,
  isOfTypeTile,
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
  visited: Set<string>
): string => {
  let ret = "";
  for (let y = 0; y < garden.height; y++) {
    for (let x = 0; x < garden.width; x++) {
      const loc: Location = { x, y };
      const tile = garden.map.get(encodeLocation(loc));
      if (visited.has(encodeLocation(loc))) {
        ret += "0 ";
        continue;
      }
      ret += `${tile} `;
    }
    ret += "\n";
  }
  return ret;
};

try {
  const useExample = false;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input: string = fs.readFileSync(filePath, "utf8");
  const garden = parseGarden(input);
  const maxStepNum = 64;

  const visited = new Set<string>();
  const currentLocations = new Set<string>();
  //   let processStack: TileLocation[] = [
  //     { tile: "S", location: garden.startingLocation },
  //   ];
  let processStack = new Map<string, Tile>();
  processStack.set(encodeLocation(garden.startingLocation), "S");
  let nextProcessStack = new Map<string, Tile>();

  for (let step = 0; step <= maxStepNum; step++) {
    console.log({ step });
    currentLocations.clear();

    while (processStack.size > 0) {
      let iterator = processStack.entries();
      let entry = iterator.next();
      let location = entry.value[0];

      //   console.log(processStack, decodeLocation(location));

      processStack.delete(encodeLocation(decodeLocation(location)));

      const currentTileLocation = encodeLocation(decodeLocation(location)); //processStack.shift();
      //   console.log(processStack.length);

      if (!currentTileLocation)
        throw new Error("Weird, why no currentTileLocation?");

      //   if (currentTileLocation.tile !== "S")
      visited.add(encodeLocation(decodeLocation(location)));
      currentLocations.add(encodeLocation(decodeLocation(location)));
      const currentTileNeighbors = getNeighbors(
        garden,
        decodeLocation(location)
      );
      //   console.log("neighbors", currentTileNeighbors);

      //   const validNeighbors = currentTileNeighbors.filter(
      //     (neighbor) => !visited.has(encodeLocation(neighbor.location))
      //   );
      //   console.log("validNeighbors", validNeighbors);

      currentTileNeighbors.forEach((neighbor) => {
        nextProcessStack.set(encodeLocation(neighbor.location), neighbor.tile);
      });
      //   nextProcessStack.push(...currentTileNeighbors);
    }
    processStack = new Map(nextProcessStack);
    nextProcessStack.clear();
  }

  //   console.log(gardenToString(garden, currentLocations));

  console.log(currentLocations.size);
} catch (e: any) {
  console.log("Error:", e.stack);
}
