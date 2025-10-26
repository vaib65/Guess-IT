import { useContext } from "react";
import clock from "../../assets/clock.png";
import { GameContext } from "../../context/GameContext";

export default function Clock() {
  const { time, round } = useContext(GameContext);

  return (
    <>
      <div className="flex flex-col">
        <div className="relative flex justify-center items-center w-24 h-24 mx-auto">
          <img
            className="w-full h-full object-contain"
            src={clock}
            alt="clock"
          />
          <span className="absolute text-3xl font-bold text-green-700 select-none">
            {time}
          </span>
        </div>
        Round {round} of 3
      </div>
    </>
  );
}
