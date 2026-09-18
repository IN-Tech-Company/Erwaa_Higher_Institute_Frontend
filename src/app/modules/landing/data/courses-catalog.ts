/**
 * Single source of truth for the full official program catalog (7
 * classifications, 26 programs/courses — see docs/project-brief.md §2).
 * Shared by `AllCoursesPage` (the grid) and `CourseDetailPage` (a single
 * course) so the list only lives in one place.
 *
 * Field confidence is mixed on purpose — read the per-field notes below:
 *
 * - `key`: real.
 * - `image`: real dedicated per-course photo for all 26 courses (delivered
 *   2026-09-16 as branded marketing posters, renamed from Arabic to clean
 *   English filenames — see docs/project-brief.md).
 * - `duration`, `trainingHours`, `accreditationNumber`: **real**, transcribed
 *   from the official TVTC-accredited program table the client sent
 *   2026-09-16 (course name / duration / hours / accreditation number per
 *   program). Item 1 (the diploma)'s accreditation number ("388") was
 *   confirmed separately from its own marketing poster image; its total
 *   training hours still weren't shown anywhere and stay `null` rather
 *   than guessed — see docs/project-brief.md.
 * - `price`, `originalPrice`, `rating`, `priceNote`, `level`, `instructorName`,
 *   `schedule`, `targetAudience`, `requirements`, `objectives`,
 *   `deliveryType`, `deliveryLocation`, `registrationStatus`,
 *   `certificateType`: still **temporary design placeholders** (client
 *   request 2026-09-16: "اكتب في الكروت تفاصيل ثابتة دلوقتي نعمل التصميم
 *   بس" / 2026-09-17: also asked for a discount price + a star rating on
 *   the card) — not real data yet. Nothing here reads as a specific
 *   invented fact (no invented person's name, city, or exact date) —
 *   replace with the institute's real per-course data before this goes
 *   live, **especially the rating (currently just a placeholder number,
 *   not from real trainee feedback)**.
 */

export type CoursePrice = number | 'free' | null;
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | null;
export type CourseDeliveryType = 'onsite' | 'remote' | 'hybrid' | null;
export type CourseRegistrationStatus = 'open' | 'full' | 'closed' | null;

export interface CatalogCourse {
  /** i18n key — resolves to LANDING.ALL_COURSES.<key> */
  key: string;
  image: string;
  price: CoursePrice;
  /** "Before discount" price shown struck through next to `price` — null when `price` isn't a plain number (free/unannounced). */
  originalPrice: number | null;
  /** Payment note shown under the price (e.g. "يشمل شهادة الإتمام") — null = none yet. */
  priceNote: string | null;
  /** Placeholder star rating out of 5 — not from real trainee feedback yet. */
  rating: number | null;
  /** Free-text duration as given by the institute (e.g. "شهر", "٦ أيام", "سنتين ونصف") — real. */
  duration: string | null;
  level: CourseLevel;
  instructorName: string | null;
  schedule: string | null;
  /** Real, from the official TVTC accreditation table. */
  trainingHours: number | null;
  /** Real TVTC accreditation number for this program. */
  accreditationNumber: string | null;
  targetAudience: string | null;
  requirements: string | null;
  objectives: string | null;
  deliveryType: CourseDeliveryType;
  deliveryLocation: string | null;
  registrationStatus: CourseRegistrationStatus;
  certificateType: string | null;
}

export interface CatalogCategory {
  /** i18n key — resolves to LANDING.ALL_COURSES.<key>_TITLE */
  key: string;
  courses: CatalogCourse[];
}

export interface FlatCourse extends CatalogCourse {
  categoryKey: string;
}

// ── Still-placeholder generators (level/delivery/registration/instructor/
// schedule/certificate) — deterministic and varied, nothing that reads as a
// specific invented fact. See the file-level note above. ──────────────────
const LEVELS: CourseLevel[] = ['beginner', 'intermediate', 'advanced'];
const levelAt = (i: number): CourseLevel => LEVELS[i % LEVELS.length];

const DELIVERY_TYPES: CourseDeliveryType[] = ['onsite', 'remote', 'hybrid'];
const deliveryTypeAt = (i: number): CourseDeliveryType => DELIVERY_TYPES[i % DELIVERY_TYPES.length];

const registrationStatusAt = (i: number): CourseRegistrationStatus => {
  if (i % 9 === 0) return 'closed';
  if (i % 6 === 0) return 'full';
  return 'open';
};

// Generic recurring cadence — not a specific invented date.
const SCHEDULES = ['دورة جديدة تنطلق كل شهر', 'يُعلن عن الموعد قبل بداية كل فوج بأسبوعين'];
const scheduleAt = (i: number): string => SCHEDULES[i % SCHEDULES.length];

// "Before discount" price — a markup over the real placeholder price,
// rounded to a clean number. Free courses have no original price.
const DISCOUNT_MULTIPLIERS = [1.2, 1.35, 1.5, 1.25, 1.4];
const originalPriceAt = (price: CoursePrice, i: number): number | null => {
  if (typeof price !== 'number') return null;
  const multiplier = DISCOUNT_MULTIPLIERS[i % DISCOUNT_MULTIPLIERS.length];
  return Math.round((price * multiplier) / 10) * 10;
};

