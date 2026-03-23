# PreferredHome — Assistant Briefing
**Closing Out Build 3.2.13.2 | March 2026**

---

## Project Identity

| Item | Detail |
|---|---|
| App | PreferredHome — Capture. Compare. Decide. |
| Platform | React Native / Expo Router — Expo Go with tunnel mode |
| Backend | Python FastAPI on Render — https://preferredhome-api.onrender.com |
| Data Store | Google Sheets via gspread |
| Local Path | `C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile` |
| Mobile Repo | https://github.com/twhisker65/PreferredHome-mobile |
| API Repo | https://github.com/twhisker65/PreferredHome-api |
| Protocols | Read `PreferredHome_Dev_Control_Protocols.md` in full before any build. |
| Drift Log | Read `PreferredHome_Drift_Log.md` in full. State most likely drift before touching any file. |

---

## Current State

| Item | Status |
|---|---|
| Stable Baseline | Build 3.2.13.2 — confirmed stable. All 5 test items passed. |
| ISSUE 2 | Resolved. API now calculates and stores totalMonthly and totalUpfront on save (Build 3.2.13). Compare now ignores stored value entirely — always calculates locally (Build 3.2.13.2). All screens consistent. |

---

## Build History — 3.2.13 Series

| Build | File | Status | Notes |
|---|---|---|---|
| 3.2.13 | listingsNormalize.ts, ViewPanel.tsx, compare.tsx, main.py, config_constants.py | Superseded | Mobile delivered correctly. API crashed on Render — PARKING_OPTIONS renamed without instruction. |
| 3.2.13.1 | config_constants.py, main.py | Confirmed stable — API | PARKING_OPTIONS restored. API health confirmed. totalMonthly + totalUpfront now calculated and stored on save. |
| 3.2.13.2 | compare.tsx | Confirmed stable — Mobile | Compare Total Rent now always calculated locally from raw fee fields. Matches ViewPanel and listing cards exactly. |

---

## What Is Currently Stable — Per File

| File | Stable Build | Notes |
|---|---|---|
| `app/(tabs)/add.tsx` | 3.2.12.3 | Option arrays correct. Costs order correct. Fully stable. |
| `app/edit.tsx` | 3.2.12.2 | Fully correct. |
| `components/ViewPanel.tsx` | 3.2.13 | 2-column Monthly / Move-In costs layout. Both totals calculated locally. Stable. |
| `app/(tabs)/compare.tsx` | 3.2.13.2 | Total Rent always calculated locally. All other rows and layout stable. |
| `lib/listingsNormalize.ts` | 3.2.13 | Fee line always shows on cards — even $0. Stable. |
| `main.py` (API) | 3.2.13.1 | totalMonthly + totalUpfront injected on POST and PUT. Stable. |
| `config_constants.py` (API) | 3.2.13.1 | totalUpfront added to LISTINGS_COLUMNS and NUMERIC_FIELDS. PARKING_OPTIONS correct. Stable. |

---

## Confirmed Stable Features — 3.2.13 Series

| Feature | Status |
|---|---|
| Home & Listings cards always show fee line (even $0) | Stable — 3.2.13 |
| ViewPanel COSTS — 2-column Monthly / Move-In layout | Stable — 3.2.13 |
| ViewPanel Total Monthly — locally calculated | Stable — 3.2.13 |
| ViewPanel Total Upfront — locally calculated | Stable — 3.2.13 |
| Compare — individual fee rows removed | Stable — 3.2.13 |
| Compare — Total Rent always locally calculated | Stable — 3.2.13.2 |
| API — totalMonthly calculated and stored on save | Stable — 3.2.13.1 |
| API — totalUpfront calculated and stored on save | Stable — 3.2.13.1 |
| All screens show consistent Total Monthly values | Stable — 3.2.13.2 |

---

## Confirmed Stable Features — Prior Series (Carried Forward)

| Feature | Status |
|---|---|
| Property Type show/hide on Add | Stable — 3.2.12.1 |
| Property Type show/hide on Edit | Stable — 3.2.12.2 |
| Property Type show/hide on ViewPanel | Stable — 3.2.12.1 |
| Property Type show/hide on Compare | Stable — 3.2.12.1 |
| shortTermAvailable + rentersInsuranceRequired in Listing section | Stable — 3.2.12 |
| Compare Clear button | Stable — 3.2.12.4.1 |
| Compare CARD_ROWS — all rows | Stable — 3.2.12.4.1 |
| Compare label truncation fix (LABEL_W 150) | Stable — 3.2.12.4.1 |
| Compare toggle reload on ProfilePanel close | Stable — 3.2.12.4.1 |
| Compare label row height alignment | Stable — 3.2.12.4.1 |

---

## Field Renames — Permanent Record

| Old Name | New Name | Completed |
|---|---|---|
| `unitType` | `propertyType` | Build 3.2.11A |
| `acType` | `coolingType` | Build 3.2.11A |

---

## Locked Terminology

- Property Type options: Apartment, Condo, Co-op, Townhouse, House — exactly 5, exact casing
- Co-op is lowercase 'o' and lowercase 'p' — confirmed correct and locked

---

## Total Monthly / Total Upfront — Design Decision (Build 3.2.13)

All screens calculate totalMonthly and totalUpfront locally from individual raw fee fields. No screen reads the stored totalMonthly or totalUpfront values from the sheet for display. This ensures all screens are always consistent and never show stale data. The stored fields in the sheet exist as a record only. They will be reviewed for removal in Build 3.2.17 (Canonical Data Model).

---

## Open Issues — Carried Forward

None. ISSUE 2 fully resolved.

---

## Active Drift Warnings — Carry Forward Every Session

| ID | Rule |
|---|---|
| DRIFT 1 | No Unit section. Unit fields appear at the end of the PROPERTY section only. Never create a separate Unit sub-section. |
| DRIFT 5 | Apply `boolStr()` to every file that sends a payload to the API. Never apply it to only one file when the same pattern exists in others. |
| DRIFT 6 | No structural changes to any screen without explicit authorisation from Thomas. If in doubt — ask first. |
| DRIFT 7 | Read the original spec before touching any form structure. Never infer the structure from memory. |
| DRIFT 8 | Never invent API functions. Read `lib/api.ts` before writing any import that references it. |
| DRIFT 9 | Before changing any shared file, read every file that imports from it. Never rename, remove, or restructure any constant not in scope. (Section 36) |

---

## Immediate Next Step — Build 3.2.14

**Scope:** ZIP to City/State auto-fill + Listing Site auto-detect from URL pattern.

---

## Roadmap — Remaining Builds

| Build | Scope |
|---|---|
| 3.2.14 | ZIP to City/State auto-fill + Listing Site auto-detect from URL pattern |
| 3.2.15 | Commute Calculation + Walk / Transit / Bike Scores via backend API calls |
| 3.2.16 | Add/Edit Unification — single shared form component |
| 3.2.17 | Canonical Data Model — one master field list across all screens and API. Review totalMonthly / totalUpfront stored fields for removal. |
| 3.2.18 | UI Polish — spacing, typography, visual consistency. No functional changes. |
| 3.2.19 | APK build for Android local testing before App Store submission |
| 5.0+ | Notifications, Photos, Criteria Scoring, Login/Sync, URL Import, Import/Export, Themes, Help Center, User-Defined Lists, Buying Mode, Map View |
