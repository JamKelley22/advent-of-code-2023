var fs = require("fs");

try {
  const useExample = false;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  //   const calibrationValues: string[] = [];
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
      //   calibrationValues[lineNum] = `${firstSeenNumber}${lastSeenNumber}`;
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
  //   calibrationValues[lineNum] = `${firstSeenNumber}${lastSeenNumber}`;
  const calibrationValue = parseInt(`${firstSeenNumber}${lastSeenNumber}`);
  calibrationValuesSum += calibrationValue;
  console.log(calibrationValuesSum);
} catch (e: any) {
  console.log("Error:", e.stack);
}
