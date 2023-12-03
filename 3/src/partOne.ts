var fs = require("fs");

export const isNumber = (char: string): boolean => {
  if (char.length > 1) throw new Error("isNumber only accepts one character");
  const charCode = char.charCodeAt(0),
    zeroCharCode = "0".charCodeAt(0),
    nineCharCode = "9".charCodeAt(0);
  if (charCode > nineCharCode || charCode < zeroCharCode) return false;
  return true;
};

export const isSymbolExcludePeriod = (char: string): boolean => {
  const symbolExcludePeriodRegex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/g;

  if (char.length > 1)
    throw new Error("isSymbolExcludePeriod only accepts one character");

  return char.search(symbolExcludePeriodRegex) === -1 ? false : true;
};

export const parseNumberAndSymbolLocations = (
  input: string,
  lineLength: number
) => {
  const numberLocationMap = new Map<string, number>();
  const symbolLocationMap = new Map<string, string>();
  let lineIndex = 0;
  let currentNumberStart = { i: -1, j: -1 };
  let currentNumber = "";
  for (let index = 0; index < input.length; index++) {
    const char = input[index];
    if (!isNumber(char)) {
      //Finish whatever number
      if (currentNumber) {
        numberLocationMap.set(
          `${currentNumberStart.i},${currentNumberStart.j}`,
          parseInt(currentNumber)
        );
      }
      //Reset currentNumber
      currentNumber = "";
      currentNumberStart = { i: -1, j: -1 };
      if (char === "\n") {
        //Assuming a fully filled (non-jagged) matrix of symbols/numbers
        // if (lineLength === -1) lineLength = index;
        lineIndex++;
        continue;
      }
      if (char === ".") {
        continue;
      }

      if (isSymbolExcludePeriod(char)) {
        symbolLocationMap.set(`${lineIndex},${index % lineLength}`, char);
        continue;
      }
    }
    // Is a number
    if (!currentNumber) {
      //First number, set location
      currentNumberStart = { i: lineIndex, j: index % lineLength };
    }

    currentNumber += char;
  }

  return { symbolLocationMap, numberLocationMap };
};

try {
  const useExample = false;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  let lineLength = 141;

  const { symbolLocationMap, numberLocationMap } =
    parseNumberAndSymbolLocations(input, lineLength);

  const validNumbers = [] as number[];
  const numberLocationArray = [...numberLocationMap];

  for (
    let numberLocIndex = 0;
    numberLocIndex < numberLocationArray.length;
    numberLocIndex++
  ) {
    const numberLocation = numberLocationArray[numberLocIndex];
    const numberLocationCoords = numberLocation[0].split(",");
    const numberStartRowIndex = parseInt(numberLocationCoords[0]),
      numberStartColIndex = parseInt(numberLocationCoords[1]),
      numberLength = numberLocation[1].toString().length,
      number = numberLocation[1];

    // Check in 8 directions for symbol, if hit a symbol in the symbolSet at that location, add the current number to the array and break with next number
    // Since we're just doing a check of a set as a string xy we don't need to check if each direction goes negative or past the max, it simply wont be there in that case
    [
      //Up
      ...Array(numberLength)
        .fill(0)
        .map(
          (elem, numberIndex) =>
            `${numberStartRowIndex - 1},${numberStartColIndex + numberIndex}`
        ),
      //Up-Right
      `${numberStartRowIndex - 1},${numberStartColIndex + numberLength}`,
      //Right
      `${numberStartRowIndex},${numberStartColIndex + numberLength}`,
      //Down-Right
      `${numberStartRowIndex + 1},${numberStartColIndex + numberLength}`,
      //Down
      ...Array(numberLength)
        .fill(0)
        .map(
          (elem, numberIndex) =>
            `${numberStartRowIndex + 1},${numberStartColIndex + numberIndex}`
        ),
      //Down-Left
      `${numberStartRowIndex + 1},${numberStartColIndex - 1}`,
      //Left
      `${numberStartRowIndex},${numberStartColIndex - 1}`,
      //Up-Left
      `${numberStartRowIndex - 1},${numberStartColIndex - 1}`,
    ].some((rowColStr) => {
      let hasSymbol = symbolLocationMap.has(rowColStr);
      if (hasSymbol) {
        // console.log(number, rowColStr, symbolLocationMap.get(rowColStr));

        //   console.log(
        //     `Symbol found at:${rowColStr} for num:${parsedLine.numbersInLine[j].number}`
        //   );

        validNumbers.push(number);
        return true;
      }
      return false;
    });
  }

  //   console.log(symbolLocationMap);
  //   console.log(numberLocationMap);
  console.log(validNumbers);

  const numberSum = validNumbers.reduce((acc, num) => acc + num, 0);
  console.log(numberSum);

  //318539 is too low
  //513668 is too low
  //525890 is wrong
  //402154 is wrong
} catch (e: any) {
  console.log("Error:", e.stack);
}
