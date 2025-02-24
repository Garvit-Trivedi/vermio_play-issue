import React, { useEffect, useState, useRef } from "react";
import { fetchGames, addToLibrary, removeFromLibrary, fetchLibrary } from "../services/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaPlus, FaMinus } from "react-icons/fa";

const SliderCarousel = () => {
    const [randomGames, setRandomGames] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [library, setLibrary] = useState([]);
    const videoRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadGames = async () => {
            try {
                const games = await fetchGames();
                const shuffledGames = games.sort(() => 0.5 - Math.random()).slice(0, 8);
                setRandomGames(shuffledGames);
            } catch (error) {
                console.error("Error fetching games:", error);
            }
        };
        
        const loadLibrary = async () => {
            try {
                const libraryGames = await fetchLibrary();
                setLibrary(libraryGames.map(game => game._id));
            } catch (error) {
                console.error("Error fetching library:", error);
            }
        };
        
        loadGames();
        loadLibrary();
    }, []);

    useEffect(() => {
        if (randomGames.length > 0) {
            setProgress(0);
            if (videoRef.current) {
                videoRef.current.play();
            }
        }
    }, [currentIndex, randomGames]);

    useEffect(() => {
        if (videoRef.current) {
            const updateProgress = () => {
                const duration = videoRef.current.duration;
                const currentTime = videoRef.current.currentTime;
                if (duration) {
                    setProgress((currentTime / duration) * 100);
                }
            };

            videoRef.current.addEventListener("timeupdate", updateProgress);
            return () => videoRef.current?.removeEventListener("timeupdate", updateProgress);
        }
    }, []);

    const handleVideoEnd = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % randomGames.length);
    };

    const handleSlideChange = (index) => {
        setCurrentIndex(index);
        setProgress(0);
    };

    const handlePlayClick = () => {
        navigate(`/game/${randomGames[currentIndex]._id}`);
    };

    const handleLibraryToggle = async () => {
        const gameId = randomGames[currentIndex]._id;
        if (library.includes(gameId)) {
            await removeFromLibrary(gameId);
            setLibrary(library.filter(id => id !== gameId));
        } else {
            await addToLibrary(gameId);
            setLibrary([...library, gameId]);
        }
    };

    return (
        <div className="w-full mx-auto my-6 flex flex-col items-center relative">
            <div className="w-full relative">
                {randomGames.length > 0 && (
                    <div className="relative w-full h-[500px]">
                        {randomGames[currentIndex].firstVideo ? (
                            <video
                                ref={videoRef}
                                src={randomGames[currentIndex].firstVideo}
                                autoPlay
                                muted
                                onEnded={handleVideoEnd}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        ) : (
                            <img
                                src={randomGames[currentIndex].profilePic}
                                alt={randomGames[currentIndex].name}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        )}
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-6 text-white flex justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-bold">{randomGames[currentIndex].name}</h2>
                                <div className="flex gap-4 mt-2">
                                    <button onClick={handlePlayClick} className="bg-blue-500 px-4 py-2 rounded flex items-center gap-2"><FaPlay /> Play</button>
                                    <button onClick={handleLibraryToggle} className="bg-gray-700 px-4 py-2 rounded flex items-center gap-2">
                                        {library.includes(randomGames[currentIndex]._id) ? <FaMinus /> : <FaPlus />} {library.includes(randomGames[currentIndex]._id) ? "Remove" : "Add"}
                                    </button>
                                </div>
                            </div>
                            <div className="w-1/3">
                                <Slider
                                    dots={false}
                                    infinite={true}
                                    speed={500}
                                    slidesToShow={3}
                                    slidesToScroll={1}
                                    autoplay={false}
                                    centerMode={true}
                                    centerPadding="10px"
                                    afterChange={handleSlideChange}
                                    arrows={false}
                                >
                                    {randomGames.map((game, index) => (
                                        <div
                                            key={game._id}
                                            className={`transition-all duration-300 cursor-pointer flex justify-center ${index === currentIndex ? 'opacity-100 scale-110' : 'opacity-50 scale-90'}`}
                                            onClick={() => setCurrentIndex(index)}
                                        >
                                            <img src={game.profilePic} alt={game.name} className="w-20 h-20 object-cover rounded-lg" />
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SliderCarousel;
