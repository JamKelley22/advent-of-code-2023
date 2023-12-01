var fs = require("fs");

try {
  const useExample = false;
  const filePath = useExample ? "input-example2.txt" : "input.txt";

  let input = fs.readFileSync(filePath, "utf8");

  // Replace any instances of zero...nine with their numerical equivalent
  // Pad end and beginning with the same number word to cover edge case where number words share parts of the same letters. Ex. eightwothree is 823 not eigh23
  input = input.replaceAll("zero", "zero0zero");
  input = input.replaceAll("one", "one1one");
  input = input.replaceAll("two", "two2two");
  input = input.replaceAll("three", "three3three");
  input = input.replaceAll("four", "four4four");
  input = input.replaceAll("five", "five5five");
  input = input.replaceAll("six", "six6six");
  input = input.replaceAll("seven", "seven7seven");
  input = input.replaceAll("eight", "eight8eight");
  input = input.replaceAll("nine", "nine9nine");

  // const calibrationValues: string[] = [];
  let calibrationValuesSum = 0;
  // Assume Unicode
  const charCodeZero = "0".charCodeAt(0),
    charCodeNine = "9".charCodeAt(0);
  let lineNum = 0;
  let firstSeenNumber = "",
    lastSeenNumber = "";
  // Using one for loop to keep it to O(N) time for the actual calculation
  for (let i = 0; i < input.length; i++) {
    if (input[i] === "\n") {
      // calibrationValues[lineNum] = `${firstSeenNumber}${lastSeenNumber}`;
      const calibrationValue = parseInt(`${firstSeenNumber}${lastSeenNumber}`);
      calibrationValuesSum += calibrationValue;
      firstSeenNumber = "";
      lastSeenNumber = "";
      lineNum++;
      continue;
    }
    const currentCharCode = input[i].charCodeAt(0);
    if (currentCharCode < charCodeZero || currentCharCode > charCodeNine)
      continue;
    if (!firstSeenNumber) {
      firstSeenNumber = input[i];
    }

    lastSeenNumber = input[i];
  }
  // File does not end with a new line character so flush the last output
  // calibrationValues[lineNum] = `${firstSeenNumber}${lastSeenNumber}`;
  const calibrationValue = parseInt(`${firstSeenNumber}${lastSeenNumber}`);
  calibrationValuesSum += calibrationValue;
  console.log(calibrationValuesSum);
} catch (e: any) {
  console.log("Error:", e.stack);
}
