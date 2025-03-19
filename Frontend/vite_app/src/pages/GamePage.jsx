// GamePage.jsx
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchGameDetails, fetchGames, likeGame } from "../services/api";
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

      <GameDetails
        gameDetails={gameDetails}
        hasLiked={hasLiked}
        handleLike={handleLike}
        loading={loading}
        setGameDetails={setGameDetails}
        authToken={authToken}
        userId={userId}
      />

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

export default GamePage;