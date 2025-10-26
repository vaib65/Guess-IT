import React from 'react'
import { useContext ,useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { FrameContext } from '../../context/FrameContext';

export default function Frame2() {
  const {
    frame,
    guess,
    isCorrect,
    result,
    showNext,
    gameOver,
    setGuess,
    handleNext,
    handleSubmitClick,
  } = useContext(FrameContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (gameOver !== null) {
      navigate("/final", { state: { score: gameOver } });
    }
  }, [gameOver, navigate]);

  return (
    <main className="flex flex-col items-center justify-center">
      {/*frame section */}
      <section>
        <div className="  bg-gray-400 border-6 border-solid border-white mb-2 gap-10 w-[800px] h-[500px]  overflow-hidden">
          {/*images will appear dynamically */}
          {frame ? (
            <img
              src={`/images/${frame}`}
              alt="Guess this frame"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl text-gray-700">
              Loading...
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Enter movie title..."
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          className="text-xl bg-white text-black p-2 mb-2 w-full  rounded cursor-pointer outline-none"
        />
        <button
          onClick={handleSubmitClick}
          disabled={isCorrect}
          className="bg-emerald-600 text-2xl px-3 py-2 mb-2 rounded hover:bg-emerald-800 cursor-pointer w-full "
        >
          Submit Guess
        </button>
        {showNext && (
          <button
            onClick={handleNext}
            className="bg-emerald-600 text-2xl px-3 py-2  rounded hover:bg-emerald-800 cursor-pointer w-full "
          >
            Next
          </button>
        )}
      </section>

      {/*result section */}
      <section className="mt-3 text-4xl ">{result && <p>{result}</p>}</section>
    </main>
  );
}
