# PreferredHome — Product Roadmap
**Version V11 | March 2026**

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

---

## Next Builds — 3.2.x Series

**UI freeze rule:** Once 3.2.21 is confirmed stable, the UI is frozen. No UI changes are permitted during V4. If a screen breaks due to a data layer change in V4, only the minimum fix is permitted.

| Build | Scope |
|---|---|
| 3.2.20 | Typography & Design Token System — establish named font styles for every text role (screen headers, section headers, card titles, body, muted, labels, pills, buttons). Named layout tokens for the two header bars and two footer bars. All hardcoded font sizes, weights, and colors replaced with tokens. Changing one token updates every instance across the app. |
| 3.2.21 | UI Polish — Add/Edit pages restored to pre-3.2.16 approved layout using build history as reference. All screens standardized using the token system from 3.2.20. Visual consistency pass across all 5 tabs and all panels. |
| 3.2.22 | APK build for Android local testing before App Store submission. |

---

## V4 — Platform Reset

Migrate from Google Sheets to PostgreSQL cloud (Thomas only at this stage). Simultaneously implement local SQLite with identical schema for the free and Pro app tiers. App functions identically to the user. No auth required — still single tenant for Thomas.

**Prerequisite:** All 3.2.x builds complete, stable, and UI frozen.

### V4 Step 1 — Canonical Data Model
Before any database work begins, establish the definitive field list that all layers will use.

| Task | Detail |
|---|---|
| Field rename | `buildingName` → `propertyName` across mobile code, API, and sheet |
| Master field list | One authoritative list used by mobile, API, and database schema — no divergence |
| Calculated field review | `totalMonthly` and `totalUpfront` — evaluate whether to store or compute on read |
| Sheet column audit | Confirm every sheet column name matches camelCase field names exactly |
| Data Architecture doc update | Updated to reflect all renames and the final master field list |

### V4 Step 2 — Database Setup

| Item | Detail |
|---|---|
| Database | PostgreSQL — Render, Supabase, or Railway |
| Free / Pro storage | Local SQLite — identical schema to PostgreSQL |
| Schema | Derived directly from the V4 Step 1 canonical field list |
| Migration path | SQLite → PostgreSQL on Pro Max signup |
| Estimated cost | $0–$25/month at small scale |

### V4 Step 3 — API Migration

| Task | Detail |
|---|---|
| Replace gspread layer | sheets_storage.py replaced with PostgreSQL ORM layer |
| All endpoints unchanged | GET /listings, POST /listings, PUT /listings/:id, DELETE /listings/:id — same contracts |
| Data migration | Existing Google Sheet data migrated to PostgreSQL before cutover |
| Health check | /health endpoint updated to verify PostgreSQL connection |

### V4 Step 4 — Mobile SQLite Integration

| Task | Detail |
|---|---|
| SQLite layer | Local storage using same schema as PostgreSQL |
| Offline mode | App reads/writes SQLite when no network available |
| Sync | SQLite syncs to PostgreSQL when connection restored |
| Free tier cap | 5 listing cap enforced at SQLite layer |

---

## V5 — Free Enhancements

No cost to user. No API costs. No account required. Local SQLite.

| Feature | Description |
|---|---|
| Help Center | In-app guidance and FAQ. |
| Buying Mode | Switch app context from renting to home buying. |
| Map View | Map display of listing locations on Listings screen. |
| Themes | Light, dark, and custom color themes. |
| Manual Sort | User-defined drag-to-reorder on Listings screen. |
| Neighborhood Name auto-populate | Auto-filled from listing address via Google geocoding. |

---

## V6 — Pro (One-Time Fee)

Local SQLite. No account required. No server cost. Unlimited listings. Import/Export is the user's backup mechanism.

All score and school fields are visible to free users for manual entry. Auto-populate is Pro only — greyed out with a Pro badge for free users.

| Feature | Description |
|---|---|
| Unlimited Listings | Remove the 5 listing cap. |
| Import / Export | Backup and restore listing data. Export to CSV. |
| Auto-populate Scores | Walk, Transit, Bike scores auto-filled from address. |
| Auto-populate Schools | School name, rating, distance auto-filled from address. |
| Criteria Scoring | Score each listing automatically against Criteria settings. |
| URL Import | Paste a listing URL — app auto-populates fields from the page. |

---

## V7 — Pro Max (Subscription)

Cloud PostgreSQL sync. Multi-device support. Requires account.

| Feature | Description |
|---|---|
| Cloud Sync | PostgreSQL backend — listings sync across all devices. |
| Multi-device | Use on phone and tablet simultaneously. |
| Notifications | Tour reminders, follow-up prompts, lease deadline alerts. |
| Photo Support | Attach and display listing photos from device camera or library. |
| Sharing | Share listings or comparisons with a partner or agent. |
