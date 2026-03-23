# PreferredHome — Product Roadmap
**Version V9 | March 2026**

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

---

## Next Builds — 3.2.x Series

| Build | Scope |
|---|---|
| 3.2.14 | ZIP to City/State auto-fill + Listing Site auto-detect from URL pattern match. |
| 3.2.15 | Commute Calculation — calculated by API using Profile work address vs each listing address. Stored per listing. |
| 3.2.16 | Add/Edit Unification — single shared form component. Efficiency cleanup. |
| 3.2.17 | Neighborhood section — Transportation renamed to Neighborhood. Neighborhood name moved from Property section. Near By moved from Features section. New fields added: safetyScore, noiseScore. All fields manually enterable. All screens and data model updated. |
| 3.2.18 | Canonical Data Model — buildingName → propertyName full rename across code, sheet, and UI. One master field list across all screens and the API. totalMonthly / totalUpfront stored fields reviewed for removal. |
| 3.2.19 | Card overhaul — tap-to-expand icon row on all cards. Only one card expanded at a time. Status pill letter spacing tightened. Rent + fees line aligned with status pill. Icons active from both Home and Listings screens. |
| 3.2.20 | Sort — sort functionality added to Filter panel. Sort by Base Rent, Total Monthly, Status, Date Added. |
| 3.2.21 | UI Polish — spacing, typography, visual consistency. All panels except hamburger menu converted to full page. |
| 3.2.22 | APK build for Android local testing before App Store submission. |

**Free tier:** 5 listing cap. Local SQLite storage. No account required. Works fully offline. All fields manually enterable including scores and schools. Commute and neighborhood name auto-filled at no cost.

---

## V4 — Platform Reset

Migrate from Google Sheets to PostgreSQL cloud (Thomas only at this stage). Simultaneously implement local SQLite with identical schema for the free and Pro app tiers. App functions identically to the user. No auth required — still single tenant for Thomas.

| Item | Detail |
|---|---|
| Database | PostgreSQL — Render, Supabase, or Railway |
| Free / Pro storage | Local SQLite — identical schema to cloud |
| Migration path | SQLite → PostgreSQL on Pro Max signup |
| Estimated cost | $0–$25/month at small scale |
| Prerequisite | All 3.2.x builds complete and stable |

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

---

## V6 — Pro (One-Time Fee)

Local SQLite. No account required. No server cost. Unlimited listings. Import/Export is the user's backup mechanism.

All score and school fields are visible to free users for manual entry. Auto-populate is Pro only — greyed out with a Pro badge for free users.

| Feature | Description |
|---|---|
| Unlimited Listings | Remove the 5 listing cap. |
| URL Import | Paste a listing URL — auto-populates all text fields from the listing page. |
| Walk / Transit / Bike Score auto-populate | Auto-filled from listing address via Walk Score API. |
| Safety Score auto-populate | Auto-filled from listing address via AreaVibes / SpotCrime API. |
| Noise Score auto-populate | Auto-filled from listing address via HowLoud API. |
| Neighborhood Name auto-populate | Auto-filled from listing address via Google geocoding. |
| School Data auto-populate | Auto-filled from listing address via GreatSchools API. |
| Notifications / Reminders | Tour reminders, follow-up prompts, lease deadline alerts. |
| Import / Export | Backup and restore listing data. Export to CSV or PDF. |

---

## V7 — Pro Max (Subscription)

Cloud PostgreSQL. Account required. Subscription funds ongoing infrastructure costs. SQLite data migrates to cloud on Pro Max signup.

| Feature | Description |
|---|---|
| Login / Sync | User accounts. Cloud data sync across devices. |
| Photo Support — URL | Multiple photos auto-extracted from listing URL via URL Import. |
| Photo Support — Device | Attach your own photos from device camera or library during viewings. |
| Advanced Criteria Scoring | User-defined weighted conditions, required vs optional, ratings per listing, total score. |
| Broker / User Sharing | Broker and client share listings and notes in real time. |
| User-Defined Lists | User defines custom dropdown options per field. |

**Infrastructure costs covered by subscription:** Cloud PostgreSQL, Cloudflare R2 object storage (~$0.015/GB/month), Supabase Auth.

---

## Storage Architecture Summary

| Tier | Storage | Auth | Backup | Server Cost |
|---|---|---|---|---|
| Free | Local SQLite | No | None — 5 listing cap limits risk | Zero |
| Pro | Local SQLite | No | Import / Export — user manages own backup | Zero |
| Pro Max | Cloud PostgreSQL | Yes — required | Automatic cloud sync | Low — text + photos |

---

## Build Number and Commit Message Format

| Type | Format | Example |
|---|---|---|
| Standard build | `Build X.X.YY - description` | `Build 3.2.14 - ZIP to City/State auto-fill, listing site auto-detect` |
| Hotfix | `Build X.X.YY.N Hotfix - description` | `Build 3.2.13.2 Hotfix - Compare Total Rent now always calculated locally` |
| Closeout | `Build X.X.YY Closeout - description` | `Build 3.2.13 Closeout - closing docs updated` |
