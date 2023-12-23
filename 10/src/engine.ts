//https://www.geeksforgeeks.org/implementation-graph-javascript/
export class Graph<T extends string | number> {
  AdjList: Map<T, T[]>;
  isDirected: boolean;
  constructor(isDirected: boolean = false) {
    this.AdjList = new Map();
    this.isDirected = isDirected;
  }

  addVertex(v: T) {
    if (!this.AdjList.has(v)) this.AdjList.set(v, []);
  }

  removeVertex(v: T) {
    if (this.AdjList.has(v)) this.AdjList.delete(v);
  }

  addEdge(v: T, w: T) {
    this.AdjList.get(v)?.push(w);
    // If graph is undirected,
    // add an edge from w to v also

    if (!this.isDirected) {
      let wVertex = this.AdjList.get(w);
      if (!wVertex) {
        this.addVertex(w);
        wVertex = this.AdjList.get(w);
      }
      wVertex?.push(v);
    }
  }
  removeEdge(v: T, w: T) {
    console.log(v, w);

    const newAdjList = this.AdjList.get(v)?.filter((val) => val !== w);
    if (newAdjList) this.AdjList.set(v, newAdjList);
    // If graph is undirected,
    // add an edge from w to v also

    // if (!this.isDirected) {
    //   let wVertex = this.AdjList.get(w);
    //   if (!wVertex) {
    //     this.addVertex(w);
    //     wVertex = this.AdjList.get(w);
    //   }
    //   wVertex?.push(v);
    // }
  }

  printGraph() {
    let get_keys = this.AdjList.keys();

    for (let i of get_keys) {
      let get_values = this.AdjList.get(i);
      let conc = "";

      for (let j of get_values || []) conc += j + " ";

      console.log(i + " -> " + conc);
    }
  }

  bfs(startingNode: T, visit?: (vert: T, dist: number) => void) {
    // create a visited object
    let visited: Partial<{ [key in T]: boolean }> = {};
    let count = 0;

    // Create an object for queue
    let q: T[] = []; //new Queue();

    // add the starting node to the queue
    visited[startingNode] = true;
    q.push(startingNode);

    // loop until queue is empty
    while (q.length !== 0) {
      // get the element from the queue
      let getQueueElement = q.shift();

      // passing the current vertex to callback function
      // console.log(getQueueElement);

      // get the adjacent list for current vertex
      if (getQueueElement) {
        visit?.(getQueueElement, ++count);
        const list = this.AdjList.get(getQueueElement);
        if (list) {
          for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (!visited[element]) {
              visited[element] = true;
              q.push(element);
            }
          }
        }
      }

      // loop through the list and add the element to the
      // queue if it is not processed yet
    }
  }

  dfs(startingNode: T, visit?: (vert: T, dist: number) => void) {
    let visited: Partial<{ [key in T]: boolean }> = {};

    this.DFSUtil(startingNode, visited, 0, visit);

    // const processStack = [startingNode]

    // while(processStack.length > 0) {

    // }
  }

  DFSUtil(
    vert: T,
    visited: Partial<{ [key in T]: boolean }>,
    dist: number,
    visit?: (vert: T, dist: number) => void
  ) {
    visited[vert] = true;

    visit?.(vert, dist);

    let neighbors = this.AdjList.get(vert);
    // console.log(`${vert}: `, neighbors);

    if (neighbors) {
      for (let i in neighbors) {
        let get_elem = neighbors[i];
        if (!visited[get_elem])
          this.DFSUtil(get_elem, visited, dist + 1, visit);
      }
    }
  }

  dijkstra(startingNode: T) {
    // Init dist map
    const distances: Partial<{ [key in T]: number }> = {};
    let queue: T[] = [];
    this.AdjList.forEach((value, key) => {
      distances[key] = Number.MAX_SAFE_INTEGER;
      queue.push(key);
    });
    distances[startingNode] = 0;
    // const visited = new Set<T>();

    let count = 0;
    while (queue.length !== 0) {
      count++;

      let minDistance = Number.MAX_SAFE_INTEGER;
      let node: T | undefined = undefined;
      for (let i = 0; i < queue.length; i++) {
        const element = queue[i];
        // if (visited.has(element)) continue;
        if (distances[element]! <= minDistance) {
          minDistance = distances[element]!;
          node = element;
        }
      }
      //   console.log(node);

      queue = queue.filter((item) => item !== node);

      if (node) {
        const a = distances[node]!;
        this.AdjList.get(node)?.forEach((neighbor) => {
          const newDist = a + 1;
          if (newDist < distances[neighbor]!) {
            distances[neighbor] = newDist;
          }
        });
      }

      //   console.log("distances", distances);
      //   if (count === 10) break;
    }
    return distances;
  }
}
