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
  console.log(seedDetailsArr);

  const seedsNums = seedDetailsArr.reduce((acc, cv, i) => {
    if (i % 2 === 0) {
      const nums = [] as number[];
      for (let index = 0; index < seedDetailsArr[i + 1]; index++) {
        nums.push(cv + index);
      }
      return [...acc, ...nums];
    }
    return acc;
  }, [] as number[]);

  console.log("seedsNums", seedsNums.length);

  endTime = performance.now();
  console.log(`Get Seed Nums: ${endTime - startTime} ms`);

  const maps: Map<number, number>[] = [];
  const mapStrings: string[][] = [];
  let mapStringsIndex = 0;
  let currentMapStrings: string[] = [];
  maps[mapStringsIndex] = new Map<number, number>();

  let checkSets: Set<number>[] = [];
  checkSets[0] = new Set<number>();

  startTime = performance.now();
  seedsNums.forEach((num) => checkSets[0].add(num));
  endTime = performance.now();
  console.log(`Build first checkset: ${endTime - startTime} ms`);

  // Where things might become an issue

  // Start at 3 because that is where the first map starts
  startTime = performance.now();
  for (let i = 3; i < lines.length; i++) {
    if (!lines[i]) continue;
    if (lines[i].includes("-to-")) {
      // End previous map, start new map

      mapStrings[mapStringsIndex] = currentMapStrings;
      mapStringsIndex++;
      currentMapStrings = [];
      maps[mapStringsIndex] = new Map<number, number>();
      continue;
      //
    }
    if (!checkSets[mapStringsIndex + 1])
      checkSets[mapStringsIndex + 1] = new Set<number>();
    currentMapStrings.push(lines[i]);
    // Done Parsing into stuff
    const [source, dest, range] = lines[i]
      .split(" ")
      .map((strNum) => parseInt(strNum));

    console.log(range);

    for (let j = 0; j < range; j++) {
      //   console.log(dest + j, seedsNums.includes(dest + j));
      if (checkSets[mapStringsIndex].has(dest + j))
        if (checkSets[mapStringsIndex].has(dest + j)) {
          // console.log(
          //   `Line: ${i}, Source: ${source + j}, Dest: ${
          //     dest + j
          //   }, J: ${j}, checkHas(d+j): ${checkSets[mapStringsIndex].has(
          //     dest + j
          //   )}`
          // );

          checkSets[mapStringsIndex].delete(dest + j); // Add back

          checkSets[mapStringsIndex + 1].add(source + j);

          // console.log(mapStringsIndex + 1, checkSets[mapStringsIndex + 1]);

          maps[mapStringsIndex].set(dest + j, source + j);
          continue;
        }
    }
    [...checkSets[mapStringsIndex]].forEach((val) => {
      maps[mapStringsIndex].set(val, val);
      checkSets[mapStringsIndex + 1].add(val);
    });
    // ;
    // checkSet = new Set(nextCheckSet);
    // nextCheckSet.clear();

    // maps[mapStringsIndex].set(dest + j, source + j);
  }
  //Flush the last value
  mapStrings[mapStringsIndex] = currentMapStrings;
  endTime = performance.now();
  console.log(`Parse: ${endTime - startTime} ms`);

  //   console.log(mapStrings);
  //   console.log(maps);
  //   console.log(checkSets);

  let lowestLocationNum = Number.MAX_SAFE_INTEGER;

  //   console.log("=====================");
  for (let seedNumIndex = 0; seedNumIndex < seedsNums.length; seedNumIndex++) {
    // console.log("seed num:", seedsNums[seedNumIndex]);

    const seedNum = seedsNums[seedNumIndex];
    let nextMapInput = seedNum;
    for (let mapIndex = 0; mapIndex < maps.length; mapIndex++) {
      const map = maps[mapIndex];
      nextMapInput = map.get(nextMapInput) ?? nextMapInput;
      //   console.log("next:", nextMapInput);
    }
    const locationNum = nextMapInput;
    if (locationNum < lowestLocationNum) lowestLocationNum = locationNum;
    // console.log("location:", locationNum);
    // console.log("=====================");
  }

  console.log(lowestLocationNum);

  //   const result = lines.reduce((acc, line) => {
  //     //
  //     return acc;
  //   }, 0);
} catch (e: any) {
  console.log("Error:", e.stack);
}
