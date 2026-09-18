import { Injectable, signal } from '@angular/core';
import { CarouselSlide } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthBrandService {
  readonly slides = signal<CarouselSlide[]>([]);

  set(slides: CarouselSlide[]): void {
    this.slides.set(slides);
  }

  clear(): void {
    this.slides.set([]);
  }
}
