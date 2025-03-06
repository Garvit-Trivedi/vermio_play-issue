import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function Reviews({ reviews }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);
  const thumbnailContainerRef = useRef(null);

  if (!reviews || reviews.length === 0) {
    return <p className="text-gray-400 text-center py-2 sm:py-4">No reviews available.</p>;
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  useEffect(() => {
    if (reviews[currentIndex].type !== 'video') {
      const autoScroll = setTimeout(nextSlide, 5000);
      return () => clearTimeout(autoScroll);
    }
  }, [currentIndex, reviews]);

  useEffect(() => {
    if (reviews[currentIndex].type === 'video' && videoRef.current) {
      videoRef.current.onended = nextSlide;
    }
  }, [currentIndex, reviews]);

  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const thumb = thumbnailContainerRef.current.children[currentIndex];
      if (thumb) {
        const scrollLeft = thumb.offsetLeft - (thumbnailContainerRef.current.offsetWidth / 2) + (thumb.offsetWidth / 2);
        thumbnailContainerRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [currentIndex, reviews.length]);

  return (
    <div className="w-full flex flex-col items-center mt-4 sm:mt-6">
      <div className="relative w-full max-w-4xl bg-gray-900 rounded-lg overflow-hidden">
        {reviews[currentIndex].type === 'video' ? (
          <video
            key={reviews[currentIndex].url}
            ref={videoRef}
            className="w-full h-[200px] sm:h-[400px] object-contain bg-black"
            autoPlay
            muted
            controls
          >
            <source src={reviews[currentIndex].url} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            key={reviews[currentIndex].url}
            src={reviews[currentIndex].url}
            alt="Review"
            className="w-full h-[200px] sm:h-[400px] object-contain bg-black"
          />
        )}

        {reviews.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 p-1 sm:p-2 bg-gray-800 bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all duration-200"
            >
              <FaChevronLeft size={16} sm:size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 p-1 sm:p-2 bg-gray-800 bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all duration-200"
            >
              <FaChevronRight size={16} sm:size={20} />
            </button>
          </>
        )}
      </div>

      {reviews.length > 1 && (
        <div className="w-full max-w-4xl mt-2 sm:mt-4">
          <div
            ref={thumbnailContainerRef}
            className="flex space-x-1 sm:space-x-2 overflow-x-auto hide-scrollbar"
          >
            {reviews.map((review, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-16 sm:w-24 h-10 sm:h-16 relative cursor-pointer"
                onClick={() => setCurrentIndex(index)}
              >
                <img
                  src={review.type === 'video' ? review.thumbnail : review.url}
                  alt={`Review ${index + 1}`}
                  className={`w-full h-full object-cover rounded-md transition-all duration-300 ${
                    index === currentIndex ? 'border-2 border-white opacity-100' : 'opacity-60 hover:opacity-80'
                  }`}
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-md pointer-events-none"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Reviews;