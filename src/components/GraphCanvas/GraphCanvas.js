import React, {useEffect, useRef, useState} from "react";
import "./GraphCanvas.css";
import GraphInfo from "../GraphInfo/GraphInfo";
import AlgorithmControls from "../AlgorithmControls/AlgorithmControls";
import Modal from "react-modal";
// import { startNode } from "../AlgorithmControls/AlgorithmControls";

// console.log("startNode3", startNode);
// import { CSSTransition, TransitionGroup } from 'react-transition-group';

const intervalTime = 1000;

const GraphCanvas = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [adjacencyList, setAdjacencyList] = useState([]);
  const [algorithmStates, setAlgorithmStates] = useState(null);
  const [currentAlgorithmStateIndex, setCurrentAlgorithmStateIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [edgeWeight, setEdgeWeight] = useState("");
  const [endIndex, setEndIndex] = useState(null);
  const [startIndex, setStartIndex] = useState(null);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(null);
  const [adjacencyMatrix, setAdjacencyMatrix] = useState([]);
  const canvasRef = useRef();

  useEffect(() => {
    const newAdjacencyList = nodes.map(() => []);
    edges.forEach((edge) => {
      if (!newAdjacencyList[edge.start]) {
        newAdjacencyList[edge.start] = [];
      }
      if (!newAdjacencyList[edge.end]) {
        newAdjacencyList[edge.end] = [];
      }
      newAdjacencyList[edge.start].push(edge.end);
      newAdjacencyList[edge.end].push(edge.start); // add this line for undirected graph
    });
    setAdjacencyList(newAdjacencyList);
  }, [nodes, edges]);

  useEffect(() => {
    if (nodes.length > 0 && edges.length > 0) {
      const newAdjacencyMatrix = nodes.map(() => Array(nodes.length).fill(0));
      edges.forEach((edge) => {
        if (newAdjacencyMatrix[edge.start] && newAdjacencyMatrix[edge.start][edge.end] !== undefined) {
          newAdjacencyMatrix[edge.start][edge.end] = edge.weight;
        }
      });
      setAdjacencyMatrix(newAdjacencyMatrix);
    } else {
      // If no nodes or edges, create matrix of 0s filled with empty arrays
      const newAdjacencyMatrix = nodes.map(() => Array(nodes.length).fill(0));
      setAdjacencyMatrix(newAdjacencyMatrix);
    }
  }, [nodes, edges]);

  useEffect(() => {
    if (!algorithmStates) {
      return;
    }
    setCurrentAlgorithmStateIndex(0);
    const timer = setInterval(() => {
      setCurrentAlgorithmStateIndex((prevState) => {
        if (prevState < algorithmStates.length - 1) {
          return prevState + 1;
        } else {
          clearInterval(timer);
          return prevState;
        }
      })

    }, intervalTime);

    return () => {
      setCurrentAlgorithmStateIndex(0);
      clearInterval(timer);
    };
  }, [algorithmStates]);

  const removeNode = (indexToRemove) => {
    setNodes(nodes.filter((_, index) => index !== indexToRemove));
    setEdges(edges.filter((edge) => edge.start !== indexToRemove && edge.end !== indexToRemove));
    if (selectedNodeIndex === indexToRemove) {
      setSelectedNodeIndex(null);
    }
    // remove all edges that contain the node to be removed
    setEdges(e => e.filter(edge => edge.start !== indexToRemove && edge.end !== indexToRemove));
  };

  const startDrawingEdge = (startIndex) => {
    console.log("startDrawingEdge", startIndex);
    setStartIndex(startIndex);
  };

  const finishDrawingEdge = (endIndex) => {
    console.log("finishDrawingEdge", startIndex, endIndex);
    if (startIndex === null || endIndex === startIndex) {
      if (startIndex === selectedNodeIndex) {
        setSelectedNodeIndex(null);
      } else {
        setSelectedNodeIndex(startIndex);
      }
      setStartIndex(null);
      setEndIndex(null);
      return;
    }
    setEndIndex(endIndex);
    setModalOpen(true);
  };

  const openEditEdgeModal = (startIndex, endIndex, weight) => {
    setStartIndex(startIndex);
    setEndIndex(endIndex);
    setEdgeWeight(weight.toString());
    setModalOpen(true);
  };

  const handleModalClose = () => {
    const weight = parseInt(edgeWeight);
    // ]);

    if (isNaN(weight) || weight <= 0) {
      setModalOpen(false); // Close the modal
      return;
    }

    const newEdge = {
      start: startIndex, end: endIndex, weight,
    };

    const newEdges = [...edges];

    // if the edge already exists, update it
    const edgeIndex = edges.findIndex((edge) => edge.start === startIndex && edge.end === endIndex);

    if (edgeIndex !== -1) {
      newEdges[edgeIndex] = newEdge;
    } else {
      newEdges.push(newEdge);
    }

    setEdges(newEdges);
    setEdgeWeight("");

    setEndIndex(null); // Reset the end index
    setStartIndex(null); // Reset the start index

    setModalOpen(false); // Close the modal
  };

  const handleWeightChange = (event) => {
    // console.log("Edge weight:", event.target.value);
    setEdgeWeight(event.target.value.toString());
  };

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setAdjacencyList([]);
    setAdjacencyMatrix([]);
    setAlgorithmStates(null);
    setCurrentAlgorithmStateIndex(0);
    setSelectedNodeIndex(null);
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
    const data = JSON.stringify({nodes, edges});
    const blob = new Blob([data], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "graph.json";
    link.href = url;
    link.click();
  };

  const generateRandomGraph = () => {
    setAlgorithmStates(null);
    setCurrentAlgorithmStateIndex(0);
    setSelectedNodeIndex(null);
    // Initialize arrays for nodes and edges
    const nodes = [];
    const edges = [];

    // Create at least 7 nodes with random x and y
    for (let i = 0; i < 4; i++) {
      let x, y;
      // Ensure that the new node is not too close to existing nodes
      do {
        x = Math.floor(Math.random() * 700);
        y = Math.floor(Math.random() * 550);
      } while (nodes.some((node) => Math.abs(node.x - x) < 150 && Math.abs(node.y - y) < 150));
      nodes.push({x, y});
    }

    for (let i = 0; i < 5; i++) {
      let start, end;
      do {
        start = Math.floor(Math.random() * nodes.length);
        end = Math.floor(Math.random() * nodes.length);
      } while (end === start || edges.some((edge) => (edge.start === start && edge.end === end) || (edge.start === end && edge.end === start))); // Ensure the end node is different from the start node and the edge doesn't already exist
      const weight = Math.floor(Math.random() * 15) + 1; // Random weight between 1 and 15
      edges.push({start, end, weight});
    }

    // Set the new nodes and edges
    setNodes(nodes);
    setEdges(edges);
  };

  const handleMouseUp = (e) => {
    e.preventDefault();

    if (startIndex != null) {
      setEndIndex(null);
      setStartIndex(null);
      return
    }

    // console.log("handleMouseDown called");
    if (e.button !== 0) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 20;
    const y = e.clientY - rect.top - 20;

    // avoid inserting node so close to each other
    if (isTooClose(x, y)) return;

    if (e.target.className === "graph-canvas") {
      setNodes([...nodes, {x, y}]);
    }
  };

  const isTooClose = (x, y) => {
    // avoid inserting node so close to each other
    // also avoid inserting node too close to edges
    return nodes.some((node) => Math.abs(node.x - x) < 50 && Math.abs(node.y - y) < 50) || edges.some((edge) => {
      const start = nodes[edge.start];
      const end = nodes[edge.end];
      const x1 = start.x;
      const y1 = start.y;
      const x2 = end.x;
      const y2 = end.y;
      const distance = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) / Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
      return distance < 35;
    });
  }

  return (<>
    <AlgorithmControls
      selectedNodeIndex={selectedNodeIndex}
      adjacencyList={adjacencyList}
      adjacencyMatrix={adjacencyMatrix}
      onDfsStatesChange={setAlgorithmStates}
      onBfsStateChange={setAlgorithmStates}
      onKruskalStateChange={setAlgorithmStates}
    />
    <div className="graph-container-wrapper">
      <div className="graph-container">
        <div className="graph-actions">

          <button
            style={{
              zIndex: 10,
            }}
            onClick={clearGraph}
          >
            Clear Graph
          </button>
          <button
            style={{
              zIndex: 10,
            }}
            onClick={generateRandomGraph}
          >
            Random Graph
          </button>
          {/* Import ve Export düğmeleri */}
          <label
            htmlFor="import-graph"
            style={{
              zIndex: 10, cursor: "pointer",
            }}>
            <button style={{
              pointerEvents: "none",
            }}>
              Import Graph
            </button>
            <input
              type="file"
              id="import-graph"
              accept=".json"
              style={{
                display: "none",
              }}
              onChange={importGraph}
            />
          </label>

          <button
            style={{
              zIndex: 10,
            }}
            onClick={exportGraph}
          >
            Save&Export Graph
          </button>
        </div>

        <div
          ref={canvasRef}
          className="graph-canvas"
          onMouseUp={handleMouseUp}
          onMouseMove={(e) => {
            setMousePosition({
              x: e.clientX - canvasRef.current.getBoundingClientRect().left - 20,
              y: e.clientY - canvasRef.current.getBoundingClientRect().top - 20,
            });
          }}
          onMouseLeave={() => {
            setMousePosition(null);
          }}
          style={{
            cursor: (!mousePosition || isTooClose(mousePosition.x, mousePosition.y)) ? "default" : "pointer",
          }}
        >
          {/*<span*/}
          {/*  style={{*/}
          {/*    position: "absolute",*/}
          {/*    left: 0,*/}
          {/*    right: 0,*/}
          {/*    marginLeft: "auto",*/}
          {/*    marginRight: "auto",*/}
          {/*    textAlign: "center",*/}
          {/*  }}*/}
          {/*>*/}
          {/*  {mousePosition ? "(" + mousePosition.x + ", " + mousePosition.y + ")" : "-"}*/}
          {/*</span>*/}

          <span
            style={{
              position: "absolute", left: 0, right: 0, marginLeft: "auto", marginRight: "auto", textAlign: "center",
            }}
          >
                algorithm index: {currentAlgorithmStateIndex}
              </span>

          {startIndex != null && mousePosition && <svg
            className="graph-svg"
            style={{
              position: "absolute", width: "100%", height: "100%", pointerEvents: "none",
            }}
          >
            <line
              x1={nodes[startIndex].x + 20}
              y1={nodes[startIndex].y + 20}
              x2={(mousePosition.x) + 20}
              y2={(mousePosition.y) + 20}
              strokeWidth="2"
              stroke="red"
            />
          </svg>}

          {edges.map((edge, index) => {
            // Ensure the start and end indices exist in the nodes array
            if (nodes[edge.start] && nodes[edge.end]) {
              return (<React.Fragment key={index}>
                <svg
                  key={edge.start + "-" + edge.end}
                  className="graph-svg"
                  style={{
                    position: "absolute", width: "100%", height: "100%", pointerEvents: "none",
                  }}
                >
                  <line
                    x1={nodes[edge.start].x + 15}
                    y1={nodes[edge.start].y + 15}
                    x2={nodes[edge.end].x + 15}
                    y2={nodes[edge.end].y + 15}
                    strokeWidth="2"
                    stroke={algorithmStates?.[currentAlgorithmStateIndex]?.edges?.some((e) => (e.start === edge.start && e.end === edge.end) || (e.start === edge.end && e.end === edge.start)) ? "green" : "black"}
                  />
                </svg>
                {/* If the edge has a weight, display it */}
                {edge.weight && (<div
                  style={{
                    position: "absolute",
                    cursor: "pointer",
                    left: (nodes[edge.start].x + nodes[edge.end].x) / 2,
                    top: (nodes[edge.start].y + nodes[edge.end].y) / 2,
                    transform: "translate(-50%, -50%)",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditEdgeModal(edge.start, edge.end, edge.weight);
                  }}
                >
                  {edge.weight}
                </div>)}
              </React.Fragment>);
            } else {
              return null; // Return null if the indices do not exist
            }
          })}

          {nodes.map((node, index) => (<div
            key={index}
            style={{
              position: "absolute",
              left: node.x,
              top: node.y, // cursor: "pointer",
              width: 40,
              height: 40,
              borderRadius: "50%",
              color: "white",
              textAlign: "center",
              lineHeight: selectedNodeIndex === index ? "35px" : "40px",
              fontSize: 20,
              userSelect: "none",
              backgroundColor: algorithmStates?.[currentAlgorithmStateIndex]?.nodes?.includes(index) ? "green" : "black",
              border: index === selectedNodeIndex ? "2.5px solid white" : "none",
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              removeNode(index);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              startDrawingEdge(index);
            }}
            onMouseUp={(e) => {
              e.preventDefault();
              e.stopPropagation();
              finishDrawingEdge(index);
            }}
          >
            {index + 1}
          </div>))}
        </div>

        <Modal
          ariaHideApp={false}
          shouldCloseOnEsc={true}
          shouldCloseOnOverlayClick={true}
          role={"dialog"}
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1000,
            }, content: {
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
          <br/>
          <input
            value={edgeWeight}
            type="number"
            placeholder="Edge Weight"
            autoFocus={true}
            onChange={(input) => handleWeightChange(input)}
          />
          <button onClick={handleModalClose}>Submit</button>
        </Modal>

      </div>
      <GraphInfo
        nodes={nodes}
        edges={edges}
        adjacencyList={adjacencyList}
        adjacencyMatrix={adjacencyMatrix}
      />
    </div>
  </>);
};

export default GraphCanvas;
