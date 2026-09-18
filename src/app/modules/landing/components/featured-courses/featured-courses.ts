import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageStoreService } from '../../../../shared/services/language-store.service';
import { CourseCardComponent } from '../course-card/course-card';
import { ALL_COURSES, FlatCourse } from '../../data/courses-catalog';

@Component({
  selector: 'app-featured-courses-section',
  imports: [TranslatePipe, RouterLink, CourseCardComponent],
  templateUrl: './featured-courses.html',
  styleUrl: './featured-courses.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedCoursesSectionComponent {
  private readonly langStore = inject(LanguageStoreService);
  private readonly lang = this.langStore.currentLanguage;

  private readonly featuredKeys = [
    'CAT1_ITEM1',
    'CAT2_ITEM1',
    'CAT3_ITEM1',
    'CAT4_ITEM1',
    'CAT5_ITEM1',
    'CAT6_ITEM1',
  ];

  readonly courses: FlatCourse[] = this.featuredKeys
    .map((key) => ALL_COURSES.find((c) => c.key === key))
    .filter((c): c is FlatCourse => !!c);

  readonly ctaLink = computed(() => ['/', this.lang(), 'courses']);

  detailLink(courseKey: string): string[] {
    return ['/', this.lang(), 'courses', courseKey];
  }
}
