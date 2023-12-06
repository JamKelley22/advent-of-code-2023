import { rangeOverlap, removeRangeFromX } from "./engine";

var fs = require("fs");

export const parseSeedRanges = (line: string) => {
  const [seedLabel, seedsString] = line.split(":");
  const seedDetailsArr = seedsString
    .trim()
    .split(" ")
    .map((seedStr) => parseInt(seedStr));

  const seedNumRanges = seedDetailsArr.reduce((acc, cv, i, arr) => {
    if (i % 2 === 0) {
      const range = arr[i + 1];

      if (!range) return acc;
      const bigCV = BigInt(cv);

      const min = bigCV,
        max = bigCV + BigInt(range);

      return [...acc, { min, max: max - BigInt(1) }];
    }
    return acc;
  }, [] as { min: bigint; max: bigint }[]);

  return seedNumRanges;
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

export const parseMapsInfo = (lines: string[]) => {
  const mapSourceDestRanges: { s: number; d: number; r: number }[][] = [];
  let mapIndex = 0;
  let currentSourceDestRanges: { s: number; d: number; r: number }[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (!lines[i]) continue;
    if (lines[i].includes("-to-")) {
      // End previous map, start new map
      mapSourceDestRanges[mapIndex] = currentSourceDestRanges;
      mapIndex++;
      currentSourceDestRanges = [];
      continue;
    }
    const [source, dest, range] = lines[i]
      .split(" ")
      .map((strNum) => parseInt(strNum));
    currentSourceDestRanges.push({ s: source, d: dest, r: range });
  }
  return mapSourceDestRanges;
};

try {
  const useExample = true;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  let startTime = performance.now();
  const lines: string[] = input.split("\n");
  let endTime = performance.now();
  console.log(`Split lines: ${endTime - startTime} ms`);

  const seedLine = lines.shift();
  //   console.log(seedLine);

  const originalSeedRanges = parseSeedRanges(seedLine || "");
  let seedRanges = [originalSeedRanges];

  //Throw away next two lines (one blank and next one starts first map)
  lines.shift();
  lines.shift();
  const mapsInfo = parseMapsInfo(lines);

  mapsInfo.slice(0, 2).forEach((mapInfo, mapInfoIndex) => {
    // console.log(mapInfo);
    seedRanges[mapInfoIndex + 1] = [];
    // let modifiedSeedRanges = seedRanges[mapInfoIndex];

    mapInfo.forEach((mapRow, mapRowIndex) => {
      //   console.log(mapRow);
      const overlappingRanges = getOverlappingRanges(
        mapRow,
        seedRanges[mapInfoIndex]
      );

      console.log(
        mapInfoIndex,
        mapRowIndex,
        overlappingRanges.flatMap((range) => range.croppedSeedRanges)
      );

      seedRanges[mapInfoIndex + 1].push(
        ...overlappingRanges.reduce(
          (acc, range) => {
            if (range.transformedSeedRange)
              return [...acc, range.transformedSeedRange];
            return acc;
          },
          [] as {
            min: bigint;
            max: bigint;
          }[]
        )
      );
      // Copy the non-overlapping ranges TODO
      seedRanges[mapInfoIndex + 1].push(
        ...overlappingRanges.flatMap((range) => range.croppedSeedRanges)
      );
      //   seedRanges[mapInfoIndex + 1].push(
      //     ...overlappingRanges.flatMap((range) => range.modifiedSeedRanges)
      //   );
      //   seedRanges[mapInfoIndex + 1].push(...modifiedSeedRanges);
    });
    console.log("================");
  });
  console.log(seedRanges);
} catch (e: any) {
  console.log("Error:", e.stack);
}
