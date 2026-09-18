import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageStoreService } from '../../../../shared/services/language-store.service';
import { CourseCardComponent } from '../course-card/course-card';

interface CourseCard {
  image: string;
  key: string;
}

@Component({
  selector: 'app-courses-section',
  imports: [TranslatePipe, RouterLink, CourseCardComponent],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesSectionComponent {
  private readonly langStore = inject(LanguageStoreService);

  readonly ctaLink = computed(() => ['/', this.langStore.currentLanguage(), 'courses']);

  readonly courses: CourseCard[] = [
    { image: '/assets/images/specializations/software-diploma.png', key: 'ITEM1' },
    { image: '/assets/images/specializations/it-courses.png', key: 'ITEM2' },
    { image: '/assets/images/specializations/data-entry.png', key: 'ITEM3' },
    { image: '/assets/images/specializations/job-readiness.png', key: 'ITEM4' },
    { image: '/assets/images/specializations/digital-marketing.png', key: 'ITEM5' },
    { image: '/assets/images/specializations/cybersecurity.png', key: 'ITEM6' },
    { image: '/assets/images/specializations/computer-basics.png', key: 'ITEM7' },
    { image: '/assets/images/specializations/positive-behavior.png', key: 'ITEM8' },
  ];
}
