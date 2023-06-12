// src/algorithms/kruskal.js
export default function kruskal(adjMatrix) {
  const states = [{nodes: [], edges: []}];

  const V = adjMatrix.length;
  const graph = [];

  // Adjacency matrix'i ağırlıklı kenar listesine dönüştürme
  for (let i = 0; i < V; i++) {
    for (let j = i + 1; j < V; j++) {
      if (adjMatrix[i][j] !== 0) {
        graph.push([i, j, adjMatrix[i][j]]);
      }
    }
  }

  const result = [];
  let i = 0;
  let e = 0;
  graph.sort((a, b) => a[2] - b[2]);
  const parent = [];
  const rank = [];
  for (let node = 0; node < V; node++) {
    parent.push(node);
    rank.push(0);
  }
  while (e < V - 1) {
    const [u, v, w] = graph[i];
    i++;
    const x = find(parent, u);
    const y = find(parent, v);
    if (x !== y) {
      e++;
      result.push([u, v, w]);
      applyUnion(parent, rank, x, y);
    }
  }
  for (const [u, v, weight] of result) {
    console.log(`${u} - ${v}: ${weight}`);
    const lastState = states.slice(-1)[0]
    const newState = {
      nodes: [], edges: [...lastState.edges, {start: u, end: v}]
    }
    states.push(newState);
  }

  return states;
}

function find(parent, i) {
  if (parent[i] !== i) {
    parent[i] = find(parent, parent[i]);
  }
  return parent[i];
}

function applyUnion(parent, rank, x, y) {
  const xRoot = find(parent, x);
  const yRoot = find(parent, y);
  if (rank[xRoot] < rank[yRoot]) {
    parent[xRoot] = yRoot;
  } else if (rank[xRoot] > rank[yRoot]) {
    parent[yRoot] = xRoot;
  } else {
    parent[yRoot] = xRoot;
    rank[xRoot]++;
  }
}