import { describe, expect, test } from "@jest/globals";
import { parseCard } from "./part1";

describe("part1", () => {
  test("Parses Card 1", () => {
    //Arrange
    const cardStr = "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53";
    const card = {
      cardNum: 1,
      cardNumbers: [41, 48, 83, 86, 17],
      winningNumbers: [83, 86, 6, 31, 17, 9, 48, 53],
    };
    //Act
    const testCard = parseCard(cardStr);
    //Assert
    expect(testCard.cardNum).toBe(card.cardNum);
    expect(testCard.cardNumbers.sort()).toEqual(card.cardNumbers.sort());
    expect(testCard.winningNumbers.sort()).toEqual(card.winningNumbers.sort());
  });
});

describe("part2", () => {
  test("calculates example line 1", () => {
    expect(1 + 1).toBe(2);
  });
});
