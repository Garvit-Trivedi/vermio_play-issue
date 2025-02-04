import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGameDetails } from '../services/api'; // Assuming you have this API function for fetching the game details

function GamePage() {
  const { id } = useParams(); // Get the game ID from the URL
  const [gameDetails, setGameDetails] = useState(null);

  useEffect(() => {
    const loadGameDetails = async () => {
      const data = await fetchGameDetails(id); // Fetch game details using the ID
      setGameDetails(data);
    };
    loadGameDetails();
  }, [id]);

  if (!gameDetails) return <div>Loading...</div>;

  return (
    <div className="game-page container mx-auto p-4">
      {/* Background with profilePic and game name */}
      <div className="relative bg-center bg-contain h-100" style={{ backgroundImage: `url(${gameDetails.bgPic})` }}>
        <div className="absolute inset-0 bg-black opacity-0"></div>
        <div className="absolute top-0 left-0 p-4 flex items-center">
          {/* Profile picture */}
          <img src={gameDetails.profilePic} alt={gameDetails.name} className=" h-30  mr-4" />
          {/* Game Name and Description */}
          <div className="text-white">
            <h1 className="text-4xl font-bold">{gameDetails.name}</h1>
            <p className="text-balance mt-2">{gameDetails.description}</p>
          </div>
        </div>
      </div>

      <div className="game-details p-4">
        {/* Game About */}
        <p className="text-sm mt-4">{gameDetails.about}</p>

        <div className="mt-6">
          <h2 className="text-2xl font-bold">Reviews</h2>
          <ReviewSlider reviews={gameDetails.reviews} />
        </div>
      </div>
    </div>
  );
}

// ReviewSlider component to display reviews
function ReviewSlider({ reviews }) {
  return (
    <div className="review-slider mt-4">
      <div className="relative">
        <div className="flex overflow-x-scroll space-x-4">
          {reviews.map((review, index) => (
            <div key={index} className="w-96 flex-shrink-0">
              {review.type === 'video' ? (
                <div className="video-review">
                  <video width="100%" controls>
                    <source src={review.url} type="video/webm" />
                    Your browser does not support the video tag.
                  </video>
                  <img src={review.thumbnail} alt="Thumbnail" className="mt-2 w-50" />
                </div>
              ) : (
                <div className="image-review">
                  {/* For image reviews, use the same URL as the thumbnail but scaled to match video size */}
                  <img src={review.url} alt="Review Image" className="w-full" />
                  <img src={review.url} alt="Thumbnail" className="mt-2 w-50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GamePage;
