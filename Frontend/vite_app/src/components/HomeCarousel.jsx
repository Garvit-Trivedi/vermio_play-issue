import React, { useEffect, useState } from "react";
import { fetchGames } from "../services/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Buttons from "./Buttons";

const SliderCarousel = () => {
    const [randomGames, setRandomGames] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const loadGames = async () => {
            try {
                const games = await fetchGames();
                setRandomGames(games.sort(() => 0.5 - Math.random()).slice(0, 8));
            } catch (error) {
                console.error("Error fetching games:", error);
            }
        };

        loadGames();
    }, []);

    return (
        <div className="w-full mx-auto my-6 flex flex-col items-center relative">
            {randomGames.length > 0 && (
                <div className="w-full relative overflow-hidden rounded-lg">
                    <div className="relative w-full h-[500px]">
                        {randomGames[currentIndex].firstVideo ? (
                            <video
                                src={randomGames[currentIndex].firstVideo}
                                autoPlay
                                muted
                                loop
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
                                <div className="flex gap-4 mt-2 items-center">
                                    <Buttons type="play" gameId={randomGames[currentIndex]._id} />
                                    <Buttons type="library" gameId={randomGames[currentIndex]._id} />
                                </div>
                            </div>
                            <div className="w-1/2">
                                <Slider
                                    dots={false}
                                    infinite
                                    speed={500}
                                    slidesToShow={5}
                                    slidesToScroll={2}
                                    centerMode
                                    afterChange={setCurrentIndex}
                                    arrows={false}
                                >
                                    {randomGames.map((game, index) => (
                                        <div
                                            key={game._id}
                                            className={`transition-all duration-300 cursor-pointer flex justify-center ${index === currentIndex ? "opacity-100 scale-110" : "opacity-50 scale-90"
                                                }`}
                                            onClick={() => setCurrentIndex(index)}
                                        >
                                            <img src={game.profilePic} alt={game.name} className="w-20 h-20 object-cover rounded-lg" />
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SliderCarousel;
