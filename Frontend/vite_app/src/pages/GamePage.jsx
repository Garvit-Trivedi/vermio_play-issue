// GamePage.jsx
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchGameDetails, fetchGames, likeGame, rateGame } from "../services/api";
import { useComments } from "../hooks/useComments";
import GameLoader from "../components/GameLoader";
import GameCard from "../components/GameCard";
import { toast } from "react-toastify";
import { AuthContext } from "../AuthContext";
import GameDetails from "../components/GameDetails";
import CommentsSection from "../components/CommentsSection";
import "./home.css";

function GamePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { library, authToken, userId, displayName } = useContext(AuthContext);
  const [gameDetails, setGameDetails] = useState(null);
  const [moreGames, setMoreGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const {
    newComment,
    setNewComment,
    replyingTo,
    setReplyingTo,
    newReply,
    setNewReply,
    loading: commentLoading,
    handleCommentSubmit,
    handleReplySubmit,
    handleCommentLike,
    handleCommentDelete,
    handleReplyLike,
    handleReplyDelete,
  } = useComments(id, authToken, userId, displayName, setGameDetails);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [gameData, allGames] = await Promise.all([fetchGameDetails(id), fetchGames()]);
      setGameDetails(gameData);
      const userRating = gameData.rating.find((r) => r.userId.toString() === userId?.toString())?.rating || 0;
      setUserRating(userRating);
      const shuffledGames = allGames
        .filter((game) => game._id !== id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);
      setMoreGames(shuffledGames);
      setError(null);
    } catch (error) {
      setError(error.message || "Failed to load game data");
      toast.error(error.message || "Failed to load game data");
    } finally {
      setLoading(false);
    }
  };

  const hasLiked = gameDetails?.likes?.some((id) => id.toString() === (userId?.toString() || "")) || false;

  const handleLike = async () => {
    if (!authToken) {
      toast.error("Please sign in to like this game.");
      return;
    }
    try {
      setLoading(true);
      const response = await likeGame(id, authToken);
      setGameDetails((prev) => ({ ...prev, likes: response.likes }));
      toast.success(response.message);
    } catch (err) {
      toast.error(err.message || "Failed to update like");
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (newRating) => {
    if (!authToken) {
      toast.error("Please sign in to rate this game.");
      return;
    }
    if (loading) return;
    try {
      setLoading(true);
      await rateGame(id, newRating);
      setUserRating(newRating);
      const updatedGame = await fetchGameDetails(id);
      setGameDetails(updatedGame);
      toast.success("Rating submitted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to submit rating");
    } finally {
      setLoading(false);
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

  if (loading && !gameDetails) return <GameLoader />;
  if (error) return <div className="text-red-500 text-center p-6 sm:p-10">{error}</div>;
  if (!gameDetails) return <div className="text-white text-center p-6 sm:p-10">Game not found</div>;

  return (
    <div className="relative min-h-screen flex flex-col items-center px-2 sm:px-4 lg:px-8 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${gameDetails.bgPic})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/15 to-gray-900/1"></div>

      <GameDetails gameDetails={gameDetails} hasLiked={hasLiked} handleLike={handleLike} loading={loading} />

      {/* Rating Section */}
      <div className="relative z-10 mt-8 w-full max-w-6xl">
        <h2 className="text-white text-lg sm:text-2xl font-bold mb-4">Ratings</h2>
        <div className="rating-section bg-gray-800 p-4 rounded-lg">
          {/* User Rating Input */}
          <div className="user-rating mb-4">
            <h3 className="text-sm font-semibold mb-2">Your Rating:</h3>
            <div className="star-rating flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= (hoverRating || userRating) ? 'filled' : ''}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleRating(star)}
                  style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  ★
                </span>
              ))}
            </div>
            {userRating > 0 && (
              <p className="text-sm mt-1">You rated: {userRating} star{userRating !== 1 ? 's' : ''}</p>
            )}
          </div>

          {/* Rating Summary and Graph (Shown only after user rates) */}
          {userRating > 0 && (
            <div className="rating-summary">
              <div className="average-rating flex items-center mb-4">
                <span className="text-xl font-bold mr-2">{average || 0}</span>
                <div className="star-rating flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= Math.round(average) ? 'filled' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-sm">({total} ratings)</span>
              </div>

              {/* Rating Distribution Graph */}
              <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = dist[star] || 0;
                  const percentage = total ? (count / total) * 100 : 0;
                  return (
                    <div key={star} className="rating-bar flex items-center mb-2">
                      <span className="rating-label w-8 text-right mr-2">{star}★</span>
                      <div className="bar-container flex-1 bg-gray-600 h-4 rounded">
                        <div
                          className={`bar-fill h-4 rounded ${
                            star >= 4 ? 'bg-green-500' : star === 3 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="rating-count w-12 text-left ml-2">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <CommentsSection
        gameDetails={gameDetails}
        authToken={authToken}
        userId={userId}
        displayName={displayName}
        newComment={newComment}
        setNewComment={setNewComment}
        replyingTo={replyingTo}
        setReplyingTo={setReplyingTo}
        newReply={newReply}
        setNewReply={setNewReply}
        loading={commentLoading}
        handleCommentSubmit={handleCommentSubmit}
        handleReplySubmit={handleReplySubmit}
        handleCommentLike={handleCommentLike}
        handleCommentDelete={handleCommentDelete}
        handleReplyLike={handleReplyLike}
        handleReplyDelete={handleReplyDelete}
      />

      <div className="relative z-10 mt-8 sm:mt-12 w-full max-w-6xl mb-8">
        <h2 className="text-white text-lg sm:text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="bg-green-600 w-1 h-6 rounded-full"></span>
          More Games You Might Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {moreGames.map((game) => (
            <GameCard key={game._id} game={game} isInLibrary={library.has(game._id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Updated home.css
const styles = `
  .rating-section {
    margin-bottom: 20px;
  }
  .star-rating .star {
    font-size: 16px;
    color: #ccc;
    transition: color 0.2s;
    padding: 0 1px;
  }
  .star-rating .star.filled {
    color: #ffd700;
  }
  .rating-distribution {
    max-width: 400px; /* Adjusted for better alignment */
  }
  .rating-bar {
    display: flex;
    align-items: center;
    margin-bottom: 6px; /* Consistent spacing */
  }
  .rating-label {
    width: 32px; /* Fixed width for alignment */
    text-align: right;
    font-size: 14px;
    color: #fff;
  }
  .bar-container {
    flex: 1;
    background: #444;
    height: 8px; /* Smaller height */
    border-radius: 4px;
    overflow: hidden;
  }
  .bar-fill {
    height: 100%;
    transition: width 0.3s ease-in-out;
  }
  .rating-count {
    width: 40px; /* Fixed width for alignment */
    text-align: left;
    font-size: 14px;
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

export default GamePage;