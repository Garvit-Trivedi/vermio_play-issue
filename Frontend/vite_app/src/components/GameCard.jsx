import React, { useState } from "react";
import Buttons from "./Buttons";

function GameCard({ game }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="game-card w-100 bg-gray-900 rounded-lg overflow-hidden transition-transform transform hover:scale-110 hover:z-20 border-2 border-cyan-300 hover:border-blue-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Game Title & Play Button (Visible on Hover) */}
      {isHovered && (
        <div className="text-cyan-300 p-4 absolute bg-slate-800 font-extrabold rounded-2xl bottom-4 left-10 z-10 w-80">
          {game.name}
          <Buttons type="play" gameId={game._id} className="absolute top-1.5 right-2" />
        </div>
      )}

      {/* Static Image or Hover Video */}
      {isHovered ? (
        <video
          src={game.firstVideo}
          className="w-full h-[200px] object-cover"
          autoPlay
          loop
          muted
        />
      ) : (
        <img
          src={game.profilePic}
          alt={game.name}
          className="w-full h-[200px] object-cover"
        />
      )}

      {/* Library Button (Visible on Hover) */}
      {isHovered && (
        <Buttons type="library" gameId={game._id} className="absolute top-4 right-4 z-10" />
      )}

      {/* Inner Shadow Effect */}
      <div
        className={`absolute inset-0 rounded-lg transition-all duration-300 ${isHovered ? "shadow-[inset_0_50px_10px_100px_rgba(0,0,0,0.3)]" : ""}`}
      ></div>
    </div>
  );
}

export default GameCard;
