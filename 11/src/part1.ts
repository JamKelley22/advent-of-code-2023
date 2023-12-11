var fs = require("fs");
const util = require("util");

try {
  const useExample = false;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  const lines: string[] = input.split("\n");
} catch (e: any) {
  console.log("Error:", e.stack);
}
