import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';
import { TopBarComponent } from '../../components/top-bar/top-bar';
import { SiteHeaderComponent } from '../../components/site-header/site-header';
import { FooterComponent } from '../../components/footer/footer';
import { LanguageStoreService } from '../../../../shared/services/language/language-store.service';
import { SeoService } from '../../../../shared/services/seo.service';
import { StructuredDataService } from '../../../../shared/services/structured-data.service';
import { buildBreadcrumbSchema, buildCourseSchema } from '../../data/structured-data-builders';
import { buildCourseDetailSeo, COURSE_NOT_FOUND_SEO } from '../../data/landing-seo';
import { findCourseByKey } from '../../data/courses-catalog';

interface FactItem {
  icon: string;
  labelKey: string;
  value: string | null;
  valueKey?: string | null;
}

@Component({
  selector: 'app-course-detail-page',
  imports: [TranslatePipe, RouterLink, TopBarComponent, SiteHeaderComponent, FooterComponent],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly langStore = inject(LanguageStoreService);
  readonly lang = this.langStore.currentLanguage;

  private readonly courseKey = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('key') ?? '')),
    { initialValue: '' }
  );

  readonly course = computed(() => findCourseByKey(this.courseKey()));

  readonly titleKey = computed(() => `LANDING.ALL_COURSES.${this.course()?.key}`);
  readonly categoryTitleKey = computed(() => `LANDING.ALL_COURSES.${this.course()?.categoryKey}_TITLE`);

  private readonly seoService = inject(SeoService);
  private readonly structuredData = inject(StructuredDataService);
  private readonly translate = inject(TranslateService);

  constructor() {
    effect(() => {
      const lang = this.lang();
      const course = this.course();

      if (!course) {
        this.seoService.setupPage(COURSE_NOT_FOUND_SEO, lang, 'courses');
        this.structuredData.clear(['breadcrumb', 'course']);
        return;
      }

      const courseName = this.translate.instant(this.titleKey());
      const categoryName = this.translate.instant(this.categoryTitleKey());
      const siteName = this.translate.instant('LANDING.HEADER.LOGO_ALT');
      const route = `courses/${course.key}`;
      const pageUrl = this.seoService.buildUrl(lang, route);
      const seo = buildCourseDetailSeo(course, courseName, categoryName);

      this.seoService.setupPage(seo, lang, route);

      this.structuredData.set(
        'breadcrumb',
        buildBreadcrumbSchema([
          { name: this.translate.instant('LANDING.NAV.HOME'), url: this.seoService.buildUrl(lang, '') },
          { name: this.translate.instant('LANDING.NAV.COURSES'), url: this.seoService.buildUrl(lang, 'courses') },
          { name: courseName, url: pageUrl },
        ]),
      );

      this.structuredData.set(
        'course',
        buildCourseSchema({
          course,
          name: courseName,
          description: seo[lang].description,
          url: pageUrl,
          imageUrl: `${this.seoService.baseUrl}${course.image}`,
          siteUrl: this.seoService.baseUrl,
          siteName,
          lang,
        }),
      );
    });

    inject(DestroyRef).onDestroy(() => this.structuredData.clear(['breadcrumb', 'course']));
  }

  private formatAmount(amount: number): string {
    const locale = this.langStore.currentLanguage() === 'ar' ? 'ar-SA' : 'en-US';
    return new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  }

  readonly formattedPrice = computed(() => {
    const price = this.course()?.price;
    if (typeof price !== 'number') return '';
    return this.formatAmount(price);
  });

  readonly formattedOriginalPrice = computed(() => {
    const original = this.course()?.originalPrice;
    return original ? this.formatAmount(original) : '';
  });

  readonly savingsPercent = computed(() => {
    const price = this.course()?.price;
    const original = this.course()?.originalPrice;
    if (typeof price !== 'number' || !original || original <= price) return null;
    return Math.round(((original - price) / original) * 100);
  });

  /** 5-item array of full/half/empty star states for the rating template. */
  readonly stars = computed(() => {
    const rating = this.course()?.rating ?? 0;
    return Array.from({ length: 5 }, (_, i) => {
      const diff = rating - i;
      if (diff >= 1) return 'star';
      if (diff >= 0.5) return 'star_half';
      return 'star_border';
    });
  });

  readonly facts = computed<FactItem[]>(() => {
    const c = this.course();
    if (!c) return [];
    return [
      {
        icon: 'signal_cellular_alt',
        labelKey: 'LANDING.COURSE_DETAIL.LEVEL',
        value: null,
        valueKey: c.level ? `LANDING.COURSE_DETAIL.LEVEL_${c.level.toUpperCase()}` : null,
      },
      { icon: 'schedule', labelKey: 'LANDING.COURSE_DETAIL.DURATION', value: c.duration },
      {
        icon: 'timer',
        labelKey: 'LANDING.COURSE_DETAIL.HOURS',
        value: c.trainingHours ? String(c.trainingHours) : null,
      },
      {
        icon: 'verified',
        labelKey: 'LANDING.COURSE_DETAIL.ACCREDITATION_NUMBER',
        value: c.accreditationNumber,
      },
      { icon: 'person', labelKey: 'LANDING.COURSE_DETAIL.INSTRUCTOR', value: c.instructorName },
      { icon: 'event', labelKey: 'LANDING.COURSE_DETAIL.SCHEDULE', value: c.schedule },
      {
        icon: 'location_on',
        labelKey: 'LANDING.COURSE_DETAIL.DELIVERY',
        value: null,
        valueKey: c.deliveryType ? `LANDING.COURSE_DETAIL.DELIVERY_${c.deliveryType.toUpperCase()}` : null,
      },
      {
        icon: 'how_to_reg',
        labelKey: 'LANDING.COURSE_DETAIL.REGISTRATION_STATUS',
        value: null,
        valueKey: c.registrationStatus ? `LANDING.COURSE_DETAIL.STATUS_${c.registrationStatus.toUpperCase()}` : null,
      },
      { icon: 'workspace_premium', labelKey: 'LANDING.COURSE_DETAIL.CERTIFICATE', value: c.certificateType },
    ];
  });
}
