import React from 'react';

const GraphInfo = ({ nodes, edges, adjacencyList }) => {
    return (
        <div className="graph-info">
            <h2>Graph Info</h2>
            <p>Node count: {nodes.length}</p>
            <p>Edge count: {edges.length}</p>
            <h3>Adjacency List:</h3>
            <ul>
                {adjacencyList.map((neighbors, index) => (
                    <li key={index}>
                        ({index + 1}) -&gt; {neighbors.map((neighbor) => `(${neighbor + 1})`).join(' -> ')}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GraphInfo;
