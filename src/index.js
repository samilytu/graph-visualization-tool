import React from 'react';
// import ReactDOM from 'react-dom';
import App from './App.js';
import { createRoot } from 'react-dom/client';
// import bootstrap from 'bootstrap'


const container = document.getElementById('root');

const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);