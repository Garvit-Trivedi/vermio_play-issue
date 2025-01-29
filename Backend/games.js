const express = require("express");
const cors = require("cors");
const mongodb = require("mongodb");

const app = express();
const PORT = 3000;
const MONGO_URI =
  "mongodb+srv://veermodicg:yiH9eP7GraAu9hs3@cluster0.34img.mongodb.net/vermio_play?retryWrites=true&w=majority";

const MongoClient = mongodb.MongoClient;

let db, gamesCollection, libraryCollection;

// Connect to MongoDB
MongoClient.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    console.log("✅ Connected to MongoDB");
    db = client.db("vermio_play");
    gamesCollection = db.collection("games"); // ✅ Global collection reference
    libraryCollection = db.collection("library"); // ✅ Global collection reference
  })
  .catch((error) => console.error("❌ Failed to connect to MongoDB:", error));

// Middleware
app.use(cors());
app.use(express.json()); // ✅ Middleware to parse JSON bodies

// Middleware to check DB connection
app.use((req, res, next) => {
  if (!gamesCollection) {
    return res.status(500).json({ error: "Database not connected yet" });
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Server is working!");
});

// 📌 **GET all games (homepage)**
app.get("/api/games", async (req, res) => {
  try {
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
});

// 📌 **GET search games by name, genre, titles, developer**
app.get("/api/games/search", async (req, res) => {
  try {
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
});

// 📌 **GET game details by ID (supports number-based `_id`)**
app.get("/api/games/:id", async (req, res) => {
  try {
    const gameId = parseInt(req.params.id); // ✅ Convert ID to number
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
});

app.post("/api/library", async (req, res) => {
  try {
    const gameId = parseInt(req.body.gameId); // ✅ Ensure gameId is a number

    if (!gameId) {
      return res.status(400).json({ error: "Game ID is required." });
    }

    // Check if game is already in the library
    const existingGame = await libraryCollection.findOne({ _id: gameId });
    if (existingGame) {
      return res.status(400).json({ error: "Game is already in the library." });
    }

    // Fetch game details from games collection
    const game = await gamesCollection.findOne({ _id: gameId });
    if (!game) {
      return res
        .status(404)
        .json({ error: "Game not found in games collection." });
    }

    // Insert game into the library
    await libraryCollection.insertOne(game);

    res.status(201).json({ message: "Game added to library.", game });
  } catch (error) {
    console.error("Error adding game to library:", error);
    res.status(500).json({ error: "Failed to add game. Please try again." });
  }
});

app.get("/api/library", async (req, res) => {
  try {
    const savedGames = await libraryCollection.find().toArray();
    res.status(200).json(savedGames);
  } catch (error) {
    console.error("Error fetching library games:", error);
    res.status(500).json({ error: "Failed to fetch library games." });
  }
});

app.delete("/api/library/:id", async (req, res) => {
  try {
    const gameId = parseInt(req.params.id); // ✅ Convert gameId to number

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
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
