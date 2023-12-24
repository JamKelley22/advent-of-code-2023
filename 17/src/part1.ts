import {
  Graph,
  decodeLocation,
  encodeLocation,
  travelDirection,
} from "./engine";

var fs = require("fs");
const util = require("util");
const readline = require("readline");

const parseHeatLossGraph = (map: Map<string, number>): Graph => {
  const heatLossGraph = new Graph();

  map.forEach((val, encodedLocation) => {
    heatLossGraph.addVertex(encodedLocation);
  });

  map.forEach((currWeight, encodedLocation) => {
    const loc = decodeLocation(encodedLocation);
    const north = travelDirection(loc, "North");
    const south = travelDirection(loc, "South");
    const east = travelDirection(loc, "East");
    const west = travelDirection(loc, "West");

    [north, south, east, west].forEach((dir) => {
      const dirLocationEncoded = encodeLocation(dir);
      const weight = map.get(dirLocationEncoded);
      if (weight) {
        heatLossGraph.addEdge(encodedLocation, dirLocationEncoded, weight);
      }
    });
  });

  return heatLossGraph;
};

const parseHeatLossMatrix = (
  input: string
): { heatLossMatrix: Map<string, number>; width: number; height: number } => {
  const heatLossMatrix = new Map<string, number>();
  const lines = input.split("\n");
  const height = lines.length,
    width = lines[0].length;
  lines.forEach((line, y) => {
    line.split("").forEach((char, x) => {
      heatLossMatrix.set(encodeLocation({ x, y }), parseInt(char));
    });
  });
  return { heatLossMatrix, height, width };
};

try {
  const useExample = true;
  const filePath = useExample ? "input-example1.txt" : "input.txt";
  const input: string = fs.readFileSync(filePath, "utf8");

  const { heatLossMatrix, width, height } = parseHeatLossMatrix(input);
  const heatLossGraph = parseHeatLossGraph(heatLossMatrix);

  //   console.log(heatLossGraph.getNeighbors(encodeLocation({ x: 0, y: 0 })));

  const distances = heatLossGraph.dijkstra(encodeLocation({ x: 0, y: 0 }));
  console.log(distances.get(`[${width - 1},${height - 1}]`));
} catch (e: any) {
  console.log("Error:", e.stack);
}
