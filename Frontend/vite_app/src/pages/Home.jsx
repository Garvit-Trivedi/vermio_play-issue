// import React, { useEffect, useState } from "react";
// import { fetchGames, fetchLibrary } from "../services/api";
// import GameCard from "../components/GameCard";
// import GameLoader from "../components/GameLoader"; // Import loader

// function Home() {
//   const [games, setGames] = useState([]);
//   const [library, setLibrary] = useState(new Set());
//   const [loading, setLoading] = useState(true); // Loading state

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [gameData, libraryData] = await Promise.all([
//           fetchGames(),
//           fetchLibrary(),
//         ]);
//         setGames(gameData);
//         setLibrary(new Set(libraryData.map((g) => g._id)));
//       } catch (error) {
//         console.error("Error fetching games or library:", error);
//       } finally {
//         setLoading(false); // Stop loading after data fetch
//       }
//     };

//     loadData();
//   }, []);

//   const updateLibrary = (gameId) => {
//     setLibrary((prev) => {
//       const newLibrary = new Set(prev);
//       if (newLibrary.has(gameId)) {
//         newLibrary.delete(gameId);
//       } else {
//         newLibrary.add(gameId);
//       }
//       return newLibrary;
//     });
//   };

//   if (loading) return <GameLoader />; // Show loader while loading

//   return (
//     <div className="home-page container m- p-4">
//       <h1 className="text-3xl font-bold text-center text-cyan-400 mb-6">Featured Games</h1>
//       <div className="grid grid-cols-1 w-max sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
//         {games.map((game) => (
//           <GameCard
//             key={game._id}
//             game={game}
//             isInLibrary={library.has(game._id)}
//             updateLibrary={updateLibrary}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Home;

import React, { useEffect, useState } from "react";
import { fetchGames, fetchLibrary } from "../services/api";
import GameCard from "../components/GameCard";
import GameLoader from "../components/GameLoader";
import SliderCarousel from "../components/HomeCarousel"; // Import slider

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
        console.error("Error fetching games or library:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
  };

  if (loading) return <GameLoader />;

  return (
    <div className="home-page container mx-auto p-4">
      <SliderCarousel /> {/* Add slider here */}
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
