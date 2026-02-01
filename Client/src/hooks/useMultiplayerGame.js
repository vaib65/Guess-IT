import { useEffect, useState } from "react";
import { socket } from "../config/socket";
import toast from "react-hot-toast";

export function useMultiplayerGame({ userId, navigate }) {
  const [players, setPlayers] = useState([]);
  const [frame, setFrame] = useState(null);
  const [time, setTime] = useState(0);
  const [round, setRound] = useState(1);
  const [messages, setMessages] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    socket.emit("reconnectPlayer", { userId });

    socket.on("syncState", ({ frame, time, players, round }) => {
      setFrame(frame);
      setTime(time);
      setPlayers(players);
      setRound(round);
    });

    socket.on("updatePlayers", setPlayers);

    socket.on("gameStarting", () => {
      setShowCountdown(true);
      setCountdown(5);

      let count = 5;
      const interval = setInterval(() => {
        count--;
        setCountdown(count);
        if (count === 0) {
          clearInterval(interval);
          setShowCountdown(false);
        }
      }, 1000);
    });

    socket.on("newFrame", setFrame);
    socket.on("timerUpdate", setTime);

    socket.on("receive_message", (msg) =>
      setMessages((prev) => [...prev, msg]),
    );

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
      socket.off();
    };
  }, [userId, navigate]);

  return {
    players,
    frame,
    time,
    round,
    messages,
    correctAnswer,
    showCountdown,
    countdown,
  };
}
