import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, fetchCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

const TOKEN_KEY = 'careconnect_token';
const USER_ID_KEY = 'userId'; // 🔥 NEW

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY); // 🔥 CLEAR ALSO
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    fetchCurrentUser()
      .then((data) => {
        setUser(data);

        // 🔥 STORE USER ID HERE ALSO (important for refresh)
        if (data?.id) {
          localStorage.setItem(USER_ID_KEY, data.id);
        }
      })
      .catch(() => clearSession())
      .finally(() => setLoading(false));
  }, [clearSession]);

  const login = async (email, password) => {
    const data = await loginUser(email, password);

    localStorage.setItem(TOKEN_KEY, data.token);

    // 🔥 MOST IMPORTANT FIX
    if (data.user?.id) {
      localStorage.setItem(USER_ID_KEY, data.user.id);
    }

    setUser(data.user);
    return data.user;
  };

  const signup = async (data) => {
    await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    });
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isLogistics: user?.role === 'LOGISTICS',
        isDonor: user?.role === 'USER',
        isRecipient: user?.role === 'USER',
        isUser: user?.role === 'USER',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}