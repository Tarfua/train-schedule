'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AuthCard from '@/components/ui/AuthCard';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useFormValidation, required, email, FormValues } from '../hooks/useFormValidation';
import { useAuth } from '@/contexts/auth-context';
import { handleApiError } from '@/utils';

/**
 * Сторінка входу в систему
 */
const LoginPage: React.FC = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState<string>('');
  const { login, isLoading } = useAuth();

  // Початкові значення форми
  const initialValues = {
    email: '',
    password: ''
  };

  // Правила валідації форми
  const validationRules = {
    email: (value: string, values: FormValues) => {
      const requiredError = required('Email')(value, values);
      if (requiredError) return requiredError;
      return email(value, values);
    },
    password: required('Пароль')
  };

  // Використання хука валідації форми
  const { 
    values, 
    errors, 
    touched,
    isSubmitting, 
    handleChange, 
    handleBlur, 
    handleSubmit 
  } = useFormValidation(initialValues, validationRules);

  /**
   * Обробник відправлення форми
   * @param formValues Значення полів форми
   */
  const onSubmit = async (formValues: Record<string, string>): Promise<void> => {
    try {
      setApiError('');
      await login(formValues.email, formValues.password);
      router.push('/');
    } catch (error) {
      console.error('Помилка входу:', error);
      setApiError(handleApiError(error, 'Невірний email або пароль'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      <AuthCard 
        title="Вхід до системи" 
        subtitle="Введіть дані вашого облікового запису"
      >
        <ErrorMessage 
          message={apiError} 
          dismissible
          onDismiss={() => setApiError('')}
        />
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="email"
            name="email"
            label="Електронна пошта"
            placeholder="Введіть вашу електронну пошту"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : ''}
            autoComplete="email"
          />
          
          <Input
            type="password"
            name="password"
            label="Пароль"
            placeholder="Введіть ваш пароль"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password ? errors.password : ''}
            autoComplete="current-password"
          />
          
          <div className="text-sm">
            <Link 
              href="/auth/register" 
              className="text-accent hover:text-accent-hover transition-colors"
            >
              Створити новий обліковий запис
            </Link>
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            isLoading={isSubmitting || isLoading}
          >
            Увійти
          </Button>
        </form>
      </AuthCard>
    </div>
  );
};

export default LoginPage; 