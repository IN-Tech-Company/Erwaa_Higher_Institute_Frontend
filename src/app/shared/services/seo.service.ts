import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment';

export interface PageSeoData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  /** Set true for pages that must never appear in search results (e.g. checkout). */
  noindex?: boolean;
}

export interface LandingPageSeo {
  ar: PageSeoData;
  en: PageSeoData;
}
 
@Injectable({ providedIn: 'root' })
export class SeoService {

  private readonly siteUrl = environment.siteUrl;
  private readonly siteName = { ar: 'معهد إرواء العالي للتدريب', en: 'Erwaa Higher Institute for Training' };
  private readonly defaultImage = `${environment.siteUrl}/assets/images/logo/logo-original.png`;
  private readonly twitterHandle = '@institute_Erwaa';

  constructor(
    private readonly meta: Meta,
    private readonly titleService: Title,
    @Inject(DOCUMENT) private readonly doc: Document,
  ) { }

  // ─── Main entry point ──────────────────────────────────────────────────────

  /**
   * Call this once per landing page in ngOnInit.
   * Handles title, description, OG, Twitter, canonical, and hreflang automatically.
   *
   * @param seo     The AR and EN content for this page
   * @param lang    Current language from LanguageStoreService ('ar' | 'en')
   * @param route   The landing route segment, e.g. 'ambulance-services' or '' for home
   */
  setupPage(seo: LandingPageSeo, lang: 'ar' | 'en', route: string): void {
    const data = seo[lang];
    const siteName = this.siteName[lang];
    const locale = lang === 'ar' ? 'ar_SA' : 'en_US';
    const altLocale = lang === 'ar' ? 'en_US' : 'ar_SA';
    const altLang = lang === 'ar' ? 'en' : 'ar';

    const pageUrl = this.buildUrl(lang, route);
    const altUrl = this.buildUrl(altLang as 'ar' | 'en', route);
    const imageRaw = data.image ?? this.defaultImage;
    const image = imageRaw.startsWith('http') ? imageRaw : `${this.siteUrl}/${imageRaw}`;

    // Pages pass just their own title segment (e.g. a course name) and get
    // " | <site name>" appended automatically — except the home page, which
    // passes its full tagline-including title already, so it's left as-is.
    const fullTitle = data.title.includes(siteName) ? data.title : `${data.title} | ${siteName}`;

    // ── Title ────────────────────────────────────────────────────────────────
    this.titleService.setTitle(fullTitle);

    // ── Basic meta ───────────────────────────────────────────────────────────
    this.meta.updateTag({ name: 'description', content: data.description });
    this.meta.updateTag({ name: 'robots', content: data.noindex ? 'noindex, nofollow' : 'index, follow' });
    if (data.keywords) {
      this.meta.updateTag({ name: 'keywords', content: data.keywords });
    }

    // ── Open Graph ───────────────────────────────────────────────────────────
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: siteName });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:url', content: pageUrl });
    this.meta.updateTag({ property: 'og:locale', content: locale });
    this.meta.updateTag({ property: 'og:locale:alternate', content: altLocale });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:secure_url', content: image });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '1200' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/png' });

    // ── Twitter Card ─────────────────────────────────────────────────────────
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:site', content: this.twitterHandle });
    this.meta.updateTag({ name: 'twitter:creator', content: this.twitterHandle });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({ name: 'twitter:url', content: pageUrl });

    // ── Canonical ────────────────────────────────────────────────────────────
    this.setLink('canonical', pageUrl);

    // ── hreflang (the fix for the bilingual-duplicate-content problem) ───────
    this.setHreflang(pageUrl, altUrl, lang);
  }

  /** Absolute site URL, e.g. for building image src attributes in structured data. */
  get baseUrl(): string {
    return this.siteUrl;
  }

  /** Public so structured-data builders (Course/Breadcrumb/ItemList schemas) can
   *  reuse the exact same URL shape as the meta tags instead of re-deriving it. */
  buildUrl(lang: 'ar' | 'en', route: string): string {
    const segment = route ? `/${route}` : '';
    return `${this.siteUrl}/${lang}${segment}`;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private setLink(rel: string, href: string): void {
    let el = this.doc.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!el) {
      el = this.doc.createElement('link');
      el.setAttribute('rel', rel);
      this.doc.head.appendChild(el);
    }
    el.setAttribute('href', href);
  }

  private setHreflang(arUrl: string, enUrl: string, currentLang: 'ar' | 'en'): void {
    // Remove old hreflang links
    this.doc.querySelectorAll('link[rel="alternate"][hreflang]').forEach(l => l.remove());

    const add = (hreflang: string, href: string) => {
      const link = this.doc.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', hreflang);
      link.setAttribute('href', href);
      this.doc.head.appendChild(link);
    };

    // Normalise: arUrl is always the Arabic URL, enUrl always English
    const [ara, eng] = currentLang === 'ar' ? [arUrl, enUrl] : [enUrl, arUrl];

    add('ar', ara);
    add('en', eng);
    add('x-default', ara); // Arabic is the default locale for erwaainstitute.com
  }
}
