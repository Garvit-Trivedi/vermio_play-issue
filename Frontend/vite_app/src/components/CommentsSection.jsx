import { useState } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai"; // Add this import

const CommentsSection = ({
    gameDetails,
    authToken,
    userId,
    displayName,
    newComment,
    setNewComment,
    replyingTo,
    setReplyingTo,
    newReply,
    setNewReply,
    loading,
    handleCommentSubmit,
    handleReplySubmit,
    handleCommentLike,
    handleCommentDelete,
    handleReplyLike,
    handleReplyDelete,
}) => {
    const [commentSort, setCommentSort] = useState("top");
    const [showAllComments, setShowAllComments] = useState(false);

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
        return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    };

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

    const displayedComments = () => {
        const sorted = sortedComments();
        return showAllComments ? sorted : sorted.slice(0, 3);
    };

    return (
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

            <div className="mb-6 bg-gray-800/60 p-4 rounded-xl border border-gray-700">
                <form onSubmit={handleCommentSubmit} className="flex items-start gap-3">
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
                    <div className="flex-1 relative">
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
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            <div className="space-y-4">
                {displayedComments().length > 0 ? (
                    displayedComments().map((comment) => (
                        <div key={comment._id} className="mb-6 animate-fadeIn">
                            <div className="flex items-start gap-3">
                                <div
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold"
                                    style={{
                                        backgroundImage: `url(https://api.dicebear.com/7.x/pixel-art/svg?seed=${comment.email_id})`,
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
                                        </div>
                                        <p className="mt-1 text-white">{comment.commentText}</p>
                                        <div className="flex items-center mt-3 text-sm">
                                            <button
                                                onClick={() => handleCommentLike(comment._id)}
                                                className={`flex items-center gap-1 mr-4 ${comment.likes.includes(userId)
                                                        ? "text-blue-400"
                                                        : "text-gray-400 hover:text-gray-300"
                                                    }`}
                                            >
                                                {comment.likes.includes(userId) ? (
                                                    <AiFillLike className="w-4 h-4" />
                                                ) : (
                                                    <AiOutlineLike className="w-4 h-4" />
                                                )}
                                                <span>{comment.likes.length > 0 ? comment.likes.length : ""}</span>
                                            </button>
                                            {authToken && (
                                                <>
                                                    <button
                                                        onClick={() => handleCommentDelete(comment._id)}
                                                        className="text-gray-400 hover:text-red-400 mr-4"
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                                                        className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                                            ></path>
                                                        </svg>
                                                        Reply
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {replyingTo === comment._id && (
                                        <div className="mt-3 pl-4 border-l-2 border-purple-600/30 animate-fadeIn">
                                            <form onSubmit={(e) => handleReplySubmit(e, comment._id)}>
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
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                                    {comment.replies.length > 0 && (
                                        <div className="ml-12 mt-2 space-y-2">
                                            {comment.replies.map((reply) => (
                                                <div key={reply._id} className="flex items-start gap-2 animate-fadeIn">
                                                    <div
                                                        className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xs"
                                                        style={{
                                                            backgroundImage: `url(https://api.dicebear.com/7.x/pixel-art/svg?seed=${reply.email_id})`,
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
                                                        <div className="flex items-center mt-2 text-sm">
                                                            <button
                                                                onClick={() => handleReplyLike(comment._id, reply._id)}
                                                                className={`flex items-center gap-1 mr-4 ${reply.likes.includes(userId)
                                                                        ? "text-blue-400"
                                                                        : "text-gray-400 hover:text-gray-300"
                                                                    }`}
                                                            >
                                                                {reply.likes.includes(userId) ? (
                                                                    <AiFillLike className="w-4 h-4" />
                                                                ) : (
                                                                    <AiOutlineLike className="w-4 h-4" />
                                                                )}
                                                                <span>{reply.likes.length > 0 ? reply.likes.length : ""}</span>
                                                            </button>
                                                            {authToken && (
                                                                <button
                                                                    onClick={() => handleReplyDelete(comment._id, reply._id)}
                                                                    className="text-gray-400 hover:text-red-400"
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-400 bg-gray-800/40 rounded-lg border border-gray-700">
                        <svg className="w-12 h-12 mx-auto text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                {sortedComments().length > 3 && (
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => setShowAllComments(!showAllComments)}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg border border-gray-700 transition-all flex items-center gap-2 text-sm"
                        >
                            {showAllComments ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                                    </svg>
                                    Show less comments
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    );
};

export default CommentsSection;