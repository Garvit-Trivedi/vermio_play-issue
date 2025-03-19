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
    if (gameDetails?.rating && userId) {
      const userRatingData = gameDetails.rating.find((r) => r.userId.toString() === userId?.toString());
      const initialRating = userRatingData ? userRatingData.rating : 0;
      setUserRating(initialRating);
      console.log("Initial userRating set to:", initialRating);
      console.log("gameDetails.rating:", gameDetails.rating);
      console.log("userId:", userId);
    }
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
      console.log("User rating updated to:", newRating);
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
    const average = total ? (ratings.reduce((sum, r) => sum + r.rating, 0) / total) : 0;
    let reviewSummary = "No Reviews";
    if (total > 0) {
      if (average >= 4.5) reviewSummary = "Overwhelmingly Positive";
      else if (average >= 4) reviewSummary = "Very Positive";
      else if (average >= 3) reviewSummary = "Mostly Positive";
      else if (average >= 2) reviewSummary = "Mixed";
      else reviewSummary = "Mostly Negative";
    }
    console.log("Average rating calculated:", average);
    console.log("Total ratings:", total);
    return { dist, total, average: average.toFixed(1), reviewSummary };
  };

  const { dist, total, average, reviewSummary } = calculateRatingDist();

  return (
    <>
      {/* Game Header Section */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between rounded-lg mt-6 sm:mt-10 w-full max-w-5xl mx-auto gap-4 sm:gap-6">
        <img
          src={gameDetails.profilePic || "/placeholder.svg"}
          alt={gameDetails.name}
          className="w-32 sm:w-40 md:w-60 lg:w-72 rounded-lg object-contain shadow-lg"
        />
        <div className="text-white text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">{gameDetails.name}</h1>
          <p className="mt-2 text-xs sm:text-sm md:text-base max-w-xl">{gameDetails.description}</p>
          <div className="mt-4 flex gap-2 sm:gap-4 justify-center sm:justify-start items-center">
            <Buttons type="play" gameId={gameDetails._id} />
            <Buttons type="library" gameId={gameDetails._id} />
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm sm:text-base font-medium transition-colors ${hasLiked
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
          </div>
        </div>
      </div>

      {/* Grid Container for Tags, About, and Ratings */}
      <div className="relative z-10 mt-6 sm:mt-8 w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-6">
        {/* Left Column: Tags and About This Game */}
        <div className="space-y-6">
          {/* Tags Section */}
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-4 rounded-xl border border-gray-700 backdrop-blur-sm shadow-lg">
            <h3 className="text-white text-lg font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {gameDetails.titles?.map((title, index) => (
                <span key={index} className="bg-gray-800 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm text-white">
                  {title}
                </span>
              ))}
            </div>
          </div>

          {/* About This Game Section */}
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-4 rounded-xl border border-gray-700 backdrop-blur-sm shadow-lg">
            <h2 className="text-white text-lg sm:text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="bg-yellow-500 w-1 h-6 rounded-full"></span>
              About This Game
            </h2>
            <p className="text-white text-xs sm:text-sm break-words">{gameDetails.about}</p>
          </div>
        </div>

        {/* Right Column: Ratings */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-4 rounded-xl border border-gray-700 backdrop-blur-sm shadow-lg">
          <h3 className="text-white text-lg font-semibold mb-2">Ratings</h3>
          <div className="flex items-center mb-2">
            <span className="text-lg font-bold text-white mr-1">{average || 0}</span>
            <div className="star-rating flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className="star text-2xl"
                  style={{ color: star <= parseFloat(average) ? "#facc15" : "#9ca3af" }}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="ml-1 text-sm text-gray-300">({total})</span>
          </div>
          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = dist[star] || 0;
              const percentage = total ? (count / total) * 100 : 0;
              return (
                <div key={star} className="rating-bar flex items-center mb-1">
                  <span className="rating-label w-6 text-right mr-1 text-xs text-white">{star}★</span>
                  <div className="bar-container flex-1 bg-gray-600 h-2 rounded">
                    <div
                      className={`bar-fill h-2 rounded ${star >= 4 ? "bg-green-500" : star === 3 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="rating-count w-8 text-left ml-1 text-xs text-white">{count}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-white mb-2">Your Rating:</h4>
            <div className="star-rating flex justify-around w-full">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className="star text-3xl"
                  style={{
                    color: star <= (hoverRating || userRating) ? "#facc15" : "#9ca3af",
                    cursor: ratingLoading ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={() => {
                    setHoverRating(star);
                    console.log("Hover rating set to:", star);
                  }}
                  onMouseLeave={() => {
                    setHoverRating(0);
                    console.log("Hover rating reset to 0");
                  }}
                  onClick={() => {
                    handleRating(star);
                    console.log("Clicked star:", star);
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Game Reviews Section (Below the Grid) */}
      <div className="relative z-10 mt-6 sm:mt-8 w-full max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-4 sm:p-6 rounded-xl border border-gray-700 backdrop-blur-sm shadow-lg">
          <h2 className="text-white text-lg sm:text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="bg-yellow-500 w-1 h-6 rounded-full"></span>
            Game Reviews
          </h2>
          <Reviews reviews={gameDetails.reviews} />
        </div>
      </div>
    </>
  );
};

export default GameDetails;