import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TopBarComponent } from '../../components/top-bar/top-bar';
import { SiteHeaderComponent } from '../../components/site-header/site-header';
import { FooterComponent } from '../../components/footer/footer';
import { CourseCardComponent } from '../../components/course-card/course-card';
import { COURSE_CATEGORIES, ALL_COURSES } from '../../data/courses-catalog';
import { LanguageStoreService } from '../../../../shared/services/language/language-store.service';
import { SeoService } from '../../../../shared/services/seo.service';
import { StructuredDataService } from '../../../../shared/services/structured-data.service';
import { buildBreadcrumbSchema, buildItemListSchema } from '../../data/structured-data-builders';
import { ALL_COURSES_SEO } from '../../data/landing-seo';

/**
 * Full official program catalog (7 classifications, 26 programs/courses —
 * see docs/project-brief.md §2), reached via the "Courses" section's CTA
 * on the homepage. The homepage itself keeps showing its original 8 cards
 * unchanged — this page is the complete list. The catalog data itself
 * lives in `data/courses-catalog.ts`, shared with `CourseDetailPage`.
 */
@Component({
  selector: 'app-all-courses-page',
  imports: [TranslatePipe, TopBarComponent, SiteHeaderComponent, FooterComponent, CourseCardComponent],
  templateUrl: './all-courses.html',
  styleUrl: './all-courses.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllCoursesPage {
  private readonly langStore = inject(LanguageStoreService);
  private readonly lang = this.langStore.currentLanguage;
  private readonly seoService = inject(SeoService);
  private readonly structuredData = inject(StructuredDataService);
  private readonly translate = inject(TranslateService);

  readonly categories = COURSE_CATEGORIES;

  /** 'ALL' or a category key — which tab is active. */
  readonly selectedCategory = signal('ALL');

  readonly filteredCourses = computed(() => {
    const selected = this.selectedCategory();
    if (selected === 'ALL') return ALL_COURSES;
    return ALL_COURSES.filter((course) => course.categoryKey === selected);
  });

  constructor() {
    // Breadcrumb + the course ItemList represent this page's full catalog
    // regardless of which category tab is active, so they only depend on
    // language, not `selectedCategory`.
    effect(() => {
      const lang = this.lang();
      this.seoService.setupPage(ALL_COURSES_SEO, lang, 'courses');

      const homeUrl = this.seoService.buildUrl(lang, '');
      const coursesUrl = this.seoService.buildUrl(lang, 'courses');
      this.structuredData.set(
        'breadcrumb',
        buildBreadcrumbSchema([
          { name: this.translate.instant('LANDING.NAV.HOME'), url: homeUrl },
          { name: this.translate.instant('LANDING.NAV.COURSES'), url: coursesUrl },
        ]),
      );

      this.structuredData.set(
        'itemlist',
        buildItemListSchema(
          ALL_COURSES.map((course) => ({
            name: this.translate.instant(`LANDING.ALL_COURSES.${course.key}`),
            url: this.seoService.buildUrl(lang, `courses/${course.key}`),
          })),
        ),
      );
    });

    inject(DestroyRef).onDestroy(() => this.structuredData.clear(['breadcrumb', 'itemlist']));
  }

  selectCategory(key: string): void {
    this.selectedCategory.set(key);
  }

  detailLink(courseKey: string): string[] {
    return ['/', this.lang(), 'courses', courseKey];
  }
}
