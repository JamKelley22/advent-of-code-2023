var fs = require("fs");

try {
  const useExample = false;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  const lines = input.split("\n");

  const minColors = lines.map((line: string, i: number) => {
    //   console.log("Game", i + 1);

    const gameContent = line.split(":")[1];
    const rounds = gameContent.split(";");

    const maxes = rounds.reduce(
      (acc, round, i) => {
        //   console.log("Round", i + 1);

        const draws = round.split(",").map((draw) => {
          // console.log("draw", draw.trim());

          const splits = draw.trim().split(" ");
          return {
            num: parseInt(splits[0]),
            color: splits[1],
          };
        });
        //   console.log("Draws", draws);

        const currMaxInRounds = {
          maxRed: Math.max(
            acc.maxRed,
            draws.find((draw) => draw.color === "red")?.num || 0
          ),
          maxGreen: Math.max(
            acc.maxGreen,
            draws.find((draw) => draw.color === "green")?.num || 0
          ),
          maxBlue: Math.max(
            acc.maxBlue,
            draws.find((draw) => draw.color === "blue")?.num || 0
          ),
        };

        //   console.log("currMaxInRounds", currMaxInRounds);

        return currMaxInRounds;
      },
      {
        maxRed: 0,
        maxGreen: 0,
        maxBlue: 0,
      }
    );
    //   console.log(maxes);

    return {
      minRed: maxes.maxRed,
      minBlue: maxes.maxBlue,
      minGreen: maxes.maxGreen,
    };
  });
  //   console.log("minColors", minColors);
  const powers = minColors.map(
    (minColorSet: { minRed: number; minBlue: number; minGreen: number }) =>
      minColorSet["minRed"] * minColorSet["minBlue"] * minColorSet["minGreen"]
  );
  //   console.log(powers);
  const powerSum = powers.reduce(
    (acc: number, power: number) => acc + power,
    0
  );
  console.log(powerSum);
} catch (e: any) {
  console.log("Error:", e.stack);
}
