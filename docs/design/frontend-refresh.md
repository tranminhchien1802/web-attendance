# PLT SOLUTIONS — Frontend refresh

## Delivered

- Shared navy header and collapsible sidebar with indigo PLT selection states; mobile navigation drawer.
- Larger reading scale: 17–18px main content, forms, navigation and table values; 20px+ section headings.
- Separate student/teacher photo banners and course covers using the existing image collection.
- Shared course colors across course cards and weekly schedules.
- Account search, role/status filters, pagination, mobile cards, create/edit drawers, field errors and deletion confirmation.
- Toasts, loading skeletons, progress transitions, updated-row feedback, reduced-motion support and back-to-top control.
- Diary timeline with class/date/search filters, periods, notes, edit/delete and Excel export.
- Attendance controls with per-session period count, student search/status filters and unsaved-change warning.
- QR duration selection, countdown, expiration/closed states, regenerate/revoke, copy code and duplicate check-in feedback.
- Student attendance history, absence threshold configuration and absence summaries with Excel export.
- Grade editing and export; dashboard results read the same browser data as the teacher tools.
- Temporary profile API failures show retry instead of erasing a valid session.
- Login demo buttons are labelled as demo accounts rather than Google OAuth.

## Data boundaries

Authentication and account CRUD use Laravel and MySQL. Courses and rosters are frontend demo data; journals, grades, QR sessions, attendance and warning settings are browser-local. These modules still need backend APIs for persistence and synchronization between devices. Camera scanning depends on native BarcodeDetector availability, browser permission and a secure origin; manual code entry remains available.

Demo course teacher references now use userCode (for example GV-001), avoiding dependence on MySQL auto-increment IDs. This is demo association, not backend authorization.

## Validation

- Production build and ESLint checks.
- Browser checks for three role logins, MySQL account create/edit/delete after reload, role/status filters and mobile account view.
- Diary create/edit/reload and XLSX download.
- Teacher class visibility, QR regeneration invalidating an old token, student check-in and duplicate prevention in one browser context.
- Mobile overflow checks for accounts, schedules and attendance at 390px.

## Visual review

The larger type scale, restrained indigo/navy palette and consistent navigation improve readability and recognition across the portal. The larger type intentionally increases vertical scrolling; mobile uses account cards and one-column course/schedule layouts. Status colors retain labels/icons. Actual device camera testing and a broader accessibility audit remain useful before deployment.
