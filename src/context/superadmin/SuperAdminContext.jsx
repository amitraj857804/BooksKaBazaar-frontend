import React, { createContext, useContext, useState, useEffect } from 'react';
import { superAdminApi } from '../../services/superadmin/superAdminApi';

const SuperAdminContext = createContext();

export const SuperAdminProvider = ({ children }) => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);  // Start with loading = true
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    
    const storedToken = localStorage.getItem('superAdminToken');
    
    if (storedToken) {
      setToken(storedToken);
      setIsSuperAdmin(true);
    } 
    
    // Mark as initialized
    setInitialized(true);
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await superAdminApi.login(username, password);
      if (response.success) {
        setToken(response.token);
        setIsSuperAdmin(true);
        localStorage.setItem('superAdminToken', response.token);
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred during login';
      console.error('Login error:', {
        status: err.response?.status,
        message: errorMessage,
        data: err.response?.data
      });
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsSuperAdmin(false);
    setToken(null);
    localStorage.removeItem('superAdminToken');
  };

  const value = {
    isSuperAdmin,
    token,
    loading,
    error,
    initialized,
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
