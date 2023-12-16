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

export const parseMapsInfo = (lines: string[]) => {
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

try {
  const useExample = true;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  let startTime = performance.now();
  const blocks: string[] = input.split("\n\n");
  let endTime = performance.now();
  console.log(`Split lines: ${endTime - startTime} ms`);

  const seedRanges = parseSeedRanges(blocks.shift() ?? "");
  console.log({ seedRanges });

  blocks.forEach((block) => {
    const mapBlock = block.split("\n");
    const mapInfo = parseMapsInfo(mapBlock)[0];
    // console.log({ mapInfo });

    for (
      let seedRangeIndex = 0;
      seedRangeIndex < seedRanges.length;
      seedRangeIndex++
    ) {
      const seedRange = seedRanges[seedRangeIndex];

      mapInfo.forEach((mapRange) => {});
    }
  });
} catch (e: any) {
  console.log("Error:", e.stack);
}
