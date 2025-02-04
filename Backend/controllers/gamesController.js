const { getGameCollection, getLibraryCollection } = require("../config/db");

// 📌 **GET all games (limit 10)**
const getAllGames = async (req, res) => {
  try {
    const gamesCollection = await getGameCollection(); // 💡 Await the collection
    const games = await gamesCollection
      .find({}, { projection: { _id: 1, name: 1, profilePic: 1, reviews: 1 } })
      .limit(10)
      .toArray();

    const transformedGames = games.map((game) => ({
      _id: game._id,
      name: game.name,
      profilePic: game.profilePic,
      firstVideo: game.reviews?.find((r) => r.type === "video")?.url || null,
    }));

    res.status(200).json(transformedGames);
  } catch (error) {
    console.error("❌ Error fetching games:", error);
    res.status(500).json({ error: "Failed to fetch games. Please try again." });
  }
};

// 📌 **GET search games by name, genre, titles, developer**
const searchGames = async (req, res) => {
  try {
    const gamesCollection = await getGameCollection(); // 💡 Await the collection
    const searchQuery = req.query.q;
    if (!searchQuery) {
      return res.status(400).json({ error: "Search query is required." });
    }

    const query = {
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { genres: { $regex: searchQuery, $options: "i" } },
        { titles: { $regex: searchQuery, $options: "i" } },
        { developer: { $regex: searchQuery, $options: "i" } },
      ],
    };

    const games = await gamesCollection
      .find(query, {
        projection: { _id: 1, name: 1, profilePic: 1, reviews: 1 },
      })
      .toArray();

    if (games.length === 0) {
      return res.status(404).json({ message: "No games found." });
    }

    const transformedGames = games.map((game) => ({
      _id: game._id,
      name: game.name,
      profilePic: game.profilePic,
      firstVideo: game.reviews?.find((r) => r.type === "video")?.url || null,
    }));

    res.status(200).json(transformedGames);
  } catch (error) {
    console.error("❌ Error searching games:", error);
    res
      .status(500)
      .json({ error: "Failed to search games. Please try again." });
  }
};

// 📌 **GET game details by ID**
const getGameById = async (req, res) => {
  try {
    const gamesCollection = await getGameCollection(); // 💡 Await the collection
    const gameId = parseInt(req.params.id);
    if (isNaN(gameId)) {
      return res.status(400).json({ error: "Invalid game ID format" });
    }

    const game = await gamesCollection.findOne(
      { _id: gameId },
      {
        projection: {
          _id: 1,
          name: 1,
          profilePic: 1,
          bgPic: 1,
          titles: 1,
          reviews: 1,
          description: 1,
          about: 1,
          developer: 1,
          genres: 1,
        },
      }
    );

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json(game);
  } catch (error) {
    console.error("❌ Error fetching game:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch game. Please try again later." });
  }
};

// 📌 **POST add a game to library**
const addGameToLibrary = async (req, res) => {
  try {
    const gamesCollection = await getGameCollection(); // 💡 Await the collection
    const libraryCollection = await getLibraryCollection(); // 💡 Await the collection

    const gameId = parseInt(req.body.gameId);
    if (!gameId) {
      return res.status(400).json({ error: "Game ID is required." });
    }

    const existingGame = await libraryCollection.findOne({ _id: gameId });
    if (existingGame) {
      return res.status(400).json({ error: "Game is already in the library." });
    }

    const game = await gamesCollection.findOne({ _id: gameId });
    if (!game) {
      return res
        .status(404)
        .json({ error: "Game not found in games collection." });
    }

    await libraryCollection.insertOne(game);
    res.status(201).json({ message: "Game added to library.", game });
  } catch (error) {
    console.error("Error adding game to library:", error);
    res.status(500).json({ error: "Failed to add game. Please try again." });
  }
};

// 📌 **GET all games from library**
const getLibraryGames = async (req, res) => {
  try {
    const libraryCollection = await getLibraryCollection(); // 💡 Await the collection
    const savedGames = await libraryCollection.find().toArray();
    res.status(200).json(savedGames);
  } catch (error) {
    console.error("Error fetching library games:", error);
    res.status(500).json({ error: "Failed to fetch library games." });
  }
};

