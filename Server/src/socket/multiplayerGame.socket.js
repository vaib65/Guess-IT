import Player from "../models/players.models.js";
import MultiplayerGame from "../models/multiplayerGame.models.js";
import { frames, titleMap } from "../data/frames.js";
import {
  createMemoryRoom,
  deleteMemoryRoom,
  getAllMemoryRooms,
  getMemoryRoom,
} from "../store/multi/memoryRooms.js";

const startRound = (io, roomCode) => {
  const room = getMemoryRoom(roomCode);

  if (!room) {
    return;
  }

  const { game } = room;

  game.setRoundTimer();
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
    const remaining = game.getRemainingTime();

    io.to(roomCode).emit("timerUpdate", remaining);

    if (remaining <= 0) {
      clearInterval(room.timer);
      room.timer = null;

      io.to(roomCode).emit("roundEnded", {
        message: "Time's up!",
      });

      io.to(roomCode).emit("correctAnswer", {
        answer: game.correctAnswer,
      });

      endGame(io, roomCode);
    }
  }, 1000);
};

const endGame = (io, roomCode) => {
  const room = getMemoryRoom(roomCode);
  if (!room) return;

  const { game } = room;

  const activePlayers = game.getPlayers().filter((p) => p.connected);

  if (activePlayers.length < 2) {
    game.resetGame();
    io.to(roomCode).emit("gameStopped", {
      message: "Game stopped due to insufficient players.",
    });
    return;
  }

  if (!game.isLastRound()) {
    game.startNewRound();

    setTimeout(() => {
      io.to(roomCode).emit("updatePlayers", game.getSafePlayers());
      io.to(roomCode).emit("startNewRound", {
        round: game.currentRound,
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

  {
    /*create Room handler */
  }
  socket.on("createRoom", ({ roomCode, username, userId }) => {
    if (!roomCode || !username || !userId) {
      socket.emit("Error", "Room code and username required");
      return;
    }

    if (getMemoryRoom(roomCode)) {
      socket.emit("createRoomError", "Room already exists");
      return;
    }

    const game = new MultiplayerGame();
    const player = new Player({
      userId,
      socketId: socket.id,
      username,
    });

    game.addPlayer(player);
    createMemoryRoom(roomCode, game);

    socket.join(roomCode);
    socket.emit("roomCreated", { roomCode });

    io.to(roomCode).emit("updatePlayers", game.getSafePlayers());

    console.log(`${roomCode} created by ${username}`);
  });

  {
    /*join Room handler */
  }
  socket.on("joinRoom", ({ roomCode, username, userId }) => {
    if (!roomCode || !username || !userId) {
      socket.emit("Error", "Room code and username required");
      return;
    }

    const room = getMemoryRoom(roomCode);
    if (!room) {
      socket.emit("joinRoomError", "Room not found");
      return;
    }

    const game = room.game;

    const exists = game.getPlayers().some((p) => p.userId === userId);
    if (exists) {
      socket.emit("joinRoomError", "Player already in room");
      return;
    }

    const player = new Player({ userId, username, socketId: socket.id });
    game.addPlayer(player);

    socket.join(roomCode);
    socket.emit("roomJoined", { roomCode });

    //sync State
    socket.emit("syncState", {
      roomCode,
      frame: game.currentFrame,
      time: game.getRemainingTime(),
      players: game.getSafePlayers(),
      round: game.currentRound,
    });

    io.to(roomCode).emit("updatePlayers", game.getSafePlayers());

    console.log(`Player ${username} joined room ${roomCode}`);
  });

  {
    /* reconnect room handler */
  }
  socket.on("reconnectPlayer", ({ userId }) => {
    if (!userId) return;

    const rooms = getAllMemoryRooms();

    for (const [roomCode, room] of rooms.entries()) {
      const game = room.game;
      const player = game.getPlayers().find((p) => p.userId === userId);
      if (!player) continue;

      // ALWAYS attach socket
      player.socketId = socket.id;
      player.connected = true;

      if (player.disconnectTimeout) {
        clearTimeout(player.disconnectTimeout);
        player.disconnectTimeout = null;
      }

      socket.join(roomCode);

      // sync state
      socket.emit("syncState", {
        roomCode,
        frame: game.currentFrame,
        time: game.getRemainingTime(),
        players: game.getSafePlayers(),
        round: game.currentRound,
      });

      io.to(roomCode).emit("updatePlayers", game.getSafePlayers());

    }
  });

  {
    /* start Game handler */
  }
  socket.on("startGame", ({ roomCode, userId }) => {
    const room = getMemoryRoom(roomCode);
    if (!room) return;

    const game = room.game;

    // only host can start
    const host = game.getPlayers()[0];

    if (!host || host.userId !== userId) return;

    if (game.isStarted) return;

    // mark game as started
    game.startGame();

    //  notify all players to show countdown modal
    io.to(roomCode).emit("gameStarting");

    //  start actual game after 5 seconds
    setTimeout(() => {
      startRound(io, roomCode);
    }, 5000);
  });

  {
    /*users guess handler */
  }
  socket.on("sendGuess", ({ roomCode, username, message }) => {
    const room = getMemoryRoom(roomCode);
    if (!room) {
      return;
    }

    const game = room.game;
    const player = game.getPlayers().find((p) => p.socketId === socket.id);
    if (!player || !player.connected) return;

    const guess = message.trim().toLowerCase();
    if (!guess) return;

    //already guessed
    if (player.hasGuessed) {
      socket.emit("receive_message", {
        username: "server",
        message: "You already guessed correctly",
        color: "gray",
      });
      return;
    }

    const correctAnswer = game.correctAnswer?.toLowerCase();
    //correct guess first time guess
    if (guess === correctAnswer) {
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

      io.to(roomCode).emit("updatePlayers", game.getSafePlayers());

      if (game.hasEveryoneGuessed()) {
        clearInterval(room.timer);
        room.timer = null;

        io.to(roomCode).emit("roundEnded");

        io.to(roomCode).emit("correctAnswer", {
          answer: game.correctAnswer,
        });

        endGame(io, roomCode);
      }
      return;
    }

    //wrong guess normal message
    io.to(roomCode).emit("receive_message", {
      username: player.username,
      message,
      color: "black",
    });
  });

  {
    /*disconnect handler */
  }
  socket.on("disconnect", () => {
    const rooms = getAllMemoryRooms();

    for (const [roomCode, room] of rooms.entries()) {
      const game = room.game;
      const player = game.getPlayers().find((p) => p.socketId === socket.id);
      if (!player) continue;

      player.connected = false;

      io.to(roomCode).emit("receive_message", {
        username: "server",
        message: `${player.username} disconnected (waiting to reconnect...)`,
        color: "orange",
      });

      player.disconnectTimeout = setTimeout(() => {
        // remove player if not back 
        if (!player.connected) {
          game.removePlayerByUserId(player.userId);

          io.to(roomCode).emit("receive_message", {
            username: "server",
            message: `${player.username} left the game`,
            color: "red",
          });

          io.to(roomCode).emit("updatePlayers", game.getSafePlayers());

          if (game.getPlayers().length === 0) {
            deleteMemoryRoom(roomCode);
          }
        }
      }, 15000);

      return;
    }
  });
};
