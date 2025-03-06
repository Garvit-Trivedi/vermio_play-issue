import React, { useEffect, useState, useContext } from "react";
import { fetchLibrary } from "../services/api";
import GameCard from "../components/GameCard";
import GameLoader from "../components/GameLoader";
import { toast } from "react-toastify";
import { AuthContext } from '../AuthContext';

function Library() {
  const { library } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLibrary = async () => {
      try {
        const libraryGames = await fetchLibrary();
        setGames(libraryGames);
      } catch (error) {
        toast.error(error.message || "Failed to load library");
      } finally {
        setLoading(false);
      }
    };
    loadLibrary();
  }, [library]);

  if (loading) return <GameLoader />;

  return (
    <div className="library-page container mx-auto p-4">
      <h1 className="text-3xl font-bold text-cyan-400 text-center mb-6">Your Library</h1>
      {games.length === 0 ? (
        <p className="text-white text-center">No games in your library</p>
      ) : (
        <div className="grid grid-cols-1 w-max sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
          {games.map((game) => (
            <GameCard
              key={game._id}
              game={game}
              isInLibrary={library.has(game._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Library;