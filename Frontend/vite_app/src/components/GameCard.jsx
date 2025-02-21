import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { addToLibrary, removeFromLibrary } from "../services/api"; // Import API functions
import "./tailwind.css";

function GameCard({ game, isInLibrary, updateLibrary }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleLibraryClick = async () => {
    try {
      if (isInLibrary) {
        await removeFromLibrary(game._id);
      } else {
        await addToLibrary(game._id);
      }
      updateLibrary(game._id);
    } catch (error) {
    }
  };


  return (
    <div
      className="game-card w-100 relative bg-gray-900 rounded-lg overflow-hidden transition-transform transform hover:scale-110 hover:z-20 border-2 border-cyan-300 hover:border-blue-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Game Title - Hover (bottom left) */}
      {isHovered && (
        <div className="text-cyan-300 p-4 absolute bg-slate-800 font-extrabold rounded-2xl bottom-4 left-10 z-10 w-80">
          {game.name}
          <Link
            to={`/game/${game._id}`}
            className="absolute bottom-1.5 right-2 border-cyan-300 bg-slate-900 border-2 text-cyan-300 p-2 rounded-2xl hover:border-blue-700 hover:text-blue-700 transition"
          >
            Play
          </Link>
        </div>
      )}

      {/* Image for static state */}
      {!isHovered ? (
        <div className="w-full h-[200px] relative">
          <img
            src={game.profilePic}
            alt={game.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        // Video for hover state
        <video
          src={game.firstVideo}
          className="w-full h-[200px]  object-cover"
          autoPlay
          loop
          muted
        />
      )}

      {/* Library Button */}
      {isHovered && (
        <button
          onClick={handleLibraryClick}
          className={`absolute top-4 right-4 z-10 bg-slate-800 border-2 text-white p-2 rounded-lg transition-transform transform ${isInLibrary ? "border-pink-400" : "border-cyan-300"
            } hover:border-purple-400`}
        >
          {isInLibrary ? <FaMinus /> : <FaPlus />}
        </button>
      )}

      {/* Inner Shadow Effect */}
      <div
        className={`absolute inset-0 rounded-lg transition-all duration-300 ${isHovered ? "z-0 shadow-[inset_0_50px_10px_100px_rgba(0,0,0,0.3)]" : ""
          }`}
      ></div>
    </div>
  );
}

export default GameCard;
