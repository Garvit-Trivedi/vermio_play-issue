import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchGamesByCategory, fetchLibrary } from "../services/api";
import GameCard from "../components/GameCard";
import GameLoader from "../components/GameLoader"; // Import GameLoader

const Categories = () => {
  const { catname } = useParams();
  const [games, setGames] = useState([]);
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch games in category and user library
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const categoryGames = await fetchGamesByCategory(catname);
      const libraryGames = await fetchLibrary();
      setGames(categoryGames);
      setLibrary(libraryGames);
      setLoading(false);
    };

    fetchData();
  }, [catname]);

  // Check if a game is in the library
  const isGameInLibrary = (gameId) => library.some((g) => g._id === gameId);

  // Update the library state when adding/removing games
  const updateLibrary = (gameId) => {
    setLibrary((prevLibrary) =>
      isGameInLibrary(gameId)
        ? prevLibrary.filter((game) => game._id !== gameId) // Remove from state
        : [...prevLibrary, { _id: gameId }] // Add to state
    );
  };

  return (
    <div className="min-h-screen text-white p-4 sm:p-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">
        {catname.toUpperCase()} Games
      </h1>

      {loading ? (
        <GameLoader /> // Show GameLoader while loading
      ) : games.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard
              key={game._id}
              game={game}
              isInLibrary={isGameInLibrary(game._id)}
              updateLibrary={updateLibrary} // Pass update function to GameCard
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-lg">No games found in this category.</p>
      )}
    </div>
  );
};

export default Categories;
