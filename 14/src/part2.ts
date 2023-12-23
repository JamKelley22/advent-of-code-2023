import {
  Location,
  Platform,
  Rock,
  calculateSumFromPlatform,
  cyclePlatformNTimes,
  decodeLocation,
  encodeLocation,
  isOfTypeRock,
  tiltPlatform,
  travelDirection,
} from "./engine";

var fs = require("fs");
const util = require("util");

const parsePlatform = (input: string): Platform => {
  const platformMap = new Map<string, Rock>();
  const colSquareRocks = new Map<number, Location[]>(),
    rowSquareRocks = new Map<number, Location[]>();

  const lines = input.split("\n");
  const height = lines.length;
  const width = lines[0].length;

  for (let y = 0; y < lines.length; y++) {
    const chars = lines[y].split("");
    const currRowSquareRocks: Location[] = [];
    for (let x = 0; x < chars.length; x++) {
      const char = chars[x];
      if (char === ".") {
        continue;
      }
      if (!isOfTypeRock(char)) {
        throw new Error(`Invalid character in platform: ${char}`);
      }
      const loc = encodeLocation({ x, y });
      platformMap.set(loc, char);
      if (char === "#") {
        currRowSquareRocks.push(decodeLocation(loc));
        colSquareRocks.set(x, [
          ...(colSquareRocks.get(x) ?? []),
          decodeLocation(loc),
        ]);
      }
    }
    rowSquareRocks.set(y, currRowSquareRocks);
  }

  return { platformMap, width, height, colSquareRocks, rowSquareRocks };
};

const platformToString = (platform: Platform): string => {
  let platformStr = "   ";
  [...Array(platform.width).keys()].map((key) => {
    platformStr += `${key} `;
  });
  platformStr += "\n";
  for (let y = 0; y < platform.height; y++) {
    platformStr += `${y}: `;
    for (let x = 0; x < platform.width; x++) {
      platformStr += `${
        platform.platformMap.get(encodeLocation({ x, y })) ?? "."
      } `;
    }
    platformStr += ` - ${platform.height - y}\n`;
  }

  return platformStr;
};

try {
  const useExample = true;
  const filePath = useExample ? "input-example1.txt" : "input.txt";

  const input: string = fs.readFileSync(filePath, "utf8");
  const afterOneInput: string = fs.readFileSync("afterOneCycle.txt", "utf8");

  const platform = parsePlatform(input);
  const afterOneCyclePlatform = parsePlatform(afterOneInput);

  console.log(platformToString(platform));

  cyclePlatformNTimes(platform, 1);

  console.log("PlatformSum:", calculateSumFromPlatform(platform));
  console.log(
    "AfterOnePlatformSumTest:",
    calculateSumFromPlatform(afterOneCyclePlatform)
  );
} catch (e: any) {
  console.log("Error:", e.stack);
}
