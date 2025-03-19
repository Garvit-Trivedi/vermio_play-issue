// GameDetails.jsx
import { useState, useEffect } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import Buttons from "../components/Buttons";
import Reviews from "../components/rewiews";
import { rateGame, fetchGameDetails } from "../services/api";
import { toast } from "react-toastify";

const GameDetails = ({ gameDetails, hasLiked, handleLike, loading, setGameDetails, authToken, userId }) => {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);

  // Set initial user rating from gameDetails
  useEffect(() => {
    const initialRating = gameDetails.rating.find((r) => r.userId.toString() === userId?.toString())?.rating || 0;
    setUserRating(initialRating);
  }, [gameDetails, userId]);

  const handleRating = async (newRating) => {
    if (!authToken) {
      toast.error("Please sign in to rate this game.");
      return;
    }
    if (ratingLoading) return;
    try {
      setRatingLoading(true);
      await rateGame(gameDetails._id, newRating);
      setUserRating(newRating);
      const updatedGame = await fetchGameDetails(gameDetails._id);
      setGameDetails(updatedGame);
      toast.success("Rating submitted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to submit rating");
    } finally {
      setRatingLoading(false);
    }
  };

  const calculateRatingDist = () => {
    const ratings = gameDetails?.rating || [];
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach((r) => {
      dist[r.rating] = (dist[r.rating] || 0) + 1;
    });
    const total = ratings.length;
    const average = total ? (ratings.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : 0;
    return { dist, total, average };
  };

  const { dist, total, average } = calculateRatingDist();

  return (
    <>
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between rounded-lg mt-6 sm:mt-10 w-full max-w-5xl gap-4 sm:gap-6">
        <img
          src={gameDetails.profilePic || "/placeholder.svg"}
          alt={gameDetails.name}
          className="w-32 sm:w-40 md:w-60 lg:w-72 rounded-lg object-contain shadow-lg"
        />
        <div className="text-white text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">{gameDetails.name}</h1>
          <p className="mt-2 text-xs sm:text-sm md:text-lg max-w-xl">{gameDetails.description}</p>
          <div className="mt-4 flex gap-2 sm:gap-4 justify-center sm:justify-start items-center">
            <Buttons type="play" gameId={gameDetails._id} />
            <Buttons type="library" gameId={gameDetails._id} />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-4 sm:mt-6 w-full max-w-5xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2 sm:gap-4">
          <h2 className="text-white text-lg sm:text-2xl font-semibold whitespace-nowrap">Popular Titles</h2>
          {/* Rating Section */}
          <div className="rating-section bg-gray-800 p-3 rounded-lg w-full sm:w-80">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Your Rating:</h3>
              <div className="star-rating flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= (hoverRating || userRating) ? 'filled' : ''}`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRating(star)}
                    style={{ cursor: ratingLoading ? 'not-allowed' : 'pointer' }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="average-rating flex items-center mb-2">
              <span className="text-lg font-bold mr-1">{average || 0}</span>
              <div className="star-rating flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`star ${star <= Math.round(average) ? 'filled' : ''}`}>
                    ★
                  </span>
                ))}
              </div>
              <span className="ml-1 text-xs">({total})</span>
            </div>
            <div className="rating-distribution">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = dist[star] || 0;
                const percentage = total ? (count / total) * 100 : 0;
                return (
                  <div key={star} className="rating-bar flex items-center mb-1">
                    <span className="rating-label w-6 text-right mr-1 text-xs">{star}★</span>
                    <div className="bar-container flex-1 bg-gray-600 h-2 rounded">
                      <div
                        className={`bar-fill h-2 rounded ${
                          star >= 4 ? 'bg-green-500' : star === 3 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="rating-count w-8 text-left ml-1 text-xs">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
          {gameDetails.titles?.map((title, index) => (
            <span key={index} className="bg-gray-800 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm text-white">
              {title}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-4 sm:mt-6 w-full max-w-5xl">
        <h2 className="text-white text-lg sm:text-2xl font-bold">About the Game</h2>
        <p className="text-white text-xs sm:text-sm mt-1">{gameDetails.about}</p>
      </div>

      <div className="relative z-10 mt-4 sm:mt-6 w-full max-w-5xl">
        <h2 className="text-white text-lg sm:text-2xl font-bold">Game Reviews</h2>
        <Reviews reviews={gameDetails.reviews} />
      </div>

      <div className="relative z-10 mt-6 sm:mt-8 w-full max-w-5xl bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-4 sm:p-6 rounded-xl border border-gray-700 backdrop-blur-sm shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-lg sm:text-2xl font-bold mb-2 flex items-center gap-2">
            <span className="bg-blue-600 w-1 h-6 rounded-full"></span>
            Game Feedback
          </h2>
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <span className="text-gray-300 text-sm font-medium">{gameDetails.likes.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <span className="text-gray-300 text-sm font-medium">{gameDetails.comments.length}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm sm:text-base font-medium transition-all ${
              hasLiked
                ? "bg-gray-700 text-white hover:bg-gray-600 shadow-md shadow-gray-500/20"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {hasLiked ? (
              <AiFillLike className="w-5 h-5 text-white" />
            ) : (
              <AiOutlineLike className="w-5 h-5 text-gray-300" />
            )}
            {hasLiked ? "Liked" : "Like"} {gameDetails.likes.length > 0 ? gameDetails.likes.length : ""}
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => document.getElementById("commentInput").focus()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm sm:text-base font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600 transition-all"
            >
              <svg
                className="w-5 h-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Comment
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm sm:text-base font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600 transition-all">
              <svg
                className="w-5 h-5 text-green-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
/* home.css */
const styles = `
  .rating-section {
    padding: 12px; /* Reduced from 16px for compactness */
    background-color: #2d3748; /* Slightly darker gray for contrast */
    border-radius: 8px;
  }
  .star-rating .star {
    font-size: 14px; /* Slightly smaller stars */
    color: #ccc;
    transition: color 0.2s;
    padding: 0 1px;
  }
  .star-rating .star.filled {
    color: #ffd700;
  }
  .rating-distribution {
    width: 100%; /* Full width within container, no max-width */
  }
  .rating-bar {
    display: flex;
    align-items: center;
    margin-bottom: 4px; /* Reduced from 6px */
  }
  .rating-label {
    width: 24px; /* Reduced from 32px */
    text-align: right;
    font-size: 12px; /* Smaller text */
    color: #fff;
  }
  .bar-container {
    flex: 1;
    background: #4a5568; /* Slightly lighter gray for contrast */
    height: 6px; /* Reduced from 8px */
    border-radius: 3px;
    overflow: hidden;
  }
  .bar-fill {
    height: 100%;
    transition: width 0.3s ease-in-out;
  }
  .rating-count {
    width: 32px; /* Reduced from 40px */
    text-align: left;
    font-size: 12px; /* Smaller text */
    color: #fff;
  }
  .bg-green-500 {
    background-color: #22c55e; /* Tailwind's green-500 */
  }
  .bg-yellow-500 {
    background-color: #eab308; /* Tailwind's yellow-500 */
  }
  .bg-red-500 {
    background-color: #ef4444; /* Tailwind's red-500 */
  }
`;
export default GameDetails;