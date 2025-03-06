import { useState, useEffect, useContext } from "react";
import { fetchGames } from "../services/api";
import GameLoader from "../components/GameLoader";
import Buttons from "../components/Buttons";
import './home.css';
import { AuthContext } from '../AuthContext';

const Discover = () => {
  const { library } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const gamesData = await fetchGames();
        setGames(gamesData);
      } catch (error) {
        setGames([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <GameLoader />;

  return (
    <div className="p-2 sm:p-4 text-white min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">Discover Games</h1>
      {games.length === 0 ? (
        <p className="text-center text-sm sm:text-base">No games available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 mx-auto w-max">
          {games.map((game) => (
            <div
              key={game._id}
              className="relative p-2 border rounded-lg overflow-hidden bg-[#1a1a2e] hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              onMouseEnter={() => setHovered(game._id)}
              onMouseLeave={() => setHovered(null)}
            >
              {hovered === game._id && game.reviews.find((r) => r.type === "video")?.url ? (
                <video
                  src={game.reviews.find((r) => r.type === "video").url}
                  autoPlay
                  muted
                  loop
                  className="w-full h-32 sm:h-40 object-fill rounded"
                />
              ) : (
                <img
                  src={game.profilePic}
                  alt={game.name}
                  className="w-full h-32 sm:h-40 object-cover rounded transition duration-300"
                />
              )}

              {hovered === game._id && (
                <div className="absolute top-1 sm:top-2 right-1 sm:right-2">
                  <Buttons type="library" gameId={game._id} />
                </div>
              )}

              <h2
                className={`text-sm sm:text-lg font-semibold italic text-[#bde0fe] transition-all duration-300 ${hovered === game._id ? "absolute bottom-2 sm:bottom-4 left-2 sm:left-4" : "text-center mt-2"
                  }`}
              >
                {game.name}
              </h2>

              {hovered === game._id && (
                <div className="absolute right-1 sm:right-3 bottom-1 sm:bottom-5">
                  <Buttons type="play" gameId={game._id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Discover;