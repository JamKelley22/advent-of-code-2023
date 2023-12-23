export const Rocks = ["O", "#"] as const;
export type Rock = (typeof Rocks)[number];

export function isOfTypeRock(keyInput: string): keyInput is Rock {
  return Rocks.includes(keyInput as Rock);
}

export type Platform = {
  width: number;
  height: number;
  platformMap: Map<string, Rock>;
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
