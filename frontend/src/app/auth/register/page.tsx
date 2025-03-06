'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AuthCard from '@/components/ui/AuthCard';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { 
  useFormValidation, 
  required, 
  email, 
  strongPassword,
  passwordMatch,
  FormValues
} from '../hooks/useFormValidation';
import { useAuth } from '@/contexts/auth-context';
import { handleApiError } from '@/utils';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState<string>('');
  const { register, isLoading } = useAuth();

  const initialValues = {
    email: '',
    password: '',
    confirmPassword: ''
  };

  // Правила валідації форми
  const validationRules = {
    email: (value: string, values: FormValues) => {
      const requiredError = required('Email')(value, values);
      if (requiredError) return requiredError;
      return email(value, values);
    },
    password: (value: string, values: FormValues) => {
      const requiredError = required('Пароль')(value, values);
      if (requiredError) return requiredError;
      return strongPassword(value, values);
    },
    confirmPassword: (value: string, values: FormValues) => {
      const requiredError = required('Підтвердження пароля')(value, values);
      if (requiredError) return requiredError;
      return passwordMatch('password')(value, values);
    }
  };

  const { 
    values, 
    errors, 
    touched,
    isSubmitting, 
    handleChange, 
    handleBlur, 
    handleSubmit 
  } = useFormValidation(initialValues, validationRules);

  const onSubmit = async (formValues: Record<string, string>): Promise<void> => {
    try {
      setApiError('');
      await register(formValues.email, formValues.password);
      router.push('/');
    } catch (error) {
      console.error('Помилка реєстрації:', error);
      setApiError(handleApiError(error, 'Помилка при створенні облікового запису'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      <AuthCard 
        title="Реєстрація" 
        subtitle="Створіть обліковий запис для використання системи"
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
            placeholder="Створіть надійний пароль"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password ? errors.password : ''}
            autoComplete="new-password"
            helperText="Пароль повинен містити мінімум 8 символів, включати цифри, великі та малі літери"
          />
          
          <Input
            type="password"
            name="confirmPassword"
            label="Повторіть пароль"
            placeholder="Введіть пароль ще раз"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.confirmPassword ? errors.confirmPassword : ''}
            autoComplete="new-password"
          />
          
          <div className="text-sm text-center">
            Вже маєте обліковий запис?{' '}
            <Link 
              href="/auth/login" 
              className="text-accent hover:text-accent-hover transition-colors"
            >
              Увійти
            </Link>
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            isLoading={isSubmitting || isLoading}
          >
            Зареєструватись
          </Button>
        </form>
      </AuthCard>
    </div>
  );
};

export default RegisterPage; 