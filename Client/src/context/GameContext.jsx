import { createContext, useEffect, useState } from "react";

import { socket } from "../config/Socket";


import { socket } from "../config/Socket";
export const GameContext = createContext({
  username: "",
  setUsername: () => { },
  roomCode:"",
  setRoomCode:()=>{},
  messages: [],
  setMessages: () => {},
  socket: null,
  playersList: {},
  setPlayersList: () => {},
  time: 60,
  setTime: () => {},
  round: 1,
  setRound: () => { },
  frame: null,
  setFrame:()=>{},
  correctAnswer: "",
  setCorrectAnswer: () => {},
  reset: () => {},
});

export const GameContextProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [messages, setMessages] = useState([]);
  const [playersList, setPlayersList] = useState([]);
  const [time, setTime] = useState(60);
  const [round, setRound] = useState(1);
  const [frame, setFrame] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);


  useEffect(() => {

    socket.on("newFrame", (incomingFrame) => {
      setFrame(incomingFrame);
      setCorrectAnswer(null)
    });
    socket.on("correctAnswer", ({ answer }) => {
      setCorrectAnswer(answer);
    })

    socket.on("updatePlayers", setPlayersList);

    socket.on("receive_message", (incomingMessage) =>
      setMessages((prevMessages) => [...prevMessages, incomingMessage])
    );

    socket.on("timerUpdate", (updateTime) => setTime(updateTime));

    socket.on("scoreUpdate", ({ username, score }) => {
      setPlayersList((prev) =>
        prev.map((player) =>
          player.username === username ? { ...player, score } : player
        )
      );
    });

    socket.on("roundEnded", ({ message }) => {
      setMessages((prev) => [
        ...prev,
        { username: "server", message, color: "blue" },
      ]);
    });
    
    socket.on("startNewRound", ({ round })=> {
      setRound(round);
    });

    socket.on("gameStopped", ({ message }) => {
      setMessages((prev) => [
        ...prev,
        { username: "server", message, color: "red" },
      ]);
      reset();
    });

    return () => {
      socket.off("newFrame");
      socket.off("correctAnswer");
      socket.off("updatePlayers");
      socket.off("receive_message");
      socket.off("timerUpdate");
      socket.off("scoreUpdate");
      socket.off("roundEnded");
      socket.off("startNewRound");
      socket.off("gameStopped");
    };
    // return () => socket.disconnect();
  }, []);

  const reset = () => {
    if (roomCode) {
      socket.emit("leaveRoom", { roomCode });
    }
    setPlayersList([]);
    setMessages([]);
    setRound(1);
    setFrame(null);
    setTime(60);
    setRoomCode("");
    setUsername("");
    setCorrectAnswer(null)
  };

  const sendGuess = (message) => {
    // setMessages((prev) => [...prev, { username, message, color: "black" }]);
    socket.emit("send_message", { roomCode, username, message });
  };
  const createRoom = (code) => {
    setRoomCode(code);
    socket.emit("createRoom", { roomCode: code, username });
  };

  const joinRoom = (code) => {
    setRoomCode(code);
    socket.emit("joinRoom", { roomCode: code, username });
  };

  const value = {
    username,
    setUsername,
    roomCode,
    setRoomCode,
    sendGuess,
    createRoom,
    joinRoom,
    messages,
    setMessages,
    socket,
    playersList,
    setPlayersList,
    time,
    setTime,
    round,
    setRound,
    reset,
    frame,
    setFrame,
    correctAnswer,
    setCorrectAnswer
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
