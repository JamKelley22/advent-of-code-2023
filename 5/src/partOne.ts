var fs = require("fs");

type SourceDestObj = {
  source: number;
  destination: number;
  range: number;
};

try {
  const useExample = true;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input: string = fs.readFileSync(filePath, "utf8");

  const lines: string[] = input.split("\n");

  const [seedLabel, seedsString] = lines[0].split(":");
  const seedsNums = seedsString
    .trim()
    .split(" ")
    .map((seedStr) => parseInt(seedStr));

  const seedToSoilMap = new Map<number, number>(),
    soilToFertilizerMap = new Map<number, number>(),
    fertilizerToWaterMap = new Map<number, number>(),
    waterToLightMap = new Map<number, number>(),
    lightToTemperatureMap = new Map<number, number>(),
    temperatureToHumidityMap = new Map<number, number>(),
    humidityToLocationMap = new Map<number, number>();

  const mapMap = new Map<
    string,
    { map: Map<number, number>; sdo: SourceDestObj[] }
  >([
    ["seed-to-soil map:", { map: seedToSoilMap, sdo: [] }],
    ["soil-to-fertilizer map:", { map: soilToFertilizerMap, sdo: [] }],
    ["fertilizer-to-water map:", { map: fertilizerToWaterMap, sdo: [] }],
    ["water-to-light map:", { map: waterToLightMap, sdo: [] }],
    ["light-to-temperature map:", { map: lightToTemperatureMap, sdo: [] }],
    [
      "temperature-to-humidity map:",
      { map: temperatureToHumidityMap, sdo: [] },
    ],
    ["humidity-to-location map:", { map: humidityToLocationMap, sdo: [] }],
  ]);

  let mapMapKey = "";

  // Start at 3 because that is where the first map starts
  for (let i = 3; i < lines.length; i++) {
    if (!lines[i]) continue;
    if (lines[i].includes("-to-")) {
      //   mapStringsIndex++;
      mapMapKey = lines[i];
      continue;
    }

    const [source, dest, range] = lines[i]
      .split(" ")
      .map((strNum) => parseInt(strNum));

    // for (let j = 0; j < range; j++) {
    //   mapMap.get(mapMapKey)?.set(dest + j, source + j);
    // }
  }

  console.log(mapMap.get("seed-to-soil map:"));
} catch (e: any) {
  console.log("Error:", e.stack);
}
