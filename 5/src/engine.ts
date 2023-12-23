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
  y2: bigint,
  log: boolean = false
): { min: bigint; max: bigint }[] => {
  if (log) console.log(`\t\t\t--RemoveRange x:[${x1},${x2}], y:[${y1},${y2}]`);

  if (x1 <= y2 && y1 <= x2) {
    // There is overlap
    if (x1 <= y1 && x2 <= y2) {
      if (log) console.log("\t\t\t\ta - Remove Right");
      // x1=============x2
      //    y1================y2

      return [{ min: x1, max: y1 }];
    }
    if (y1 <= x1 && y2 <= x2) {
      if (log) console.log("\t\t\t\tb - Remove Left");
      //       x1=============x2
      // y1================y2
      return [{ min: y2, max: x2 }];
    }
    if (x1 <= y1 && x2 >= y2) {
      if (log) console.log("\t\t\t\tc - Split");
      // x1======================x2
      //    y1================y2
      throw new Error(
        "The assumption you so desperately wanted to be true was false :("
      );
      return [
        { min: x1, max: y1 },
        { min: y2, max: x2 },
      ];
    }
    if (y1 <= x1 && y2 >= x2) {
      if (log) console.log("\t\t\t\td - Remove All");
      //       x1=============x2
      //    y1====================y2
      throw new Error(
        "The assumption you so desperately wanted to be true was false :("
      );
      return [];
    }
    //???
    return [{ min: BigInt(-1), max: BigInt(-1) }];
  }

  if (log) console.log("\t\t\t\tNo Overlap");
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

export const getOverlappingRanges = (
  mapRow: {
    s: number;
    d: number;
    r: number;
  },
  seedRange: {
    min: bigint;
    max: bigint;
  }[]
) => {
  const { s, d, r } = mapRow;
  // Check overlap with each seed range
  return seedRange.reduce(
    (acc, seedRange) => {
      const overlap = rangeOverlap(
        seedRange.min,
        seedRange.max,
        BigInt(d),
        BigInt(d) + BigInt(r)
      );
      //   let modifiedSeedRanges = [seedRange];

      const croppedSeedRanges = removeRangeFromX(
        seedRange.min,
        seedRange.max,
        BigInt(d),
        BigInt(d) + BigInt(r)
      );
      console.log(
        "88",
        // seedRange.min,
        // seedRange.max,
        // BigInt(d),
        // BigInt(d) + BigInt(r),
        croppedSeedRanges
      );

      if (overlap) {
        const differenceBetweenSourceAndDestination = d - s;

        return [
          ...acc,
          {
            transformedSeedRange: {
              min: overlap.min - BigInt(differenceBetweenSourceAndDestination),
              max: overlap.max - BigInt(differenceBetweenSourceAndDestination),
            },
            croppedSeedRanges: croppedSeedRanges,
            // modifiedSeedRanges:
            //   croppedSeedRange !== null ? croppedSeedRange : [],
          },
        ];
      }

      return [
        ...acc,
        {
          transformedSeedRange: undefined,
          croppedSeedRanges: croppedSeedRanges,
        },
      ];
    },
    [] as {
      transformedSeedRange?: {
        min: bigint;
        max: bigint;
      };
      croppedSeedRanges: { min: bigint; max: bigint }[];
      //   modifiedSeedRanges: { min: bigint; max: bigint }[];
    }[]
  );
};
