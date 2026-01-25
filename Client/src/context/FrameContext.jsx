import { createContext, useEffect, useState } from "react";

import { socket } from "../config/Socket";

export const FrameContext = createContext({
  frame: null,
  setFrame: () => {},
  guess: "",
  setGuess: () => {},
  isCorrect: null,
  setIsCorrect: () => {},
  result: "",
  setResult: () => {},
  showNext: false,
  setShowNext: () => {},
  score: 0,
  setScore: () => { },
  gameOver: null,
  setGameOver:()=>{},
  handleSubmitClick: () => {},
  handleNext: () => {},
  startSinglePlayer: () => { },
});

export const FrameContextProvider = ({ children }) => {
  const [frame, setFrame] = useState(null);
  const [guess, setGuess] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [result, setResult] = useState("");
  const [showNext, setShowNext] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(null);

  useEffect(() => {

    socket.on("singlePlayerStarted", (frame) => {
      setFrame(frame);
      setResult("");
      setIsCorrect(false);
      setShowNext(false);
    });

    socket.on("singleGuessResult", ({ correct, score, message }) => {
      setIsCorrect(correct);
      setResult(message);
      setScore(score);
      setShowNext(true);
    });

    socket.on("nextSingleFrame", (frame) => {
      setFrame(frame);
      setResult("");
      setGuess("");
      setIsCorrect(false);
      setShowNext(false);
    });

    socket.on("singleGameOver", ({ score }) => {
      
      setGameOver(score);
      setGuess("");
    });

    return () => {
      socket.off("singlePlayerStarted");
      socket.off("singleGuessResult");
      socket.off("nextSingleFrame");
      socket.off("singleGameOver");
    };
  }, []);

  //start game
  const startSinglePlayer = () => {
    socket.emit("startSinglePlayer");
    setGuess("");
    setGameOver(null);
    setResult("");
    setIsCorrect(false);
    setShowNext(false);
    setScore(0);
  };

  //  Submit guess
  const handleSubmitClick = () => {
    //check if empty
    if (!guess.trim()) return;
    
    socket.emit("submitSingleGuess", guess.trim());
  };

  // Move to next frame
  const handleNext = () => {
    socket.emit("nextSingleFrame");
  };

 
  const value = {
    frame,
    setFrame,
    guess,
    setGuess,
    isCorrect,
    setIsCorrect,
    result,
    setResult,
    showNext,
    setShowNext,
    score,
    setScore,
    handleNext,
    handleSubmitClick,
    gameOver,
    setGameOver,
    startSinglePlayer,
  };

  return (
    <FrameContext.Provider value={value}>{children}</FrameContext.Provider>
  );
};
