
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useWatchlist } from '../../context/WatchlistContext';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './MovieDetail.css';

const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP = 'https://image.tmdb.org/t/p/w1280';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNmY2ZTM1YmRlNzkyYWFhMTBkYTBjNGJmODQzNmQxZSIsIm5iZiI6MTc2MDUxNTQ0Mi41NTIsInN1YiI6IjY4ZWY1NTcyYmVkYzE5ZTI3ZDQwY2MwYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kmfIieSjMpLCeHbGueBIfvIh02sGJnwrGiOVkLjE7Ic',
  },
};

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
      .then(res => res.json())
      .then(data => {
        setMovie(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!movie) return <div>Movie not found</div>;

  const inWatchlist = isInWatchlist(movie.id);

  const handleWatchlist = () => {
    const movieData = {
      id: movie.id,
      title: movie.title || movie.original_title,
      original_title: movie.original_title,
      backdrop_path: movie.backdrop_path,
      poster_path: movie.poster_path,
      overview: movie.overview,
      release_date: movie.release_date,
    };

    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movieData);
    }
  };

  return (
    <div className="movie-detail-page">
      <Navbar />
      <div className="detail-hero" style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9), transparent), url(${TMDB_BACKDROP}${movie.backdrop_path})`
      }}>
        <div className="detail-content">
          <img src={`${TMDB_IMG}${movie.poster_path}`} alt={movie.title} className="detail-poster" />
          <div className="detail-info">
            <h1>{movie.title || movie.original_title}</h1>
            <p className="tagline">{movie.tagline}</p>
            <p className="overview">{movie.overview}</p>

            <div className="meta">
              <span>Release: {movie.release_date}</span>
              <span>Runtime: {movie.runtime} min</span>
              <span>Rating: {movie.vote_average?.toFixed(1)} / 10</span>
            </div>

            <div className="detail-actions">
              <Link to={`/player/${movie.id}`} className="btn play-btn">
                Play
              </Link>
              <button className={`btn ${inWatchlist ? 'dark-btn' : ''}`} onClick={handleWatchlist}>
                {inWatchlist ? 'Remove from My List' : 'Add to My List'}
              </button>
              <Link to="/" className="btn dark-btn">Back</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MovieDetail;