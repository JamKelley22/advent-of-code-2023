export const Rocks = ["O", "#"] as const;
export type Rock = (typeof Rocks)[number];

export function isOfTypeRock(keyInput: string): keyInput is Rock {
  return Rocks.includes(keyInput as Rock);
}

export type Platform = {
  width: number;
  height: number;
  platformMap: Map<string, Rock>;
  colSquareRocks?: Map<number, Location[]>;
  rowSquareRocks?: Map<number, Location[]>;
};

export type Location = {
  x: number;
  y: number;
};

export const encodeLocation = (loc: Location): string => `[${loc.x},${loc.y}]`;
export const decodeLocation = (locStr: string): Location => {
  const [x, y] = locStr
    .slice(1, locStr.length - 1)
    .split(",")
    .map((coordStr) => parseInt(coordStr));
  return { x, y };
};

export const Directions = ["North", "South", "East", "West"] as const;
type Direction = (typeof Directions)[number];

export const travelDirection = (
  currentLocation: Location,
  direction: Direction
): Location => {
  let { x, y } = currentLocation;
  switch (direction) {
    case "East":
      return { x: x + 1, y };
    case "South":
      return { x, y: y + 1 };
    case "West":
      return { x: x - 1, y };
    case "North":
      return { x, y: y - 1 };
  }
};

export const tiltPlatform = (platform: Platform, direction: Direction) => {
  const roundRockLocations = [...platform.platformMap].reduce(
    (acc, [encodedLocation, rock]) => {
      if (rock === "#") return acc;

      return [...acc, decodeLocation(encodedLocation)];
    },
    [] as Location[]
  );
  let edgeCondition = (loc: Location) => false;
  switch (direction) {
    case "North":
      roundRockLocations.sort((a, b) => a.y - b.y);
      edgeCondition = (loc) => loc.y > 0;
      break;
    case "South":
      roundRockLocations.sort((a, b) => b.y - a.y);
      edgeCondition = (loc) => loc.y < platform.height;
      break;
    case "East":
      roundRockLocations.sort((a, b) => b.x - a.x);
      edgeCondition = (loc) => loc.x < platform.width;
      break;
    case "West":
      roundRockLocations.sort((a, b) => a.x - b.x);
      edgeCondition = (loc) => loc.x > 0;
      break;
  }
  // console.log({ roundRockLocations });

  roundRockLocations.forEach((roundRockLoc) => {
    let shiftedLoc = travelDirection(roundRockLoc, direction);
    let currentLoc = { ...roundRockLoc };
    while (
      !platform.platformMap.get(encodeLocation(shiftedLoc)) &&
      edgeCondition(currentLoc)
    ) {
      currentLoc = { ...shiftedLoc };
      shiftedLoc = travelDirection(currentLoc, direction);
    }
    //Delete where it is currently
    platform.platformMap.delete(encodeLocation(roundRockLoc));
    //Set it to the place where it settles
    platform.platformMap.set(encodeLocation(currentLoc), "O");
  });
};

export const tiltPlatformFast = (
  platform: Platform,
  direction: Direction,
  log: boolean = false
) => {
  switch (direction) {
    case "North":
      for (let colIndex = 0; colIndex < platform.width; colIndex++) {
        const squareRocksInCol = platform.colSquareRocks?.get(colIndex) ?? [];
        squareRocksInCol.sort((a, b) => a.y - b.y);
        for (
          let squareRockRangeIndex = 0;
          squareRockRangeIndex < squareRocksInCol.length;
          squareRockRangeIndex++
        ) {
          // TODO: Eval each space between each square rock and sandwich the round ones together? Not sure...
          if (log) {
            console.log(
              squareRocksInCol[squareRockRangeIndex],
              squareRocksInCol[squareRockRangeIndex + 1]
            );
          }
        }
      }
      break;
    case "South":
      break;
    case "East":
      break;
    case "West":
      break;
  }
};

export const calculateSumFromPlatform = (platform: Platform): number => {
  let sum = 0;

  platform.platformMap.forEach((rock, encodedLocation) => {
    const rockLoc = decodeLocation(encodedLocation);
    // console.log({ encodedLocation }, platform.height - rockLoc.y);
    if (rock === "O") sum += platform.height - rockLoc.y;
  });
  return sum;
};

export const cyclePlatformNTimes = (platform: Platform, cycles: number) => {
  for (let cycleIndex = 0; cycleIndex < cycles; cycleIndex++) {
    tiltPlatformFast(platform, "North", true);
    tiltPlatformFast(platform, "West");
    tiltPlatformFast(platform, "South");
    tiltPlatformFast(platform, "East");
  }
};
