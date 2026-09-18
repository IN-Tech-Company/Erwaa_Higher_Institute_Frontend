import { inject, Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LanguageService } from './language.service';

// Modules that live directly under /:lang (siblings of /:lang/app), not nested inside it.
const TOP_LEVEL_MODULES = new Set(['auth', 'legal', 'shop', 'services', 'checkout']);

@Injectable({ providedIn: 'root' })
export class NavService {
  private router = inject(Router);
  private langService = inject(LanguageService);

  /**
   * Navigate to a path inside the dashboard app or a top-level module (auth/legal),
   * auto-prefixing /:lang/app for dashboard paths, or /:lang for auth/legal paths.
   *
   * @example
   * this.nav.go('auth/login');        // → /ar/auth/login
   * this.nav.go(['profile', 'edit']); // → /ar/app/profile/edit
   * this.nav.go('home', { queryParams: { tab: 'info' } });
   */
  go(path: string | string[], extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate(this.link(path), extras);
  }

  /**
   * Navigate by a full URL string, injecting the /:lang/app (or /:lang for auth/legal) prefix if absent.
   *
   * @example
   * this.nav.goByUrl('/dashboard');           // → /ar/app/dashboard
   * this.nav.goByUrl('/ar/app/dashboard');    // → /ar/app/dashboard (no double prefix)
   * this.nav.goByUrl('/auth/login');          // → /ar/auth/login
   */
  goByUrl(url: string, extras?: NavigationExtras): Promise<boolean> {
    const normalised = this.prefixUrl(url);
    return this.router.navigateByUrl(normalised, extras);
  }

  switchLang(lang: string): Promise<boolean> {
    const currentUrl = this.router.url;
    const withoutLang = currentUrl.replace(/^\/[a-z]{2}(\/|$)/, '/');
    return this.router.navigateByUrl(`/${lang}${withoutLang}`);
  }

  link(path: string | string[]): string[] {
    const segments = this.toSegments(path);
    return this.isTopLevelModule(segments)
      ? ['/', this.lang, ...segments]
      : ['/', this.lang, 'app', ...segments];
  }

  url(path: string | string[]): string {
    return `/${this.link(path).slice(1).join('/')}`;
  }

  private get lang(): string {
    return this.langService.getCurrentLanguage();
  }

  private toSegments(path: string | string[]): string[] {
    if (Array.isArray(path)) {
      return path.flatMap(p => p.split('/').filter(Boolean));
    }
    return path.split('/').filter(Boolean);
  }

  private isTopLevelModule(segments: string[]): boolean {
    return TOP_LEVEL_MODULES.has(segments[0]);
  }

  private prefixUrl(url: string): string {
    const clean = url.startsWith('/') ? url : `/${url}`;
    if (/^\/[a-z]{2}\/(app|auth|legal)(\/|$)/.test(clean)) return clean;

    const segments = clean.split('/').filter(Boolean);
    return this.isTopLevelModule(segments)
      ? `/${this.lang}${clean}`
      : `/${this.lang}/app${clean}`;
  }
}
