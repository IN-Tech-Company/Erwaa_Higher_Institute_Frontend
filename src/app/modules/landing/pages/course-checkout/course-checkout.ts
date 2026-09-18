import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';
import { TopBarComponent } from '../../components/top-bar/top-bar';
import { SiteHeaderComponent } from '../../components/site-header/site-header';
import { FooterComponent } from '../../components/footer/footer';
import { LanguageStoreService } from '../../../../shared/services/language-store.service';
import { findCourseByKey } from '../../data/courses-catalog';

interface SummaryFact {
  icon: string;
  /** Plain resolved text (e.g. the duration) — takes priority over valueKey. */
  value: string | null;
  /** i18n key for enum-like fields (level, delivery type). */
  valueKey: string | null;
}

/**
 * Course enrollment "checkout" — reached from `CourseDetailPage`'s register
 * CTA (feedback 2026-09-17: "زي بتاعت الـ checkout بتاعت المتجر
 * الإلكتروني" — an e-commerce-style checkout, not the full account
 * registration form). Collects just what's needed to hold a seat (email,
 * phone, national ID/iqama — same fields/labels as `RegisterComponent`,
 * reused from `AUTH.FIELDS`/`AUTH.VALIDATION` so they stay in sync) next to
 * an order-summary card for the course being booked.
 *
 * There's no real payment gateway wired yet (see docs/project-brief.md,
 * "خطة بوابة الدفع الإلكتروني المستقبلية" — no technical details decided
 * yet), so submitting doesn't charge anything: it shows a confirmation step
 * that's honest about what happens next (the institute's team follows up to
 * complete payment) instead of a fake card-entry form that would imply
 * working payment processing that doesn't exist.
 */
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

  /** A short 2-3 item highlight row for the order-summary card — the full
   * fact grid belongs on `CourseDetailPage`, this is just enough context to
   * confirm "yes, this is the right course" while checking out. `value` is
   * plain resolved text (e.g. the duration), `valueKey` an i18n key for the
   * enum-like fields (level, delivery type) — same split as
   * `CourseDetailPage`'s `FactItem`. */
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

  /** 1 = the checkout form, 2 = the post-submit confirmation screen. */
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
