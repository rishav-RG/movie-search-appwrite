import { useEffect, useState } from 'react';
import Search from './components/Search.jsx';
// import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import { updateSearchCount, getTrendingMovies } from './appwrite.js';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const App = () => {
  // Search-related state
  const [searchTerm, setSearchTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Trending-related state
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);
  const [trendingError, setTrendingError] = useState('');

  // Fetch movies by title
  const fetchMovies = async (query = '') => {
    if (!query.trim()) {
      setMovieList([]);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setMovieList([]);

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'No movies found.');
        return;
      }

      const movies = data.Search || [];
      setMovieList(movies);

      if (movies.length > 0) {
        const [first] = movies;
        await updateSearchCount(query, {
          poster_url: first.Poster,
          movieId: first.imdbID,
        });
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to fetch movies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load trending on mount
  const loadTrendingMovies = async () => {
    setIsTrendingLoading(true);
    setTrendingError('');
    setTrendingMovies([]);

    try {
      const movies = await getTrendingMovies();
      if (!movies.length) {
        setTrendingError('No trending data available.');
      } else {
        setTrendingMovies(movies);

      }
    } catch (err) {
      console.error(err);
      setTrendingError('Failed to load trending movies.');
    } finally {
      setIsTrendingLoading(false);
    }
  };

  const handleSearch = async () => {
    // fetches movies after search is clicked
    await fetchMovies(searchTerm);
    // updates trending movies based on every search 
    loadTrendingMovies();
  }
  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
          </h1>
          <Search
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={() => handleSearch()}
          />
        </header>

        {/* Trending Section */}
        <section className="trending mt-20">
          <h2>Trending</h2>

          {isTrendingLoading ? (
            <p className="text-white animate-pulse">Loading trending...</p>
          ) : trendingError ? (
            <p className="text-red-500">{trendingError}</p>
          ) : (
            <ul className="flex overflow-x-auto gap-5 hide-scrollbar -mt-10">
              {trendingMovies.map((movie, idx) => (
                <li
                  key={movie.$id}
                  className="min-w-[230px] flex items-center"
                >
                  <p className="fancy-text mt-[22px] text-nowrap">
                    {idx + 1}
                  </p>
                  <img
                    src={movie.poster_url}
                    alt={movie.title || 'Poster'}
                    className="w-[127px] h-[163px] rounded-lg object-cover -ml-3.5"
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* All Movies Section */}
        <section className="all-movies space-y-9 mt-10">
          <h2>All Movies</h2>

          {isLoading ? (
            <p className="text-white animate-pulse">Loading...</p>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
              {movieList.map((m) => (
                <MovieCard
                  key={m.imdbID}
                  title={m.Title}
                  year={m.Year}
                  poster={m.Poster}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
