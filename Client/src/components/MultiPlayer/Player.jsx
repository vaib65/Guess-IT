import React, { useContext } from "react";
import { GameContext } from "../../context/GameContext";

export default function Player({ player, order }) {
  const { username } = useContext(GameContext);
  const { hasGuessed, score } = player;

  return (
    <div
      className={`h-[calc(100%/7)] flex items-center px-4 ${
        hasGuessed ? "bg-[greenyellow]" : ""
      }`}
    >
      <div className="flex flex-row items-center gap-4 text-black w-full">
        {/* Rank */}
        <div className="font-semibold w-6 text-center">{order + 1}.</div>

        {/* Username + Score */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <span>
            {player.username} {username === player.username && "(you)"}
          </span>
          <span className="text-sm text-gray-600">{score} pts</span>
        </div>
      </div>
    </div>
  );
}
