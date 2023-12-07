import { describe, expect, test } from "@jest/globals";
import { parseHand, Strength } from "./part2";

describe("part1", () => {
  test("parses five of a kind", () => {
    // Arrange
    const handStr = "AAAAA";
    //Act
    const handUnderTest = parseHand(handStr);
    console.log("handUnderTest", handUnderTest.strength, handUnderTest.cards);

    //Assert
    expect(handUnderTest.strength).toEqual(Strength.FiveOfAKind);
  });

  test("parses four of a kind", () => {
    // Arrange
    const handStr = "AA8AA";
    //Act
    const handUnderTest = parseHand(handStr);
    //Assert
    expect(handUnderTest.strength).toEqual(Strength.FourOfAKind);
  });

  test("parses full house", () => {
    // Arrange
    const handStr = "23332";
    //Act
    const handUnderTest = parseHand(handStr);
    //Assert
    expect(handUnderTest.strength).toEqual(Strength.FullHouse);
  });

  test("parses three of a kind", () => {
    // Arrange
    const handStr = "TTT98";
    //Act
    const handUnderTest = parseHand(handStr);
    //Assert
    expect(handUnderTest.strength).toEqual(Strength.ThreeOfAKind);
  });

  test("parses two pair", () => {
    // Arrange
    const handStr = "23432";
    //Act
    const handUnderTest = parseHand(handStr);
    //Assert
    expect(handUnderTest.strength).toEqual(Strength.TwoPair);
  });

  test("parses one pair", () => {
    // Arrange
    const handStr = "A23A4";
    //Act
    const handUnderTest = parseHand(handStr);
    //Assert
    expect(handUnderTest.strength).toEqual(Strength.OnePair);
  });

  test("parses high card", () => {
    // Arrange
    const handStr = "23456";
    //Act
    const handUnderTest = parseHand(handStr);
    //Assert
    expect(handUnderTest.strength).toEqual(Strength.HighCard);
  });

  test("High Card => One Pair", () => {
    // Arrange
    const handStr = "A247J";
    //Act
    const handUnderTest = parseHand(handStr, true);
    //Assert
    expect(handUnderTest.strength).toEqual(Strength.OnePair);
  });

  test("One Pair => Three of a Kind", () => {
    // Arrange
    const handStr = "KK24J";
    //Act
    const handUnderTest = parseHand(handStr, true);
    //Assert
    expect(handUnderTest.strength).toEqual(Strength.ThreeOfAKind);
  });

  test("Two Pairs => Full House 1", () => {
    // Arrange
    const handStr = "22JQQ";
    //Act
    const handUnderTest = parseHand(handStr, true);
    //Assert
    expect(handUnderTest.strength).toEqual(Strength.FullHouse);
    expect(handUnderTest.transformedCards).toEqual([2, 2, 12, 12, 12]);
  });

  test("Three of a Kind => Four of a Kind", () => {
    // Arrange
    const handStr = "AAAJ3";
    //Act
    const handUnderTest = parseHand(handStr, true);
    //Assert
    expect(handUnderTest.strength).toEqual(Strength.FourOfAKind);
  });

  test("Four of a Kind => Five of a Kind", () => {
    // Arrange
    const handStr = "AAAAJ";
    //Act
    const handUnderTest = parseHand(handStr, true);
    //Assert
    expect(handUnderTest.strength).toEqual(Strength.FiveOfAKind);
  });

  test("Five of a Kind => Five of a Kind 1", () => {
    // Arrange
    const handStr = "JJJJJ";
    //Act
    const handUnderTest = parseHand(handStr, true);
    //Assert
    expect(handUnderTest.strength).toEqual(Strength.FiveOfAKind);
    expect(handUnderTest.transformedCards).toEqual([14, 14, 14, 14, 14]);
  });

  test("Example 1", () => {
    // Arrange
    const handStr = "QJJQ2";
    //Act
    const handUnderTest = parseHand(handStr, true);
    //Assert
    expect(handUnderTest.strength).toEqual(Strength.FourOfAKind);
    expect(handUnderTest.transformedCards).toEqual([12, 12, 12, 12, 2]);
  });

  test("Example 2", () => {
    // Arrange
    const handStr = "JJJ2J";
    //Act
    const handUnderTest = parseHand(handStr, true);
    //Assert
    expect(handUnderTest.strength).toEqual(Strength.FiveOfAKind);
    expect(handUnderTest.transformedCards).toEqual([2, 2, 2, 2, 2]);
  });

  test("Example 3", () => {
    // Arrange
    const handStr = "JKJT7";
    //Act
    const handUnderTest = parseHand(handStr, true);
    //Assert
    expect(handUnderTest.strength).toEqual(Strength.ThreeOfAKind);
    expect(handUnderTest.transformedCards).toEqual([13, 13, 13, 10, 7]);
  });

  test("Example 4", () => {
    // Arrange
    const handStr = "7JJ77";
    //Act
    const handUnderTest = parseHand(handStr, true);
    //Assert
    expect(handUnderTest.strength).toEqual(Strength.FiveOfAKind);
    expect(handUnderTest.transformedCards).toEqual([7, 7, 7, 7, 7]);
  });

  test("Example 5", () => {
    // Arrange
    const handStr = "88J88";
    //Act
    const handUnderTest = parseHand(handStr, true);
    //Assert
    expect(handUnderTest.strength).toEqual(Strength.FiveOfAKind);
    expect(handUnderTest.transformedCards).toEqual([8, 8, 8, 8, 8]);
  });
  test("Example 6", () => {
    // Arrange
    const handStr = "2JJ5J";
    //Act
    const handUnderTest = parseHand(handStr, true);
    //Assert
    expect(handUnderTest.strength).toEqual(Strength.FourOfAKind);
    expect(handUnderTest.transformedCards).toEqual([2, 5, 5, 5, 5]);
  });
});

