import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users } from "lucide-react";

const Sidebar = ({ className }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`md:fixed top-15 left-0 h-full md:w-60 bg-gray-900 text-white py-6 ${className}`}
    >
      <ul className="space-y-4">
        <li>
          <Link
            to="/"
            className={`flex items-center space-x-3 px-6 py-3 rounded-md transition ${
              isActive("/") ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-sm font-medium">Home</span>
          </Link>
        </li>
        <li>
          <Link
            to="/teams"
            className={`flex items-center space-x-3 px-6 py-3 rounded-md transition ${
              isActive("/teams") ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-sm font-medium">Teams</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
