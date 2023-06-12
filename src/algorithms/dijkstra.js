export default function dijkstra(matrix, source) {
  const V = matrix.length;

  const states = [{
    nodes: Array(V).fill({visited: false}),
    edges: []
  }];

  const visitedAndDistance = [];

  for (let i = 0; i < V; i++) {
    visitedAndDistance.push([false, Infinity]);
  }

  visitedAndDistance[source][1] = 0;

  const lastState = states.slice(-1)[0]
  const newState = {
    nodes: visitedAndDistance.map(([visited, distance], i) => ({visited: i === source, label: distance})),
    edges: lastState.edges
  }
  states.push(newState);

  for (let count = 0; count < V - 1; count++) {
    const u = minDistance(visitedAndDistance);
    visitedAndDistance[u][0] = true;

    for (let v = 0; v < V; v++) {
      if (
        !visitedAndDistance[v][0] &&
        matrix[u][v] &&
        visitedAndDistance[u][1] + matrix[u][v] < visitedAndDistance[v][1]
      ) {
        visitedAndDistance[v][1] = visitedAndDistance[u][1] + matrix[u][v];
        console.log("visitedAndDistance", visitedAndDistance)
        const lastState = states.slice(-1)[0]
        const newState = {
          nodes: visitedAndDistance.map(([visited, distance], i) => ({visited: lastState.nodes[i].visited || (i === v), label: distance})),
          edges: [...lastState.edges, {start: u, end: v}]
        }
        states.push(newState);
      }
    }
  }

  return states
}

function minDistance(visitedAndDistance) {
  let min = Infinity;
  let minIndex = -1;
  const V = visitedAndDistance.length;

  for (let v = 0; v < V; v++) {
    if (!visitedAndDistance[v][0] && visitedAndDistance[v][1] <= min) {
      min = visitedAndDistance[v][1];
      minIndex = v;
    }
  }

  return minIndex;
}
//
//
// const matrix = [
//   [0, 0, 1, 2, 0, 0, 0],
//   [0, 0, 2, 0, 0, 3, 0],
//   [1, 2, 0, 1, 3, 0, 0],
//   [2, 0, 1, 0, 0, 0, 1],
//   [0, 0, 3, 0, 0, 2, 0],
//   [0, 3, 0, 0, 2, 0, 1],
//   [0, 0, 0, 1, 0, 1, 0]
// ];
// const source = 2;
// const result = dijkstra(matrix, source);
//
// console.log("result", result.map(state => state.nodes));
//
