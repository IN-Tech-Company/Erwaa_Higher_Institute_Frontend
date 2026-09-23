# معهد إرواء العالي للتدريب — Erwaa Higher Institute

**من إرواء المعرفة.. إلى صناعة الأثر**

> A vocational training institute platform, licensed by TVTC (المؤسسة العامة للتدريب التقني
> والمهني). Public marketing site (courses/diplomas catalog, institute info, enrollment) plus an
> authenticated dashboard for admins, teachers, and trainees — built with Angular 21+, bilingual
> (AR/EN) with full RTL/LTR support.
>
> This codebase started as a reused template from a previous client project ("Nabd Plus", a
> healthcare platform) and still carries some legacy leftovers being cleaned up incrementally. See
> **[`docs/project-brief.md`](docs/project-brief.md)** for the full project brief and a running log
> of what's been built, fixed, and what's still pending — read it before assuming project facts.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 21+ (standalone components, no NgModules) |
| State | Angular Signals + `computed()` |
| Routing | Angular Router — lazy-loaded feature routes, `:lang` prefix (`ar`/`en`) on every path |
| UI Library | PrimeNG + Angular Material CDK |
| Icons | Google Material Symbols (current standard) — Boxicons still present in a handful of legacy dashboard files, being phased out file-by-file (see `CLAUDE.md`) |
| Animation | AOS (Animate On Scroll) — wired up once in `src/app/shared/services/aos.service.ts` |
| Charts | Chart.js |
| Maps | Leaflet + `@angular/google-maps` |
| Auth | JWT — `jwt-decode` + `TokenService` + route guards (`admin`/`teacher`/`trainee`/`guest`) + `AuthInterceptor` |
| i18n | `@ngx-translate/core` — AR / EN with RTL/LTR switching |
| Fonts | Almarai (self-hosted `.ttf`, 4 weights) |
| Currency | `@abdulrysr/saudi-riyal-new-symbol-font` for the SAR symbol + `Intl.NumberFormat` for amounts |
| Styling | SCSS — token-based design system (`@use`/`@forward` module system) |
| Testing | Vitest |
| Formatting | Prettier |
| Build | `@angular-devkit/build-angular` |

---

## Brand

| Token | Value | Usage |
|---|---|---|
| `$primary` | `#111426` | Navy — main brand color, dark surfaces (header, footer, sidebar) |
| `$secondary` | `#fab629` | Gold — accent, CTAs, active states |
| `$primary-50…950` / `$secondary-50…900` | — | Full generated tint/shade scales |

Sampled directly from the official logo (`src/assets/images/logo/logo.png`). Full scales live in
`src/styles/tokens/_colors.scss`. Never hard-code hex values in component styles — always import
from the tokens.

---

## Project Structure

```
src/
├── app/
│   ├── modules/
│   │   ├── auth/                          # Login, register (trainee/teacher), forgot password
│   │   │   ├── components/auth-layout/    # Shared split layout (form + carousel)
│   │   │   └── pages/
│   │   │       ├── login/
│   │   │       ├── register/              # Trainee sign-up
│   │   │       ├── register-teacher/      # Teacher sign-up (separate flow, no toggle)
│   │   │       └── forgot-password/       # Email → OTP → new password
│   │   │
│   │   ├── landing/                       # Public marketing site
│   │   │   ├── components/                # One component per homepage section:
│   │   │   │                              # top-bar, site-header, hero, hero-highlights,
│   │   │   │                              # about, stats, program-history, courses,
│   │   │   │                              # featured-courses, features, promo-banner,
│   │   │   │                              # testimonials, faq, contact, footer,
│   │   │   │                              # course-card, social-links
│   │   │   ├── data/
│   │   │   │   └── courses-catalog.ts     # All 26 courses/diplomas across 7 categories
│   │   │   └── pages/
│   │   │       ├── landing-page/          # Assembles all homepage sections
│   │   │       ├── all-courses/           # Full catalog grouped by category
│   │   │       ├── course-detail/         # Single course/diploma details
│   │   │       └── course-checkout/       # Enrollment form (no live payment gateway yet)
│   │   │
│   │   ├── dashboard/                     # Authenticated app shell (`/:lang/app`)
│   │   │   ├── components/layout/
│   │   │   │   ├── sidebar/               # Role-based nav (Admin / Teacher / Trainee)
│   │   │   │   ├── top-navbar/
│   │   │   │   └── user-dropdown/
│   │   │   └── pages/
│   │   │       ├── dashboard-layout-container/
│   │   │       └── home/                  # Only page built so far — rest of the role
│   │   │                                  # pages (trainees, teachers, courses admin…)
│   │   │                                  # are still pending
│   │   │
│   │   └── legal/                         # /:lang/legal — privacy, terms, ownership
│   │
│   └── shared/
│       ├── components/                    # help-popup, popup, phone-input, confirm-modal,
│       │                                  # doc-viewer, sidebar-tabs, app-sidebar, app-table…
│       ├── guard/                         # auth/guest/admin/teacher/trainee route guards
│       ├── interceptors/
│       │   └── auth.interceptor.ts        # Attaches JWT to every request
│       ├── directives/                    # animate-on-scroll, drag-scroll, secure-image…
│       ├── models/                        # Shared types (some legacy/unused — see project brief)
│       ├── pipes/
│       │   └── time-ago-pipe.ts
│       ├── providers/                     # locale, primeng-config, translation
│       ├── services/                      # aos, auth, language, nav, request, toast, loader, seo…
│       └── stores/                        # Signal-based sidebar/navbar UI state
│
├── assets/
│   ├── Font/                              # Almarai .ttf (Light/Regular/Bold/ExtraBold)
│   ├── i18n/
│   │   ├── ar.json                        # Arabic translations
│   │   └── en.json                        # English translations
│   └── images/                            # logo, hero, courses, specializations, footer, slider…
│
├── environments/
│   ├── environment.ts
│   ├── environment.dev.ts
│   └── environment.prod.ts
│
└── styles/
    ├── main.scss                          # Entry — @forward all partials
    ├── tokens/                            # colors, typography, spacing, radius, shadows,
    │                                      # breakpoints, motion, z-index, vars
    ├── base/                              # reset, globals, helpers
    ├── layout/                            # container, screens, stack
    └── utilities/                         # animations, display, spacing, typography
```

