import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpContext,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { LoaderService } from './loader.service';
import { environment } from '../../../environments/environment';

export interface RequestOptions {
  showLoader?: boolean;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | string[]>;
  context?: HttpContext;
  reportProgress?: boolean;
  onStart?: () => void;
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
  onFinally?: () => void;
}

@Injectable({ providedIn: 'root' })
export class RequestService {
  private readonly http = inject(HttpClient);
  private readonly loader = inject(LoaderService);
  private readonly baseUrl = environment.apiUrl;

  private buildHeaders(extra?: Record<string, string>): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (extra) {
      Object.entries(extra).forEach(([k, v]) => (headers = headers.set(k, v)));
    }
    return headers;
  }

  private buildParams(
    raw?: Record<string, string | number | boolean | string[]>
  ): HttpParams {
    let params = new HttpParams();
    if (!raw) return params;
    Object.entries(raw).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach((item) => (params = params.append(k, item)));
      } else {
        params = params.set(k, String(v));
      }
    });
    return params;
  }

  /**
   * Core pipeline — wires loader + callbacks into any HttpClient observable.
   * Every public method passes through here.
   */
  private pipeline<T>(
    source$: Observable<T>,
    options: RequestOptions = {}
  ): Observable<T> {
    const {
      showLoader = true,
      onStart,
      onSuccess,
      onError,
      onFinally,
    } = options;

    if (showLoader) this.loader.show();
    onStart?.();

    return source$.pipe(
      tap((data) => onSuccess?.(data)),
      catchError((error) => {
        onError?.(error);
        return throwError(() => error);
      }),
      finalize(() => {
        if (showLoader) this.loader.hide();
        onFinally?.();
      })
    );
  }

  get<T>(endpoint: string, options: RequestOptions = {}): Observable<T> {
    return this.pipeline(
      this.http.get<T>(`${this.baseUrl}${endpoint}`, {
        headers: this.buildHeaders(options.headers),
        params: this.buildParams(options.params),
        context: options.context,
      }),
      options
    );
  }

  post<T>(
    endpoint: string,
    body: unknown = {},
    options: RequestOptions = {}
  ): Observable<T> {
    let headers = this.buildHeaders(options.headers);

    if (body instanceof FormData && headers.has('Content-Type')) {
      headers = headers.delete('Content-Type');
    }

    return this.pipeline(
      this.http.post<T>(`${this.baseUrl}${endpoint}`, body, {
        headers,
        params: this.buildParams(options.params),
        context: options.context,
      }),
      options
    );
  }
  put<T>(
    endpoint: string,
    body: unknown = {},
    options: RequestOptions = {}
  ): Observable<T> {
    let headers = this.buildHeaders(options.headers);

    if (body instanceof FormData && headers.has('Content-Type')) {
      headers = headers.delete('Content-Type');
    }

    return this.pipeline(
      this.http.put<T>(`${this.baseUrl}${endpoint}`, body, {
        headers,
        params: this.buildParams(options.params),
        context: options.context,
      }),
      options
    );
  }

  patch<T>(
    endpoint: string,
    body: unknown = {},
    options: RequestOptions = {}
  ): Observable<T> {
    let headers = this.buildHeaders(options.headers);

    if (body instanceof FormData && headers.has('Content-Type')) {
      headers = headers.delete('Content-Type');
    }

    return this.pipeline(
      this.http.patch<T>(`${this.baseUrl}${endpoint}`, body, {
        headers,
        params: this.buildParams(options.params),
        context: options.context,
      }),
      options
    );
  }


  delete<T>(endpoint: string, options: RequestOptions = {}): Observable<T> {
    return this.pipeline(
      this.http.delete<T>(`${this.baseUrl}${endpoint}`, {
        headers: this.buildHeaders(options.headers),
        params: this.buildParams(options.params),
        context: options.context,
      }),
      options
    );
  }

  upload<T>(
    endpoint: string,
    formData: FormData,
    options: RequestOptions = {}
  ): Observable<T> {
    let headers = new HttpHeaders();
    if (options.headers) {
      Object.entries(options.headers).forEach(
        ([k, v]) => (headers = headers.set(k, v))
      );
    }

    return this.pipeline(
      this.http.post<T>(`${this.baseUrl}${endpoint}`, formData, {
        headers,
        params: this.buildParams(options.params),
        reportProgress: options.reportProgress ?? false,
        context: options.context,
      }),
      options
    );
  }


  download(endpoint: string, options: RequestOptions = {}): Observable<Blob> {
    return this.pipeline(
      this.http.get(`${this.baseUrl}${endpoint}`, {
        headers: this.buildHeaders(options.headers),
        params: this.buildParams(options.params),
        responseType: 'blob',
        context: options.context,
      }),
      options
    );
  }

  getResponse<T>(endpoint: string, options: RequestOptions = {}) {
    return this.pipeline(
      this.http.get<T>(`${this.baseUrl}${endpoint}`, {
        headers: this.buildHeaders(options.headers),
        params: this.buildParams(options.params),
        observe: 'response',
        context: options.context,
      }),
      options
    );
  }
}