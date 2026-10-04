import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TopBarComponent } from '../../components/top-bar/top-bar';
import { SiteHeaderComponent } from '../../components/site-header/site-header';
import { HeroComponent } from '../../components/hero/hero';
import { HeroHighlightsComponent } from '../../components/hero-highlights/hero-highlights';
import { AboutSectionComponent } from '../../components/about/about';
import { StatsSectionComponent } from '../../components/stats/stats';
import { ProgramHistorySectionComponent } from '../../components/program-history/program-history';
import { CoursesSectionComponent } from '../../components/courses/courses';
import { FeaturedCoursesSectionComponent } from '../../components/featured-courses/featured-courses';
import { FeaturesSectionComponent } from '../../components/features/features';
import { PromoBannerComponent } from '../../components/promo-banner/promo-banner';
import { TestimonialsSectionComponent } from '../../components/testimonials/testimonials';
import { FaqSectionComponent } from '../../components/faq/faq';
import { ContactSectionComponent } from '../../components/contact/contact';
import { FooterComponent } from '../../components/footer/footer';
import { LanguageStoreService } from '../../../../shared/services/language/language-store.service';
import { SeoService } from '../../../../shared/services/seo.service';
import { StructuredDataService } from '../../../../shared/services/structured-data.service';
import { buildFaqSchema } from '../../data/structured-data-builders';
import { HOME_SEO } from '../../data/landing-seo';

const FAQ_ITEM_KEYS = ['ITEM1', 'ITEM2', 'ITEM3', 'ITEM4', 'ITEM5'];

@Component({
  selector: 'app-landing-page',
  imports: [TopBarComponent, SiteHeaderComponent, HeroComponent, HeroHighlightsComponent, AboutSectionComponent, StatsSectionComponent, ProgramHistorySectionComponent, CoursesSectionComponent, FeaturedCoursesSectionComponent, FeaturesSectionComponent, PromoBannerComponent, TestimonialsSectionComponent, FaqSectionComponent, ContactSectionComponent, FooterComponent],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage {
  private readonly seoService = inject(SeoService);
  private readonly structuredData = inject(StructuredDataService);
  private readonly translate = inject(TranslateService);
  private readonly langStore = inject(LanguageStoreService);

  constructor() {
    effect(() => {
      const lang = this.langStore.currentLanguage();
      this.seoService.setupPage(HOME_SEO, lang, '');

      const faqSchema = buildFaqSchema(
        FAQ_ITEM_KEYS.map((key) => ({
          question: this.translate.instant(`LANDING.FAQ.${key}_Q`),
          answer: this.translate.instant(`LANDING.FAQ.${key}_A`),
        })),
      );
      this.structuredData.set('faq', faqSchema);
    });

    inject(DestroyRef).onDestroy(() => this.structuredData.clear(['faq']));
  }
}
