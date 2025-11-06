// src/pages/Watchlist/Watchlist.tsx
import { Link } from 'react-router-dom';
import { useWatchlist } from '../../context/WatchlistContext';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Watchlist.css';

const IMG = 'https://image.tmdb.org/t/p/w300';

const Watchlist = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();

  if (watchlist.length === 0) {
    return (
      <div className="watchlist-empty">
        <Navbar />
        <div className="empty-content">
          <h2>Your List is Empty</h2>
          <p>Add movies from the detail page</p>
          <Link to="/" className="btn">Browse Movies</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="watchlist-page">
      <Navbar />
      <div className="watchlist-container">
        <h1>My List ({watchlist.length})</h1>
        <div className="watchlist-grid">
          {watchlist.map(movie => (
            <div key={movie.id} className="watchlist-card">
              <Link to={`/movie/${movie.id}`}>
                <img src={`${IMG}${movie.poster_path || movie.backdrop_path}`} alt={movie.title} />
              </Link>
              <div className="card-info">
                <h3>{movie.title}</h3>
                <button onClick={() => removeFromWatchlist(movie.id)} className="remove-btn">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Watchlist;