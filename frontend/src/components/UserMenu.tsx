'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

interface UserMenuProps {
  className?: string;
}

/**
 * Компонент меню користувача з можливістю виходу
 */
export const UserMenu: React.FC<UserMenuProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // Закриття меню при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isAuthenticated || !user) {
    return null;
  }
  
  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Помилка при виході:', error);
    }
  };

  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };

  // Отримуємо першу літеру для аватара
  const getInitial = (): string => {
    return user.email[0].toUpperCase();
  };

  // Отримуємо ім'я користувача з емейлу (до @)
  const getUserDisplayName = (): string => {
    return user.email.split('@')[0];
  };

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center space-x-2 text-accent-hover hover:text-accent-bright group transition-all duration-300 focus:outline-none"
      >
        <div className="w-9 h-9 rounded-full bg-dark-600 border border-dark-500 group-hover:bg-dark-500 flex items-center justify-center text-accent-bright shadow-md transition-all duration-300">
          {getInitial()}
        </div>
        <span className="hidden sm:inline-block">{getUserDisplayName()}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-dark-800 rounded-lg shadow-lg py-1 z-20 border border-dark-600 backdrop-blur-sm bg-opacity-95">
          <div className="px-4 py-3 text-sm text-accent-bright border-b border-dark-600">
            <div className="font-medium truncate">{user.email}</div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-accent-hover hover:bg-dark-700 hover:text-error transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M17 6a1 1 0 00-1-1h-4a1 1 0 100 2h3v10H5V7h3a1 1 0 100-2H4a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V6z" clipRule="evenodd" />
            </svg>
            Вийти
          </button>
        </div>
      )}
    </div>
  );
}; 