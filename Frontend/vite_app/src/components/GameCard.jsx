import React, { useState } from "react";
import Buttons from "./Buttons";

function GameCard({ game, isInLibrary }) {
  const [isHovered, setIsHovered] = useState(false);
  const firstVideo = game?.reviews?.find((r) => r.type === "video")?.url || null;

  if (!game) return null;

  return (
    <div
      className="game-card w-full sm:w-94 bg-gray-900 rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:z-20 border-2 border-cyan-300 hover:border-blue-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className="text-cyan-300 p-2 sm:p-4 absolute bg-slate-800 font-extrabold rounded-2xl bottom-2 sm:bottom-4 left-4 sm:left-10 z-10 w-3/4 sm:w-80">
          {game.name}
          <Buttons type="play" gameId={game._id} className="absolute top-1 sm:top-1.5 right-1 sm:right-2" />
        </div>
      )}

      {isHovered && firstVideo ? (
        <video
          src={firstVideo}
          className="w-full h-40 sm:h-48 object-cover"
          autoPlay
          loop
          muted
        />
      ) : (
        <img
          src={game.profilePic}
          alt={game.name}
          className="w-full h-40 sm:h-48 object-cover"
        />
      )}

      {isHovered && (
        <Buttons
          type="library"
          gameId={game._id}
          className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10"
        />
      )}

      <div
        className={`absolute inset-0 rounded-lg transition-all duration-300 ${isHovered ? "shadow-[inset_0_50px_10px_100px_rgba(0,0,0,0.3)]" : ""}`}
      ></div>
    </div>
  );
}

export default GameCard;