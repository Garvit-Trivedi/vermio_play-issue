const BASE_URL = "https://vermio-play.onrender.com/api";

// Fetch all games
export const fetchGames = async () => {
  try {
    const res = await fetch(`${BASE_URL}/games`);
    if (!res.ok) throw new Error("Failed to fetch games");
    return await res.json();
  } catch (error) {
    console.error(error); // Log error
    return []; // Return empty array in case of error
  }
};

export const searchGames = async (query) => {
  try {
    const res = await fetch(`${BASE_URL}/games/search?q=${query}`);
    if (!res.ok) throw new Error("Failed to search games");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};


// Fetch library data
export const fetchLibrary = async () => {
  try {
    const res = await fetch(`${BASE_URL}/library`);
    if (!res.ok) throw new Error("Failed to fetch library");
    return await res.json();
  } catch (error) {
    console.error(error); // Log error
    return []; // Return empty array in case of error
  }
};

export const addToLibrary = async (gameId) => {
  try {
    const res = await fetch(`${BASE_URL}/library`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId: Number(gameId) }), // Ensure the gameId is a number
    });

    if (!res.ok) throw new Error("Failed to add game to library");
    console.log("Game added to library successfully");
  } catch (error) {
    console.error("Error adding to library:", error);
    throw error; // Propagate the error so it can be handled by the calling code
  }
};


// Remove game from the library
export const removeFromLibrary = async (gameId) => {
  try {
    const res = await fetch(`${BASE_URL}/library/${gameId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to remove game from library");
    console.log("Game removed from library successfully");
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error
  }
};

// Fetch details of a specific game
export const fetchGameDetails = async (gameId) => {
  try {
    const res = await fetch(`${BASE_URL}/games/${gameId}`);
    if (!res.ok) throw new Error("Failed to fetch game details");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null; // Return null in case of error
  }
};

// Fetch games by category
export const fetchGamesByCategory = async (category) => {
  try {
    const res = await fetch(`${BASE_URL}/games/search?q=${category}`);
    if (!res.ok) throw new Error(`Failed to fetch games for category: ${category}`);
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
