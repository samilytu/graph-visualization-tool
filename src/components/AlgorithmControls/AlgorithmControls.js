// src/components/AlgorithmControls/AlgorithmControls.js
import React from "react";
import dfs from "../../algorithms/dfs"; // import dfs function
import bfs from "../../algorithms/bfs"; // import bfs function
import "./AlgorithmControls.css";
import kruskal from "../../algorithms/kruskal"; // import kruskal function

const AlgorithmControls = ({ selectedNodeIndex, adjacencyList, onDfsStatesChange, onBFSStateChange, onKruskalStateChange }) => {
  // get adjacencyList and setDFSState from props
  const handleDfs = () => {
    if(selectedNodeIndex === null) {
      alert("Please select a node first!");
      return;
    }

    const dfsItems = dfs(adjacencyList, selectedNodeIndex);
    console.log("dfsItems", dfsItems);

    onDfsStatesChange(dfsItems);
  };

  const handleBFS = () => {

  };

  // const handleKruskal = () => {
  //   const { mstEdges, totalWeight } = kruskal(adjacencyList, edges);
  //   setKruskalState({ mstEdges, currentEdgeIndex: 0 });
  //   alert(`Kruskal's MST Total Weight: ${totalWeight}`);
  // };

  return (
    <div className="algorithm-controls">
      <button>Kruskal's Algorithm</button>
      <button>Prim's Algorithm</button>
      <button onClick={handleDfs}>DFS</button> {/* attach event handler here */}
      <button onClick={handleBFS}>BFS</button> {/* attach event handler here */}
      <button>Dijkstra's Algorithm</button>
    </div>
  );
};

export default AlgorithmControls;
