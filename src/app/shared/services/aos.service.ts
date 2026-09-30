import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import AOS from 'aos';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AosService {
  private readonly router = inject(Router);

  init(): void {
    AOS.init({
      duration: 500,
      easing: 'ease-out-cubic',
      offset: 80,
      once: true,
      mirror: false,
    });

    this.router
      .events.pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => AOS.refresh(), 0);
      });
  }
}
