import React, { createContext, useState, useContext, useEffect } from 'react';


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user was previously logged in
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const login = (userEmail) => {
    setEmail(userEmail);
    setIsLoggedIn(true);
    localStorage.setItem('userEmail', userEmail);
    
    // Clear browser history to prevent going back to login page
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', function() {
      window.history.pushState(null, '', window.location.href);
    });
  };

  const logout = () => {
    setEmail('');
    setIsLoggedIn(false);
    localStorage.removeItem('userEmail');
    
    // Remove the popstate event listener when logging out
    window.removeEventListener('popstate', function() {
      window.history.pushState(null, '', window.location.href);
    });
  };

  const value = {
    isLoggedIn,
    email,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
