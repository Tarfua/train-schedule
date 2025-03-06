import { useState, ChangeEvent, FormEvent } from 'react';

export type FormValues = Record<string, string>;

export type FormErrors = Record<string, string>;

export type FieldValidator = (value: string, values: FormValues) => string | null;

export type ValidationRules = Record<string, FieldValidator>;

export const useFormValidation = (
  initialValues: FormValues,
  validationRules: ValidationRules
) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, values[name]);
  };

  const validateField = (name: string, value: string): boolean => {
    const validator = validationRules[name];
    if (!validator) return true;
    
    const error = validator(value, values);
    setErrors(prev => ({ ...prev, [name]: error || '' }));
    return !error;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const validator = validationRules[fieldName];
      const error = validator(values[fieldName], values);
      
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (onSubmit: (values: FormValues) => Promise<void>) => {
    return async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      
      const allTouched: Record<string, boolean> = {};
      Object.keys(validationRules).forEach(field => {
        allTouched[field] = true;
      });
      setTouched(allTouched);

      const isValid = validateForm();
      
      if (isValid) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Помилка відправлення форми:', error);
        } finally {
          setIsSubmitting(false);
        }
      }
    };
  };

  const resetForm = (): void => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues
  };
};

export const required = (fieldName: string): FieldValidator => {
  return (value: string) => {
    return value.trim() ? null : `${fieldName} є обов'язковим`;
  };
};

export const minLength = (fieldName: string, min: number): FieldValidator => {
  return (value: string) => {
    return value.length >= min ? null : `${fieldName} має містити мінімум ${min} символів`;
  };
};

export const maxLength = (fieldName: string, max: number): FieldValidator => {
  return (value: string) => {
    return value.length <= max ? null : `${fieldName} має містити максимум ${max} символів`;
  };
};

export const email: FieldValidator = (value: string) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(value) ? null : 'Введіть коректний email';
};

export const passwordMatch = (passwordField: string): FieldValidator => {
  return (value: string, values: FormValues) => {
    return value === values[passwordField] ? null : 'Паролі не співпадають';
  };
};

export const strongPassword: FieldValidator = (value: string) => {
  const hasNumber = /\d/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const isValid = hasNumber && hasUpper && hasLower && value.length >= 8;
  
  return isValid ? null : 'Пароль має містити мінімум 8 символів, цифри, великі та малі літери';
}; 