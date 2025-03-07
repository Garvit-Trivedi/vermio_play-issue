import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import Buttons from "../components/Buttons";
import Reviews from "../components/rewiews";

const GameDetails = ({ gameDetails, hasLiked, handleLike, loading }) => (
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
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm sm:text-base font-medium transition-all ${hasLiked
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

export default GameDetails;