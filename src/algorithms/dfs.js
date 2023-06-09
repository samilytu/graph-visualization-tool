// src/algorithms/dfs.js
export default function dfs(adjacencyList, startNode) {
  const visitedNodes = new Set();
  const visitedEdges = [];
  let componentCount = 0;
  const result = [];
  console.log("typeof adjacencyList", typeof adjacencyList);
  console.log(adjacencyList);

  const stack = [startNode];
  componentCount++;

  while (stack.length > 0) {
    const node = stack.pop();

    if (!visitedNodes.has(node)) {
      visitedNodes.add(node);
      result.push(node);

      // sort neighbours in ascending order before pushing into the stack
      const neighbours = adjacencyList[node];
      neighbours.sort((a, b) => a - b);

      for (const neighbour of neighbours) {
        if (!visitedNodes.has(neighbour)) {
          stack.push(neighbour);
          visitedEdges.push({ start: node, end: neighbour });
        }
      }
    }
  }

  console.log(`Total connected components: ${componentCount}`);
  console.log(`Visited nodes: ${Array.from(visitedNodes).join(", ")}`);
  console.log(`Visited edges: ${JSON.stringify(visitedEdges)}`);

  return {
    result,
    visitedNodes: Array.from(visitedNodes),
    visitedEdges,
    componentCount,
  };
}
