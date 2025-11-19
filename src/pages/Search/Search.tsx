import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Search.css';

const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP = 'https://image.tmdb.org/t/p/w1280';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNmY2ZTM1YmRlNzkyYWFhMTBkYTBjNGJmODQzNmQxZSIsIm5iZiI6MTc2MDUxNTQ0Mi41NTIsInN1YiI6IjY4ZWY1NTcyYmVkYzE5ZTI3ZDQwY2MwYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kmfIieSjMpLCeHbGueBIfvIh02sGJnwrGiOVkLjE7Ic',
  },
};

interface SearchResult {
  id: number;
  title?: string;
  original_title?: string;
  backdrop_path: string | null;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
}

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchTerm)}&language=en-US&page=1`,
        options
      );
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      performSearch(query.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="search-page">
      <Navbar />
      <div className="search-container">
        <div className="search-header">
          <h1>Search Movies</h1>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search for movies..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>

        {loading && (
          <div className="search-loading">
            <p>Searching...</p>
          </div>
        )}

        {!loading && hasSearched && results.length === 0 && (
          <div className="no-results">
            <p>No results found for "{query}"</p>
            <p className="no-results-subtitle">Try a different search term</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="search-results">
            <h2>Search Results for "{query}" ({results.length} found)</h2>
            <div className="results-grid">
              {results.map((movie) => (
                <div key={movie.id} className="result-card">
                  <Link to={`/movie/${movie.id}`}>
                    {movie.poster_path ? (
                      <img
                        src={`${TMDB_IMG}${movie.poster_path}`}
                        alt={movie.title || movie.original_title}
                      />
                    ) : (
                      <div className="no-poster">
                        <span>No Image</span>
                      </div>
                    )}
                    <div className="result-info">
                      <h3>{movie.title || movie.original_title}</h3>
                      <p className="result-date">{movie.release_date}</p>
                      <p className="result-rating">
                        Rating: {movie.vote_average?.toFixed(1)} / 10
                      </p>
                      {movie.overview && (
                        <p className="result-overview">
                          {movie.overview.length > 150
                            ? `${movie.overview.substring(0, 150)}...`
                            : movie.overview}
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {!hasSearched && !loading && (
          <div className="search-placeholder">
            <p>Enter a movie name to start searching</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Search;

