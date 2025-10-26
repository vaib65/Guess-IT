const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { frames, titleMap } = require("./config/Frames");
const Player = require("./config/Player");
const Game = require("./config/Game");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
// app.use(express.json());
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running  on PORT http://localhost:${PORT}`);
});


//rooms
const rooms = {};

io.on("connection", (socket) => {
  { /*Code for singleplayer game */ }
  
  socket.on("startSinglePlayer", () => {
    const singleGame = new Game();
    const player = new Player(socket.id, "SinglePlayer");

    singleGame.addPlayer(player);

    const frame = singleGame.getUnUsedFrame(frames);
    const answer = titleMap[frame];

    console.log(`Selected frame: ${frame}`);
    console.log(`Corresponding answer: ${answer}`);

    singleGame.setNewFrame(frame, answer);

    socket.singleGame = singleGame;
    socket.emit("singlePlayerStarted", frame);
  })

  socket.on("submitSingleGuess", (guess) => {
    const game = socket.singleGame;
    if (!game) return;

    const player = game.getPlayers()[0];
    if (!player) return;

    const correctAnswer = game.correctAnswer?.toLowerCase();
    const userGuess = guess.toLowerCase().trim();

    if (userGuess === correctAnswer) {
      
      game.correct=true;
      player.addScore(1);

      socket.emit("singleGuessResult", {
        correct:game.correct,
        score: player.score,
        message: "✅ Correct!",
      });
    }else {
      socket.emit("singleGameOver", {
        message: "Game Over!",
        score: game.getPlayers()[0].score,
      });
      game.singleGameReset();
    }
  })

  socket.on("nextSingleFrame", () => {
    const game = socket.singleGame;
    if (!game) return;

    if (!game.correct) {
      socket.emit("singleGameOver", {
        message: "Game Over!",
        score: game.getPlayers()[0].score,
      });
      return;
    }

    const frame = game.getUnUsedFrame(frames);
    const answer = titleMap[frame];
    game.setNewFrame(frame, answer);

     socket.emit("nextSingleFrame",frame,);
  })

  // socket.on("resetSinglePlayer", () => {
  //   if (socket.singleGame) {
  //     socket.singleGame.reset();
  //     delete socket.singleGame;
  //   }

  //   socket.emit("singlePlayerReset");
  // });

  {/*Code for multiplayer game */ }
  console.log(`Client connected: ${socket.id}`);

  //handles round completion, frame selection, and timer start
  const handleEndOfRound = (roomCode) => {
    const room = rooms[roomCode];
    room.game.resetTimer();
    room.game.resetPlayerState();

    // random frame and correct answer
    const frame = room.game.getUnUsedFrame(frames);
    const answer = titleMap[frame];

    //logs for checking which frame and answer selected
    // console.log(`Selected frame: ${frame}`);
    // console.log(`Corresponding answer: ${answer}`);

    room.game.setNewFrame(frame, answer);

    io.to(roomCode).emit("newFrame", frame);

    room.timer = setInterval(() => {
      //if players are less than 2 then clear the interval.
      if (room.game.getPlayers().length < 2) {
        if (room.timer) {
          clearInterval(room.timer);
        }
        return;
      }
      room.game.oneSecondPassed();
      io.to(roomCode).emit("timerUpdate", room.game.getTime());

      if (room.game.getTime() <= 0) {
        clearInterval(room.timer);
        io.to(roomCode).emit("roundEnded", { message: "Time's up!" });
        //set correct answer
        io.to(roomCode).emit("correctAnswer", {
          answer: room.game.correctAnswer,
        });
        endGame(roomCode);
      }
    }, 1000);
  };

  //handles game completion or transition to next round
  const endGame = (roomCode) => {
    const room = rooms[roomCode];
    if (!room) return;

    if (!room.game.checkForLastRound()) {
      room.game.startNewRound();

      setTimeout(() => {
        io.to(roomCode).emit("updatePlayers", room.game.getPlayers());
        io.to(roomCode).emit("startNewRound", {
          round: room.game.currentRound,
        });
        handleEndOfRound(roomCode);
      }, 3000);
    } else {
      const players = room.game.getPlayers();
      const maxScore = Math.max(...players.map((p) => p.score));
      const winner = players.find((p) => p.score === maxScore);

      io.to(roomCode).emit("gameOver", {
        message: "Game Over! Final scores:",
        players,
        winner,
      });

      room.game.reset();
    }
  };

  //
  socket.on("send_message", (data) => {
    const { roomCode, username, message } = data;

    if (!message?.trim()) return;

    const room = rooms[roomCode];
    if (!room) return;

    const player = room.game.getPlayers().find((p) => p.id === socket.id);
    if (!player) return;

    const correctAnswer = room.game.correctAnswer?.toLowerCase();
    const guess = message.trim().toLowerCase();

    if (guess === correctAnswer && !player.hasGuessed) {
      player.hasGuessed = true;
      player.addScore(1);

      io.to(roomCode).emit("scoreUpdate", {
        username: player.username,
        score: player.score,
      });

      io.to(roomCode).emit("receive_message", {
        username: "server",
        message: `${player.username} guessed the word correctly!`,
        color: "green",
      });

      io.to(roomCode).emit("updatePlayers", room.game.getPlayers());

      if (room.game.hasEveryoneGuessed()) {
        //everyone guessed clear time interval roundended
        clearInterval(room.timer);
        io.to(roomCode).emit("roundEnded", {
          message: "All players have guessed!",
        });

        //set correct answer
        io.to(roomCode).emit("correctAnswer", {
          answer: room.game.correctAnswer,
        });

        endGame(roomCode);
      }
    } else {
      io.to(roomCode).emit("receive_message", {
        username,
        message,
        color: "black",
      });
    }
  });

  //Create Room
  socket.on("createRoom", ({ roomCode, username }) => {
    if (rooms[roomCode]) {
      socket.emit("createRoooError", "Room code already exists.");
      return;
    }

    const newPlayer = new Player(socket.id, username);
    const newGame = new Game();
    newGame.addPlayer(newPlayer);

    rooms[roomCode] = {
      game: newGame,
      timer: null,
    };

    socket.join(roomCode);
    socket.emit("roomCreated", { roomCode });
    console.log(`Room '${roomCode}' created by ${username}`);
    io.to(roomCode).emit("receive_message", {
      username: "server",
      message: `${username} has joined the game.`,
      color: "blue",
    });
  });

  //Join Room
  socket.on("joinRoom", ({ roomCode, username }) => {
    const room = rooms[roomCode];

    if (!room) {
      socket.emit("joinRoooError", "Room not found.");
      return;
    }

    //avoid player joining room twice
    if (room.game.getPlayers().some((player) => player.id === socket.id)) {
      return;
    }

    const newPlayer = new Player(socket.id, username);
    room.game.addPlayer(newPlayer);

    socket.join(roomCode);

    console.log(`Player '${username}' joined room '${roomCode}'`);

    io.to(roomCode).emit("updatePlayers", room.game.getPlayers());

    io.to(roomCode).emit("receive_message", {
      username: "server",
      message: `${username} has joined the game.`,
      color: "blue",
    });

    //if new player join and game already started
    if (room.game.isStarted) {
      socket.emit("startGame", { message: "Game in progress..." });
      socket.emit("startNewRound", { round: room.game.currentRound });
      socket.emit("newFrame", room.game.frame);
      socket.emit("timerUpdate", room.game.getTime());
      socket.emit("updatePlayers", room.game.getPlayers());
    }

    // Start game if players >= 2 players and  not game started
    if (room.game.getPlayers().length >= 2 && !room.game.isStarted) {
      room.game.startGame();
      io.to(roomCode).emit("startGame", { message: "Game Starting..." });
      //handle frame selection and timer when game first starts
      handleEndOfRound(roomCode);
    }
  });

  //leaveroom
  socket.on("leaveRoom", ({ roomCode }) => {
    const room = rooms[roomCode];
    if (room) {
      delete rooms[roomCode];
      console.log(`Room '${roomCode}' deleted after game end`);
      io.to(roomCode).emit("gameStopped", {
        message: "Game stopped due to insufficient players",
      });
      io.in(roomCode).socketsLeave(roomCode);
    }
  });

  //disconnect
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);

    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      const player = room.game.getPlayers().find((p) => p.id === socket.id);

      if (!player) continue;

      const username = player.username;

      // Removing the player from the game
      room.game.removePlayer(socket.id);

      // Notifying other players
      io.to(roomCode).emit("receive_message", {
        username: "server",
        message: `${username} has left the game.`,
        color: "red",
      });

      io.to(roomCode).emit("updatePlayers", room.game.getPlayers());

      // Stop the game if less than 2 players remain
      if (room.game.getPlayers().length < 2 && room.game.isStarted) {
        console.log(
          `Stopping game in room ${roomCode} due to insufficient players`
        );
        room.game.reset();
        if (room.timer) clearInterval(room.timer);

        io.to(roomCode).emit("newFrame", null);
        io.to(roomCode).emit("timerUpdate", room.game.getTime());
        io.to(roomCode).emit("gameStopped", {
          message: "Game stopped due to insufficient players.",
        });
      }

      // Delete the room if empty
      if (room.game.getPlayers().length === 0) {
        delete rooms[roomCode];
        console.log(`Room '${roomCode}' deleted`);
      }

      break; // stop checking again coz Player can only be in one room
    }
  });

});
