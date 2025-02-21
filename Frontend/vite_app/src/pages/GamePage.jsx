// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { fetchGameDetails } from '../services/api';

// function GamePage() {
//   const { id } = useParams();
//   const [gameDetails, setGameDetails] = useState(null);

//   useEffect(() => {
//     const loadGameDetails = async () => {
//       const data = await fetchGameDetails(id);
//       setGameDetails(data);
//     };
//     loadGameDetails();
//   }, [id]);

//   if (!gameDetails) return <div className="text-white text-center p-10">Loading...</div>;

//   return (
//     <div className="relative min-h-screen flex flex-col items-center">
//       {/* Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{ backgroundImage: `url(${gameDetails.bgPic})` }}
//       ></div>

//       {/* HEADER SECTION (Profile Pic, Name, Description) */}
//       <div className="relative z-10 flex justify-between rounded-lg mt-10 w-[80%]">
//         {/* Profile Picture */}
//         <img src={gameDetails.profilePic} alt={gameDetails.name} className="mr-6" />

//         {/* Name & Description */}
//         <div className="text-white">
//           <h1 className="text-4xl font-bold">{gameDetails.name}</h1>
//           <p className="mt-2 text-lg max-w-2xl">{gameDetails.description}</p>
//         </div>
//       </div>

//       {/* TITLES SECTION (Below Profile Pic) */}
//       <div className="relative z-10 mt-6 w-[80%]">
//         <h2 className="text-white text-2xl font-semibold">Popular Titles</h2>
//         <div className="flex flex-wrap gap-2 mt-2">
//           {gameDetails.titles?.map((title, index) => (
//             <span key={index} className="bg-gray-800 px-3 py-1 rounded-lg text-sm text-white">
//               {title}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* ABOUT SECTION (Below Titles) */}
//       <div className="relative z-10 mt-6 w-[80%]">
//         <h2 className="text-white text-2xl font-bold">About the Game</h2>
//         <p className="text-white text-sm mt-1">{gameDetails.about}</p>
//       </div>
//     </div>
//   );
// }

// export default GamePage;



import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGameDetails } from '../services/api';
import Reviews from '../components/rewiews'; // Importing Reviews component

function GamePage() {
  const { id } = useParams();
  const [gameDetails, setGameDetails] = useState(null);

  useEffect(() => {
    const loadGameDetails = async () => {
      const data = await fetchGameDetails(id);
      setGameDetails(data);
    };
    loadGameDetails();
  }, [id]);

  if (!gameDetails) return <div className="text-white text-center p-10">Loading...</div>;

  return (
    <div className="relative min-h-screen flex flex-col items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${gameDetails.bgPic})` }}
      ></div>

      {/* HEADER SECTION (Profile Pic, Name, Description) */}
      <div className="relative z-10 flex justify-between rounded-lg mt-10 w-[80%]">
        {/* Profile Picture */}
        <img src={gameDetails.profilePic} alt={gameDetails.name} className="mr-6" />

        {/* Name & Description */}
        <div className="text-white">
          <h1 className="text-4xl font-bold">{gameDetails.name}</h1>
          <p className="mt-2 text-lg max-w-2xl">{gameDetails.description}</p>
        </div>
      </div>

      {/* TITLES SECTION (Below Profile Pic) */}
      <div className="relative z-10 mt-6 w-[80%]">
        <h2 className="text-white text-2xl font-semibold">Popular Titles</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {gameDetails.titles?.map((title, index) => (
            <span key={index} className="bg-gray-800 px-3 py-1 rounded-lg text-sm text-white">
              {title}
            </span>
          ))}
        </div>
      </div>

      {/* ABOUT SECTION (Below Titles) */}
      <div className="relative z-10 mt-6 w-[80%]">
        <h2 className="text-white text-2xl font-bold">About the Game</h2>
        <p className="text-white text-sm mt-1">{gameDetails.about}</p>
      </div>

      {/* REVIEWS SECTION (Below About Section) */}
      <div className="relative z-10 mt-6 w-[80%]">
        <h2 className="text-white text-2xl font-bold">Game Reviews</h2>
        <Reviews reviews={gameDetails.reviews} />
      </div>
    </div>
  );
}

export default GamePage;
