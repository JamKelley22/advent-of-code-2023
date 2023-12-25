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

export type Location3D = {
  x: number;
  y: number;
  z: number;
};
export const encodeLocation3D = (loc: Location3D): string =>
  `[${loc.x},${loc.y},${loc.z}]`;
export const decodeLocation3D = (locStr: string): Location3D => {
  const [x, y, z] = locStr
    .slice(1, locStr.length - 1)
    .split(",")
    .map((coordStr) => parseInt(coordStr));
  return { x, y, z };
};

export const Directions3D = [
  "Right",
  "Left",
  "Forward",
  "Backwards",
  "Up",
  "Down",
] as const;
type Direction3D = (typeof Directions3D)[number];

export const travelDirection3D = (
  currentLocation: Location3D,
  direction: Direction3D
): Location3D => {
  let { x, y, z } = currentLocation;
  switch (direction) {
    case "Down":
      return { x, y, z: z + 1 };
    case "Up":
      return { x, y, z: z + 1 };
    case "Left":
    //   return { x, y, z };
    case "Right":
    //   return { x, y, z };
    case "Forward":
    //   return { x, y, z };
    case "Backwards":
      //   return { x, y, z };
      throw new Error(`Travel Direction 3D: ${direction} not implemented`);
  }
};

export class Brick {
  x1: number;
  y1: number;
  z1: number;
  x2: number;
  y2: number;
  z2: number;
  length: number;
  width: number;
  height: number;
  label: string;

  constructor(data: {
    x1: number;
    y1: number;
    z1: number;
    x2: number;
    y2: number;
    z2: number;
    label: string;
  }) {
    this.x1 = data.x1;
    this.y1 = data.y1;
    this.z1 = data.z1;
    this.x2 = data.x2;
    this.y2 = data.y2;
    this.z2 = data.z2;
    this.label = data.label;
    this.length = data.x2 - data.x1 + 1;
    this.width = data.y2 - data.y1 + 1;
    this.height = data.z2 - data.z1 + 1;
  }
}

export type Snapshot = {
  bricks: Brick[];
  maxWidth: number;
  maxLength: number;
  maxHeight: number;
};

export const parseBrickLine = (line: string, label: string): Brick => {
  const [left, right] = line.split("~");
  const [x1, y1, z1] = left.split(",").map((numStr) => parseInt(numStr));
  const [x2, y2, z2] = right.split(",").map((numStr) => parseInt(numStr));
  //prettier-ignore
  return new Brick({
          x1,y1,z1,
          x2,y2,z2,
          label
      })
};

export const parseSnapshot = (input: string): Snapshot => {
  const lines = input.split("\n");
  const bricks = lines.map((line, lineIndex) =>
    parseBrickLine(line, String.fromCharCode("A".charCodeAt(0) + lineIndex))
  );
  const { maxWidth, maxLength, maxHeight } = bricks.reduce(
    (acc, brick) => {
      let newMaxLength = acc.maxLength,
        newMaxWidth = acc.maxWidth,
        newMaxHeight = acc.maxHeight;
      //X=Length,Y=Width,Z=Height
      if (brick.x2 > acc.maxLength) {
        newMaxLength = brick.x2;
      }
      if (brick.y2 > acc.maxWidth) {
        newMaxWidth = brick.y2;
      }
      if (brick.z2 > acc.maxHeight) {
        newMaxHeight = brick.z2;
      }
      return {
        maxLength: newMaxLength,
        maxWidth: newMaxWidth,
        maxHeight: newMaxHeight,
      };
    },
    {
      maxWidth: 0,
      maxLength: 0,
      maxHeight: 0,
    }
  );
  return { bricks, maxWidth, maxLength, maxHeight };
};