// Placeholder star rating (out of 5) — see file-level note above.
const RATINGS = [4.9, 4.7, 4.8, 5, 4.6, 4.9, 4.7, 4.8];
const ratingAt = (i: number): number => RATINGS[i % RATINGS.length];

// Reuses the site's own already-approved phrasing (AUTH.BRAND copy) rather
// than inventing a specific person's name.
const INSTRUCTOR_PLACEHOLDER = 'نخبة من المدربين والمدربات المعتمدين';
const CERTIFICATE_PLACEHOLDER = 'شهادة إتمام معتمدة من معهد إرواء العالي للتدريب';

/** Per-category fallback content for the long-form fields — reused across
 *  every course in the same category, applied when flattening below. */
const CATEGORY_DEFAULTS: Record<
  string,
  Pick<CatalogCourse, 'targetAudience' | 'requirements' | 'objectives' | 'deliveryLocation'>
> = {
  CAT1: {
    targetAudience: 'خريجي وخريجات الثانوية العامة الراغبين في التخصص بمجال البرمجة وتقنية المعلومات.',
    requirements: 'شهادة الثانوية العامة، وإجادة أساسيات الحاسب الآلي.',
    objectives: 'تأهيل المتدرب للعمل في مجال برمجة وصيانة الحاسب الآلي، بمهارات عملية تلبي احتياج سوق العمل.',
    deliveryLocation: 'مقر المعهد، مع إمكانية متابعة بعض المحاضرات عن بُعد.',
  },
  CAT2: {
    targetAudience: 'الباحثين والباحثات عن عمل في المجال الإداري والمكتبي.',
    requirements: 'إجادة القراءة والكتابة، ولا يُشترط خبرة سابقة.',
    objectives: 'تأهيل المتدرب لإتقان إدخال البيانات ومعالجة النصوص بسرعة ودقة عالية.',
    deliveryLocation: 'مقر المعهد.',
  },
  CAT3: {
    targetAudience: 'المهتمين والمهتمات بتطوير مهاراتهم التقنية للاستخدام الشخصي أو الوظيفي.',
    requirements: 'لا يُشترط خبرة سابقة، ويُفضّل إجادة أساسيات التعامل مع الحاسب الآلي.',
    objectives: 'إكساب المتدرب مهارات تقنية عملية قابلة للتطبيق الفوري في بيئة العمل.',
    deliveryLocation: 'مقر المعهد أو عن بُعد حسب الدورة.',
  },
  CAT4: {
    targetAudience: 'موظفي وموظفات القطاعين الحكومي والخاص، والراغبين في العمل الإداري والمكتبي.',
    requirements: 'لا يُشترط خبرة سابقة.',
    objectives: 'تمكين المتدرب من إتقان المهام الإدارية والمكتبية والأنظمة المستخدمة فيها.',
    deliveryLocation: 'مقر المعهد.',
  },
  CAT5: {
    targetAudience: 'كل الراغبين والراغبات في تطوير مهاراتهم الشخصية والمهنية.',
    requirements: 'لا يُشترط خبرة سابقة أو مؤهل معيّن.',
    objectives: 'تنمية المهارات الشخصية والمهنية للمتدرب بما يخدم حياته العملية والاجتماعية.',
    deliveryLocation: 'مقر المعهد أو عن بُعد حسب الدورة.',
  },
  CAT6: {
    targetAudience: 'المهتمين والمهتمات بمجال التصميم الجرافيكي والمرئي.',
    requirements: 'لا يُشترط خبرة سابقة، ويُفضّل توفر جهاز حاسب للتطبيق العملي.',
    objectives: 'إكساب المتدرب أساسيات التصميم العملية باستخدام برامج معتمدة في المجال.',
    deliveryLocation: 'مقر المعهد أو عن بُعد حسب الدورة.',
  },
  CAT7: {
    targetAudience: 'المهتمين والمهتمات باحتراف المجال كهواية أو كمصدر دخل.',
    requirements: 'لا يُشترط خبرة سابقة.',
    objectives: 'تأهيل المتدرب عمليًا لاحتراف المهارة والانطلاق بها كمشروع أو مسار مهني.',
    deliveryLocation: 'مقر المعهد.',
  },
};

/** `i` is the course's position in the full 26-course list (0-based) — drives
 *  the still-placeholder values (level/delivery/schedule/registration).
 *  `duration`/`hours`/`accreditation` are the real, transcribed values.
 *  `image` is the real dedicated photo, or `fallbackImageAt(i)` for the 2
 *  courses that don't have one yet. */
const course = (
  key: string,
  i: number,
  image: string,
  price: CoursePrice,
  duration: string | null,
  hours: number | null,
  accreditation: string | null
): CatalogCourse => ({
  key,
  image,
  price,
  originalPrice: originalPriceAt(price, i),
  priceNote: null,
  rating: ratingAt(i),
  duration,
  level: levelAt(i),
  instructorName: INSTRUCTOR_PLACEHOLDER,
  schedule: scheduleAt(i),
  trainingHours: hours,
  accreditationNumber: accreditation,
  targetAudience: null, // filled from CATEGORY_DEFAULTS when flattening
  requirements: null,
  objectives: null,
  deliveryType: deliveryTypeAt(i),
  deliveryLocation: null,
  registrationStatus: registrationStatusAt(i),
  certificateType: CERTIFICATE_PLACEHOLDER,
});

