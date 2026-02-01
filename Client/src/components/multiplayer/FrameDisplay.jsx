

const FrameDisplay = ({ frame, loading }) => {
  return (
    <div className="w-full h-full bg-zinc-900 border border-zinc-700 rounded-md flex items-center justify-center overflow-hidden">
      {loading ? (
        <span className="text-gray-400">Loading frame...</span>
      ) : frame ? (
        <img
          src={`/images/${frame}`}
          alt="Game frame"
          className="w-full h-full object-contain"
        />
      ) : (
        <span className="text-gray-500">Waiting for game to start…</span>
      )}
    </div>
  );
};

export default FrameDisplay;
