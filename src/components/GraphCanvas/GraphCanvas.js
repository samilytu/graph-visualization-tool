import React, { useState, useEffect } from "react";
import "./GraphCanvas.css";
import GraphInfo from "../GraphInfo/GraphInfo";

// import { CSSTransition, TransitionGroup } from 'react-transition-group';

const GraphCanvas = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [drawingEdge, setDrawingEdge] = useState(null);
  const [adjacencyList, setAdjacencyList] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const newAdjacencyList = nodes.map(() => []);
    edges.forEach((edge) => {
      newAdjacencyList[edge.start].push(edge.end);
    });
    setAdjacencyList(newAdjacencyList);
  }, [nodes, edges]);

  const isNodeClicked = (x, y, node) => {
    const distance = Math.sqrt(
      Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2)
    );
    return distance <= 15;
  };

  // const drawNode = (e) => {
  //     if (e.button === 0) {
  //         if (e.target.className !== "graph-canvas") return;
  //         const rect = e.target.getBoundingClientRect();
  //         const x = e.clientX - rect.left - 20;
  //         const y = e.clientY - rect.top - 20;
  //         const clickedNode = nodes.find((node) => isNodeClicked(x, y, node));
  //         if (!clickedNode) {
  //             setNodes([...nodes, { x, y }]);
  //         }
  //     }
  // };

  const removeNode = (indexToRemove) => {
    setNodes(nodes.filter((_, index) => index !== indexToRemove));
    setEdges(
      edges.filter(
        (edge) => edge.start !== indexToRemove && edge.end !== indexToRemove
      )
    );
  };

  const startDrawingEdge = (startIndex) => {
    setDrawingEdge({ startIndex });
  };

  const finishDrawingEdge = (endIndex) => {
    if (drawingEdge && drawingEdge.startIndex !== endIndex) {
      setEdges([...edges, { start: drawingEdge.startIndex, end: endIndex }]);
      setDrawingEdge(null);
      const weight = prompt("Enter the edge weight:", "1");
      if (weight !== null) {
        const newEdge = {
          start: drawingEdge.startIndex,
          end: endIndex,
          weight: parseFloat(weight),
        };
        setEdges([...edges, newEdge]);
      }
    }
  };

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
  };

  const importGraph = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = JSON.parse(e.target.result);
        setNodes(data.nodes);
        setEdges(data.edges);
      };
      reader.readAsText(file);
    }
  };

  const exportGraph = () => {
    const data = JSON.stringify({ nodes, edges });
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "graph.json";
    link.href = url;
    link.click();
  };

  const generateRandomGraph = () => {
    // Initialize arrays for nodes and edges
    const nodes = [];
    const edges = [];

    // Create at least 7 nodes with random x and y
    for (let i = 0; i < 7; i++) {
      const x = Math.floor(Math.random() * 500);
      const y = Math.floor(Math.random() * 500);
      nodes.push({ x, y });
    }

    // Create at least 10 edges with random start, end and weight
    for (let i = 0; i < 10; i++) {
      const start = Math.floor(Math.random() * nodes.length);
      let end;
      do {
        end = Math.floor(Math.random() * nodes.length);
      } while (end === start); // Ensure the end node is different from the start node
      const weight = Math.floor(Math.random() * 15) + 1; // Random weight between 1 and 15
      edges.push({ start, end, weight });
    }

    // Set the new nodes and edges
    setNodes(nodes);
    setEdges(edges);
  };

    const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left - 20;
    const y = e.clientY - rect.top - 20;
    const clickedNodeIndex = nodes.findIndex((node) =>
      isNodeClicked(x, y, node)
    );
    if (clickedNodeIndex !== -1) {
      setSelectedNode(clickedNodeIndex);
    } else if (e.target.className === "graph-canvas") {
      setNodes([...nodes, { x, y }]);
    }
  };
  // const handleMouseUp = (e) => {
  //     setSelectedNode(null);
  // };

  //bir node'a bir sol tık yapıldığı zaman o node selectedNode yapan kod
  // const handleMouseDown = (e) => {
  //     if (e.button !== 0) return;
  //     const rect = e.target.getBoundingClientRect();
  //     const x = e.clientX - rect.left - 20;
  //     const y = e.clientY - rect.top - 20;
  //     const clickedNodeIndex = nodes.findIndex((node) => isNodeClicked(x, y, node));
  //     if (clickedNodeIndex !== -1) {
  //         setSelectedNode(clickedNodeIndex);
  //     } else if (e.target.className === "graph-canvas") {
  //         setNodes([...nodes, { x, y }]);
  //     }
  // };

  const handleMouseMove = (e) => {
    if (selectedNode === null) return;

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left - 20;
    const y = e.clientY - rect.top - 20;
    const newNodes = [...nodes];
    newNodes[selectedNode] = { x, y };
    setNodes(newNodes);
  };

  const handleMouseUp = (e) => {
    if (drawingEdge) {
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left - 20;
      const y = e.clientY - rect.top - 20;
      const clickedNodeIndex = nodes.findIndex((node) =>
        isNodeClicked(x, y, node)
      );
      if (clickedNodeIndex !== -1) {
        setEdges([
          ...edges,
          { start: drawingEdge.startIndex, end: clickedNodeIndex },
        ]);
      }
      setDrawingEdge(null);
    }
  };

  return (
    <div className="graph-container">
      <div
        className="graph-canvas"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <button
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 10,
          }}
          onClick={clearGraph}
        >
          Clear Graph
        </button>
        <button
          style={{
            position: "absolute",
            top: 50,
            right: 10,
            zIndex: 10,
          }}
          onClick={generateRandomGraph}
        >
          Demo Graph
        </button>

        {/* Import ve Export düğmeleri */}

        <input
          type="file"
          id="file"
          accept=".json"
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 10,
          }}
          onChange={importGraph}
        />

        <button
          style={{
            position: "absolute",
            top: 50,
            left: 10,
            zIndex: 10,
          }}
          onClick={exportGraph}
        >
          Save&Export Graph
        </button>

        <svg
          className="graph-svg"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          {edges.map((edge, index) => (
            <React.Fragment key={index}>
              <line
                x1={nodes[edge.start].x + 15}
                y1={nodes[edge.start].y + 15}
                x2={nodes[edge.end].x + 15}
                y2={nodes[edge.end].y + 15}
                stroke="black"
                strokeWidth="2"
              />
              {edge.weight && (
                <text
                  x={(nodes[edge.start].x + nodes[edge.end].x) / 2}
                  y={(nodes[edge.start].y + nodes[edge.end].y) / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {edge.weight}
                </text>
              )}
            </React.Fragment>
          ))}
        </svg>
        {nodes.map((node, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: node.x,
              top: node.y,
              cursor: "default",
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "black",
              color: "white",
              textAlign: "center",
              lineHeight: "40px",
              fontSize: 20,
              userSelect: "none",
              border: index === selectedNode ? "2px solid red" : null,
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              removeNode(index);
            }}
            onMouseDown={() => startDrawingEdge(index)}
            onMouseUp={() => finishDrawingEdge(index)}
          >
            {index + 1}
          </div>
        ))}
              
      </div>
      <GraphInfo nodes={nodes} edges={edges} adjacencyList={adjacencyList} />
    </div>
  );
};

export default GraphCanvas;
