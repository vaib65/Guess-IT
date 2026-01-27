import express from "express";
import SingleGame from "../models/singleplayerGame.models.js";
import { setSingleGame, getSingleGame } from "../store/single/singleplayerGame.js";
import { frames, titleMap } from "../data/frames.js";

const router = express.Router();

{
  /*start game */
}

router.post("/start", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userID is required",
    });
  }

  const game = new SingleGame();

  const frame = game.getUnUsedFrame(frames);
  if (!frame) {
    return res.status(400).json({
      success: false,
      message: "No frames left",
    });
  }

  const answer = titleMap[frame];
  game.setFrame(frame, answer);

  setSingleGame(userId, game);

  return res.json({
    success: true,
    frame,
    message: "Game started",
  });
});

// submit guess
router.post("/guess", (req, res) => {
  const { userId, guess } = req.body;

  if (!userId || !guess) {
    return res.status(400).json({
      success: false,
      message: "userId and guess are required",
    });
  }

  const game = getSingleGame(userId);
  if (!game) {
    return res.status(404).json({
      success: false,
      message: "Game not found. Start a game first.",
    });
  }

  const result = game.submitGuess(guess);
  setSingleGame(userId, game);

  if (result.correct) {
    return res.json({
      success: true,
      correct: true,
      gameOver: false,
      message: "Correct guess",
    });
  }

  return res.json({
    success: true,
    correct: false,
    gameOver: true,
    score: result.score,
    message: "Wrong guess. Game over.",
  });
});

// next frame
router.post("/next", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userID is required",
    });
  }

  const game = getSingleGame(userId);
  if (!game) {
    return res.status(404).json({
      success: false,
      message: "Game not found. Start a game first.",
    });
  }

  if (game.isOver) {
    return res.json({
      success: false,
      message: "Game is already over",
    });
  }

  const frame = game.getUnUsedFrame(frames);
  if (!frame) {
    game.isOver = true;
    setSingleGame(userId, game);
    return res.json({
      success: true,
      completed: true,
      score: game.score,
      message: "No frames left",
    });

  }

  const answer = titleMap[frame];
  game.setFrame(frame, answer);

  setSingleGame(userId, game);

  return res.json({
    success: true,
    frame,
    completed:false,
    message: "new frame",
  });
});

// reset game
router.post("/reset", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userID is required",
    });
  }

  const game = getSingleGame(userId);


  if (!game) {
    return res.json({
      success: true,
      message: "No active game. Ready to start.",
    });
  }

  game.reset();
  setSingleGame(userId, game);

  return res.json({
    success: true,
    message: "Game reset successfully",
  });
});


export default router;
