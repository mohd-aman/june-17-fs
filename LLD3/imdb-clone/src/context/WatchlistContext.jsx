import { useState, useEffect, createContext, useContext } from "react";

const WatchlistContext = createContext();

function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem("watchlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  function addToWatchlist(movie) {
    setWatchlist((prev) => {
      return [...prev, movie];
    });
  }

  function removeFromWatchlist(movieId) {
    setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
  }

  function isInWatchlist(movieId) {
    return watchlist.some((m) => m.id === movieId);
  }

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}


function useWatchlist(){
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
}


export {WatchlistProvider,useWatchlist};