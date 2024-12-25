import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate =useNavigate();

  const handleClick = (value) => {
    navigate(`/content/${value}`);
  }
  return (
    <div>
      {/* Sidebar Background Overlay */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-50 ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)} // Close sidebar when clicking outside
      >
        <div
          className={`fixed left-0 top-0 bg-white md:w-64 w-48 h-full p-4 transition-transform transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-xl text-black mb-6"
          >
            Close Sidebar
          </button>
          <ul>
            <li className="mb-4">
              <a onClick={()=>handleClick("latest-news")} className="text-lg text-black hover:cursor-pointer">Latest News</a>
            </li>
            <li className="mb-4">
              <a onClick={()=>handleClick("news")} className="text-lg text-black hover:cursor-pointer">Indian News</a>
            </li>
            <li className="mb-4">
              <a onClick={()=>handleClick("companies")} className="text-lg text-black hover:cursor-pointer">Companies</a>
            </li>
            <li className="mb-4">
              <a onClick={()=>handleClick("money")} className="text-lg text-black hover:cursor-pointer">Money</a>
            </li>
            <li className="mb-4">
              <a onClick={()=>handleClick("technology")} className="text-lg text-black hover:cursor-pointer">Technology</a>
            </li>
            <li className="mb-4">
              <a onClick={()=>handleClick("sports")} className="text-lg text-black hover:cursor-pointer">Sports</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
