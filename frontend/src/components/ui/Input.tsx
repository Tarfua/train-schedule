import React, { InputHTMLAttributes, forwardRef } from 'react';
import ErrorMessage from './ErrorMessage';

/**
 * Інтерфейс для властивостей компонента Input
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * UI компонент для вводу тексту з підтримкою валідації
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm font-medium mb-1 text-accent">{label}</label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 rounded-lg bg-dark-700 border text-sm outline-none transition-all duration-200 ease-in-out
            ${error ? 'border-error focus:border-error focus:ring-2 focus:ring-error/50' : 'border-dark-500 focus:border-accent-hover'}
            ${className}`}
          {...props}
        />
        {error && <ErrorMessage message={error} className="mt-2 mb-0" />}
        {helperText && !error && <p className="mt-1 text-sm text-dark-300">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 