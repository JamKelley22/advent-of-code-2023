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

export const doWork = (cards: Card[], card: Card): number => {
  //   console.log(card.cardNum);

  // Stop Condition
  const result = calculatePointsAndMatchesFromCard(card);
  //   console.log(card.cardNum, result);

  //   if (result.matches === 0) {
  //     return 1;
  //   }

  const cardsToDoWorkOn = cards.slice(
    card?.cardNum,
    Math.min(result.matches + card?.cardNum, cards.length)
  );

  if (cardsToDoWorkOn.length === 0) return 1;

  const cardValue =
    cardsToDoWorkOn.reduce(
      (acc, cardToDoWorkOn) => acc + doWork(cards, cardToDoWorkOn),
      0
    ) + 1;

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

  //   let total = 0;
  //   for (let index = 0; index < cards.length; index++) {
  //     const card = cards[index];
  //     total += doWork(cards, card);
  //   }

  //   total += cards.length;
  //   console.log(total);

  const total = cards.reduce(
    (acc, card) => acc + doWork(cards, cards[card.cardNum - 1]),
    0
  );
  console.log(total);

  //   console.log(doWork(cards, cards[1 - 1]));

  //   const cardsToProcess = cards;
  //   let totalCardsProcessed = cards.length;

  //   for (let index = 0; cardsToProcess.length > 0; index++) {
  //     // console.log(index);

  //     const card = cardsToProcess.shift();
  //     // console.log(card);

  //     if (!card) continue;
  //     const result = calculatePointsAndMatchesFromCard(card);
  //     const earnedCopiedCards = cards.slice(
  //       card?.cardNum - 1,
  //       Math.min(result.matches + card?.cardNum - 1, cards.length)
  //     );

  //     console.log(
  //       card.cardNum,
  //       earnedCopiedCards.map((card) => card.cardNum)
  //     );
  //     // cardsToProcess.push(...earnedCopiedCards);
  //     totalCardsProcessed += earnedCopiedCards.length;
  //   }

  //   cardsToProcess.forEach((card, i, arr) => {});

  //   //   const cardsResults = copiedCardsWon.reduce(
  //   //     (acc, card) => {
  //   //       const pointsAndMatches = calculatePointsAndMatchesFromCard(card);
  //   //       return [...acc, pointsAndMatches];
  //   //     },
  //   //     [] as {
  //   //       points: number;
  //   //       matches: number;
  //   //     }[]
  //   //   );
  //   console.log(totalCardsProcessed);
} catch (e: any) {
  console.log("Error:", e.stack);
}
