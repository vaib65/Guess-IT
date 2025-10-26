import React, { useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { GameContext } from '../../context/GameContext'


const InputField = ({ value, onChange, placeholder }) => (
  <input
    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
  />
);

const Button = ({ onClick, disabled, children }) => (
  <button
    className="w-full h-10 rounded-[19px] text-white bg-[#2bab2b] hover:bg-[#1d851d] mt-3 cursor-pointer outline-none"
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default function CreateRoomPage() {
  const { username, setUsername,roomCode,setRoomCode, createRoom, joinRoom } = useContext(GameContext);
  
  const navigate = useNavigate();
  
  //create room buttom
  const handleCreate = () => {
    createRoom(roomCode);
    navigate(`/room/${roomCode}`);
    
  };

  //join room button
  const handleJoin = () => {
    joinRoom(roomCode);
    navigate(`/room/${roomCode}`);
    
  }

  return (
    <div className=" w-full h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-semibold text-gray-600 mb-6">Create Room</h1>
      <div className="w-[350px] p-6 border border-gray-300 rounded-md shadow-md  flex flex-col items-center">
        <InputField
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your Name"
        />
        <InputField
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          placeholder="Enter Room Code"
        />
        <Button onClick={handleCreate} disabled={!username || !roomCode}>
          Create Room
        </Button>
        <Button onClick={handleJoin} disabled={!username || !roomCode}>
          Join Room
        </Button>
      </div>
    </div>
  );
}
