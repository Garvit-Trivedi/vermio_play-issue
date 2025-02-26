import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaChevronUp } from 'react-icons/fa';

function Reviews({ reviews }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);
  const thumbnailContainerRef = useRef(null);

  if (!reviews || reviews.length === 0) {
    return <p className="text-white">No reviews available.</p>;
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  useEffect(() => {
    if (reviews[currentIndex].type !== 'video') {
      const autoScroll = setTimeout(() => {
        nextSlide();
      }, 5000); // Increased time for images

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
      const visibleThumbnails = 5;
      const scrollPosition = Math.floor(currentIndex / visibleThumbnails) * (thumbnailContainerRef.current.scrollWidth / Math.ceil(reviews.length / visibleThumbnails));
      thumbnailContainerRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }, [currentIndex, reviews.length]);

  return (
    <div className="relative w-full flex flex-col items-center mt-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-lg relative mt-8">
        {reviews[currentIndex].type === 'video' ? (
          <video
            key={reviews[currentIndex].url}
            className="w-full h-100 object-fill"
            autoPlay
            muted
            controls
            ref={videoRef}
          >
            <source src={reviews[currentIndex].url} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            key={reviews[currentIndex].url}
            className="w-full h-100 object-fill"
            src={reviews[currentIndex].url}
            alt="Review"
          />
        )}
        <button className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white" onClick={prevSlide}>
          <FaChevronLeft size={24} />
        </button>
        <button className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white" onClick={nextSlide}>
          <FaChevronRight size={24} />
        </button>
      </div>
      <div className="w-full max-w-4xl mt-4 overflow-hidden relative">
        <div
          className="flex space-x-2 overflow-x-auto relative no-scrollbar"
          ref={thumbnailContainerRef}
        >
          {reviews.map((review, index) => (
            <div key={index} className="relative flex-shrink-0 w-1/5">
              {index === currentIndex && (
                <FaChevronUp className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-white" size={20} />
              )}
              <img
                src={review.type === 'video' ? review.thumbnail : review.url}
                alt={`Review ${index + 1}`}
                className={`w-full rounded-lg cursor-pointer transition-opacity duration-300 border-2 ${index === currentIndex ? 'border-white opacity-100' : 'border-transparent opacity-50'}`}
                onClick={() => setCurrentIndex(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reviews;
