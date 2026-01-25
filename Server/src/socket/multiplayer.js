import Player from "../models/players.models.js";
import MultiplayerGame from "../models/MultiplayerGame.js";
import {
  createRoom,
  getRoom,
  deleteRoom,
  roomExists,
  getAllRooms,
} from "../store/memory.js";

import { frames, titleMap } from "../data/frames.js";

const startGame = (io, roomCode) => {
  const room = getRoom(roomCode);
  if (!room) {
    return;
  }

  const { game } = room;

  game.resetTimer();
  game.getPlayers().forEach((p) => p.resetState());

  const frame = game.getUnUsedFrame(frames);
  if (!frame) {
    return;
  }

  const answer = titleMap[frame];
  game.setFrame(frame, answer);

  io.to(roomCode).emit("newFrame", frame);
  io.to(roomCode).emit("timerUpdate", game.time);

  if (room.timer) clearInterval(room.timer);

  room.timer = setInterval(() => {
    game.tick();

    io.to(roomCode).emit("timerUpdate", game.time);

    if (game.time <= 0) {
      clearInterval(room.timer);
      room.timer = null;
    }

    io.to(roomCode).emit("roundEnded", {
      message: "Time's up!",
    });

    io.to(roomCode).emit("correctAnswer", {
      answer: game.correctAnswer,
    });

    endRound(io, roomCode);
  }, 1000);
};

const endGame = (io, roomCode) => {
  const room = getRoom(roomCode);
  if (!room) return;

  const { game } = room;

  if (!game.isLastRound()) {
    game.startNewRound();

    setTimeout(() => {
      io.to(roomCode).emit("updatePlayers", game.getPlayers());
      io.to(roomCode).emit("startNewRound", {
        round: game.current,
      });
      startRound(io, roomCode);
    }, 3000);
  } else {
    const players = game.getPlayers();
    const maxScore = Math.max(...players.map((p) => p.score));
    const winner = players.find((p) => p.score === maxScore);

    io.to(roomCode).emit("gameOver", {
      players,
      winner,
    });

    game.resetGame();
    clearInterval(room.timer);
    room.timer = null;
  }
};

export const registerMultiplayerHandlers = (io, socket) => {
  console.log("Multiplayer socket ready:", socket.id);

  {/*create Room handler */}
  socket.on("createRoom", ({ roomCode, username }) => {
    if (!roomCode || !username) {
      socket.emit("Error", "Room code and username required");
      return;
    }

    if (roomExists(roomCode)) {
      socket.emit("createRoomError", "Room already exists");
      return;
    }

    const game = new MultiplayerGame();
    const player = new Player(socket.id, username);

    game.addPlayer(player);
    createRoom(roomCode, game);

    socket.join(roomCode);
    socket.emit("room created", { roomCode });

    io.to(roomCode).emit("receive_message", {
      username: "server",
      message: `${username} create the room.`,
      color: "blue",
    });

    io.to(roomCode).emit("updatePlayers", game.getPlayers());

    console.log(`${roomCode} created by ${username}`);
  });

    {
      /*join Room handler */
    }
  socket.on("joinRoom", ({ roomCode, username }) => {
    if (!roomCode || !username) {
      socket.emit("Error", "Room code and username required");
      return;
    }

    if (!roomExists(roomCode)) {
      socket.emit("joinRoomError", "Room not found");
      return;
    }

    const room = getRoom(roomCode);
    const game = room.game;

    const alreadyJoined = game
      .getPlayers()
      .some((player) => player.id === socket.id);

    if (alreadyJoined) {
      return;
    }

    const player = new Player(socket.id, username);
    game.addPlayer(player);

    socket.join(roomCode);

    io.to(roomCode).emit("receive_message", {
      username: "server",
      message: `${username} joined the room.`,
      color: "blue",
    });

    io.to(roomCode).emit("updatePlayers", game.getPlayers());

    console.log(`Player ${username} joined room ${roomCode}`);

    if (game.isStarted()) {
      socket.emit("startGame", { message: "Game already in progress" });
      socket.emit("startNewRound", { round: game.currentRound });
      socket.emit("newFrame", game.currentFrame);
      socket.emit("timerUpdate", game.time);
    }

    if (game.getPlayers.length >= 2 && !game.isStarted) {
      game.startGame();

      io.to(roomCode).emit("startGame", {
        message: "Game starting...",
      });

      startRound(io, roomCode);
    }
  });

    {
      /*users guess handler */
    }
  socket.on("sendGuess", ({ roomCode, username, message }) => {
    if (!message.trim()) {
      return
    }

    const room = getRoom(roomCode);
    if (!room) {
      return
    }

    const game = room.game()
    const player = game.getPlayers.find((p) => p.id === socket.id);

    const guess = message.trim().toLowerCase();
    const correctAnswer = game.correctAnswer?.toLowerCase();

    if (guess === correctAnswer && !player.hasGuessed) {
        player.hasGuessed = true;
      player.addScore(1);
      
      io.to(roomCode).emit("scoreUpdate", {
        username: player.username,
        score: player.score,
      });

      io.to(roomCode).emit("receive_message", {
        username: "server",
        message: `${player.username} guessed correctly`,
        color: "green",
      });

      io.to(roomCode).emit("updatePlayers", game.getPlayers());

      if (game.hasEveryoneGuessed()) {
        clearInterval(room.timer);
        room.timer = null;

        io.to(roomCode).emit("roundEnded", {
          message: "All players guessed correctly",
        });

        io.to(roomCode).emit("correctAnswer", {
          answer: game.correctAnswer,
        });
        endGame(io, roomCode);
      }
      return;
    }

    io.to(roomCode).emit("receive_message", {
      username,
      message,
      color: "black",
    });
  })

  {/*disconnect handler */ }
  socket.on("disconnect", () => {
    console.log("client disconnect", socket.id);

    for (const [roomCode, room] of getAllRooms()) {
      const game = room.game;
      const players = game.getPlayers();

      const player = players.find((p) => p.id === socket.id)
      if (!player) continue;

      game.removePlayer(socket.id);

      io.to(roomCode).emit("receive_message", {
        username: "server",
        message: `${player.username} has left the game`,
        color:"red"
      })

      io.to(roomCode).emit("updatePlayers", game.getPlayers());

      if (game.isStarted && game.getPlayers().length < 2) {
        if (room.timer) {
          clearInterval(room.timer);
          room.timer = null;
        }

        game.resetGame();
        
         io.to(roomCode).emit("gameStopped", {
           message: "Game stopped due to insufficient players.",
         });
      }

      if (game.getPlayers().length === 0) {
        if (room.timer) {
          clearInterval(room.timer)
        }
        deleteRoom(roomCode)
        console.log(`Room ${roomCode} deleted`);
      }
      break;
    }
  })
};
