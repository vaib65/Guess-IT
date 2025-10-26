import React from "react";
import { useContext } from "react";
import { GameContext } from "../../context/GameContext";
import Player from "./Player";

export default function PlayerList() {
  const { playersList } = useContext(GameContext);
  return (
    <div className="player-list text-black bg-white rounded-b-[15px] h-[60vh] overflow-hidden">
      {playersList.map((player, i) => (
        <Player key={player.id} order={i} player={player} />
      ))}
    </div>
  );
}
