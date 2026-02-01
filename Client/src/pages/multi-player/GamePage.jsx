import Clock from "../../components/multiplayer/Clock.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { getUserId } from "../../utils/userId.js";
import {useState } from "react";
import { socket } from "../../config/socket.js";
import PlayerList from "./PlayerList.jsx";
import Chat from "../../components/multiplayer/Chat.jsx";
import FrameDisplay from "../../components/multiplayer/FrameDisplay.jsx";
import Modal from "../../components/multiplayer/Modal.jsx";
import { useMultiplayerGame } from "../../hooks/useMultiplayerGame.js";

const GamePage = () => {
  const { roomCode } = useParams();
  const userId = getUserId();
  const TOTAL_ROUNDS = 5;

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const {
    players,
    frame,
    time,
    round,
    messages,
    correctAnswer,
    showCountdown,
    countdown,
  } = useMultiplayerGame({ userId, navigate });

  //select host first player
  const isHost = players.length > 0 && players[0].userId === userId;

  const showModal = !frame && players.length > 0;

  const sendGuess = (guess) => {
    socket.emit("sendGuess", {
      roomCode,
      message: guess,
    });
  };

  const handleStartGame = () => {
    socket.emit("startGame", {
      roomCode,
      userId,
    });
  };
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      {/*Top Area*/}
      <div className="h-30 flex items-center justify-between px-6 border-b border-zinc-700">
        <div className="text-2xl font-bold mx-5">
          Guess<span className="text-red-700">.IT</span>
        </div>

        <Clock time={time} round={round} totalRounds={TOTAL_ROUNDS} />

        {correctAnswer && (
          <div className="text-green-400 font-semibold text-2xl">
            ✅ Correct Answer: {correctAnswer}
          </div>
        )}

        <div className="text-2xl text-zinc-400 mx-5">Room:{roomCode}</div>
      </div>

      {/*Main Area */}
      <div className="flex flex-1 overflow-hidden mt-5">
        {/* LEFT PLAYERS */}
        <div className="w-[20%] h-[75vh] p-3 border border-zinc-700 rounded-xl mx-5">
          <PlayerList players={players} currentUserId={userId} />
        </div>

        {/* CENTER FRAME */}
        <div className="flex-1 flex justify-center">
          <div className="w-[70%] h-[75vh]">
            <FrameDisplay frame={frame} />
          </div>
        </div>

        {/* RIGHT CHAT */}
        <div className="w-[30%] h-[75vh] border border-zinc-700 rounded-xl flex flex-col mx-5">
          <Chat
            messages={messages}
            message={message}
            setMessage={setMessage}
            sendGuess={sendGuess}
          />
        </div>
      </div>
      <Modal
        isOpen={showModal}
        isHost={isHost}
        showCountdown={showCountdown}
        countdown={countdown}
        onStart={handleStartGame}
      />
    </div>
  );
};

export default GamePage;
