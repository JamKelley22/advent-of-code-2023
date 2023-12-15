import {
  SurfaceType,
  calculateMaxReflectionFromMaxReflectionDistancesAtSplitIndices,
  findLineReflectionIndex,
  isOfTypeSurface,
  transpose,
} from "./engine";

var fs = require("fs");
const util = require("util");

export const mirrorBlockToAnnotatedString = (
  mirrorBlock: SurfaceType[][],
  reflectionIndex?: { row?: number; col?: number }
): string => {
  let ret = "    ";
  ret += Array.from(Array(mirrorBlock[0].length).keys())
    .map((v) => `${v % 10} `)
    .join("");
  ret += "\n    ";
  for (let j = 0; j < mirrorBlock[0].length; j++) {
    if (reflectionIndex?.col) {
      if ((reflectionIndex?.col ?? 0) === j) {
        ret += "← ";
        continue;
      } else if ((reflectionIndex?.col ?? 0) - 1 === j) {
        ret += "→ ";
        continue;
      } else {
        ret += "  ";
      }
    } else {
      ret += "  ";
    }
  }
  ret += "\n";
  for (let i = 0; i < mirrorBlock.length; i++) {
    ret += `${i % 10} `;
    if (reflectionIndex?.row) {
      if (reflectionIndex.row - 1 === i) {
        ret += "↓ ";
      } else if (reflectionIndex.row === i) {
        ret += "↑ ";
      } else {
        ret += "  ";
      }
    } else {
      ret += "  ";
    }
    const line = mirrorBlock[i];
    for (let j = 0; j < line.length; j++) {
      const element = line[j];
      ret += element + " ";
    }
    ret += "\n";
  }
  return ret;
};

export const parseMirrorBlock = (blockStr: string): SurfaceType[][] => {
  const lines = blockStr.split("\n");
  const surface = lines.map((line) =>
    line.split("").map((char) => {
      if (!isOfTypeSurface(char)) {
        throw new Error(`Invalid Surface: ${char}`);
      }
      return char satisfies SurfaceType;
    })
  );

  return surface;
};

try {
  const useExample = false;
  const filePath = useExample ? "input-example4.txt" : "input.txt";
  const input: string = fs.readFileSync(filePath, "utf8");

  const blocks = input.split("\n\n").map((block) => parseMirrorBlock(block));

  const res = blocks.reduce(
    (acc, currentBlock) => {
      const lineReflectionIndicesCol = currentBlock.map((line) =>
        findLineReflectionIndex(line)
      );
      const lineReflectionIndicesRow = transpose(currentBlock).map((line) =>
        findLineReflectionIndex(line)
      );
      console.log({ lineReflectionIndicesCol });

      const maxReflectionCol =
        calculateMaxReflectionFromMaxReflectionDistancesAtSplitIndices(
          lineReflectionIndicesCol
        );
      const maxReflectionRow =
        calculateMaxReflectionFromMaxReflectionDistancesAtSplitIndices(
          lineReflectionIndicesRow
          //   true
        );
      //   console.log({ maxReflectionCol, maxReflectionRow });

      //   console.log({ maxReflectionCol, maxReflectionRow });

      if (
        maxReflectionCol.maxReflectionDistance >
        maxReflectionRow.maxReflectionDistance
      ) {
        console.log({ maxReflectionCol });
        console.log(
          mirrorBlockToAnnotatedString(currentBlock, {
            col: maxReflectionCol.splitIndex,
          })
        );

        return {
          col: acc.col + maxReflectionCol.splitIndex,
          row: acc.row,
        };
      } else {
        console.log({ maxReflectionRow });
        console.log(
          mirrorBlockToAnnotatedString(currentBlock, {
            row: maxReflectionRow.splitIndex,
          })
        );
        return {
          col: acc.col,
          row: acc.row + maxReflectionRow.splitIndex,
        };
      }

      //   console.log({ maxReflectionCol, maxReflectionRow });

      //21268 too low
      //25544 too low
      //35695 too low
    },
    { row: 0, col: 0 }
  );

  console.log(res.col + res.row * 100);
} catch (e: any) {
  console.log("Error:", e.stack);
}
