import { transpose } from "./engine";

var fs = require("fs");
const util = require("util");

export const computeLeftOfReflectionLength = (
  map: string[][],
  log: boolean = false
): number => {
  const leftOfReflectionLengths = map.map((line, i) => {
    let maxmaxStepsFromCenter = 0;
    let splitIndexMaxStepsFromCenter = 0;

    // if (log) console.log(line.join(""));
    if (log) console.log("============");

    for (let splitIndex = 0; splitIndex < line.length; splitIndex++) {
      const firstHalf = line.slice(0, splitIndex).reverse();
      const secondHalf = line.slice(splitIndex, line.length);

      // let len = 0;
      let maxStepsFromCenter = 0;

      for (
        let stepsFromCenter = 0;
        stepsFromCenter < Math.min(firstHalf.length, secondHalf.length);
        stepsFromCenter++
      ) {
        // len++;
        if (firstHalf[stepsFromCenter] !== secondHalf[stepsFromCenter]) {
          break;
        }
        maxStepsFromCenter = stepsFromCenter;
      }
      // if (log) {
      //   console.log(firstHalf.join("").slice(0, stepsFromCenter));
      //   console.log(secondHalf.join("").slice(0, stepsFromCenter));
      //   console.log(
      //     stepsFromCenter,
      //     `${firstHalf.reverse().join("")}|${secondHalf.join("")}`
      //   );
      // }

      if (maxStepsFromCenter > maxmaxStepsFromCenter) {
        maxmaxStepsFromCenter = maxStepsFromCenter;
        splitIndexMaxStepsFromCenter = splitIndex;
      }
    }

    if (log) console.log(i, splitIndexMaxStepsFromCenter);

    return splitIndexMaxStepsFromCenter;
  });

  const leftOfReflectionLength = leftOfReflectionLengths.reduce((acc, num) => {
    if (num < acc) return num;
    return acc;
  }, Number.MAX_SAFE_INTEGER);

  return leftOfReflectionLength;
};

export const mapToAnnotatedString = (
  map: string[][],
  reflectionIndex: { row: number; col: number }
): string => {
  let ret = "  ";
  ret += Array.from(Array(map[0].length).keys())
    .map((v) => v)
    .join("");
  for (let i = 0; i < map.length; i++) {
    ret += `${i} `;
    const line = map[i];
    for (let j = 0; j < line.length; j++) {
      const element = line[j];
      ret += "";
    }
    ret += "\n";
  }
  return ret;
};

try {
  const useExample = false;
  const filePath = useExample ? "input-example3.txt" : "input.txt";
  const input: string = fs.readFileSync(filePath, "utf8");

  const lines = input.split("\n");

  let blocks: string[][] = [];

  let blockIndex = 0;

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (!line) {
      blockIndex++;
      continue;
    }
    if (!blocks[blockIndex]) {
      blocks[blockIndex] = [];
    }
    blocks[blockIndex].push(line);
  }

  // console.log(blocks.length);

  const leftAbove = blocks.map((block, i) => {
    const map = block.map((line) => line.split(""));

    const leftOfReflectionLength = computeLeftOfReflectionLength(map);
    const aboveOfReflectionLength = computeLeftOfReflectionLength(
      transpose(map)
    );

    if (i === i) {
      const mapStr = map
        .map((line) => `${line.reduce((acc, char) => acc + char, "")}`)
        .join("\n");
      const tMapStr = transpose(map)
        .map((line) => `${line.reduce((acc, char) => acc + char, "")}`)
        .join("\n");

      // console.log("===========");

      // console.log(mapStr);
      // console.log("+++");

      // console.log(tMapStr);
    }

    console.log({ leftOfReflectionLength, aboveOfReflectionLength });
    return { leftOfReflectionLength, aboveOfReflectionLength };
  });

  const res = leftAbove.reduce(
    (acc, cv) => {
      if (cv.aboveOfReflectionLength > cv.leftOfReflectionLength) {
        return {
          cols: acc.cols,
          rows: acc.rows + cv.aboveOfReflectionLength,
        };
      }
      return {
        cols: acc.cols + cv.leftOfReflectionLength,
        rows: acc.rows,
      };
    },
    { rows: 0, cols: 0 }
  );

  console.log(100 * res.rows + res.cols);

  console.log(blocks[0]);

  console.log(
    mapToAnnotatedString(
      blocks[0].map((line) => line.split("")),
      {
        col: leftAbove[0].leftOfReflectionLength,
        row: leftAbove[0].aboveOfReflectionLength,
      }
    )
  );

  //21268 too low
} catch (e: any) {
  console.log("Error:", e.stack);
}
