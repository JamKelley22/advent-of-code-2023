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
  console.log("\t\t-OverlappingCheck row:", mapRow);

  const { s, d, r } = mapRow;
  // Check overlap with each seed range
  return seedRange.reduce(
    (acc, seedRangeSingle) => {
      const overlap = rangeOverlap(
        seedRangeSingle.min,
        seedRangeSingle.max,
        BigInt(d),
        BigInt(d) + BigInt(r)
      );
      console.log("\t\t\t_____________");

      console.log("\t\t\t--InnerOverlappingCheck Seed:", seedRangeSingle);
      //   let modifiedSeedRanges = [seedRange];

      const croppedSeedRanges = removeRangeFromX(
        seedRangeSingle.min,
        seedRangeSingle.max,
        BigInt(d),
        BigInt(d) + BigInt(r)
      );

      console.log(`\t\t\t--CroppedSeedRanges: `, croppedSeedRanges);

      if (overlap) {
        const differenceBetweenSourceAndDestination = d - s;

        const transformedSeedRange = {
          min: overlap.min - BigInt(differenceBetweenSourceAndDestination),
          max: overlap.max - BigInt(differenceBetweenSourceAndDestination),
        };

        console.log(
          `\t\t\t--OverlappingTrue, NewSeedRange: `,
          transformedSeedRange
        );
        console.log("\t\t\t_____________");
        return [
          ...acc,
          {
            transformedSeedRange,
            croppedSeedRanges,
          },
        ];
      }

      console.log(`\t\t\t--OverlappingFalse`);
      console.log("\t\t\t_____________");
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

  console.log("=====================");

  const seedLine = lines.shift();
  //   console.log(seedLine);

  const originalSeedRanges = parseSeedRanges(seedLine || "");
  let seedRanges = [originalSeedRanges];

  //Throw away next two lines (one blank and next one starts first map)
  lines.shift();
  lines.shift();
  const mapsInfo = parseMapsInfo(lines);

  mapsInfo.slice(0, 2).forEach((mapInfo, mapInfoIndex) => {
    console.log("++++++++++++++");

    console.log(`+| MapBlock: ${mapInfoIndex}`);
    seedRanges[mapInfoIndex + 1] = [];
    // let modifiedSeedRanges = seedRanges[mapInfoIndex];

    let totalCroppedSeedRanges: {
      min: bigint;
      max: bigint;
    }[] = [];

    mapInfo.forEach((mapRow, mapRowIndex) => {
      console.log("\t***********");
      console.log(`\t+| MapRow: ${mapRowIndex}`);
      console.log("\t***********");
      const overlappingRanges = getOverlappingRanges(
        mapRow,
        seedRanges[mapInfoIndex]
      );

      const croppedSeedRanges = overlappingRanges.flatMap(
        (range) => range.croppedSeedRanges
      );
      croppedSeedRanges.forEach((seedRange) => {
        totalCroppedSeedRanges.push(seedRange);
        // const newOverlap = rangeOverlap(seedRange.min,seedRange.max,
      });

      const transformedSeedRanges = overlappingRanges.reduce(
        (acc, range) => {
          if (range.transformedSeedRange)
            return [...acc, range.transformedSeedRange];
          return acc;
        },
        [] as {
          min: bigint;
          max: bigint;
        }[]
      );

      console.log("\t\tTransformed Seed Ranges:", transformedSeedRanges);

      seedRanges[mapInfoIndex + 1].push(...transformedSeedRanges);
      // Copy the non-overlapping ranges TODO
      //   seedRanges[mapInfoIndex + 1].push(
      //     ...overlappingRanges.flatMap((range) => range.modifiedSeedRanges)
      //   );
      //   seedRanges[mapInfoIndex + 1].push(...modifiedSeedRanges);
    });

    console.log("\t\tCropped Seed Ranges:", totalCroppedSeedRanges);
    seedRanges[mapInfoIndex + 1].push(...totalCroppedSeedRanges);
    console.log("================");
  });
  console.log(seedRanges);
} catch (e: any) {
  console.log("Error:", e.stack);
}
