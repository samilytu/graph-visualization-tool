import React from "react";
// import Toolbar from "./components/Toolbar/Toolbar";
import GraphCanvas from "./components/GraphCanvas/GraphCanvas";
import AlgorithmControls from "./components/AlgorithmControls/AlgorithmControls";
import Welcome from "./Welcome";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <div className="app">
      <Welcome />
      <GraphCanvas />
    </div>
  );
};

export default App;
