import React, { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Correctly import jwtDecode

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? jwtDecode(token) : null; // Use jwtDecode function correctly
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
