'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { UserData, createAuthService } from '@/services/auth-service';

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): React.ReactElement => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  
  // Створюємо authService один раз при монтуванні компонента
  const authService = useMemo(() => createAuthService(), []);

  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      if (!authService.isAuthenticated()) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const accessToken = authService.getAccessToken();
      if (!accessToken) {
        await authService.logout();
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Декодуємо JWT токен
      const tokenParts = accessToken.split('.');
      if (tokenParts.length !== 3) {
        await authService.logout();
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const payload = JSON.parse(atob(tokenParts[1]));
        if (payload && payload.email) {
          setUser({
            id: payload.sub || 'user-id',
            email: payload.email
          });
        } else {
          await authService.logout();
          setUser(null);
        }
      } catch (e) {
        console.error('Помилка при декодуванні токена:', e);
        await authService.logout();
        setUser(null);
      }
    } catch (error) {
      console.error('Помилка при отриманні даних користувача:', error);
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [authService]); // Тепер залежить тільки від authService, який не змінюється

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      router.push('/');
    } catch (error) {
      console.error('Помилка при вході:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.register({ 
        email, 
        password
      });
      setUser(response.user);
      router.push('/');
    } catch (error) {
      console.error('Помилка при реєстрації:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setUser(null);
      router.push('/auth/login');
    } catch (error) {
      console.error('Помилка при виході:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 