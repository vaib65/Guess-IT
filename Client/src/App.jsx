
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Single from './components/Single/Single'
import Home from './components/Home'
import FinalScore from './components/Single/FinalScore'
import GamePage from './components/MultiPlayer/GamePage'
import CreateRoomPage from './components/MultiPlayer/CreateRoomPage'
import WinnerPage from './components/MultiPlayer/WinnerPage'

function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/single" element={<Single />} />
          <Route path="final" element={<FinalScore />} />
          <Route path="winner" element={<WinnerPage/>} />
          <Route path="/room" element={<CreateRoomPage />} />
          <Route path="/room/:roomCode" element={<GamePage/>} />
        </Routes>
      </BrowserRouter>
      {/* <Home/> */}
      {/* <Single/> */}
      {/* <FinalScore/> */}
      {/* <HomePage/> */}
    </>
  );
}


export default App
