import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import WinnerPage from "../pages/multi-player/WinnerPage";
import GamePage from "../pages/multi-player/GamePage";
import CreateRoomPage from "../pages/multi-player/CreateRoomPage";
import FinalScore from "../pages/single/FinalScore";
import SinglePlayer from "../pages/single/SinglePlayer";

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