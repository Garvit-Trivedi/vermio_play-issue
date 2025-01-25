const express = require("express");
const cors = require("cors");
const mongodb = require("mongodb");

const app = express();
const PORT = 3000;

const MONGO_URI =
  "mongodb+srv://veermodicg:yiH9eP7GraAu9hs3@cluster0.34img.mongodb.net/vermio_play?retryWrites=true&w=majority";

const MongoClient = mongodb.MongoClient;

let db;

MongoClient.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    console.log("Connected to MongoDB");
    db = client.db();
  })
  .catch((error) => console.error("Failed to connect to MongoDB:", error));

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is working!");
});

app.get("/api/games", async (req, res) => {
  try {
    const gamesCollection = db.collection("games");
    const games = await gamesCollection
      .find(
        {},
        { projection: { name: 1, "reviews.type": 1, "reviews.url": 1 } }
      )
      .limit(10)
      .toArray();

    if (games.length === 0) {
      return res
        .status(404)
        .json({ message: "No games found in the database." });
    }

    const transformedGames = games.map((game) => {
      const firstImage =
        game.reviews.find((review) => review.type === "image")?.url || null;
      const firstVideo =
        game.reviews.find((review) => review.type === "video")?.url || null;

      return {
        name: game.name,
        firstImage,
        firstVideo,
      };
    });

    res.status(200).json(transformedGames);
  } catch (error) {
    console.error("Error fetching games:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch games. Please try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
