/**
 * Утилітні функції для обробки помилок API
 */

/**
 * Обробляє помилку API і повертає відповідне повідомлення для відображення користувачу
 * @param error Об'єкт помилки
 * @param defaultMessage Повідомлення за замовчуванням, якщо це не помилка API
 * @returns Повідомлення про помилку для відображення
 */
export const handleApiError = (error: unknown, defaultMessage: string): string => {
  // Якщо це помилка і має властивість name === 'ApiError', повертаємо її повідомлення
  if (error instanceof Error && error.name === 'ApiError') {
    return error.message;
  }
  
  // Інакше повертаємо повідомлення за замовчуванням
  return defaultMessage;
}; 