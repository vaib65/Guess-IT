import React, { useContext, useEffect } from "react";
import Chat from "./Chat";
import PlayerList from "./PlayerList";
import FrameDisplay from "./FrameDisplay";
import { GameContext } from "../../context/GameContext";
import { useNavigate } from "react-router-dom";
import Clock from "./Clock";

export default function GamePage() {
  const { socket, setMessages, setPlayersList, round, reset, correctAnswer } =
    useContext(GameContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleGameOver = ({ message, winner, players }) => {
      setPlayersList(players);
      reset();
      navigate("/winner", { state: { winner, players } });
    };

    socket.on("gameOver", handleGameOver);

    return () => {
      socket.off("gameOver", handleGameOver);
    };
  }, [socket, navigate, setMessages, setPlayersList]);

  return (
    <div className="h-full p-4 flex flex-col">
      <div className="flex justify-center items-center  gap-8 mb-4 bg-white w-full font-semibold text-black">
        <Clock />
        <div>
          {correctAnswer && (
            <div className="mt-2 text-lg text-center text-green-700 font-bold">
              ✅ Correct Answer: {correctAnswer}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 gap-4">
        <div className="w-[20%] h-[75vh] bg-white rounded-xl shadow-md p-3 overflow-auto">
          <PlayerList />
        </div>
        <div className="w-[50%] h-[75vh] bg-white rounded-xl shadow-md p-3 flex items-center justify-center">
          <FrameDisplay />
        </div>
        <div className="w-[29%] h-[75vh] bg-white rounded-xl shadow-md p-3 flex flex-col">
          <Chat />
        </div>
      </div>
    </div>
  );
}
