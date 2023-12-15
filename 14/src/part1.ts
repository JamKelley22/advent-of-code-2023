var fs = require("fs");
const util = require("util");

try {
  const useExample = true;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input: string = fs.readFileSync(filePath, "utf8");

  const lines = input.split("\n");
} catch (e: any) {
  console.log("Error:", e.stack);
}
