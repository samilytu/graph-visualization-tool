import React from 'react';
// import ReactDOM from 'react-dom';
import App from './App.js';
import {createRoot} from 'react-dom/client';
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./dev";
import "bootstrap/dist/css/bootstrap.min.css";

const container = document.getElementById('root');

const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<DevSupport ComponentPreviews={ComponentPreviews}
                        useInitialHook={useInitial}
>
    <App/>
</DevSupport>);