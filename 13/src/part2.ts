import {
  SurfaceType,
  calculateAllReflectionsFromMaxReflectionDistancesAtSplitIndices,
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

export const calculateTheThing = (currentBlock: SurfaceType[][]) => {
  const lineReflectionIndicesCol = currentBlock.map((line) =>
    findLineReflectionIndex(line)
  );
  const lineReflectionIndicesRow = transpose(currentBlock).map((line) =>
    findLineReflectionIndex(line)
  );
  //   console.log({ lineReflectionIndicesRow, lineReflectionIndicesCol });

  const maxReflectionCol =
    calculateAllReflectionsFromMaxReflectionDistancesAtSplitIndices(
      lineReflectionIndicesCol
    );
  const maxReflectionRow =
    calculateAllReflectionsFromMaxReflectionDistancesAtSplitIndices(
      lineReflectionIndicesRow
    );
  //   console.log({ maxReflectionCol, maxReflectionRow });

  //   console.log(
  //     mirrorBlockToAnnotatedString(currentBlock, {
  //       col: maxReflectionCol[0].splitIndex,
  //       row: maxReflectionRow[0].splitIndex,
  //     })
  //   );

  return { maxReflectionCol, maxReflectionRow };

  //   console.log({ maxReflectionCol, maxReflectionRow });

  //   if (
  //     maxReflectionCol.maxReflectionDistance >
  //     maxReflectionRow.maxReflectionDistance
  //   ) {
  //     // console.log({ maxReflectionCol });
  //     // console.log(
  //     //   mirrorBlockToAnnotatedString(currentBlock, {
  //     //     col: maxReflectionCol.splitIndex,
  //     //   })
  //     // );

  //     return {
  //       col: maxReflectionCol.splitIndex,
  //       row: 0,
  //     };
  //   } else {
  //     // console.log({ maxReflectionRow });
  //     // console.log(
  //     //   mirrorBlockToAnnotatedString(currentBlock, {
  //     //     row: maxReflectionRow.splitIndex,
  //     //   })
  //     // );
  //     return {
  //       col: 0,
  //       row: maxReflectionRow.splitIndex,
  //     };
  //   }
};

try {
  const useExample = true;
  const filePath = useExample ? "input-example4.txt" : "input.txt";
  const input: string = fs.readFileSync(filePath, "utf8");

  const blocks = input.split("\n\n").map((block) => parseMirrorBlock(block));

  //   const currentBlock = blocks[0];

  //   const ret = calculateTheThing(currentBlock);
  //   console.log({ ret });

  //   currentBlock[0][0] = ".";
  //   const { row, col } = calculateTheThing(currentBlock);
  //   console.log({ row, col });

  blocks.forEach((currentBlock) => {
    const {
      maxReflectionCol: baseMaxReflectionCol,
      maxReflectionRow: baseMaxReflectionRow,
    } = calculateTheThing(currentBlock);
    console.log({ baseMaxReflectionCol, baseMaxReflectionRow });

    let stop = false;
    for (let i = 0; i < currentBlock.length && !stop; i++) {
      for (let j = 0; j < currentBlock[i].length && !stop; j++) {
        const updatedBlock = { ...currentBlock };
        updatedBlock[i][j] = updatedBlock[i][j] === "#" ? "." : "#";
        const { maxReflectionCol, maxReflectionRow } =
          calculateTheThing(currentBlock);

        if (maxReflectionCol.length === 0 || maxReflectionRow.length === 0) {
          continue;
        }
        if (
          maxReflectionCol.length !== baseMaxReflectionCol.length ||
          maxReflectionRow.length !== baseMaxReflectionRow.length
        ) {
          if (maxReflectionCol.length !== baseMaxReflectionCol.length) {
            console.log(1, `[${i},${j}]`, {
              col: maxReflectionCol[maxReflectionCol.length - 1].splitIndex,
              row:
                baseMaxReflectionRow.length > 0
                  ? baseMaxReflectionRow[baseMaxReflectionRow.length - 1]
                      .splitIndex
                  : 0,
            });

            return;
          }
          if (maxReflectionRow.length !== baseMaxReflectionRow.length) {
            console.log(2, `[${i},${j}]`, {
              row: maxReflectionRow[maxReflectionRow.length - 1].splitIndex,
              col:
                baseMaxReflectionCol.length > 0
                  ? baseMaxReflectionCol[baseMaxReflectionCol.length - 1]
                      .splitIndex
                  : 0,
            });
            return;
          }
        }

        // const rowDelta = baseRow - row,
        //   colDelta = baseCol - col;
        // if (rowDelta || colDelta) {
        //   if (row || col) console.log(`[${i},${j}]`, { row, col });
        //   stop = true;
        // }
      }
    }
  });

  //   const res = blocks.reduce(
  //     (acc, currentBlock) => {
  //       calculateTheThing(currentBlock)
  //     },
  //     { row: 0, col: 0 }
  //   );

  //   console.log(res.col + res.row * 100);
} catch (e: any) {
  console.log("Error:", e.stack);
}
