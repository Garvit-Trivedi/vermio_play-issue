import React from "react";

const GameLoader = ({ isFullPage = true }) => {
    return (
        <div
            className={`flex items-center justify-center ${
                isFullPage ? "h-screen" : "h-full"
            } w-full relative bg-transparent`}
        >
            {/* Rotating Gradient + Logo */}
            <div className="relative flex items-center justify-center">
                {/* Blurred Spinning Gradient Background */}
                <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                blur-xl absolute loader-spin"></div>

                {/* Sharp Logo on Top (Rotates Together) */}
                <div className="w-20 h-20 rounded-2xl bg-transparent flex items-center justify-center relative 
                loader-spin">
                    <img
                        src="https://res.cloudinary.com/dp5upogbb/image/upload/v1738649003/po2fjar6stgbf9gajstf.webp"
                        alt="Vermio Play Logo"
                        className="w-16 h-16 rounded-2xl object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default GameLoader;