---

## Routes

All routes are prefixed with a language segment (`/ar/...` or `/en/...`).

```
/                              Homepage (landing sections)
/courses                       Full catalog — 7 categories, 26 courses/diplomas
/courses/:key                  Course/diploma details
/courses/:key/checkout         Enrollment form (no live payment gateway yet)
/legal/privacy|terms|ownership Legal pages

/auth/login
/auth/register                 Trainee sign-up
/auth/register-teacher         Teacher sign-up
/auth/forgot-password          Email → OTP → reset password

/app                            Authenticated dashboard (role-based nav: Admin/Teacher/Trainee)
```

Only `/auth/login` is wired to the real backend (`POST /auth/signin`) so far — the rest of the
auth flows and most dashboard pages are UI-complete but not yet connected. See
`docs/project-brief.md` §20 for backend integration status.

---

## Scripts

```bash
# Development
npm run dev                  # Start dev server (opens browser)

# Build
npm run build:prod           # Production build
npm run build:ar             # Arabic locale build
npm run build:en             # English locale build

# Quality
npm run lint                 # ESLint check
npm run lint:fix             # ESLint auto-fix
npm run format                # Prettier format
npm run type-check           # tsc --noEmit

# Testing
npm test                     # Run Vitest
npm run test:watch           # Watch mode
npm run test:coverage        # Coverage report

# Utils
npm run analyze              # Bundle analyzer
npm run clean                # Remove dist/ and build cache
```

---

## i18n

Translation files live in `src/assets/i18n/`. The app fully supports Arabic (RTL) and English
(LTR); language is persisted and applied to `document.documentElement.dir`/`lang` at runtime, and
every route carries an explicit `:lang` segment.

Saudi dialect/tone is required for all site-facing copy (buttons, headings, messages) — see
`CLAUDE.md` design rule 1.

---

## Architecture Principles

- **Standalone only** — every component declares `standalone: true`; no NgModules anywhere.
- **OnPush everywhere** — `ChangeDetectionStrategy.OnPush` on all components.
- **Signal-first state** — no BehaviorSubject; stores use `signal()` and `computed()`.
- **Token-based SCSS** — never use raw hex values in component stylesheets; always import from
  `styles/tokens/`.
- **Small, focused components** — every UI section is its own lightweight component (see
  `landing/components/`), not one monolithic page.
- **Lazy-loaded routes** — each feature area under `modules/` is loaded on demand.
- **RTL-safe layout** — all directional CSS uses `inset-inline-*` / `margin-inline-*` logical
  properties.
- **No fabricated data** — course/institute facts shown to users must be real or explicitly marked
  as placeholder pending real data (see `courses-catalog.ts` header comment and
  `docs/project-brief.md`).

---

## Project Docs

- **[`CLAUDE.md`](CLAUDE.md)** — design rules that apply to every component (Saudi dialect, Material
  Symbols icons, subtle borders/shadows, AOS animation usage, component structure).
- **[`docs/project-brief.md`](docs/project-brief.md)** — full client brief (institute info, course
  catalog, brand, contact details) and a running log of what's been built, fixed, and what's still
  pending (backend integration, remaining Boxicons migration, legacy leftovers from prior client
  projects). Read it before assuming project facts.
