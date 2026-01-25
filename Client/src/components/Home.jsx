import React from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FrameContext } from "../context/FrameContext";

const Home = () => {
  const { startSinglePlayer } = useContext(FrameContext);
  const navigate = useNavigate();
  
  const handleSingleClick = () => {
    startSinglePlayer();
    navigate("/single");
  };
  return (
    <>
      <div className=" flex flex-col justify-center items-center h-screen">
        <div>
          <h1 className="text-8xl  font-bold border-6 border-solid border-white bg-red-800 w-[500px] mb-15 ">
            Guess.IT
          </h1>
        </div>
        <div className=" flex">
          <button
            onClick={handleSingleClick}
            className="text-4xl lg:text-4xl font-semibold border-3 border-solid border-white bg-green-500 hover:bg-green-400  w-[200px] mr-10 cursor-pointer"
          >
            Single Player
          </button>

          <Link to="/room">
            <button className="text-4xl lg:text-4xl font-semibold border-3 border-solid border-white bg-green-500 hover:bg-green-400 w-[200px] cursor-pointer">
              Multi Player
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
