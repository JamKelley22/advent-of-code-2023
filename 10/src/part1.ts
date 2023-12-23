import { Graph } from "./engine";

var fs = require("fs");
const util = require("util");

// | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90-degree bend connecting north and east.
// J is a 90-degree bend connecting north and west.
// 7 is a 90-degree bend connecting south and west.
// F is a 90-degree bend connecting south and east.
// . is ground; there is no pipe in this tile.
// S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.

export const Space = ["|", "-", "L", "J", "7", "F", ".", "S"] as const;
type SpaceType = (typeof Space)[number];
export const Direction = ["North", "South", "East", "West"] as const;
type DirectionType = (typeof Direction)[number];

//─│┌ ┐└ ┘
//═║╔ ╗╚ ╝
export const SpaceToCharacterOptions: Map<SpaceType, string>[] = [
  new Map<SpaceType, string>([
    ["-", "─"],
    [".", "."],
    ["7", "┐"],
    ["F", "┌"],
    ["J", "┘"],
    ["L", "└"],
    ["S", "S"],
    ["|", "│"],
  ]),
  new Map<SpaceType, string>([
    ["-", "═"],
    [".", "."],
    ["7", "╗"],
    ["F", "╔"],
    ["J", "╝"],
    ["L", "╚"],
    ["S", "S"],
    ["|", "║"],
  ]),
];

function isOfTypeSpace(keyInput: string): keyInput is SpaceType {
  return Space.includes(keyInput as SpaceType);
}

const getSpaceEncodedString = (
  i: number,
  j: number,
  space?: SpaceType
): string => `[${i},${j}]`;

const spaceDirMap = new Set<string>([
  `${"|" satisfies SpaceType}-${"North" satisfies DirectionType}`,
  `${"|" satisfies SpaceType}-${"South" satisfies DirectionType}`,

  `${"-" satisfies SpaceType}-${"East" satisfies DirectionType}`,
  `${"-" satisfies SpaceType}-${"West" satisfies DirectionType}`,

  `${"L" satisfies SpaceType}-${"North" satisfies DirectionType}`,
  `${"L" satisfies SpaceType}-${"East" satisfies DirectionType}`,

  `${"J" satisfies SpaceType}-${"North" satisfies DirectionType}`,
  `${"J" satisfies SpaceType}-${"West" satisfies DirectionType}`,

  `${"7" satisfies SpaceType}-${"South" satisfies DirectionType}`,
  `${"7" satisfies SpaceType}-${"West" satisfies DirectionType}`,

  `${"F" satisfies SpaceType}-${"East" satisfies DirectionType}`,
  `${"F" satisfies SpaceType}-${"South" satisfies DirectionType}`,
]);

type Grid = {
  spaces: Map<string, SpaceType>;
  graph: Graph<string>;
};

type Location = {
  i: number;
  j: number;
};

export const parseGridToSpaceMatrix = (
  lines: string[]
): { spaceMatrix: SpaceType[][]; startLoc?: Location } => {
  let startLoc: Location | undefined = undefined;
  const spaceMatrix = lines.map((line, i) =>
    line.split("").reduce((acc, spaceStr, j) => {
      if (isOfTypeSpace(spaceStr)) {
        if (spaceStr === "S") startLoc = { i, j };
        return [...acc, spaceStr];
      }
      return acc;
    }, [] as SpaceType[])
  );
  return {
    spaceMatrix,
    startLoc,
  };
};
export const parseGridToSpaceMap = (
  spaceMatrix: SpaceType[][]
): Map<string, SpaceType> => {
  const map = new Map<string, SpaceType>();

  for (let i = 0; i < spaceMatrix.length; i++) {
    const spaceLine = spaceMatrix[i];
    for (let j = 0; j < spaceLine.length; j++) {
      const space = spaceLine[j];
      if (space !== ".") map.set(getSpaceEncodedString(i, j, space), space);
    }
  }

  return map;
};
export const parseGridToGraph = (spaceMatrix: SpaceType[][]): Graph<string> => {
  const graph = new Graph<string>(false);

  for (let i = 0; i < spaceMatrix.length; i++) {
    const spaceLine = spaceMatrix[i];
    for (let j = 0; j < spaceLine.length; j++) {
      const space = spaceLine[j];
      const spaceCoords = getSpaceEncodedString(i, j, space);
      if (space !== ".") graph.addVertex(spaceCoords);
      //I think we only need to look right and down since we
      // 1. only have right angles and
      // 2. we are traversing top to bottom and left to right and
      // 3. the graph is undirected

      // Look right and add edge
      if (j < spaceLine.length - 1) {
        const rightSpace = spaceMatrix[i][j + 1];
        const spaceCoordsRight = getSpaceEncodedString(i, j + 1, rightSpace);
        const rightSpaceConnects = spaceDirMap.has(`${rightSpace}-West`); //Opposite since we are checking right to left here

        if (rightSpaceConnects) {
          graph.addEdge(spaceCoords, spaceCoordsRight);
          //   console.log(
          //     `${spaceCoords},${space} right to ${spaceCoordsRight},${rightSpace}`
          //   );
        }
      }

      // Look down and add edge
      if (i < spaceMatrix.length - 1) {
        const downSpace = spaceMatrix[i + 1][j];
        const spaceCoordsDown = getSpaceEncodedString(i + 1, j, downSpace);
        const downSpaceConnects = spaceDirMap.has(`${downSpace}-North`); //Opposite since we are checking right to left here

        if (downSpaceConnects) {
          graph.addEdge(spaceCoords, spaceCoordsDown);
          //   console.log(
          //     `${spaceCoords},${space} down to ${spaceCoordsDown},${downSpace}`
          //   );
        }
      }
    }
  }

  return graph;
};

