import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RelayProvider } from './context/RelayContext';
import App from './App';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <RelayProvider>
        <App />
      </RelayProvider>
    </BrowserRouter>
  </StrictMode>
);
