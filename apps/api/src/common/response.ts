export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}

export function ok<T>(data: T, message?: string): ApiResponse<T> {
  return {
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function paginated<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
): ApiResponse<PaginatedData<T>> {
  return ok({
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
