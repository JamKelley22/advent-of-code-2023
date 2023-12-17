export const Tiles = [".", "\\", "/", "|", "-"] as const;
export type TileType = (typeof Tiles)[number];

export function isOfTypeTile(keyInput: string): keyInput is TileType {
  return Tiles.includes(keyInput as TileType);
}

export const encodeLocation = (loc: Location): string => `[${loc.i},${loc.j}]`;
export const decodeLocation = (loc: string): Location => {
  const [i, j] = loc
    .slice(1, loc.length - 1)
    .split(",")
    .map((numStr) => parseInt(numStr));
  return { i, j };
};
export const encodeVelocity = (vel: Velocity): string => `[${vel.i},${vel.j}]`;
export const decodeVelocity = (vel: string): Velocity => {
  const [i, j] = vel
    .slice(1, vel.length - 1)
    .split(",")
    .map((numStr) => parseInt(numStr));
  if (i !== -1 && i !== 0 && i !== 1) {
    throw new Error(`Invalid velocity in \"i\" when decoding velocity: ${vel}`);
  }
  if (j !== -1 && j !== 0 && j !== 1) {
    throw new Error(`Invalid velocity in \"j\" when decoding velocity: ${vel}`);
  }
  return { i, j };
};

export type Location = {
  i: number;
  j: number;
};
export type Velocity = {
  i: -1 | 1 | 0;
  j: -1 | 1 | 0;
};

export type Direction = "North" | "South" | "East" | "West";
export const VelocityDirection: {
  [key in Direction]: Velocity;
} = {
  North: { i: -1, j: 0 },
  South: { i: 1, j: 0 },
  East: { i: 0, j: 1 },
  West: { i: 0, j: -1 },
} as const;

export type Simulation = {
  steps: SimulationStep[];
  tileMap: Map<string, TileType>;
  width: number;
  height: number;
};

export type Beam = {
  location: Location;
  velocity: Velocity;
};

export type SimulationStep = {
  energizedTiles: Set<string>;
  beams: Beam[];
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const directionChangeMap = new Map<
  Omit<".", TileType>,
  Map<string, string[]>
>([
  [
    "|",
    //prettier-ignore
    new Map<string, string[]>([
        [encodeVelocity(VelocityDirection.North), [encodeVelocity(VelocityDirection.North)]],
        [encodeVelocity(VelocityDirection.East), [encodeVelocity(VelocityDirection.North), encodeVelocity(VelocityDirection.South)]],
        [encodeVelocity(VelocityDirection.South), [encodeVelocity(VelocityDirection.South)]],
        [encodeVelocity(VelocityDirection.West), [encodeVelocity(VelocityDirection.North), encodeVelocity(VelocityDirection.South)]],
    ]),
  ],
  [
    "\\",
    //prettier-ignore
    new Map<string, string[]>([
        [encodeVelocity(VelocityDirection.North), [encodeVelocity(VelocityDirection.West)]],
        [encodeVelocity(VelocityDirection.East), [encodeVelocity(VelocityDirection.South)]],
        [encodeVelocity(VelocityDirection.South), [encodeVelocity(VelocityDirection.East)]],
        [encodeVelocity(VelocityDirection.West), [encodeVelocity(VelocityDirection.North)]],
    ]),
  ],
  [
    "/",
    //prettier-ignore
    new Map<string, string[]>([
      [encodeVelocity(VelocityDirection.North), [encodeVelocity(VelocityDirection.East)]],
      [encodeVelocity(VelocityDirection.East), [encodeVelocity(VelocityDirection.North)]],
      [encodeVelocity(VelocityDirection.South), [encodeVelocity(VelocityDirection.West)]],
      [encodeVelocity(VelocityDirection.West), [encodeVelocity(VelocityDirection.South)]],
    ]),
  ],
  [
    "-",
    //prettier-ignore
    new Map<string, string[]>([
      [encodeVelocity(VelocityDirection.North), [encodeVelocity(VelocityDirection.East), encodeVelocity(VelocityDirection.West)]],
      [encodeVelocity(VelocityDirection.East), [encodeVelocity(VelocityDirection.East)]],
      [encodeVelocity(VelocityDirection.South), [encodeVelocity(VelocityDirection.East), encodeVelocity(VelocityDirection.West)]],
      [encodeVelocity(VelocityDirection.West), [encodeVelocity(VelocityDirection.West)]],
    ]),
  ],
]);
