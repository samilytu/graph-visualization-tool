// src/algorithms/bfs.js
export default function bfs(adjacencyList, startNode) {
  const visitedNodes = new Set();
  const visitedEdges = [];
  const queue = [startNode];

  console.log(`BFS started at node ${startNode}`); // initial log

  while (queue.length > 0) {
    const node = queue.shift(); // remove the first node from the queue
    if (!visitedNodes.has(node)) {
      visitedNodes.add(node);
      console.log(`Visited node ${node}`); // log when a node is visited
      for (const neighbour of adjacencyList[node]) {
        queue.push(neighbour);
        visitedEdges.push({ start: node, end: neighbour });
        console.log(`Visited edge from node ${node} to node ${neighbour}`); // log when an edge is visited
      }
    }
  }
  console.log("Visited nodes:", Array.from(visitedNodes)); // Logs the visited nodes at the end
  console.log("Visited edges:", visitedEdges); // Logs the visited edges at the end
  return visitedEdges;
}
