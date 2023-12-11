import { describe, expect, test } from "@jest/globals";
import { Point, getDecodedCoordinates, getEncodedCoordinates } from "./engine";

describe("part1", () => {
  test("expand galaxy 1", () => {
    const galaxy = `\
    #..
    ...
    ..#
    `;

    // const expandedGalaxy = `\
    // #...
    // ....
    // ....
    // ...#
    // `;

    expect(1 + 1).toBe(2);
  });

  test("encode coords 1", () => {
    const x = 10,
      y = 12;
    const coords = `[${y},${x}]`;
    const encodedPoint = getEncodedCoordinates({ x, y });
    expect(encodedPoint).toEqual(coords);
  });
  test("decode coords 1", () => {
    const x = 10,
      y = 12;
    const coords = `[${y},${x}]`;
    const point: Point = {
      x,
      y,
    };
    const decodedCoords = getDecodedCoordinates(coords);
    expect(decodedCoords).toEqual(point);
  });
});

describe("part2", () => {
  test("calculates example line 1", () => {
    expect(1 + 1).toBe(2);
  });
});
