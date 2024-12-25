// ContentPage.js
import React, { useEffect,useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { useNews } from "../context/NewsContext";
import AuthContext from "../context/AuthContext";

const ContentPage = () => {
  const { user, fetchProfile} = useContext(AuthContext);
  const { value = "latest-news" } = useParams();

  const {
    news,
    summaries,
    savedItems,
    activeIndex,
    fetchNews,
    fetchSummary,
    saveContent,
    closeSummary
  } = useNews();

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
    fetchNews(value);
  }, [value, fetchNews]);

  const headings = {
    "latest-news": "Latest News",
    news: "Indian News",
    companies: "Companies News",
    money: "Money News",
    technology: "Technology News",
    sports: "Sports News",
  };
  {!user?
  <Link to="/login" className="text-center text-gray-500">Please Login</Link>:''}

  return (
    <div className="max-w-xl mx-auto">
      <div className="p-4">
        <h1 className="text-2xl underline font-bold mb-4">{headings[value]}</h1>
        <div className="space-y-4">
          {news.length > 0 ? (
            news.map((item, index) => (
              <div key={index} className="border-b border-gray-100 pb-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-grow">
                    <h2 className="font-semibold hover:cursor-pointer text-xs md:text-lg mb-2">
                      {item.imgTitle}
                    </h2>
                    <div className="flex space-x-2 mt-1">
                      <button
                        className="bg-slate-400 rounded-xl font-medium hover:bg-slate-600 hover:text-slate-100 md:p-1 flex-grow"
                        onClick={() => fetchSummary(index, item.href)}
                      >
                        Summarize
                      </button>
                      <button
                        onClick={() => saveContent(index, item)}
                        className="px-3 py-1 transition-colors flex items-center justify-center min-w-[40px]"
                      >
                        <Bookmark
                          size={20}
                          className={`${
                            savedItems.includes(index)
                              ? "fill-gray-700 text-gray-900"
                              : "text-gray-900"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <img
                      src={item.imgSrc}
                      alt={item.imgTitle}
                      className="md:w-24 md:h-24 w-12 h-12 object-cover hover:cursor-pointer rounded-lg"
                    />
                  </div>
                </div>
                {activeIndex === index && (
                  <div className="mt-2 p-2 bg-gray-100 rounded relative">
                    <button
                      className="absolute top-1 right-2 text-gray-600 hover:text-red-500 font-bold text-xl"
                      onClick={closeSummary}
                    >
                      &times;
                    </button>
                    {summaries[index] ? (
                      <p className="md:text-base text-sm md:font-medium text-gray-800 leading-5 whitespace-pre-wrap">
                        {summaries[index]}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">Loading summary...</p>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Loading news...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentPage;