import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import AOS from 'aos';
import { filter } from 'rxjs';

/**
 * Boots the AOS (Animate On Scroll) library once for the whole app and
 * re-scans the DOM after every route change, since AOS only sees the
 * elements that exist at init time otherwise — lazy-loaded route content
 * would never animate without this.
 *
 * Kept tasteful on purpose (short duration, small offset, once-only) per
 * the client brief: simple scroll/hover motion, nothing heavy — see
 * `docs/project-brief.md` and the design rules in `CLAUDE.md`.
 */
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
        // let the new route's DOM settle before AOS re-scans it
        setTimeout(() => AOS.refresh(), 0);
      });
  }
}
