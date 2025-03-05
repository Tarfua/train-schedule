import { ApiService } from './api-service';
import Cookies from 'js-cookie';

/**
 * Інтерфейс для даних авторизації
 */
export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

/**
 * Інтерфейс для даних реєстрації
 */
export interface RegisterData {
  readonly email: string;
  readonly password: string;
}

/**
 * Інтерфейс для токенів автентифікації
 */
export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
}

/**
 * Інтерфейс для даних користувача
 */
export interface UserData {
  readonly id: string;
  readonly email: string;
}

/**
 * Інтерфейс для відповіді на запит автентифікації
 */
export interface AuthResponse {
  readonly user: UserData;
  readonly tokens: AuthTokens;
}

/**
 * Ключі для зберігання токенів у локальному сховищі та куках
 */
const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

/**
 * Сервіс для роботи з автентифікацією
 */
export class AuthService {
  private readonly apiService: ApiService;

  /**
   * Створює новий екземпляр AuthService
   * @param apiService Екземпляр ApiService для взаємодії з API
   */
  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  /**
   * Виконує вхід користувача
   * @param credentials Дані для входу
   * @returns Відповідь з даними користувача та токенами
   */
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Бекенд повертає тільки токени
      const tokens = await this.apiService.post<AuthTokens, LoginCredentials>('/auth/login', credentials);
      if (!tokens) {
        throw new Error('Некоректна відповідь сервера: токени не отримано');
      }
      
      // Зберігаємо токени
      this.saveTokens(tokens);
      
      // Створюємо базову інформацію про користувача з email
      const userData: UserData = {
        id: 'user-id', // Буде замінено після реалізації ендпоінту на бекенді
        email: credentials.email
      };
      
      // Повертаємо відповідь
      return {
        user: userData,
        tokens: tokens
      };
    } catch (error) {
      console.error('Помилка при вході:', error);
      throw error;
    }
  }

  /**
   * Виконує реєстрацію нового користувача
   * @param data Дані для реєстрації
   * @returns Відповідь з даними користувача та токенами
   */
  public async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Бекенд повертає тільки токени
      const tokens = await this.apiService.post<AuthTokens, RegisterData>('/auth/register', data);
      if (!tokens) {
        throw new Error('Некоректна відповідь сервера: токени не отримано');
      }
      
      // Зберігаємо токени
      this.saveTokens(tokens);
      
      // Створюємо базову інформацію про користувача з email
      const userData: UserData = {
        id: 'user-id', // Буде замінено після реалізації ендпоінту на бекенді
        email: data.email
      };
      
      // Повертаємо відповідь
      return {
        user: userData,
        tokens: tokens
      };
    } catch (error) {
      console.error('Помилка реєстрації:', error);
      throw error;
    }
  }

  /**
   * Виконує вихід користувача
   */
  public async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        await this.apiService.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Помилка при виході:', error);
    } finally {
      this.clearTokens();
    }
  }

  /**
   * Оновлює токени автентифікації
   * @returns Нові токени
   */
  public async refreshTokens(): Promise<AuthTokens> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('Refresh token не знайдено');
    }

    const response = await this.apiService.post<AuthTokens>('/auth/refresh', { refreshToken });
    this.saveTokens(response);
    return response;
  }

  /**
   * Отримує дані поточного користувача
   * @returns Дані користувача
   */
  public async getCurrentUser(): Promise<UserData> {
    return this.apiService.get<UserData>('/auth/me');
  }

  /**
   * Перевіряє, чи користувач авторизований
   * @returns true, якщо користувач авторизований
   */
  public isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Отримує access token з локального сховища
   * @returns Access token або null, якщо не знайдено
   */
  public getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY) || Cookies.get(ACCESS_TOKEN_KEY) || null;
  }

  /**
   * Отримує refresh token з локального сховища
   * @returns Refresh token або null, якщо не знайдено
   */
  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY) || Cookies.get(REFRESH_TOKEN_KEY) || null;
  }

  /**
   * Зберігає токени автентифікації у локальному сховищі та куках
   * @param tokens Токени автентифікації
   */
  private saveTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return;
    
    // Зберігаємо в localStorage
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    
    // Зберігаємо в cookies для доступу з middleware
    const cookieOptions = { secure: process.env.NODE_ENV === 'production', sameSite: 'strict' as const };
    Cookies.set(ACCESS_TOKEN_KEY, tokens.accessToken, cookieOptions);
    Cookies.set(REFRESH_TOKEN_KEY, tokens.refreshToken, {
      ...cookieOptions,
      expires: 7 // Зберігаємо refresh token на 7 днів
    });
  }

  /**
   * Видаляє токени автентифікації з локального сховища та кук
   */
  private clearTokens(): void {
    if (typeof window === 'undefined') return;
    
    // Очищаємо localStorage
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    
    // Очищаємо cookies
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  }
}

/**
 * Створює екземпляр AuthService з замовчуванням ApiService
 */
export const createAuthService = (): AuthService => {
  return new AuthService(new ApiService());
}; 