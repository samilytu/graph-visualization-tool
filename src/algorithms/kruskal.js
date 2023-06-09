// src/algorithms/kruskal.js
export default function kruskal(adjacencyList, edges) {
  const parent = new Array(adjacencyList.length).fill(null).map((_, i) => i);
  const rank = new Array(adjacencyList.length).fill(0);
  const mstEdges = [];
  let totalWeight = 0;

  function find(i) {
    if (parent[i] !== i) {
      parent[i] = find(parent[i]);
    }
    return parent[i];
  }

  function union(i, j) {
    const iRoot = find(i);
    const jRoot = find(j);
    if (rank[iRoot] > rank[jRoot]) {
      parent[jRoot] = iRoot;
    } else if (rank[iRoot] < rank[jRoot]) {
      parent[iRoot] = jRoot;
    } else {
      parent[jRoot] = iRoot;
      rank[iRoot]++;
    }
  }

  edges.sort((a, b) => a.weight - b.weight);

  for (const edge of edges) {
    const { start, end, weight } = edge;
    if (find(start) !== find(end)) {
      mstEdges.push(edge);
      totalWeight += weight;
      union(start, end);
    }
  }

  return { mstEdges, totalWeight };
}
