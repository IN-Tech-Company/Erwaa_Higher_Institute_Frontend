import { LandingPageSeo } from '../../../shared/services/seo.service';
import { FlatCourse } from './courses-catalog';


export const HOME_SEO: LandingPageSeo = {
  ar: {
    title: 'معهد إرواء العالي للتدريب | من إرواء المعرفة.. إلى صناعة الأثر',
    description:
      'معهد إرواء العالي للتدريب، منشأة تدريبية مرخصة من المؤسسة العامة للتدريب التقني والمهني | دبلومات ودورات تدريبية تأهيلية وتطويرية | برمجيات الحاسب | تسويق إلكتروني | أمن سيبراني | تأهيل وظيفي | حضورياً وعن بُعد لجميع مناطق المملكة العربية السعودية',
    keywords:
      'معهد إرواء, معهد إرواء العالي للتدريب, دورات تدريبية, دبلومات, تدريب تقني ومهني, تأهيل وظيفي, دبلوم برمجيات الحاسب, دورات التسويق الإلكتروني, دورات الأمن السيبراني, مبادئ الحاسب الآلي, تطوير مهني, تدريب أونلاين السعودية, Erwaa Institute, vocational training Saudi Arabia, TVTC accredited courses',
  },
  en: {
    title: 'Erwaa Higher Institute for Training | TVTC-Accredited Diplomas & Training Courses',
    description:
      'Erwaa Higher Institute for Training offers TVTC and National e-Learning Center accredited diploma programs and vocational training courses — IT, digital marketing, cybersecurity, and career readiness — on-site and online across Saudi Arabia.',
    keywords:
      'Erwaa Institute, Erwaa Higher Institute for Training, vocational training Saudi Arabia, TVTC accredited courses, IT diploma Saudi Arabia, digital marketing courses, cybersecurity training, online training Saudi Arabia, career readiness programs',
  },
};

export const ALL_COURSES_SEO: LandingPageSeo = {
  ar: {
    title: 'جميع الدورات والدبلومات',
    description:
      'تصفح جميع دبلومات ودورات معهد إرواء العالي للتدريب المعتمدة من المؤسسة العامة للتدريب التقني والمهني: برمجيات الحاسب، تقنية المعلومات، التسويق الإلكتروني، الأمن السيبراني، التأهيل الوظيفي، والتطوير المهني — حضورياً وعن بُعد لجميع مناطق المملكة العربية السعودية.',
    keywords:
      'جميع الدورات التدريبية, دبلومات معهد إرواء, دورات تقنية المعلومات, دورات تسويق إلكتروني, دورات أمن سيبراني, تأهيل وظيفي, دورات تطوير مهني, تدريب معتمد التقني والمهني',
  },
  en: {
    title: 'All Courses & Diplomas',
    description:
      'Browse every TVTC-accredited diploma and training course at Erwaa Higher Institute: computer software, IT, digital marketing, cybersecurity, career readiness, and professional development — on-site and online across Saudi Arabia.',
    keywords:
      'all training courses, Erwaa diplomas, IT courses Saudi Arabia, digital marketing courses, cybersecurity courses, career readiness training, professional development courses, TVTC accredited training',
  },
};


export function buildCourseDetailSeo(course: FlatCourse, courseName: string, categoryName: string): LandingPageSeo {
  const arDescription =
    [
      course.objectives,
      course.duration ? `مدة البرنامج: ${course.duration}.` : null,
      course.accreditationNumber ? `دورة معتمدة من المؤسسة العامة للتدريب التقني والمهني برقم اعتماد ${course.accreditationNumber}.` : null,
    ]
      .filter(Boolean)
      .join(' ') || `${courseName} — ضمن برامج ${categoryName} في معهد إرواء العالي للتدريب.`;

  const enDescription = [
    `${courseName} — a TVTC-accredited ${categoryName} program at Erwaa Higher Institute for Training.`,
    course.duration ? `Duration: ${course.duration}.` : null,
    course.accreditationNumber ? `TVTC accreditation #${course.accreditationNumber}.` : null,
    'On-site and online training available across Saudi Arabia.',
  ]
    .filter(Boolean)
    .join(' ');

  return {
    ar: {
      title: courseName,
      description: arDescription,
      keywords: `${courseName}, ${categoryName}, دورات معهد إرواء, تدريب معتمد التقني والمهني, دبلومات ودورات السعودية`,
      image: course.image,
    },
    en: {
      title: courseName,
      description: enDescription,
      keywords: `${courseName}, ${categoryName}, Erwaa courses, TVTC accredited training, Saudi Arabia training courses`,
      image: course.image,
    },
  };
}

export const COURSE_NOT_FOUND_SEO: LandingPageSeo = {
  ar: {
    title: 'الدورة غير متاحة',
    description: 'هذه الدورة غير متاحة حالياً. تصفح جميع الدورات والدبلومات المتاحة في معهد إرواء العالي للتدريب.',
    noindex: true,
  },
  en: {
    title: 'Course Not Found',
    description: 'This course is not currently available. Browse all available courses and diplomas at Erwaa Higher Institute for Training.',
    noindex: true,
  },
};

/** Checkout is a transactional step, not a search landing page — always noindex. */
export function buildCheckoutSeo(courseName: string): LandingPageSeo {
  return {
    ar: {
      title: `التسجيل في ${courseName}`,
      description: `إتمام بيانات التسجيل والدفع لبرنامج ${courseName} في معهد إرواء العالي للتدريب.`,
      noindex: true,
    },
    en: {
      title: `Enroll in ${courseName}`,
      description: `Complete your enrollment and payment details for the ${courseName} program at Erwaa Higher Institute for Training.`,
      noindex: true,
    },
  };
}
