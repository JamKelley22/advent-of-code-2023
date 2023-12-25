import {
  Brick,
  Location3D,
  Snapshot,
  encodeLocation,
  encodeLocation3D,
  parseSnapshot,
  travelDirection3D,
} from "./engine";

var fs = require("fs");

const bricksToBrickMap = (bricks: Brick[]): Map<string, string> => {
  const brickMap = new Map<string, string>();

  bricks.forEach((brick) => {
    for (let z = brick.z1; z < brick.z1 + brick.height; z++) {
      for (let x = brick.x1; x < brick.x1 + brick.length; x++) {
        for (let y = brick.y1; y < brick.y1 + brick.width; y++) {
          brickMap.set(encodeLocation3D({ x, y, z }), brick.label);
        }
      }
    }
  });

  return brickMap;
};

const bricksToBrickMapAlt = (bricks: Brick[]): Map<string, Location3D[]> => {
  const brickMap = new Map<string, Location3D[]>();

  bricks.forEach((brick) => {
    for (let z = brick.z1; z < brick.z1 + brick.height; z++) {
      for (let x = brick.x1; x < brick.x1 + brick.length; x++) {
        for (let y = brick.y1; y < brick.y1 + brick.width; y++) {
          brickMap.set(brick.label, [
            ...(brickMap.get(brick.label) ?? []),
            { x, y, z },
          ]);
        }
      }
    }
  });

  return brickMap;
};

const moveBrickLocationDown = (locations: Location3D[]): Location3D[] => {
  return locations.map((location) => travelDirection3D(location, "Down"));
};

const isValidLocation = (
  location: Location3D,
  brickLocations: Location3D[]
): boolean => {
  return false;
};

const bricksToString = (
  snapshot: Snapshot,
  orientation: "front" | "side" // Front=XZ, Side=YZ
): string => {
  const lengthPadding = " ".repeat(snapshot.maxLength / 2);
  const widthPadding = " ".repeat(snapshot.maxWidth / 2);
  const heightLabelIndex = snapshot.maxHeight / 2;
  let simStr =
    orientation === "front"
      ? `${lengthPadding}x${lengthPadding}`
      : `${widthPadding}y${widthPadding}`;

  simStr += "\n";

  simStr +=
    orientation === "front"
      ? [...Array(snapshot.maxLength + 1).keys()].join("")
      : [...Array(snapshot.maxWidth + 1).keys()].join("");

  const view = new Map<string, string>();
  for (let z = 0; z < snapshot.maxHeight + 1; z++) {
    switch (orientation) {
      case "front":
        for (let x = 0; x < snapshot.maxLength + 1; x++) {
          view.set(encodeLocation({ y: z, x }), ".");
        }
        break;
      case "side":
        for (let y = 0; y < snapshot.maxWidth + 1; y++) {
          view.set(encodeLocation({ y: z, x: y }), ".");
        }
        break;
    }
  }

  //   console.log(snapshot.bricks);

  switch (
    orientation // Front=XZ, Side=YZ
  ) {
    case "front":
      snapshot.bricks.forEach((brick) => {
        for (let z = brick.z1; z < brick.z1 + brick.height; z++) {
          for (let x = brick.x1; x < brick.x1 + brick.length; x++) {
            view.set(
              encodeLocation({ x, y: snapshot.maxHeight - z }),
              brick.label
            );
          }
        }
      });
      break;
    case "side":
      snapshot.bricks.forEach((brick) => {
        for (let z = brick.z1; z < brick.z1 + brick.height; z++) {
          for (let y = brick.y1; y < brick.y1 + brick.width; y++) {
            view.set(
              encodeLocation({ x: y, y: snapshot.maxHeight - z }),
              brick.label
            );
          }
        }
      });
      break;
  }

  simStr += "\n";

  for (let z = 0; z < snapshot.maxHeight + 1; z++) {
    switch (orientation) {
      case "front":
        for (let x = 0; x < snapshot.maxLength + 1; x++) {
          simStr += view.get(encodeLocation({ y: z, x }));
        }
        simStr += ` ${snapshot.maxHeight - z}`;
        break;
      case "side":
        for (let y = 0; y < snapshot.maxWidth + 1; y++) {
          simStr += view.get(encodeLocation({ y: z, x: y }));
        }
        simStr += ` ${snapshot.maxHeight - z}`;
        break;
    }
    simStr += "\n";
  }

  //   simStr += `${
  //     orientation === "front"
  //       ? "-".repeat(snapshot.maxLength + 1)
  //       : "-".repeat(snapshot.maxWidth + 1)
  //   } 0`;

  return simStr;
};

try {
  const useExample = true;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input: string = fs.readFileSync(filePath, "utf8");

  const snapshot = parseSnapshot(input);
  //   console.log(snapshot);

  //   console.log(parseBrickLine("2,2,2~2,2,2"));
  //   console.log(bricksToString(snapshot, "side"));
  console.log(snapshot.bricks);
  snapshot.bricks.sort((a, b) => a.z1 - b.z1);
  const brickMap = bricksToBrickMapAlt(snapshot.bricks);
  console.log(brickMap);
  brickMap.forEach((location, brickLabel) => {
    let valid = true;
    while (valid) {
      const movedA = moveBrickLocationDown(brickMap.get("A") ?? []);
      valid = isValidLocation(movedA, brickMap);
    }
  });
  console.log(movedA);
} catch (e: any) {
  console.log("Error:", e.stack);
}
