import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import {useNavigate} from "react-router-dom"
import { getUserId } from "../../utils/userId";
import toast from "react-hot-toast";
import { socket } from "../../config/socket";
const CreateRoomPage = () => {
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();
  const userId = getUserId()
  
  useEffect(() => {
    socket.on("roomCreated", ({ roomCode }) => {
      navigate(`/room/${roomCode}`)
    })

    socket.on("createRoomError", (msg) => {
      toast.error(msg)
    });

    socket.on("joinRoomError", (msg) => {
      toast.error(msg)
    })

    socket.on("roomJoined", ({ roomCode }) => {
      navigate(`/room/${roomCode}`);
    });

    return ()=> {
      socket.off("roomCreated");
      socket.off("createRoomError");
      socket.off("joinRoomError");
      socket.off("roomJoined")
    }
  }, [navigate])
  
  const handleCreateRoom = () => {
    if (!username || !roomCode) {
      toast.error("Username and Room Code required");
      return;
    }

    socket.emit("createRoom", {
      roomCode,
      username,
      userId
    })
  }
  const handleJoinRoom = () => {
    if (!username || !roomCode) {
      toast.error("Username and Room Code required");
      return;
    }

    socket.emit("joinRoom", {
      roomCode,
      username,
      userId,
    });
    
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-black border border-zinc-700 rounded-md p-6 text-white">
        <h1 className="text-3xl font-extrabold text-center mb-6">
          Create Room
        </h1>

        <InputField
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <InputField
          placeholder="Enter room code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
        />

        <Button onClick={handleCreateRoom}>Create Room</Button>

        <Button onClick={handleJoinRoom}>Join Room</Button>
      </div>
    </div>
  );
};

export default CreateRoomPage;
