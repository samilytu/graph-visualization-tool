// src/algorithms/bfs.js
export default function bfs(graph, root) {
  const V = graph.length

  const states = [{
    nodes: Array(V).fill({visited: false}),
    edges: []
  }];

  const visited = new Set();
  const queue = [{from: undefined, to: root}];
  visited.add(root);

  while (queue.length > 0) {
    // Dequeue a vertex from queue
    const {from: lastNode, to: vertex} = queue.shift();

    console.log("vertex", vertex, "queue", queue, "visited", visited)

    const lastState = states.slice(-1)[0]
    const newState = {
      nodes: [...lastState.nodes.slice(0, vertex), {visited: true}, ...lastState.nodes.slice(vertex + 1)],
      edges: lastNode === undefined ? [] : [...lastState.edges, {start: lastNode, end: vertex}]
    }
    states.push(newState);

    const neighbours = [...graph[vertex]]
    neighbours.sort((a, b) => a - b)

    // If not visited, mark it as visited, and enqueue it
    for (const neighbour of neighbours) {
      if (!visited.has(neighbour)) {
        visited.add(neighbour);
        queue.push({from: vertex, to: neighbour});
      }
    }
  }

  return states;
}
//
// const adjacencyList = [
//   [1, 3],
//   [0, 2],
//   [0, 1, 4],
//   [0],
//   [2]
// ]
//
// const states = bfs(adjacencyList, 0);
// console.log("states", states.map(state => state.edges));