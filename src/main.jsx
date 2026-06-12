import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { RelayProvider } from './context/RelayContext';
import App from './App';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <RelayProvider>
        <App />
      </RelayProvider>
    </BrowserRouter>
  </StrictMode>
);