export const spaceMatrixToString = (spaceMatrix: SpaceType[][]): string => {
  let ret = "  ";
  [...new Array(spaceMatrix[0].length).keys()].forEach(
    (num, i) => (ret += i + " ")
  );
  ret += "\n";
  for (let i = 0; i < spaceMatrix.length; i++) {
    const spaceLine = spaceMatrix[i];
    ret += i + " ";
    for (let j = 0; j < spaceLine.length; j++) {
      const space = spaceLine[j];
      const convertedSpace = SpaceToCharacterOptions[1].get(space);
      ret += convertedSpace + " ";
    }
    ret += "\n";
  }
  return ret;
};

export const printDistances = (
  distances: Partial<{
    [x: string]: number;
  }>,
  spaceMatrix: SpaceType[][]
): string => {
  let ret = "  ";
  [...new Array(spaceMatrix[0].length).keys()].forEach(
    (num, i) => (ret += i + " ")
  );
  ret += "\n";
  for (let i = 0; i < spaceMatrix.length; i++) {
    const spaceLine = spaceMatrix[i];
    ret += i + " ";
    for (let j = 0; j < spaceLine.length; j++) {
      const space = spaceLine[j];
      const dist = distances[getSpaceEncodedString(i, j, space)];
      if (dist !== undefined) {
        ret += `${dist % 10} `;
        continue;
      }
      ret += space + " ";
    }
    ret += "\n";
  }

  return ret;
};

export const identifyStartSpace = (
  spaceMap: Map<string, SpaceType>,
  startLoc: Location
): SpaceType => {
  //Look around start for available pipes to connect
  const northOfStart = spaceMap.get(
    getSpaceEncodedString(startLoc.i - 1, startLoc.j)
  );
  const southOfStart = spaceMap.get(
    getSpaceEncodedString(startLoc.i + 1, startLoc.j)
  );
  const eastOfStart = spaceMap.get(
    getSpaceEncodedString(startLoc.i, startLoc.j + 1)
  );
  const westOfStart = spaceMap.get(
    getSpaceEncodedString(startLoc.i, startLoc.j - 1)
  );

  const northSpaceConnects = spaceDirMap.has(`${northOfStart}-South`);
  const southSpaceConnects = spaceDirMap.has(`${southOfStart}-North`);
  const eastSpaceConnects = spaceDirMap.has(`${eastOfStart}-West`);
  const westSpaceConnects = spaceDirMap.has(`${westOfStart}-East`);

  //All = ─│┌ ┐└ ┘
  let startSpace: SpaceType = "S";
  if (eastSpaceConnects && westSpaceConnects) {
    startSpace = "-";
  } else if (northSpaceConnects && southSpaceConnects) {
    startSpace = "|";
  } else if (southSpaceConnects && eastSpaceConnects) {
    startSpace = "F";
  } else if (southSpaceConnects && westSpaceConnects) {
    startSpace = "7";
  } else if (northSpaceConnects && eastSpaceConnects) {
    startSpace = "L";
  } else if (northSpaceConnects && westSpaceConnects) {
    startSpace = "J";
  } else {
    throw new Error("Could not identify startSpace");
  }

  return startSpace;
};

