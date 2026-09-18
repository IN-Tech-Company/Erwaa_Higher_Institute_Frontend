import { HttpInterceptorFn, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, of, switchMap, take, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { ApiResponse } from '../models/auth.models';
import { environment } from '../../../environments/environment';

interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const http = inject(HttpClient);

  const currentLang = localStorage.getItem('app_language') || 'ar';

  const publicEndpoints = [
    '/auth/login',
    '/auth/register/client/',
    '/auth/register/provider/company/manager',
    '/auth/register/seller',
    '/auth/otp/',
    '/auth/reset-password/',
    '/auth/refresh',
    '/lookups',
    '/consultation',
    '/public/',
    '/store/products',
    'assets/',
  ];

  // Endpoints open to guests, but that should carry the Bearer token when the
  // caller happens to be logged in (e.g. emergency flow reached from inside the app).
  const optionalAuthEndpoints = ['/emergency/', '/reviews', '/bookings/slots'];

  // Skip interceptor entirely for external (non-backend) absolute URLs
  const isAbsoluteExternal =
    (req.url.startsWith('http://') || req.url.startsWith('https://')) &&
    !req.url.startsWith(environment.apiUrl);
  if (isAbsoluteExternal) return next(req);

  const isPublicEndpoint = publicEndpoints.some(ep => req.url.includes(ep));
  const isOptionalAuthEndpoint = optionalAuthEndpoints.some(ep => req.url.includes(ep));

  const authReq = req.clone({ setHeaders: { 'Accept-Language': currentLang } });

  if (isPublicEndpoint) {
    return next(authReq);
  }

  if (isOptionalAuthEndpoint) {
    const optionalToken = tokenService.getToken();
    const optionalReq = optionalToken
      ? authReq.clone({ setHeaders: { Authorization: `Bearer ${optionalToken}` } })
      : authReq;
    return next(optionalReq);
  }

  const accessToken = tokenService.getToken();
  if (!accessToken) {
    router.navigate([`/${currentLang}/auth/login`], { queryParams: { returnUrl: router.url } });
    return of();
  }

  const authorizedReq = authReq.clone({
    setHeaders: { Authorization: `Bearer ${accessToken}` },
  });

  return next(authorizedReq).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handleTokenRefresh(req, next, tokenService, router, http, currentLang);
      }
      return throwError(() => error);
    })
  );
};

function handleTokenRefresh(
  req: Parameters<HttpInterceptorFn>[0],
  next: Parameters<HttpInterceptorFn>[1],
  tokenService: TokenService,
  router: Router,
  http: HttpClient,
  currentLang: string,
) {
  if (isRefreshing) {
    return refreshSubject.pipe(
      filter((token): token is string => token !== null),
      take(1),
      switchMap(token =>
        next(req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            'Accept-Language': currentLang,
          },
        }))
      ),
    );
  }

  isRefreshing = true;
  refreshSubject.next(null);

  const refreshToken = tokenService.getRefreshToken();
  if (!refreshToken) {
    isRefreshing = false;
    tokenService.logout();
    router.navigate([`/${currentLang}/auth/login`]);
    return throwError(() => new Error('No refresh token available'));
  }

  return http
    .post<ApiResponse<TokenRefreshResponse>>(
      `${environment.apiUrl}/auth/refresh`,
      { refreshToken },
    )
    .pipe(
      switchMap(response => {
        isRefreshing = false;
        const { accessToken, refreshToken: newRefresh } = response.data;
        tokenService.setTokens(accessToken, newRefresh);
        refreshSubject.next(accessToken);
        return next(req.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
            'Accept-Language': currentLang,
          },
        }));
      }),
      catchError(err => {
        isRefreshing = false;
        tokenService.logout();
        router.navigate([`/${currentLang}/auth/login`]);
        return throwError(() => err);
      }),
    );
}
