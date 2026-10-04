import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';
import { TopBarComponent } from '../../components/top-bar/top-bar';
import { SiteHeaderComponent } from '../../components/site-header/site-header';
import { FooterComponent } from '../../components/footer/footer';
import { LanguageStoreService } from '../../../../shared/services/language/language-store.service';
import { SeoService } from '../../../../shared/services/seo.service';
import { buildCheckoutSeo } from '../../data/landing-seo';
import { findCourseByKey } from '../../data/courses-catalog';

interface SummaryFact {
  icon: string;
  value: string | null;
  valueKey: string | null;
}

@Component({
  selector: 'app-course-checkout-page',
  imports: [TranslatePipe, RouterLink, TopBarComponent, SiteHeaderComponent, FooterComponent],
  templateUrl: './course-checkout.html',
  styleUrl: './course-checkout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseCheckoutPage {
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
  private readonly translate = inject(TranslateService);

  constructor() {
    // Checkout is a transactional step, never meant for search results —
    // always noindex (see buildCheckoutSeo). Still localized/reactive so
    // the tab title reads correctly in both languages.
    effect(() => {
      const course = this.course();
      const courseName = course ? this.translate.instant(this.titleKey()) : '';
      this.seoService.setupPage(buildCheckoutSeo(courseName), this.lang(), `courses/${this.courseKey()}/checkout`);
    });
  }

  readonly summaryFacts = computed<SummaryFact[]>(() => {
    const c = this.course();
    if (!c) return [];
    const facts: (SummaryFact | null)[] = [
      c.duration ? { icon: 'schedule', value: c.duration, valueKey: null } : null,
      c.level
        ? { icon: 'signal_cellular_alt', value: null, valueKey: `LANDING.COURSE_DETAIL.LEVEL_${c.level.toUpperCase()}` }
        : null,
      c.deliveryType
        ? { icon: 'location_on', value: null, valueKey: `LANDING.COURSE_DETAIL.DELIVERY_${c.deliveryType.toUpperCase()}` }
        : null,
    ];
    return facts.filter((f): f is SummaryFact => f !== null);
  });

  readonly fullName = signal('');
  readonly email = signal('');
  readonly phone = signal('');
  readonly nationalId = signal('');
  readonly dateOfBirth = signal('');
  readonly submitted = signal(false);

  readonly step = signal<1 | 2>(1);

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

  onFullNameInput(event: Event): void {
    this.fullName.set((event.target as HTMLInputElement).value);
  }

  onEmailInput(event: Event): void {
    this.email.set((event.target as HTMLInputElement).value);
  }

  onPhoneInput(event: Event): void {
    this.phone.set((event.target as HTMLInputElement).value);
  }

  onNationalIdInput(event: Event): void {
    this.nationalId.set((event.target as HTMLInputElement).value);
  }

  onDateOfBirthInput(event: Event): void {
    this.dateOfBirth.set((event.target as HTMLInputElement).value);
  }

  submit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);

    const valid =
      !!this.fullName() &&
      !!this.email() &&
      !!this.phone() &&
      !!this.nationalId() &&
      !!this.dateOfBirth();
    if (!valid) return;

    // TODO: wire to the real enrollment/payment API once it exists — see
    // the class doc comment above and docs/project-brief.md.
    this.step.set(2);
  }
}
