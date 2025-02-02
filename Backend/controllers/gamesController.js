const { getGameCollection, getLibraryCollection } = require("../config/db");

// 📌 **GET all games (limit 10)**
const getAllGames = async (req, res) => {
  try {
    const gamesCollection = await getGameCollection(); // 💡 Await the collection
    const games = await gamesCollection
      .find({}, { projection: { _id: 1, name: 1, reviews: 1 } })
      .limit(10)
      .toArray();

    const transformedGames = games.map((game) => ({
      _id: game._id,
      name: game.name,
      firstImage: game.reviews?.find((r) => r.type === "image")?.url || null,
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
      .find(query, { projection: { _id: 1, name: 1, reviews: 1 } })
      .toArray();

    if (games.length === 0) {
      return res.status(404).json({ message: "No games found." });
    }

    const transformedGames = games.map((game) => ({
      _id: game._id,
      name: game.name,
      firstImage: game.reviews?.find((r) => r.type === "image")?.url || null,
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
