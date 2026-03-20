# PreferredHome — Product Roadmap
**Version V6 | March 2026**

---

## Completed Builds

| Build | Description |
|---|---|
| 3.1.07 | UI polish, profile toggles, calendar wired to Sheets. |
| 3.1.09 | Home stats, listing card rent display, status pill height, pull-to-refresh. |
| 3.1.11 | Heading font token, sections closed by default, AM/PM time, calendar scroll fix. |
| 3.1.14 | Status normalizer, Save/Delete wired to API, Add page restructure per 8-section spec. |
| 3.1.15 / .1–.5 | NaN save fix, delete bug, ID key fix, boolean casing, full API rebuild. |
| 3.2.01 | API cleanup: boolean TRUE/FALSE, df_to_sheet backup/restore safety, code review. |
| 3.2.02 / .1–.2 | Status pill colors (10 statuses), Add sections open by default, Listings auto-refresh, NaN hotfix. |
| 3.2.03 | Edit Listing screen, focus refresh, pull-to-refresh, ZIP auto-fill, clear after save. |
| 3.2.04 | Filter panel: Status, Unit Type, Broker Fee, Preferred, Max Rent, Zip Code. Active filter icon. |
| 3.2.05 | View Listing detail panel: slide-out from right, read-only display across 8 sections. |
| 3.2.06 / .1–.2 | Menu system: hamburger to MenuPanel with Profile, Criteria, Settings sub-panels. Home Base Rent Snapshot restored. |
| 3.2.07 | Calendar fix: all appointments display per month including past. |
| 3.2.08 / .1–.2 | Compare screen: side-by-side listing comparison. Selection logic. Centralised compare state. |
| 3.2.09 / .1–.5 | Profile toggle wiring: Children, Pets, Car drive field visibility on Add, Edit, ViewPanel, Compare. |
| 3.2.10 / .1 | Tap-to-contact links: phone opens dialer, email opens mail, address opens Maps, URL opens browser. |

---

## Next Builds — 3.2.x Series

| Build | Scope |
|---|---|
| 3.2.11 | All new data fields — pet fee, property type (Apartment / House / Townhouse / Duplex / Condo), garage (yes/no + spaces), yard, basement, floors, outdoor space, rooms, broker fee, first/last month. Also resolves ISSUE 1 (Edit page shows only Building Name). |
| 3.2.12 | Field visibility rules — property type drives which fields show on all screens. |
| 3.2.13 | Auto-calculations — Total Monthly (rent + all fees) and Total One-Time Upfront (deposit + broker + first + last). API totalMonthly fix (ISSUE 2). |
| 3.2.14 | ZIP to City/State auto-fill + Listing Site auto-detect from URL pattern match (zillow.com → Zillow, etc.). |
| 3.2.15 | Commute Calculation + Walk / Transit / Bike Scores via backend API calls. Stored as listing fields. |
| 3.2.16 | Add/Edit Unification — single shared form component. Efficiency cleanup. |
| 3.2.17 | Canonical Data Model — one strongly typed listing model across all screens and the API. |
| 3.2.18 | UI Polish — spacing, typography, visual consistency pass. No functional changes. |
| 3.2.19 | APK build for Android local testing before App Store submission. |

---

## 4.0 — Platform Reset

Migrate from Google Sheets to PostgreSQL and formal backend services. All 3.2.x debt items and field additions must be complete before this begins.

---

## 5.0 — Major Expansion

| Feature | Description |
|---|---|
| Notifications / Reminders | Tour reminders, follow-up reminders for Contacted status, lease deadline alerts. |
| Photo Support | Attach and display listing photos from device camera or library. |
| Criteria Scoring | Score each listing automatically against Criteria settings. |
| Login / Sync | User accounts. Cloud data sync across devices. |
| URL Import | Paste a listing URL — app auto-populates fields from the listing page. |
| Import / Export | Backup and restore listing data. Export to CSV or PDF. |
| Themes | Light, dark, and custom color themes. |
| Help Center | In-app guidance and FAQ. |
| User-Defined Lists | Thomas defines custom dropdown options per field. |
| Buying Mode | Switch app context from renting to home buying workflow. |
| Map View | Map display of listing locations on the Listings screen. |

---

## Build Number Format

| Format | Example | Notes |
|---|---|---|
| X.X.YY | 3.2.07 | Standard build — two-digit patch always. |
| X.X.YY.N | 3.2.07.1 | Hotfix — minimum fix only. HOTFIX suffix after build number. |
| X.X.YY_FULL_REBUILD | 3.2.07_FULL_REBUILD | Entire repo replaced. |
