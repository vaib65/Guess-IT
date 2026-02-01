import { useLocation, useNavigate } from "react-router-dom";

const WinnerPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const players = state?.players || [];
  const winner = state?.winner;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white">
      <h1 className="text-4xl font-extrabold mb-6">🏆 Game Over</h1>

      {winner && (
        <div className="mb-6 text-xl">
          Winner:{" "}
          <span className="text-green-400 font-bold">
            {winner.username} ({winner.score})
          </span>
        </div>
      )}

      <div className="w-full max-w-md bg-black border border-zinc-700 rounded p-4">
        {players.map((p, i) => (
          <div
            key={p.userId}
            className="flex justify-between py-2 border-b border-zinc-700 last:border-none"
          >
            <span>
              {i + 1}. {p.username}
            </span>
            <span className="font-semibold">{p.score}</span>
          </div>
        ))}
      </div>

      <button
        className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 rounded"
        onClick={() => navigate("/")}
      >
        Home
      </button>
    </div>
  );
};

export default WinnerPage;
