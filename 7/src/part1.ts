var fs = require("fs");
const util = require("util");

const cardToValue = new Map<string, number>([
  ["A", 14],
  ["K", 13],
  ["Q", 12],
  ["J", 11],
  ["T", 10],
  ["9", 9],
  ["8", 8],
  ["7", 7],
  ["6", 6],
  ["5", 5],
  ["4", 4],
  ["3", 3],
  ["2", 2],
]);

type Hand = {
  cards: number[];
  //   isFiveOfAKind: boolean;
  //   isFourOfAKind: boolean;
  //   isFullHouse: boolean;
  //   isThreeOfAKind: boolean;
  //   isTwoPair: boolean;
  //   isOnePair: boolean;
  //   isHighCard: boolean;
  strength: number;
};

export const parseHand = (handStr: string): Hand => {
  const cardMap = new Map<number, number>();

  const cards = handStr.split("").map((cardStr) => {
    const cardValue = cardToValue.get(cardStr) ?? -1;
    cardMap.set(cardValue, (cardMap.get(cardValue) ?? 0) + 1);
    return cardValue;
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

  let strength = 0;

  if (isFiveOfAKind) strength |= 0o1000000;
  if (isFourOfAKind) strength |= 0o0100000;
  if (isFullHouse) strength |= 0o0010000;
  if (isThreeOfAKind) strength |= 0o0001000;
  if (isTwoPair) strength |= 0o0000100;
  if (isOnePair) strength |= 0o0000010;
  if (isHighCard) strength |= 0o0000001;

  return {
    cards,
    strength,
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
  const useExample = true;
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
} catch (e: any) {
  console.log("Error:", e.stack);
}
