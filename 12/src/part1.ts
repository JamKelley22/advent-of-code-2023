import {
  CharacterToSpringStatusMap,
  RecordRow,
  SpringStatusType,
  computeAllPossibleUnknownSpringStatuses,
  computeValidRecordRows,
  isOfTypeSpringStatus,
  isValidRecordRow,
  makeRecordRowReadable,
  makeStatusesReadable,
} from "./engine";

var fs = require("fs");
const util = require("util");

export const parseRecordRows = (input: string): RecordRow[] => {
  return input.split("\n").map((line) => {
    const [statusesStr, damagedSpringsRecordStr] = line.split(" ");
    const statuses = statusesStr.split("").map((char) => {
      const status = CharacterToSpringStatusMap.get(char);
      if (!status || !isOfTypeSpringStatus(status)) {
        throw new Error(`Invalid Spring Status: ${char}`);
      }
      return status satisfies SpringStatusType;
    });
    const damagedSpringsRecord = damagedSpringsRecordStr
      .split(",")
      .map((char) => parseInt(char));
    return { statuses, damagedSpringsRecord };
  });
};

try {
  const useExample = false;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  const recordRows = parseRecordRows(input);

  let trueStart = performance.now();
  console.log("===Parsed Record Rows===");

  let startTime = 0;
  const validConfigurationsOfRows = recordRows.reduce((acc, recordRow, i) => {
    startTime = performance.now();

    const validRecordRows = computeValidRecordRows(recordRow);

    const a = validRecordRows.map((rr) => makeRecordRowReadable(rr));
    //   console.log(util.inspect({ a }, false, null, true /* enable colors */));

    let endTime = performance.now();
    console.log(i + 1, `${(endTime - startTime) / 1000} seconds`);
    return [...acc, validRecordRows.length];
  }, [] as number[]);

  const num = validConfigurationsOfRows.reduce((acc, row) => acc + row, 0);
  let trueEnd = performance.now();

  console.log(`Call took ${trueEnd - trueStart} seconds`);
  console.log({ num });

  //13221 too high
} catch (e: any) {
  console.log("Error:", e.stack);
}
