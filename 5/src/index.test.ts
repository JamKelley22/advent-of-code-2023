import { describe, expect, test } from "@jest/globals";
import {
  createMapIntervalTree,
  createSeedIntervalTree,
  removeRangeFromX,
} from "./engine";

describe("part1", () => {
  test("calculates example line 1", () => {
    expect(1 + 1).toBe(2);
  });
});

describe("part2", () => {
  // test("Creates seed interval tree 1", () => {
  //   // Arrange
  //   const seedLine = "seeds: 79 14 55 13";
  //   // Act
  //   const res = createSeedIntervalTree(seedLine);
  //   // Assert
  //   expect(res.keys).toEqual([
  //     [55, 68],
  //     [79, 93],
  //   ]);
  // });

  // test("createMapIntervalTree 1", () => {
  //   // Arrange
  //   const input = `50 98 2
  //   52 50 48`;
  //   const lines = input.split("\n").map((line) => line.trim());
  //   // Act
  //   const res = createMapIntervalTree(lines);
  //   // Assert
  //   expect(res.treeSource.keys).toEqual([
  //     [50, 52],
  //     [52, 100],
  //   ]);
  //   expect(res.treeDest.keys).toEqual([
  //     [50, 98],
  //     [98, 100],
  //   ]);
  // });

  test("removeRangeFromX 1", () => {
    // Arrange
    const input = [
      { min: BigInt(0), max: BigInt(10) },
      { min: BigInt(8), max: BigInt(12) },
    ];
    // Act
    const croppedRange = removeRangeFromX(
      input[0].min,
      input[0].max,
      input[1].min,
      input[1].max
    );
    // Assert
    expect(croppedRange).toEqual([{ min: BigInt(0), max: BigInt(8) }]);
  });
});
