# Research: User Settings API Integration

## Overview
Connect the existing settings profile UI to the backend `UserSettingsController` which exposes:
- `GET /api/users/me` → fetch authenticated user profile (`UserProfileDto`)
- `PUT /api/users/me/settings` → update profile (`UpdateUserRequestDto`)

## Affected Files & Modules

### Backend DTOs to model
- `UserProfileDto`: id, firstName, lastName, phone, email, role, gender, dateOfBirth
- `UpdateUserRequestDto`: firstName, lastName, email, gender, dateOfBirth

### Frontend files to create
- `src/app/shared/models/user-profile.model.ts` — TS interfaces for the two DTOs
- `src/app/shared/services/user-settings.service.ts` — service wrapping GET + PUT

### Frontend files to modify
- `src/app/shared/services/request.service.ts` — fix hardcoded `baseUrl`, use `environment.apiUrl`
- `src/app/modules/dashboard/pages/settings-profile/settings-profile.component.ts` — replace mock data with service call; wire save to PUT endpoint; add gender + dateOfBirth fields
- `src/app/modules/dashboard/pages/settings-profile/settings-profile.component.html` — add gender/DOB rows with proper display
- `src/app/modules/dashboard/components/settings/settings-sidebar/settings-sidebar.component.ts` — replace mock info fields with real profile data from service
- `src/assets/i18n/ar.json` + `en.json` — add missing translation keys (profile field labels, success/error toasts)

## Proposed Approach

1. **Fix baseUrl** in `RequestService` to read from `environment.apiUrl` (currently hardcoded to a wrong URL).
2. **Create model interfaces** for `UserProfileDto` and `UpdateUserRequestDto`.
3. **Create `UserSettingsService`** with:
   - `getProfile()` → `GET /users/me`, stores result in a signal `profile`
   - `updateProfile(data)` → `PUT /users/me/settings`, updates the signal on success
4. **Update `SettingsProfileComponent`**:
   - Inject `UserSettingsService`, call `getProfile()` on init
   - Derive `infoRows` from the profile signal (firstName, lastName, email, phone, gender, dateOfBirth)
   - Wire `onSave()` to call `updateProfile()` with changed fields
   - Show toast on success/error
5. **Update `SettingsSidebarComponent`**: consume profile signal from service for name + info fields.
6. **Add i18n keys** for new profile fields (FIRST_NAME, LAST_NAME, PHONE, GENDER, DATE_OF_BIRTH) and toast messages.

## Phases

### Phase 1 — Foundation
- Fix `RequestService` baseUrl
- Add model interfaces
- Create `UserSettingsService`

### Phase 2 — Profile page wiring
- Update `SettingsProfileComponent` (fetch + save)
- Update template for new fields

### Phase 3 — Sidebar wiring
- Update `SettingsSidebarComponent` to use real data

### Phase 4 — i18n
- Add missing keys to ar.json and en.json

## Potential Risks / Edge Cases
- `RequestService.baseUrl` is wrong; fixing it may affect other features using the service — verify no other pages rely on the old URL pattern.
- Gender is an enum (`MALE`/`FEMALE`) — need a dropdown/select, not a plain text input. The current `EditPanelComponent` only supports `<input type="text">`, so the profile page should handle gender editing inline (not via EditPanel).
- `dateOfBirth` is a `LocalDate` (ISO string `YYYY-MM-DD`) — the input type should be `date`.
- The profile page currently mixes Arabic hardcoded strings; everything must be replaced with translation keys.
- `SettingsSidebarComponent` currently uses `mockInfoFields` — replace carefully without breaking the sidebar layout.
