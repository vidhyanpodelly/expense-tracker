import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { api } from '../api/mockBackend';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('app_token'),
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const user = await api.auth.getMe(state.token);
          setState(prev => ({ ...prev, user, isAuthenticated: true, isLoading: false }));
        } catch (error) {
          localStorage.removeItem('app_token');
          setState(prev => ({ ...prev, token: null, user: null, isAuthenticated: false, isLoading: false }));
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
    loadUser();
  }, [state.token]);

  const login = async (data: any) => {
    const { token, user } = await api.auth.login(data);
    localStorage.setItem('app_token', token);
    setState({ token, user, isAuthenticated: true, isLoading: false });
  };

  const register = async (data: any) => {
    const { token, user } = await api.auth.register(data);
    localStorage.setItem('app_token', token);
    setState({ token, user, isAuthenticated: true, isLoading: false });
  };

  const logout = () => {
    localStorage.removeItem('app_token');
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
