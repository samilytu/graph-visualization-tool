import React, {useEffect, useRef, useState} from "react";
import "./GraphCanvas.css";
import GraphInfo from "../GraphInfo/GraphInfo";
import AlgorithmControls from "../AlgorithmControls/AlgorithmControls";
import Modal from "react-modal";
import Dropdown from "../Dropdown/Dropdown";

const defaultIntervalTime = 1000;

const GraphCanvas = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [adjacencyList, setAdjacencyList] = useState([]);
  const [intervalRate, setIntervalRate] = useState(1);
  const [intervalTime, setIntervalTime] = useState(defaultIntervalTime);
  const [algorithm, setAlgorithm] = useState(null);
  const [algorithmStates, setAlgorithmStates] = useState(null);
  const [currentAlgorithmStateIndex, setCurrentAlgorithmStateIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [edgeWeight, setEdgeWeight] = useState("");
  const [endIndex, setEndIndex] = useState(null);
  const [startIndex, setStartIndex] = useState(null);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(null);
  const [adjacencyMatrix, setAdjacencyMatrix] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [draggingNodeIndex, setDraggingNodeIndex] = useState(null);
  const canvasRef = useRef();

  useEffect(() => {
    setIntervalTime(defaultIntervalTime / intervalRate);
  }, [intervalRate]);

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
        if (
          newAdjacencyMatrix[edge.start] &&
          newAdjacencyMatrix[edge.start][edge.end] !== undefined
        ) {
          newAdjacencyMatrix[edge.start][edge.end] = edge.weight;
          newAdjacencyMatrix[edge.end][edge.start] = edge.weight; // Yönsüz graf için ters yönde de kenarı kaydet
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
    setCurrentAlgorithmStateIndex(0);
  }, [algorithmStates]);

  useEffect(() => {
    if (!algorithmStates) {
      return;
    }
    const timer = setInterval(() => {
      setCurrentAlgorithmStateIndex((prevState) => {
        if (prevState < algorithmStates.length - 1) {
          return prevState + 1;
        } else {
          clearInterval(timer);
          return prevState;
        }
      });
    }, intervalTime);

    return () => {
      clearInterval(timer);
    };
  }, [algorithmStates, intervalTime]);

  useEffect(() => {
    if (draggingNodeIndex === null || mousePosition === null) {
      return;
    }
    // if mousePosition is outside of canvas, don't update node position
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newNode = {
      ...nodes[draggingNodeIndex],
      ...((mousePosition.x >= 0 && mousePosition.x <= canvasRect.width - 40) && {x: mousePosition.x}),
      ...((mousePosition.y >= 0 && mousePosition.y <= canvasRect.height - 40) && {y: mousePosition.y}),
    };
    setNodes((n) => [...n.slice(0, draggingNodeIndex), newNode, ...n.slice(draggingNodeIndex + 1),]);
  }, [draggingNodeIndex, mousePosition]);

  const removeNode = (indexToRemove) => {
    setNodes((n) => n.filter((_, index) => index !== indexToRemove));
    // shift all edges that contain a node with a higher index than the removed node
    setEdges((e) => {
      return e
        .filter(
          (edge) => edge.start !== indexToRemove && edge.end !== indexToRemove
        )
        .map((edge) => {
          let newEdge = {...edge};
          if (newEdge.start > indexToRemove) {
            newEdge.start = newEdge.start - 1;
          }
          if (newEdge.end > indexToRemove) {
            newEdge.end = newEdge.end - 1;
          }
          return newEdge;
        });
    });
    if (selectedNodeIndex === indexToRemove) {
      setSelectedNodeIndex(null);
    }
    if (startIndex === indexToRemove) {
      setStartIndex(null);
    }
    if (endIndex === indexToRemove) {
      setEndIndex(null);
    }
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
      start: startIndex,
      end: endIndex,
      weight,
    };

    const newEdges = [...edges];

    // if the edge already exists, update it
    const edgeIndex = edges.findIndex(
      (edge) => edge.start === startIndex && edge.end === endIndex
    );

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
    setAlgorithm(null)
    setAlgorithmStates(null);
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
    setAlgorithm(null)
    setAlgorithmStates(null);
    setSelectedNodeIndex(null);
    // Initialize arrays for nodes and edges
    const nodes = [];
    const edges = [];

    const V = 7;
    const E = 8;

    // Create at least 7 nodes with random x and y
    for (let i = 0; i < V; i++) {
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
      nodes.push({x, y});
    }

    for (let i = 0; i < E; i++) {
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
      return;
    }

    // console.log("handleMouseDown called");
    if (e.button !== 0) return;

    const x = mousePosition.x;
    const y = mousePosition.y;

    // avoid inserting node so close to each other
    if (isTooClose(x, y)) return;

    if (e.target.className === "graph-canvas") {
      setNodes([...nodes, {x, y}]);
    }
  };

  const isTooClose = (x, y) => {
    // avoid inserting node so close to each other
    // also avoid inserting node too close to edges
    return (
      nodes.some(
        (node) => Math.abs(node.x - x) < 50 && Math.abs(node.y - y) < 50
      ) ||
      edges.some((edge) => {
        const start = nodes[edge.start];
        const end = nodes[edge.end];
        const x1 = start.x;
        const y1 = start.y;
        const x2 = end.x;
        const y2 = end.y;
        const distance =
          Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) /
          Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
        return distance < 35;
      })
    );
  };

  const removeEdge = (start, end) => {
    setEdges((e) =>
      e.filter(
        (edge) =>
          !(edge.start === start && edge.end === end) &&
          !(edge.start === end && edge.end === start)
      )
    );
  };

  function startDraggingNode(index) {
    setDraggingNodeIndex(index);
  }

  function finishDraggingNode() {
    setDraggingNodeIndex(null);
  }

  function clearAlgorithm() {
    setAlgorithm(null)
    setAlgorithmStates(null);
  }

  return (
    <div className="graph-main-content">
      <div className="graph-container">
        <div className="graph-actions">
          <Dropdown text="Graph">
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
          </Dropdown>

          <Dropdown text="Import/Export">
            <label
              htmlFor="import-graph"
              style={{
                zIndex: 10,
                cursor: "pointer",
              }}
            >
              <button
                style={{
                  pointerEvents: "none",
                }}
              >
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

          </Dropdown>

          <Dropdown text="Algorithms">
            <AlgorithmControls
              selectedNodeIndex={selectedNodeIndex}
              adjacencyList={adjacencyList}
              adjacencyMatrix={adjacencyMatrix}
              onDfsStatesChange={(states) => {
                setAlgorithmStates(states);
                setAlgorithm("DFS");
              }}
              onBfsStatesChange={(states) => {
                setAlgorithmStates(states);
                setAlgorithm("BFS");
              }}
              onKruskalStatesChange={(states) => {
                setAlgorithmStates(states);
                setAlgorithm("Kruskal");
              }}
              onPrimStatesChange={(states) => {
                setAlgorithmStates(states);
                setAlgorithm("Prim");
              }}
              onDijkstraStatesChange={(states) => {
                setAlgorithmStates(states);
                setAlgorithm("Dijkstra");
              }}
              onClearAlgorithm={clearAlgorithm}
            />
          </Dropdown>

          <button onClick={() => setShowInfo(!showInfo)}>
            {showInfo ? "Hide Graph Info" : "Show Graph Info"}
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
            cursor: !mousePosition || isTooClose(mousePosition.x, mousePosition.y)
              ? "default"
              : "pointer",
          }}
        >
          {algorithm && <span
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 10,
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "1.25rem",
              background: currentAlgorithmStateIndex === algorithmStates.length - 1
                ? "rgba(0,131,0,0.8)"
                : "rgba(154,0,0,0.8)",
              color: "white",
              padding: "0.25rem 1.5rem",
              borderRadius: "1rem",
              zIndex: 10,
              width: "fit-content",
            }}
          >
            {algorithm}: {currentAlgorithmStateIndex + 1}/{algorithmStates.length}
          </span>}

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
          {/*    algorithm index: {currentAlgorithmStateIndex}*/}
          {/*  </span>*/}

          {startIndex != null && mousePosition && (
            <svg
              className="graph-svg"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              <line
                x1={nodes[startIndex].x + 20}
                y1={nodes[startIndex].y + 20}
                x2={mousePosition.x + 20}
                y2={mousePosition.y + 20}
                strokeWidth="4"
                stroke="red"
              />
            </svg>
          )}

          {edges.map((edge, index) => {
            // Ensure the start and end indices exist in the nodes array
            if (nodes[edge.start] && nodes[edge.end]) {
              return (
                <React.Fragment key={index}>
                  <svg
                    key={edge.start + "-" + edge.end}
                    className="graph-svg"
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                    }}
                  >
                    <line
                      x1={nodes[edge.start].x + 15}
                      y1={nodes[edge.start].y + 15}
                      x2={nodes[edge.end].x + 15}
                      y2={nodes[edge.end].y + 15}
                      strokeWidth="4"
                      stroke={
                        algorithmStates?.[currentAlgorithmStateIndex]?.edges?.some(
                          (e) =>
                            (e.start === edge.start && e.end === edge.end) ||
                            (e.start === edge.end && e.end === edge.start)
                        )
                          ? "green"
                          : "rgba(0, 0, 0, 0.6)"
                      }
                    />
                  </svg>
                  {/* If the edge has a weight, display it */}
                  {edge.weight && (
                    <div
                      style={{
                        position: "absolute",
                        cursor: "pointer",
                        left:
                          (nodes[edge.start].x + nodes[edge.end].x) / 2 + 10,
                        top:
                          (nodes[edge.start].y + nodes[edge.end].y) / 2 + 10,
                        transform: "translate(-50%, -50%)",
                        background: "rgba(201, 178, 227)",
                        padding: "3px 6px",
                        userSelect: "none",
                        fontWeight: "bold",
                        zIndex: 10,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditEdgeModal(edge.start, edge.end, edge.weight);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeEdge(edge.start, edge.end);
                      }}
                    >
                      {edge.weight}
                    </div>
                  )}
                </React.Fragment>
              );
            } else {
              return null; // Return null if the indices do not exist
            }
          })}

          {nodes.map((node, index) => {
            const algorithmStateNode = algorithmStates?.[currentAlgorithmStateIndex]?.nodes?.[index]
            return (
              <div key={index}>
                {
                  algorithmStateNode && (algorithmStateNode.label != undefined) && (
                    <div style={{
                      position: "absolute",
                      left: node.x,
                      top: node.y > 40 ? (node.y - 30) : (node.y + 45),
                      textAlign: "center",
                      width: 40,
                      backgroundColor: "rgba(0,84,120,0.8)",
                      color: "white",
                      borderRadius: 6,
                      zIndex: 30,
                    }}>
                      {isFinite(algorithmStateNode.label) ? algorithmStateNode.label.toString() : "∞"}
                    </div>
                  )
                }
                <div
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
                    backgroundColor: algorithmStateNode?.visited ? "green" : "black",
                    border:
                      index === selectedNodeIndex ? "2.5px solid white" : "none",
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    removeNode(index);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.ctrlKey) {
                      // If ctrl is pressed, start dragging the node
                      startDraggingNode(index);
                    } else {
                      startDrawingEdge(index);
                    }
                  }}
                  onMouseUp={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (draggingNodeIndex != null) {
                      finishDraggingNode();
                    } else {
                      finishDrawingEdge(index);
                    }
                  }}
                >
                  {index + 1}
                </div>
              </div>
            );
          })}
        </div>

        <label
          htmlFor="rate-range"
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            padding: "0.5rem",
            zIndex: 15,
          }}
        >
          <input
            id="rate-range"
            type="range"
            min="0.1"
            max="2"
            value={intervalRate}
            onChange={(e) => setIntervalRate(parseFloat(e.target.value))}
            step="0.1"
          />
          <h5>Animation Speed: {intervalRate}x</h5>
        </label>

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
          <br/>
          <form onSubmit={handleModalClose}>
            <input
              value={edgeWeight}
              type="number"
              placeholder="Edge Weight"
              autoFocus={true}
              onChange={(input) => handleWeightChange(input)}
            />
            <button type="submit">Submit</button>
          </form>
        </Modal>
      </div>
      <GraphInfo
        showInfo={showInfo}
        nodes={nodes}
        edges={edges}
        adjacencyList={adjacencyList}
        adjacencyMatrix={adjacencyMatrix}
      />

    </div>
  );
};

export default GraphCanvas;
