export type RecordRow = {
  statuses: SpringStatusType[];
  damagedSpringsRecord: number[];
};

export const SpringStatus = ["Operational", "Damaged", "Unknown"] as const;
export type SpringStatusType = (typeof SpringStatus)[number];

export function isOfTypeSpringStatus(
  keyInput: string
): keyInput is SpringStatusType {
  return SpringStatus.includes(keyInput as SpringStatusType);
}

export const CharacterToSpringStatusMap = new Map<string, SpringStatusType>([
  ["?", "Unknown"],
  [".", "Operational"],
  ["#", "Damaged"],
]);

export const SpringStatusToCharacterMap = new Map<SpringStatusType, string>([
  ["Unknown", "?"],
  ["Operational", "."],
  ["Damaged", "#"],
]);

export const makeRecordRowReadable = (recordRow: RecordRow) => {
  return {
    statuses: makeStatusesReadable(recordRow.statuses),
    damagedSpringsRecord: recordRow.damagedSpringsRecord,
  };
};

export const makeStatusesReadable = (statuses: SpringStatusType[]) =>
  statuses.reduce((acc, status) => {
    return acc + SpringStatusToCharacterMap.get(status);
  }, "");

function GrayCodeBit(n: number) {
  const resultCode = [];
  for (let i = 0; i < 1 << n; i++) {
    resultCode.push(i ^ (i >> 1));
  }
  return resultCode
    .map((code) => code.toString(2).padStart(n, "0"))
    .map((code) => code.split("").map((char) => parseInt(char)));
}

export const findIndices = <T>(
  arr: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
): number[] => {
  return arr.reduce((acc, cv, i, array) => {
    if (predicate(cv, i, array)) return [...acc, i];
    return acc;
  }, [] as number[]);
};

export const computeAllPossibleUnknownSpringStatuses = (
  springStatuses: SpringStatusType[]
): SpringStatusType[][] => {
  const unknownRecordIndices = findIndices(
    springStatuses,
    (value) => value === "Unknown"
  );
  const combos = GrayCodeBit(unknownRecordIndices.length);
  //   console.log({ springStatuses, combos, unknownRecordIndices });

  return combos.reduce((acc, combo) => {
    const potentialSpringStatuses = [...springStatuses];
    unknownRecordIndices.forEach((unknownRecordIndex, i) => {
      potentialSpringStatuses[unknownRecordIndex] =
        combo[i] === 0 ? "Operational" : "Damaged";
    });
    return [...acc, potentialSpringStatuses];
  }, [] as SpringStatusType[][]);
};

export const isValidRecordRow = (
  recordRow: RecordRow,
  log: boolean = false
): boolean => {
  return (
    JSON.stringify(
      makeStatusesReadable(recordRow.statuses)
        .split(".")
        .filter((e) => e)
    ) ===
    JSON.stringify(recordRow.damagedSpringsRecord.map((num) => "#".repeat(num)))
  );
  //   //.#?..#?...###. 1,1,3
  //   //.#?..?#...###. 1,1,3
  //   //.?#..#?...###. 1,1,3
  //   //.?#..?#...###. 1,1,3
  //   if (log) console.log("===================================================");

  //   if (!recordRow.statuses.every((status) => status !== "Unknown")) {
  //     throw new Error("Cannot check validity of unknown statusRow");
  //   }

  //   const trackingRecord = [...recordRow.damagedSpringsRecord];

  //   const damagedRecordIndices = findIndices(
  //     recordRow.statuses,
  //     (value) => value === "Damaged"
  //   );

  //   for (let damagedIndex = 0; damagedIndex < damagedRecordIndices.length; ) {
  //     if (trackingRecord.length === 0) {
  //       if (log) console.log(false);
  //       return false;
  //     }

  //     const damagedRecordIndex = damagedRecordIndices[damagedIndex];

  //     if (
  //       damagedRecordIndex !== 0 &&
  //       recordRow.statuses[damagedRecordIndex - 1] !== "Operational"
  //     ) {
  //       //If not the first one in array and left is not operational its a bust
  //       if (log) console.log(false);

  //       return false;
  //     }

  //     const sliceLen = trackingRecord[0];
  //     const examineRange = recordRow.statuses.slice(
  //       damagedRecordIndex,
  //       damagedRecordIndex + sliceLen
  //     );

  //     if (log)
  //       console.log(
  //         damagedIndex,
  //         damagedRecordIndex,
  //         makeRecordRowReadable(recordRow).statuses,
  //         trackingRecord,
  //         examineRange,
  //         sliceLen
  //       );

  //     const allAreDamagedInRange = examineRange.every(
  //       (status) => status === "Damaged"
  //     );

  //     if (!allAreDamagedInRange) {
  //       if (log) console.log(false);
  //       return false;
  //     }

  //     damagedIndex += trackingRecord[0];
  //     trackingRecord.shift();
  //     // console.log({ examineRange });
  //   }
  //   if (trackingRecord.length !== 0) {
  //     if (log) console.log(false);
  //     return false;
  //   }

  //   if (log) console.log(true);

  //   return true;
};

export const computeValidRecordRows = (recordRow: RecordRow): RecordRow[] => {
  const potentialSpringStatuses = computeAllPossibleUnknownSpringStatuses(
    recordRow.statuses
  );

  const validRecordRows = potentialSpringStatuses.reduce(
    (acc, potentialSpringStatus) => {
      const rowIsValid = isValidRecordRow(
        {
          statuses: potentialSpringStatus,
          damagedSpringsRecord: recordRow.damagedSpringsRecord,
        },
        false
        //makeStatusesReadable(potentialSpringStatus) === ".###.##....."
      );
      if (rowIsValid)
        return [
          ...acc,
          {
            statuses: potentialSpringStatus,
            damagedSpringsRecord: recordRow.damagedSpringsRecord,
          },
        ];
      return acc;
    },
    [] as RecordRow[]
  );

  return validRecordRows;
};
