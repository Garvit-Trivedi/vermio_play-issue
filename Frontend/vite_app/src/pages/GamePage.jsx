import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchGameDetails, fetchGames, likeGame, addComment, replyToComment } from "../services/api";
import Reviews from "../components/rewiews"; // Fixed the typo
import GameCard from "../components/GameCard";
import GameLoader from "../components/GameLoader";
import Buttons from "../components/Buttons";
import { toast } from "react-toastify";
import { AuthContext } from "../AuthContext";
import { AiOutlineLike, AiFillLike } from "react-icons/ai"; // Added react-icons
import "./home.css";

function GamePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { library, authToken, userId, displayName } = useContext(AuthContext);
  const [gameDetails, setGameDetails] = useState(null);
  const [moreGames, setMoreGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [error, setError] = useState(null);
  const [commentSort, setCommentSort] = useState("top");
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const loadData = async () => {
      setLoading(true);
      try {
        const [gameData, allGames] = await Promise.all([fetchGameDetails(id), fetchGames()]);
        setGameDetails(gameData);
        const shuffledGames = allGames
          .filter((game) => game._id !== Number(id))
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

    loadData();
  }, [id]);

  // Check if user has liked the game
  const hasLiked = gameDetails?.likes?.includes(userId) || false;

  // Handle liking/unliking the game
  const handleLike = async () => {
    if (!authToken) {
      toast.error("Please sign in to like this game.");
      return;
    }

    try {
      setLoading(true);
      await likeGame(id);
      setGameDetails((prev) => ({
        ...prev,
        likes: hasLiked ? prev.likes.filter((likeId) => likeId !== userId) : [...prev.likes, userId],
      }));
      toast.success(hasLiked ? "Like removed!" : "Game liked!");
    } catch (err) {
      toast.error("Failed to update like. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!authToken) {
      toast.error("Please sign in to add a comment.");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    const commentData = {
      userId,
      displayName,
      commentText: newComment,
      time: new Date().toISOString(),
      likes: [],
      replies: [],
      commentId: `comment_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };

    try {
      setLoading(true);
      // Optimistically update UI
      setGameDetails((prev) => ({
        ...prev,
        comments: [...prev.comments, commentData],
      }));

      // Call API with full commentData
      await addComment(id, commentData);

      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (err) {
      // Rollback on failure
      setGameDetails((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c.commentId !== commentData.commentId),
      }));
      toast.error("Failed to add comment: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a reply
  const handleReplySubmit = async (e, parentCommentId) => {
    e.preventDefault();
    if (!authToken) {
      toast.error("Please sign in to reply.");
      return;
    }

    if (!newReply.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const replyData = {
        userId,
        displayName,
        commentText: newReply,
        time: new Date().toISOString(),
        likes: [],
        replyId: `reply_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      };

      await replyToComment(id, parentCommentId, newReply);

      setGameDetails((prev) => {
        const updatedComments = prev.comments.map((comment) =>
          comment.commentId === parentCommentId
            ? { ...comment, replies: [...comment.replies, replyData] }
            : comment
        );
        return { ...prev, comments: updatedComments };
      });

      setReplyingTo(null);
      setNewReply("");
      toast.success("Reply added successfully!");
    } catch (err) {
      toast.error("Failed to add reply. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Like a comment
  const handleCommentLike = async (commentId) => {
    if (!authToken) {
      toast.error("Please sign in to like comments.");
      return;
    }

    try {
      // You'll need to implement this API endpoint
      // await likeComment(id, commentId);

      // Optimistic update
      setGameDetails((prev) => {
        const updatedComments = prev.comments.map((comment) => {
          if (comment.commentId === commentId) {
            const hasLikedComment = comment.likes.includes(userId);
            return {
              ...comment,
              likes: hasLikedComment
                ? comment.likes.filter((id) => id !== userId)
                : [...comment.likes, userId],
            };
          }
          return comment;
        });
        return { ...prev, comments: updatedComments };
      });
    } catch (err) {
      toast.error("Failed to like comment. Please try again.");
    }
  };

  // Sort comments
  const sortedComments = () => {
    if (!gameDetails?.comments) return [];

    const comments = [...gameDetails.comments];

    if (commentSort === "top") {
      return comments.sort((a, b) => b.likes.length - a.likes.length);
    } else if (commentSort === "newest") {
      return comments.sort((a, b) => new Date(b.time) - new Date(a.time));
    }
    return comments;
  };

  // Get displayed comments (all or limited)
  const displayedComments = () => {
    const sorted = sortedComments();
    return showAllComments ? sorted : sorted.slice(0, 3);
  };

  // Format time since post
  const formatTimeSince = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && !gameDetails) return <GameLoader />;
  if (error) return <div className="text-red-500 text-center p-6 sm:p-10">{error}</div>;
  if (!gameDetails) return <div className="text-white text-center p-6 sm:p-10">Game not found</div>;

  return (
    <div className="relative min-h-screen flex flex-col items-center px-2 sm:px-4 lg:px-8 text-white">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${gameDetails.bgPic})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/15 to-gray-900/1"></div>

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
        <h2 className="text-white text-lg sm:text-2xl font-semibold">Popular Titles</h2>
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

      {/* Enhanced Likes Section */}
      <div className="relative z-10 mt-6 sm:mt-8 w-full max-w-5xl bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-4 sm:p-6 rounded-xl border border-gray-700 backdrop-blur-sm shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-lg sm:text-2xl font-bold mb-2 flex items-center gap-2">
            <span className="bg-blue-600 w-1 h-6 rounded-full"></span>
            Game Feedback
          </h2>
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                <svg
                  className="w-2.5 h-2.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <span className="text-gray-300 text-sm font-medium">{gameDetails.likes.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                <svg
                  className="w-2.5 h-2.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
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
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm sm:text-base font-medium transition-all ${hasLiked
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md shadow-blue-700/20"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {hasLiked ? (
              <AiFillLike className="w-5 h-5 text-white" />
            ) : (
              <AiOutlineLike className="w-5 h-5 text-blue-400" />
            )}
            {hasLiked ? "Liked" : "Like"}
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

      {/* Enhanced Comments Section */}
      <div className="relative z-10 mt-6 sm:mt-8 w-full max-w-5xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-4 sm:p-6 rounded-xl border border-gray-700 backdrop-blur-sm shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-lg sm:text-2xl font-bold flex items-center gap-2">
            <span className="bg-purple-600 w-1 h-6 rounded-full"></span>
            Comments <span className="text-gray-400 text-base">({gameDetails.comments.length})</span>
          </h2>
          <select
            className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={commentSort}
            onChange={(e) => setCommentSort(e.target.value)}
          >
            <option value="top">Top Comments</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        {/* Add Comment Form */}
        <div className="mb-6 bg-gray-800/60 p-4 rounded-xl border border-gray-700">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold"
              style={{
                backgroundImage: authToken
                  ? `url(https://api.dicebear.com/7.x/pixel-art/svg?seed=${userId})`
                  : "",
                backgroundSize: "cover",
              }}
            >
              {authToken ? displayName?.charAt(0)?.toUpperCase() || "U" : "G"}
            </div>
            <div className="flex-1">
              <form onSubmit={handleCommentSubmit} className="w-full">
                <div className="relative">
                  <input
                    id="commentInput"
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={authToken ? "Add a comment..." : "Sign in to comment"}
                    className="w-full bg-gray-700/80 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600 pr-12"
                    disabled={!authToken || loading}
                  />
                  {authToken && (
                    <button
                      type="submit"
                      disabled={loading || !newComment.trim()}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        ></path>
                      </svg>
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {displayedComments().length > 0 ? (
            displayedComments().map((comment) => (
              <div key={comment.commentId} className="mb-6 animate-fadeIn">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold"
                    style={{
                      backgroundImage: `url(https://api.dicebear.com/7.x/pixel-art/svg?seed=${comment.userId})`,
                      backgroundSize: "cover",
                    }}
                  >
                    {comment.displayName?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-800/80 p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-blue-300">{comment.displayName}</span>
                        <span className="text-xs text-gray-400">{formatTimeSince(comment.time)}</span>
                        {comment.pinned && (
                          <span className="bg-blue-600/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">
                            Pinned
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-white">{comment.commentText}</p>
                      <div className="flex items-center mt-3 text-sm">
                        <button
                          onClick={() => handleCommentLike(comment.commentId)}
                          className={`flex items-center gap-1 mr-4 ${comment.likes.includes(userId)
                              ? "text-blue-400"
                              : "text-gray-400 hover:text-gray-300"
                            }`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill={comment.likes.includes(userId) ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14 10h-.13c.11-.31.13-.65.13-1 0-1.66-1.34-3-3-3-1.54 0-2.81 1.16-2.98 2.65L8 14H4c-1.11 0-2 .89-2 2v4c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2v-4c0-1.11-.89-2-2-2h-8l1.1-2.98c.01-.39-.15-.78-.44-1.02-.5-.4-1.21-.3-1.66.2l-5 5"
                            />
                          </svg>
                          <span>{comment.likes.length > 0 ? comment.likes.length : ""}</span>
                        </button>

                        {authToken && (
                          <button
                            onClick={() => {
                              setReplyingTo(replyingTo === comment.commentId ? null : comment.commentId);
                              setNewReply("");
                            }}
                            className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                              ></path>
                            </svg>
                            Reply
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Reply Form */}
                    {replyingTo === comment.commentId && (
                      <div className="mt-3 pl-4 border-l-2 border-purple-600/30 animate-fadeIn">
                        <form onSubmit={(e) => handleReplySubmit(e, comment.commentId)}>
                          <div className="relative">
                            <input
                              type="text"
                              value={newReply}
                              onChange={(e) => setNewReply(e.target.value)}
                              placeholder="Write a reply..."
                              className="w-full bg-gray-800/80 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 border border-gray-700 text-sm pr-16"
                              autoFocus
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                              <button
                                type="button"
                                onClick={() => setReplyingTo(null)}
                                className="text-gray-400 hover:text-gray-300"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  ></path>
                                </svg>
                              </button>
                              <button
                                type="submit"
                                disabled={loading || !newReply.trim()}
                                className="text-purple-400 hover:text-purple-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                  ></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                </div>

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="ml-12 mt-2 space-y-2">
                    {comment.replies.map((reply, index) => (
                      <div key={reply.replyId || index} className="flex items-start gap-2 animate-fadeIn">
                        <div
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xs"
                          style={{
                            backgroundImage: `url(https://api.dicebear.com/7.x/pixel-art/svg?seed=${reply.userId})`,
                            backgroundSize: "cover",
                          }}
                        >
                          {reply.displayName?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="flex-1 bg-gray-800/60 p-2 rounded-lg border border-gray-700">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-blue-300 text-sm">{reply.displayName}</span>
                            <span className="text-xs text-gray-400">{formatTimeSince(reply.time)}</span>
                          </div>
                          <p className="mt-1 text-white text-sm">{reply.commentText}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400 bg-gray-800/40 rounded-lg border border-gray-700">
              <svg
                className="w-12 h-12 mx-auto text-gray-500 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              <p className="text-lg font-medium">No comments yet</p>
              <p className="mt-1">Be the first to share your thoughts!</p>
            </div>
          )}

          {/* Show more comments button */}
          {sortedComments().length > 3 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowAllComments(!showAllComments)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg border border-gray-700 transition-all flex items-center gap-2 text-sm"
              >
                {showAllComments ? (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                    </svg>
                    Show less comments
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                    Show all {sortedComments().length} comments
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* More Games Section */}
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