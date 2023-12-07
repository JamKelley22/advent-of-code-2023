var fs = require("fs");
const util = require("util");

const cardToValue = new Map<string, number>([
  ["A", 14],
  ["K", 13],
  ["Q", 12],
  ["T", 10],
  ["9", 9],
  ["8", 8],
  ["7", 7],
  ["6", 6],
  ["5", 5],
  ["4", 4],
  ["3", 3],
  ["2", 2],
  ["J", 1],
]);

type Hand = {
  cards: number[];
  strength: number;
};

//prettier-ignore
export const Strength = {
  FiveOfAKind:  0o1000000,
  FourOfAKind:  0o0100000,
  FullHouse:    0o0010000,
  ThreeOfAKind: 0o0001000,
  TwoPair:      0o0000100,
  OnePair:      0o0000010,
  HighCard:     0o0000001,
} as const;

export const getHandStrength = (
  cards: number[]
): { strength: number; cardMap: Map<number, number> } => {
  const cardMap = new Map<number, number>();
  cards.forEach((cardValue) => {
    cardMap.set(cardValue, (cardMap.get(cardValue) ?? 0) + 1);
  });

  const isFiveOfAKind = cardMap.size === 1;
  const isFourOfAKind =
    isFiveOfAKind ||
    (cardMap.size === 2 &&
      [...cardMap].some(([cardValue, cardNum]) => cardNum === 4));
  const isFullHouse =
    cardMap.size === 2 &&
    [...cardMap].every(
      ([cardValue, cardNum]) => cardNum === 3 || cardNum === 2
    );
  const isThreeOfAKind =
    isFourOfAKind ||
    (cardMap.size === 3 &&
      [...cardMap].every(
        ([cardValue, cardNum]) => cardNum === 3 || cardNum === 1
      ));
  const isTwoPair =
    cardMap.size === 3 &&
    [...cardMap].every(
      ([cardValue, cardNum]) => cardNum === 2 || cardNum === 1
    );
  const isOnePair =
    cardMap.size === 4 &&
    [...cardMap].every(
      ([cardValue, cardNum]) => cardNum === 2 || cardNum === 1
    );
  const isHighCard = cardMap.size === 5;

  if (isFiveOfAKind) return { strength: Strength.FiveOfAKind, cardMap };
  if (isFourOfAKind) return { strength: Strength.FourOfAKind, cardMap };
  if (isFullHouse) return { strength: Strength.FullHouse, cardMap };
  if (isThreeOfAKind) return { strength: Strength.ThreeOfAKind, cardMap };
  if (isTwoPair) return { strength: Strength.TwoPair, cardMap };
  if (isOnePair) return { strength: Strength.OnePair, cardMap };
  if (isHighCard) return { strength: Strength.HighCard, cardMap };

  return { strength: -1, cardMap };
};

export const parseHand = (handStr: string): Hand => {
  const jokerValue = cardToValue.get("J") ?? -1;

  const cards = handStr.split("").map((cardStr) => {
    const cardValue = cardToValue.get(cardStr) ?? -1;

    return cardValue;
  });

  const { strength: handStrengthOG, cardMap } = getHandStrength(cards);
  let jokerTransformCardValue: number;

  // Transform Jokers into the best hand
  switch (handStrengthOG) {
    case Strength.FiveOfAKind:
    case Strength.FourOfAKind:
    case Strength.ThreeOfAKind: // Can become 4 of a kind so do that
    case Strength.HighCard: // Base case so always make a pair
      jokerTransformCardValue = cards.sort()[0]; // Grab the highest card
    case Strength.FullHouse:
      jokerTransformCardValue =
        [...cardMap].find(([cardValue, cardNum]) => cardNum === 3)?.[0] ?? -1; // Grab the card value of the 3 of a kind
    case Strength.TwoPair:
      jokerTransformCardValue = [...cardMap].reduce(
        (acc, [cardValue, cardNum]) => {
          // Find the card with a match of the greatest value
          if (cardNum !== 2) return acc;
          if (cardValue > acc) return cardValue;
          return acc;
        },
        -1
      );
    case Strength.OnePair:
      jokerTransformCardValue =
        [...cardMap].find(([cardValue, cardNum]) => cardNum === 2)?.[0] ?? -1; // Grab the card value of the pair
  }
  const transformedCards = cards.map((cardValue) => {
    if (cardValue === jokerValue) return jokerTransformCardValue;
    return cardValue;
  });
  const { strength: transformedHandStrength } =
    getHandStrength(transformedCards);
  return {
    cards,
    strength: transformedHandStrength,
  };
};

export const parseHandAndBid = (line: string): { hand: Hand; bid: number } => {
  const [handStr, bidStr] = line.split(" ");
  const bid = parseInt(bidStr);

  const hand = parseHand(handStr);

  return {
    hand,
    bid,
  };
};

try {
  const useExample = false;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  const lines: string[] = input.split("\n");

  const handsAndBids = lines.map((line) => parseHandAndBid(line));

  const sortedHandsAndBids = handsAndBids.sort((a, b) => {
    const deltaStrength = a.hand.strength - b.hand.strength;
    if (deltaStrength !== 0) {
      return deltaStrength;
    }
    //More difficult case where we have to check each card
    for (let cardIndex = 0; cardIndex < 5; cardIndex++) {
      const deltaCardStrength =
        a.hand.cards[cardIndex] - b.hand.cards[cardIndex];
      if (deltaCardStrength !== 0) return deltaCardStrength;
    }
    return 0;
  });

  const res = sortedHandsAndBids.reduce((acc, handAndBid, i) => {
    return acc + handAndBid.bid * (i + 1);
  }, 0);

  console.log(
    util.inspect(sortedHandsAndBids, false, null, true /* enable colors */)
  );

  console.log(res);

  // 249902881 is too low
} catch (e: any) {
  console.log("Error:", e.stack);
}
