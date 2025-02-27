const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // ✅ Correct Import

require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB(); // ✅ Call the function

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/games", require("./routes/gamesRoutes"));

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
