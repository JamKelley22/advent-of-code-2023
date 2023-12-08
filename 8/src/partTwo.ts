// import { Graph } from "./engine";

import { lcm } from "./engine";

// var fs = require("fs");
// const util = require("util");

// export const parseInstructions = (line: string): boolean[] => {
//   return line.split("").map((char) => (char === "R" ? true : false));
// };

// export const parseDessertMap = (
//   lines: string[]
// ): {
//   dessertMap: Map<string, { left: string; right: string }>;
//   dessertGraph: Graph<string>;
//   startingNodes: string[];
//   endingNodes: string[];
// } => {
//   const dessertMap = new Map<string, { left: string; right: string }>();
//   const backwardsMap = new Map<string, string>();
//   const startingNodes = [] as string[];
//   const endingNodes = [] as string[];

//   lines.forEach((line) => {
//     const [loc, leftRight] = line.split(" = ");
//     const [left, right] = leftRight.slice(1, leftRight.length - 1).split(", ");
//     dessertMap.set(loc, { left, right });
//     if (loc[loc.length - 1] === "A") startingNodes.push(loc);
//     if (loc[loc.length - 1] === "Z") endingNodes.push(loc);
//   });

//   //   console.log(dessertMap);
//   const dessertGraph = new Graph<string>(dessertMap.size);
//   [...dessertMap].forEach(([loc, { left, right }]) => {
//     dessertGraph.addVertex(loc);
//   });

//   //   console.log(backwardsMap);

//   return { dessertMap, startingNodes, endingNodes, dessertGraph };
// };

// try {
//   const useExample = true;
//   const filePath = useExample ? "input-example3.txt" : "input.txt";
//   const input = fs.readFileSync(filePath, "utf8");

//   const lines: string[] = input.split("\n");
//   const instructions = parseInstructions(lines.shift() ?? "");
//   // Throw away the empty line
//   lines.shift();

//   const dessertMap = parseDessertMap(lines);

//   console.log(dessertMap.startingNodes[0]);
//   console.log(dessertMap.endingNodes[0]);
//   dessertMap.dessertGraph.printGraph();

//   let numSteps = 0;

//   console.log(numSteps);

//   // ==============================

//   //   var g = new Graph(6);
//   //   var vertices = ["A", "B", "C", "D", "E", "F"];

//   //   // adding vertices
//   //   for (var i = 0; i < vertices.length; i++) {
//   //     g.addVertex(vertices[i]);
//   //   }

//   //   // adding edges
//   //   g.addEdge("A", "B");
//   //   g.addEdge("A", "D");
//   //   g.addEdge("A", "E");
//   //   g.addEdge("B", "C");
//   //   g.addEdge("D", "E");
//   //   g.addEdge("E", "F");
//   //   g.addEdge("E", "C");
//   //   g.addEdge("C", "F");

//   //   // prints all vertex and
//   //   // its adjacency list
//   //   // A -> B D E
//   //   // B -> A C
//   //   // C -> B E F
//   //   // D -> A E
//   //   // E -> A D F C
//   //   // F -> E C
//   //   g.printGraph();
// } catch (e: any) {
//   console.log("Error:", e.stack);
// }

var fs = require("fs");
const util = require("util");

export const parseInstructions = (line: string): boolean[] => {
  return line.split("").map((char) => (char === "R" ? true : false));
};

export const parseDessertMap = (
  lines: string[]
): {
  dessertMap: Map<string, { left: string; right: string }>;
  startingNodes: string[];
} => {
  const dessertMap = new Map<string, { left: string; right: string }>();
  const startingNodes = [] as string[];

  lines.forEach((line) => {
    const [loc, leftRight] = line.split(" = ");
    const [left, right] = leftRight.slice(1, leftRight.length - 1).split(", ");
    dessertMap.set(loc, { left, right });
    if (loc[loc.length - 1] === "A") startingNodes.push(loc);
  });

  return { dessertMap, startingNodes };
};

try {
  const useExample = false;
  const filePath = useExample ? "input-example3.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  const lines: string[] = input.split("\n");
  const instructions = parseInstructions(lines.shift() ?? "");
  // Throw away the empty line
  lines.shift();

  const dessertMap = parseDessertMap(lines);
  const locs = dessertMap.startingNodes;

  const stepsPerStartingLocation = locs.map((loc) => {
    let numSteps = 0;
    let currentLoc = loc;
    for (
      let instructionIndex = 0;
      currentLoc[loc.length - 1] !== "Z";
      instructionIndex = (instructionIndex + 1) % instructions.length
    ) {
      numSteps++;
      const isRight = instructions[instructionIndex];
      const { left, right } = dessertMap.dessertMap.get(currentLoc) ?? {};
      if (isRight) currentLoc = right ?? "";
      else currentLoc = left ?? "";
    }
    return numSteps;
  });

  console.log(stepsPerStartingLocation.reduce((acc, num) => lcm(acc, num), 1));

  //   const res = [12, 15, 75].reduce((acc, num) => lcm(acc, num), 1);
  //   console.log(res);
} catch (e: any) {
  console.log("Error:", e.stack);
}
