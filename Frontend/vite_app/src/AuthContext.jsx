import React, { createContext, useState, useEffect } from 'react';
import { fetchLibrary } from './services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [library, setLibrary] = useState(new Set());

  useEffect(() => {
    const loadLibrary = async () => {
      if (authToken) {
        try {
          const libraryGames = await fetchLibrary();
          setLibrary(new Set(libraryGames.map(g => g._id)));
        } catch (error) {
          setLibrary(new Set());
        }
      } else {
        setLibrary(new Set());
      }
    };
    loadLibrary();
  }, [authToken]);

  const updateLibrary = (gameId, newState) => {
    setLibrary(prev => {
      const newLibrary = new Set(prev);
      if (newState) {
        newLibrary.add(gameId);
      } else {
        newLibrary.delete(gameId);
      }
      return newLibrary;
    });
  };

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, library, updateLibrary }}>
      {children}
    </AuthContext.Provider>
  );
};