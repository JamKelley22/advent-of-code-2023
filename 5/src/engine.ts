import IntervalTree from "@flatten-js/interval-tree";

export const createSeedIntervalTree = (line: string) => {
  if (!line.includes("seeds:")) throw new Error("Invalid Seed Line");
  const seedsNums = line
    .split(":")[1]
    .trim()
    .split(" ")
    .map((seedStr) => parseInt(seedStr));

  if (seedsNums.length % 2 !== 0)
    throw new Error("Invalid number of seeds and ranges");

  let tree = new IntervalTree();

  seedsNums.forEach((seedNum, i, arr) => {
    if (i % 2 === 0) {
      // Grab the range
      const range = arr[i + 1];
      tree.insert([seedNum, seedNum + range], "");
    }
  });

  return tree;
};

export const createMapIntervalTree = (lines: string[]) => {
  let treeSource = new IntervalTree();
  let treeDest = new IntervalTree();
  lines.forEach((line) => {
    const [source, dest, range] = line
      .split(" ")
      .map((strNum) => parseInt(strNum));

    treeSource.insert([source, source + range]);
    treeDest.insert([dest, dest + range]);
  });

  return { treeSource, treeDest };
};

export const rangeOverlap = (
  x1: bigint,
  x2: bigint,
  y1: bigint,
  y2: bigint
): { min: bigint; max: bigint } | null => {
  if (x1 <= y2 && y1 <= x2) {
    // There is overlap
    if (x1 <= y1 && x2 <= y2) {
      return { min: y1, max: x2 };
    }
    if (y1 <= x1 && y2 <= x2) {
      return { min: x1, max: y2 };
    }
    if (x1 <= y1 && x2 >= y2) {
      return { min: y1, max: y2 };
    }
    if (y1 <= x1 && y2 >= x2) {
      return { min: x1, max: x2 };
    }
    return { min: BigInt(-1), max: BigInt(-1) };
  }
  return null;
};

export const removeRangeFromX = (
  x1: bigint,
  x2: bigint,
  y1: bigint,
  y2: bigint
): { min: bigint; max: bigint }[] => {
  if (x1 <= y2 && y1 <= x2) {
    // There is overlap
    if (x1 <= y1 && x2 <= y2) {
      console.log("a");

      return [{ min: x1, max: y1 }];
    }
    if (y1 <= x1 && y2 <= x2) {
      console.log("b");
      return [{ min: y2, max: x2 }];
    }
    if (x1 <= y1 && x2 >= y2) {
      console.log("c");
      return [
        { min: x1, max: y1 },
        { min: y2, max: x2 },
      ];
    }
    if (y1 <= x1 && y2 >= x2) {
      console.log("d");
      return [];
    }
    return [{ min: BigInt(-1), max: BigInt(-1) }];
  }
  console.log("f");
  return [{ min: x1, max: x2 }];
};

export const rangeNonOverlap = (
  x1: bigint,
  x2: bigint,
  y1: bigint,
  y2: bigint
): { min: bigint; max: bigint }[] | null => {
  if (x1 <= y2 && y1 <= x2) {
    // There is overlap
    if (x1 <= y1 && x2 <= y2) {
      return [
        { min: x1, max: y1 },
        { min: x2, max: y2 },
      ];
    }
    if (y1 <= x1 && y2 <= x2) {
      return [
        { min: y1, max: x1 },
        { min: y2, max: x2 },
      ];
    }
    if (x1 <= y1 && x2 >= y2) {
      return [
        { min: x1, max: y1 },
        { min: y2, max: x2 },
      ];
    }
    if (y1 <= x1 && y2 >= x2) {
      return [
        { min: y1, max: x1 },
        { min: x2, max: y2 },
      ];
    }
    return null;
  }

  return [
    { min: x1, max: x2 },
    { min: y1, max: y2 },
  ];
};
