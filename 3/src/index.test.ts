import { describe, expect, test } from "@jest/globals";
import {
  findValidNumbers,
  parseNumberIndexPairsInLine,
  searchAll,
} from "./part1";
import { isNumber, isSymbolExcludePeriod } from "./engine";

describe("part1", () => {
  //   test("finds valid numbers 1", () => {
  //     //Arrange
  //     const input = `\
  //     467..114..
  //     ...*......
  //     ..35..633.
  //     ......#...
  //     617*......
  //     .....+.58.
  //     ..592.....
  //     ......755.
  //     ...$.*....
  //     .664.598..`;
  //     const validNumbers = [467, 35, 633, 617, 592, 755, 664, 598];
  //     const lines: string[] = input.split("\n");
  //     //Act
  //     const testValidNumbers = findValidNumbers(lines);
  //     //Assert
  //     expect(testValidNumbers.numAddArray.sort()).toEqual(validNumbers.sort());
  //   });

  //   test("finds valid numbers 2", () => {
  //     //Arrange
  //     const input = `\
  //     467++114..`;
  //     const validNumbers = [467, 114];
  //     const lines: string[] = input.split("\n");
  //     //Act
  //     const testValidNumbers = findValidNumbers(lines);
  //     //Assert
  //     expect(testValidNumbers.numAddArray.sort()).toEqual(validNumbers.sort());
  //   });
  //   test("finds valid numbers 3", () => {
  //     //Arrange
  //     const input = `\
  //     467+.114+.`;
  //     const validNumbers = [467, 114];
  //     const lines: string[] = input.split("\n");
  //     //Act
  //     const testValidNumbers = findValidNumbers(lines);
  //     //Assert
  //     expect(testValidNumbers.numAddArray.sort()).toEqual(validNumbers.sort());
  //   });
  //   test("finds valid numbers 4", () => {
  //     //Arrange
  //     const input = `\
  //     ..*...*...
  //     ...555....
  //     ..*...*...`;
  //     const validNumbers = [555];
  //     const lines: string[] = input.split("\n");
  //     //Act
  //     const testValidNumbers = findValidNumbers(lines);
  //     //Assert
  //     expect(testValidNumbers.numAddArray.sort()).toEqual(validNumbers.sort());
  //   });
  //   test("finds valid numbers 5", () => {
  //     //Arrange
  //     const input = `\
  //     ..*****...
  //     .*.....*..
  //     .*.555.*..
  //     .*.....*..
  //     ..*****...`;
  //     const validNumbers = [] as number[];
  //     const lines: string[] = input.split("\n");
  //     //Act
  //     const testValidNumbers = findValidNumbers(lines);
  //     //Assert
  //     expect(testValidNumbers.numAddArray.sort()).toEqual(validNumbers.sort());
  //   });
  //   test("finds valid numbers 6", () => {
  //     //Arrange
  //     const input = `\
  //     ..........
  //     555*666...
  //     ..........`;
  //     const validNumbers = [555, 666] as number[];
  //     const lines: string[] = input.split("\n");
  //     //Act
  //     const testValidNumbers = findValidNumbers(lines);
  //     //Assert
  //     expect(testValidNumbers.numAddArray.sort()).toEqual(validNumbers.sort());
  //   });
  //   test("finds valid numbers 7", () => {
  //     //Arrange
  //     const input = `\
  //     .......%.......*.2....878..793.97..143.413.&856......329*...*...732......878./.........191...............*..........+..............584......
  // `;
  //     const validNumbers = [856, 329] as number[];
  //     const lines: string[] = input.split("\n");
  //     //Act
  //     const testValidNumbers = findValidNumbers(lines);
  //     //Assert
  //     expect(testValidNumbers.numAddArray.sort()).toEqual(validNumbers.sort());
  //   });
  //   test("finds valid numbers 8", () => {
  //     //Arrange
  //     const input = `\
  //     ..-..70......./24..*
  // `;
  //     const validNumbers = [24] as number[];
  //     const lines: string[] = input.split("\n");
  //     //Act
  //     const testValidNumbers = findValidNumbers(lines);
  //     //Assert
  //     expect(testValidNumbers.numAddArray.sort()).toEqual(validNumbers.sort());
  //   });
  //   test("finds valid numbers 9", () => {
  //     //Arrange
  //     const input = `\
  //     ..*
  //     .4.
  //     ...`;
  //     const validNumbers = [4] as number[];
  //     const lines: string[] = input.split("\n");
  //     //Act
  //     const testValidNumbers = findValidNumbers(lines);
  //     //Assert
  //     expect(testValidNumbers.numAddArray.sort()).toEqual(validNumbers.sort());
  //   });
  //   test("finds valid numbers 10", () => {
  //     //Arrange
  //     const input = `\
  //     +582...../..333.............@..224............%....4*....*.....399........883..#859.........*341...........583*40.......366.951......170*814.`;
  //     const validNumbers = [582, 4, 859, 341, 583, 40, 170, 814] as number[];
  //     const lines: string[] = input.split("\n");
  //     //Act
  //     const testValidNumbers = findValidNumbers(lines);
  //     //Assert
  //     expect(testValidNumbers.numAddArray.sort()).toEqual(validNumbers.sort());
  //   });
  //   test("finds valid numbers 11", () => {
  //     //Arrange
  //     const input = `+582....224...%....4*...`;
  //     const validNumbers = [582, 4] as number[];
  //     const lines: string[] = input.split("\n");
  //     //Act
  //     const testValidNumbers = findValidNumbers(lines);
  //     //Assert
  //     expect(testValidNumbers.numAddArray.sort()).toEqual(validNumbers.sort());
  //   });

  //   test("parseNumberIndexPairsInLine 1", () => {
  //     //Arrange
  //     const input = `\
  //     582...../..333.............@..224............%....4*....*.....399........883..#859.........*341...........583*40.......366.951......170*814.`;
  //     const correctNumbers = [
  //       582, 333, 224, 4, 399, 883, 859, 341, 583, 40, 366, 951, 170, 814,
  //     ] as number[];
  //     const lines: string[] = input.split("\n");
  //     const regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/g;
  //     //Act
  //     const testValidNumbers = parseNumberIndexPairsInLine(lines[0], regex).map(
  //       (elem) => elem.number
  //     );
  //     //Assert
  //     expect(testValidNumbers.sort()).toEqual(correctNumbers.sort());
  //   });
  //   test("parseNumberIndexPairsInLine 2", () => {
  //     //Arrange
  //     const input = `+582....224...%....4*...`;
  //     const correctNumbers = [582, 224, 4] as number[];
  //     const lines: string[] = input.split("\n");
  //     const regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/g;
  //     //Act
  //     const testValidNumbers = parseNumberIndexPairsInLine(lines[0], regex).map(
  //       (elem) => elem.number
  //     );
  //     //Assert
  //     expect(testValidNumbers.sort()).toEqual(correctNumbers.sort());
  //   });

  //   test("searchAll 1", () => {
  //     //Arrange
  //     const input = `+582....224...%....4*...`;
  //     const symbolIndexes = [0, 14, 20] as number[];
  //     const lines: string[] = input.split("\n");
  //     const regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/g;
  //     //Act
  //     const symbolIndexesInLine = searchAll(lines[0], regex);
  //     console.log(444, symbolIndexesInLine);

  //     //Assert
  //     expect(symbolIndexesInLine.sort()).toEqual(symbolIndexes.sort());
  //   });
  test("isNumber: 0-9 are numbers", () => {
    //Arrange
    const isNumberValue = true;
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    //Act
    numbers.forEach((number) => {
      const testIsNumber = isNumber(number);
      //Assert
      expect(testIsNumber).toBe(isNumberValue);
    });
  });
  test("isNumber: symbols are not numbers", () => {
    //Arrange
    const isNumberValue = false;
    //prettier-ignore
    const numbers = [".", "*", "#", "+", "$", "\\", "%", "@", "(", ")", "-", "[", "]", "=", "?", "<", ">", "."];
    //Act
    numbers.forEach((number) => {
      const testIsNumber = isNumber(number);
      //Assert
      expect(testIsNumber).toBe(isNumberValue);
    });
  });
  test("isSymbolExcludePeriod: symbols are symbols", () => {
    //Arrange
    const isSymbolValue = true;
    //prettier-ignore
    const symbols = ["*", "#", "+", "$", "\\", "%", "@", "(", ")", "-", "[", "]", "=", "?", "<", ">"];
    //Act
    symbols.forEach((symbol) => {
      const testIsSymbol = isSymbolExcludePeriod(symbol);
      //Assert
      expect(testIsSymbol).toBe(isSymbolValue);
    });
  });
  test("isSymbolExcludePeriod: numbers and . are not symbols", () => {
    //Arrange
    const isSymbolValue = false;
    //prettier-ignore
    const symbols = [".", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    //Act
    symbols.forEach((symbol) => {
      const testIsSymbol = isSymbolExcludePeriod(symbol);
      //Assert
      expect(testIsSymbol).toBe(isSymbolValue);
    });
  });
});

describe("part2", () => {
  test("calculates example line 1", () => {
    expect(1 + 1).toBe(2);
  });
});
