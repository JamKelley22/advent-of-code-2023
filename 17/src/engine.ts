export type Location = {
  x: number;
  y: number;
};

export const encodeLocation = (loc: Location): string => `[${loc.x},${loc.y}]`;
export const decodeLocation = (locStr: string): Location => {
  const [x, y] = locStr
    .slice(1, locStr.length - 1)
    .split(",")
    .map((coordStr) => parseInt(coordStr));
  return { x, y };
};

export const Directions = ["North", "South", "East", "West"] as const;
type Direction = (typeof Directions)[number];

export const travelDirection = (
  currentLocation: Location,
  direction: Direction
): Location => {
  let { x, y } = currentLocation;
  switch (direction) {
    case "East":
      return { x: x + 1, y };
    case "South":
      return { x, y: y + 1 };
    case "West":
      return { x: x - 1, y };
    case "North":
      return { x, y: y - 1 };
  }
};

export class Graph {
  private adjacencyList: Map<string, Array<[string, number]>>;

  constructor() {
    this.adjacencyList = new Map();
  }

  addVertex(vertex: string) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(vertex1: string, vertex2: string, weight: number) {
    if (!vertex1) this.addVertex(vertex1);
    if (!vertex2) this.addVertex(vertex2);

    this.adjacencyList.get(vertex1)?.push([vertex2, weight]);
    this.adjacencyList.get(vertex2)?.push([vertex1, weight]);
  }

  getNeighbors(vertex: string) {
    return this.adjacencyList.get(vertex) || [];
  }

  toString() {
    let result = "";
    for (const [vertex, edges] of this.adjacencyList) {
      const edgeList = edges
        .map(([neighbor, weight]) => `${neighbor}(${weight})`)
        .join(", ");
      result += `${vertex} -> [${edgeList}]\n`;
    }
    return result;
  }

  dijkstra(
    startVertex: string
  ): Map<string, { distance: number; path: string[] }> {
    const distances = new Map<string, { distance: number; path: string[] }>();
    const visited = new Set<string>();

    for (const vertex of this.adjacencyList.keys()) {
      distances.set(vertex, { distance: Number.MAX_SAFE_INTEGER, path: [] });
    }

    distances.set(startVertex, { distance: 0, path: [] });

    while (visited.size < this.adjacencyList.size) {
      const currentVertex = this.getMinDistanceVertex(distances, visited);
      if (!currentVertex) {
        break;
      }
      visited.add(currentVertex);

      for (const [neighbor, weight] of this.adjacencyList.get(currentVertex) ||
        []) {
        if (!visited.has(neighbor)) {
          const newDistance = distances.get(currentVertex)!.distance + weight;

          if (newDistance < distances.get(neighbor)!.distance) {
            distances.set(neighbor, {
              distance: newDistance,
              path: [...distances.get(currentVertex)!.path, currentVertex],
            });
          }
        }
      }
    }

    return distances;
  }

  private getMinDistanceVertex(
    distances: Map<string, { distance: number; path: string[] }>,
    visited: Set<string>
  ): string | undefined {
    let minDistance = Infinity;
    let minVertex: string | undefined;

    for (const [vertex, info] of distances) {
      if (!visited.has(vertex) && info.distance < minDistance) {
        minDistance = info.distance;
        minVertex = vertex;
      }
    }

    return minVertex;
  }
}
