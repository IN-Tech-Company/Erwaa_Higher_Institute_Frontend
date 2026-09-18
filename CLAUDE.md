# Erwaa Higher Institute — Project Notes

## Project context

Full client brief (institute info, courses, audience, brand, content plan) and a running log of
what's been found/changed in this codebase (old Nabd Plus / Al-Athar Al-Khaled / HR Link leftovers,
what's dead vs live, etc.) live in **[`docs/project-brief.md`](docs/project-brief.md)**. Read it
before assuming project facts — don't re-derive what's already logged there, and add to it (don't
duplicate) when new project facts or cleanup decisions come up.

## Design rules — always apply, on every component, without being asked again

1. **Saudi dialect for site copy.** The institute and its audience are Saudi. Any user-facing text
   written for the site itself (buttons, headings, messages, placeholders, i18n strings) must read
   in Saudi dialect/tone — not Egyptian, not stiff formal MSA. This is about the site's own content
   only.

2. **Small, flat components — never monolithic.** Break every UI section into small, focused
   components instead of one big do-everything component. Avoid deep/complex nesting. Every
   component should be lightweight and easy to read. Build it professional-grade from the first
   version, not "make it work, polish later." Fully responsive; the mobile experience gets the same
   professional bar as desktop, not an afterthought.

3. **Borders: subtle only, never a bold/obvious color.** When a border is needed, use a muted,
   low-contrast, washed-out tone (e.g. a soft neutral at reduced opacity) — never a saturated brand
   color as a border.

4. **Shadows: keep them small.** No large/heavy box-shadows. Prefer the existing small shadow
   tokens (`--shadow-sm` / `--shadow-md` in `src/styles/tokens/_shadows.scss`) over big diffuse ones.

5. **Animation: professional-grade, via a real library — but tasteful.** The project uses **AOS
   (Animate On Scroll)**, installed and wired up in `src/app/shared/services/aos.service.ts`
   (initialized once from the root `App` component, re-scans the DOM on every route change). Add
   `data-aos="..."` attributes to elements to animate them on scroll rather than writing ad-hoc CSS
   transitions. Keep the actual motion restrained (simple scroll/hover interactions, no heavy/3D
   effects) per the client brief in `docs/project-brief.md` — the library is for polish and
   smoothness, not for adding more motion. If a future need calls for animation AOS can't do
   (complex sequenced/timeline animations), confirm with the user before adding another library.

6. **Icons: Google Material Symbols only — not Boxicons.** Use `<span class="material-symbols-outlined">icon_name</span>`
   (the font is already loaded in `src/index.html`) for every new icon. Do **not** add new
   `<i class="bx bx-...">` (Boxicons) usage — that library is legacy in this codebase (it came in
   with the old Nabd Plus / Al-Athar Al-Khaled template) and is being phased out, not standardized
   on. As of 2026-09-17 it's still used in 5 files (notifications-dropdown, app-sidebar, app-table,
   layout, side-panel) — `sidebar` and `top-navbar` were migrated on 2026-09-16 while being touched
   for the dashboard role-model rebuild, and the 3 legal pages (privacy/terms/ownership) were
   migrated on 2026-09-17 while being redesigned (see `docs/project-brief.md` for both). Migrate a
   file to Material Symbols when you're already touching it for other reasons; a dedicated one-shot
   migration of the rest hasn't been requested yet, so don't do it unprompted as a side effect of an
   unrelated task.
