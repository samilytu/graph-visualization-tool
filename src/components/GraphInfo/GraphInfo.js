import React from "react";

const GraphInfo = ({showInfo, nodes, edges, adjacencyList, adjacencyMatrix}) => {

  function calculateDegrees(adjacencyList) {
    return adjacencyList.map((neighbors) => neighbors.length);
  }

  const degrees = calculateDegrees(adjacencyList);
  return (
    <>
      {showInfo &&
        <div className="graph-info">
          <h2 style={{textAlign: "center"}}>Graph Info</h2>
          <hr style={{marginTop: ".5rem", opacity: 1}}/>
          <p style={{marginBottom: 0}}>Node count: {nodes.length}</p>
          <p>Edge count: {edges.length}</p>
          {nodes.length > 0 && <>
            <h4>Adjacency List:</h4>
            <ul>
              {adjacencyList.map((neighbors, index) => (
                <li key={index} style={{textAlign: "initial"}}>
                  ({index + 1}) -&gt;{" "}
                  {neighbors.map((neighbor) => `(${neighbor + 1})`).join(" -> ")}
                </li>
              ))}
            </ul>
            <h4>Adjacency Matrix:</h4>
            <table style={{marginBottom: "1rem"}}>
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
            <h4>Degrees:</h4>
            <ul style={{marginBottom: 0}}>
              {degrees.map((degree, index) => (
                <li key={index} style={{textAlign: "initial"}}>
                  deg({index}) = {degree}
                </li>
              ))}
            </ul>
          </>
          }
        </div>
      }
    </>
  );
};

export default GraphInfo;
