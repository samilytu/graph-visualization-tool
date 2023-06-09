import React, { useState, useEffect, useRef } from "react";
import "./GraphCanvas.css";
import GraphInfo from "../GraphInfo/GraphInfo";
import AlgorithmControls from "../AlgorithmControls/AlgorithmControls";
import Modal from "react-modal";

// import { CSSTransition, TransitionGroup } from 'react-transition-group';

const GraphCanvas = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [drawingEdge, setDrawingEdge] = useState(null);
  const [adjacencyList, setAdjacencyList] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [DFSState, setDFSState] = useState(null);

  const [DFSVisitedNodes, setDFSVisitedNodes] = useState([]);
  const [DFSVisitedEdges, setDFSVisitedEdges] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [edgeWeight, setEdgeWeight] = useState("");
  const [endIndex, setEndIndex] = useState(null);
  const [startIndex, setStartIndex] = useState(null);
  const [adjacencyMatrix, setAdjacencyMatrix] = useState([]);
  const [BFSState, setBFSState] = useState(null);
  const [BFSInterval, setBFSInterval] = useState(null);
  const [BFSVisitedNodes, setBFSVisitedNodes] = useState([]);
  const [BFSVisitedEdges, setBFSVisitedEdges] = useState([]);
  const DFSInterval = useRef(null);
  const [kruskalState, setKruskalState] = useState(null);

  useEffect(() => {
    const newAdjacencyList = nodes.map(() => []);
    edges.forEach((edge) => {
      if (!newAdjacencyList[edge.start]) {
        newAdjacencyList[edge.start] = [];
      }
      newAdjacencyList[edge.start].push(edge.end);
    });
    console.log(newAdjacencyList);
    setAdjacencyList(newAdjacencyList);
  }, [nodes, edges]);

  useEffect(() => {
    if (nodes.length > 0 && edges.length > 0) {
      const newAdjacencyMatrix = nodes.map(() => Array(nodes.length).fill(0));
      edges.forEach((edge) => {
        if (
          newAdjacencyMatrix[edge.start] &&
          newAdjacencyMatrix[edge.start][edge.end] !== undefined
        ) {
          newAdjacencyMatrix[edge.start][edge.end] = edge.weight;
        }
      });
      setAdjacencyMatrix(newAdjacencyMatrix);
    }
  }, [nodes, edges]);

  useEffect(() => {
    if (DFSState) {
      console.log(DFSState);
      console.log(DFSState.currentEdgeIndex);
      console.log(DFSState.visitedEdges.length);
      console.log(DFSInterval.current);
      DFSInterval.current = setInterval(() => {
        setDFSState((prevState) => {
          if (prevState.currentEdgeIndex >= prevState.visitedEdges.length) {
            clearInterval(DFSInterval.current);
            return null;
          } else {
            const currentEdge =
              prevState.visitedEdges[prevState.currentEdgeIndex];
            if (currentEdge) {
              // Check if currentEdge exists
              const newVisitedNodes = new Set(prevState.visitedNodes);
              newVisitedNodes.add(currentEdge.start);
              newVisitedNodes.add(currentEdge.end);
              setDFSVisitedNodes(Array.from(newVisitedNodes));
              setDFSVisitedEdges((prevState) => [...prevState, currentEdge]);

              return {
                ...prevState,
                currentEdgeIndex: prevState.currentEdgeIndex + 1,
              };
            }
          }
        });
      }, 1500);
    }

    return () => {
      if (DFSInterval.current) {
        clearInterval(DFSInterval.current);
        DFSInterval.current = null;
      }
    };
  }, [DFSState]);

  useEffect(() => {
    let BFSInterval;

    if (BFSState) {
      BFSInterval = setInterval(() => {
        setBFSState((prevState) => {
          if (prevState.currentEdgeIndex >= prevState.visitedEdges.length) {
            clearInterval(BFSInterval);
            return null;
          } else {
            const currentEdge =
              prevState.visitedEdges[prevState.currentEdgeIndex];
            if (currentEdge) {
              // Check if currentEdge exists
              const newVisitedNodes = new Set(prevState.visitedNodes);
              newVisitedNodes.add(currentEdge.start);
              newVisitedNodes.add(currentEdge.end);
              setBFSVisitedNodes(Array.from(newVisitedNodes));
              setBFSVisitedEdges((prevState) => [...prevState, currentEdge]);

              return {
                ...prevState,
                currentEdgeIndex: prevState.currentEdgeIndex + 1,
              };
            }
          }
        });
      }, 1500);
      setBFSInterval(BFSInterval);
    }

    return () => {
      if (BFSInterval) {
        clearInterval(BFSInterval);
        setBFSInterval(null);
      }
    };
  }, [BFSState]);

  const isNodeClicked = (x, y, node) => {
    const distance = Math.sqrt(
      Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2)
    );
    const isClicked = distance <= 20;
    // console.log(
    //   `Checked node at (${node.x}, ${node.y}). Click at (${x}, ${y}). Distance: ${distance}. Is clicked? ${isClicked}`
    // );
    return isClicked;
  };

  // const createAdjacencyMatrix = (nodes, edges) => {
  //   const matrix = Array(nodes.length)
  //     .fill(null)
  //     .map(() => Array(nodes.length).fill(0));

  //   edges.forEach((edge) => {
  //     matrix[edge.start][edge.end] = edge.weight ? edge.weight : 1;
  //     matrix[edge.end][edge.start] = edge.weight ? edge.weight : 1;
  //     console.log("Matrix:", matrix);
  //     console.log("Edge:", edge);
  //     console.log("Edge weight:", edge.weight);
  //   });

  //   setAdjacencyMatrix(matrix);
  // };

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
    if (selectedNode !== null) return;
    setStartIndex(startIndex);
  };

  const finishDrawingEdge = (endIndex) => {
    // console.log("Drawing edge:", drawingEdge);
    if (startIndex != null && endIndex != startIndex) {
      // drawingEdge.endIndex = endIndex;
      // const updatedDrawingEdge = { ...drawingEdge, endIndex: endIndex };
      // setEdges([...edges, updatedDrawingEdge]);

      // setEdges([
      //   ...edges,
      //   { start: drawingEdge.startIndex, end: endIndex, weight: edgeWeight },
      // ]);
      setEndIndex(endIndex);
      // setDrawingEdge(drawingEdge);
      // console.log("Drawing edge:", drawingEdge);
      // console.log("End index:", drawingEdge.endIndex);
      // console.log("start index:", drawingEdge.startIndex);
      // console.log("Drawing edge:", drawingEdge.startIndex);

      setModalOpen(true); // Open the modal when an edge is drawn
      // console.log("Drawing edge:", drawingEdge);
      // console.log("End index:", endIndex);
      // console.log("start index:", drawingEdge.startIndex);

      //Get the weight of the edge input in a modal using prompt
      // const weight = prompt("Enter the weight of the edge");

      // if (weight !== null) {
      //   const newEdge = {
      //     start: drawingEdge.startIndex,
      //     end: endIndex,
      //     weight: parseFloat(weight),
      //   };
      //   setEdges([...edges, newEdge]);
      // }
    }
  };

  const handleModalClose = () => {
    // console.log("End index:", endIndex);
    // console.log("Drawing edge:", drawingEdge);
    // console.log("start index:", drawingEdge?.startIndex);
    // console.log("end index:", endIndex);
    // console.log("edge weight:", edgeWeight);
    // setEdges([
    //   ...edges,
    //   {
    //     start: drawingEdge.startIndex,
    //     end: endIndex,
    //     weight: parseFloat(edgeWeight),
    //   },
    // ]);
    if (edgeWeight !== "") {
      // setDrawingEdge({ startIndex: startIndex, endIndex: endIndex, weight: edgeWeight });
      // console.log("Weight:", edgeWeight);
      // console.log("End index:", endIndex);
      // console.log("weight:", edgeWeight);
      const newEdge = {
        start: startIndex,
        end: endIndex,
        weight: parseFloat(edgeWeight),
      };

      setEdges([...edges, newEdge]);

      setEdgeWeight("");

      // setDrawingEdge(null); // Reset the drawing edge
      setEndIndex(null); // Reset the end index
      setStartIndex(null); // Reset the start index
    }

    setModalOpen(false); // Close the modal
  };

  const handleWeightChange = (event) => {
    // console.log("Edge weight:", event.target.value);
    setEdgeWeight(event.target.value);
    // console.log("drawingEdge:", drawingEdge);

    // drawingEdge.weight = event.target.value;
    // setDrawingEdge(drawingEdge);
    // console.log("Edge weight33:", event.target.value);
  };

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setDrawingEdge(null);
    setAdjacencyList([]);
    setSelectedNode(null);
    setDFSState(null);
    setDFSVisitedNodes([]);
    setDFSVisitedEdges([]);
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
    for (let i = 0; i < 5; i++) {
      let x, y;
      // Ensure that the new node is not too close to existing nodes
      do {
        x = Math.floor(Math.random() * 700);
        y = Math.floor(Math.random() * 550);
      } while (
        nodes.some(
          (node) => Math.abs(node.x - x) < 150 && Math.abs(node.y - y) < 150
        )
      );
      nodes.push({ x, y });
    }

    for (let i = 0; i < 7; i++) {
      let start, end;
      do {
        start = Math.floor(Math.random() * nodes.length);
        end = Math.floor(Math.random() * nodes.length);
      } while (
        end === start ||
        edges.some(
          (edge) =>
            (edge.start === start && edge.end === end) ||
            (edge.start === end && edge.end === start)
        )
      ); // Ensure the end node is different from the start node and the edge doesn't already exist
      const weight = Math.floor(Math.random() * 15) + 1; // Random weight between 1 and 15
      edges.push({ start, end, weight });
    }

    // Set the new nodes and edges
    setNodes(nodes);
    setEdges(edges);
  };

  const handleMouseDown = (e) => {
    // console.log("handleMouseDown called");
    if (e.button !== 0) return;
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left - 20;
    const y = e.clientY - rect.top - 20;
    // seçilen node'un indexini buluyor
    const clickedNodeIndex = nodes.findIndex((node) =>
      isNodeClicked(x, y, node)
    );

    // console.log("clickedNodeIndex:", clickedNodeIndex);

    if (clickedNodeIndex !== -1) {
      // console.log("selectedNode:", selectedNode);
      if (selectedNode === clickedNodeIndex) {
        // console.log("Unselecting node:", clickedNodeIndex);
        setSelectedNode(null); // Unselect the node if it's clicked when already selected
      } else {
        // console.log("Selecting node:", clickedNodeIndex);
        setSelectedNode(clickedNodeIndex);
      }
    } else if (e.target.className === "graph-canvas" && selectedNode === null) {
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
    if (drawingEdge && selectedNode === null) {
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left - 20;
      const y = e.clientY - rect.top - 20;
      const clickedNodeIndex = nodes.findIndex((node) =>
        isNodeClicked(x, y, node)
      );
      // if (clickedNodeIndex !== -1) {
      //   setEdges([
      //     ...edges,
      //     { start: drawingEdge.startIndex, end: clickedNodeIndex },
      //   ]);
      // }
    }
  };

  return (
    <>
      <AlgorithmControls
        adjacencyList={adjacencyList}
        setDFSState={setDFSState}
        setBFSState={setBFSState}
      />
      <div className="graph-container">
        <div
          className="graph-canvas"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div
            onClick={(event) => {
              event.stopPropagation();
            }}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 10,
              width: "150px", // adjust as per your need
              height: "100px", // adjust as per your need
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
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
              Random Graph
            </button>
          </div>
          {/* Import ve Export düğmeleri */}
          <div
            onClick={(event) => {
              event.stopPropagation();
            }}
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 10,
              width: "200px", // adjust as per your need
              height: "120px", // adjust as per your need
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
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
          </div>
          <svg
            className="graph-svg"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            {edges.map((edge, index) => {
              // Ensure the start and end indices exist in the nodes array
              if (nodes[edge.start] && nodes[edge.end]) {
                return (
                  <React.Fragment key={index}>
                    <line
                      x1={nodes[edge.start].x + 15}
                      y1={nodes[edge.start].y + 15}
                      x2={nodes[edge.end].x + 15}
                      y2={nodes[edge.end].y + 15}
                      strokeWidth="2"
                      stroke={
                        DFSVisitedEdges.some(
                          (e) => e.start === edge.start && e.end === edge.end
                        )
                          ? "green"
                          : "black"
                      }
                    />
                    {/* If the edge has a weight, display it */}
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
                );
              } else {
                return null; // Return null if the indices do not exist
              }
            })}
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
                color: "white",
                textAlign: "center",
                lineHeight: "40px",
                fontSize: 20,
                userSelect: "none",
                backgroundColor: DFSVisitedNodes.includes(index)
                  ? "green"
                  : "black",
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

        <Modal
          ariaHideApp={false}
          shouldCloseOnEsc={true}
          shouldCloseOnOverlayClick={true}
          role={"dialog"}
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            },
            content: {
              position: "absolute",
              top: "40px",
              left: "40px",
              right: "40px",
              bottom: "40px",
              border: "1px solid #ccc",
              background: "#fff",
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
              borderRadius: "4px",
              outline: "none",
              padding: "20px",
              height: "200px",
              width: "380px",
              margin: "auto",
            },
          }}
          autoFocus={true}
          handleModalClose={handleModalClose}
          isOpen={modalOpen}
          onAfterClose={handleModalClose}
          onRequestClose={handleModalClose}
          contentLabel="Edge Weight Modal"
        >
          <h2>Enter the edge weight</h2>
          <br />
          <input
            type="number"
            placeholder="Edge Weight"
            autoFocus={true}
            onChange={(input) => handleWeightChange(input)}
          />
          <button onClick={handleModalClose}>Submit</button>
        </Modal>

        <GraphInfo
          nodes={nodes}
          edges={edges}
          adjacencyList={adjacencyList}
          adjacencyMatrix={adjacencyMatrix}
        />
      </div>
    </>
  );
};

export default GraphCanvas;
