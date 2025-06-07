import React from "react";
import { useAuthStore } from "../../stores/authStore"; // Correct import
import { useNavigate } from "react-router-dom";

const Navbar = ({ className }) => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      className={`h-16 px-6 flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg fixed top-0 left-0 right-0 z-10 ${className}`}
    >
      {/* Logo */}
      <div
        className="flex items-center font-bold text-4xl cursor-pointer"
        onClick={() => navigate("/")}
      >
        SPEIS
      </div>

      {/* Search (only if logged in) */}
      {isAuthenticated && (
        <div className="flex-1 mx-4 flex justify-center">
          <input
            type="text"
            placeholder="Search Issue..."
            className="w-2/3 p-2 pl-5 pr-5 text-black rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      )}

      {/* Auth buttons */}
      <div>
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <button
              className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-gray-100 transition"
              onClick={() => navigate("/profile")}
            >
              My Page
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-gray-100 transition"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
