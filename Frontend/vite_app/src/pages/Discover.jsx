import { useState, useEffect } from "react";
import { fetchGames } from "../services/api";
import GameLoader from "../components/GameLoader"; // Import the Loader
import Buttons from "../components/Buttons";
import './home.css'

const Discover = () => {
  const [games, setGames] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [loading, setLoading] = useState(true); // Loader state

  useEffect(() => {
    const loadData = async () => {
      try {
        const gamesData = await fetchGames();
        setGames(gamesData);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false); // Hide loader once data is loaded
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <GameLoader />; // Show loader while fetching data
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Discover Games</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {games.map((game) => (
          <div
            key={game._id}
            className="relative p-2 border rounded-lg overflow-hidden bg-[#1a1a2e] hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            onMouseEnter={() => setHovered(game._id)}
            onMouseLeave={() => setHovered(null)}
          >
            {hovered === game._id ? (
              <video
                src={game.firstVideo}
                autoPlay
                muted
                loop
                className="w-full h-40 object-fill rounded"
              />
            ) : (
              <img
                src={game.profilePic}
                alt={game.name}
                className="w-full h-40 object-cover rounded transition duration-300"
              />
            )}

            {hovered === game._id && (
              <div className="absolute top-2 right-2">
                <Buttons type="library" gameId={game._id} />
              </div>
            )}

            <h2
              className={`text-lg font-semibold italic text-[#bde0fe] transition-all duration-300 ${hovered === game._id ? "absolute bottom-4 left-4" : "text-center mt-2"}`}
            >
              {game.name}
            </h2>

            {hovered === game._id && (
              <div className="absolute right-3">
                <Buttons type="play" gameId={game._id} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discover;
