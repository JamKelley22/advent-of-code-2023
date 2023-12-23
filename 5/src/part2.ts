import { rangeOverlap, removeRangeFromX } from "./engine";

var fs = require("fs");

export const parseSeeds = (seedLine: string): number[] => {
  return seedLine
    .split(":")[1]
    .trim()
    .split(" ")
    .map((seed) => parseInt(seed));
};
export const parseSeedRanges = (
  line: string
): { min: bigint; max: bigint }[] => {
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

export const parseMapInfo = (lines: string[]) => {
  const mapSourceDestRanges: { s: bigint; d: bigint; r: bigint }[][] = [];
  let mapIndex = 0;
  let currentSourceDestRanges: { s: bigint; d: bigint; r: bigint }[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (!lines[i]) continue;
    if (lines[i].includes("-to-")) {
      if (currentSourceDestRanges.length > 0) {
        // End previous map, start new map
        mapSourceDestRanges[mapIndex] = currentSourceDestRanges;
        mapIndex++;
        currentSourceDestRanges = [];
      }
      continue;
    }
    const [source, dest, range] = lines[i]
      .split(" ")
      .map((strNum) => BigInt(parseInt(strNum)));
    currentSourceDestRanges.push({ s: source, d: dest, r: range });
  }
  mapSourceDestRanges[mapIndex] = currentSourceDestRanges;
  return mapSourceDestRanges;
};

// export const mapInfoToRange = (mapInfo: {
//   s: bigint;
//   d: bigint;
//   r: bigint;
// }): {} => {

// }

export const computeSeedRangesFromMapping = (
  seedRanges: {
    min: bigint;
    max: bigint;
  }[],
  mapping: {
    s: bigint;
    d: bigint;
    r: bigint;
  },
  addOverlap: (overlap: { min: bigint; max: bigint }) => void
): {
  min: bigint;
  max: bigint;
}[] => {
  return seedRanges.flatMap((seedRange) => {
    const overlap = rangeOverlap(
      seedRange.min,
      seedRange.max,
      mapping.d,
      mapping.d + mapping.r
    );
    if (!overlap) return seedRange;
    addOverlap(overlap);
    const destSrcDelta = mapping.d - mapping.s;
    const shiftedOverlap = {
      min: overlap.min - destSrcDelta,
      max: overlap.max - destSrcDelta,
    };
    return shiftedOverlap;
  });
};

export const computeNextSeedRangesFromMap = (
  seedRanges: {
    min: bigint;
    max: bigint;
  }[],
  map: {
    s: bigint;
    d: bigint;
    r: bigint;
  }[]
): {
  min: bigint;
  max: bigint;
}[] => {
  let overlaps: { min: bigint; max: bigint }[] = [];
  const newMappings = map.flatMap((mapping) =>
    computeSeedRangesFromMapping(seedRanges, mapping, (overlap) => {
      overlaps.push(overlap);
    })
  );

  overlaps.forEach((overlap) => {});

  // seedRanges.forEach(seedRange => {
  //   let newSeedRangesNonOverlap: {
  //     min: bigint;
  //     max: bigint;
  //   }[] = [seedRange];

  // })

  //// Handle the non-overlap areas
  // seedRanges.forEach((seedRange) => {
  //   let modifiedSeedRange = [{...seedRange}];
  //   overlaps.forEach((overlap) => {
  //     removeRangeFromX(seedRange.min, seedRange.max, overlap.min, overlap.max);
  //   });
  // });

  return [...newMappings];
};

try {
  const useExample = true;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  let startTime = performance.now();
  const blocks: string[] = input.split("\n\n");
  let endTime = performance.now();
  console.log(`Split lines: ${endTime - startTime} ms`);

  const ogSeedRanges = parseSeedRanges(blocks.shift() ?? "");

  const maps = blocks.map((block) => {
    const mapBlock = block.split("\n");
    return parseMapInfo(mapBlock)[0];
  });

  const seedRangeTracker = [ogSeedRanges];

  maps.slice(0, 1).forEach((map, mapIndex) => {
    const nextSeedRanges = computeNextSeedRangesFromMap(
      seedRangeTracker[mapIndex],
      map
    );
    seedRangeTracker.push(nextSeedRanges);
  });

  // seedRanges.forEach((seedRange, seedRangeIndex) => {

  // })

  //

  // let seedRangeTracker = [seedRanges];

  // blocks.slice(0, 1).forEach((block, blockIndex) => {
  //   const mapBlock = block.split("\n");
  //   const mapInfo = parseMapsInfo(mapBlock)[0];

  //   const currentSeedRangesForBlock = seedRangeTracker[blockIndex]; //Modify this as chunks get taken
  //   const newSeedRangesForBlock: {
  //     min: bigint;
  //     max: bigint;
  //   }[] = [];
  //   const transformedSeedRangesForBlock: {
  //     min: bigint;
  //     max: bigint;
  //   }[] = [];
  //   // console.log({ mapInfo });

  //   for (
  //     let seedRangeIndex = 0;
  //     seedRangeIndex < currentSeedRangesForBlock.length;
  //     seedRangeIndex++
  //   ) {
  //     const ogSeedRange = currentSeedRangesForBlock[seedRangeIndex];

  //     // const modifiedSeedRange: {
  //     //   min: bigint;
  //     //   max: bigint;
  //     // }[] = [];

  //     mapInfo.forEach((mapRange) => {
  //       const overlap = rangeOverlap(
  //         ogSeedRange.min,
  //         ogSeedRange.max,
  //         mapRange.d,
  //         mapRange.d + mapRange.r
  //       );
  //       if (overlap) {
  //         const destSrcDelta = mapRange.d - mapRange.s;
  //         const shiftedOverlap = {
  //           min: overlap.min - destSrcDelta,
  //           max: overlap.max - destSrcDelta,
  //         };
  //         // console.log({ shiftedOverlap });
  //         transformedSeedRangesForBlock.push(shiftedOverlap);
  //         // IF there is overlap we need to remove from currentSeedRangesForBlock
  //         const remaining = removeRangeFromX(
  //           ogSeedRange.min,
  //           ogSeedRange.max,
  //           mapRange.d,
  //           mapRange.d + mapRange.r
  //         );

  //         //Remove current
  //         newSeedRangesForBlock.splice(seedRangeIndex, 1);
  //         //Add new ranges that did not get removed
  //         newSeedRangesForBlock.push(...remaining);
  //       }
  //       console.log({ transformedSeedRangesForBlock });
  //       newSeedRangesForBlock.push(...transformedSeedRangesForBlock);
  //       // console.log({ overlap });
  //     });
  //   }

  //   seedRangeTracker.push(newSeedRangesForBlock);
  // });

  // console.log(seedRangeTracker);
} catch (e: any) {
  console.log("Error:", e.stack);
}
