import { useLocation, useNavigate } from "react-router-dom";
import { resetSinglePlayer } from "../../services/singlePlayer.api.js";
import toast from "react-hot-toast";
const FinalScore = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const score =
    location.state?.score ?? Number(sessionStorage.getItem("finalScore"));
  
  const handlePlayAgain = async () => {
    try {
      await resetSinglePlayer()
    } catch (err) {
     toast.error("Failed to reset game"); 
    } finally {
      sessionStorage.removeItem("finalScore");
      navigate("/single");
    }
  }

  const handleHome = () => {
    sessionStorage.removeItem("finalScore");
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-black border border-zinc-700 rounded-md p-6 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-6"> Game Over</h1>

        <p className="text-2xl mb-8">
          Final Score:{" "}
          <span className="text-green-400 font-bold">
            {Number.isFinite(score) ? score : 0}
          </span>
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={handlePlayAgain}
            className="bg-emerald-600 hover:bg-emerald-800 transition text-white font-semibold py-2 rounded-sm"
          >
            Play Again
          </button>
          <button
            onClick={handleHome}
            className="bg-zinc-700 hover:bg-zinc-600 transition text-white font-semibold py-2 rounded-sm"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalScore;
