import {
  ApiError,
  ApiErrorData,
  ApiErrorResponse,
  ApiRequestOptions,
  ApiSuccessResponse,
  PaginatedResponse,
  PaginationParams
} from './api-types';
import { AuthInterceptor } from './auth-interceptor';
import { AuthService } from './auth-service';

/**
 * Основний API сервіс для взаємодії з бекендом
 * Сервіс забезпечує єдину точку доступу до API та обробляє помилки
 */
export class ApiService {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly defaultTimeout: number;
  private readonly authInterceptor: AuthInterceptor;

  /**
   * Створює новий екземпляр ApiService
   * @param baseUrl Базовий URL для API запитів
   * @param defaultHeaders Заголовки за замовчуванням для всіх запитів
   * @param defaultTimeout Таймаут за замовчуванням для всіх запитів (мс)
   */
  constructor(
    baseUrl: string = process.env.NEXT_PUBLIC_API_URL || '/api',
    defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    defaultTimeout: number = 30000,
    authService?: AuthService
  ) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = defaultHeaders;
    this.defaultTimeout = defaultTimeout;
    this.authInterceptor = new AuthInterceptor(authService || new AuthService(this));
  }

  /**
   * Виконує GET запит до API
   * @param url Шлях запиту (без базового URL)
   * @param options Додаткові опції запиту
   * @returns Проміс з даними відповіді
   */
  public async get<T>(url: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>('GET', url, undefined, options);
  }

  /**
   * Виконує GET запит з пагінацією
   * @param url Шлях запиту (без базового URL)
   * @param params Параметри пагінації
   * @param options Додаткові опції запиту
   * @returns Проміс з пагінованою відповіддю
   */
  public async getPaginated<T>(
    url: string, 
    params?: PaginationParams, 
    options?: ApiRequestOptions
  ): Promise<PaginatedResponse<T>> {
    const mergedOptions: ApiRequestOptions = {
      ...options,
      params: {
        ...options?.params,
        ...params
      }
    };
    
    return this.request<PaginatedResponse<T>>('GET', url, undefined, mergedOptions);
  }

  /**
   * Виконує POST запит до API
   * @param url Шлях запиту (без базового URL)
   * @param data Дані для відправки
   * @param options Додаткові опції запиту
   * @returns Проміс з даними відповіді
   */
  public async post<T, D = unknown>(
    url: string, 
    data?: D, 
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>('POST', url, data, options);
  }

  /**
   * Виконує PUT запит до API
   * @param url Шлях запиту (без базового URL)
   * @param data Дані для відправки
   * @param options Додаткові опції запиту
   * @returns Проміс з даними відповіді
   */
  public async put<T, D = unknown>(
    url: string, 
    data?: D, 
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>('PUT', url, data, options);
  }

  /**
   * Виконує PATCH запит до API
   * @param url Шлях запиту (без базового URL)
   * @param data Дані для відправки
   * @param options Додаткові опції запиту
   * @returns Проміс з даними відповіді
   */
  public async patch<T, D = unknown>(
    url: string, 
    data?: D, 
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>('PATCH', url, data, options);
  }

  /**
   * Виконує DELETE запит до API
   * @param url Шлях запиту (без базового URL)
   * @param options Додаткові опції запиту
   * @returns Проміс з даними відповіді
   */
  public async delete<T>(url: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>('DELETE', url, undefined, options);
  }

  /**
   * Виконує завантаження файлу з API
   * @param url Шлях запиту (без базового URL)
   * @param options Додаткові опції запиту
   * @returns Проміс з Blob даними
   */
  public async downloadFile(url: string, options?: ApiRequestOptions): Promise<Blob> {
    const mergedOptions: ApiRequestOptions = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options?.headers,
        'Accept': '*/*'
      }
    };
    
    const response = await this.fetchWithTimeout(
      this.buildUrl(url, mergedOptions.params),
      {
        method: 'GET',
        headers: mergedOptions.headers,
        credentials: mergedOptions.withCredentials ? 'include' : 'same-origin',
        signal: mergedOptions.timeout 
          ? AbortSignal.timeout(mergedOptions.timeout) 
          : undefined
      }
    );

    if (!response.ok) {
      throw await this.createApiError(response);
    }

    return response.blob();
  }

  /**
   * Виконує завантаження файлу на сервер
   * @param url Шлях запиту (без базового URL)
   * @param formData Дані форми з файлом
   * @param options Додаткові опції запиту
   * @returns Проміс з даними відповіді
   */
  public async uploadFile<T>(
    url: string,
    formData: FormData,
    options?: ApiRequestOptions
  ): Promise<T> {
    const mergedOptions: ApiRequestOptions = {
      ...options,
      headers: {
        ...options?.headers,
        // Не додаємо Content-Type, він буде встановлений автоматично з boundary
      }
    };
    
    const response = await this.fetchWithTimeout(
      this.buildUrl(url, mergedOptions.params),
      {
        method: 'POST',
        headers: mergedOptions.headers,
        credentials: mergedOptions.withCredentials ? 'include' : 'same-origin',
        body: formData,
        signal: mergedOptions.timeout 
          ? AbortSignal.timeout(mergedOptions.timeout) 
          : undefined
      }
    );

    if (!response.ok) {
      throw await this.createApiError(response);
    }

    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const responseData = await response.json();
      return responseData as T;
    }

    // Якщо відповідь не JSON, повертаємо пустий об'єкт
    return {} as T;
  }

  /**
   * Додає токен авторизації до заголовків
   * @param headers Початкові заголовки
   * @returns Заголовки з доданою авторизацією
   */
  private async addAuthorizationHeader(headers: Record<string, string>): Promise<Record<string, string>> {
    const config = await this.authInterceptor.interceptRequest({ headers });
    return config.headers || headers;
  }

  /**
   * Базовий метод для виконання всіх HTTP запитів
   * @param method HTTP метод
   * @param url Шлях запиту (без базового URL)
   * @param data Дані для відправки
   * @param options Додаткові опції запиту
   * @returns Проміс з даними відповіді
   */
  private async request<T>(
    method: string,
    url: string,
    data?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> {
    const mergedOptions: ApiRequestOptions = {
      ...options,
      headers: await this.addAuthorizationHeader({
        ...this.defaultHeaders,
        ...options?.headers
      })
    };
    
    const requestInit: RequestInit = {
      method,
      headers: mergedOptions.headers,
      credentials: 'include',
      mode: 'cors',
      signal: mergedOptions.timeout 
        ? AbortSignal.timeout(mergedOptions.timeout || this.defaultTimeout) 
        : undefined
    };

    if (data !== undefined) {
      requestInit.body = JSON.stringify(data);
    }
    
    const response = await this.fetchWithTimeout(
      this.buildUrl(url, mergedOptions.params),
      requestInit
    );

    if (!response.ok) {
      throw await this.createApiError(response);
    }

    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const responseData = await response.json();
      
      const successResponse: ApiSuccessResponse<T> = {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: this.extractHeaders(response.headers)
      };
      
      return successResponse.data;
    }

    // Якщо відповідь не JSON, повертаємо пустий об'єкт
    return {} as T;
  }

  /**
   * Створює ApiError з відповіді fetch
   * @param response Відповідь fetch API
   * @returns ApiError об'єкт
   */
  private async createApiError(response: Response): Promise<ApiError> {
    let errorData: ApiErrorData;
    try {
      // Спробуємо отримати помилку у форматі JSON
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const responseData = await response.json();
        
        // Якщо відповідь містить поле 'message' або 'error.message' - використовуємо його
        if (responseData.message) {
          errorData = {
            message: responseData.message,
            code: responseData.code || responseData.statusCode || `HTTP_${response.status}`,
            details: responseData.details || responseData
          };
        } else if (responseData.error && responseData.error.message) {
          errorData = {
            message: responseData.error.message,
            code: responseData.error.code || responseData.statusCode || `HTTP_${response.status}`,
            details: responseData.error.details || responseData
          };
        } else {
          // Якщо нема стандартних полів, використовуємо всю відповідь як деталі помилки
          errorData = {
            message: `Помилка сервера: ${response.status} ${response.statusText}`,
            code: `HTTP_${response.status}`,
            details: responseData
          };
        }
      } else {
        // Якщо відповідь не у форматі JSON, використовуємо текст
        const text = await response.text();
        errorData = {
          message: text || `Помилка сервера: ${response.status} ${response.statusText}`,
          code: `HTTP_${response.status}`,
          details: { body: text }
        };
      }
    } catch (error) {
      // Якщо не вдалося розпарсити відповідь, використовуємо стандартне повідомлення
      errorData = {
        message: `Помилка сервера: ${response.status} ${response.statusText}`,
        code: `HTTP_${response.status}`,
        details: { parseError: error }
      };
    }

    const headers = this.extractHeaders(response.headers);
    
    return new ApiError({
      error: errorData,
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }

  /**
   * Будує повний URL із шляху та параметрів запиту
   * @param path Шлях запиту (без базового URL)
   * @param params Параметри запиту
   * @returns Повний URL
   */
  private buildUrl(path: string, params?: Record<string, string | number | boolean | null | undefined>): string {
    const url = new URL(`${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  /**
   * Виконує fetch запит з таймаутом
   * @param input URL запиту
   * @param init Опції fetch запиту
   * @returns Проміс з відповіддю fetch
   */
  private async fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    try {
      return await fetch(input, init);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        const timeoutError: ApiErrorResponse = {
          error: {
            message: 'Таймаут запиту перевищено',
            code: 'TIMEOUT'
          },
          status: 0,
          statusText: 'Timeout'
        };
        throw new ApiError(timeoutError);
      }
      
      const networkError: ApiErrorResponse = {
        error: {
          message: 'Помилка мережі',
          code: 'NETWORK_ERROR',
          details: error
        },
        status: 0,
        statusText: 'Network Error'
      };
      throw new ApiError(networkError);
    }
  }

  /**
   * Екстракт заголовків з Headers об'єкту в JSON
   * @param headers Об'єкт Headers
   * @returns Заголовки як Record
   */
  private extractHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
} 