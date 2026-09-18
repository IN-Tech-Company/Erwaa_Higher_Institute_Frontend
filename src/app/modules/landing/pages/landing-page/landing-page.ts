import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TopBarComponent } from '../../components/top-bar/top-bar';
import { SiteHeaderComponent } from '../../components/site-header/site-header';
import { HeroComponent } from '../../components/hero/hero';
import { HeroHighlightsComponent } from '../../components/hero-highlights/hero-highlights';
import { AboutSectionComponent } from '../../components/about/about';
import { StatsSectionComponent } from '../../components/stats/stats';
import { ProgramHistorySectionComponent } from '../../components/program-history/program-history';
import { CoursesSectionComponent } from '../../components/courses/courses';
import { FeaturedCoursesSectionComponent } from '../../components/featured-courses/featured-courses';
import { FeaturesSectionComponent } from '../../components/features/features';
import { PromoBannerComponent } from '../../components/promo-banner/promo-banner';
import { TestimonialsSectionComponent } from '../../components/testimonials/testimonials';
import { FaqSectionComponent } from '../../components/faq/faq';
import { ContactSectionComponent } from '../../components/contact/contact';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-landing-page',
  imports: [TopBarComponent, SiteHeaderComponent, HeroComponent, HeroHighlightsComponent, AboutSectionComponent, StatsSectionComponent, ProgramHistorySectionComponent, CoursesSectionComponent, FeaturedCoursesSectionComponent, FeaturesSectionComponent, PromoBannerComponent, TestimonialsSectionComponent, FaqSectionComponent, ContactSectionComponent, FooterComponent],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage { }
