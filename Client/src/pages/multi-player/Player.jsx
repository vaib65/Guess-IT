const Player = ({ player, index, isYou }) => {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 rounded-md text-sm
        ${player.hasGuessed ? "bg-green-700/30" : "bg-zinc-800"}
      `}
    >
      {/* Left: Rank + Name */}
      <div className="flex items-center gap-2">
        <span className="text-zinc-400 w-5 text-right">{index + 1}</span>

        <span className="font-medium text-white">
          {player.username}
          {isYou && <span className="ml-1 text-xs text-zinc-400">(you)</span>}
        </span>
      </div>

      {/* Right: Score */}
      <span className="text-zinc-300 font-semibold">{player.score}</span>
    </div>
  );
};

export default Player;
