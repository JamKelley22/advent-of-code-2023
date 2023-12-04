var fs = require("fs");

export const parseCard = (
  line: string
): { cardNum: number; cardNumbers: number[]; winningNumbers: number[] } => {
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

try {
  const useExample = false;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  const lines: string[] = input.split("\n");

  const cardsResults = lines.map((line) => {
    if (!line) return;

    const card = parseCard(line);
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
  });

  console.log(cardsResults);

  const totalPoints = cardsResults.reduce(
    (acc, cardResult) => acc + (cardResult?.points || 0),
    0
  );
  console.log(totalPoints);
} catch (e: any) {
  console.log("Error:", e.stack);
}
