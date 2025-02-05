// import { useState, useEffect } from "react";
// import { fetchGames, fetchLibrary, updateLibrary } from "../services/api";

// const Discover = () => {
//   const [games, setGames] = useState([]);
//   const [library, setLibrary] = useState([]);
//   const [hovered, setHovered] = useState(null);

//   useEffect(() => {
//     const loadData = async () => {
//       const gamesData = await fetchGames();
//       const libraryData = await fetchLibrary();
//       setGames(gamesData);
//       // Ensure library contains only gameIds as numbers
//       setLibrary(libraryData.map(game => game.gameId));
//     };
//     loadData();
//   }, []);

//   const handleLibrary = async (gameId) => {
//     const inLibrary = library.includes(gameId); // Check if the gameId exists in the library
//     const success = await updateLibrary(gameId, inLibrary);
//     if (success) {
//       setLibrary((prev) =>
//         inLibrary ? prev.filter((id) => id !== gameId) : [...prev, gameId]
//       );
//     }
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Discover Games</h1>
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {games.map((game) => (
//           <div
//             key={game._id}
//             className="relative p-2 border rounded-lg  overflow-hidden bg-[#1a1a2e] hover:shadow-lg transition duration-300"
//             onMouseEnter={() => setHovered(game._id)}
//             onMouseLeave={() => setHovered(null)}
//           >
//             {/* Image or Video on Hover */}
//             {hovered === game._id ? (
//               <video
//                 src={game.firstVideo}
//                 autoPlay
//                 muted
//                 loop
//                 className="w-full h-40 object-fill rounded"
//               />
//             ) : (
//               <img
//                 src={game.profilePic}
//                 alt={game.name}
//                 className="w-full h-40 object-cover rounded transition duration-300"
//               />
//             )}

//             {/* Library Button (Top Right, Appears on Hover) */}
//             {hovered === game._id && (
//               <button
//                 className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full ${library.includes(game._id) ? "bg-red-500" : "bg-blue-500"} text-white`}
//                 onClick={() => handleLibrary(game._id)}
//               >
//                 {library.includes(game._id) ? "−" : "+"}
//               </button>
//             )}

//             {/* Game Title (Moves from Center to Left on Hover) */}
//             <h2
//               className={`text-lg font-semibold italic text-[#bde0fe] transition-all duration-300 ${
//                 hovered === game._id ? "absolute bottom-4 left-4" : "text-center mt-2"
//               }`}
//             >
//               {game.name}
//             </h2>

//             {/* Play Button (Bottom Right, Appears on Hover) */}
//             {hovered === game._id && (
//               <button className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-md hover:bg-blue-700">
//                 ▶ PLAY
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Discover;

import { useState, useEffect } from "react";
import { fetchGames, fetchLibrary, addToLibrary, removeFromLibrary } from "../services/api";

const Discover = () => {
  const [games, setGames] = useState([]);
  const [library, setLibrary] = useState([]);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const gamesData = await fetchGames();
      const libraryData = await fetchLibrary();
      setGames(gamesData);
      // Ensure library contains only gameIds as numbers
      setLibrary(libraryData.map((game) => game.gameId));
    };
    loadData();
  }, []);

  const handleLibrary = async (gameId) => {
    const inLibrary = library.includes(gameId); // Check if the gameId exists in the library
    try {
      if (inLibrary) {
        // Remove from library
        await removeFromLibrary(Number(gameId)); // Ensure gameId is a number
        setLibrary((prev) => prev.filter((id) => id !== gameId)); // Remove from state
      } else {
        // Add to library
        await addToLibrary(Number(gameId)); // Ensure gameId is a number
        setLibrary((prev) => [...prev, gameId]); // Add to state
      }
    } catch (error) {
      console.error("Error updating library:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Discover Games</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {games.map((game) => (
          <div
            key={game._id}
            className="relative p-2 border rounded-lg overflow-hidden bg-[#1a1a2e] hover:shadow-lg transition duration-300"
            onMouseEnter={() => setHovered(game._id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Image or Video on Hover */}
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

            {/* Library Button (Top Right, Appears on Hover) */}
            {hovered === game._id && (
              <button
                className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full ${library.includes(game._id) ? "bg-red-500" : "bg-blue-500"} text-white`}
                onClick={() => handleLibrary(game._id)}
              >
                {library.includes(game._id) ? "−" : "+"}
              </button>
            )}

            {/* Game Title (Moves from Center to Left on Hover) */}
            <h2
              className={`text-lg font-semibold italic text-[#bde0fe] transition-all duration-300 ${hovered === game._id ? "absolute bottom-4 left-4" : "text-center mt-2"}`}
            >
              {game.name}
            </h2>

            {/* Play Button (Bottom Right, Appears on Hover) */}
            {hovered === game._id && (
              <button className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-md hover:bg-blue-700">
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
