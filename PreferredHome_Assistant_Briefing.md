# PreferredHome — Assistant Briefing
**Build 3.2.11B | March 2026**

---

## Project Identity

| Item | Detail |
|---|---|
| App | PreferredHome — Capture. Compare. Decide. |
| Platform | React Native / Expo Router — Expo Go with tunnel mode |
| Backend | Python FastAPI on Render — https://preferredhome-api.onrender.com |
| Data store | Google Sheets via gspread |
| Local path | `C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile` |
| Mobile repo | https://github.com/twhisker65/PreferredHome-mobile |
| API repo | https://github.com/twhisker65/PreferredHome-api |
| Protocols | Read `PreferredHome_Dev_Control_Protocols.md` in full before any build. |
| Drift Log | Read `PreferredHome_Drift_Log.md` in full. State most likely drift before touching any file. |

---

## Current State

| Item | Status |
|---|---|
| Stable baseline | Build 3.2.11B — confirmed stable. |
| ISSUE 1 | **Resolved.** Edit page was showing only Building Name. Fixed by correcting `rawToDraft()` to read `propertyType`, `coolingType`, and all new fields from raw API response. |
| ISSUE 2 (carried fwd) | API `totalMonthly` omits fees for some listings. Workaround: `compare.tsx` uses local `baseRent + fees`. Permanent fix: Build 3.2.13. |

---

## Build 3.2.11B Session Summary

| File | Change |
|---|---|
| `app/(tabs)/add.tsx` | 11 new fields added; `unitType` → `propertyType`; `acType` → `coolingType`; option arrays updated; PROPERTY section restructured; COSTS section split into MONTHLY / UPFRONT visual groups; FEATURES section reordered; handleSave payload updated |
| `app/edit.tsx` | All changes from add.tsx; rawToDraft updated for all new and renamed fields; ISSUE 1 resolved |
| `lib/listingsNormalize.ts` | `unitType` → `propertyType`; `petFee` and `storageRent` added to fees total |

---

## Field Renames — Permanent Record

| Old Name | New Name | Applies To |
|---|---|---|
| `unitType` | `propertyType` | All mobile files, API (done in 3.2.11A) |
| `acType` | `coolingType` | All mobile files, API (done in 3.2.11A) |

---

## New Fields Added — Build 3.2.11B

| Field | Type | Section | Notes |
|---|---|---|---|
| `numberOfFloors` | Numeric (decimal-pad) | PROPERTY | After Floor Number |
| `shortTermAvailable` | Boolean | PROPERTY | After Furnished |
| `rentersInsuranceRequired` | Boolean | PROPERTY | After Short Term Available |
| `heatingType` | Select | FEATURES | After Cooling Type |
| `petFee` | Numeric | COSTS — Monthly | Pets toggle gated |
| `storageRent` | Numeric | COSTS — Monthly | Always visible |
| `brokerFee` | Numeric | COSTS — Upfront | Always visible |
| `moveInFee` | Numeric | COSTS — Upfront | Always visible |
| `roomTypes` | Multi-select | FEATURES | ROOM_TYPES array |
| `privateOutdoorSpaceTypes` | Multi-select | FEATURES | PRIVATE_OUTDOOR_SPACE array |
| `storageTypes` | Multi-select | FEATURES | STORAGE_TYPES array |

---

## Active Drift Warnings — Carry Forward Every Session

| ID | Rule |
|---|---|
| DRIFT 1 | No Unit section. Unit fields appear at the end of the PROPERTY section only. Never create a separate Unit sub-section. |
| DRIFT 5 | Apply `boolStr()` to every file that sends a payload to the API. Never apply it to only one file when the same pattern exists in others. |
| DRIFT 6 | No structural changes to any screen without explicit authorisation from Thomas. If in doubt — ask first. |
| DRIFT 7 | Read the original spec before touching any form structure. Never infer the structure from memory. |

---

## Deferred Items

| Item | Target |
|---|---|
| `components/ViewPanel.tsx` — display all new fields | To be scheduled |
| `app/(tabs)/compare.tsx` — display new fields | To be scheduled |
| ISSUE 2 — `totalMonthly` fee omission | Build 3.2.13 |
| Add/Edit unification | Build 3.2.16 |

---

## Roadmap — Remaining Builds

| Build | Scope |
|---|---|
| 3.2.12 | Field visibility rules — property type drives which fields show |
| 3.2.13 | totalMonthly permanent fix (ISSUE 2) |
| 3.2.14 | Tap-to-contact links |
| 3.2.15 | Pet fee and auto-calculations |
| 3.2.16 | Add/Edit unification |
| 3.2.17 | UI polish |
| ViewPanel + Compare new fields | To be slotted into roadmap — discuss at next session |

---

## Key Conventions — Standing Rules

| Rule | Detail |
|---|---|
| Boolean serialization | Always `"TRUE"` / `"FALSE"` all-caps strings in every file that sends a payload |
| Build numbering | Two-digit format e.g. 3.2.11B. Hotfixes use a fourth digit e.g. 3.2.11B.1 |
| ZIP naming | `PreferredHome_Build_X_X_XX.zip` |
| README naming | `README_X.X.XX.txt` — versioned, accumulates in repo |
| Closing docs | Fixed filename, overwrite each build: `PreferredHome_Next_Steps.md`, `PreferredHome_Assistant_Briefing.md` |
| Closing doc timing | Produced only after Thomas confirms build stability. Never before. |
| Delivery | Always a ZIP with correct folder structure. No individual files. No patch instructions. |
| Commit message | Copyable code block in chat AND in README |
| Expo restart | Copyable code block in chat AND in README |
