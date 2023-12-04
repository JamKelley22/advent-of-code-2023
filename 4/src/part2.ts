var fs = require("fs");

export const parseCard = (line: string): Card => {
  const [cardMetadata, cardInfo] = line.split(":");
  const cardNum = parseInt(cardMetadata.slice(5));
  const [cardStrNumbers, winningStrNumbers] = cardInfo.split("|");

  return {
    cardNum,
    cardNumbers: cardStrNumbers
      .split(" ")
      .map((cardStrNum) => parseInt(cardStrNum))
      .filter((num) => num),
    winningNumbers: winningStrNumbers
      .split(" ")
      .map((winningStrNum) => parseInt(winningStrNum))
      .filter((num) => num),
  };
};

type Card = {
  cardNum: number;
  cardNumbers: number[];
  winningNumbers: number[];
};

export const calculatePointsAndMatchesFromCard = (
  card: Card
): {
  points: number;
  matches: number;
} => {
  return card.winningNumbers.reduce(
    (acc, winningNumber) => {
      const matchingWinningNumber = card.cardNumbers.findIndex(
        (cardNum) => cardNum === winningNumber
      );
      if (matchingWinningNumber !== -1)
        return {
          points: Math.pow(2, acc.matches),
          matches: acc.matches + 1,
        };
      return acc;
    },
    {
      points: 0,
      matches: 0,
    }
  );
};

export const calculateNumberOfCopies = (
  cards: Card[],
  card: Card,
  storedCopyNumMap?: Map<number, number>
): number => {
  const storedValue = storedCopyNumMap?.get(card.cardNum);
  if (storedValue) return storedValue;

  const result = calculatePointsAndMatchesFromCard(card);

  const cardsToDoWorkOn = cards.slice(
    card?.cardNum,
    Math.min(result.matches + card?.cardNum, cards.length)
  );

  if (cardsToDoWorkOn.length === 0) return 1;

  const cardValue =
    cardsToDoWorkOn.reduce(
      (acc, cardToDoWorkOn) =>
        acc + calculateNumberOfCopies(cards, cardToDoWorkOn, storedCopyNumMap),
      0
    ) + 1;
  storedCopyNumMap?.set(card.cardNum, cardValue);

  //   console.log(
  //     `CardNum: ${
  //       card.cardNum
  //     } cardValue:${cardValue} CardsToDoWorkOn: ${cardsToDoWorkOn.map(
  //       (card) => card.cardNum
  //     )} `
  //   );
  return cardValue;
};

try {
  const useExample = false;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  const lines: string[] = input.split("\n");

  const cards = lines.map((line) => {
    return parseCard(line);
  });

  const storedCopyNumMap = new Map<number, number>();

  var startTime = performance.now();

  const total = cards.reduce(
    (acc, card) =>
      acc +
      calculateNumberOfCopies(cards, cards[card.cardNum - 1], storedCopyNumMap),
    0
  );

  var endTime = performance.now();

  console.log(`Took ${endTime - startTime} milliseconds`);

  console.log(total);
} catch (e: any) {
  console.log("Error:", e.stack);
}
