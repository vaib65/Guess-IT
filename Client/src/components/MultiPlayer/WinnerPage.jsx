import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function WinnerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { winner, players } = location.state || {};

  if (!winner || !players) {
    return (
      <div className="text-center mt-20 text-red-500">
        Invalid game result. Please return to Home.
        <button
          onClick={() => navigate("/")}
          className="block mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Home
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-green-600 mb-6">
        🎉 {winner.username} Wins!
      </h1>
      <p className="text-lg mb-6 text-gray-700">
        Final Score: <strong>{winner.score}</strong> pts
      </p>

      <div className="w-full max-w-md bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
          Leaderboard
        </h2>
        <ul className="divide-y divide-gray-200">
          {players
            .sort((a, b) => b.score - a.score)
            .map((player, i) => (
              <li
                key={player.id}
                className="py-2 flex justify-between text-black"
              >
                <span>
                  {i + 1}. {player.username}
                </span>
                <span>{player.score} pts</span>
              </li>
            ))}
        </ul>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Home
        </button>
        
      </div>
    </div>
  );
}
