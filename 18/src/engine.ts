export const Directions = ["R", "D", "L", "U"] as const;
export type Direction = (typeof Directions)[number];

export function isOfTypeDirection(keyInput: string): keyInput is Direction {
  return Directions.includes(keyInput as Direction);
}

export type DigInstruction = {
  direction: Direction;
  //   distance: number;
  color: string;
};

export type TrenchMap = {
  //   height: number;
  //   width: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  map: Set<string>;
  interior: Set<string>;
};

export type Location = {
  x: number;
  y: number;
};

export const encodeLocation = (loc: Location): string => `[${loc.x},${loc.y}]`;
export const decodeLocation = (locStr: string): Location => {
  const [xStr, yStr] = locStr.slice(1, locStr.length - 1).split(",");
  const x = parseInt(xStr),
    y = parseInt(yStr);
  return { x, y };
};

export const travelDirection = (
  currentLocation: Location,
  direction: Direction
): Location => {
  let { x, y } = currentLocation;
  switch (direction) {
    case "R":
      return { x: x + 1, y };
    case "D":
      return { x, y: y + 1 };
    case "L":
      return { x: x - 1, y };
    case "U":
      return { x, y: y - 1 };
  }
};

export const digTrench = (digPlan: DigInstruction[]): TrenchMap => {
  let maxX = 0,
    minX = 0;
  let maxY = 0,
    minY = 0;
  const trenchSet = new Set<string>();
  const interior = new Set<string>();
  let currentLocation: Location = {
    x: 0,
    y: 0,
  };

  //Dig initial location
  trenchSet.add(encodeLocation(currentLocation));

  digPlan.forEach((instruction) => {
    currentLocation = travelDirection(currentLocation, instruction.direction);
    trenchSet.add(encodeLocation(currentLocation));
    if (currentLocation.x > maxX) maxX = currentLocation.x + 1;
    if (currentLocation.x < minX) minX = currentLocation.x;
    if (currentLocation.y > maxY) maxY = currentLocation.y + 1;
    if (currentLocation.y < minY) minY = currentLocation.y;
  });

  return {
    // height: maxY - minY + 1,
    // width: maxX - minX + 1,
    minX,
    maxX,
    minY,
    maxY,
    map: trenchSet,
    interior,
  };
};

export const stackFloodFill = (
  trench: TrenchMap,
  startingLocation: Location
): Set<string> => {
  const filled = new Set<string>();
  const stack = [startingLocation];

  console.log("===Digging Interior===");
  let startTime = 0,
    endTime = 0;

  startTime = performance.now();
  for (let i = 0; stack.length > 0; i++) {
    if (i % 1000000 === 0) {
      endTime = performance.now();
      console.log(
        stack.length,
        `===${(endTime - startTime) / 1000} seconds===`
      );
    }

    const currentLoc = stack.pop();
    if (!currentLoc) continue;
    filled.add(encodeLocation(currentLoc));

    // Get neighbors
    //   const neighbors = [];
    const up = travelDirection(currentLoc, "U"),
      down = travelDirection(currentLoc, "D"),
      left = travelDirection(currentLoc, "L"),
      right = travelDirection(currentLoc, "R");
    if (
      currentLoc.y > trench.minY &&
      !trench.map.has(encodeLocation(up)) &&
      !filled.has(encodeLocation(up))
    ) {
      stack.push(up);
    }

    if (
      currentLoc.y < trench.maxY - 1 &&
      !trench.map.has(encodeLocation(down)) &&
      !filled.has(encodeLocation(down))
    ) {
      stack.push(down);
    }

    if (
      currentLoc.x > trench.minX &&
      !trench.map.has(encodeLocation(left)) &&
      !filled.has(encodeLocation(left))
    ) {
      stack.push(left);
    }

    if (
      currentLoc.y < trench.maxY - 1 &&
      !trench.map.has(encodeLocation(right)) &&
      !filled.has(encodeLocation(right))
    ) {
      stack.push(right);
    }
  }
  return filled;
};

export const dfsFloodFill = (
  trench: TrenchMap,
  startingLocation: Location
): Set<string> => {
  throw new Error("Deprecated, DFS utilizes too much of the call stack");
  const filled = new Set<string>();
  // const visited = new Set<string>();
  dfsFloodFillUtil(startingLocation, filled, trench, 0);
  return filled;
};

const dfsFloodFillUtil = (
  loc: Location,
  filled: Set<string>,
  trench: TrenchMap,
  level: number
) => {
  console.log(level);

  // Fill Loc
  filled.add(encodeLocation(loc));

  // Get neighbors
  //   const neighbors = [];
  const up = travelDirection(loc, "U"),
    down = travelDirection(loc, "D"),
    left = travelDirection(loc, "L"),
    right = travelDirection(loc, "R");
  if (
    loc.y > trench.minY &&
    !trench.map.has(encodeLocation(up)) &&
    !filled.has(encodeLocation(up))
  ) {
    dfsFloodFillUtil(up, filled, trench, level + 1);
  }

  if (
    loc.y < trench.maxY - 1 &&
    !trench.map.has(encodeLocation(down)) &&
    !filled.has(encodeLocation(down))
  ) {
    dfsFloodFillUtil(down, filled, trench, level + 1);
  }

  if (
    loc.x > trench.minX &&
    !trench.map.has(encodeLocation(left)) &&
    !filled.has(encodeLocation(left))
  ) {
    dfsFloodFillUtil(left, filled, trench, level + 1);
  }

  if (
    loc.y < trench.maxY - 1 &&
    !trench.map.has(encodeLocation(right)) &&
    !filled.has(encodeLocation(right))
  ) {
    dfsFloodFillUtil(right, filled, trench, level + 1);
  }
};

export function gcd(a: number, b: number) {
  for (let temp = b; b !== 0; ) {
    b = a % b;
    a = temp;
    temp = b;
  }
  return a;
}

export function lcm(a: number, b: number) {
  const gcdValue = gcd(a, b);
  return (a * b) / gcdValue;
}
