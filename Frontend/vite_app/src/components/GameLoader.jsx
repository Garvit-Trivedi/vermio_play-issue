import React from "react";
import { FaGamepad } from "react-icons/fa";

const GamerLoader = () => {
    return (
        <div className="flex flex-col items-center justify-center py-5">
            <FaGamepad className="text-blue-500 text-4xl animate-spin" />
            <p className="text-white mt-2">Loading Games...</p>
        </div>
    );
};

export default GamerLoader;
