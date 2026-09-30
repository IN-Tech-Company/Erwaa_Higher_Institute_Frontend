import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

type QueryParams = Record<string, string | number | boolean | readonly (string | number | boolean)[]>;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  get<T>(url: string, params?: QueryParams): Observable<T> {
    return this.unwrap(this.http.get<ApiResponse<T>>(this.baseUrl + url, { params }));
  }

  post<T>(url: string, body?: unknown): Observable<T> {
    return this.unwrap(this.http.post<ApiResponse<T>>(this.baseUrl + url, body));
  }

  put<T>(url: string, body?: unknown): Observable<T> {
    return this.unwrap(this.http.put<ApiResponse<T>>(this.baseUrl + url, body));
  }

  patch<T>(url: string, body?: unknown): Observable<T> {
    return this.unwrap(this.http.patch<ApiResponse<T>>(this.baseUrl + url, body));
  }

  delete<T>(url: string, params?: QueryParams): Observable<T> {
    return this.unwrap(this.http.delete<ApiResponse<T>>(this.baseUrl + url, { params }));
  }

  // 202/204 responses have no body, hence `res?.`.
  private unwrap<T>(source$: Observable<ApiResponse<T>>): Observable<T> {
    return source$.pipe(map((res) => res?.body));
  }
}
