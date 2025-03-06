const BASE_URL = "https://vermio-play.onrender.com/api";
// const BASE_URL = "http://localhost:3000/api";


const getToken = () => localStorage.getItem("authToken");

const apiRequest = async (method, url, data = null) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` })
  };

  const response = await fetch(`${BASE_URL}${url}`, {
    method,
    headers,
    ...(data && { body: JSON.stringify(data) })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Failed to ${method} ${url}`);
  }

  return response.json();
};

export const fetchGames = () => apiRequest('GET', '/games');
export const searchGames = (query) => apiRequest('GET', `/games?q=${query}`);
export const fetchGameDetails = (gameId) => apiRequest('GET', `/games/${gameId}`);
export const fetchGamesByCategory = (category) => apiRequest('GET', `/games?q=${category}`);
export const likeGame = (gameId) => apiRequest('POST', `/games/${gameId}/like`);
export const addComment = (gameId, commentText) => apiRequest('POST', `/games/${gameId}/comments`, { commentText });
export const likeComment = (gameId, commentId) => apiRequest('POST', `/games/${gameId}/comments/${commentId}/like`);
export const replyToComment = (gameId, commentId, commentText) =>
  apiRequest('POST', `/games/${gameId}/comments/${commentId}/reply`, { commentText });

export const signUp = async (userData) => {
  const data = await apiRequest('POST', '/auth/signup', userData);
  if (data.token) localStorage.setItem("authToken", data.token);
  return data;
};

export const signIn = async (credentials) => {
  const data = await apiRequest('POST', '/auth/signin', credentials);
  if (data.token) localStorage.setItem("authToken", data.token);
  return data;
};

export const fetchLibrary = () => apiRequest('GET', '/users/library/me');
export const addToLibrary = (gameId) => apiRequest('POST', '/users/library/add', { gameId });
export const removeFromLibrary = (gameId) => apiRequest('POST', '/users/library/remove', { gameId });

export const searchUsers = (query = '', limit = 15) => apiRequest('GET', `/users/query?q=${query}&limit=${limit}`);
export const sendFriendRequest = (userId) => apiRequest('POST', '/users/friend/request', { userId });
export const acceptFriendRequest = (userId) => apiRequest('POST', '/users/friend/accept', { userId });
export const declineFriendRequest = (userId) => apiRequest('POST', '/users/friend/decline', { userId });
export const getFriendList = () => apiRequest('GET', '/users/friends/me');
export const removeFriend = (friendId) => apiRequest('POST', '/users/friend/remove', { friendId });