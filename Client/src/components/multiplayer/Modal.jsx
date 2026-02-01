const Modal = ({ isOpen, isHost, showCountdown, countdown, onStart }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-10 py-8 text-center min-w-[300px]">
        {/* HOST START VIEW */}
        {!showCountdown && isHost && (
          <>
            <div className="text-xl text-zinc-300 mb-6">
              Ready to start the game?
            </div>

            <button
              onClick={onStart}
              className="px-6 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              Start Game
            </button>
          </>
        )}

        {/* COUNTDOWN VIEW (ALL PLAYERS) */}
        {showCountdown && (
          <>
            <div className="text-xl text-zinc-300 mb-2">Game starting in</div>
            <div className="text-6xl font-extrabold text-green-500">
              {countdown}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
