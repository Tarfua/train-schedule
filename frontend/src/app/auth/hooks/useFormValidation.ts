import { useState, ChangeEvent, FormEvent } from 'react';

/**
 * Тип для значень форми
 */
export type FormValues = Record<string, string>;

/**
 * Тип для помилок валідації форми
 */
export type FormErrors = Record<string, string>;

/**
 * Тип для функції валідації поля
 */
export type FieldValidator = (value: string, values: FormValues) => string | null;

/**
 * Тип для правил валідації форми
 */
export type ValidationRules = Record<string, FieldValidator>;

/**
 * Хук для валідації форм
 * @param initialValues Початкові значення полів форми
 * @param validationRules Правила валідації полів
 * @returns Стан та методи для роботи з формою
 */
export const useFormValidation = (
  initialValues: FormValues,
  validationRules: ValidationRules
) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /**
   * Змінює значення поля форми
   * @param e Подія зміни
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    
    // Валідуємо поле при зміні, якщо воно вже було "торкнуте"
    if (touched[name]) {
      validateField(name, value);
    }
  };

  /**
   * Обробляє подію втрати фокусу полем
   * @param e Подія втрати фокусу
   */
  const handleBlur = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, values[name]);
  };

  /**
   * Валідує одне поле форми
   * @param name Назва поля
   * @param value Значення поля
   * @returns true, якщо поле валідне
   */
  const validateField = (name: string, value: string): boolean => {
    const validator = validationRules[name];
    if (!validator) return true;
    
    const error = validator(value, values);
    setErrors(prev => ({ ...prev, [name]: error || '' }));
    return !error;
  };

  /**
   * Валідує всю форму
   * @returns true, якщо форма валідна
   */
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

  /**
   * Обробляє подію відправлення форми
   * @param onSubmit Функція, яка викликається при відправленні форми
   * @returns Функція-обробник подій
   */
  const handleSubmit = (onSubmit: (values: FormValues) => Promise<void>) => {
    return async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      
      // Помічаємо всі поля як "торкнуті"
      const allTouched: Record<string, boolean> = {};
      Object.keys(validationRules).forEach(field => {
        allTouched[field] = true;
      });
      setTouched(allTouched);
      
      // Валідуємо форму
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

  /**
   * Очищає стан форми
   */
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

/**
 * Функція-валідатор для перевірки наявності значення
 * @param fieldName Назва поля
 * @returns Функція валідації
 */
export const required = (fieldName: string): FieldValidator => {
  return (value: string) => {
    return value.trim() ? null : `${fieldName} є обов'язковим`;
  };
};

/**
 * Функція-валідатор для перевірки мінімальної довжини
 * @param fieldName Назва поля
 * @param min Мінімальна довжина
 * @returns Функція валідації
 */
export const minLength = (fieldName: string, min: number): FieldValidator => {
  return (value: string) => {
    return value.length >= min ? null : `${fieldName} має містити мінімум ${min} символів`;
  };
};

/**
 * Функція-валідатор для перевірки максимальної довжини
 * @param fieldName Назва поля
 * @param max Максимальна довжина
 * @returns Функція валідації
 */
export const maxLength = (fieldName: string, max: number): FieldValidator => {
  return (value: string) => {
    return value.length <= max ? null : `${fieldName} має містити максимум ${max} символів`;
  };
};

/**
 * Функція-валідатор для перевірки формату email
 * @returns Функція валідації
 */
export const email: FieldValidator = (value: string) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(value) ? null : 'Введіть коректний email';
};

/**
 * Функція-валідатор для перевірки збігу паролів
 * @param passwordField Назва поля з паролем
 * @returns Функція валідації
 */
export const passwordMatch = (passwordField: string): FieldValidator => {
  return (value: string, values: FormValues) => {
    return value === values[passwordField] ? null : 'Паролі не співпадають';
  };
};

/**
 * Функція-валідатор для перевірки пароля (містить цифри, великі та малі літери)
 * @returns Функція валідації
 */
export const strongPassword: FieldValidator = (value: string) => {
  const hasNumber = /\d/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const isValid = hasNumber && hasUpper && hasLower && value.length >= 8;
  
  return isValid ? null : 'Пароль має містити мінімум 8 символів, цифри, великі та малі літери';
}; 