import { describe, expect, test } from "@jest/globals";
import {
  CharacterToSpringStatusMap,
  RecordRow,
  SpringStatusType,
  computeAllPossibleUnknownSpringStatuses,
  computeValidRecordRows,
  findIndices,
  isValidRecordRow,
  makeStatusesReadable,
} from "./engine";

describe("part1", () => {
  test("Finds Indices 1", () => {
    const arr = ["a", "b", "c", "a"];
    const indices = findIndices(arr, (val) => val === "a");
    expect(indices.sort()).toEqual([0, 3]);
  });
  test("IsValidRecordRow 1", () => {
    const recordRow: RecordRow = {
      statuses: "#"
        .split("")
        .map(
          (char) =>
            CharacterToSpringStatusMap.get(char) ??
            ("Unknown" satisfies SpringStatusType)
        ),
      damagedSpringsRecord: [1],
    };
    const isValid = isValidRecordRow(recordRow);
    expect(isValid).toBe(true);
  });
  test("IsValidRecordRow 2", () => {
    const recordRow: RecordRow = {
      statuses: "##"
        .split("")
        .map(
          (char) =>
            CharacterToSpringStatusMap.get(char) ??
            ("Unknown" satisfies SpringStatusType)
        ),
      damagedSpringsRecord: [2],
    };
    const isValid = isValidRecordRow(recordRow);
    expect(isValid).toBe(true);
  });

  test("IsValidRecordRow 3", () => {
    const recordRow: RecordRow = {
      statuses: "#.##"
        .split("")
        .map(
          (char) =>
            CharacterToSpringStatusMap.get(char) ??
            ("Unknown" satisfies SpringStatusType)
        ),
      damagedSpringsRecord: [1, 1],
    };
    const isValid = isValidRecordRow(recordRow);
    expect(isValid).toBe(false);
  });

  test("IsValidRecordRow 4", () => {
    const recordRow: RecordRow = {
      statuses: ".###.##....."
        .split("")
        .map(
          (char) =>
            CharacterToSpringStatusMap.get(char) ??
            ("Unknown" satisfies SpringStatusType)
        ),
      damagedSpringsRecord: [3, 2, 1],
    };
    const isValid = isValidRecordRow(recordRow);
    expect(isValid).toBe(false);
  });

  test("computeValidRecordRows 1", () => {
    const recordRow: RecordRow = {
      statuses: ".?...??#???"
        .split("")
        .map(
          (char) =>
            CharacterToSpringStatusMap.get(char) ??
            ("Unknown" satisfies SpringStatusType)
        ),
      damagedSpringsRecord: [1, 1],
    };
    const validRecordRows = computeValidRecordRows(recordRow);
    console.log(
      3,
      validRecordRows.map((rr) => makeStatusesReadable(rr.statuses))
    );

    const allPossible = computeAllPossibleUnknownSpringStatuses(
      recordRow.statuses
    );
    console.log(allPossible.map((rr) => makeStatusesReadable(rr)));

    expect(validRecordRows.length).toBe(10);
  });
  //532 is an issue
});

//.?...??#??? 1,1

//.......#..#
//.#.....####
//.......#.#.
//.....#.#...
//.#.....#...

//......##.#.
//.....#.##..
//.#...####..
//.#....##...
//.#....####.
//.#.....##..
//.......#..#
//......###.#
//......##.##
//.....###..#
//.#....#####
//.......#.##
//.......##.#
//......##..#
//.....###.##
//.....####.#
//.....#.####
//.#...######
//.#.....####
//.......#.#.
//.....###.#.
//.....#.###.
//.....#.#...
//.#...#####.
//.#...###...
//.#....###..
//.#.....###.
//.#.....#...

describe("part2", () => {
  test("calculates example line 1", () => {
    expect(1 + 1).toBe(2);
  });
});
