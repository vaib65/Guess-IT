import Clock from "../../components/multiplayer/Clock.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { getUserId } from "../../utils/userId.js";
import { useEffect, useState } from "react";
import { socket } from "../../config/socket.js";
import PlayerList from "./PlayerList.jsx";
import toast from "react-hot-toast";
import Chat from "../../components/multiplayer/Chat.jsx";
import FrameDisplay from "../../components/multiplayer/FrameDisplay.jsx";
import Modal from "../../components/multiplayer/Modal.jsx";

const GamePage = () => {
  const { roomCode } = useParams();
  const userId = getUserId();

  const [players, setPlayers] = useState([]);
  const [frame, setFrame] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [gameOverData, setGameOverData] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [time, setTime] = useState(0);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(5);

  const navigate = useNavigate();
  //select host first player
  const isHost = players.length > 0 && players[0].userId === userId;

useEffect(() => {
  if (!frame && players.length > 0) {
    setShowModal(true);
  } else {
    setShowModal(false);
  }
}, [frame, players.length]);


useEffect(() => {
  socket.emit("reconnectPlayer", { userId });

  // 🔹 reconnect restores ONLY volatile game state
  socket.on("reconnected", ({ frame, time,players, round }) => {
    setFrame(frame);
    setTime(time);
    setPlayers(players);
    setRound(round);
  });

  socket.on("gameStarting", () => {
    setShowModal(true); // 👈 force open for everyone
    setShowCountdown(true);
    setCountdown(5);

    let count = 5;
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);

      if (count === 0) {
        clearInterval(interval);
        setShowCountdown(false);
      }
    }, 1000);
  });


  // 🔹 SINGLE SOURCE OF TRUTH for players
  socket.on("updatePlayers", setPlayers);

 socket.on("newFrame", (frame) => {
   setFrame(frame);
   setShowModal(false);
   setShowCountdown(false);
 });
  socket.on("timerUpdate", setTime);

  socket.on("receive_message", (msg) => setMessages((prev) => [...prev, msg]));

  socket.on("correctAnswer", ({ answer }) => setCorrectAnswer(answer));

  socket.on("startNewRound", ({ round }) => {
    setRound(round);
    setCorrectAnswer(null);
  });

  socket.on("gameStopped", ({ message }) => {
    toast.error(message || "Game stopped");
    navigate("/");
  });

  socket.on("gameOver", ({ players, winner }) => {
    navigate("/winner", { state: { players, winner } });
  });

  return () => {
    socket.off("reconnected");
    socket.off("gameStarting");
    socket.off("updatePlayers");
    socket.off("newFrame");
    socket.off("timerUpdate");
    socket.off("receive_message");
    socket.off("correctAnswer");
    socket.off("startNewRound");
    socket.off("gameStopped");
    socket.off("gameOver");
  };
}, [navigate, userId]);


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

        {/* {isHost && !frame && (
          <button
            onClick={handleStartGame}
            className="px-4 py-1 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            Start Game
          </button>
        )} */}

        <Clock time={time} round={round} totalRounds={totalRounds} />

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
