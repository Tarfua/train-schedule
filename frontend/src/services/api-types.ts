export interface ApiRequestOptions {
  readonly headers?: Record<string, string>;
  readonly params?: Record<string, string | number | boolean | null | undefined>;
  readonly timeout?: number;
  readonly withCredentials?: boolean;
}

export interface ApiSuccessResponse<T> {
  readonly data: T;
  readonly status: number;
  readonly statusText: string;
  readonly headers: Record<string, string>;
}

export interface ApiErrorData {
  readonly message: string;
  readonly code?: string;
  readonly details?: unknown;
}

export interface ApiErrorResponse {
  readonly error: ApiErrorData;
  readonly status: number;
  readonly statusText: string;
  readonly headers?: Record<string, string>;
}

export class ApiError extends Error {
  readonly response: ApiErrorResponse;

  constructor(response: ApiErrorResponse) {
    super(response.error.message);
    this.name = 'ApiError';
    this.response = response;
  }

  public hasStatus(status: number): boolean {
    return this.response.status === status;
  }

  public hasCode(code: string): boolean {
    return this.response.error.code === code;
  }
}