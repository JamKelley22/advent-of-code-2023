var fs = require("fs");

try {
  const useExample = true;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  const lines: string[] = input.split("\n");

  const [seedLabel, seedsString] = lines[0].split(":");
  const seedsNums = seedsString
    .trim()
    .split(" ")
    .map((seedStr) => parseInt(seedStr));
  //   console.log(seedsNums);

  const maps: Map<number, number>[] = [];
  const mapStrings: string[][] = [];
  let mapStringsIndex = 0;
  let currentMapStrings: string[] = [];
  maps[mapStringsIndex] = new Map<number, number>();

  // Start at 3 because that is where the first map starts
  for (let i = 3; i < lines.length; i++) {
    if (!lines[i]) continue;
    if (lines[i].includes("-to-")) {
      // End previous map, start new map
      mapStrings[mapStringsIndex] = currentMapStrings;
      mapStringsIndex++;
      currentMapStrings = [];
      maps[mapStringsIndex] = new Map<number, number>();
      continue;
    }
    currentMapStrings.push(lines[i]);
    const [source, dest, range] = lines[i]
      .split(" ")
      .map((strNum) => parseInt(strNum));
    for (let j = 0; j < range; j++) {
      maps[mapStringsIndex].set(dest + j, source + j);
    }
  }
  //Flush the last value
  mapStrings[mapStringsIndex] = currentMapStrings;

  //   console.log(mapStrings);
  //   console.log(maps[0]);

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
