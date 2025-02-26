import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa";
import { fetchGameDetails, fetchGames, addToLibrary, removeFromLibrary, fetchLibrary } from "../services/api";
import Reviews from "../components/Rewiews";
import GameCard from "../components/GameCard";
import GameLoader from "../components/GameLoader";
import Buttons from "../components/Buttons";

function GamePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gameDetails, setGameDetails] = useState(null);
  const [moreGames, setMoreGames] = useState([]);
  const [library, setLibrary] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const loadGameDetails = async () => {
      setLoading(true);
      try {
        const data = await fetchGameDetails(id);
        setGameDetails(data);
      } finally {
        setLoading(false);
      }
    };

    const loadMoreGames = async () => {
      try {
        const allGames = await fetchGames();
        const shuffledGames = allGames
          .filter((game) => game._id && game._id !== id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);
        setMoreGames(shuffledGames);
      } catch (error) {
        console.error("Error fetching more games:", error);
      }
    };

    const loadLibrary = async () => {
      try {
        const libraryGames = await fetchLibrary();
        setLibrary(new Set(libraryGames.map((game) => game._id)));
      } catch (error) {
        console.error("Error fetching library:", error);
      }
    };

    loadGameDetails();
    loadMoreGames();
    loadLibrary();
  }, [id]);

  const updateLibrary = (gameId) => {
    setLibrary((prev) => {
      const newLibrary = new Set(prev);
      if (newLibrary.has(gameId)) {
        newLibrary.delete(gameId);
      } else {
        newLibrary.add(gameId);
      }
      return newLibrary;
    });
  };

  const handleLibraryToggle = async (gameId) => {
    try {
      if (library.has(gameId)) {
        await removeFromLibrary(gameId);
      } else {
        await addToLibrary(gameId);
      }
      updateLibrary(gameId);
    } catch (error) {
      console.error("Error updating library:", error);
    }
  };

  const handlePlay = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(0);
  };

  if (loading) return <GameLoader />;
  if (!gameDetails) return <div className="text-white text-center p-10">Game not found</div>;

  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${gameDetails.bgPic})` }}
      ></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between rounded-lg mt-10 w-full max-w-5xl">
        <img src={gameDetails.profilePic} alt={gameDetails.name} className="mr-6 w-40 sm:w-60 md:w-72" />
        <div className="text-white text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{gameDetails.name}</h1>
          <p className="mt-2 text-sm sm:text-lg max-w-2xl">{gameDetails.description}</p>
          <div className="mt-4 flex gap-4 justify-center items-center md:justify-start">
            <Buttons type="play" gameId={gameDetails._id} />
            <Buttons type="library" gameId={gameDetails._id} />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-6 w-full max-w-5xl">
        <h2 className="text-white text-2xl font-semibold">Popular Titles</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {gameDetails.titles?.map((title, index) => (
            <span key={index} className="bg-gray-800 px-3 py-1 rounded-lg text-sm text-white">
              {title}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-6 w-full max-w-5xl">
        <h2 className="text-white text-2xl font-bold">About the Game</h2>
        <p className="text-white text-sm mt-1">{gameDetails.about}</p>
      </div>

      <div className="relative z-10 mt-6 w-full max-w-5xl">
        <h2 className="text-white text-2xl font-bold">Game Reviews</h2>
        <Reviews reviews={gameDetails.reviews} />
      </div>

      <div className="relative z-10 mt-8 w-full max-w-5xl">
        <h2 className="text-white text-2xl font-bold mb-4">More Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {moreGames.map((game) => (
            <GameCard
              key={game._id}
              game={game}
              isInLibrary={library.has(game._id)}
              updateLibrary={updateLibrary}
              onPlay={() => {
                navigate(`/game/${game._id}`);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default GamePage;
