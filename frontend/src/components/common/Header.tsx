'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { UserMenu } from '@/components/UserMenu';

const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-dark-800 py-4 shadow-md">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Логотип/Назва додатку зліва */}
        <div className="flex items-center">
          <Link href="/" className="text-accent-hover text-xl font-medium hover:text-accent transition-colors duration-300">
            TrainSchedule
          </Link>
          
          {/* Навігаційне меню для авторизованих користувачів */}
          {isAuthenticated && (
            <nav className="ml-8 hidden md:flex space-x-4">
              <Link 
                href="/schedule"
                className="text-accent-light hover:text-accent transition-colors duration-300"
              >
                Розклад
              </Link>
              <Link 
                href="/stations"
                className="text-accent-light hover:text-accent transition-colors duration-300"
              >
                Станції
              </Link>
            </nav>
          )}
        </div>

        {/* Кнопка входу або меню користувача справа */}
        <div>
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Link 
              href="/auth/login" 
              className="px-5 py-2 bg-dark-600 hover:bg-dark-500 text-accent rounded-full transition-all duration-300 shadow"
            >
              Увійти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 