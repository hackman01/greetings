import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || '';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setUser(res.data.user);
        setToken(storedToken);
      } catch {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const loginWithEmail = async (email, password) => {
    const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const registerWithEmail = async (name, email, password) => {
    const res = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const loginWithGoogle = async (code) => {
    const res = await axios.post(`${API_URL}/api/auth/google`, { code });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const loginAsGuest = async () => {
    const res = await axios.post(`${API_URL}/api/auth/guest`);
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const uploadPhoto = async (file) => {
    const formData = new FormData();
    formData.append('photo', file);
    const currentToken = localStorage.getItem('token');
    const res = await axios.post(`${API_URL}/api/auth/upload-photo`, formData, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    setUser((prev) => ({ ...prev, photoUrl: res.data.photoUrl }));
    return res.data.photoUrl;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginAsGuest,
        uploadPhoto,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
