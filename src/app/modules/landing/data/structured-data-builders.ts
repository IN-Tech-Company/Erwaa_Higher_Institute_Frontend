import { FlatCourse } from './courses-catalog';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqSchema(items: FaqItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export interface CourseListEntry {
  name: string;
  url: string;
}

export function buildItemListSchema(items: CourseListEntry[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function buildCourseSchema(params: {
  course: FlatCourse;
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  siteUrl: string;
  siteName: string;
  lang: 'ar' | 'en';
}): Record<string, unknown> {
  const { course, name, description, url, imageUrl, siteUrl, siteName, lang } = params;

  const availability =
    course.registrationStatus === 'closed'
      ? 'https://schema.org/SoldOut'
      : course.registrationStatus === 'full'
        ? 'https://schema.org/LimitedAvailability'
        : 'https://schema.org/InStock';

  const offers =
    typeof course.price === 'number'
      ? { '@type': 'Offer', price: course.price, priceCurrency: 'SAR', availability, url }
      : course.price === 'free'
        ? { '@type': 'Offer', price: 0, priceCurrency: 'SAR', availability, url }
        : undefined;

  const courseMode =
    course.deliveryType === 'onsite' ? 'Onsite' : course.deliveryType === 'remote' ? 'Online' : course.deliveryType === 'hybrid' ? 'Blended' : undefined;

  const hasCourseInstance =
    courseMode || course.trainingHours
      ? {
        '@type': 'CourseInstance',
        ...(courseMode ? { courseMode } : {}),
        ...(course.trainingHours ? { courseWorkload: `PT${course.trainingHours}H` } : {}),
      }
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url,
    image: imageUrl,
    inLanguage: lang,
    provider: {
      '@type': 'EducationalOrganization',
      name: siteName,
      sameAs: siteUrl,
    },
    ...(course.accreditationNumber ? { courseCode: course.accreditationNumber } : {}),
    ...(offers ? { offers } : {}),
    ...(hasCourseInstance ? { hasCourseInstance } : {}),
  };
}
