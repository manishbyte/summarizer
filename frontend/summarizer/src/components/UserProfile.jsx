import React, { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { User, Mail, BookMarked, BookmarkMinus, Edit, LogOut, LogIn } from 'lucide-react';
import { useNews } from '../context/NewsContext';

const UserProfile = () => {
  const { user, fetchProfile, logoutUser } = useContext(AuthContext);
  const { news, fetchSummary, summaries, activeIndex, closeSummary } = useNews();

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const handleUnsaveItem = async (itemId) => {
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/unsave-item/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to unsave the item');
      }

      fetchProfile();
    } catch (error) {
      console.error('Error unsaving item:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b to-white py-8 px-4 sm:px-6 lg:px-8">
      {/* Profile Section */}
      <div className="max-w-xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gray-600 h-32 sm:h-40 md:h-48"></div>
          <div className="relative px-4 pb-6 sm:px-6">
            <div className="flex flex-col items-center">
              <div className="absolute -top-16 ring-4 ring-white rounded-full bg-white p-2">
                <div className="bg-slate-300 rounded-full p-4 sm:p-5">
                  <User size={40} className="text-gray-900" />
                </div>
              </div>

              {user ? (
                <div className="mt-16 text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{user.name}</h2>
                  <div className="mt-2 text-gray-600 flex items-center justify-center">
                    <Mail className="mr-2" size={16} />
                    <span className="text-sm sm:text-base">{user.email}</span>
                  </div>

                  {/* Action Icons */}
                  <div className="mt-4 flex items-center justify-center space-x-6">
                    <button
                      onClick={() => alert('Navigate to Edit Profile')}
                      className="flex items-center text-gray-700 hover:text-gray-900"
                    >
                      <Edit size={20} className="mr-1" />
                      <span className="text-sm font-medium">Edit Profile</span>
                    </button>
                    {!user ? (
                      <button
                        onClick={() => alert('Navigate to Login Page')}
                        className="flex items-center text-black hover:text-gray-900"
                      >
                        <LogIn size={20} className="mr-1" />
                        <span className="text-sm font-medium">Login</span>
                      </button>
                    ) : (
                      <button
                        onClick={logoutUser}
                        className="flex items-center text-gray-700 hover:text-gray-900"
                      >
                        <LogOut size={20} className="mr-1" />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    )}
                    
                  </div>
                </div>
              ) : (
                <div className="mt-16 text-center">
                  <div className="animate-pulse">
                    <div className="h-8 w-40 sm:w-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Saved Items Section */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
          <div className="flex items-center mb-4 sm:mb-6">
            <BookMarked className="text-black mr-3" size={20} />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Saved Items</h3>
          </div>

          {user && user.savedItems && user.savedItems.length > 0 ? (
            <div className="space-y-4">
              {user.savedItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start space-x-0 sm:space-x-4 py-4 border-b border-gray-100"
                >
                  <div className="flex-grow">
                    <a href={item.href} className="group">
                      <h2 className="font-semibold text-sm sm:text-base mb-2">
                        {item.imgTitle}
                      </h2>
                    </a>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => fetchSummary(index, item.href)}
                        className="bg-slate-400 rounded-xl w-full font-medium hover:bg-slate-600 hover:text-slate-100 sm:p-2"
                      >
                        Summarize
                      </button>
                      <button
                        onClick={() => handleUnsaveItem(item._id)}
                        className="text-gray-500 mb-1 p-4 hover:text-gray-900"
                      >
                        <BookmarkMinus size={20} />
                      </button>
                    </div>
                    {/* Summary Content */}
                    {activeIndex === index && (
                      <div className="mt-4 w-full p-4 bg-gray-100 rounded relative">
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
                          <p className="text-sm text-gray-500">
                            Loading summary...
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Image Section */}
                  <div className="flex-shrink-0 mt-4 sm:mt-0">
                    <img
                      src={item.imgSrc}
                      alt={item.imgTitle}
                      className="w-24 h-24 sm:w-24 sm:h-24 object-cover rounded-lg mx-auto sm:mx-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookMarked className="text-gray-900" size={24} />
              </div>
              <h4 className="text-xl font-semibold text-gray-600 mb-2">
                No Saved Items Yet
              </h4>
              <p className="text-gray-500">
                Your saved articles and news will appear here.{' '}
                <span onClick={fetchProfile} className="text-black hover:cursor-pointer">
                  or refresh here
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
