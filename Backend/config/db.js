// const { MongoClient } = require("mongodb");
// require("dotenv").config();

// const MONGO_URI = process.env.MONGO_URI; // Ensure this is set in .env
// console.log(MONGO_URI);
// const DB_NAME = "vermio_play";

// let db;
// let gameCollection;
// let libraryCollection;

// // Function to connect to MongoDB
// const connectDB = async () => {
//   try {
//     const client = new MongoClient(MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     await client.connect();
//     console.log("✅ Connected to MongoDB");

//     db = client.db(DB_NAME);
//     gameCollection = db.collection("games");
//     libraryCollection = db.collection("library");
//     userCollection = db.collection("users");

//     console.log("✅ Collections initialized successfully");
//   } catch (error) {
//     console.error("❌ MongoDB Connection Error:", error);
//     process.exit(1);
//   }
// };

// // Function to get database instance asynchronously
// const getDB = async () => {
//   if (!db) await connectDB();
//   return db;
// };

// // Function to get the games collection asynchronously
// const getGameCollection = async () => {
//   if (!gameCollection) await connectDB();
//   return gameCollection;
// };

// // Function to get the library collection asynchronously
// const getLibraryCollection = async () => {
//   if (!libraryCollection) await connectDB();
//   return libraryCollection;
// };

// // Function to get the user collection asynchronously
// const getUserCollection = () => {
//   const db = getDB();
//   return db.collection("users");
// };

// // Export functions
// module.exports = {
//   connectDB,
//   getDB,
//   getGameCollection,
//   getLibraryCollection,
//   getUserCollection,
// };

const { MongoClient } = require("mongodb");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI; // Ensure this is set in .env
const DB_NAME = "vermio_play";

let db;
let gameCollection;
let libraryCollection;
let userCollection; // Initialize this variable for user collection

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    const client = new MongoClient(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    console.log("✅ Connected to MongoDB");

    db = client.db(DB_NAME);
    gameCollection = db.collection("games");
    libraryCollection = db.collection("library");
    userCollection = db.collection("users");

    console.log("✅ Collections initialized successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Exit the process if the DB connection fails
  }
};

// Function to get the database instance asynchronously
const getDB = async () => {
  if (!db) await connectDB();
  return db;
};

// Function to get a specific collection asynchronously (games, library, users)
const getCollection = async (collectionName) => {
  const db = await getDB();
  return db.collection(collectionName);
};

// Export functions for getting specific collections
module.exports = {
  connectDB,
  getDB,
  getGameCollection: () => getCollection("games"),
  getLibraryCollection: () => getCollection("library"),
  getUserCollection: () => getCollection("users"),
};
