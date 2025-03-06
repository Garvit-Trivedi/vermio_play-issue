import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa";
import { addToLibrary, removeFromLibrary } from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from '../AuthContext';

function Buttons({ gameId, type, className = "" }) {
  const { authToken, library, updateLibrary } = useContext(AuthContext);
  const isInLibrary = library.has(gameId);

  const handleLibraryClick = async () => {
    if (!authToken) {
      toast.error("Please sign in to manage your library!", { autoClose: 2000, toastId: `auth-${gameId}` });
      return;
    }

    try {
      if (isInLibrary) {
        await removeFromLibrary(gameId);
        updateLibrary(gameId, false);
        toast.success("Removed from library", { autoClose: 2000, toastId: `remove-${gameId}` });
      } else {
        await addToLibrary(gameId);
        updateLibrary(gameId, true);
        toast.success("Added to library", { autoClose: 2000, toastId: `add-${gameId}` });
      }
    } catch (error) {
      toast.error(error.message || "Failed to update library", { toastId: `error-${gameId}` });
    }
  };

  return (
    <>
      {type === "play" ? (
        <Link
          to={`/game/${gameId}`}
          className={`bg-slate-800 border-2 text-white p-1 sm:p-2 px-3 sm:px-4 rounded-lg hover:border-blue-500 text-sm sm:text-base ${className}`}
        >
          Play
        </Link>
      ) : (
        <button
          onClick={handleLibraryClick}
          className={`z-10 bg-slate-800 border-2 text-white p-1 sm:p-2 px-2 rounded-lg ${isInLibrary ? "border-blue-500" : "border-cyan-300"
            } hover:border-blue-500 text-sm sm:text-base ${className}`}
        >
          {isInLibrary ? <FaMinus /> : <FaPlus />}
        </button>
      )}
    </>
  );
}

export default Buttons;