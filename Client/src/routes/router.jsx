import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Home from "../pages/Home.jsx";
import WinnerPage from "../pages/multi-player/WinnerPage.jsx";
import GamePage from "../pages/multi-player/GamePage.jsx";
import CreateRoomPage from "../pages/multi-player/CreateRoomPage.jsx";
import FinalScore from "../pages/single/FinalScore.jsx";
import SinglePlayer from "../pages/single/SinglePlayer.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "single", element: <SinglePlayer /> },
      { path: "final", element: <FinalScore /> },
      { path: "room", element: <CreateRoomPage /> },
      { path: "room/:roomCode", element: <GamePage /> },
      { path: "winner", element: <WinnerPage /> },
    ],
  },
]);