describe("part2", () => {
  // test("High Card => One Pair", () => {
  //   // Arrange
  //   const handStr = "A247J";
  //   //Act
  //   const handUnderTest = parseHand(handStr, true);
  //   //Assert
  //   expect(handUnderTest.strength).toEqual(Strength.OnePair);
  // });
  // test("One Pair => Three of a Kind", () => {
  //   // Arrange
  //   const handStr = "KK24J";
  //   //Act
  //   const handUnderTest = parseHand(handStr, true);
  //   //Assert
  //   expect(handUnderTest.strength).toEqual(Strength.ThreeOfAKind);
  // });
  // test("Two Pairs => Full House 1", () => {
  //   // Arrange
  //   const handStr = "22JQQ";
  //   //Act
  //   const handUnderTest = parseHand(handStr, true);
  //   const bruteForceJokerHandRes = bruteForceJokerHand(handUnderTest.cards);
  //   //Assert
  //   expect(bruteForceJokerHandRes.strength).toEqual(Strength.FullHouse);
  //   expect(bruteForceJokerHandRes.transformedCards).toEqual([2, 2, 12, 12, 12]);
  // });
  // test("Three of a Kind => Four of a Kind", () => {
  //   // Arrange
  //   const handStr = "AAAJ3";
  //   //Act
  //   const handUnderTest = parseHand(handStr, true);
  //   //Assert
  //   expect(handUnderTest.strength).toEqual(Strength.FourOfAKind);
  // });
  // test("Four of a Kind => Five of a Kind", () => {
  //   // Arrange
  //   const handStr = "AAAAJ";
  //   //Act
  //   const handUnderTest = parseHand(handStr, true);
  //   //Assert
  //   expect(handUnderTest.strength).toEqual(Strength.FiveOfAKind);
  // });
  // test("Five of a Kind => Five of a Kind 1", () => {
  //   // Arrange
  //   const handStr = "JJJJJ";
  //   //Act
  //   const handUnderTest = parseHand(handStr, true);
  //   //Assert
  //   expect(handUnderTest.strength).toEqual(Strength.FiveOfAKind);
  //   expect(handUnderTest.transformedCards).toEqual([14, 14, 14, 14, 14]);
  // });
  // test("Example 1", () => {
  //   // Arrange
  //   const handStr = "QJJQ2";
  //   //Act
  //   const handUnderTest = parseHand(handStr, true);
  //   //Assert
  //   expect(handUnderTest.strength).toEqual(Strength.FourOfAKind);
  //   expect(handUnderTest.transformedCards).toEqual([12, 12, 12, 12, 2]);
  // });
});
