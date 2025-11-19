import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Player from "./pages/Player/Player";
import MovieDetail from "./pages/MovieDetail/MovieDetail";     // new
import Watchlist from "./pages/Watchlist/Watchlist";           // new
import Search from "./pages/Search/Search";                    // new
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { WatchlistProvider } from "./context/WatchlistContext"; //

function App() {
  const { currentUser } = useAuth();

  return (
    <WatchlistProvider>
      <>
        <ToastContainer theme="dark" />
        <Routes>

          <Route
            path="/login"
            element={!currentUser ? <Login /> : <Navigate to="/" />}
          />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/player/:id" element={<Player />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/search" element={<Search />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </>
    </WatchlistProvider>
  );
}

export default App;