import React from 'react';
import Toolbar from './components/Toolbar/Toolbar';
import GraphCanvas from './components/GraphCanvas/GraphCanvas';
import AlgorithmControls from './components/AlgorithmControls/AlgorithmControls';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    return (
        <div className="app">
            <h1>Welcome To Graph Visualization Tool</h1>
            {/* <Toolbar /> */}
            <AlgorithmControls />
            <GraphCanvas />
            
        </div>
    );
};

export default App;
