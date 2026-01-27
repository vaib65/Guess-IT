import Player from "../models/players.models.js";
import MultiplayerGame from "../models/multiplayerGame.models.js";
import {
  createRoom,
  getRoom,
  deleteRoom,
  roomExists,
  getAllRooms,
} from "../store/multiplayerGame-rooms.js";
import { setUserRoom,clearUserRoom,getUserRoom } from "../store/user-room-map.js";

import { frames, titleMap } from "../data/frames.js";

const startGame =async (io, roomCode) => {
  const room = await getRoom(roomCode);

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
    const remaining=game.getRemainingTime()

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

const endGame = async(io, roomCode) => {
  const room = await getRoom(roomCode);
  if (!room) return;

  const { game } = room;

  if (!game.isLastRound()) {
    game.startNewRound();

    setTimeout(() => {
      io.to(roomCode).emit("updatePlayers", game.getPlayers());
      io.to(roomCode).emit("startNewRound", {
        round: game.currentRound,
      });
      startGame(io, roomCode);
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

  {/* reconnect room handler */ }
  socket.on("reconnectPlayer", async ({ userId }) => {
    if (!userId) return;

    const roomCode = await getUserRoom(userId);
    if (!roomCode) return;

    const room = await getRoom(roomCode);
    if (!room) return;

    const game = room.game;

    const player = game.getPlayers().find((p) => p.userId === userId);
    if (!player) return;

    //attach socket id to player
    player.socketId = socket.id;

    socket.join(roomCode);
    await setUserRoom(userId,roomCode)
    
    socket.emit("reconnected", {
      roomCode,
      frame: game.currentFrame,
      time: game.getRemainingTime(),
      players: game.getPlayers(),
      round: game.currentRound,
    });
  })

  {/*create Room handler */}
  socket.on("createRoom",async ({ roomCode, username,userId}) => {
    if (!roomCode || !username || !userId) {
      socket.emit("Error", "Room code and username required");
      return;
    }

    if (await roomExists(roomCode)) {
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
    await createRoom(roomCode, game);
    await setUserRoom(userId, roomCode);

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
  socket.on("joinRoom",async ({ roomCode, username,userId }) => {
    if (!roomCode || !username || !userId) {
      socket.emit("Error", "Room code and username required");
      return;
    }

   if (!(await roomExists(roomCode)))  {
      socket.emit("joinRoomError", "Room not found");
      return;
    }

    const room = await getRoom(roomCode);
    const game = room.game;

    const alreadyJoined = game
      .getPlayers()
      .some((player) => player.userId === userId);

    if (alreadyJoined) {
      return;
    }

    const player = new Player({
      userId,
      socketId: socket.id,
      username,
    });
    game.addPlayer(player);
    await setUserRoom(userId, roomCode);

    socket.join(roomCode);

    io.to(roomCode).emit("receive_message", {
      username: "server",
      message: `${username} joined the room.`,
      color: "blue",
    });

    io.to(roomCode).emit("updatePlayers", game.getPlayers());

    console.log(`Player ${username} joined room ${roomCode}`);

    if (game.isStarted) {
      socket.emit("startGame", { message: "Game already in progress" });
      socket.emit("startNewRound", { round: game.currentRound });
      socket.emit("newFrame", game.currentFrame);
      socket.emit("timerUpdate", game.time);
    }

   if (!game.isStarted && game.getPlayers().length === 2) {
     game.startGame();

     io.to(roomCode).emit("startGame", {
       message: "Game starting...",
     });

     startGame(io, roomCode);
   }

  });

    {
      /*users guess handler */
    }
  socket.on("sendGuess",async ({ roomCode, username, message }) => {
    if (!message.trim()) {
      return
    }

    const room = await getRoom(roomCode);
    if (!room) {
      return
    }

    const game = room.game
    const player = game.getPlayers().find((p) => p.socketId === socket.id);;

   const guess = message.trim().toLowerCase();
   const correctAnswer = game.correctAnswer?.toLowerCase();

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
  socket.on("disconnect", async() => {
    console.log("client disconnect", socket.id);

    const rooms = await getAllRooms();
    for (const roomKey of rooms) {
      const roomCode = roomKey.replace("room:", "");
      const room = await getRoom(roomCode);
      const game = room.game;
      const players = game.getPlayers();

      const player = players.find((p) => p.socketId === socket.id);
      if (!player) continue;

      game.removePlayer(socket.id);
      await clearUserRoom(player.userId);


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
        await deleteRoom(roomCode);
        console.log(`Room ${roomCode} deleted`);
      }
      break;
    }
  })
};
