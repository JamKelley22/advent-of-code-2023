import { describe, expect, test } from "@jest/globals";
import { findValidNumbers } from "./part1";

describe("part1", () => {
  test("finds valid numbers 1", () => {
    //Arrange
    const input = `\
    467..114..
    ...*......
    ..35..633.
    ......#...
    617*......
    .....+.58.
    ..592.....
    ......755.
    ...$.*....
    .664.598..`;
    const validNumbers = [467, 35, 633, 617, 592, 755, 664, 598];
    const lines: string[] = input.split("\n");
    //Act
    const testValidNumbers = findValidNumbers(lines);
    //Assert
    expect(testValidNumbers.sort()).toEqual(validNumbers.sort());
  });

  test("finds valid numbers 2", () => {
    //Arrange
    const input = `\
    467++114..`;
    const validNumbers = [467, 114];
    const lines: string[] = input.split("\n");
    //Act
    const testValidNumbers = findValidNumbers(lines);
    //Assert
    expect(testValidNumbers.sort()).toEqual(validNumbers.sort());
  });
  test("finds valid numbers 3", () => {
    //Arrange
    const input = `\
    467+.114+.`;
    const validNumbers = [467, 114];
    const lines: string[] = input.split("\n");
    //Act
    const testValidNumbers = findValidNumbers(lines);
    //Assert
    expect(testValidNumbers.sort()).toEqual(validNumbers.sort());
  });
  test("finds valid numbers 4", () => {
    //Arrange
    const input = `\
    ..*...*...
    ...555....
    ..*...*...`;
    const validNumbers = [555];
    const lines: string[] = input.split("\n");
    //Act
    const testValidNumbers = findValidNumbers(lines);
    //Assert
    expect(testValidNumbers.sort()).toEqual(validNumbers.sort());
  });
  test("finds valid numbers 5", () => {
    //Arrange
    const input = `\
    ..*****...
    .*.....*..
    .*.555.*..
    .*.....*..
    ..*****...`;
    const validNumbers = [] as number[];
    const lines: string[] = input.split("\n");
    //Act
    const testValidNumbers = findValidNumbers(lines);
    //Assert
    expect(testValidNumbers.sort()).toEqual(validNumbers.sort());
  });
  test("finds valid numbers 6", () => {
    //Arrange
    const input = `\
    ..........
    555*666...
    ..........`;
    const validNumbers = [555, 666] as number[];
    const lines: string[] = input.split("\n");
    //Act
    const testValidNumbers = findValidNumbers(lines);
    //Assert
    expect(testValidNumbers.sort()).toEqual(validNumbers.sort());
  });
  test("finds valid numbers 7", () => {
    //Arrange
    const input = `\
    .......%.......*.2....878..793.97..143.413.&856......329*...*...732......878./.........191...............*..........+..............584......
`;
    const validNumbers = [856, 329] as number[];
    const lines: string[] = input.split("\n");
    //Act
    const testValidNumbers = findValidNumbers(lines);
    //Assert
    expect(testValidNumbers.sort()).toEqual(validNumbers.sort());
  });
  test("finds valid numbers 8", () => {
    //Arrange
    const input = `\
    ..-..70......./24..*
`;
    const validNumbers = [24] as number[];
    const lines: string[] = input.split("\n");
    //Act
    const testValidNumbers = findValidNumbers(lines);
    //Assert
    expect(testValidNumbers.sort()).toEqual(validNumbers.sort());
  });
});

describe("part2", () => {
  test("calculates example line 1", () => {
    expect(1 + 1).toBe(2);
  });
});
