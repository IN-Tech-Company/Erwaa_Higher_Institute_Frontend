import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TopBarComponent } from '../../components/top-bar/top-bar';
import { SiteHeaderComponent } from '../../components/site-header/site-header';
import { FooterComponent } from '../../components/footer/footer';
import { CourseCardComponent } from '../../components/course-card/course-card';
import { COURSE_CATEGORIES, ALL_COURSES } from '../../data/courses-catalog';
import { LanguageStoreService } from '../../../../shared/services/language-store.service';

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

  readonly categories = COURSE_CATEGORIES;

  /** 'ALL' or a category key — which tab is active. */
  readonly selectedCategory = signal('ALL');

  readonly filteredCourses = computed(() => {
    const selected = this.selectedCategory();
    if (selected === 'ALL') return ALL_COURSES;
    return ALL_COURSES.filter((course) => course.categoryKey === selected);
  });

  selectCategory(key: string): void {
    this.selectedCategory.set(key);
  }

  detailLink(courseKey: string): string[] {
    return ['/', this.lang(), 'courses', courseKey];
  }
}
