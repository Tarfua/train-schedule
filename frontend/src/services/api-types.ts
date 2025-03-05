/**
 * Базові типи для API запитів та відповідей
 */

/**
 * Базовий тип для всіх HTTP запитів
 */
export interface ApiRequestOptions {
  readonly headers?: Record<string, string>;
  readonly params?: Record<string, string | number | boolean | null | undefined>;
  readonly timeout?: number;
  readonly withCredentials?: boolean;
}

/**
 * Базовий тип для успішної відповіді від API
 */
export interface ApiSuccessResponse<T> {
  readonly data: T;
  readonly status: number;
  readonly statusText: string;
  readonly headers: Record<string, string>;
}

/**
 * Структура помилки від API
 */
export interface ApiErrorData {
  readonly message: string;
  readonly code?: string;
  readonly details?: unknown;
}

/**
 * Базовий тип для помилкової відповіді від API
 */
export interface ApiErrorResponse {
  readonly error: ApiErrorData;
  readonly status: number;
  readonly statusText: string;
  readonly headers?: Record<string, string>;
}

/**
 * Помилка API для використання у коді
 */
export class ApiError extends Error {
  readonly response: ApiErrorResponse;

  constructor(response: ApiErrorResponse) {
    super(response.error.message);
    this.name = 'ApiError';
    this.response = response;
  }

  /**
   * Перевіряє, чи відповідає помилка певному HTTP статус коду
   */
  public hasStatus(status: number): boolean {
    return this.response.status === status;
  }

  /**
   * Перевіряє, чи відповідає помилка певному коду помилки
   */
  public hasCode(code: string): boolean {
    return this.response.error.code === code;
  }
}

/**
 * Тип для пагінованої відповіді від API
 */
export interface PaginatedResponse<T> {
  readonly items: T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
}

/**
 * Параметри для запиту з пагінацією
 */
export interface PaginationParams {
  readonly page?: number;
  readonly pageSize?: number;
  readonly sortBy?: string;
  readonly sortOrder?: 'asc' | 'desc';
} 