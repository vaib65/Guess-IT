import Frame from "../../components/Single/Frame";
import { useEffect, useState } from "react";
import {
  startSinglePlayer,
  submitGuess,
  nextFrame,
} from "../../services/singlePlayer.api.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SinglePlayer = () => {
  const [frame, setFrame] = useState(null);
  const [guess, setGuess] = useState("");
  const [hasGuessed, setHasGuessed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const startGame = async () => {
      try {
        setLoading(true);

        const result = await startSinglePlayer();
        if (!result.success) {
          toast.error(result.message || "Unable to start game");
          return;
        }
        setFrame(result.frame);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to start game");
      } finally {
        setLoading(false);
      }
    };
    startGame();
  }, []);

  const handleSubmit = async () => {
    if (!guess.trim()) return;

    try {
      setLoading(true);
      const result = await submitGuess(guess.trim());

      setHasGuessed(true);
      setIsCorrect(result.correct);
      setResult(result.message);

      if (result.gameOver) {
        sessionStorage.setItem("finalScore", result.score);

        navigate("/final", {
          state: { score: result.score },
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit guess");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      const result = await nextFrame();
      if (result.completed) {
        sessionStorage.setItem("finalScore", result.score);

        navigate("/final", {
          state: { score: result.score },
        });
        return;
      }
      setFrame(result.frame);
      setGuess("");
      setHasGuessed(false);
      setIsCorrect(false);
      setResult("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load next frame");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center px-4">
      {/* GAME BOX */}
      <div className="w-[900px] max-w-xl p-4">
        {/* HEADER */}
        <div className="text-4xl text-center  border border-zinc-700 font-extrabold rounded-md px-2 py-2 mb-3 tracking-wide">
          Guess<span className="text-red-700">.IT</span>
        </div>

        {/* FRAME */}
        <Frame src={frame ? `/images/${frame}` : null} loading={loading} />

        {/* INPUT */}
        <input
          type="text"
          placeholder="Enter movie name..."
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          disabled={hasGuessed}
          className="w-full mt-3 px-3 py-2 bg-white text-black rounded-sm outline-none"
        />

        {/* SUBMIT */}
        {!hasGuessed && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-3 bg-emerald-600 hover:bg-emerald-800 transition text-white font-semibold py-2 rounded-sm"
          >
            Submit Guess
          </button>
        )}

        {/* NEXT */}
        {isCorrect && (
          <button
            onClick={handleNext}
            disabled={loading}
            className="w-full mt-3 bg-emerald-600 hover:bg-emerald-800 transition text-white font-semibold py-2 rounded-sm"
          >
            Next
          </button>
        )}

        {/* RESULT */}
        {hasGuessed && (
          <div
            className={`mt-3 text-center text-lg font-semibold ${
              isCorrect ? "text-green-400" : "text-red-400"
            }`}
          >
            {result}
          </div>
        )}

        {/* <footer className="text-center mt-2">
          <p>&copy; 2025 Guess.IT. All rights reserved.</p>
        </footer> */}
      </div>
    </div>
  );
};

export default SinglePlayer;
