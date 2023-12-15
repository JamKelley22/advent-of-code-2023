var fs = require("fs");
const util = require("util");

type Box = {
  label: string;
  focalLength: number;
};

export const hash = (char: string, cv: number): number => {
  if (char.length > 1) {
    throw new Error("Char can only be length 1");
  }
  let value = (cv += char.charCodeAt(0));
  value *= 17;
  value %= 256;
  return value;
};

export const hashString = (str: string): number => {
  const chars = str.split("");
  let cV = 0;
  chars.forEach((char) => {
    cV = hash(char, cV);
  });
  return cV;
};

try {
  const useExample = false;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input: string = fs.readFileSync(filePath, "utf8");

  const steps = input.split(",");

  const boxes = new Map<number, Map<string, Box>>();

  steps.forEach((step) => {
    // console.log("=======================");

    const operation = step.includes("=") ? "=" : "-";
    const [label, focalLengthStr] = step.split(operation);
    const focalLength = parseInt(focalLengthStr);
    const hash = hashString(label);
    const targetBoxMap = boxes.get(hash) ?? new Map<string, Box>();
    if (operation === "-") {
      //Remove Lens
      targetBoxMap.delete(label);
    } else {
      //Add Lens w/ focal length
      targetBoxMap.set(label, { label, focalLength });
      //   boxes.set(hash, [...(boxes.get(hash) ?? []), { label, focalLength }]);
    }
    boxes.set(hash, targetBoxMap);

    // console.log(new Map(boxes));
  });
  const sum = [...boxes.entries()].reduce((accO, [boxNum, box]) => {
    return (
      accO +
      [...box.entries()].reduce((accI, [label, lens], lensIndex) => {
        //Focusing power =
        ////One plus the box number of the lens in question.
        ////The slot number of the lens within the box: 1 for the first lens, 2 for the second lens, and so on.
        ////The focal length of the lens.
        const fPower = (1 + boxNum) * (1 + lensIndex) * lens.focalLength;
        console.log({ label, fPower });
        return accI + fPower;
      }, 0)
    );
  }, 0);
  console.log({ sum });
} catch (e: any) {
  console.log("Error:", e.stack);
}
