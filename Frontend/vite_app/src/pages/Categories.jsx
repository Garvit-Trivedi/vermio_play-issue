import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { fetchGamesByCategory } from "../services/api";
import GameCard from "../components/GameCard";
import GameLoader from "../components/GameLoader";
import { toast } from "react-toastify";
import { AuthContext } from '../AuthContext';

const Categories = () => {
  const { catname } = useParams();
  const { library } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryGames = await fetchGamesByCategory(catname);
        setGames(categoryGames);
      } catch (error) {
        toast.error(error.message || "Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [catname]);

  if (loading) return <GameLoader />;

  return (
    <div className="min-h-screen text-white mx-auto p-2 sm:p-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6">
        {catname.toUpperCase()} Games
      </h1>
      {games.length > 0 ? (
        <div className="grid grid-cols-1 w-max sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3 mx-auto">
          {games.map((game) => (
            <GameCard
              key={game._id}
              game={game}
              isInLibrary={library.has(game._id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-base sm:text-lg">No games found in this category.</p>
      )}
    </div>
  );
};

export default Categories;