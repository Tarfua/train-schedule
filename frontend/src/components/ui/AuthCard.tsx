import React, { ReactNode } from 'react';

/**
 * Інтерфейс для властивостей компонента AuthCard
 */
interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/**
 * UI компонент для відображення карточки автентифікації
 */
const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, children }) => {
  return (
    <div className="max-w-md w-full mx-auto bg-dark-800 rounded-xl shadow-lg p-8 border border-dark-600">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-accent mb-2">{title}</h1>
        {subtitle && <p className="text-dark-300">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
};

export default AuthCard; 