
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center text-center px-6">
          {/*Logo */}
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-wide mb-4">
            Guess<span className="text-red-700">.IT</span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-400 mb-12">
            Guess the movie from a single frame
          </p>

          {/*Action Buttons */}
          <div className="flex flex-col md:flex-row gap-6">

            {/* Single-Player */}
            <Link to="/single">
              <button className="w-64 h-20 rounded-xl bg-green-600 hover:bg-green-500 transition-all duration-200 shadow-lg flex flex-col justify-center items-center">
                <span className="text-2xl font-semibold m-1">🎬 Single Player</span>
                <span className="text-sm text-green-100">
                  Play solo & test your skills
                </span>
              </button>
            </Link>
            
            {/*Multi-Player */}
            <Link to="/room">
              <button className="w-64 h-20 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all duration-200 shadow-lg flex flex-col justify-center items-center">
                <span className="text-2xl font-semibold m-1">👥 Multiplayer</span>
                <span className="text-sm text-blue-100">
                  Create or join a room
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
