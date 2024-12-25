import React from "react";
import { useNavigate } from "react-router-dom";

const MiniHeader = () => {
  const navigate =useNavigate();

  const handleClick = (value) => { 
    navigate(`/content/${value}`);
  }

  return (
    <header className="p-1 bg-slate-400 text-black flex justify-center items-center">
      <div className="flex space-x-6">
        <button onClick={()=>handleClick("latest-news")} className="font-medium text-xs sm:text-base hover:bg-slate-500 hover:text-white rounded-md p-1">Latest News</button>
        <button onClick={()=>handleClick("news")} className="font-medium text-xs sm:text-base hover:bg-slate-500 hover:text-white rounded-md p-1">India News</button>
        <button onClick={()=>handleClick("companies")} className="font-medium text-xs sm:text-base hover:bg-slate-500 hover:text-white rounded-md p-1">Companies</button>
        <button onClick={()=>handleClick("money")} className="font-medium text-xs sm:text-base hover:bg-slate-500 hover:text-white rounded-md p-1">Money</button>
        <button onClick={()=>handleClick("technology")} className="font-medium text-xs sm:text-base hover:bg-slate-500 hover:text-white rounded-md p-1">Technology</button>
        <button onClick={()=>handleClick("sports")} className="font-medium text-xs sm:text-base hover:bg-slate-500 hover:text-white rounded-md p-1">Sports</button>
      </div>
    </header>
  );
};

export default MiniHeader;
