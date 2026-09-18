# مركز الأثر الخالد — Al-Athar Al-Khaled

**منصة تحفيظ القرآن الكريم** | A full-featured Quran memorization center platform, built with Angular 21+.

> Under the supervision of Sheikh Khaled Attia, Al-Athar Al-Khaled connects students with teachers for Quran memorization — scheduling, live sessions, progress tracking, and subscriptions — delivered through a modern, bilingual (AR/EN) dashboard experience.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 21+ (standalone components, no NgModules) |
| State | Angular Signals + `computed()` |
| Routing | Angular Router — lazy-loaded feature modules |
| UI Library | PrimeNG + Angular Material CDK |
| Icons | Boxicons (`bx bx-*`) |
| Charts | Chart.js |
| Maps | Leaflet |
| Auth | JWT — `jwt-decode` + `TokenService` + `AuthGuard` + `AuthInterceptor` |
| i18n | `@ngx-translate/core` — AR / EN with RTL/LTR switching |
| Fonts | Orleen (Arabic, self-hosted `.otf`) · Chillax (English, Fontshare CDN) |
| Styling | SCSS — token-based design system (`@use` module system) |
| Testing | Vitest |
| Formatting | Prettier |
| Build | `@angular-devkit/build-angular` |

---

## Brand

| Token | Value | Usage |
|---|---|---|
| `$primary` | `#09583B` | Green — main brand color |
| `$secondary` | `#E0A54A` | Gold — accent, active states |
| `$neutral` | `#3A4A44` | Neutral — text & muted surfaces |
| `$white` | `#ffffff` | Sidebar text, icon fills on dark bg |
| `$gray-bg` | `#FAFAFB` | Page background |

Full 50–900 scales for each live in `src/styles/tokens/_colors.scss`.

---

## Project Structure

```
src/
├── app/
│   ├── modules/
│   │   ├── auth/                          # Authentication (lazy-loaded)
│   │   │   ├── components/                # Auth UI components
│   │   │   ├── models/                    # Auth interfaces & types
│   │   │   ├── pages/                     # Login, register pages
│   │   │   ├── services/                  # Auth-specific services
│   │   │   └── auth.routes.ts
│   │   │
│   │   └── dashboard/                     # Dashboard shell (lazy-loaded)
│   │       ├── components/
│   │       │   └── layout/
│   │       │       ├── sidebar/           # Collapsible nav sidebar
│   │       │       ├── top-navbar/        # Top bar — page title + nav icons
│   │       │       └── user-dropdown/     # Avatar menu — lang switch, logout
│   │       ├── pages/
│   │       │   └── dashboard-layout-container/
│   │       └── dashboard.routes.ts
│   │
│   └── shared/
│       ├── components/
│       │   ├── help-popup/
│       │   └── popup/
│       ├── guard/
│       │   └── auth.guard.ts
│       ├── interceptors/
│       │   └── auth.interceptor.ts        # Attaches JWT to every request
│       ├── interfaces/
│       │   └── supported-languages.ts     # 'ar' | 'en'
│       ├── models/
│       │   ├── faq-item.model.ts
│       │   ├── page-data.model.ts
│       │   └── page-seo-data.model.ts
│       ├── pipes/
│       │   └── time-ago-pipe.ts
│       ├── providers/
│       │   ├── locale.provider.ts
│       │   ├── primeng-config.provider.ts
│       │   └── translation-provider.ts
│       ├── services/
│       │   ├── language.service.ts        # RTL/LTR + lang switching
│       │   ├── language-store.service.ts  # Signal-based lang state
│       │   ├── nav.service.ts             # Programmatic navigation
│       │   ├── token.service.ts           # JWT read/write/logout
│       │   ├── request.service.ts         # HTTP wrapper
│       │   ├── toast.service.ts
│       │   ├── loader.service.ts
│       │   └── seo.service.ts
│       └── stores/
│           ├── dashboard-navigation-bar-control-store.service.ts
│           └── dashboard-side-bar-control-store.service.ts
│
├── assets/
│   ├── fonts/
│   │   └── orleen/                        # Self-hosted .otf files (100–700)
│   ├── i18n/
│   │   ├── ar.json                        # Arabic translations
│   │   └── en.json                        # English translations
│   └── images/
│       └── logo/                          # AR/EN × White/Dark Navy variants
│
├── environments/
│   ├── environment.ts
│   ├── environment.dev.ts
│   └── environment.prod.ts
│
└── styles/
    ├── main.scss                          # Entry — @forward all partials
    ├── tokens/
    │   ├── _colors.scss                   # Full primary/secondary/neutral palettes
    │   ├── _typography.scss               # @font-face + font stacks
    │   ├── _vars.scss                     # Sidebar widths, header height, transitions
    │   ├── _breakpoints.scss
    │   ├── _spacing.scss
    │   ├── _radius.scss
    │   ├── _shadows.scss
    │   ├── _motion.scss
    │   └── _z-index.scss
    ├── base/
    │   ├── _reset.scss
    │   ├── _globals.scss                  # Body fonts per lang direction
    │   └── _helpers.scss
    ├── layout/
    │   ├── _container.scss
    │   ├── _grid.scss
    │   ├── _screens.scss
    │   └── _stack.scss
    ├── themes/
    │   ├── _light.scss
    │   └── _dark.scss
    └── utilities/
        ├── _animations.scss
        ├── _display.scss
        ├── _spacing.scss
        └── _typography.scss
```

