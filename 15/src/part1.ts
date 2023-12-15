var fs = require("fs");
const util = require("util");

export const hash = (char: string, cv: number): number => {
  if (char.length > 1) {
    throw new Error("Char can only be length 1");
  }
  let value = (cv += char.charCodeAt(0));
  value *= 17;
  value %= 256;
  return value;
};

try {
  const useExample = false;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input: string = fs.readFileSync(filePath, "utf8");

  const steps = input.split(",");

  const sum = steps.reduce((acc, step) => {
    const chars = step.split("");
    let cV = 0;
    chars.forEach((char) => {
      cV = hash(char, cV);
    });
    console.log({ step, cV });

    return acc + cV;
  }, 0);
  console.log({ sum });
} catch (e: any) {
  console.log("Error:", e.stack);
}
