import { useState, useEffect, useContext } from "react";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { toast } from "react-toastify";
import { AuthContext } from "../AuthContext";
import { rateGame, fetchRatingsDistribution } from "../services/api";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RatingsSection = ({ gameDetails, setGameDetails }) => {
    const { authToken, userId } = useContext(AuthContext);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [ratingDistribution, setRatingDistribution] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch ratings distribution on mount
    useEffect(() => {
        const loadRatingsDistribution = async () => {
            try {
                const distribution = await fetchRatingsDistribution(gameDetails._id);
                setRatingDistribution(distribution);
            } catch (error) {
                toast.error(error.message || "Failed to load ratings distribution");
            }
        };
        loadRatingsDistribution();
    }, [gameDetails._id]);

    // Check if the user has already rated this game
    useEffect(() => {
        if (gameDetails?.rating && userId) {
            const existingRating = gameDetails.rating.find((r) => r.userId.toString() === userId.toString());
            if (existingRating) {
                setUserRating(existingRating.rating);
            } else {
                setUserRating(0);
            }
        }
    }, [gameDetails, userId]);

    const handleRate = async (rating) => {
        if (!authToken) {
            toast.error("Please sign in to rate this game.");
            return;
        }
        if (!userId) {
            toast.error("User ID not found. Please log in again.");
            return;
        }
        try {
            setLoading(true);
            const response = await rateGame(gameDetails._id, rating);
            setGameDetails((prev) => ({
                ...prev,
                rating: response.rating,
            }));
            setUserRating(rating);

            // Fetch updated ratings distribution
            const updatedDistribution = await fetchRatingsDistribution(gameDetails._id);
            setRatingDistribution(updatedDistribution);

            toast.success("Rating submitted!");
        } catch (error) {
            toast.error(error.message || "Failed to submit rating");
        } finally {
            setLoading(false);
        }
    };

    // Calculate percentages for the bar chart
    const totalRatings = ratingDistribution
        ? Object.values(ratingDistribution).reduce((sum, count) => sum + count, 0)
        : 0;
    const percentages = ratingDistribution
        ? {
            1: totalRatings ? ((ratingDistribution["1"] || 0) / totalRatings) * 100 : 0,
            2: totalRatings ? ((ratingDistribution["2"] || 0) / totalRatings) * 100 : 0,
            3: totalRatings ? ((ratingDistribution["3"] || 0) / totalRatings) * 100 : 0,
            4: totalRatings ? ((ratingDistribution["4"] || 0) / totalRatings) * 100 : 0,
            5: totalRatings ? ((ratingDistribution["5"] || 0) / totalRatings) * 100 : 0,
        }
        : { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    // Prepare data for the horizontal bar chart
    const chartData = {
        labels: ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"],
        datasets: [
            {
                label: "Rating Distribution (%)",
                data: [
                    percentages["5"],
                    percentages["4"],
                    percentages["3"],
                    percentages["2"],
                    percentages["1"],
                ],
                backgroundColor: ["#22c55e", "#22c55e", "#facc15", "#ef4444", "#ef4444"],
                borderColor: ["#16a34a", "#16a34a", "#eab308", "#dc2626", "#dc2626"],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        indexAxis: "y",
        responsive: true,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: "Rating Distribution (%)",
                color: "#ffffff",
                font: { size: 16 },
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.raw.toFixed(1)}%`,
                },
            },
        },
        scales: {
            x: {
                ticks: { color: "#ffffff", callback: (value) => `${value}%` },
                title: { display: true, text: "Percentage of Ratings", color: "#ffffff" },
                max: 100,
            },
            y: { ticks: { color: "#ffffff" } },
        },
    };

    return (
        <div className="relative z-10 mt-6 sm:mt-8 w-full max-w-5xl bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-4 sm:p-6 rounded-xl border border-gray-700 backdrop-blur-sm shadow-xl">
            <h2 className="text-white text-lg sm:text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-yellow-500 w-1 h-6 rounded-full"></span>
                Rate This Game
            </h2>

            {/* Rating Submission */}
            <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => handleRate(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className={`focus:outline-none ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading}
                        aria-label={`Rate ${star} stars`}
                    >
                        {(hoverRating || userRating) >= star ? (
                            <AiFillStar className="w-6 h-6 text-yellow-400" />
                        ) : (
                            <AiOutlineStar className="w-6 h-6 text-gray-400" />
                        )}
                    </button>
                ))}
                {userRating > 0 && (
                    <span className="ml-2 text-sm text-gray-300">You rated: {userRating} star{userRating !== 1 ? "s" : ""}</span>
                )}
            </div>

            {/* Horizontal Rating Distribution Bar Chart */}
            {ratingDistribution && (
                <div className="mt-4">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            )}
        </div>
    );
};

export default RatingsSection;