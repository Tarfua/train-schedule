import { AuthService } from './auth-service';

interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | null | undefined>;
  timeout?: number;
  withCredentials?: boolean;
  [key: string]: unknown;
}

export class AuthInterceptor {
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;

  constructor(private authService: AuthService) {}

  public async interceptRequest(config: RequestConfig): Promise<RequestConfig> {
    const accessToken = this.authService.getAccessToken();
    
    if (!accessToken) {
      return config;
    }

    if (this.isTokenExpired(accessToken)) {
      await this.refreshTokenIfNeeded();
      const newToken = this.authService.getAccessToken();
      if (newToken) {
        return this.addTokenToConfig(config, newToken);
      }
    }

    return this.addTokenToConfig(config, accessToken);
  }

  private addTokenToConfig(config: RequestConfig, token: string): RequestConfig {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`
      }
    };
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      // Перевіряємо, чи токен закінчиться протягом наступних 30 секунд
      return Date.now() >= (expirationTime - 30000);
    } catch {
      return true;
    }
  }

  private async refreshTokenIfNeeded(): Promise<void> {
    // Якщо оновлення вже відбувається, чекаємо його завершення
    if (this.refreshPromise) {
      await this.refreshPromise;
      return;
    }

    // Якщо оновлення ще не відбувається, починаємо його
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshPromise = this.performRefresh();
      await this.refreshPromise;
    }
  }

  private async performRefresh(): Promise<void> {
    try {
      await this.authService.refreshTokens();
    } catch (error) {
      console.error('Помилка при оновленні токена:', error);
      await this.authService.logout();
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }
} 