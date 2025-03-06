import {
  ApiError,
  ApiErrorData,
  ApiErrorResponse,
  ApiRequestOptions,
  ApiSuccessResponse,
} from './api-types';
import { AuthInterceptor } from './auth-interceptor';
import { AuthService } from './auth-service';

export class ApiService {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly defaultTimeout: number;
  private readonly authInterceptor: AuthInterceptor;

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

  public async get<T>(url: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>('GET', url, undefined, options);
  }

  public async post<T, D = unknown>(
    url: string, 
    data?: D, 
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>('POST', url, data, options);
  }

  public async put<T, D = unknown>(
    url: string, 
    data?: D, 
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>('PUT', url, data, options);
  }

  public async patch<T, D = unknown>(
    url: string, 
    data?: D, 
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>('PATCH', url, data, options);
  }

  public async delete<T>(url: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>('DELETE', url, undefined, options);
  }

  private async addAuthorizationHeader(headers: Record<string, string>): Promise<Record<string, string>> {
    const config = await this.authInterceptor.interceptRequest({ headers });
    return config.headers || headers;
  }

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

    return {} as T;
  }

  private async createApiError(response: Response): Promise<ApiError> {
    let errorData: ApiErrorData;
    try {
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const responseData = await response.json();

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
          errorData = {
            message: `Помилка сервера: ${response.status} ${response.statusText}`,
            code: `HTTP_${response.status}`,
            details: responseData
          };
        }
      } else {
        const text = await response.text();
        errorData = {
          message: text || `Помилка сервера: ${response.status} ${response.statusText}`,
          code: `HTTP_${response.status}`,
          details: { body: text }
        };
      }
    } catch (error) {
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

  private extractHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
} 