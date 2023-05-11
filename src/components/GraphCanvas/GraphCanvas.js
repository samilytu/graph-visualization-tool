import React, { useState } from 'react';
import './GraphCanvas.css';

const GraphCanvas = () => {
    const [nodes, setNodes] = useState([]);

    const drawNode = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setNodes([...nodes, { x, y }]);
    };

    return (
        <div className="graph-canvas" onClick={drawNode}>
            <svg  style={{ width: '100%', height: '100%' }} className="svgg">
                {nodes.map((node, index) => (
                    <g key={index}>
                        <circle cx={node.x} cy={node.y} r="15" fill="black" />
                        <text
                        
                            x={node.x}
                            y={node.y}
                            cursor={'default'}
                            dy=".3em"


                            textAnchor="middle"
                            fill="white"

                            fontSize="14px"
                            
                            
                        >
                            {index + 1}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
};

export default GraphCanvas;
