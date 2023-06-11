import React from "react";
// import Toolbar from "./components/Toolbar/Toolbar";
import GraphCanvas from "./components/GraphCanvas/GraphCanvas";
import Welcome from "./Welcome";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <Welcome/>
      <GraphCanvas/>
    </div>
  );
};

export default App;
