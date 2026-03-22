# PreferredHome — Assistant Briefing
**Closing Out Build 3.2.12.2 | March 2026**

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
| Stable Baseline | Build 3.2.12.2 — confirmed stable. |
| ISSUE 2 (carried fwd) | API `totalMonthly` omits fees for some listings. Workaround: `compare.tsx` uses local `baseRent + fees`. Permanent fix: Build 3.2.13. |

---

## Build History — 3.2.12 Series

| Build | File | Status | Notes |
|---|---|---|---|
| 3.2.12 | add.tsx, edit.tsx, ViewPanel.tsx, compare.tsx | Superseded | Wrong folder structure in ZIP — app/tabs/ instead of app/(tabs)/ |
| 3.2.12.1 | add.tsx, edit.tsx, ViewPanel.tsx, compare.tsx | Superseded | Folder structure fixed. Edit screen still crashed — fetchListing invented. Option arrays wrong. Compare Clear button missing. |
| 3.2.12.2 | edit.tsx only | Confirmed stable | fetchListing replaced with getListings + find. Option arrays restored. Costs order restored. |

---

## What Is Currently Stable — Per File

| File | Stable Build | Notes |
|---|---|---|
| `app/(tabs)/add.tsx` | 3.2.12.1 | Option arrays still wrong — fix pending in 3.2.12.3 |
| `app/edit.tsx` | 3.2.12.2 | Fully correct |
| `components/ViewPanel.tsx` | 3.2.12.1 | All tests passed — stable |
| `app/(tabs)/compare.tsx` | 3.2.12.1 | Clear button missing, new rows absent from cards, label truncation — fix pending in 3.2.12.4 |

---

## Build 3.2.12.2 — What Was Delivered

| File | Change |
|---|---|
| `app/edit.tsx` | `fetchListing` (non-existent) replaced with `getListings().then(all.find by id)`. 8 option arrays restored to exact 3.2.11B values. Costs section field order restored to exact 3.2.11B sequence. |

---

## Confirmed Stable Features — 3.2.12 Series

| Feature | Status |
|---|---|
| Property Type show/hide on Add | Stable — 3.2.12.1 |
| Property Type show/hide on Edit | Stable — 3.2.12.2 |
| Property Type show/hide on ViewPanel | Stable — 3.2.12.1 |
| Property Type show/hide on Compare table | Stable — 3.2.12.1 |
| shortTermAvailable + rentersInsuranceRequired moved to Listing section (Add) | Stable — 3.2.12.1 |
| shortTermAvailable + rentersInsuranceRequired moved to Listing section (Edit) | Stable — 3.2.12.2 |
| New fields visible in ViewPanel | Stable — 3.2.12.1 |
| coolingType fix in ViewPanel | Stable — 3.2.12.1 |
| petFee gated in ViewPanel | Stable — 3.2.12.1 |

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

## Open Issues — Carried Forward

| ID | Issue | Target |
|---|---|---|
| ISSUE 2 | API `totalMonthly` omits fees for some listings. Compare screen uses local calculation as workaround. | Build 3.2.13 |

---

## Immediate Next Steps

| Build | Scope | File |
|---|---|---|
| 3.2.12.3 | Restore option arrays + Costs field order | `app/(tabs)/add.tsx` only |
| 3.2.12.4 | Restore Compare Clear button, add new rows to cards, fix label truncation | `app/(tabs)/compare.tsx` only |

---

## Roadmap — Remaining Builds (Post Hotfix Series)

| Build | Scope |
|---|---|
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
| DRIFT 8 | Never invent API functions. Read lib/api.ts before writing any import that references it. |
| DRIFT 9 | Never rewrite option arrays. Read the current file before touching any constant. |
| DRIFT 10 | Begin Build Brief and Session Confirmation Checklist required before every build — including hotfixes without exception. |

---

## Key Conventions — Standing Rules

| Rule | Detail |
|---|---|
| Boolean serialization | Always `"TRUE"` / `"FALSE"` all-caps strings in every file that sends a payload |
| Property Type casing | Apartment, Condo, Co-op, Townhouse, House — exact casing locked |
| Build numbering | Two-digit format e.g. 3.2.12. Hotfixes use a fourth digit e.g. 3.2.12.2 |
| ZIP naming | `PreferredHome_Build_X_X_XX.zip` — underscores only, no dots, prefix mandatory |
| Closing docs | Fixed filenames, overwrite each build: `PreferredHome_Next_Steps.md`, `PreferredHome_Assistant_Briefing.md` |
| Closing doc timing | Produced only after Thomas confirms build stability. Never before. |
| Delivery | Always a ZIP with correct folder structure. No individual files. No patch instructions. |
| Commit message | Copyable code block in chat AND in README |
| Expo restart | Copyable code block in chat AND in README |