---

## Scripts

```bash
# Development
npm run dev                  # Start dev server on :4200

# Build
npm run build:prod           # Production build
npm run build:ar             # Arabic locale build
npm run build:en             # English locale build

# Quality
npm run lint                 # ESLint check
npm run lint:fix             # ESLint auto-fix
npm run format               # Prettier format
npm run type-check           # tsc --noEmit

# Testing
npm test                     # Run Vitest
npm run test:watch           # Watch mode
npm run test:coverage        # Coverage report

# Utils
npm run analyze              # Bundle analyzer
npm run clean                # Remove dist/
```

---

## Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│  Sidebar (240px / 72px collapsed)  │  Top Navbar         │
│  ─────────────────────────────     │  ─────────────────  │
│  Logo                              │  Page Title         │
│  ─────────────────────────────     │  Nav Icons  Avatar  │
│  • Home                            ├─────────────────────│
│  • Medical Services                │                     │
│  • My Orders                       │   <router-outlet>   │
│  • Shop                            │   (page content)    │
│  • Live Tracking                   │                     │
│  • Subscriptions                   │                     │
│                                    │                     │
│  ADMINISTRATION                    │                     │
│  • Analytics                       │                     │
│  • My Team                         │                     │
│  • Wallet                          │                     │
│  • Support                         │                     │
│  ─────────────────────────────     │                     │
│  [Collapse]                        │                     │
└─────────────────────────────────────────────────────────┘
```

---

## i18n

Translation files live in `src/assets/i18n/`. The app fully supports Arabic (RTL) and English (LTR). Language is persisted and applied to `document.documentElement.dir` and `lang` attributes at runtime.

```
NAV.*          — Navigation item labels
SIDEBAR.*      — Sidebar UI strings
USER_MENU.*    — User dropdown actions
COMMON.*       — Shared labels (Save, Cancel, Delete…)
STATUS.*       — Order/record status labels
```

---

## Architecture Principles

- **Standalone only** — every component declares `standalone: true`; no NgModules anywhere.
- **OnPush everywhere** — `ChangeDetectionStrategy.OnPush` on all components.
- **Signal-first state** — no BehaviorSubject; stores use `signal()` and `computed()`.
- **Token-based SCSS** — never use raw hex values in component stylesheets; always import from `tokens/colors` or `tokens/vars`.
- **Lazy feature modules** — each route group under `modules/` is loaded on demand.
- **RTL-safe layout** — all directional CSS uses `inset-inline-*` / `margin-inline-*` logical properties.