// 📌 **DELETE remove game from library**
const removeGameFromLibrary = async (req, res) => {
  try {
    const libraryCollection = await getLibraryCollection(); // 💡 Await the collection
    const gameId = parseInt(req.params.id);
    if (isNaN(gameId)) {
      return res.status(400).json({ error: "Invalid game ID format" });
    }

    const result = await libraryCollection.deleteOne({ _id: gameId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Game not found in the library." });
    }

    res.status(200).json({ message: "Game removed from library." });
  } catch (error) {
    console.error("Error removing game from library:", error);
    res.status(500).json({ error: "Failed to remove game. Please try again." });
  }
};

module.exports = {
  getAllGames,
  searchGames,
  getGameById,
  addGameToLibrary,
  getLibraryGames,
  removeGameFromLibrary,
};

// const { ObjectId } = require("mongodb");
// const { getGameCollection, getLibraryCollection } = require("../config/db");

// // 📌 **Fetch all games for the homepage**
// const getAllGames = async (req, res) => {
//   try {
//     const gamesCollection = await getGameCollection();
//     const games = await gamesCollection.find().toArray();
//     res.status(200).json(games);
//   } catch (error) {
//     console.error("Error fetching games:", error);
//     res.status(500).json({ error: "Failed to fetch games. Please try again." });
//   }
// };

// // 📌 **Search games by name**
// const searchGames = async (req, res) => {
//   try {
//     const gamesCollection = await getGameCollection();
//     const searchQuery = req.query.q;

//     if (!searchQuery) {
//       return res.status(400).json({ error: "Search query is required." });
//     }

//     const games = await gamesCollection
//       .find({ name: { $regex: searchQuery, $options: "i" } })
//       .toArray();

//     res.status(200).json(games);
//   } catch (error) {
//     console.error("Error searching games:", error);
//     res.status(500).json({ error: "Failed to search games. Please try again." });
//   }
// };

// // 📌 **Fetch a single game by ID**
// const getGameById = async (req, res) => {
//   try {
//     const gamesCollection = await getGameCollection();
//     const gameId = req.params.id;

//     if (!ObjectId.isValid(gameId)) {
//       return res.status(400).json({ error: "Invalid game ID format" });
//     }

//     const game = await gamesCollection.findOne({ _id: new ObjectId(gameId) });

//     if (!game) {
//       return res.status(404).json({ error: "Game not found." });
//     }

//     res.status(200).json(game);
//   } catch (error) {
//     console.error("Error fetching game by ID:", error);
//     res.status(500).json({ error: "Failed to fetch game. Please try again." });
//   }
// };

// // 📌 **Add a game to the user's library**
// const addGameToLibrary = async (req, res) => {
//   try {
//     const gamesCollection = await getGameCollection();
//     const libraryCollection = await getLibraryCollection();

//     const gameId = req.body.gameId;
//     if (!gameId || !ObjectId.isValid(gameId)) {
//       return res.status(400).json({ error: "Valid game ID is required." });
//     }

//     const userId = new ObjectId.createFromTime(Date.now() / 1000); // Convert user ID to ObjectId from timestamp

//     // Check if the game is already in the user's library
//     const existingGame = await libraryCollection.findOne({
//       userId,
//       gameId: new ObjectId(gameId),
//     });
//     if (existingGame) {
//       return res.status(400).json({ error: "Game is already in the library." });
//     }

//     // Find the game details from the games collection
//     const game = await gamesCollection.findOne({ _id: new ObjectId(gameId) });
//     if (!game) {
//       return res.status(404).json({ error: "Game not found." });
//     }

//     // Add the game to the user's library
//     await libraryCollection.insertOne({
//       userId,
//       gameId: new ObjectId(gameId),
//       name: game.name,
//       reviews: game.reviews,
//     });

//     res.status(201).json({ message: "Game added to library.", game });
//   } catch (error) {
//     console.error("Error adding game to library:", error);
//     res.status(500).json({ error: "Failed to add game. Please try again." });
//   }
// };

// // 📌 **Get all games from the user's library**
// const getLibraryGames = async (req, res) => {
//   try {
//     const libraryCollection = await getLibraryCollection();
//     const userId = new ObjectId.createFromTime(Date.now() / 1000); // Convert user ID from timestamp

//     const savedGames = await libraryCollection.find({ userId }).toArray();
//     res.status(200).json(savedGames);
//   } catch (error) {
//     console.error("Error fetching library games:", error);
//     res.status(500).json({ error: "Failed to fetch library games." });
//   }
// };

// // 📌 **Remove a game from the user's library**
// const removeGameFromLibrary = async (req, res) => {
//   try {
//     const libraryCollection = await getLibraryCollection();
//     const gameId = req.params.id;

//     if (!ObjectId.isValid(gameId)) {
//       return res.status(400).json({ error: "Invalid game ID format" });
//     }

//     const userId = new ObjectId.createFromTime(Date.now() / 1000); // Convert user ID from timestamp

//     const result = await libraryCollection.deleteOne({
//       userId,
//       gameId: new ObjectId(gameId),
//     });

//     if (result.deletedCount === 0) {
//       return res.status(404).json({ error: "Game not found in the library." });
//     }

//     res.status(200).json({ message: "Game removed from library." });
//   } catch (error) {
//     console.error("Error removing game from library:", error);
//     res.status(500).json({ error: "Failed to remove game. Please try again." });
//   }
// };

// module.exports = {
//   getAllGames,
//   searchGames,
//   getGameById,
//   addGameToLibrary,
//   getLibraryGames,
//   removeGameFromLibrary,
// };

// const games = [
//   {
//     _id: 101,
//     name: "Counter Strike 2",
//     profilePic:
//       "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/header.jpg?t=1729703045",
//     bgPic:
//       "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/page_bg_generated_v6b.jpg?t=1729703045",
//     titles: ["multiplayer", "fps", "action", "shooter"],
//     reviews: [
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/256969690/movie480_vp9.webm?t=1696005491",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/256972298/movie.184x123.jpg?t=1696005467",
//       },
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/256970298/movie480_vp9.webm?t=1696005475",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/256970298/movie.184x123.jpg?t=1696005475",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/ss_796601d9d67faf53486eeb26d0724347cea67ddc.1920x1080.jpg?t=1729703045",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/ss_13bb35638c0267759276f511ee97064773b37a51.1920x1080.jpg?t=1729703045",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/ss_ef82850f036dac5772cb07dbc2d1116ea13eb163.1920x1080.jpg?t=1729703045",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/ss_808cdd373d78c3cf3a78e7026ebb1a15895e0670.1920x1080.jpg?t=1729703045",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/ss_352666c1949ce3966bd966d6ea5a1afd532257bc.1920x1080.jpg?t=1729703045",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/ss_fe70d46859593aef623a0614f4686e2814405035.1920x1080.jpg?t=1729703045",
//       },
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/256969703/movie480_vp9.webm?t=1696005483",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/256969703/movie.184x123.jpg?t=1696005483",
//       },
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/256969690/movie480_vp9.webm?t=1696005491",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/256969690/movie.184x123.jpg?t=1696005491",
//       },
//     ],
//     description:
//       "For over two decades, Counter-Strike has offered an elite competitive experience, one shaped by millions of players from across the globe. And now the next chapter in the CS story is about to begin. This is Counter-Strike 2.",
//     about:
//       "For over two decades, Counter-Strike has offered an elite competitive experience, one shaped by millions of players from across the globe. And now the next chapter in the CS story is about to begin. This is Counter-Strike 2. A free upgrade to CS:GO, Counter-Strike 2 marks the largest technical leap in Counter-Strike’s history. Built on the Source 2 engine, Counter-Strike 2 is modernized with realistic physically-based rendering, state of the art networking, and upgraded Community Workshop tools.",
//     developer: "Respawn Entertainment",
//     genres: ["action", "shooter"],
//   },
//   {
//     _id: 102,
//     name: "War Thunder",
//     profilePic:
//       "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/236390/header.jpg?t=1738152848",
//     bgPic:
//       "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/236390/page_bg_generated_v6b.jpg?t=1738152848",
//     titles: ["multiplayer", "fps", "action", "shooter"],
//     reviews: [
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/257082547/movie480_vp9.webm?t=1734345883",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/257082547/3399b891d625ebbf162b08d4376427783e3b485e/movie_232x130.jpg?t=1734345883",
//       },
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/257073838/movie480_vp9.webm?t=1731612183",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/257073838/c929aa0ab3417b0648d07d4515eba34faf003561/movie_232x130.jpg?t=1731612183",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/236390/ss_68bc95495ba9752b44d6655f07cf41a5c26306f6.1920x1080.jpg?t=1738152848",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/236390/ss_5190ebc65d0fd3628d8f804af52c8b9d0786d183.1920x1080.jpg?t=1738152848",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/236390/ss_fee9c41789ba7227b3cc66db04d8d8f72b3c15cb.1920x1080.jpg?t=1738152848",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/236390/ss_a5812428a7709edd1e53310bc9357f418ea2032d.1920x1080.jpg?t=1738152848",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/236390/ss_122cf1a37b5405f055afe58539997ff139b1fde2.1920x1080.jpg?t=1738152848",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/236390/ss_3b32e04e856b77472bff33d55ca6b5758d23a9ae.1920x1080.jpg?t=1738152848",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/236390/ss_8c28d914813b82f36d306e5ea322a70f9050f9bc.1920x1080.jpg?t=1738152848",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/236390/ss_15343f845523e07d5fc51c6208f362b7bcaa1fbe.1920x1080.jpg?t=1738152848",
//       },
//     ],
//     description:
//       "War Thunder is the most comprehensive free-to-play, cross-platform, MMO military game dedicated to aviation, armoured vehicles, and naval craft, from the early 20th century to the most advanced modern combat units. Join now and take part in major battles on land, in the air, and at sea.",
//     about:
//       "War Thunder is the most comprehensive free-to-play, cross-platform, MMO military game dedicated to aviation, armoured vehicles, from the early 20th century to the most advanced modern combat units. Join now and take part in major battles on land, in the air, and at sea, fighting with millions of players from all over the world in an ever-evolving environment.",
//     developer: "Gaijin Entertainment",
//     genres: ["Action", "Massively Multiplayer", "Simulation", "Free To Play"],
//   },
//   {
//     _id: 103,
//     name: "Once Human",
//     profilePic:
//       "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2139460/header.jpg?t=1737448314",
//     bgPic:
//       "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2139460/page_bg_generated_v6b.jpg?t=1737448314",
//     titles: ["survival", "multiplayer", "open-world", "RPG"],
//     reviews: [
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/257089830/movie480_vp9.webm?t=1737103371",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/257089830/2eba04dd0a60696273fdab88150b537d63411836/movie_232x130.jpg?t=1737103371",
//       },
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/257089830/movie480_vp9.webm?t=1737103371",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/256998828/movie.184x123.jpg?t=1707101835",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2139460/ss_a36959b49663c056f11cf8f47e3db291366f99f2.1920x1080.jpg?t=1737448314",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2139460/ss_480b45fcac3599c7c61a72cf633e8ce88bce292f.1920x1080.jpg?t=1737448314",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2139460/ss_1ae7debe7f68a4cdde727d984d9e724f65767d66.1920x1080.jpg?t=1737448314",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2139460/ss_2d7faf83b6942dcf69a4035f71ce4f1662826bc6.1920x1080.jpg?t=1737448314",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2139460/ss_626ba55e262fe857b8f0d2810603d2268e2df003.1920x1080.jpg?t=1737448314",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2139460/ss_001526dade6e9f28c6711932250e3734c45bea01.1920x1080.jpg?t=1737448314",
//       },
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/257089830/movie480_vp9.webm?t=1737103371",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/257066046/9b20c1385d78acfa6b7e6ea26da2d18de29baff8/movie_232x130.jpg?t=1729138826",
//       },
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/257066994/movie480_vp9.webm?t=1729492495",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/257066994/34cfdecf10b9e45bdc1455918f024c9e63e7d37f/movie_232x130.jpg?t=1729492495",
//       },
//     ],
//     description:
//       "Once Human is an open-world survival game set in a post-apocalyptic world where supernatural forces have altered reality. Players must scavenge, build, and fight to survive.",
//     about:
//       "Once Human offers an immersive survival experience with base-building, exploration, and combat. Players must navigate an ever-changing world filled with supernatural entities and rival factions.",
//     developer: "Starry Studio",
//     genres: ["Survival", "Open-World", "Multiplayer", "RPG"],
//   },
//   {
//     _id: 104,
//     name: "Apex Legends",
//     profilePic:
//       "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1172470/header.jpg?t=1736940058",
//     bgPic:
//       "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1172470/page_bg_generated_v6b.jpg?t=1736940058",
//     titles: ["battle royale", "fps", "shooter", "multiplayer"],
//     reviews: [
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/257076425/movie480_vp9.webm?t=1732533132",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/257076425/d50c0845e164d07262a088827d5016fb5e9fcec4/movie_232x130.jpg?t=1732533132",
//       },
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/257083161/movie480_vp9.webm?t=1734541491",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/257083161/c1cd3fa39e3f0c0296cf3e230793968c29908858/movie_232x130.jpg?t=1734541491",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1172470/ss_6be87726df49a188a6d4bb9d712191b5547e8c9d.600x338.jpg?t=1736940058",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1172470/ss_4488cb162bbb0e0d2e6c17be612035bb6349bcca.600x338.jpg?t=1736940058",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1172470/ss_fab213cdd1f3d8699087b92b72057a96ad868726.600x338.jpg?t=1736940058",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1172470/ss_677940d4d4bd5f3d7bc2cca36f73785a98f2298c.600x338.jpg?t=1736940058",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1172470/ss_6757e9de570afd0e5a118c8519a7ddef4a409221.600x338.jpg?t=1736940058",
//       },
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/257071165/movie480_vp9.webm?t=1730895174",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/257071165/3591aa9fc7dbcd20d30b430473cd1a2c97bc30cd/movie_232x130.jpg?t=1730895174",
//       },
//     ],
//     description:
//       "Apex Legends is a fast-paced battle royale game where teams of three compete in a high-stakes survival match. Choose from a variety of Legends, each with unique abilities.",
//     about:
//       "Developed by Respawn Entertainment, Apex Legends offers dynamic squad-based gameplay, combining strategic gunplay with hero-based mechanics. The game continues to evolve with seasonal updates.",
//     developer: "Respawn Entertainment",
//     genres: ["Battle Royale", "Shooter", "Multiplayer", "FPS"],
//   },
//   {
//     _id: 105,
//     name: "Marvel Rivals",
//     profilePic:
//       "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2767030/header.jpg?t=1736492430",
//     bgPic:
//       "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2767030/page_bg_generated_v6b.jpg?t=1736492430",
//     titles: ["action", "multiplayer", "shooter", "superhero"],
//     reviews: [
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/257087760/movie480_vp9.webm?t=1736492424",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/257087760/7555ef11f912c258fe844ef2c37cdb79c87be4f9/movie_232x130.jpg?t=1736492424",
//       },
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/257009674/movie480_vp9.webm?t=1722825586",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/257009674/movie.184x123.jpg?t=1722825586",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2767030/ss_87923a8e7d294db69069e3451664115bb373013d.1920x1080.jpg?t=1736492430",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2767030/ss_51dfe5152a8dcaf375a71d0d07433af334bf7a84.1920x1080.jpg?t=1736492430",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2767030/ss_719f339a932cb46a9e3e780f27b588ad2e3c4885.1920x1080.jpg?t=1736492430",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2767030/ss_88342e4a52d65847075da15708fe1f2eed120aff.1920x1080.jpg?t=1736492430",
//       },
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/257077891/movie480_vp9.webm?t=1732982458",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/257077891/aed38ebb85853c92d4547eb61f84426d46300cab/movie_232x130.jpg?t=1732982458",
//       },
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/257079154/movie480_vp9.webm?t=1733439843",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/257079154/62f1040a690454107b94e34929538941925ef22d/movie_232x130.jpg?t=1733439843",
//       },
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/257040847/movie480_vp9.webm?t=1722825582",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/257040847/movie.184x123.jpg?t=1722825582",
//       },
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/257048751/movie480_vp9.webm?t=1724398203",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/257048751/movie.184x123.jpg?t=1724398203",
//       },
//     ],
//     description:
//       "Marvel Rivals is a team-based hero shooter featuring iconic Marvel characters. Players form teams to battle in fast-paced, objective-based combat.",
//     about:
//       "Experience the Marvel universe like never before with unique character abilities and team-based tactics. Each hero brings their own special skills to the battlefield.",
//     developer: "NetEase Games",
//     genres: ["Action", "Shooter", "Multiplayer", "Superhero"],
//   },
//   {
//     _id: 106,
//     name: "Dota 2",
//     profilePic:
//       "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/570/header.jpg?t=1731544174",
//     bgPic:
//       "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/570/page_bg_generated_v6b.jpg?t=1731544174",
//     titles: ["MOBA", "multiplayer", "strategy", "esports"],
//     reviews: [
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/256692021/movie480.webm?t=1731033148",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/256692021/movie.184x123.jpg?t=1731033148",
//       },
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/256819789/movie480_vp9.webm?t=1731033153",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/256819789/movie.184x123.jpg?t=1731033153",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/570/ss_27b6345f22243bd6b885cc64c5cda74e4bd9c3e8.1920x1080.jpg?t=1731544174",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/570/ss_b33a65678dc71cc98df4890e22a89601ee56a918.1920x1080.jpg?t=1731544174",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/570/ss_1f3b5f5ccf8b159294914c3fe028128a787304b6.1920x1080.jpg?t=1731544174",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/570/ss_e0a92f15a6631a8186df79182d0fe28b5e37d8cb.1920x1080.jpg?t=1731544174",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/570/ss_86d675fdc73ba10462abb8f5ece7791c5047072c.1920x1080.jpg?t=1731544174",
//       },
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/2028243/movie480.webm?t=1731033161",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2028243/movie.184x123.jpg?t=1731033161",
//       },
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/81026/movie480.webm?t=1731033166",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/81026/movie.184x123.jpg?t=1731033166",
//       },
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/2040250/movie480.webm?t=1731033170",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2040250/movie.184x123.jpg?t=1731033170",
//       },
//     ],
//     description:
//       "Dota 2 is a highly competitive multiplayer online battle arena (MOBA) game where two teams of five players battle to destroy each other's Ancient.",
//     about:
//       "As one of the biggest esports titles in the world, Dota 2 offers deep strategy, teamwork, and skill-based gameplay with an ever-growing roster of heroes.",
//     developer: "Valve Corporation",
//     genres: ["MOBA", "Multiplayer", "Strategy", "Esports"],
//   },
//   {
//     _id: 107,
//     name: "Destiny 2",
//     profilePic: "",
//     bgPic: "",
//     titles: ["fps", "multiplayer", "looter-shooter", "action"],
//     reviews: [
//       {
//         type: "video",
//         url: "",
//         thumbnail: "",
//       },
//       {
//         type: "image",
//         url: "",
//       },
//     ],
//     description:
//       "Destiny 2 is an online multiplayer looter-shooter where players explore vast sci-fi worlds, engage in cooperative raids, and battle in intense PvP combat.",
//     about:
//       "Developed by Bungie, Destiny 2 blends RPG elements with fast-paced shooting mechanics. Players can customize their Guardian and take on ever-evolving challenges.",
//     developer: "Bungie",
//     genres: ["FPS", "Multiplayer", "Looter-Shooter", "Action"],
//   },
//   {
//     _id: 108,
//     name: "PUBG: Battlegrounds",
//     profilePic: "",
//     bgPic: "",
//     titles: ["battle royale", "multiplayer", "shooter", "realistic"],
//     reviews: [
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/578080/ss_1d009689dcded2de5771af55fb7134a77c4da642.1920x1080.jpg?t=1736389084",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/578080/ss_2da334ea597d9588aaa8c716d71b3c2e60a69853.1920x1080.jpg?t=1736389084",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/578080/ss_fe5340f8ea6e0d2f3899ef1e7d2ebdfc07e32f67.1920x1080.jpg?t=1736389084",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/578080/ss_1fc0cca99883a1dbaeaadfffc1492f81e4e77d32.1920x1080.jpg?t=1736389084",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/578080/ss_66e156cf716e72096c15c132c3443e774cb2f9a5.1920x1080.jpg?t=1736389084",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/578080/ss_63bb4a659968c3417ddd2ea5fd82cd2143e458a0.1920x1080.jpg?t=1736389084",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/578080/ss_3857268f02113c5095ff7bc73f814bd80ade8c2e.1920x1080.jpg?t=1736389084",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/578080/ss_034714c0f118657ac694c5b9c43bb647ed9ec051.1920x1080.jpg?t=1736389084",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/578080/ss_f148e1cd44da2972d1b61da1e12b7b3587c1f6a3.1920x1080.jpg?t=1736389084",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/578080/ss_c2456a0981b61eca4e84d3ff62fff6c78d61a6d0.1920x1080.jpg?t=1736389084",
//       },
//     ],
//     description:
//       "PUBG: Battlegrounds is a battle royale game where 100 players parachute onto an island and fight to be the last one standing. Players must scavenge for weapons, armor, and supplies.",
//     about:
//       "With realistic gunplay and expansive maps, PUBG delivers an intense survival experience. Strategy and quick thinking are key to securing victory.",
//     developer: "KRAFTON, Inc.",
//     genres: ["Battle Royale", "Shooter", "Multiplayer", "Survival"],
//   },
//   {
//     _id: 109,
//     name: "Call of Duty: Warzone",
//     profilePic: "",
//     bgPic: "",
//     titles: ["battle royale", "fps", "action", "shooter"],
//     reviews: [
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1962663/ss_6c4b65b9aa3f5ebf83dfe95a2b7c50af56148413.1920x1080.jpg?t=1738089567",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1962663/ss_1c430b6c35f3b9330ffd2045b34e681399f94aa5.1920x1080.jpg?t=1738089567",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1962663/ss_d35afc84e1a3e88d955578cb940b49b500294605.1920x1080.jpg?t=1738089567",
//       },
//     ],
//     description:
//       "Call of Duty: Warzone is a free-to-play battle royale experience set in the Call of Duty universe. Players drop into large-scale maps and battle in squads or solo.",
//     about:
//       "Warzone features intense gunplay, large-scale combat, and a variety of tactical loadout options. With constant updates and new content, the game remains a top competitive shooter.",
//     developer: "Infinity Ward, Raven Software",
//     genres: ["Battle Royale", "FPS", "Shooter", "Action"],
//   },
//   {
//     _id: 110,
//     name: "Summoners War",
//     profilePic:
//       "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2426960/header.jpg?t=1736438304",
//     bgPic:
//       "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2426960/page_bg_generated_v6b.jpg?t=1736438304",
//     titles: ["RPG", "turn-based", "strategy", "fantasy"],
//     reviews: [
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/257086141/movie480_vp9.webm?t=1736438297",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/257086141/adac14647a0c76b8b8dc481653e833aebbf68839/movie_232x130.jpg?t=1736438297",
//       },
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/256950899/movie480_vp9.webm?t=1700186459",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/256950899/movie.184x123.jpg?t=1700186459",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2426960/ss_f4a2640a61daed6edb3d5a707687a177508198b9.1920x1080.jpg?t=1736438304",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2426960/ss_3991dbb108fa65bbf05dd67780cb83d158ff578a.600x338.jpg?t=1736438304",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2426960/ss_13a84950abdb8a4c10ad6427c650ff4f76200b25.600x338.jpg?t=1736438304",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2426960/ss_f5f69f8609db91ed324a72d1c54c5d0c5a3bb5a5.1920x1080.jpg?t=1736438304",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2426960/ss_ca905129935169010bb3b817923facef6b7c654a.1920x1080.jpg?t=1736438304",
//       },
//       {
//         type: "image",
//         url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2426960/ss_c5754be5dd3fca41f455af34df571500dc213fbe.1920x1080.jpg?t=1736438304",
//       },
//       {
//         type: "video",
//         url: "https://video.fastly.steamstatic.com/store_trailers/256950880/movie480_vp9.webm?t=1700186536",
//         thumbnail:
//           "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/256950880/movie.184x123.jpg?t=1700186536",
//       },
//     ],
//     description:
//       "Summoners War is a turn-based strategy RPG where players summon powerful monsters, build teams, and engage in strategic battles.",
//     about:
//       "With hundreds of unique monsters to collect and upgrade, Summoners War offers a deep and engaging combat system with PvE and PvP battles.",
//     developer: "Com2uS",
//     genres: ["RPG", "Turn-Based", "Strategy", "Fantasy"],
//   },
// ];
