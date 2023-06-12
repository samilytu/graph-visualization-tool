// src/components/AlgorithmControls/AlgorithmControls.js
import React from "react";
import "./AlgorithmControls.css";
import dfs from "../../algorithms/dfs";
import bfs from "../../algorithms/bfs";
import kruskal from "../../algorithms/kruskal";
import prim from "../../algorithms/prim";
import dijkstra from "../../algorithms/dijkstra";

const AlgorithmControls = ({
                             selectedNodeIndex,
                             adjacencyList,
                             adjacencyMatrix,
                             onDfsStatesChange,
                             onBfsStatesChange,
                             onKruskalStatesChange,
                             onPrimStatesChange,
                             onDijkstraStatesChange,
                             onClearAlgorithm
                           }) => {
  // get adjacencyList and setDFSState from props
  const handleDfs = () => {
    if (selectedNodeIndex === null) {
      alert("Please select a node first!");
      return;
    }

    const dfsStates = dfs(adjacencyList, selectedNodeIndex);
    console.log("dfsStates", dfsStates);

    onDfsStatesChange(dfsStates);
  };

  const handleBfs = () => {
    if (selectedNodeIndex === null) {
      alert("Please select a node first!");
      return;
    }

    const bfsStates = bfs(adjacencyList, selectedNodeIndex);
    console.log("bfsStates", bfsStates);

    onBfsStatesChange(bfsStates);
  };

  const handleKruskal = () => {
    const kruskalStates = kruskal(adjacencyMatrix);
    console.log("kruskalStates", kruskalStates);

    onKruskalStatesChange(kruskalStates);
  }

  const handlePrim = () => {
    // if (selectedNodeIndex === null) {
    //   alert("Please select a node first!");
    //   return;
    // }

    const primStates = prim(adjacencyMatrix);
    console.log("primStates", primStates);

    onPrimStatesChange(primStates);
  }

  const handleDijkstra = () => {
    if (selectedNodeIndex === null) {
      alert("Please select a node first!");
      return;
    }

    const dijkstraStates = dijkstra(adjacencyMatrix, selectedNodeIndex);
    console.log("dijkstraStates", dijkstraStates);

    onDijkstraStatesChange(dijkstraStates);
  }

  return (
    <>
      <button onClick={handleDfs}>DFS</button>
      <button onClick={handleBfs}>BFS</button>
      <button onClick={handleKruskal}>Kruskal's Algorithm</button>
      <button onClick={handlePrim}>Prim's Algorithm</button>
      <button onClick={handleDijkstra}>Dijkstra's Algorithm</button>
      <button
        onClick={onClearAlgorithm}
        className="danger-button"
      >Clear
      </button>
    </>
  );
};

export default AlgorithmControls;
