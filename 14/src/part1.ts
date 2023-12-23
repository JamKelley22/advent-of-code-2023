import {
  Location,
  Platform,
  Rock,
  decodeLocation,
  encodeLocation,
  isOfTypeRock,
  travelDirection,
} from "./engine";

var fs = require("fs");
const util = require("util");

const parsePlatform = (input: string): Platform => {
  const platformMap = new Map<string, Rock>();

  const lines = input.split("\n");
  const height = lines.length;
  const width = lines[0].length;
  for (let y = 0; y < lines.length; y++) {
    const chars = lines[y].split("");
    for (let x = 0; x < chars.length; x++) {
      const char = chars[x];
      if (char === ".") {
        continue;
      }
      if (!isOfTypeRock(char)) {
        throw new Error(`Invalid character in platform: ${char}`);
      }
      platformMap.set(encodeLocation({ x, y }), char);
    }
  }

  return { platformMap, width, height };
};

const platformToString = (platform: Platform): string => {
  let platformStr = "";
  for (let y = 0; y < platform.height; y++) {
    for (let x = 0; x < platform.width; x++) {
      platformStr += `${
        platform.platformMap.get(encodeLocation({ x, y })) ?? "."
      } `;
    }
    platformStr += ` ${platform.height - y}\n`;
  }

  return platformStr;
};

try {
  const useExample = false;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input: string = fs.readFileSync(filePath, "utf8");
  const platform = parsePlatform(input);
  // console.log(platform);

  console.log(platformToString(platform));

  const roundRockLocations = [...platform.platformMap].reduce(
    (acc, [encodedLocation, rock]) => {
      if (rock === "#") return acc;

      return [...acc, decodeLocation(encodedLocation)];
    },
    [] as Location[]
  );
  roundRockLocations.sort((a, b) => a.y - b.y);
  // console.log({ roundRockLocations });

  roundRockLocations.forEach((roundRockLoc) => {
    let northLoc = travelDirection(roundRockLoc, "North");
    let currentLoc = { ...roundRockLoc };
    while (
      !platform.platformMap.get(encodeLocation(northLoc)) &&
      currentLoc.y > 0
    ) {
      currentLoc = { ...northLoc };
      northLoc = travelDirection(currentLoc, "North");
    }
    //Delete where it is currently
    platform.platformMap.delete(encodeLocation(roundRockLoc));
    //Set it to the place where it settles
    platform.platformMap.set(encodeLocation(currentLoc), "O");
  });

  let sum = 0;

  platform.platformMap.forEach((rock, encodedLocation) => {
    const rockLoc = decodeLocation(encodedLocation);
    // console.log({ encodedLocation }, platform.height - rockLoc.y);
    if (rock === "O") sum += platform.height - rockLoc.y;
  });

  console.log(platformToString(platform));
  console.log(sum);
} catch (e: any) {
  console.log("Error:", e.stack);
}
