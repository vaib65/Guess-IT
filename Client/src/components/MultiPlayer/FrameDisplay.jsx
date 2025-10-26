import React, { useContext } from "react";
import { GameContext } from "../../context/GameContext";

export default function FrameDisplay() {
  const { frame } = useContext(GameContext);

  return (
    <div className="flex justify-center items-center h-full w-full">
      {frame ? (
        <div className="w-full max-w-[800px] aspect-video">
          <img
            src={`/images/${frame}`}
            alt="Guess this frame"
            className="w-full h-full object-cover rounded-md shadow"
          />
        </div>
      ) : (
        <p className="text-gray-800 text-xl text-center">
          Waiting for frame...
        </p>
      )}
    </div>
  );
}
