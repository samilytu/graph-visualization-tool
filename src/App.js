import React from 'react';
import Toolbar from './components/Toolbar/Toolbar';
import GraphCanvas from './components/GraphCanvas/GraphCanvas';
import AlgorithmControls from './components/AlgorithmControls/AlgorithmControls';

import './App.css';

const App = () => {
    return (
        <div className="app">
            <Toolbar />
            <GraphCanvas />
            <AlgorithmControls />
        </div>
    );
};

export default App;
