// NewsContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';

const NewsContext = createContext();

const initialState = {
  news: [],
  summaries: {},
  savedItems: [],
  activeIndex: null,
};

const newsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NEWS':
      return { ...state, news: action.payload };
    case 'SET_SUMMARIES':
      return { 
        ...state, 
        summaries: { ...state.summaries, [action.payload.index]: action.payload.summary }
      };
    case 'SET_ACTIVE_INDEX':
      return { ...state, activeIndex: action.payload };
    case 'ADD_SAVED_ITEM':
      return { ...state, savedItems: [...state.savedItems, action.payload] };
    default:
      return state;
  }
};

export const NewsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(newsReducer, initialState);

  const fetchNews = useCallback(async (value) => {
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/scrape`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ value }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch({ type: 'SET_NEWS', payload: data.data });
      } else {
        console.error("Error during POST request");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  const fetchSummary = useCallback(async (index, link) => {
    dispatch({ type: 'SET_ACTIVE_INDEX', payload: index });
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/scrape-paragraphs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ url: link }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        dispatch({ 
          type: 'SET_SUMMARIES', 
          payload: { index, summary: data.data }
        });
      } else {
        const errorMessage = data.message || "An unexpected error occurred.";
        dispatch({ 
          type: 'SET_SUMMARIES', 
          payload: { index, summary: errorMessage }
        });
      }
    } catch (error) {
      console.error("Error:", error);
      dispatch({ 
        type: 'SET_SUMMARIES', 
        payload: { index, summary: "An error occurred while fetching the summary." }
      });
    }
  }, []);

  const saveContent = useCallback(async (index, item) => {
    const { imgSrc, imgTitle, href } = item;
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/save-content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ imgSrc, imgTitle, href }),
      });

      if (response.ok) {
        dispatch({ type: 'ADD_SAVED_ITEM', payload: index });
      } else {
        console.error("Failed to save content");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  const closeSummary = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_INDEX', payload: null });
  }, []);

  const deleteSavedItem = useCallback(async(itemId)=>{
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/unsave-item/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:'include'
      });

      if (!response.ok) {
        throw new Error('Failed to unsave the item');
      }

    } catch (error) {
      console.error('Error unsaving item:', error);
    }
  })
  

  return (
    <NewsContext.Provider 
      value={{
        ...state,
        fetchNews,
        fetchSummary,
        saveContent,
        closeSummary,
        deleteSavedItem,    
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};