import React from 'react';

const MovieCard = ({ title, year, poster }) => {
    return (
        <div className="bg-[#0f0f2d] text-white rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform w-full">
            <img
                title={title}
                src={poster !== 'N/A' ? poster : 'https://via.placeholder.com/300x450?text=No+Image'}
                alt={title}
                className="w-full h-72 object-cover"
            />
            <div className="p-3">
                <h3 className="text-sm font-semibold leading-tight truncate">{title}</h3>
                <p className="text-xs text-gray-400 mt-1">Year: {year}</p>
            </div>
        </div>
    );
};

export default MovieCard;
