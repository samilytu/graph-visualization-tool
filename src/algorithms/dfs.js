// src/algorithms/dfs.js

export default function dfs(graph, start, visited = new Set(), nodeStack = [],
                            states = [{nodes: Array(graph.length).fill({visited: false}), edges: []}]) {
  visited.add(start)

  const lastState = states.slice(-1)[0]
  const lastNode = nodeStack.slice(-1)[0]
  const newState = {
    nodes: [...lastState.nodes.slice(0, start), {visited: true}, ...lastState.nodes.slice(start + 1)],
    edges: lastNode === undefined ? [] : [...lastState.edges, {start: lastNode, end: start}]
  }
  states.push(newState)

  const neighbours = [...graph[start]]
  neighbours.sort((a, b) => a - b)

  for (let neighbour of neighbours) {
    if (!visited.has(neighbour)) {
      nodeStack.push(start)
      dfs(graph, neighbour, visited, nodeStack, states)
    }
  }

  nodeStack.pop()

  return states
}