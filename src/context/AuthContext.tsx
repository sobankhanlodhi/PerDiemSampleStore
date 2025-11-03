
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth } from '@react-native-firebase/auth';
import { StorageHelper } from '../utils/storage';
import { firebaseApiLogout, verifyToken } from '../api/auth';
import { CUSTOM_KEYS } from '../utils/constants';

interface User {
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const authInstance = getAuth();
  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const storedToken = StorageHelper.getToken();
      const storedUser = StorageHelper.getUserInfo();
      const authSource = StorageHelper.getAuthSource();

      if (storedToken && storedUser) {
        if (authSource === CUSTOM_KEYS.firebase) {
          const firebaseUser = authInstance.currentUser;
          if (firebaseUser) {
            setToken(storedToken);
            setUser(storedUser);
          } else {
            StorageHelper.clearAuth();
            setToken(null);
            setUser(null);
          }
        } else {
          const verifyResult = await verifyToken(storedToken);
          if (verifyResult.success && verifyResult.user) {
            setToken(storedToken);
            setUser(verifyResult.user);
            StorageHelper.setUserInfo(verifyResult.user);
          } else {
            setToken(storedToken);
            setUser(storedUser);
          }
        }
      } else if (storedToken && !storedUser) {
        StorageHelper.clearAuth();
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      const storedToken = StorageHelper.getToken();
      const storedUser = StorageHelper.getUserInfo();
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      } else {
        StorageHelper.clearAuth();
        setToken(null);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = (authToken: string, userData: User) => {
    setToken(authToken);
    setUser(userData);
    StorageHelper.setToken(authToken);
    StorageHelper.setUserInfo(userData);
  };

  const logout = async () => {
    try {
      const authSource = StorageHelper.getAuthSource();
      if (authSource === CUSTOM_KEYS.firebase) {
        await firebaseApiLogout();
      }
      setToken(null);
      setUser(null);
      StorageHelper.clearAuth();
    } catch (error) {
      setToken(null);
      setUser(null);
      StorageHelper.clearAuth();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('context is undefined, useAuth must be used within an AuthProvider');
  }
  return context;
};

