# PreferredHome — Assistant Briefing
**Closing Out Build 3.2.11B | March 2026**

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
| Stable Baseline | Build 3.2.11B — confirmed stable. |
| ISSUE 1 | Resolved. Edit page was showing only Building Name. Fixed in Build 3.2.11B. |
| ISSUE 2 (carried fwd) | API `totalMonthly` omits fees for some listings. Workaround: `compare.tsx` uses local `baseRent + fees`. Permanent fix: Build 3.2.13. |

---

## Build 3.2.11B — What Was Delivered

| File | Change |
|---|---|
| `app/(tabs)/add.tsx` | 11 new fields added; `unitType` → `propertyType`; `acType` → `coolingType`; option arrays updated; PROPERTY section restructured; COSTS section split into MONTHLY / UPFRONT visual groups; FEATURES section reordered; handleSave payload updated |
| `app/edit.tsx` | All changes from add.tsx; rawToDraft updated for all new and renamed fields; ISSUE 1 resolved |
| `lib/listingsNormalize.ts` | `unitType` → `propertyType`; `petFee` and `storageRent` added to fees total |

---

## Field Renames — Permanent Record

| Old Name | New Name | Completed |
|---|---|---|
| `unitType` | `propertyType` | Build 3.2.11A |
| `acType` | `coolingType` | Build 3.2.11A |

---

## New Fields — Build 3.2.11B

| Field | Type | Section | Notes |
|---|---|---|---|
| `numberOfFloors` | Numeric | PROPERTY | Shown for all property types |
| `shortTermAvailable` | Boolean | PROPERTY | After Furnished |
| `rentersInsuranceRequired` | Boolean | PROPERTY | After Short Term Available |
| `heatingType` | Select | FEATURES | After Cooling Type |
| `petFee` | Numeric | COSTS — Monthly | Pets toggle gated |
| `storageRent` | Numeric | COSTS — Monthly | Always visible |
| `brokerFee` | Numeric | COSTS — Upfront | Always visible |
| `moveInFee` | Numeric | COSTS — Upfront | Always visible |
| `roomTypes` | Multi-select | FEATURES | |
| `privateOutdoorSpaceTypes` | Multi-select | FEATURES | |
| `storageTypes` | Multi-select | FEATURES | |

---

## Removed Fields — Permanent Record

| Field | Reason |
|---|---|
| `unitType` | Renamed to `propertyType`. Unit Type as a separate field removed entirely. |
| `firstMonth` | Folded into Security Deposit. Never built into live code. |
| `lastMonth` | Folded into Security Deposit. Never built into live code. |
| Duplex (Property Type option) | Removed — ambiguous property type. Not apartment, not house. |

---

## Data Architecture — V6 Updates (This Session)

Updated during pre-build planning session for Build 3.2.12. No code changes — document corrections only.

| Change | Detail |
|---|---|
| Unit Type field removed | No longer exists in app or spec |
| Duplex removed | Property Type options: Apartment, Condo, Co-op, Townhouse, House |
| First Month / Last Month removed | Folded into Security Deposit |
| Storage Rent and Move-in Fee added | These are the correct live fields |
| Field renames documented | `unitType` → `propertyType`, `acType` → `coolingType` |
| Property Type visibility rules added | Apartment/Condo/Co-op show Unit #, Floor Number, Top Floor, Corner Unit. House/Townhouse hide these. Number of Floors shown for all. |
| Lifestyle toggle visibility rules added | Children: Schools section. Pets: Pet Fee + Pet Amenities. Car: Parking Fee + Parking Type. |
| COSTS restructured | Split into MONTHLY and UPFRONT sub-groups with correct fields |

---

## Build 3.2.12 — Scope Confirmed

Field visibility rules — Property Type drives which fields show and hide on Add, Edit, ViewPanel, and Compare screens. Follows the same pattern as Lifestyle Toggles already built in 3.2.09.

**Property Type — listing-level toggle (position 2 after Status)**

| Field | Apartment / Condo / Co-op | House / Townhouse |
|---|---|---|
| Apartment / Unit # | Show | Hide |
| Floor Number | Show | Hide |
| Top Floor | Show | Hide |
| Corner Unit | Show | Hide |
| Number of Floors | Show | Show |

**Lifestyle Toggles — already built in 3.2.09, documented here for completeness**

| Toggle | Fields Shown When ON |
|---|---|
| Children | Schools section |
| Pets | Pet Fee, Pet Amenities |
| Car | Parking Fee, Parking Type |

---

## Deferred Items

| Item | Target |
|---|---|
| `components/ViewPanel.tsx` — display all new fields from 3.2.11 | To be scheduled |
| `app/(tabs)/compare.tsx` — display new fields from 3.2.11 | To be scheduled |
| ISSUE 2 — `totalMonthly` fee omission | Build 3.2.13 |
| Add/Edit unification | Build 3.2.16 |

---

## Roadmap — Remaining Builds

| Build | Scope |
|---|---|
| 3.2.12 | Field visibility rules — Property Type drives field show/hide on all screens |
| 3.2.13 | Auto-calculations — Total Monthly + Total One-Time Upfront. API totalMonthly fix (ISSUE 2) |
| 3.2.14 | ZIP to City/State auto-fill + Listing Site auto-detect from URL pattern |
| 3.2.15 | Commute Calculation + Walk / Transit / Bike Scores via backend API calls |
| 3.2.16 | Add/Edit Unification — single shared form component |
| 3.2.17 | Canonical Data Model — one master field list across all screens and API |
| 3.2.18 | UI Polish — spacing, typography, visual consistency. No functional changes. |
| 3.2.19 | APK build for Android local testing before App Store submission |

---

## Active Drift Warnings — Carry Forward Every Session

| ID | Rule |
|---|---|
| DRIFT 1 | No Unit section. Unit fields appear at the end of the PROPERTY section only. Never create a separate Unit sub-section. |
| DRIFT 5 | Apply `boolStr()` to every file that sends a payload to the API. Never apply it to only one file when the same pattern exists in others. |
| DRIFT 6 | No structural changes to any screen without explicit authorisation from Thomas. If in doubt — ask first. |
| DRIFT 7 | Read the original spec before touching any form structure. Never infer the structure from memory. |

---

## Key Conventions — Standing Rules

| Rule | Detail |
|---|---|
| Boolean serialization | Always `"TRUE"` / `"FALSE"` all-caps strings in every file that sends a payload |
| Build numbering | Two-digit format e.g. 3.2.12. Hotfixes use a fourth digit e.g. 3.2.12.1 |
| ZIP naming | `PreferredHome_Build_X_X_XX.zip` — underscores only, no dots, prefix mandatory |
| README naming | `README_X.X.XX.txt` — versioned, accumulates in repo |
| Closing docs | Fixed filenames, overwrite each build: `PreferredHome_Next_Steps.md`, `PreferredHome_Assistant_Briefing.md` |
| Closing doc timing | Produced only after Thomas confirms build stability. Never before. |
| Delivery | Always a ZIP with correct folder structure. No individual files. No patch instructions. |
| Commit message | Copyable code block in chat AND in README |
| Expo restart | Copyable code block in chat AND in README |
