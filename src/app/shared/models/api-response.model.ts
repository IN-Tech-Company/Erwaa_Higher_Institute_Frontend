export interface ApiResponse<T> {
  status: number;
  message: string;
  body: T;
  ok: boolean;
}

export interface PageResponse<T> {
  content: T[];
  totalElementsCount: number;
  totalPagesCount: number;
  pageNumber: number;
  pageSize: number;
  firstPage: boolean;
  lastPage: boolean;
}
