import { useContext ,useEffect} from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FrameContext } from "../../context/FrameContext";

const FinalScore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score } = location.state || { score: 0 };
  const { startSinglePlayer} = useContext(FrameContext);

  const handlePlayAgain = () => {
    startSinglePlayer();
    navigate("/single");
  };
 
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <div>
          <h1 className="text-5xl mb-10">❌ Wrong Answer ! </h1>
          <h1 className="text-4xl mb-10">Final Score = {score}</h1>
        </div>
        <div>
          <Link to="/">
            <button className="text-4xl font-semibold border-3 border-solid border-white rounded-2xl bg-blue-600 hover:bg-blue-700 w-[200px] h-[80px] mr-10 cursor-pointer">
              Home
            </button>
          </Link>

          <button
            onClick={handlePlayAgain}
            className="text-4xl font-semibold border-3 border-solid border-white rounded-2xl bg-orange-500 hover:bg-orange-600 w-[200px] h-[80px] cursor-pointer"
          >
            Play Again
          </button>
        </div>
      </div>
    </>
  );
};

export default FinalScore;
