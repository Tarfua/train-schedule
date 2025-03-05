import React from 'react';
import Alert from './Alert';

interface ErrorMessageProps {
  /**
   * Текст повідомлення про помилку
   */
  message: string;
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
 * Компонент для відображення повідомлень про помилки
 * Використовує компонент Alert з типом 'error'
 * 
 * @param props Властивості компонента
 * @returns Компонент ErrorMessage
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message,
  className = '',
  dismissible = false,
  onDismiss
}) => {
  if (!message) return null;
  
  return (
    <Alert
      message={message}
      type="error"
      className={className}
      dismissible={dismissible}
      onDismiss={onDismiss}
    />
  );
};

export default ErrorMessage; 