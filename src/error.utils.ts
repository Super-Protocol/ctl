interface ApiErrorResponse {
  response?: {
    status?: number;
    errors?: Array<{ message?: string }>;
  };
}

const isApiError = (error: unknown): error is ApiErrorResponse =>
  error !== null && typeof error === 'object' && 'response' in error;

export function getErrorMessage(error: unknown, baseMessage: string): string {
  if (!isApiError(error)) {
    return baseMessage;
  }

  const { response } = error;
  const status = response?.status;

  if (typeof status === 'number' && status >= 500) {
    return `${baseMessage}: Server error - code = ${status}`;
  }

  const errorMessage = response?.errors?.[0]?.message;
  if (errorMessage) {
    return `${baseMessage}: ${errorMessage}`;
  }

  return baseMessage;
}
