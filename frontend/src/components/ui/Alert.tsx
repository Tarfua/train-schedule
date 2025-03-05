import React from 'react';

/**
 * Типи сповіщень
 */
export type AlertType = 'error' | 'success' | 'info' | 'warning';

/**
 * Інтерфейс для властивостей компонента Alert
 */
interface AlertProps {
  /**
   * Текст повідомлення
   */
  message: string;
  /**
   * Тип сповіщення
   */
  type?: AlertType;
  /**
   * CSS класи для додаткового стилізування
   */
  className?: string;
  /**
   * Чи показувати іконку закриття
   */
  dismissible?: boolean;
  /**
   * Обробник закриття сповіщення
   */
  onDismiss?: () => void;
}

/**
 * Компонент для відображення різних типів сповіщень
 * 
 * @param props Властивості компонента
 * @returns Компонент Alert
 */
const Alert: React.FC<AlertProps> = ({ 
  message, 
  type = 'info',
  className = '',
  dismissible = false,
  onDismiss
}) => {
  if (!message) return null;
  
  const getTypeStyles = (): string => {
    switch (type) {
      case 'error':
        return 'bg-error/10 border-l-4 border-error border-r border-t border-b border-error/30 text-error-light shadow-[0_0_15px_rgba(255,59,48,0.2)]';
      case 'success':
        return 'bg-success/15 border-l-4 border-success text-success-light';
      case 'warning':
        return 'bg-warning/15 border-l-4 border-warning text-warning-light';
      default:
        return 'bg-info/15 border-l-4 border-info text-info-light';
    }
  };
  
  const getIcon = (): React.ReactNode => {
    switch (type) {
      case 'error':
        return (
          <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  return (
    <div 
      className={`
        mb-4 p-4 
        rounded-lg
        shadow-sm
        ${getTypeStyles()}
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-center">
        {getIcon()}
        <span className="text-sm font-medium">{message}</span>
        
        {dismissible && onDismiss && (
          <button 
            type="button"
            className={`
              ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 
              inline-flex h-8 w-8 
              focus:outline-none focus:ring-2 
              ${type === 'error' ? 'hover:bg-error/25 focus:ring-error' : 'hover:bg-black/10 focus:ring-gray-600'}
              transition-colors
            `}
            onClick={onDismiss}
            aria-label="Закрити"
          >
            <span className="sr-only">Закрити</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert; 