export const removeNonMainLoopNodes = (
  spaceGraph: Graph<string>,
  spaceMap: Map<string, SpaceType>,
  startLoc: Location
) => {
  // const adjacentNodes = spaceGraph.AdjList.get(
  //   getSpaceEncodedString(startLoc.i, startLoc.j)
  // );
  spaceGraph.AdjList.forEach((adjNodes, node) => {
    if (adjNodes.length < 2) {
      spaceGraph.removeVertex(node);
    }
    if (adjNodes.length > 2) {
      // console.log("node", node);

      const [x, y] = node
        .slice(1, node.length - 1)
        .split(",")
        .map((numStr) => parseInt(numStr));
      const nodeLoc: Location = { i: x, j: y };
      const north = getSpaceEncodedString(nodeLoc.i - 1, nodeLoc.j); //getSpaceEncodedString(startLoc.i - 1, startLoc.j);

      const south = getSpaceEncodedString(nodeLoc.i + 1, nodeLoc.j);

      const east = getSpaceEncodedString(nodeLoc.i, nodeLoc.j + 1);

      const west = getSpaceEncodedString(nodeLoc.i, nodeLoc.j - 1);

      // console.log(north, east, south, west);

      const validConnections: string[] = [];

      switch (spaceMap.get(node)) {
        case "-":
          validConnections.push(east, west);
          break;
        case "|":
          validConnections.push(north, south);
          break;
        case "7":
          validConnections.push(west, south);
          break;
        case "F":
          validConnections.push(east, south);
          break;
        case "J":
          validConnections.push(north, west);
          break;
        case "L":
          validConnections.push(north, east);
          break;
      }

      for (
        let adjNodeIndex = 0;
        adjNodeIndex < adjNodes.length;
        adjNodeIndex++
      ) {
        const adjNode = adjNodes[adjNodeIndex];
        if (!validConnections.includes(adjNode)) {
          spaceGraph.removeEdge(node, adjNode);
        }
      }

      // console.log(
      //   node,
      //   SpaceToCharacterOptions[1].get(spaceMap.get(node) ?? ".")
      // );
    }
  });
};

try {
  const useExample = false;
  const filePath = useExample ? "input-example3.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  const lines: string[] = input.split("\n");
  const { spaceMatrix, startLoc } = parseGridToSpaceMatrix(lines);

  if (!startLoc) throw new Error("Could not locate start location");

  const spaceMap = parseGridToSpaceMap(spaceMatrix);

  const startSpace = identifyStartSpace(spaceMap, startLoc);
  spaceMap.set(getSpaceEncodedString(startLoc.i, startLoc.j), startSpace);
  spaceMatrix[startLoc.i][startLoc.j] = startSpace;

  console.log({ startSpace });

  // console.log(spaceMatrixToString(spaceMatrix));

  // console.log("startLoc", startLoc);

  console.log(spaceMatrixToString(spaceMatrix));

  const spaceGraph = parseGridToGraph(spaceMatrix);
  removeNonMainLoopNodes(spaceGraph, spaceMap, startLoc);

  const startLocString = getSpaceEncodedString(
    startLoc?.i ?? 0,
    startLoc?.j ?? 0
  );

  // console.log(spaceGraph);

  const connectedNodes: string[] = [];

  spaceGraph.bfs(startLocString, (vert, dist) => {
    // console.log(vert, dist);
    connectedNodes.push(vert);
  });

  console.log(connectedNodes.length / 2);

  // spaceGraph.AdjList.forEach((val, key) => {
  //   if (!connectedNodes.includes(key)) {
  //     console.log("Remove: ", key);

  //     spaceGraph.removeVertex(key);
  //   }
  // });

  // console.log(spaceGraph);

  // const distances = spaceGraph.dijkstra(startLocString);
  // console.log(printDistances(distances, spaceMatrix));

  // let maxDist = Number.MIN_SAFE_INTEGER;
  // Object.keys(distances).forEach((key) => {
  //   const value = distances[key]!;
  //   if (value > maxDist && value !== Number.MAX_SAFE_INTEGER) {
  //     maxDist = value;
  //   }
  //   // console.log(`Key: ${key}, Value: ${value}`);
  // });

  // console.log(maxDist);

  // 4211 is too low

  // //   spaceGraph.printGraph();
} catch (e: any) {
  console.log("Error:", e.stack);
}
