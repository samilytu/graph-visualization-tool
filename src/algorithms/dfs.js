// src/algorithms/dfs.js

export default function dfs(graph, start, visited = new Set(), states = []) {
  visited.add(start)

  const lastState = states.slice(-1)[0] ?? { nodes: [], edges: [] }
  const lastNode = lastState.nodes.slice(-1)[0]
  const newState = {
    nodes: [...lastState.nodes, start],
    edges: lastNode === undefined ? [] : [...lastState.edges, { start: lastNode, end: start }]
  }
  states.push(newState)

  const neighbours = [...graph[start]]
  neighbours.sort((a, b) => a - b)

  for (let neighbour of neighbours) {
    if (!visited.has(neighbour)) {
      dfs(graph, neighbour, visited, states)
    }
  }
  return states
}