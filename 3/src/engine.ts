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
