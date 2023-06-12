export default function prim(adjMatrix) {
  const states = [{nodes: [], edges: []}];

  const V = adjMatrix.length;
  // create an array to track selected vertex
  // selected will become true otherwise false
  const selected = [false, false, false, false, false];
  // set number of edge to 0
  let no_edge = 0;
  // the number of edges in minimum spanning tree will always be
  // less than (V - 1), where V is the number of vertices in the graph
  // choose 0th vertex and make it true
  selected[0] = true;
  // print for edge and weight
  console.log("Edge : Weight\n");
  while (no_edge < V - 1) {
    // For every vertex in the set S, find all adjacent vertices,
    // calculate the distance from the vertex selected at step 1.
    // If the vertex is already in the set S, discard it; otherwise,
    // choose another vertex nearest to the selected vertex at step 1.
    let minimum = Infinity;
    let x = 0;
    let y = 0;
    for (let i = 0; i < V; i++) {
      if (selected[i]) {
        for (let j = 0; j < V; j++) {
          if (!selected[j] && adjMatrix[i][j]) {
            // not in selected and there is an edge
            if (minimum > adjMatrix[i][j]) {
              minimum = adjMatrix[i][j];
              x = i;
              y = j;
            }
          }
        }
      }
    }
    console.log(`${x}-${y}: ${adjMatrix[x][y]}`);
    const lastState = states.slice(-1)[0]
    const newState = {
      nodes: [],
      edges: [...lastState.edges, { start: x, end: y }]
    }
    states.push(newState);

    selected[y] = true;
    no_edge += 1;
  }
  return states;
}
//
// // create a 2d array of size 5x5
// // for adjacency matrix to represent graph
// const G = [
//   [0, 9, 75, 0, 0],
//   [9, 0, 95, 19, 42],
//   [75, 95, 0, 51, 66],
//   [0, 19, 51, 0, 31],
//   [0, 42, 66, 31, 0]
// ];
//
// const res = prim(G);
// console.log(res.map(s => s.edges));