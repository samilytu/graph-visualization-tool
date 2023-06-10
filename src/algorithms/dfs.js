// src/algorithms/dfs.js
export default function dfs(adjacencyList, startNode) {
  const visitedNodes = new Set();
  const visitedEdges = [];
  let componentCount = 1;
  const result = [];

  const stack = [startNode];
  console.log("stack", stack);
  console.log("adjacencyList", adjacencyList);
  console.log("startNode", startNode);

  while (stack.length) {
    const node = stack.pop();
    console.log("adjacencyList[node]2", adjacencyList[node]);

    if (!visitedNodes.has(node)) {
      visitedNodes.add(node);
      result.push(node);

      // sort neighbours in ascending order before pushing into the stack
      const neighbours = adjacencyList[node];
      neighbours.sort((a, b) => b - a);
      console.log("visited Nodes", visitedNodes);
      console.log("adjacencyList[node]", adjacencyList[node]);
      console.log("neighbours", neighbours);
      for (const neighbour of neighbours) {

        console.log("visitedNodes.has(neighbour)", visitedNodes.has(neighbour));
        if (!visitedNodes.has(neighbour)) {
          stack.push(neighbour);
          visitedEdges.push({ start: node, end: neighbour });
          console.log("visitedEdges00", visitedEdges);
        }
      }
    }
  }
  console.log("visitedEdges3", visitedEdges);
  // If there are nodes that have not been visited, run DFS on them
  for (let i = 0; i < adjacencyList.length; i++) {
    if (!visitedNodes.has(i)) {
      stack.push(i);

      while (stack.length > 0) {
        const node = stack.pop();

        if (!visitedNodes.has(node)) {
          visitedNodes.add(node);
          result.push(node);
          console.log("result", result);

          // sort neighbours in ascending order before pushing into the stack
          const neighbours = adjacencyList[node];
          neighbours.sort((a, b) => a - b);

          for (const neighbour of neighbours) {
            if (!visitedNodes.has(neighbour)) {
              stack.push(neighbour);
              visitedEdges.push({ start: node, end: neighbour });
              console.log("component arttı2: ", componentCount);
            }
          }
        }
      }
    }
  }

  console.log(`Total connected components: ${componentCount}`);
  console.log(`Visited nodes: ${Array.from(visitedNodes).join(", ")}`);
  console.log(`Visited edges: ${JSON.stringify(visitedEdges)}`);
  console.log(`Result: ${result.join(", ")}`);

  return {
    result,
    visitedNodes: Array.from(visitedNodes),
    visitedEdges,
    componentCount,
    startNode,
  };
}
