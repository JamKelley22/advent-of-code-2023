import { describe, expect, test } from "@jest/globals";
import { parseBrickLine } from "./engine";

describe("part1", () => {
  test("Parses Brick line 1", () => {
    const brickLine = "2,2,2~2,2,2";
    const testBrick = parseBrickLine(brickLine);
    expect(testBrick.length).toBe(1);
    expect(testBrick.width).toBe(1);
    expect(testBrick.height).toBe(1);
  });
  test("Parses Brick line 2", () => {
    const brickLine = "0,0,10~1,0,10";
    const testBrick = parseBrickLine(brickLine);
    expect(testBrick.length).toBe(2);
    expect(testBrick.width).toBe(1);
    expect(testBrick.height).toBe(1);
  });
  test("Parses Brick line 3", () => {
    const brickLine = "0,0,10~0,1,10";
    const testBrick = parseBrickLine(brickLine);
    expect(testBrick.length).toBe(1);
    expect(testBrick.width).toBe(2);
    expect(testBrick.height).toBe(1);
  });
  test("Parses Brick line 4", () => {
    const brickLine = "0,0,1~0,0,10";
    const testBrick = parseBrickLine(brickLine);
    expect(testBrick.length).toBe(1);
    expect(testBrick.width).toBe(1);
    expect(testBrick.height).toBe(10);
  });
});

describe("part2", () => {});
