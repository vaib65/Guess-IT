import clock from "../../assets/clock.png";

const Clock = ({ time, round, totalRounds }) => {
    const isLow = time <= 10;
    return (
    <div className="flex flex-col items-center text-black select-none mt-2">
        <div className="relative w-20 h-20 flex items-center justify-center">
            <img src={clock} alt="clock" className="w-full h-full object-contain" />

            <span
                className={`absolute text-2xl font-extrabold ${
                isLow ? "text-red-600 animate-pulse" : "text-green-700"
                }`}
            >
                {time}
            </span>
        </div>

        <div className="mt-1 text-sm font-semibold text-white">
            Round {round} / {totalRounds}
        </div>
    </div>
    );
};

export default Clock;
