import { describe, expect, test } from "@jest/globals";
import { parseHand } from "./part1";

describe("part1", () => {
  test("parses five of a kind", () => {
    // Arrange
    const handStr = "AAAAA";
    //Act
    const handUnderTest = parseHand(handStr);
    //Assert
    expect(handUnderTest.isFiveOfAKind).toBe(true);
  });

  test("parses four of a kind", () => {
    // Arrange
    const handStr = "AA8AA";
    //Act
    const handUnderTest = parseHand(handStr);
    //Assert
    expect(handUnderTest.isFiveOfAKind).toBe(false);
    expect(handUnderTest.isFourOfAKind).toBe(true);
  });

  test("parses full house", () => {
    // Arrange
    const handStr = "23332";
    //Act
    const handUnderTest = parseHand(handStr);
    //Assert
    expect(handUnderTest.isFiveOfAKind).toBe(false);
    expect(handUnderTest.isFourOfAKind).toBe(false);
    expect(handUnderTest.isFullHouse).toBe(true);
  });

  test("parses three of a kind", () => {
    // Arrange
    const handStr = "TTT98";
    //Act
    const handUnderTest = parseHand(handStr);
    //Assert
    expect(handUnderTest.isFiveOfAKind).toBe(false);
    expect(handUnderTest.isFourOfAKind).toBe(false);
    expect(handUnderTest.isFullHouse).toBe(false);
    expect(handUnderTest.isThreeOfAKind).toBe(true);
  });

  test("parses two pair", () => {
    // Arrange
    const handStr = "23432";
    //Act
    const handUnderTest = parseHand(handStr);
    //Assert
    expect(handUnderTest.isFiveOfAKind).toBe(false);
    expect(handUnderTest.isFourOfAKind).toBe(false);
    expect(handUnderTest.isFullHouse).toBe(false);
    expect(handUnderTest.isThreeOfAKind).toBe(false);
    expect(handUnderTest.isTwoPair).toBe(true);
  });

  test("parses one pair", () => {
    // Arrange
    const handStr = "A23A4";
    //Act
    const handUnderTest = parseHand(handStr);
    //Assert
    expect(handUnderTest.isFiveOfAKind).toBe(false);
    expect(handUnderTest.isFourOfAKind).toBe(false);
    expect(handUnderTest.isFullHouse).toBe(false);
    expect(handUnderTest.isThreeOfAKind).toBe(false);
    expect(handUnderTest.isTwoPair).toBe(false);
    expect(handUnderTest.isOnePair).toBe(true);
  });

  test("parses high card", () => {
    // Arrange
    const handStr = "23456";
    //Act
    const handUnderTest = parseHand(handStr);
    //Assert
    expect(handUnderTest.isFiveOfAKind).toBe(false);
    expect(handUnderTest.isFourOfAKind).toBe(false);
    expect(handUnderTest.isFullHouse).toBe(false);
    expect(handUnderTest.isThreeOfAKind).toBe(false);
    expect(handUnderTest.isTwoPair).toBe(false);
    expect(handUnderTest.isOnePair).toBe(false);
    expect(handUnderTest.isHighCard).toBe(true);
  });
});

describe("part2", () => {
  test("calculates example line 1", () => {
    expect(1 + 1).toBe(2);
  });
});
