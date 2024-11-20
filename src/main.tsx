import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootId = 'root';
const root = document.getElementById(rootId);

if (!root) {
  throw new Error(`Unable to find element "${rootId}"`);
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