export const COURSE_CATEGORIES: CatalogCategory[] = [
  {
    key: 'CAT1',
    // Hours unreadable in the source table for this one — see file-level note.
    courses: [
      course('CAT1_ITEM1', 0, '/assets/images/courses/computer-it-diploma.png', 899, 'سنتين ونصف', null, '388'),
    ],
  },
  {
    key: 'CAT2',
    courses: [
      course('CAT2_ITEM1', 1, '/assets/images/courses/data-entry-course.png', 'free', '6 أشهر', 240, '6289'),
    ],
  },
  {
    key: 'CAT3',
    courses: [
      course('CAT3_ITEM1', 2, '/assets/images/courses/computer-maintenance.png', 249, 'شهر', 59, '29882'),
      course('CAT3_ITEM2', 3, '/assets/images/courses/computer-basics-course.png', 149, 'شهر', 60, '40884'),
      course('CAT3_ITEM3', 4, '/assets/images/courses/cybersecurity-course.png', 349, '4 أيام', 12, '40870'),
      course('CAT3_ITEM4', 5, '/assets/images/courses/digital-marketing-course.png', 299, '4 أيام', 12, '40892'),
      course('CAT3_ITEM5', 6, '/assets/images/courses/powerpoint.png', 129, '4 أيام', 12, '40887'),
    ],
  },
  {
    key: 'CAT4',
    courses: [
      course('CAT4_ITEM1', 7, '/assets/images/courses/noor-program.png', 199, '30 يوم', 60, '40898'),
      course('CAT4_ITEM2', 8, '/assets/images/courses/executive-secretary.png', 249, '30 يوم', 60, '40882'),
    ],
  },
  {
    key: 'CAT5',
    courses: [
      course('CAT5_ITEM1', 9, '/assets/images/courses/trainer-training.png', 399, '6 أيام', 30, '40902'),
      course('CAT5_ITEM2', 10, '/assets/images/courses/positive-behavior-course.png', 'free', 'يوم واحد', 4, '40899'),
      course('CAT5_ITEM3', 11, '/assets/images/courses/family-counseling-training.png', 249, '5 أيام', 15, '40895'),
      course('CAT5_ITEM4', 12, '/assets/images/courses/aptitude-test-prep.png', 199, '4 أيام', 9, '40874'),
      course('CAT5_ITEM5', 13, '/assets/images/courses/workplace-excellence.png', 179, 'يومين', 6, '40863'),
      course('CAT5_ITEM6', 14, '/assets/images/courses/public-speaking-skills.png', 199, 'يومين', 6, '40890'),
      course('CAT5_ITEM7', 15, '/assets/images/courses/job-readiness-course.png', 'free', '3 أيام', 10, '40891'),
      course('CAT5_ITEM8', 16, '/assets/images/courses/premarital-readiness.png', 149, '3 أيام', 9, '40901'),
      course('CAT5_ITEM9', 17, '/assets/images/courses/volunteer-work.png', 'free', '3 أيام', 9, '40896'),
    ],
  },
  {
    key: 'CAT6',
    courses: [
      course('CAT6_ITEM1', 18, '/assets/images/courses/infographic-design.png', 199, '15 يوم', 45, '40876'),
      course('CAT6_ITEM2', 19, '/assets/images/courses/motion-graphics.png', 349, '10 أيام', 31, '40873'),
      course('CAT6_ITEM3', 20, '/assets/images/courses/photoshop-course.png', 249, 'شهر', 60, '40872'),
    ],
  },
  {
    key: 'CAT7',
    courses: [
      course('CAT7_ITEM1', 21, '/assets/images/courses/makeup-art.png', 299, '10 أيام', 30, '40905'),
      course('CAT7_ITEM2', 22, '/assets/images/courses/hiar_care.png', 349, '15 يوم', 30, '40907'),
      course('CAT7_ITEM3', 23, '/assets/images/courses/flower-arrangement.png', 199, '10 أيام', 30, '40885'),
      course('CAT7_ITEM4', 24, '/assets/images/courses/photography-art.png', 249, '10 أيام', 30, '40909'),
      course('CAT7_ITEM5', 25, '/assets/images/courses/mobile-photography.png', 149, '4 أيام', 12, '40900'),
    ],
  },
];

/** Every course flattened into one list, tagged with its category and
 *  filled in with that category's placeholder audience/requirements/
 *  objectives/location. */
export const ALL_COURSES: FlatCourse[] = COURSE_CATEGORIES.flatMap((category) => {
  const defaults = CATEGORY_DEFAULTS[category.key];
  return category.courses.map((c) => ({
    ...c,
    ...defaults,
    categoryKey: category.key,
  }));
});

export function findCourseByKey(key: string): FlatCourse | undefined {
  return ALL_COURSES.find((c) => c.key === key);
}
