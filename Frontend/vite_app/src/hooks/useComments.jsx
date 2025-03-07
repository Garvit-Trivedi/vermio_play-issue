import { useState } from "react";
import { toast } from "react-toastify";
import {
  fetchGameDetails,
  addComment,
  replyToComment,
  likeComment,
  deleteComment,
  likeReply,
  deleteReply,
} from "../services/api";

export const useComments = (gameId, authToken, userId, displayName, setGameDetails) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(false);

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
    try {
      setLoading(true);
      const response = await addComment(gameId, newComment);
      setGameDetails((prev) => ({ ...prev, comments: response.comments }));
      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

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
      await replyToComment(gameId, parentCommentId, newReply);
      const updatedGame = await fetchGameDetails(gameId);
      setGameDetails(updatedGame);
      setReplyingTo(null);
      setNewReply("");
      toast.success("Reply added successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to add reply");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentLike = async (commentId) => {
    if (!authToken) {
      toast.error("Please sign in to like comments.");
      return;
    }
    try {
      const response = await likeComment(gameId, commentId);
      setGameDetails((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === commentId ? { ...c, likes: response.likes } : c
        ),
      }));
    } catch (err) {
      toast.error(err.message || "Failed to like comment");
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!authToken) {
      toast.error("Please sign in to delete comments.");
      return;
    }
    try {
      const response = await deleteComment(gameId, commentId);
      setGameDetails((prev) => ({ ...prev, comments: response.comments }));
      toast.success("Comment deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete comment");
    }
  };

  const handleReplyLike = async (commentId, replyId) => {
    if (!authToken) {
      toast.error("Please sign in to like replies.");
      return;
    }
    try {
      const response = await likeReply(gameId, commentId, replyId);
      setGameDetails((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === commentId
            ? {
              ...c,
              replies: c.replies.map((r) =>
                r._id === replyId ? { ...r, likes: response.likes } : r
              ),
            }
            : c
        ),
      }));
    } catch (err) {
      toast.error(err.message || "Failed to like reply");
    }
  };

  const handleReplyDelete = async (commentId, replyId) => {
    if (!authToken) {
      toast.error("Please sign in to delete replies.");
      return;
    }
    try {
      await deleteReply(gameId, commentId, replyId);
      const updatedGame = await fetchGameDetails(gameId);
      setGameDetails(updatedGame);
      toast.success("Reply deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete reply");
    }
  };

  return {
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
  };
};