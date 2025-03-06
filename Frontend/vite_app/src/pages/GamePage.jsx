import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchGameDetails, fetchGames } from "../services/api";
import Reviews from "../components/rewiews"; // Note: Typo "rewiews" should be "reviews"
import GameCard from "../components/GameCard";
import GameLoader from "../components/GameLoader";
import Buttons from "../components/Buttons";
import { toast } from "react-toastify";
import { AuthContext } from '../AuthContext';

function GamePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { library } = useContext(AuthContext);
  const [gameDetails, setGameDetails] = useState(null);
  const [moreGames, setMoreGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const loadData = async () => {
      try {
        const [gameData, allGames] = await Promise.all([
          fetchGameDetails(id),
          fetchGames(),
        ]);
        setGameDetails(gameData);
        const shuffledGames = allGames
          .filter((game) => game._id !== Number(id))
          .sort(() => Math.random() - 0.5)
          .slice(0, 6);
        setMoreGames(shuffledGames);
      } catch (error) {
        toast.error(error.message || "Failed to load game data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <GameLoader />;

  if (!gameDetails) return <div className="text-white text-center p-6 sm:p-10">Game not found</div>;

  return (
    <div className="relative min-h-screen flex flex-col items-center px-2 sm:px-4 lg:px-8 bg-gray-900">
      <div
        className="absolute inset-0 bg-cover bg-center bg-opacity-50"
        style={{ backgroundImage: `url(${gameDetails.bgPic})` }}
      ></div>

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between rounded-lg mt-6 sm:mt-10 w-full max-w-5xl gap-4 sm:gap-6">
        <img
          src={gameDetails.profilePic}
          alt={gameDetails.name}
          className="w-32 sm:w-40 md:w-60 lg:w-72 rounded"
        />
        <div className="text-white text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">{gameDetails.name}</h1>
          <p className="mt-2 text-xs sm:text-sm md:text-lg max-w-xl">{gameDetails.description}</p>
          <div className="mt-4 flex gap-2 sm:gap-4 justify-center sm:justify-start items-center">
            <Buttons type="play" gameId={gameDetails._id} />
            <Buttons type="library" gameId={gameDetails._id} />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-4 sm:mt-6 w-full max-w-5xl">
        <h2 className="text-white text-lg sm:text-2xl font-semibold">Popular Titles</h2>
        <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
          {gameDetails.titles?.map((title, index) => (
            <span key={index} className="bg-gray-800 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm text-white">
              {title}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-4 sm:mt-6 w-full max-w-5xl">
        <h2 className="text-white text-lg sm:text-2xl font-bold">About the Game</h2>
        <p className="text-white text-xs sm:text-sm mt-1">{gameDetails.about}</p>
      </div>

      <div className="relative z-10 mt-4 sm:mt-6 w-full max-w-5xl">
        <h2 className="text-white text-lg sm:text-2xl font-bold">Game Reviews</h2>
        <Reviews reviews={gameDetails.reviews} />
      </div>

      <div className="relative z-10 mt-6 sm:mt-8 w-full max-w-6xl">
        <h2 className="text-white text-lg sm:text-2xl font-bold mb-4">More Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
          {moreGames.map((game) => (
            <GameCard
              key={game._id}
              game={game}
              isInLibrary={library.has(game._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default GamePage;