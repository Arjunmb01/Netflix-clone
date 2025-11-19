import "./Navbar.css";
import logo from "../../assets/logo.png";
import search_icon from "../../assets/search_icon.svg";
import bell_icon from "../../assets/bell_icon.svg";
import profile_icon from "../../assets/profile_img.png";
import caret_icon from "../../assets/caret_icon.svg";
import { useEffect, useRef, useState } from "react";
import { logout } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";

const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNmY2ZTM1YmRlNzkyYWFhMTBkYTBjNGJmODQzNmQxZSIsIm5iZiI6MTc2MDUxNTQ0Mi41NTIsInN1YiI6IjY4ZWY1NTcyYmVkYzE5ZTI3ZDQwY2MwYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kmfIieSjMpLCeHbGueBIfvIh02sGJnwrGiOVkLjE7Ic",
  },
};

interface SearchResult {
  id: number;
  title?: string;
  original_title?: string;
  poster_path: string | null;
  release_date: string;
}

const Navbar = () => {
  const navRef = useRef<HTMLDivElement | null>(null);
  const lastScrollYRef = useRef(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // PROFILE DROPDOWN STATES
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;

      if (currentScrollY < 80) {
        navRef.current?.classList.remove("nav-hidden");
        navRef.current?.classList.remove("nav-dark");
      } else {
        navRef.current?.classList.add("nav-dark");

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          navRef.current?.classList.add("nav-hidden");
        } else {
          navRef.current?.classList.remove("nav-hidden");
        }
      }
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSearchOpen]);

  useEffect(() => {
    const clickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", clickOutside);
    }

    return () => document.removeEventListener("mousedown", clickOutside);
  }, [isSearchOpen]);

  useEffect(() => {
    const handleSearch = async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            query
          )}&language=en-US&page=1`,
          options
        );
        const data = await response.json();
        setSearchResults(data.results?.slice(0, 8) || []);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeout = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <>
      <div ref={navRef} className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="" />
          <ul>
            <li>
              <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                Home
              </Link>
            </li>
            <li>TV shows</li>
            <li>Movies</li>
            <li>New & Popular</li>
            <li>
              <Link
                to="/watchlist"
                style={{ color: "white", textDecoration: "none" }}
              >
                My List
              </Link>
            </li>
            <li>Browse by Language</li>
          </ul>
        </div>

        <div className="navbar-right">
          {/* SEARCH */}
          <div className="search-container" ref={searchContainerRef}>
            {isSearchOpen ? (
              <div className="search-input-wrapper">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="navbar-search-input"
                />

                {isSearching && (
                  <div className="search-loading">Searching...</div>
                )}

                {searchResults.length > 0 && (
                  <div className="search-results-dropdown">
                    {searchResults.map((movie) => (
                      <div
                        key={movie.id}
                        className="search-result-item"
                        onClick={() => handleResultClick(movie.id)}
                      >
                        {movie.poster_path ? (
                          <img
                            src={`${TMDB_IMG}${movie.poster_path}`}
                            alt={movie.title || movie.original_title}
                          />
                        ) : (
                          <div className="no-poster-small">No Image</div>
                        )}

                        <div className="search-result-info">
                          <p className="search-result-title">
                            {movie.title || movie.original_title}
                          </p>
                          {movie.release_date && (
                            <p className="search-result-date">
                              {new Date(movie.release_date).getFullYear()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {searchQuery &&
                  !isSearching &&
                  searchResults.length === 0 && (
                    <div className="search-results-dropdown">
                      <div className="no-search-results">
                        No results found
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <img
                src={search_icon}
                alt="Search"
                className="icons"
                onClick={() => setIsSearchOpen(true)}
              />
            )}
          </div>

          <p>Children</p>
          <img src={bell_icon} alt="" className="icons" />

          {/* PROFILE DROPDOWN */}
          <div
            className="navbar-profile"
            ref={profileRef}
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            <img src={profile_icon} alt="" className="profile" />
            <img src={caret_icon} alt="" />

            {isDropdownOpen && (
              <div
                className="dropdown"
                onClick={(e) => e.stopPropagation()} 
              >
                <p onClick={() => logout()}>Sign Out</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
