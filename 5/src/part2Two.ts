import { rangeOverlap, removeRangeFromX } from "./engine";

var fs = require("fs");

export const parseSeeds = (seedLine: string): number[] => {
  return seedLine
    .split(":")[1]
    .trim()
    .split(" ")
    .map((seed) => parseInt(seed));
};
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
  mapSourceDestRanges[mapIndex] = currentSourceDestRanges;
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

  const seeds = parseSeeds(seedLine || "");
  let mappings = [seeds];

  //Throw away next two lines (one blank and next one starts first map)
  lines.shift();
  lines.shift();
  const mapsInfo = parseMapsInfo(lines);

  mapsInfo.forEach((mapInfo, mapInfoIndex) => {
    // console.log("mapInfoIndex", mapInfoIndex);

    mappings[mapInfoIndex + 1] = [];

    mappings[mapInfoIndex].forEach((seedMapping, seedMappingIndex) => {
      // console.log(
      //   "seedMappingIndex",
      //   seedMappingIndex,
      //   "\tseedMapping",
      //   seedMapping
      // );

      let mappedSeed = false;

      mapInfo.forEach((mapRow, mapRowIndex) => {
        // console.log(
        //   "MappingIndex",
        //   seedMappingIndex,
        //   "mapRowIndex",
        //   mapRowIndex
        // );

        const sourceMin = mapRow.s,
          sourceMax = mapRow.s + mapRow.r;
        const destMin = mapRow.d,
          destMax = mapRow.d + mapRow.r;
        const differenceBetweenSourceAndDestination = mapRow.s - mapRow.d;
        // console.log(
        //   "source",
        //   mapRow.s,
        //   "dest",
        //   mapRow.d,
        //   "diff",
        //   differenceBetweenSourceAndDestination
        // );

        if (seedMapping >= destMin && seedMapping < destMax) {
          //Seed is being mapped
          mappings[mapInfoIndex + 1].push(
            seedMapping + differenceBetweenSourceAndDestination
          );
          //Note that that seed was mapped
          mappedSeed = true;

          // console.log(
          //   0,
          //   `Mapping ${seedMapping} to ${
          //     seedMapping + differenceBetweenSourceAndDestination
          //   }`
          // );
        }
      });
      // //Map leftover seeds directly
      if (!mappedSeed) {
        mappings[mapInfoIndex + 1].push(seedMapping);
        // console.log(0, `Keeping ${seedMapping} at ${seedMapping}`);
      }
    });
    // console.log("================");
  });

  // Seed 79, soil 81, fertilizer 81, water 81, light 74, temperature 78, humidity 78, location 82.
  // Seed 14, soil 14, fertilizer 53, water 49, light 42, temperature 42, humidity 43, location 43.
  // Seed 55, soil 57, fertilizer 57, water 53, light 46, temperature 82, humidity 82, location 86.
  // Seed 13, soil 13, fertilizer 52, water 41, light 34, temperature 34, humidity 35, location 35.
  console.log(
    mappings[mappings.length - 1].reduce((acc, val) => {
      if (val < acc) return val;
      return acc;
    }, Number.MAX_SAFE_INTEGER)
  );
} catch (e: any) {
  console.log("Error:", e.stack);
}
