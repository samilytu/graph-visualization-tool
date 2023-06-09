import React from "react";
import { useState } from "react";

const GraphInfo = ({ nodes, edges, adjacencyList, adjacencyMatrix }) => {
  const [showInfo, setShowInfo] = useState(false);
  function calculateDegrees(adjacencyList) {
    return adjacencyList.map((neighbors) => neighbors.length);
  }
  const degrees = calculateDegrees(adjacencyList);
  return (
    <div className="graph-info">
      <button onClick={() => setShowInfo(!showInfo)}>
        {showInfo ? "Hide Graph Info" : "Show Graph Info"}
      </button>
      {showInfo && (
        <>
          <h2>Graph Info</h2>
          <p>Node count: {nodes.length}</p>
          <p>Edge count: {edges.length}</p>
          <h3>Adjacency List:</h3>
          <ul>
            {adjacencyList.map((neighbors, index) => (
              <li key={index}>
                ({index + 1}) -&gt;{" "}
                {neighbors.map((neighbor) => `(${neighbor + 1})`).join(" -> ")}
              </li>
            ))}
          </ul>
          <h3>Adjacency Matrix:</h3>
          <table>
            <thead>
              <tr>
                <th></th>
                {nodes.map((node, index) => (
                  <th key={`header-${index}`}>{index + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adjacencyMatrix.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  <th>{rowIndex + 1}</th>
                  {row.map((weight, colIndex) => (
                    <td key={`cell-${rowIndex}-${colIndex}`}>
                      {weight !== 0 ? weight : 0}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Degrees:</h3>
          <ul>
            {degrees.map((degree, index) => (
              <li key={index}>
                deg({index}) = {degree}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default GraphInfo;
