export const handleApiError = (error: unknown, defaultMessage: string): string => {
  if (error instanceof Error && error.name === 'ApiError') {
    return error.message;
  }
  
  return defaultMessage;
}; 