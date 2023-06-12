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

  const requireNodeExists = () => {
    if (adjacencyList.length === 0) {
      throw new Error("Please create a node first!");
    }
  }

  const requireNodeSelected = () => {
    if (selectedNodeIndex === null) {
      throw new Error("Please select a node first!");
    }
  }

  const handleDfs = () => {
    try {
      requireNodeExists();
      requireNodeSelected();

      const dfsStates = dfs(adjacencyList, selectedNodeIndex);
      console.log("dfsStates", dfsStates);

      onDfsStatesChange(dfsStates);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleBfs = () => {
    try {
      requireNodeExists();
      requireNodeSelected();

      const bfsStates = bfs(adjacencyList, selectedNodeIndex);
      console.log("bfsStates", bfsStates);

      onBfsStatesChange(bfsStates);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleKruskal = () => {
    try {
      requireNodeExists()

      const kruskalStates = kruskal(adjacencyMatrix);
      console.log("kruskalStates", kruskalStates);

      onKruskalStatesChange(kruskalStates);
    } catch (e) {
      alert(e.message);
    }
  }

  const handlePrim = () => {
    try {
      requireNodeExists();

      const primStates = prim(adjacencyMatrix);
      console.log("primStates", primStates);

      onPrimStatesChange(primStates);
    } catch (e) {
      alert(e.message);
    }
  }

  const handleDijkstra = () => {
    try {
      requireNodeExists();
      requireNodeSelected();

      const dijkstraStates = dijkstra(adjacencyMatrix, selectedNodeIndex);
      console.log("dijkstraStates", dijkstraStates);

      onDijkstraStatesChange(dijkstraStates);
    } catch (e) {
      alert(e.message);
    }
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
