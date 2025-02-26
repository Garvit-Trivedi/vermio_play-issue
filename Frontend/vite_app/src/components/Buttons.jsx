import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa";
import { addToLibrary, removeFromLibrary, fetchLibrary } from "../services/api";
import { toast } from "react-toastify"; // Import toast notifications

function Buttons({ gameId, type, className = "" }) {
    const [isInLibrary, setIsInLibrary] = useState(false);

    useEffect(() => {
        const checkLibraryStatus = async () => {
            try {
                const libraryGames = await fetchLibrary();
                setIsInLibrary(libraryGames.some(game => game._id === gameId));
            } catch (error) {
                console.error("Error fetching library:", error);
            }
        };
        checkLibraryStatus();
    }, [gameId]);

    const handleLibraryClick = async () => {
        try {
            if (isInLibrary) {
                await removeFromLibrary(gameId);
                setIsInLibrary(false);
                toast.success("Removed from library", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: {
                        backgroundColor: "#1e293b", // Slate-800 background
                        color: "#22d3ee", // Cyan-300 text color
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        padding: "10px",
                    },
                });
            } else {
                await addToLibrary(gameId);
                setIsInLibrary(true);
                toast.success("Added to library", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: {
                        backgroundColor: "#1e293b", // Slate-800 background
                        color: "#22d3ee", // Cyan-300 text color
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        padding: "10px",
                    },
                });
            }
        } catch (error) {
            console.error("Error updating library:", error);
        }
    };

    return (
        <>
            {type === "play" ? (
                <Link
                    to={`/game/${gameId}`}
                    className={`bg-slate-800 border-2 text-white p-2 px-4 rounded-lg transition-transform transform hover:border-purple-400 ${className}`}
                >
                    Play
                </Link>
            ) : (
                <button
                    onClick={handleLibraryClick}
                    className={`z-10 bg-slate-800 border-2 text-white p-2 px-2 rounded-lg transition-transform transform ${isInLibrary ? "border-pink-400" : "border-cyan-300"} hover:border-purple-400 ${className}`}
                >
                    {isInLibrary ? <FaMinus /> : <FaPlus />}
                </button>
            )}
        </>
    );
}

export default Buttons;
