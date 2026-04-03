# PreferredHome — Product Roadmap
**Version V12 | April 2026**

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
| 3.2.11 / .1–.2 | All new data fields: propertyType, numberOfFloors, heatingType, shortTermAvailable, rentersInsuranceRequired, petFee, storageRent, brokerFee, moveInFee, roomTypes, privateOutdoorSpaceTypes, storageTypes. Field renames: unitType → propertyType, acType → coolingType. |
| 3.2.12 / .1–.4.1 | Property Type visibility rules on Add, Edit, ViewPanel, Compare. All new 3.2.11 fields displayed. |
| 3.2.13 / .1–.2 | Auto-calculations: Total Monthly + Total Upfront. All screens calculate locally from raw fee fields. API stores calculated totals on save. |
| 3.2.14 | ZIP to City/State auto-fill + Listing Site auto-detect from URL pattern match. |
| 3.2.15 | Commute Calculation — calculated by API using Profile work address vs each listing address. Stored per listing. |
| 3.2.16 | Add/Edit Unification — single shared form component. Efficiency cleanup. |
| 3.2.17 | Neighborhood section — Transportation renamed to Neighborhood. Neighborhood name moved from Property section. Near By moved from Features section. New fields added: safetyScore, noiseScore. All fields manually enterable. All screens and data model updated. |
| 3.2.18 / .1–.5 | Sort — sort functionality added to Filter panel. Full-page panel layout. 6 sort keys. Overlay Modal dropdowns. All filter and sort logic confirmed correct on device. |
| 3.2.19 / .1–.3 | Card overhaul — tap-to-expand icon row on Listings cards. Only one card expanded at a time. Collapses on tab leave. Status pill letter spacing tightened. Rent + fees aligned to bottom of right column. Preferred heart toggle wired to API. |
| 3.2.20 / Closeout | Typography & Design Token System — named color and typography tokens established and legacy aliases removed after stabilization. |
| 3.2.21 / 3.2.21.1 | UI polish / layout restoration — Add/Edit structure improved, Edit bottom nav fixed, ViewPanel full-width treatment added, Profile/Criteria/Settings full-page panel treatment added, Add/Edit card-style section headers restored, and scroll behavior corrected. Accepted as complete for the 3.2.x line. |

---

## Next Build — 3.2.22

| Build | Scope |
|---|---|
| 3.2.22 | APK build for Android local testing before App Store submission. No new feature work. No UI redesign. Use current accepted 3.2.x state as the test baseline. |

---

## UI Freeze Rule

Once 3.2.22 begins, the 3.2.x UI is treated as frozen for platform-reset planning. No additional reactive 3.2.x UI hotfix line will be used for non-critical polish. Remaining screen-standardization work moves into the V5 UI track.

If a severe break is discovered during APK testing, only the minimum contained fix is allowed.

---

## V4 — Platform Reset

V4 is the controlled architecture reset. It begins only after the 3.2.x line is accepted and APK testing is complete enough to lock the current interface baseline.

### V4 Step 1 — Canonical Data Model

| Task | Detail |
|---|---|
| Field rename | `buildingName` → `propertyName` across mobile code, API, and storage layer when V4 begins |
| Master field list | One authoritative list used by mobile, API, SQLite, and PostgreSQL — no divergence |
| Calculated field review | `totalMonthly` and `totalUpfront` reviewed as derived values rather than canonical stored truth |
| Column / field audit | Confirm every field name matches camelCase naming across all layers |
| Data Architecture update | Canonical V4 model becomes the new source of truth |

### V4 Step 2 — Database Setup

| Item | Detail |
|---|---|
| Database | PostgreSQL — Render, Supabase, or Railway |
| Local storage | SQLite with schema aligned to PostgreSQL |
| Schema source | Derived directly from the approved canonical data model |
| Migration path | Local SQLite → cloud PostgreSQL when subscription/cloud layer is activated |
| Cost target | Low-cost initial deployment |

### V4 Step 3 — API Migration

| Task | Detail |
|---|---|
| Replace gspread layer | `sheets_storage.py` replaced with database-backed storage layer |
| Endpoint contracts | Keep `GET /listings`, `POST /listings`, `PUT /listings/:id`, `DELETE /listings/:id` stable unless explicitly redesigned |
| Data migration | Existing Google Sheet data migrated before cutover |
| Health check | `/health` updated to verify database connection |

### V4 Step 4 — Mobile Local Storage Integration

| Task | Detail |
|---|---|
| SQLite layer | Local-first storage using the same canonical schema as PostgreSQL where practical |
| Offline mode | App reads and writes locally without network requirement |
| Sync strategy | Sync layer added only where cloud tier requires it |
| Free tier cap | 5 listing cap enforced at local storage / business-logic layer |

---

## V5 — Expansion

V5 is split into two tracks so UI cleanup and new feature UI do not get mixed loosely.

### V5-A — UI & Interaction Standardization

This track handles existing-screen UI/interaction work that remains outside the 3.2.x line.

| Build Group | Scope |
|---|---|
| V5-A.1 | Add / Edit field-entry standardization to fully match the approved Filter / Sort structural pattern where appropriate |
| V5-A.2 | Profile / Criteria / Settings internal hierarchy and field-entry consistency |
| V5-A.3 | Compare screen restore items: frozen top row, `Criteria` upper-left heading, and approved table/card cleanup |
| V5-A.4 | Calendar remaining layout polish if still needed |
| V5-A.5 | Home existing-screen UI cleanup if still desired after APK testing |

### V5-B — Free Feature Enhancements

Feature-specific UI belongs inside the feature build that needs it.

| Feature | Description |
|---|---|
| Help Center | In-app guidance and FAQ |
| Buying Mode | Switch app context from renting to home buying |
| Map View | Listings map mode, including list/map sub-header controls and map integration |
| Themes | Light, dark, and custom color themes |
| Manual Sort | User-defined drag-to-reorder on Listings screen |
| Neighborhood Name auto-populate | Auto-filled from listing address via Google geocoding |

---

## V6 — Pro (One-Time Fee)

Local-only premium tier. No account required.

| Feature | Description |
|---|---|
| Unlimited Listings | Remove the 5 listing cap |
| Import / Export | Backup and restore listing data |
| Auto-populate Scores | Walk, Transit, Bike scores from address |
| Auto-populate Schools | School name, rating, distance from address |
| Criteria Scoring | Score listings automatically against Criteria |
| URL Import | Paste a listing URL and auto-populate supported fields |

---

## V7 — Pro Max (Subscription)

Cloud-backed tier for continuity and collaboration.

| Feature | Description |
|---|---|
| Cloud Sync | PostgreSQL-backed listing sync across devices |
| Multi-device | Use on phone and tablet simultaneously |
| Notifications | Tour reminders, follow-up prompts, lease deadline alerts |
| Photo Support | Attach and display listing photos |
| Sharing | Share listings or comparisons with others |
| User-defined lists | Cloud-backed custom list organization and future collaboration support |

---

## Roadmap Governance Notes

- Roadmap is PM-owned and updated only when explicitly requested.
- Claude does not autonomously revise roadmap sequencing after a build.
- README.txt carries build-to-build continuity.
- Drift Log records actual drift only.
