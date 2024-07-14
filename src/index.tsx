import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const container: HTMLElement = document.getElementById('root') as HTMLElement;
const root: ReactDOM.Root = ReactDOM.createRoot(container);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
