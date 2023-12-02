var fs = require("fs");

try {
  const useExample = false;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  const lines = input.split("\n");

  const maxColors = {
    red: 12,
    green: 13,
    blue: 14,
  };

  const possibleGames = lines.reduce(
    (acc: number[], line: string, i: number) => {
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

      // Compare this to initial maxColors to see if possible return index if possible
      if (maxes["maxRed"] > maxColors["red"]) return acc;
      if (maxes["maxGreen"] > maxColors["green"]) return acc;
      if (maxes["maxBlue"] > maxColors["blue"]) return acc;

      return [...acc, i + 1];
    },
    []
  );
  console.log(
    possibleGames.reduce((acc: number, gameIndex: number) => acc + gameIndex, 0)
  );
} catch (e: any) {
  console.log("Error:", e.stack);
}
