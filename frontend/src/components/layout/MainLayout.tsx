import React, { ReactNode } from 'react';
import Header from '../common/Header';

/**
 * Інтерфейс для властивостей головного макету
 */
interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Головний макет додатку, який включає заголовок і контейнер для контенту
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-850 text-accent">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-6 py-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout; 