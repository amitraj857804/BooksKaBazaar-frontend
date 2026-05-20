import React, { createContext, useContext, useState, useEffect } from 'react';
import { superAdminApi } from '../../services/superadmin/superAdminApi';

const SuperAdminContext = createContext();

export const SuperAdminProvider = ({ children }) => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('superAdminToken');
    const storedUser = localStorage.getItem('superAdminUser');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsSuperAdmin(true);
    }
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await superAdminApi.login(username, password);
      if (response.success) {
        const userData = { username };
        setToken(response.token);
        setUser(userData);
        setIsSuperAdmin(true);
        localStorage.setItem('superAdminToken', response.token);
        localStorage.setItem('superAdminUser', JSON.stringify(userData));
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err.message || 'An error occurred during login';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsSuperAdmin(false);
    setToken(null);
    setUser(null);
    localStorage.removeItem('superAdminToken');
    localStorage.removeItem('superAdminUser');
    localStorage.removeItem('superAdminPath');
  };

  const value = {
    isSuperAdmin,
    token,
    user,
    loading,
    error,
    login,
    logout,
  };

  return (
    <SuperAdminContext.Provider value={value}>
      {children}
    </SuperAdminContext.Provider>
  );
};

export const useSuperAdmin = () => {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error('useSuperAdmin must be used within SuperAdminProvider');
  }
  return context;
};
