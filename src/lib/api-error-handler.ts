import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export interface ErrorStatusMap {
  [key: string]: number;
}

export interface ApiErrorHandlerOptions {
  defaultStatus?: number;
  statusMap?: ErrorStatusMap;
}

export function handleApiError(
  error: unknown,
  options: ApiErrorHandlerOptions = {},
): NextResponse {
  const { defaultStatus = 500, statusMap = {} } = options;

  if (error instanceof ZodError) {
    console.error('Zod error:', error.errors);
    return NextResponse.json(
      { error: 'Invalid request data', details: error.errors },
      { status: 400 },
    );
  }

  if (error instanceof Error) {
    const status = statusMap[error.message] || defaultStatus;
    console.error('Error:', error.message, 'Status:', status);
    return NextResponse.json({ error: error.message }, { status });
  }

  console.error('Unexpected error:', error);
  return NextResponse.json({ error: 'Internal server error' }, { status: defaultStatus });
}

export function withErrorHandling<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>,
  options: ApiErrorHandlerOptions = {},
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('Error in withErrorHandling:', error);
      return handleApiError(error, options);
    }
  };
}
