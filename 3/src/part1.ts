var fs = require("fs");

// Object.defineProperty(String.prototype, "searchAll", {
//   value(searcher: { [Symbol.search](string: string): number }) {
//     return this.split(searcher);
//   },
// });

export function searchAll(str: string, searcher: RegExp): number[] {
  const split = str.split(searcher);
  return split
    .reduce((acc, term, i) => {
      if (i === split.length - 1) return acc;
      return [...acc, (acc[i - 1] || 0) + term.length + 1];
    }, [] as number[])
    .map((num) => num - 1);
}

export const parseNumberIndexPairsInLine = (
  line: string,
  regex: RegExp
): {
  number: number;
  index: number;
}[] => {
  return line
    .replaceAll(regex, ".")
    .split(".")
    .map((str) => parseInt(str))
    .filter((num) => num)
    .map((num) => ({
      number: num,
      index: line.indexOf(num.toString()),
    }));
};

export const findValidNumbers = (lines: string[]) => {
  //   console.log("..35..633.".indexOf("633"));
  const regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/g;

  //   const numAddSet = new Set<string>(); //Here this is a string to show row,col:number so that duplicate numbers in different places of the input can be added
  const numAddArray = [] as number[];
  //Our battleship
  //   const numberMap = new Map<string, number>();
  const symbolSet = new Set<string>();

  const parsedLines = lines.map((line, i) => {
    const numbersInLine = parseNumberIndexPairsInLine(
      (" " + line).slice(1),
      regex
    );

    const symbolIndexesInLine = searchAll(line, regex);
    // console.log(numbersInLine);

    // Construct hashmap based upon the locations of the numbers
    // Format of key: row,col
    // Format of value: number
    // numbersInLine.forEach((numberInLine) => {
    //   const numberLength = numberInLine.number.toString().length;
    //   for (let numberIndex = 0; numberIndex < numberLength; numberIndex++) {
    //     numberMap.set(
    //       `${i},${numberIndex + numberInLine.index}`,
    //       numberInLine.number
    //     );
    //   }
    // });
    symbolIndexesInLine.forEach((symbolIndex) => {
      symbolSet.add(`${i},${symbolIndex}`);
    });

    // console.log({ numbersInLine, symbolIndexesInLine });

    return { numbersInLine, symbolIndexesInLine };
    // console.log(i, { numbersInLine, symbolIndexesInLine });
  });

  //   console.log(symbolSet);

  for (let index = 0; index < parsedLines.length; index++) {
    const parsedLine = parsedLines[index];
    if (parsedLine.numbersInLine.length === 0) continue;
    for (let j = 0; j < parsedLine.numbersInLine.length; j++) {
      const rowIndex = index,
        colIndex = parsedLine.numbersInLine[j].index,
        numberLength = parsedLine.numbersInLine[j].number.toString().length;
      //   if (parsedLine.numbersInLine[j].number === 4) {
      //     //   console.log(index, j, parsedLine.numbersInLine[j]);
      //     console.log(
      //       `${rowIndex},${colIndex}`,
      //       symbolSet.has(`${rowIndex},${colIndex + numberLength}`),
      //       symbolSet
      //     );
      //   }

      // Check in 8 directions for symbol, if hit a symbol in the symbolSet at that location, add the current number to the array and break with next number
      // Since we're just doing a check of a set as a string xy we don't need to check if each direction goes negative or past the max, it simply wont be there in that case
      [
        //Up
        ...Array(numberLength)
          .fill(0)
          .map(
            (elem, numberIndex) => `${rowIndex - 1},${colIndex + numberIndex}`
          ),
        //Up-Right
        `${rowIndex - 1},${colIndex + numberLength}`,
        //Right
        `${rowIndex},${colIndex + numberLength}`,
        //Down-Right
        `${rowIndex + 1},${colIndex + numberLength}`,
        //Down
        ...Array(numberLength)
          .fill(0)
          .map(
            (elem, numberIndex) => `${rowIndex + 1},${colIndex + numberIndex}`
          ),
        //Down-Left
        `${rowIndex + 1},${colIndex - 1}`,
        //Left
        `${rowIndex},${colIndex - 1}`,
        //         //Up-Left
        `${rowIndex - 1},${colIndex - 1}`,
      ].some((rowColStr) => {
        let hasSymbol = symbolSet.has(rowColStr);
        if (hasSymbol) {
          //   console.log(
          //     `Symbol found at:${rowColStr} for num:${parsedLine.numbersInLine[j].number}`
          //   );

          numAddArray.push(parsedLine.numbersInLine[j].number);
          return true;
        } //numAddSet.add(`${number}`);
        return false;
      });
    }
  }

  //   console.log(numberMap);
  //   console.log(parsedLines.map((pl) => pl.symbolIndexesInLine));

  //   for (let index = 0; index < parsedLines.length; index++) {
  //     const parsedLine = parsedLines[index];
  //     if (parsedLine.symbolIndexesInLine.length === 0) continue;

  //     for (let j = 0; j < parsedLine.symbolIndexesInLine.length; j++) {
  //       //   console.log(`row:${index}, col:${parsedLine.symbolIndexesInLine[j]}`);
  //       const rowIndex = index,
  //         colIndex = parsedLine.symbolIndexesInLine[j];
  //       // Check in 8 directions for number, if hit a number in the number map at that location, add it to the set
  //       // Since we're just doing a check of a hashmap as a string xy we don't need to check if each direction goes negative or past the max, it simply wont be there in that case
  //       [
  //         //Up
  //         `${rowIndex - 1},${colIndex}`,
  //         //Up-Right
  //         `${rowIndex - 1},${colIndex + 1}`,
  //         //Right
  //         `${rowIndex},${colIndex + 1}`,
  //         //Down-Right
  //         `${rowIndex + 1},${colIndex + 1}`,
  //         //Down
  //         `${rowIndex + 1},${colIndex}`,
  //         //Down-Left
  //         `${rowIndex + 1},${colIndex - 1}`,
  //         //Left
  //         `${rowIndex},${colIndex - 1}`,
  //         //Up-Left
  //         `${rowIndex - 1},${colIndex - 1}`,
  //       ].map((rowColStr) => {
  //         let number = numberMap.get(rowColStr);
  //         if (number) numAddArray.push(number); //numAddSet.add(`${number}`);
  //       });
  //     }
  //   }
  //   console.log([...numAddSet].slice(-10));
  //   const numberSum = [...numAddSet].reduce(
  //     (acc, numberStr) => acc + parseInt(numberStr.split(":")[1]),
  //     0
  //   );
  //   const numberSum = [...numAddSet].reduce((acc, num) => acc + parseInt(num), 0);
  //   console.log(numAddArray);

  return { numAddArray, symbolSet, parsedLines };
};

try {
  const useExample = false;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  const lines: string[] = input.split("\n");
  //   //Assuming a fully filled (non-jagged) matrix of symbols/numbers
  //   const lineLength = lines[0].length;
  const { numAddArray } = findValidNumbers(lines);
  console.log(numAddArray);

  const numberSum = numAddArray.reduce((acc, num) => acc + num, 0);
  console.log(numberSum);
  //318539 is too low
  //513668 is too low
  //525890 is wrong
} catch (e: any) {
  console.log("Error:", e.stack);
}
