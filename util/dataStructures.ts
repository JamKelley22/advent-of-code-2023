//https://www.geeksforgeeks.org/implementation-graph-javascript/
export class Graph<T> {
  noOfVertices: number;
  AdjList: Map<T, T[]>;
  isDirected: boolean;
  constructor(noOfVertices: number, isDirected: boolean = false) {
    this.noOfVertices = noOfVertices;
    this.AdjList = new Map();
    this.isDirected = isDirected;
  }

  addVertex(v: T) {
    this.AdjList.set(v, []);
  }

  addEdge(v: T, w: T) {
    this.AdjList.get(v)?.push(w);
    // If graph is undirected,
    // add an edge from w to v also
    if (!this.isDirected) this.AdjList.get(w)?.push(v);
  }

  printGraph() {
    var get_keys = this.AdjList.keys();

    for (var i of get_keys) {
      var get_values = this.AdjList.get(i);
      var conc = "";

      for (var j of get_values || []) conc += j + " ";

      console.log(i + " -> " + conc);
    }
  }
}
