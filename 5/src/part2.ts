import { rangeNonOverlap, rangeOverlap } from "./engine";

var fs = require("fs");

try {
  const useExample = true;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  let startTime = performance.now();
  const lines: string[] = input.split("\n");
  let endTime = performance.now();
  console.log(`Split lines: ${endTime - startTime} ms`);

  startTime = performance.now();
  const [seedLabel, seedsString] = lines[0].split(":");
  //   const seedsNums = seedsString
  //     .trim()
  //     .split(" ")
  //     .map((seedStr) => parseInt(seedStr));
  const seedDetailsArr = seedsString
    .trim()
    .split(" ")
    .map((seedStr) => parseInt(seedStr));

  // console.log(1, seedDetailsArr);

  const seedNumRanges = seedDetailsArr.reduce((acc, cv, i, arr) => {
    if (i % 2 === 0) {
      const range = arr[i + 1];

      if (!range) return acc;
      const bigCV = BigInt(cv);

      const min = bigCV,
        max = bigCV + BigInt(range);

      return [...acc, { min, max }];
      // const nums = [] as number[];
      // for (let index = 0; index < arr[i + 1]; index++) {
      //   nums.push(cv + index);
      // }
      // return [...acc, ...nums];
    }
    return acc;
  }, [] as { min: bigint; max: bigint }[]);

  console.log(seedNumRanges);

  // console.log(2, "seedsNums", seedsNums.length);

  endTime = performance.now();
  console.log(`Get Seed Nums: ${endTime - startTime} ms`);

  const maps: Map<number, number>[] = [];

  const mapStrings: string[][] = [];
  const mapSourceDestRanges: { s: number; d: number; r: number }[][] = [];
  let mapStringsIndex = 0;
  let currentMapStrings: string[] = [];
  let currentSourceDestRanges: { s: number; d: number; r: number }[] = [];

  maps[mapStringsIndex] = new Map<number, number>();

  // let checkSets: Set<number>[] = [];

  // checkSets[0] = new Set<number>();

  // startTime = performance.now();
  // seedsNums.forEach((num) => checkSets[0].add(num));
  // endTime = performance.now();
  // console.log(`Build first checkset: ${endTime - startTime} ms`);

  // Where things might become an issue

  // Start at 3 because that is where the first map starts
  startTime = performance.now();
  // const destinationRanges = destinationRangesArr[mapStringsIndex];
  // console.log(destinationRanges);

  for (let i = 3; i < lines.length; i++) {
    if (!lines[i]) continue;
    if (lines[i].includes("-to-")) {
      // End previous map, start new map
      mapStrings[mapStringsIndex] = currentMapStrings;
      mapSourceDestRanges[mapStringsIndex] = currentSourceDestRanges;
      mapStringsIndex++;
      currentMapStrings = [];
      currentSourceDestRanges = [];
      maps[mapStringsIndex] = new Map<number, number>();
      continue;
    }
    // if (!checkSets[mapStringsIndex + 1])
    //   checkSets[mapStringsIndex + 1] = new Set<number>();
    currentMapStrings.push(lines[i]);
    // Done Parsing into stuff
    const [source, dest, range] = lines[i]
      .split(" ")
      .map((strNum) => parseInt(strNum));
    currentSourceDestRanges.push({ s: source, d: dest, r: range });
    // const newDestinationRanges = [];

    // for (
    //   let destinationRangeIndex = 0;
    //   destinationRangeIndex < destinationRanges.length;
    //   destinationRangeIndex++
    // ) {
    //   const { min, max } = destinationRanges[destinationRangeIndex];
    //   const validOverlaps = rangeOverlap(min, max, dest, dest + range);
    //   if (validOverlaps) {
    //     console.log(lines[i], validOverlaps, source, source + range);
    //   }
    // }

    // for (let j = 0; j < range; j++) {
    //   //   console.log(dest + j, seedsNums.includes(dest + j));
    //   if (checkSets[mapStringsIndex].has(dest + j))
    //     if (checkSets[mapStringsIndex].has(dest + j)) {
    //       // console.log(
    //       //   `Line: ${i}, Source: ${source + j}, Dest: ${
    //       //     dest + j
    //       //   }, J: ${j}, checkHas(d+j): ${checkSets[mapStringsIndex].has(
    //       //     dest + j
    //       //   )}`
    //       // );

    //       checkSets[mapStringsIndex].delete(dest + j); // Add back

    //       checkSets[mapStringsIndex + 1].add(source + j);

    //       // console.log(mapStringsIndex + 1, checkSets[mapStringsIndex + 1]);

    //       maps[mapStringsIndex].set(dest + j, source + j);
    //       continue;
    //     }
    // }

    //TODO Impliment another way
    // [...checkSets[mapStringsIndex]].forEach((val) => {
    //   maps[mapStringsIndex].set(val, val);
    //   checkSets[mapStringsIndex + 1].add(val);
    // });

    // ;
    // checkSet = new Set(nextCheckSet);
    // nextCheckSet.clear();

    // maps[mapStringsIndex].set(dest + j, source + j);
  }
  //Flush the last value
  mapStrings[mapStringsIndex] = currentMapStrings;
  mapSourceDestRanges[mapStringsIndex] = currentSourceDestRanges;
  endTime = performance.now();
  console.log(`Parse: ${endTime - startTime} ms`);

  // console.log(4, mapSourceDestRanges[0]);

  const allValidOverlaps = mapSourceDestRanges[0].map((sourceDestRange) => {
    return seedNumRanges.reduce((acc, seedNumRange, seedIndex) => {
      const { s, d, r } = sourceDestRange;

      const validOverlaps = rangeOverlap(
        seedNumRange.min,
        seedNumRange.max,
        BigInt(d),
        BigInt(d) + BigInt(r)
      );
      // const nonOverlapping = rangeNonOverlap(
      //   seedNumRange.min,
      //   seedNumRange.max,
      //   BigInt(d),
      //   BigInt(d) + BigInt(r)
      // );

      if (validOverlaps) {
        const differenceBetweenSourceAndDestination = d - s;
        return [
          ...acc,
          {
            min:
              validOverlaps.min - BigInt(differenceBetweenSourceAndDestination),
            max:
              validOverlaps.max -
              BigInt(differenceBetweenSourceAndDestination) -
              BigInt(1),
          },
        ];
        // console.log(seedIndex, differenceBetweenSourceAndDestination, {
        //   min:
        //     validOverlaps.min - BigInt(differenceBetweenSourceAndDestination),
        //   max:
        //     validOverlaps.max - BigInt(differenceBetweenSourceAndDestination),
        // });
      }
      return [...acc];
    }, [] as any[]);
  });
  console.log(allValidOverlaps);

  //// Un

  // const firstSourceDestRangeArr = mapSourceDestRanges[0];

  // for (
  //   let mapSourceDestIndex = 0;
  //   mapSourceDestIndex < firstSourceDestRangeArr.length;
  //   mapSourceDestIndex++
  // ) {
  //   const element = firstSourceDestRangeArr[mapSourceDestIndex];
  //   const { min, max } = destinationRanges[mapSourceDestIndex];
  //   const end = element.d + element.r;
  //   console.log(min, max, BigInt(element.d), BigInt(end));

  //   const validOverlaps = rangeOverlap(
  //     min,
  //     max,
  //     BigInt(element.d),
  //     BigInt(end)
  //   );
  //   if (validOverlaps) console.log(element, validOverlaps);
  // }

  //// UnUn

  // for (let maxIndex = 0; maxIndex < mapSourceDestRanges.length; maxIndex++) {
  //   const mapSourceDestRange = mapSourceDestRanges[maxIndex];
  //   for (
  //     let destinationRangeIndex = 0;
  //     destinationRangeIndex < destinationRanges.length;
  //     destinationRangeIndex++
  //   ) {
  //     const { min, max } = destinationRanges[destinationRangeIndex];
  //     const validOverlaps = rangeOverlap(min, max, dest, dest + range);
  //     if (validOverlaps) {
  //       console.log(lines[i], validOverlaps, source, source + range);
  //     }
  //   }
  // }

  //   console.log(mapStrings);
  //   console.log(maps);
  //   console.log(checkSets);

  // let lowestLocationNum = Number.MAX_SAFE_INTEGER;

  // //   console.log("=====================");
  // for (let seedNumIndex = 0; seedNumIndex < seedsNums.length; seedNumIndex++) {
  //   // console.log("seed num:", seedsNums[seedNumIndex]);

  //   const seedNum = seedsNums[seedNumIndex];
  //   let nextMapInput = seedNum;
  //   for (let mapIndex = 0; mapIndex < maps.length; mapIndex++) {
  //     const map = maps[mapIndex];
  //     nextMapInput = map.get(nextMapInput) ?? nextMapInput;
  //     //   console.log("next:", nextMapInput);
  //   }
  //   const locationNum = nextMapInput;
  //   if (locationNum < lowestLocationNum) lowestLocationNum = locationNum;
  //   // console.log("location:", locationNum);
  //   // console.log("=====================");
  // }

  // console.log(lowestLocationNum);

  // //   const result = lines.reduce((acc, line) => {
  // //     //
  // //     return acc;
  // //   }, 0);
} catch (e: any) {
  console.log("Error:", e.stack);
}
