import React, { useEffect, useState } from "react";
import { fetchGames, fetchLibrary, addToLibrary, removeFromLibrary } from "../services/api";
import GameCard from "../components/GameCard";
import GameLoader from "../components/GameLoader";
import SliderCarousel from "../components/HomeCarousel";
import { toast } from "react-toastify";

function Home() {
  const [games, setGames] = useState([]);
  const [library, setLibrary] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [gameData, libraryData] = await Promise.all([
          fetchGames(),
          fetchLibrary(),
        ]);
        setGames(gameData);
        setLibrary(new Set(libraryData.map((g) => g._id)));
      } catch (error) {
        console.error("Error fetching games or library:", error.message);
        toast.error(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const updateLibrary = async (gameId, newState) => {
    try {
      if (newState) {
        await addToLibrary(gameId);
        setLibrary((prev) => new Set(prev).add(gameId));
        if (!games.some((g) => g._id === gameId)) {
          const allGames = await fetchGames();
          const gameToAdd = allGames.find((g) => g._id === gameId) || { _id: gameId, name: "Unknown", profilePic: "" };
          setGames((prevGames) => [...prevGames, gameToAdd]);
        }
      } else {
        await removeFromLibrary(gameId);
        setLibrary((prev) => {
          const newLibrary = new Set(prev);
          newLibrary.delete(gameId);
          return newLibrary;
        });
        setGames((prevGames) => prevGames.filter((game) => game._id !== gameId));
      }
    } catch (error) {
      console.error("Error updating library:", error.message);
      toast.error(error.message || "Failed to update library", { toastId: `library-${gameId}` });
    }
  };

  if (loading) {
    return <GameLoader />;
  }

  return (
    <div className="home-page container mx-auto p-4">
      <SliderCarousel />
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