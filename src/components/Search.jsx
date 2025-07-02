import React from 'react'

const Search = ({ searchTerm, setSearchTerm, onSearch }) => {
  return (
    <div className="search">
      <div className='flex items-center gap-2'>
        <img src="search.svg" alt="search" />

        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearch();
          }}
        />

        <button onClick={onSearch} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
          Search
        </button>
      </div>
    </div>
  )
}
export default Search