import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Player from "./pages/Player/Player";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";


function App() {
  const { currentUser } = useAuth();

  return (
    <>
      <ToastContainer theme="dark" />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={!currentUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/player/:id"
          element={
            <ProtectedRoute>
              <Player />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
