import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PageSeoData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
}

export interface LandingPageSeo {
  ar: PageSeoData;
  en: PageSeoData;
}

// ─── Service ─────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class SeoService {

  private readonly siteUrl = environment.siteUrl;
  private readonly siteName = { ar: 'نبض بلس', en: 'Nabd Plus' };
  private readonly defaultImage = `${environment.siteUrl}/assets/images/og/nabdplus-og-default.png`;
  private readonly twitterHandle = '@nabdplus';

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

    // ── Title ────────────────────────────────────────────────────────────────
    this.titleService.setTitle(`${data.title} | ${siteName}`);

    // ── Basic meta ───────────────────────────────────────────────────────────
    this.meta.updateTag({ name: 'description', content: data.description });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    if (data.keywords) {
      this.meta.updateTag({ name: 'keywords', content: data.keywords });
    }

    // ── Open Graph ───────────────────────────────────────────────────────────
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: siteName });
    this.meta.updateTag({ property: 'og:title', content: `${data.title} | ${siteName}` });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:url', content: pageUrl });
    this.meta.updateTag({ property: 'og:locale', content: locale });
    this.meta.updateTag({ property: 'og:locale:alternate', content: altLocale });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:secure_url', content: image });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/png' });

    // ── Twitter Card ─────────────────────────────────────────────────────────
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:site', content: this.twitterHandle });
    this.meta.updateTag({ name: 'twitter:creator', content: this.twitterHandle });
    this.meta.updateTag({ name: 'twitter:title', content: `${data.title} | ${siteName}` });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({ name: 'twitter:url', content: pageUrl });

    // ── Canonical ────────────────────────────────────────────────────────────
    this.setLink('canonical', pageUrl);

    // ── hreflang (the fix for the bilingual-duplicate-content problem) ───────
    this.setHreflang(pageUrl, altUrl, lang);
  }

  // ─── JSON-LD structured data ───────────────────────────────────────────────

  injectStructuredData(schema: Record<string, unknown>): void {
    this.removeStructuredData();
    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.id = '__nabdplus_ld';
    script.text = JSON.stringify(schema);
    this.doc.head.appendChild(script);
  }

  removeStructuredData(): void {
    this.doc.getElementById('__nabdplus_ld')?.remove();
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private buildUrl(lang: 'ar' | 'en', route: string): string {
    const segment = route ? `/${route}` : '';
    return `${this.siteUrl}/${lang}${segment}`;
  }

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
    add('x-default', ara); // Arabic is the default locale for nabd911
  }
}
