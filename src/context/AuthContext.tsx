import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { User } from '../types/index.ts';
import { apiClient } from '../utils/api.ts';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface AuthResponse {
  user: User;
  token: string;
}

const STORAGE_TOKEN_KEY = 'authToken';
const STORAGE_USER_KEY = 'user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readStoredUser = (): User | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const cached = window.localStorage.getItem(STORAGE_USER_KEY);
  if (!cached) {
    return null;
  }

  try {
    return JSON.parse(cached) as User;
  } catch {
    window.localStorage.removeItem(STORAGE_USER_KEY);
    return null;
  }
};

const hasStoredToken = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  return !!window.localStorage.getItem(STORAGE_TOKEN_KEY);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => readStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => hasStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const persistSession = useCallback((authPayload: AuthResponse) => {
    const userPayload = {
      ...authPayload.user,
      avatarUrl:
        authPayload.user.avatarUrl ??
        `https://ui-avatars.com/api/?name=${encodeURIComponent(authPayload.user.name)}&background=2563eb&color=ffffff`,
    };

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_TOKEN_KEY, authPayload.token);
      window.localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userPayload));
    }

    setUser(userPayload);
    setIsAuthenticated(true);
  }, []);

  const clearSession = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_TOKEN_KEY);
      window.localStorage.removeItem(STORAGE_USER_KEY);
    }
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!hasStoredToken()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.get<{ user: User }>('/auth/me');
      const token = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_TOKEN_KEY) ?? '' : '';
      persistSession({ user: response.user, token });
    } catch (error) {
      clearSession();
      console.error('Session refresh failed', error);
    } finally {
      setIsLoading(false);
    }
  }, [clearSession, persistSession]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    persistSession(response);
  }, [persistSession]);

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const response = await apiClient.post<AuthResponse>('/auth/register', {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        password_confirmation: payload.passwordConfirmation,
      });
      persistSession(response);
    },
    [persistSession]
  );

  const logout = useCallback(async () => {
    try {
      if (hasStoredToken()) {
        await apiClient.post<{ message: string }>('/auth/logout');
      }
    } catch (error) {
      console.warn('Logout request failed', error);
    } finally {
      clearSession();
    }
  }, [clearSession]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
