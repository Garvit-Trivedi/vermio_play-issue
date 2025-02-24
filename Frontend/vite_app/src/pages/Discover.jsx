import { useState, useEffect } from "react";
import { fetchGames, fetchLibrary, addToLibrary, removeFromLibrary } from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import GameLoader from "../components/GameLoader"; // Import the Loader

const Discover = () => {
  const [games, setGames] = useState([]);
  const [library, setLibrary] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [loading, setLoading] = useState(true); // Loader state
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const gamesData = await fetchGames();
        const libraryData = await fetchLibrary();
        setGames(gamesData);
        setLibrary(libraryData.map((game) => game._id));
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false); // Hide loader once data is loaded
      }
    };
    loadData();
  }, []);

  const handleLibrary = async (game) => {
    const inLibrary = library.includes(game._id);
    try {
      if (inLibrary) {
        await removeFromLibrary(Number(game._id));
        setLibrary((prev) => prev.filter((id) => id !== game._id));
      } else {
        await addToLibrary(Number(game._id));
        setLibrary((prev) => [...prev, game._id]);
      }
    } catch (error) {
      console.error("Error updating library:", error);
    }
  };

  const handlePlay = (game) => {
    navigate(`/game/${game._id}`);
  };

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
              <button
                className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center rounded-2xl border-2 bg-blue-900 text-white shadow-md"
                onClick={() => handleLibrary(game)}
              >
                <FontAwesomeIcon icon={library.includes(game._id) ? faMinus : faPlus} />
              </button>
            )}

            <h2
              className={`text-lg font-semibold italic text-[#bde0fe] transition-all duration-300 ${hovered === game._id ? "absolute bottom-4 left-4" : "text-center mt-2"}`}
            >
              {game.name}
            </h2>

            {hovered === game._id && (
              <button
                className="absolute bottom-4 right-4 px-4 py-2 bg-blue-900 border-2 hover:border-blue-500 text-white rounded-lg text-md hover:text-blue-500"
                onClick={() => handlePlay(game)}
              >
                ▶ PLAY
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discover;
