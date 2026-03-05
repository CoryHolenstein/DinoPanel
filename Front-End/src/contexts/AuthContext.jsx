import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('steamUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Simulated Steam login - In production, this would redirect to Steam OAuth
  const loginWithSteam = () => {
    // Simulate Steam OAuth flow
    // In production: window.location.href = `YOUR_BACKEND_URL/auth/steam`;
    
    // Dummy user data
    const dummyUser = {
      steamId: '76561198012345678',
      personaName: 'Hornsnickle',
      avatar: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
      profileUrl: 'https://steamcommunity.com/id/hornsnickle'
    };
    
    setUser(dummyUser);
    localStorage.setItem('steamUser', JSON.stringify(dummyUser));
    // Note: After login, the component will handle navigation
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('steamUser');
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    loginWithSteam,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
