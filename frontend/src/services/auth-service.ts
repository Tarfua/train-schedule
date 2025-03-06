import { ApiService } from './api-service';
import Cookies from 'js-cookie';

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export interface RegisterData {
  readonly email: string;
  readonly password: string;
}

export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface UserData {
  readonly id: string;
  readonly email: string;
}

export interface AuthResponse {
  readonly user: UserData;
  readonly tokens: AuthTokens;
}

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

export class AuthService {
  private readonly apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const tokens = await this.apiService.post<AuthTokens, LoginCredentials>('/auth/login', credentials);
      if (!tokens) {
        throw new Error('Некоректна відповідь сервера: токени не отримано');
      }
      
      this.saveTokens(tokens);

      const userData = await this.getCurrentUser();

      return {
        user: userData,
        tokens: tokens
      };
    } catch (error) {
      console.error('Помилка при вході:', error);
      throw error;
    }
  }

  public async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const tokens = await this.apiService.post<AuthTokens, RegisterData>('/auth/register', data);
      if (!tokens) {
        throw new Error('Некоректна відповідь сервера: токени не отримано');
      }
      
      this.saveTokens(tokens);

      const userData = await this.getCurrentUser();

      return {
        user: userData,
        tokens: tokens
      };
    } catch (error) {
      console.error('Помилка реєстрації:', error);
      throw error;
    }
  }

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

  public isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    if (!accessToken) return false;
    
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      return Date.now() < expirationTime;
    } catch {
      return false;
    }
  }

  public getTokenLifetime(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      return Math.floor((expirationTime - Date.now()) / 1000);
    } catch {
      return null;
    }
  }

  public getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return Cookies.get(ACCESS_TOKEN_KEY) || localStorage.getItem(ACCESS_TOKEN_KEY) || null;
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return Cookies.get(REFRESH_TOKEN_KEY) || localStorage.getItem(REFRESH_TOKEN_KEY) || null;
  }

  private saveTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);

    const cookieOptions = { secure: process.env.NODE_ENV === 'production', sameSite: 'strict' as const };
    Cookies.set(ACCESS_TOKEN_KEY, tokens.accessToken, cookieOptions);
    Cookies.set(REFRESH_TOKEN_KEY, tokens.refreshToken, {
      ...cookieOptions,
      expires: 7 // Збереження refresh token на 7 днів
    });
  }

  private clearTokens(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  }

  public async refreshTokens(): Promise<AuthTokens> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('Refresh token не знайдено');
    }

    try {
      const response = await this.apiService.post<AuthTokens>('/auth/refresh', { refreshToken });
      this.saveTokens(response);
      return response;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  public async getCurrentUser(): Promise<UserData> {
    return this.apiService.get<UserData>('/auth/me');
  }
}

export const createAuthService = (): AuthService => {
  return new AuthService(new ApiService());
}; 