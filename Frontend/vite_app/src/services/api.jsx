// const BASE_URL = "https://vermio-play.onrender.com/api";

// // Fetch all games
// export const fetchGames = async () => {
//   try {
//     const res = await fetch(`${BASE_URL}/games/games`);
//     if (!res.ok) throw new Error("Failed to fetch games");
//     return await res.json();
//   } catch (error) {
//     console.error(error); // Log error
//     return []; // Return empty array in case of error
//   }
// };

// export const searchGames = async (query) => {
//   try {
//     const res = await fetch(`${BASE_URL}/games/games/search?q=${query}`);
//     if (!res.ok) throw new Error("Failed to search games");
//     return await res.json();
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// };


// // Fetch library data
// export const fetchLibrary = async () => {
//   try {
//     const res = await fetch(`${BASE_URL}/games/library`);
//     if (!res.ok) throw new Error("Failed to fetch library");
//     return await res.json();
//   } catch (error) {
//     console.error(error); // Log error
//     return []; // Return empty array in case of error
//   }
// };

// export const addToLibrary = async (gameId) => {
//   try {
//     const res = await fetch(`${BASE_URL}/games/library`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ gameId: Number(gameId) }), // Ensure the gameId is a number
//     });

//     if (!res.ok) throw new Error("Failed to add game to library");
//     console.log("Game added to library successfully");
//   } catch (error) {
//     console.error("Error adding to library:", error);
//     throw error; // Propagate the error so it can be handled by the calling code
//   }
// };


// // Remove game from the library
// export const removeFromLibrary = async (gameId) => {
//   try {
//     const res = await fetch(`${BASE_URL}/games/library/${gameId}`, {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//     });

//     if (!res.ok) throw new Error("Failed to remove game from library");
//     console.log("Game removed from library successfully");
//   } catch (error) {
//     console.error(error);
//     throw error; // Propagate the error
//   }
// };

// // Fetch details of a specific game
// export const fetchGameDetails = async (gameId) => {
//   try {
//     const res = await fetch(`${BASE_URL}/games/games/${gameId}`);
//     if (!res.ok) throw new Error("Failed to fetch game details");
//     return await res.json();
//   } catch (error) {
//     console.error(error);
//     return null; // Return null in case of error
//   }
// };

// // Fetch games by category
// export const fetchGamesByCategory = async (category) => {
//   try {
//     const res = await fetch(`${BASE_URL}/games/games/search?q=${category}`);
//     if (!res.ok) throw new Error(`Failed to fetch games for category: ${category}`);
//     return await res.json();
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// };


const BASE_URL = "https://vermio-play.onrender.com/api";

// Fetch all games
export const fetchGames = async () => {
  try {
    const res = await fetch(`${BASE_URL}/games/games`);
    if (!res.ok) throw new Error("Failed to fetch games");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const searchGames = async (query) => {
  try {
    const res = await fetch(`${BASE_URL}/games/games/search?q=${query}`);
    if (!res.ok) throw new Error("Failed to search games");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// ======== AUTHENTICATION =========

// Sign-Up API
export const signUp = async (userData) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!res.ok) throw new Error("Sign-Up failed");
    return await res.json();
  } catch (error) {
    console.error("Sign-Up Error:", error);
    throw error;
  }
};

// Sign-In API
export const signIn = async (credentials) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    if (response.ok && data.token) {
      localStorage.setItem("authToken", data.token); // Store token
      window.location.reload(); // Reload to update state
    } else {
      toast.error(data.message || "Sign-in failed");
    }
  } catch (error) {
    console.error("Sign-In Error:", error);
    throw error;
  }
};

// ======== USER LIBRARY (WITH TOKEN) =========

// Fetch user library (Requires authentication)
export const fetchLibrary = async (token) => {
  if (!token) return [];

  const response = await fetch("https://vermio-play.onrender.com/api/library", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.ok ? response.json() : [];
};

export const addToLibrary = async (gameId, token) => {
  return fetch("https://vermio-play.onrender.com/api/library", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ gameId }),
  });
};

export const removeFromLibrary = async (gameId, token) => {
  return fetch(`https://vermio-play.onrender.com/api/library/${gameId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// Delete User Account (Requires authentication)
export const deleteUserAccount = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/auth/delete`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to delete account");

    localStorage.removeItem("token"); // Remove token on account deletion
    console.log("Account deleted successfully");
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};

// ======== GAME DETAILS =========

// Fetch details of a specific game
export const fetchGameDetails = async (gameId) => {
  try {
    const res = await fetch(`${BASE_URL}/games/games/${gameId}`);
    if (!res.ok) throw new Error("Failed to fetch game details");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Fetch games by category
export const fetchGamesByCategory = async (category) => {
  try {
    const res = await fetch(`${BASE_URL}/games/games/search?q=${category}`);
    if (!res.ok) throw new Error(`Failed to fetch games for category: ${category}`);
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
