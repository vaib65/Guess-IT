import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GameContextProvider } from './context/GameContext.jsx'
import { FrameContextProvider } from './context/FrameContext.jsx'
// import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GameContextProvider>
      <FrameContextProvider>
          <App />
      </FrameContextProvider>
    </GameContextProvider>
  </StrictMode>
);
