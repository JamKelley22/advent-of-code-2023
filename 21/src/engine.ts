export const Tiles = ["#", ".", "S"] as const;
export type Tile = (typeof Tiles)[number];

export function isOfTypeTile(keyInput: string): keyInput is Tile {
  return Tiles.includes(keyInput as Tile);
}

export type Location = {
  x: number;
  y: number;
};

export type Garden = {
  map: Map<string, Tile>;
  startingLocation: Location;
  width: number;
  height: number;
};

export type TileLocation = { tile: Tile; location: Location };

export const encodeLocation = (loc: Location): string => `[${loc.x},${loc.y}]`;
export const decodeLocation = (locStr: string): Location => {
  const [x, y] = locStr
    .slice(1, locStr.length - 1)
    .split(",")
    .map((coordStr) => parseInt(coordStr));
  return { x, y };
};

export const getGardenTile = (
  garden: Garden,
  location: Location,
  looping?: boolean
): Tile | undefined => {
  let tile = garden.map.get(
    encodeLocation({
      x: garden.width + (location.x % garden.width),
      y: garden.height + (location.y % garden.height),
    })
  );
  //   if (locationEquals(location, { x: 0, y: 0 })) {
  //     console.log({ location, tile });
  //     console.log(
  //       garden.width + (location.x % garden.width),
  //       garden.height + (location.y % garden.height),
  //       encodeLocation({
  //         x: garden.width + (location.x % garden.width),
  //         y: garden.height + (location.y % garden.height),
  //       })
  //     );
  //   }

  //   if (location.x < 0 || location.y < 0) {
  //     tile = garden.map.get(
  //       encodeLocation({
  //         x: garden.width + (location.x % garden.width),
  //         y: garden.height + (location.y % garden.height),
  //       })
  //     );
  //   }
  if (location.x >= 0 && location.y < 0) {
    tile = "#";
  }
  if (location.y >= 0 && location.x < 0) {
    tile = "#";
  }
  //if (location.x < 0 || location.y < 0) {
  // let loc: Location = { x: location.x, y: location.y };
  // if (location.x < 0 && location.y < 0) {
  //   tile = garden.map.get(
  //     encodeLocation({
  //       x: garden.width + location.x,
  //       y: garden.height + location.y,
  //     })
  //   );
  // }
  // else if (location.x < 0) {
  //   tile = garden.map.get(
  //     encodeLocation({
  //       x: garden.width + location.x,
  //       y: location.y,
  //     })
  //   );
  // } else if (location.y < 0) {
  //   tile = garden.map.get(
  //     encodeLocation({
  //       x: location.x,
  //       y: garden.height + location.y,
  //     })
  //   );
  // }

  // console.log(
  //   { location },
  //   encodeLocation({
  //     x: location.x % garden.width,
  //     y: location.y % garden.height,
  //   })
  // );
  //}
  //   if (!tile)
  //     throw new Error(
  //       `Freaky, tile not found: ${encodeLocation({
  //         x: location.x % garden.width,
  //         y: location.y % garden.height,
  //       })}`
  //     );
  if (tile === "S" && !locationEquals(location, garden.startingLocation)) {
    tile = ".";
  }
  //   if (!tile && location.x < 0 && location.y < 0) {
  //     console.log(
  //       { location },
  //       encodeLocation({
  //         x: garden.width + (location.x % garden.width),
  //         y: garden.height + (location.y % garden.height),
  //       })
  //     );
  //   }
  return tile;
};

export const getNeighbors = (
  garden: Garden,
  location: Location
): TileLocation[] => {
  return [
    { x: location.x, y: location.y - 1 }, //North
    { x: location.x + 1, y: location.y }, //East
    { x: location.x, y: location.y + 1 }, //South
    { x: location.x - 1, y: location.y }, //West
  ].reduce((acc, location) => {
    const neighbor = getGardenTile(garden, location);
    if (neighbor && (neighbor === "." || neighbor === "S"))
      return [...acc, { tile: neighbor, location: location }];
    return acc;
  }, [] as TileLocation[]);
};

export const locationEquals = (l1: Location, l2: Location): boolean =>
  l1.x === l2.x && l1.y === l2.y;
