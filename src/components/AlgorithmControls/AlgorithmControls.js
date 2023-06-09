// src/components/AlgorithmControls/AlgorithmControls.js
import React from "react";
import dfs from "../../algorithms/dfs"; // import dfs function
import bfs from "../../algorithms/bfs"; // import bfs function
import kruskal from "../../algorithms/kruskal"; // import kruskal function

const AlgorithmControls = ({ adjacencyList, setDFSState, setBFSState }) => {
  // get adjacencyList and setDFSState from props
  const handleDFS = () => {
    const startNode = parseInt(prompt("Enter the start node:"));
    if (
      isNaN(startNode) ||
      startNode < 0 ||
      startNode >= adjacencyList.length
    ) {
      alert("Invalid start node!");
      return;
    }

    const visitedEdges = dfs(adjacencyList, startNode);
    console.log("visitedEdges2", visitedEdges);
    setDFSState({ visitedEdges, currentEdgeIndex: 0 });
  };

  const handleBFS = () => {
    const startNode = parseInt(prompt("Enter the start node:"));
    if (
      isNaN(startNode) ||
      startNode < 0 ||
      startNode >= adjacencyList.length
    ) {
      alert("Invalid start node!");
      return;
    }

    const visitedEdges = bfs(adjacencyList, startNode);
    setBFSState({ visitedEdges, currentEdgeIndex: 0 });
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
      <button onClick={handleDFS}>DFS</button> {/* attach event handler here */}
      <button onClick={handleBFS}>BFS</button> {/* attach event handler here */}
      <button>Dijkstra's Algorithm</button>
    </div>
  );
};

export default AlgorithmControls;
