import React, { useEffect, useState } from "react";
import { fetchLibrary } from "../services/api";
import GameCard from "../components/GameCard";
import GameLoader from "../components/GameLoader";

function Library() {
  const [games, setGames] = useState([]);
  const [library, setLibrary] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLibrary = async () => {
      try {
        const libraryGames = await fetchLibrary();

        // Convert IDs to string to ensure type consistency
        const librarySet = new Set(libraryGames.map((g) => String(g._id)));

        setLibrary(librarySet);
        setGames(libraryGames);
      } catch (error) {
        console.error("Error fetching library games:", error);
      } finally {
        setLoading(false);
      }
    };
    loadLibrary();
  }, []);

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

    // Remove the game from the games state immediately
    setGames((prevGames) => prevGames.filter((game) => game._id !== gameId));
  };

  if (loading) {
    return <GameLoader />;
  }

  return (
    <div className="library-page container mx-auto p-4">
      <h1 className="text-3xl font-bold text-cyan-400 text-center mb-6">
        Your Library
      </h1>
      <div className="grid grid-cols-1 w-max sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
        {games.map((game) => (
          <GameCard
            key={game._id}
            game={game}
            isInLibrary={library.has(String(game._id))}
            updateLibrary={updateLibrary}
          />
        ))}
      </div>
    </div>
  );
}

export default Library;
