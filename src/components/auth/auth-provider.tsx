import { createContext, ReactNode, useEffect, useState } from 'react';

import { LoginResponse, Server, UserInfo } from '@/hooks/types/auth';

// Enhanced context type with full user data
interface AuthContextType {
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  servers: Server[] | null;
  token: string | null;
  login: (response: LoginResponse) => void;
  logout: () => void;
  updateUserInfo: (newUserInfo: Partial<UserInfo>) => void;
  updateServers: (newServers: Server[]) => void;
}

// Create context with more descriptive undefined check
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  SERVERS: 'servers',
} as const;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [servers, setServers] = useState<Server[] | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load all stored data on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const storedUserInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    const storedServers = localStorage.getItem(STORAGE_KEYS.SERVERS);

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }

    if (storedUserInfo) {
      try {
        setUserInfo(JSON.parse(storedUserInfo));
      } catch (error) {
        console.error('Error parsing stored user info:', error);
        localStorage.removeItem(STORAGE_KEYS.USER_INFO);
      }
    }

    if (storedServers) {
      try {
        setServers(JSON.parse(storedServers));
      } catch (error) {
        console.error('Error parsing stored servers:', error);
        localStorage.removeItem(STORAGE_KEYS.SERVERS);
      }
    }
  }, []);

  const login = (response: LoginResponse) => {
    // Store token
    localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    setToken(response.token);
    setIsAuthenticated(true);

    // Store user info
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(response.userInfo));
    setUserInfo(response.userInfo);

    // Store servers
    localStorage.setItem(STORAGE_KEYS.SERVERS, JSON.stringify(response.servers));
    setServers(response.servers);
  };

  const logout = () => {
    // Clear all stored data
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    localStorage.removeItem(STORAGE_KEYS.SERVERS);

    // Reset state
    setToken(null);
    setUserInfo(null);
    setServers(null);
    setIsAuthenticated(false);
  };

  const updateUserInfo = (newUserInfo: Partial<UserInfo>) => {
    setUserInfo(currentUserInfo => {
      if (currentUserInfo) {
        const updatedUserInfo = { ...currentUserInfo, ...newUserInfo };
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(updatedUserInfo));
        return updatedUserInfo;
      }
      return currentUserInfo;
    });
  };

  const updateServers = (newServers: Server[]) => {
    setServers(newServers);
    localStorage.setItem(STORAGE_KEYS.SERVERS, JSON.stringify(newServers));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userInfo,
        servers,
        token,
        login,
        logout,
        updateUserInfo,
        updateServers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
