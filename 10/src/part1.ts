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

function isOfTypeSpace(keyInput: string): keyInput is SpaceType {
  return Space.includes(keyInput as SpaceType);
}

const getSpaceEncodedString = (
  i: number,
  j: number,
  space: SpaceType
): string => `[${i},${j}]-${space}`;

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
      ret += space + " ";
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
  let ret = "";

  for (let i = 0; i < spaceMatrix.length; i++) {
    const spaceLine = spaceMatrix[i];
    for (let j = 0; j < spaceLine.length; j++) {
      const space = spaceLine[j];
      const dist = distances[getSpaceEncodedString(i, j, space)];
      if (dist !== undefined) {
        ret += dist % 10;
        continue;
      }
      ret += space;
    }
    ret += "\n";
  }

  return ret;
};

try {
  const useExample = true;
  const filePath = useExample ? "input-example3.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  const lines: string[] = input.split("\n");
  const { spaceMatrix, startLoc } = parseGridToSpaceMatrix(lines);
  console.log("startLoc", startLoc);

  //   console.log(spaceMatrixToString(spaceMatrix));

  const spaceGraph = parseGridToGraph(spaceMatrix);
  const spaceMap = parseGridToSpaceMap(spaceMatrix);

  const startLocString = getSpaceEncodedString(
    startLoc?.i ?? 0,
    startLoc?.j ?? 0,
    "S"
  );

  console.log(spaceGraph);

  const connectedNodes: string[] = [];

  spaceGraph.dfs(startLocString, (vert, dist) => {
    // console.log(vert, dist);
    connectedNodes.push(vert);
  });

  console.log(connectedNodes);

  spaceGraph.AdjList.forEach((val, key) => {
    if (!connectedNodes.includes(key)) {
      console.log("Remove: ", key);

      spaceGraph.removeVertex(key);
    }
  });

  console.log(spaceGraph);

  //   const distances = spaceGraph.dijkstra(startLocString);
  //   console.log(printDistances(distances, spaceMatrix));

  //   let maxDist = Number.MIN_SAFE_INTEGER;
  //   Object.keys(distances).forEach((key) => {
  //     const value = distances[key]!;
  //     if (value > maxDist) {
  //       maxDist = value;
  //     }
  //     // console.log(`Key: ${key}, Value: ${value}`);
  //   });

  //   console.log(maxDist);

  //   spaceGraph.printGraph();
} catch (e: any) {
  console.log("Error:", e.stack);
}
