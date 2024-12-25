import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { User, LogIn } from "lucide-react"; // Import User and LogIn icons
import Sidebar from "./Sidebar"; // Import the Sidebar component
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Header = () => {
  const { user, fetchProfile} = useContext(AuthContext);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  return (
    <div>
      {/* Sidebar component */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-gray-950 text-white">
        {/* Left side: Hamburger menu */}
        <div className="lg:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)} // Toggle sidebar visibility
            className="text-2xl text-black"
          >
            ☰
          </button>
        </div>

        {/* Middle: Name (only on desktop) */}
        <div className="lg:block flex-grow text-center md:text-start">
          <h1 className="text-xl font-semibold">Summarizer</h1>
        </div>

        {/* Right side: Search and User icons */}
        <div className="flex items-center gap-4">
          {/* Search Icon */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)} // Toggle input visibility on click
              className="text-2xl"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>

            {/* Search input that opens on click */}
            {searchOpen && (
              <input
                type="text"
                placeholder="Search..."
                className="absolute right-0 top-0 mt-8 p-2 border border-gray-600 rounded-lg w-48 sm:w-64 lg:w-80"
              />
            )}
          </div>

          {/* User/Login Icon */}
          {user ? (
            <Link to={"/profile"}>
              <button className="text-2xl">
                <User />
              </button>
            </Link>
          ) : (
            <Link to={"/login"}>
              <button className="text-2xl">
                <LogIn />
              </button>
            </Link>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
