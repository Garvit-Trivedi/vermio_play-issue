import React, { useEffect, useState } from "react";
import { fetchGames, fetchLibrary } from "../services/api"; // Assuming you have these functions in the 'services/api.js'
import GameCard from "../components/GameCard";

function Home() {
  const [games, setGames] = useState([]);
  const [library, setLibrary] = useState(new Set());

  // Fetch games and library when the component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch both games and library data
        const [gameData, libraryData] = await Promise.all([
          fetchGames(), // Fetching all games
          fetchLibrary(), // Fetching the current user's library
        ]);
        setGames(gameData);
        setLibrary(new Set(libraryData.map((g) => g._id))); // Store game IDs in the library set
      } catch (error) {
        console.error("Error fetching games or library:", error);
      }
    };

    loadData();
  }, []); // Only run this effect once when the component mounts

  // Update the library by adding/removing games
  const updateLibrary = (gameId) => {
    setLibrary((prev) => {
      const newLibrary = new Set(prev);
      if (newLibrary.has(gameId)) {
        newLibrary.delete(gameId); // Remove from library
        console.log("Game removed from library:", gameId);
      } else {
        newLibrary.add(gameId); // Add to library
      }
      return newLibrary;
    });
  };

  return (
    <div className="home-page container m- p-4">
      <h1 className="text-3xl font-bold text-center text-cyan-400 mb-6">Featured Games</h1>
      <div className="grid grid-cols-1 w-max sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
        {games.map((game) => (
          <GameCard
            key={game._id}
            game={game}
            isInLibrary={library.has(game._id)}
            updateLibrary={updateLibrary}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
