import Player from "./Player";

const PlayerList = ({ players = [], currentUserId }) => {
  return (
    <div className="h-full flex flex-col">
      {/*header */}
      <div className="text-sm font-semibold text-zinc-300 mb-2 px-2">
        Players
      </div>

      {/*player list */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {players.map((player, index) => (
          <Player
            key={player.id}
            index={index}
            player={player}
            isYou={player.userId === currentUserId}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerList;
