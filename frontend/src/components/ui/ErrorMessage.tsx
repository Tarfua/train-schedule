import React from 'react';
import Alert from './Alert';

interface ErrorMessageProps {
  message: string;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

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